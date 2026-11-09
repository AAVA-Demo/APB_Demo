const { test, expect } = require('@playwright/test');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

// Test Suite: Multiple Credit Card Management
test.describe('Multiple Credit Card Management', () => {
  let cardManagementPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cardManagementPage = new CardManagementPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.multiCardUser.username, testData.users.multiCardUser.password);
  });

  // Test Case: QE-9051 TS-001 TC-001
  test('TC-001: Verify user with multiple credit cards views consolidated card list with all card details', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();

    const cardCount = await cardManagementPage.getCardCount();
    expect(cardCount).toBeGreaterThan(1);

    const cardDetails = await cardManagementPage.getAllCardDetails();
    
    for (const card of cardDetails) {
      expect(card).toHaveProperty('bankName');
      expect(card).toHaveProperty('last4Digits');
      expect(card).toHaveProperty('creditLimit');
      expect(card).toHaveProperty('availableCredit');
      expect(card).toHaveProperty('outstandingBalance');
    }
  });

  // Test Case: QE-9051 TS-002 TC-001
  test('TC-002: Verify user with no credit cards receives empty state message with call-to-action', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(testData.users.noCardUser.username, testData.users.noCardUser.password);
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();

    await expect(cardManagementPage.emptyStateMessage).toBeVisible();
    await expect(cardManagementPage.emptyStateMessage).toContainText('No credit cards found');
    await expect(cardManagementPage.addCardCTA).toBeVisible();
  });

  // Test Case: QE-9051 TS-003 TC-001
  test('TC-003: Verify user receives error message with retry option when backend service is unavailable', async ({ page }) => {
    await page.route('**/api/cards', route => route.abort());
    
    await cardManagementPage.navigate();
    await page.waitForTimeout(1000);

    await expect(cardManagementPage.errorMessage).toBeVisible();
    await expect(cardManagementPage.errorMessage).toContainText('Failed to load cards');
    await expect(cardManagementPage.retryButton).toBeVisible();
  });

  // Test Case: QE-9054 TS-001 TC-001
  test('TC-004: Verify user receives detailed spending breakdown when selecting card-wise spend analysis', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();
    
    await cardManagementPage.selectCard(0);
    await cardManagementPage.clickCardWiseSpendAnalysis();
    await cardManagementPage.waitForSpendAnalysisLoad();

    await expect(cardManagementPage.transactionTotals).toBeVisible();
    await expect(cardManagementPage.categoryDistribution).toBeVisible();
    await expect(cardManagementPage.spendingPatterns).toBeVisible();
  });

  // Test Case: QE-9054 TS-002 TC-001
  test('TC-005: Verify user can view comparative spending metrics for a selected card', async ({ page }) => {
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();
    
    await cardManagementPage.selectCard(1);
    await cardManagementPage.waitForCardDetailsLoad();

    const comparativeMetrics = await cardManagementPage.getComparativeMetrics();
    
    expect(comparativeMetrics).toHaveProperty('monthlyAverage');
    expect(comparativeMetrics).toHaveProperty('highestSpendingCategory');
    expect(comparativeMetrics).toHaveProperty('transactionCount');
  });

  // Test Case: QE-9054 TS-003 TC-001
  test('TC-006: Verify user receives insufficient data message for card with no transaction history', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(testData.users.newCardUser.username, testData.users.newCardUser.password);
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardsLoad();
    
    await cardManagementPage.selectCard(0);
    await cardManagementPage.clickCardWiseSpendAnalysis();

    await expect(cardManagementPage.insufficientDataMessage).toBeVisible();
    await expect(cardManagementPage.insufficientDataMessage).toContainText('No transaction history available');
  });
});
