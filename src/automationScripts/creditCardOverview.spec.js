const { test, expect } = require('@playwright/test');
const { CardOverviewPage } = require('./pages/cardOverview.page');
const { Logger } = require('../utils/logger');

test.describe('Multiple Credit Cards Overview - QE-8451', () => {
  let cardOverviewPage;
  const logger = new Logger();

  test.beforeEach(async ({ page }) => {
    cardOverviewPage = new CardOverviewPage(page);
    await cardOverviewPage.navigate();
    logger.info('Navigated to card overview page');
  });

  test('QE-8451 TS-001 TC-001: Verify system retrieves and displays all registered credit cards with accurate individual card details', async () => {
    logger.info('Starting test: Multiple cards display');
    
    await cardOverviewPage.waitForCardsToLoad();
    const cards = await cardOverviewPage.getDisplayedCards();
    
    expect(cards.length).toBe(3);
    
    for (const card of cards) {
      expect(card).toHaveProperty('cardType');
      expect(card).toHaveProperty('cardNumber');
      expect(card).toHaveProperty('creditLimit');
      expect(card).toHaveProperty('availableCredit');
      expect(card).toHaveProperty('outstandingBalance');
      
      expect(card.cardNumber).toMatch(/\*{4}\d{4}/);
    }
    
    const card1 = cards.find(c => c.cardId === 'CARD1');
    expect(card1.creditLimit).toBe(10000);
    expect(card1.availableCredit).toBe(7500);
    expect(card1.outstandingBalance).toBe(2500);
    
    logger.info(`Validated ${cards.length} cards with all required fields`);
  });

  test('QE-8451 TS-002 TC-001: Verify system displays single credit card in consolidated interface without errors or layout issues', async () => {
    logger.info('Starting test: Single card handling');
    
    await cardOverviewPage.setupTestScenario({ cardCount: 1 });
    await cardOverviewPage.navigate();
    
    await cardOverviewPage.waitForCardsToLoad();
    const cards = await cardOverviewPage.getDisplayedCards();
    
    expect(cards.length).toBe(1);
    
    const card = cards[0];
    expect(card.cardType).toBeTruthy();
    expect(card.cardNumber).toBeTruthy();
    expect(card.creditLimit).toBeGreaterThan(0);
    expect(card.availableCredit).toBeGreaterThanOrEqual(0);
    expect(card.outstandingBalance).toBeGreaterThanOrEqual(0);
    
    const layoutErrors = await cardOverviewPage.checkForLayoutErrors();
    expect(layoutErrors).toBeFalsy();
    
    logger.info('Single card displayed without layout errors');
  });

  test('QE-8451 TS-003 TC-001: Verify system validates that available credit equals (credit limit minus outstanding amount) for each card', async () => {
    logger.info('Starting test: Available credit validation');
    
    await cardOverviewPage.waitForCardsToLoad();
    const cards = await cardOverviewPage.getDisplayedCards();
    
    for (const card of cards) {
      const expectedAvailableCredit = card.creditLimit - card.outstandingAmount;
      expect(card.availableCredit).toBe(expectedAvailableCredit);
    }
    
    const discrepancies = await cardOverviewPage.getDiscrepancyFlags();
    expect(discrepancies.length).toBe(0);
    
    logger.info('Available credit validation passed for all cards');
  });

  test('QE-8451 TS-003 TC-002: Verify system flags discrepancy when available credit does not equal (credit limit minus outstanding amount)', async () => {
    logger.info('Starting test: Discrepancy flagging');
    
    await cardOverviewPage.addTestCard({ 
      cardId: 'CARD_INCONSISTENT', 
      creditLimit: 10000, 
      outstandingAmount: 2500, 
      availableCredit: 8000 
    });
    await cardOverviewPage.navigate();
    
    await cardOverviewPage.waitForCardsToLoad();
    
    const warningMessage = await cardOverviewPage.getDiscrepancyWarning('CARD_INCONSISTENT');
    expect(warningMessage).toBeTruthy();
    expect(warningMessage.toLowerCase()).toContain('inconsistency');
    expect(warningMessage.toLowerCase()).toContain('available credit');
    
    logger.info(`Discrepancy warning validated: ${warningMessage}`);
  });
});
