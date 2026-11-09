const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Card Management Tests', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
  });

  test('QE-8162-TS001-TC001: Verify complete card list displays all cards with key details', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    
    const firstCard = await cardManagementPage.getCardByIndex(0);
    await expect(firstCard.maskedNumber).toBeVisible();
    await expect(firstCard.balance).toBeVisible();
    await expect(firstCard.creditLimit).toBeVisible();
    await expect(firstCard.utilizationRate).toBeVisible();
    
    const maskedNumber = await firstCard.maskedNumber.textContent();
    expect(maskedNumber).toMatch(/\*\*\*\* \*\*\*\* \*\*\*\* \d{4}/);
  });

  test('QE-8162-TS002-TC001: Verify error message when credit card data service is down', async ({ page }) => {
    await page.route('**/api/cards/**', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });
    
    await cardManagementPage.navigate();
    await expect(cardManagementPage.errorMessage).toBeVisible();
    await expect(cardManagementPage.retryButton).toBeVisible();
    
    const errorText = await cardManagementPage.errorMessage.textContent();
    expect(errorText).toContain('Unable to load card data');
  });

  test('QE-8162-TS003-TC001: Verify system handles 10 cards efficiently', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeLessThanOrEqual(10);
    
    const startTime = Date.now();
    await cardManagementPage.selectCardByIndex(5);
    const switchTime = Date.now() - startTime;
    
    expect(switchTime).toBeLessThanOrEqual(500);
    await expect(cardManagementPage.cardDetailsPanel).toBeVisible();
  });

  test('QE-8166-TS001-TC001: Verify card-specific analysis loads within 500ms', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    const startTime = Date.now();
    await cardManagementPage.selectCardByIndex(0);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(500);
    await expect(cardManagementPage.spendingBreakdown).toBeVisible();
    await expect(cardManagementPage.transactionHistory).toBeVisible();
    await expect(cardManagementPage.utilizationMetrics).toBeVisible();
  });

  test('QE-8166-TS002-TC001: Verify card with no transaction history displays appropriate message', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.selectCardWithNoTransactions();
    
    await expect(cardManagementPage.creditLimitDisplay).toBeVisible();
    await expect(cardManagementPage.availableBalanceDisplay).toBeVisible();
    await expect(cardManagementPage.noSpendingDataMessage).toBeVisible();
    
    const message = await cardManagementPage.noSpendingDataMessage.textContent();
    expect(message).toContain('No spending data available');
  });

  test('QE-8166-TS003-TC001: Verify quick card switching maintains performance', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardListLoad();
    
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      await cardManagementPage.selectCardByIndex(i);
      const switchTime = Date.now() - startTime;
      
      expect(switchTime).toBeLessThanOrEqual(500);
      await expect(cardManagementPage.cardDetailsPanel).toBeVisible();
    }
  });

  test('QE-8157-TS001-TC001: Verify individual card detail views display comprehensive information', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.selectCardByIndex(0);
    
    await expect(cardManagementPage.creditLimitDisplay).toBeVisible();
    await expect(cardManagementPage.availableBalanceDisplay).toBeVisible();
    await expect(cardManagementPage.utilizationRateDisplay).toBeVisible();
    await expect(cardManagementPage.recentTransactionsList).toBeVisible();
    
    const utilizationRate = await cardManagementPage.getUtilizationRate();
    expect(utilizationRate).toMatch(/\d+%/);
  });

  test('QE-8158-TS001-TC001: Verify card comparison displays side-by-side metrics', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.selectCardsForComparison([0, 1]);
    await cardManagementPage.clickCompareButton();
    
    await expect(cardManagementPage.comparisonTable).toBeVisible();
    const comparisonRows = await cardManagementPage.getComparisonRows();
    expect(comparisonRows.length).toBe(2);
    
    await expect(cardManagementPage.creditLimitColumn).toBeVisible();
    await expect(cardManagementPage.utilizationRateColumn).toBeVisible();
    await expect(cardManagementPage.spendingPatternsColumn).toBeVisible();
  });

  test('QE-8158-TS002-TC001: Verify validation message for insufficient card selection', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.selectCardsForComparison([0]);
    await cardManagementPage.clickCompareButton();
    
    await expect(cardManagementPage.validationMessage).toBeVisible();
    const message = await cardManagementPage.validationMessage.textContent();
    expect(message).toContain('select at least one more card');
  });
});
