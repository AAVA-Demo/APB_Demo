const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Transaction Management Tests', () => {
  let loginPage;
  let transactionPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
  });

  test('QE-8468 TS-001 TC-001 - Verify user with multiple credit cards can view paginated transaction list', async ({ page }) => {
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionListLoad();
    await expect(transactionPage.transactionList).toBeVisible();
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    await expect(transactionPage.paginationControls).toBeVisible();
  });

  test('QE-8468 TS-002 TC-001 - Verify appropriate empty state message when no transactions exist', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('notransactions@example.com', 'Test@1234');
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionListLoad();
    await expect(transactionPage.emptyStateMessage).toBeVisible();
    await expect(transactionPage.emptyStateMessage).toContainText('No transactions');
  });

  test('QE-8470 TS-001 TC-001 - Verify date range filter returns results within 1 second for last 30 days', async ({ page }) => {
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionListLoad();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    const filterStartTime = Date.now();
    await transactionPage.applyDateRangeFilter(startDate, endDate);
    const filterTime = Date.now() - filterStartTime;
    expect(filterTime).toBeLessThan(1000);
    await transactionPage.waitForTransactionListLoad();
    const filteredCount = await transactionPage.getTransactionCount();
    expect(filteredCount).toBeGreaterThanOrEqual(0);
  });

  test('QE-8470 TS-002 TC-001 - Verify validation error when start date is after end date', async ({ page }) => {
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionListLoad();
    const startDate = new Date('2024-12-01');
    const endDate = new Date('2024-11-01');
    await transactionPage.applyDateRangeFilter(startDate, endDate);
    await expect(transactionPage.validationErrorMessage).toBeVisible();
    await expect(transactionPage.validationErrorMessage).toContainText('Start date cannot be after end date');
  });

  test('QE-8470 TS-003 TC-001 - Verify merchant name filter returns accurate matching transactions', async ({ page }) => {
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionListLoad();
    await transactionPage.applyMerchantFilter('Amazon');
    await transactionPage.waitForTransactionListLoad();
    const transactions = await transactionPage.getAllTransactionMerchants();
    transactions.forEach(merchant => {
      expect(merchant).toContain('Amazon');
    });
  });

  test('QE-8483 TS-003 TC-001 - Verify transactions are sorted by date in descending order', async ({ page }) => {
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionListLoad();
    const transactionDates = await transactionPage.getAllTransactionDates();
    for (let i = 0; i < transactionDates.length - 1; i++) {
      const currentDate = new Date(transactionDates[i]);
      const nextDate = new Date(transactionDates[i + 1]);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  });
});
