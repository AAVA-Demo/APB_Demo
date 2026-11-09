const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Transaction Filtering and Search Tests', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await transactionsPage.navigate();
  });

  test('TC-QE-8054-TS-001-TC-001: Verify date filter displays only last 30 days transactions', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('longtime-user@example.com', 'Pass@123');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    await transactionsPage.applyDateFilter('Last 30 days');
    
    const transactions = await transactionsPage.getAllTransactions();
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
    
    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
    }
  });

  test('TC-QE-8054-TS-002-TC-001: Verify validation error for future date range filter', async ({ page }) => {
    await transactionsPage.waitForTransactionsLoad();
    
    await transactionsPage.setDateRange('2025-01-01', '2025-01-31');
    
    await expect(transactionsPage.validationError).toBeVisible();
    await expect(transactionsPage.validationError).toContainText(/Invalid date range|date range in the past/);
  });

  test('TC-QE-8054-TS-003-TC-001: Verify merchant search filters transactions across all cards', async ({ page }) => {
    await transactionsPage.waitForTransactionsLoad();
    
    await transactionsPage.searchByMerchant('Amazon');
    
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions) {
      expect(txn.merchant.toLowerCase()).toContain('amazon');
      expect(txn.date).toBeTruthy();
      expect(txn.amount).toMatch(/\$[\d,]+/);
      expect(txn.card).toBeTruthy();
    }
  });
});

test.describe('Card-Wise Spend Analysis Tests', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
  });

  test('TC-QE-8056-TS-001-TC-001: Verify card details page displays spend analysis with transaction history', async ({ page }) => {
    await transactionsPage.navigateToCardDetails('card001');
    
    await expect(transactionsPage.cardDetailsPanel).toBeVisible();
    await expect(transactionsPage.transactionHistory).toBeVisible();
    await expect(transactionsPage.categoryBreakdown).toBeVisible();
    
    const categoryData = await transactionsPage.getCategoryBreakdown();
    expect(categoryData['Food & Dining']).toBeTruthy();
    expect(categoryData['Fuel']).toBeTruthy();
    expect(categoryData['Shopping']).toBeTruthy();
  });

  test('TC-QE-8056-TS-002-TC-001: Verify appropriate message for newly added card with no transactions', async ({ page }) => {
    await transactionsPage.navigateToCardDetails('new-card-001');
    
    await expect(transactionsPage.noSpendingDataMessage).toBeVisible();
    await expect(transactionsPage.noSpendingDataMessage).toContainText(/No spending data available|start using this card/);
  });

  test('TC-QE-8056-TS-003-TC-001: Verify card-wise spend analysis displays only selected card transactions', async ({ page }) => {
    await transactionsPage.navigateToCardDetails('card001');
    
    const transactions = await transactionsPage.getAllTransactions();
    
    for (const txn of transactions) {
      expect(txn.cardId).toBe('card001');
    }
    
    const otherCardTransactions = transactions.filter(txn => txn.cardId !== 'card001');
    expect(otherCardTransactions.length).toBe(0);
  });

  test('TC-QE-8048-TS-001-TC-001: Verify card selection displays spending breakdown within 500ms', async ({ page }) => {
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    const startTime = Date.now();
    await transactionsPage.selectCard('card001');
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(500);
    
    await expect(transactionsPage.spendingBreakdown).toBeVisible();
    
    const categoryBreakdown = await transactionsPage.getCategoryBreakdown();
    expect(categoryBreakdown).toBeTruthy();
  });

  test('TC-QE-8048-TS-002-TC-001: Verify no spending data message for card with no transactions', async ({ page }) => {
    await transactionsPage.selectCard('new-card-002');
    
    await expect(transactionsPage.noSpendingDataMessage).toBeVisible();
    await expect(transactionsPage.noSpendingDataMessage).toContainText('No spending data available');
  });

  test('TC-QE-8048-TS-003-TC-001: Verify card-specific spending calculations are accurate', async ({ page }) => {
    await transactionsPage.selectCard('card001');
    await expect(transactionsPage.spendingBreakdown).toBeVisible();
    
    const categoryBreakdown = await transactionsPage.getCategoryBreakdown();
    const totalSpending = await transactionsPage.getTotalSpending();
    
    let calculatedTotal = 0;
    for (const category in categoryBreakdown) {
      const amount = parseFloat(categoryBreakdown[category].replace(/[$,]/g, ''));
      calculatedTotal += amount;
    }
    
    const displayedTotal = parseFloat(totalSpending.replace(/[$,]/g, ''));
    expect(displayedTotal).toBeCloseTo(calculatedTotal, 2);
  });
});