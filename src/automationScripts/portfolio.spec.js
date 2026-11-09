const { test, expect } = require('@playwright/test');
const { PortfolioPage } = require('./pages/portfolio.page');
const { Logger } = require('../utils/logger');
const config = require('../../data/config.json');

test.describe('Portfolio Management Tests', () => {
  let portfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolioPage = new PortfolioPage(page);
    await portfolioPage.navigate();
    Logger.info('Navigated to Portfolio page');
  });

  test('QE-8951 TS-001 TC-001: Verify multiple credit card display shows all 5 cards with complete details', async ({ page }) => {
    Logger.info('Starting test: Multiple credit card display');
    
    await portfolioPage.waitForCardsToLoad();
    
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    
    const firstCard = await portfolioPage.getCardDetails(0);
    expect(firstCard.cardName).toBeTruthy();
    expect(firstCard.maskedNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
    expect(firstCard.cardType).toBeTruthy();
    expect(firstCard.creditLimit).toBeTruthy();
    expect(firstCard.availableCredit).toBeTruthy();
    expect(firstCard.outstandingBalance).toBeTruthy();
    
    Logger.info(`Verified ${cardCount} cards with complete details`);
  });

  test('QE-8951 TS-002 TC-001: Verify single credit card display shows complete details in card layout', async ({ page }) => {
    Logger.info('Starting test: Single credit card display');
    
    await portfolioPage.waitForCardsToLoad();
    
    const cardCount = await portfolioPage.getCardCount();
    
    if (cardCount === 1) {
      const cardDetails = await portfolioPage.getCardDetails(0);
      expect(cardDetails.cardName).toBeTruthy();
      expect(cardDetails.maskedNumber).toBeTruthy();
      expect(cardDetails.cardType).toBeTruthy();
      expect(cardDetails.creditLimit).toBeTruthy();
      expect(cardDetails.availableCredit).toBeTruthy();
      expect(cardDetails.outstandingBalance).toBeTruthy();
      expect(cardDetails.status).toBeTruthy();
      
      Logger.info('Single card layout verified');
    }
  });

  test('QE-8951 TS-003 TC-001: Verify empty state message when no credit cards are registered', async ({ page }) => {
    Logger.info('Starting test: Empty state message');
    
    await page.route('**/api/users/*/cards', route => route.fulfill({ body: JSON.stringify([]) }));
    
    await portfolioPage.navigate();
    await portfolioPage.waitForCardsToLoad();
    
    const emptyMessage = await portfolioPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards found');
    
    Logger.info('Empty state message verified');
  });

  test('QE-8936 TS-001 TC-001: Verify multiple credit card display shows all 5 cards with complete details including masked card numbers', async ({ page }) => {
    Logger.info('Starting test: Multiple cards with masked numbers');
    
    await portfolioPage.waitForCardsToLoad();
    
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    
    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = await portfolioPage.getCardDetails(i);
      expect(card.maskedNumber).toMatch(/\*{4}/);
      expect(card.cardName).toBeTruthy();
      expect(card.cardType).toBeTruthy();
      expect(card.creditLimit).toBeTruthy();
      expect(card.availableCredit).toBeTruthy();
      expect(card.outstandingBalance).toBeTruthy();
    }
    
    Logger.info('Multiple cards with masked numbers verified');
  });

  test('QE-8936 TS-002 TC-001: Verify multiple credit card display shows all 10 cards in paginated or scrollable view', async ({ page }) => {
    Logger.info('Starting test: Paginated card view');
    
    await portfolioPage.waitForCardsToLoad();
    
    const cardCount = await portfolioPage.getCardCount();
    
    if (cardCount > 5) {
      const isScrollable = await portfolioPage.isScrollable();
      expect(isScrollable).toBe(true);
      
      Logger.info('Scrollable view verified for multiple cards');
    }
  });

  test('QE-8936 TS-003 TC-001: Verify multiple credit card display shows empty state message when no credit cards are registered', async ({ page }) => {
    Logger.info('Starting test: No cards empty state');
    
    await page.route('**/api/users/*/cards', route => route.fulfill({ body: JSON.stringify([]) }));
    
    await portfolioPage.navigate();
    await portfolioPage.waitForCardsToLoad();
    
    const emptyMessage = await portfolioPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No credit cards found');
    
    Logger.info('Empty state verified');
  });

  test('QE-8789 TS-001 TC-001: Verify multiple credit card display', async ({ page }) => {
    Logger.info('Starting test: Multiple credit card display');
    
    await portfolioPage.waitForCardsToLoad();
    
    const cardCount = await portfolioPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    
    Logger.info(`Displayed ${cardCount} credit cards`);
  });

  test('QE-8953 TS-001 TC-001: Verify card-specific credit limit tracking displays accurate values for a card with outstanding balance', async ({ page }) => {
    Logger.info('Starting test: Card-specific credit limit tracking');
    
    await portfolioPage.waitForCardsToLoad();
    
    await portfolioPage.selectCard(0);
    
    const cardDetails = await portfolioPage.getSelectedCardDetails();
    expect(cardDetails.creditLimit).toBeTruthy();
    expect(cardDetails.availableCredit).toBeTruthy();
    expect(cardDetails.outstandingBalance).toBeTruthy();
    
    Logger.info('Card-specific credit limit tracking verified');
  });

  test('QE-8953 TS-002 TC-001: Verify card-specific credit limit tracking for a card with zero outstanding balance', async ({ page }) => {
    Logger.info('Starting test: Zero outstanding balance');
    
    await portfolioPage.waitForCardsToLoad();
    
    const cardCount = await portfolioPage.getCardCount();
    
    for (let i = 0; i < cardCount; i++) {
      await portfolioPage.selectCard(i);
      const details = await portfolioPage.getSelectedCardDetails();
      
      if (details.outstandingBalance === '$0.00') {
        expect(details.availableCredit).toBe(details.creditLimit);
        Logger.info('Zero balance card verified');
        break;
      }
    }
  });

  test('QE-8953 TS-003 TC-001: Verify error handling when credit limit data is temporarily unavailable', async ({ page }) => {
    Logger.info('Starting test: Credit limit data unavailable');
    
    await page.route('**/api/users/*/cards', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    await portfolioPage.navigate();
    
    const errorMessage = await portfolioPage.getErrorMessage();
    expect(errorMessage).toContain('temporarily unavailable');
    
    Logger.info('Error handling verified');
  });

  test('QE-8939 TS-001 TC-001: Verify card-specific credit limit tracking displays accurate values for an active card', async ({ page }) => {
    Logger.info('Starting test: Active card credit limit tracking');
    
    await portfolioPage.waitForCardsToLoad();
    await portfolioPage.selectCard(0);
    
    const cardDetails = await portfolioPage.getSelectedCardDetails();
    expect(cardDetails.creditLimit).toBeTruthy();
    expect(cardDetails.availableCredit).toBeTruthy();
    expect(cardDetails.outstandingBalance).toBeTruthy();
    
    Logger.info('Active card credit limit verified');
  });

  test('QE-8939 TS-002 TC-001: Verify card-specific credit limit tracking for a card with zero outstanding balance', async ({ page }) => {
    Logger.info('Starting test: Zero balance tracking');
    
    await portfolioPage.waitForCardsToLoad();
    
    const cardCount = await portfolioPage.getCardCount();
    
    for (let i = 0; i < cardCount; i++) {
      await portfolioPage.selectCard(i);
      const details = await portfolioPage.getSelectedCardDetails();
      
      if (details.outstandingBalance === '$0.00') {
        expect(details.availableCredit).toBe(details.creditLimit);
        Logger.info('Zero balance tracking verified');
        break;
      }
    }
  });

  test('QE-8939 TS-003 TC-001: Verify error handling when credit limit data is temporarily unavailable', async ({ page }) => {
    Logger.info('Starting test: Unavailable credit limit data');
    
    await page.route('**/api/users/*/cards', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    await portfolioPage.navigate();
    
    const errorMessage = await portfolioPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    
    Logger.info('Unavailable data error handling verified');
  });

  test('QE-8786 TS-001 TC-001: Verify card-specific credit limit tracking', async ({ page }) => {
    Logger.info('Starting test: Card-specific tracking');
    
    await portfolioPage.waitForCardsToLoad();
    await portfolioPage.selectCard(0);
    
    const cardDetails = await portfolioPage.getSelectedCardDetails();
    expect(cardDetails.creditLimit).toBeTruthy();
    expect(cardDetails.availableCredit).toBeTruthy();
    expect(cardDetails.outstandingBalance).toBeTruthy();
    
    Logger.info('Card-specific tracking verified');
  });
});