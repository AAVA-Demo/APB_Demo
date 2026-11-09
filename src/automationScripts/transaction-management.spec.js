const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { TransactionDetailPage } = require('./pages/transaction-detail.page');
const { ApiHelper } = require('./helpers/api.helper');

/**
 * Test Suite: Transaction Management and Monitoring
 * Epic: QE-8356 - Transaction Management and Monitoring
 * Test Cases: QE-8457 TS-001 TC-001, QE-8457 TS-002 TC-001, QE-8457 TS-003 TC-001
 */

test.describe('Transaction Listing and Details', () => {
  let transactionsPage;
  let transactionDetailPage;
  let apiHelper;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    transactionDetailPage = new TransactionDetailPage(page);
    apiHelper = new ApiHelper(page);
  });

  /**
   * Test Case ID: QE-8457 TS-001 TC-001
   * Description: Verify paginated transaction list with 50 transactions per page
   */
  test('TC-001: Verify paginated transaction list displays 50 transactions per page', async ({ page }) => {
    // Step 1: Setup test user with 100+ transactions
    const testUserId = 'testuser_txlist';

    // Step 2: Request first page with page size 50
    const page1Response = await apiHelper.getTransactions(testUserId, 1, 50);
    expect(page1Response.status).toBe(200);
    const page1Data = await page1Response.json();

    // Step 3: Validate response contains exactly 50 transactions
    expect(page1Data.transactions.length).toBe(50);

    // Navigate to transactions page
    await transactionsPage.navigate();

    // Step 4: Verify each transaction has complete details
    const transactionRows = await transactionsPage.getTransactionRows();
    expect(transactionRows.length).toBe(50);

    for (const row of transactionRows) {
      await expect(row.merchantName).toBeVisible();
      await expect(row.amount).toBeVisible();
      await expect(row.transactionDate).toBeVisible();
      await expect(row.cardInfo).toBeVisible();
    }

    // Step 5: Verify pagination metadata
    expect(page1Data.totalCount).toBeGreaterThanOrEqual(100);
    expect(page1Data.totalPages).toBeGreaterThanOrEqual(2);
    await expect(transactionsPage.paginationInfo).toContainText('Showing 1-50 of');

    // Step 6: Request second page
    await transactionsPage.clickNextPage();
    const page2Response = await apiHelper.getTransactions(testUserId, 2, 50);
    const page2Data = await page2Response.json();

    // Step 7: Verify no duplicate transactions between pages
    const page1Ids = page1Data.transactions.map(tx => tx.transactionId);
    const page2Ids = page2Data.transactions.map(tx => tx.transactionId);
    const duplicates = page1Ids.filter(id => page2Ids.includes(id));
    expect(duplicates.length).toBe(0);
  });

  /**
   * Test Case ID: QE-8457 TS-002 TC-001
   * Description: Verify empty state message when user has no transaction history
   */
  test('TC-002: Verify empty state message for user with no transactions', async ({ page }) => {
    // Step 1: Setup test user with no transactions
    const testUserId = 'testuser_notxhistory';

    // Step 2: Send API request
    const response = await apiHelper.getTransactions(testUserId, 1, 50);
    expect(response.status).toBe(200);

    // Step 3: Validate empty transaction array
    const txData = await response.json();
    expect(txData.transactions.length).toBe(0);

    // Navigate to transactions page
    await transactionsPage.navigate();

    // Step 4: Verify empty state message
    await expect(transactionsPage.emptyStateMessage).toBeVisible();
    await expect(transactionsPage.emptyStateMessage).toContainText('No transactions are available');

    // Step 5: Verify pagination shows zero count
    await expect(transactionsPage.paginationInfo).toContainText('0 transactions');
  });

  /**
   * Test Case ID: QE-8457 TS-003 TC-001
   * Description: Verify transaction detail view displays complete information
   */
  test('TC-003: Verify complete transaction details including ID, category, status, and description', async ({ page }) => {
    // Step 1: Setup test transaction with complete details
    const testTransactionId = 'tx_001';
    const expectedTransaction = {
      transactionId: 'tx_001',
      merchantName: 'Amazon',
      amount: 150.00,
      category: 'Shopping',
      status: 'Completed',
      description: 'Purchase of electronics'
    };

    // Step 2: Send API request to get transaction details
    const response = await apiHelper.getTransactionById(testTransactionId);
    expect(response.status).toBe(200);
    const txData = await response.json();

    // Step 3-7: Verify all transaction details
    expect(txData.transactionId).toBe(expectedTransaction.transactionId);
    expect(txData.merchantName).toBe(expectedTransaction.merchantName);
    expect(txData.amount).toBe(expectedTransaction.amount);
    expect(txData.category).toBe(expectedTransaction.category);
    expect(txData.status).toBe(expectedTransaction.status);
    expect(txData.description).toBe(expectedTransaction.description);

    // Navigate to transaction detail page
    await transactionDetailPage.navigateToTransaction(testTransactionId);

    // Verify UI displays all details
    await expect(transactionDetailPage.transactionId).toHaveText(expectedTransaction.transactionId);
    await expect(transactionDetailPage.merchantName).toHaveText(expectedTransaction.merchantName);
    await expect(transactionDetailPage.amount).toHaveText(`$${expectedTransaction.amount.toFixed(2)}`);
    await expect(transactionDetailPage.category).toHaveText(expectedTransaction.category);
    await expect(transactionDetailPage.status).toHaveText(expectedTransaction.status);
    await expect(transactionDetailPage.description).toHaveText(expectedTransaction.description);
  });
});