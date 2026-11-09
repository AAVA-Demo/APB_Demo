const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { logger } = require('../utils/logger');

test.describe('Card Management Tests', () => {
  let cardPage;

  test.beforeEach(async ({ page }) => {
    cardPage = new CardManagementPage(page);
    await cardPage.navigate();
    logger.info('Navigated to Card Management');
  });

  test('QE-8246 TS001 TC-001: Verify comprehensive card details are displayed', async ({ page }) => {
    logger.info('Test: Verify comprehensive card details');
    
    await cardPage.selectCard('Card-1234');
    
    await expect(cardPage.cardDetailView).toBeVisible();
    
    const cardDetails = await cardPage.getCardDetails();
    expect(cardDetails.spending).toBeDefined();
    expect(cardDetails.creditLimit).toBeDefined();
    expect(cardDetails.availableCredit).toBeDefined();
    expect(cardDetails.outstandingAmount).toBeDefined();
    
    // Verify currency formatting
    expect(cardDetails.creditLimit).toMatch(/\$[0-9,]+\.\d{2}/);
    
    logger.info('Comprehensive card details verified successfully');
  });

  test('QE-8245 TS001 TC-001: Verify fast card navigation loads within 500ms', async ({ page }) => {
    logger.info('Test: Verify fast card navigation');
    
    const startTime = Date.now();
    await cardPage.selectCard('Card-1234');
    await expect(cardPage.cardDetailView).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(500);
    logger.info(`Card details loaded in ${loadTime}ms`);
    
    const creditLimit = await cardPage.getCreditLimit();
    expect(creditLimit).toBeDefined();
    
    logger.info('Fast card navigation verified successfully');
  });

  test('QE-8237 TS001 TC-001: Verify multi-card selection updates within 500ms', async ({ page }) => {
    logger.info('Test: Verify multi-card selection');
    
    const startTime = Date.now();
    await cardPage.selectCard('Card-5678');
    await expect(cardPage.cardDetailView).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(500);
    logger.info(`Card selection updated in ${loadTime}ms`);
    
    const cardDetails = await cardPage.getCardDetails();
    expect(cardDetails.spending).toBeDefined();
    expect(cardDetails.creditLimit).toBeDefined();
    expect(cardDetails.availableCredit).toBeDefined();
    
    logger.info('Multi-card selection verified successfully');
  });

  test('QE-8237 TS002 TC-001: Verify rapid card switching maintains data consistency', async ({ page }) => {
    logger.info('Test: Verify rapid card switching');
    
    const cards = ['Card-1234', 'Card-5678', 'Card-9012', 'Card-3456'];
    
    for (const cardId of cards) {
      const startTime = Date.now();
      await cardPage.selectCard(cardId);
      await expect(cardPage.cardDetailView).toBeVisible();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(500);
      
      const displayedCardId = await cardPage.getDisplayedCardId();
      expect(displayedCardId).toBe(cardId);
      
      logger.info(`Card ${cardId} loaded in ${loadTime}ms with correct data`);
    }
    
    logger.info('Rapid card switching verified successfully');
  });

  test('QE-8244 TS001 TC-001: Verify card comparison identifies highest usage', async ({ page }) => {
    logger.info('Test: Verify card comparison');
    
    await cardPage.navigateToCardComparison();
    
    await expect(cardPage.comparisonChart).toBeVisible();
    
    const highestUsageCard = await cardPage.getHighestUsageCard();
    expect(highestUsageCard).toBeDefined();
    
    await expect(cardPage.highlightedCard).toBeVisible();
    
    logger.info(`Highest usage card: ${highestUsageCard}`);
    logger.info('Card comparison verified successfully');
  });
});