const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Transaction Management and Monitoring', () => {
  let transactionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    await loginPage.navigate();
    await loginPage.login('user123', 'password123');
    await transactionPage.navigate();
  });

  test('QE-9460 TS-001 TC-001 - Verify paginated transaction history display', async ({ page }) => {
    await expect(transactionPage.transactionList).toBeVisible({ timeout: 3000 });

    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);

    const firstTransaction = await transactionPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.cardName).toBeTruthy();
    expect(firstTransaction.status).toBeTruthy();

    await expect(transactionPage.paginationControls).toBeVisible();

    await transactionPage.goToPage(2);
    await expect(transactionPage.transactionList).toBeVisible();
  });

  test('QE-9460 TS-002 TC-001 - Verify error handling when backend service is unavailable', async ({ page }) => {
    await page.route('**/api/transactions**', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.reload();
    await expect(transactionPage.errorMessage).toBeVisible();
    const errorText = await transactionPage.getErrorMessage();
    expect(errorText).toContain('Failed to load transactions');

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('QE-9460 TS-003 TC-001 - Verify empty state display for user with no transactions', async ({ page }) => {
    await page.route('**/api/transactions**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          transactions: [],
          pagination: { currentPage: 1, pageSize: 20, totalRecords: 0, totalPages: 0 }
        })
      });
    });

    await page.reload();
    await expect(transactionPage.emptyStateMessage).toBeVisible();
    const emptyMessage = await transactionPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No transactions found');

    await expect(transactionPage.paginationControls).not.toBeVisible();
  });

  test('QE-9464 TS-001 TC-001 - Verify filtering transactions by card and date range', async ({ page }) => {
    await transactionPage.selectCardFilter('card001');
    await transactionPage.setDateRange('2024-11-01', '2024-11-15');
    await transactionPage.applyFilters();

    await expect(transactionPage.transactionList).toBeVisible();

    const transactions = await transactionPage.getAllTransactions();
    for (const txn of transactions) {
      expect(txn.cardId).toBe('card001');
      const txnDate = new Date(txn.date);
      expect(txnDate >= new Date('2024-11-01')).toBeTruthy();
      expect(txnDate <= new Date('2024-11-15')).toBeTruthy();
    }

    const paginationInfo = await transactionPage.getPaginationInfo();
    expect(paginationInfo.totalRecords).toBeGreaterThan(0);
  });

  test('QE-9464 TS-002 TC-001 - Verify case-insensitive search by merchant name', async ({ page }) => {
    await transactionPage.searchTransactions('starbucks');

    await expect(transactionPage.transactionList).toBeVisible();

    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);

    for (const txn of transactions) {
      const merchantLower = txn.merchant.toLowerCase();
      expect(merchantLower).toContain('starbucks');
    }
  });

  test('QE-9464 TS-002 TC-002 - Verify search by transaction description keyword', async ({ page }) => {
    await transactionPage.searchTransactions('coffee');

    await expect(transactionPage.transactionList).toBeVisible();

    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);

    for (const txn of transactions) {
      const merchantLower = txn.merchant.toLowerCase();
      const descriptionLower = txn.description.toLowerCase();
      const matchesMerchant = merchantLower.includes('coffee');
      const matchesDescription = descriptionLower.includes('coffee');
      expect(matchesMerchant || matchesDescription).toBeTruthy();
    }
  });

  test('QE-9464 TS-003 TC-001 - Verify handling of zero results from combined filters', async ({ page }) => {
    await transactionPage.selectCardFilter('card001');
    await transactionPage.setDateRange('2020-01-01', '2020-01-31');
    await transactionPage.searchTransactions('nonexistentmerchant');
    await transactionPage.applyFilters();

    await expect(transactionPage.emptyStateMessage).toBeVisible();
    const emptyMessage = await transactionPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No transactions found');

    await expect(transactionPage.clearFiltersButton).toBeVisible();
    await transactionPage.clearFilters();

    await expect(transactionPage.transactionList).toBeVisible();
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
  });
});
