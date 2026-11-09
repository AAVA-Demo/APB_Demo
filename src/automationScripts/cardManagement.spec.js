const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Management - Multi-Card and Comparison Tests', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser_multicard', 'Test@123');
    await cardManagementPage.navigate();
    logger.info('Navigated to card management page');
  });

  test('QE-8162-TS001-TC001: Verify multiple credit card display shows all cards with key details', async ({ page }) => {
    logger.info('Starting test: QE-8162-TS001-TC001');
    await cardManagementPage.waitForCardListLoad();
    const cards = await cardManagementPage.getAllCards();
    logger.info(`Cards displayed: ${cards.length}`);
    expect(cards.length).toBe(3);
    cards.forEach(card => {
      expect(card.maskedNumber).toMatch(/\*{4} \*{4} \*{4} \d{4}/);
      expect(card.balance).toBeDefined();
      expect(card.limit).toBeDefined();
      expect(card.utilization).toBeDefined();
    });
    logger.info('All cards displayed with key details');
  });

  test('QE-8162-TS002-TC001: Verify error handling when credit card data service is down', async ({ page, context }) => {
    logger.info('Starting test: QE-8162-TS002-TC001');
    await context.route('**/api/cards', route => route.abort());
    await page.reload();
    await expect(cardManagementPage.errorMessage).toBeVisible();
    const errorText = await cardManagementPage.getErrorMessageText();
    logger.info(`Error message: ${errorText}`);
    expect(errorText).toContain('Unable to load card data');
    await expect(cardManagementPage.retryButton).toBeVisible();
    logger.info('Error handling working correctly');
  });

  test('QE-8162-TS003-TC001: Verify system handles 10 credit cards without performance degradation', async ({ page }) => {
    logger.info('Starting test: QE-8162-TS003-TC001');
    await loginPage.logout();
    await loginPage.login('testuser_10cards', 'Test@123');
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    const cards = await cardManagementPage.getAllCards();
    logger.info(`Cards displayed: ${cards.length}`);
    expect(cards.length).toBe(10);
    const startTime = Date.now();
    await cardManagementPage.selectCard(0);
    const switchTime = Date.now() - startTime;
    logger.info(`Card switch time: ${switchTime}ms`);
    expect(switchTime).toBeLessThan(500);
    logger.info('System handles 10 cards efficiently');
  });

  test('QE-8166-TS001-TC001: Verify card-specific analysis loads within 500ms', async ({ page }) => {
    logger.info('Starting test: QE-8166-TS001-TC001');
    await cardManagementPage.waitForCardListLoad();
    const startTime = Date.now();
    await cardManagementPage.selectCardByLastFourDigits('9012');
    const loadTime = Date.now() - startTime;
    logger.info(`Analysis load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(500);
    await expect(cardManagementPage.cardAnalysisView).toBeVisible();
    const analysis = await cardManagementPage.getCardAnalysis();
    expect(analysis.categorySpending).toBeDefined();
    expect(analysis.transactionHistory).toBeDefined();
    expect(analysis.utilization).toBeDefined();
    logger.info('Card analysis loaded within 500ms');
  });

  test('QE-8166-TS002-TC001: Verify card with no transaction history displays financial metrics only', async ({ page }) => {
    logger.info('Starting test: QE-8166-TS002-TC001');
    await cardManagementPage.selectNewCard();
    await expect(cardManagementPage.cardAnalysisView).toBeVisible();
    const metrics = await cardManagementPage.getFinancialMetrics();
    logger.info(`Metrics: ${JSON.stringify(metrics)}`);
    expect(metrics.limit).toBe(50000);
    expect(metrics.available).toBe(50000);
    expect(metrics.utilization).toBe(0);
    await expect(cardManagementPage.noDataMessage).toBeVisible();
    const message = await cardManagementPage.getNoDataMessageText();
    expect(message).toContain('No spending data available');
    logger.info('New card displays metrics with no-data message');
  });

  test('QE-8166-TS003-TC001: Verify quick card switching maintains 500ms performance', async ({ page }) => {
    logger.info('Starting test: QE-8166-TS003-TC001');
    await cardManagementPage.waitForCardListLoad();
    const cards = ['9012', '9903', '0005'];
    for (const card of cards) {
      const startTime = Date.now();
      await cardManagementPage.selectCardByLastFourDigits(card);
      const switchTime = Date.now() - startTime;
      logger.info(`Switch to ${card}: ${switchTime}ms`);
      expect(switchTime).toBeLessThan(500);
    }
    logger.info('All card switches completed within 500ms');
  });

  test('QE-8158-TS001-TC001: Verify card comparison displays side-by-side comparison for selected cards', async ({ page }) => {
    logger.info('Starting test: QE-8158-TS001-TC001');
    await cardManagementPage.waitForCardListLoad();
    await cardManagementPage.selectCardsForComparison(['9012', '9903']);
    await cardManagementPage.clickCompareButton();
    await expect(cardManagementPage.comparisonView).toBeVisible();
    const comparison = await cardManagementPage.getComparisonData();
    logger.info(`Comparison data: ${JSON.stringify(comparison)}`);
    expect(comparison.length).toBe(2);
    comparison.forEach(card => {
      expect(card.limit).toBeDefined();
      expect(card.utilization).toBeDefined();
      expect(card.spending).toBeDefined();
    });
    logger.info('Card comparison displayed correctly');
  });

  test('QE-8158-TS002-TC001: Verify validation message when only one card is selected for comparison', async ({ page }) => {
    logger.info('Starting test: QE-8158-TS002-TC001');
    await cardManagementPage.waitForCardListLoad();
    await cardManagementPage.selectCardsForComparison(['9012']);
    await cardManagementPage.clickCompareButton();
    await expect(cardManagementPage.validationMessage).toBeVisible();
    const message = await cardManagementPage.getValidationMessageText();
    logger.info(`Validation message: ${message}`);
    expect(message).toContain('at least one more card');
  });

  test('QE-8158-TS003-TC001: Verify comparison view scales for three or more cards', async ({ page }) => {
    logger.info('Starting test: QE-8158-TS003-TC001');
    await loginPage.logout();
    await loginPage.login('testuser_4cards', 'Test@123');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCardsForComparison(['9012', '9903', '0005']);
    await cardManagementPage.clickCompareButton();
    await expect(cardManagementPage.comparisonView).toBeVisible();
    const comparison = await cardManagementPage.getComparisonData();
    logger.info(`Comparison cards: ${comparison.length}`);
    expect(comparison.length).toBe(3);
    logger.info('Comparison view scales for multiple cards');
  });

  test('QE-8157-TS001-TC001: Verify individual card details display comprehensive information with proper formatting', async ({ page }) => {
    logger.info('Starting test: QE-8157-TS001-TC001');
    await cardManagementPage.selectCardByLastFourDigits('9012');
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    const details = await cardManagementPage.getCardDetails();
    logger.info(`Card details: ${JSON.stringify(details)}`);
    expect(details.limit).toBe(50000);
    expect(details.available).toBe(35000);
    expect(details.utilization).toBe(30);
    expect(details.recentTransactions.length).toBeGreaterThan(0);
    logger.info('Card details displayed with proper formatting');
  });

  test('QE-8157-TS002-TC001: Verify card details display when transaction service is temporarily down', async ({ page, context }) => {
    logger.info('Starting test: QE-8157-TS002-TC001');
    await context.route('**/api/transactions/**', route => route.abort());
    await cardManagementPage.selectCardByLastFourDigits('9012');
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    const metrics = await cardManagementPage.getFinancialMetrics();
    expect(metrics.limit).toBeDefined();
    expect(metrics.available).toBeDefined();
    expect(metrics.utilization).toBeDefined();
    await expect(cardManagementPage.transactionErrorMessage).toBeVisible();
    const errorText = await cardManagementPage.getTransactionErrorText();
    expect(errorText).toContain('Unable to load transaction history');
    logger.info('Card details display with transaction error');
  });

  test('QE-8157-TS003-TC001: Verify utilization rate calculation and visual indicator', async ({ page }) => {
    logger.info('Starting test: QE-8157-TS003-TC001');
    await cardManagementPage.selectHighUtilizationCard();
    await expect(cardManagementPage.cardDetailView).toBeVisible();
    const utilization = await cardManagementPage.getUtilizationRate();
    logger.info(`Utilization rate: ${utilization}%`);
    expect(utilization).toBe(80);
    await expect(cardManagementPage.highUtilizationIndicator).toBeVisible();
    const indicatorColor = await cardManagementPage.getUtilizationIndicatorColor();
    logger.info(`Indicator color: ${indicatorColor}`);
    expect(indicatorColor).toBe('red');
    logger.info('Utilization calculation and visual indicator correct');
  });
});
