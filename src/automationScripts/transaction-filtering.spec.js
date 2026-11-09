const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { ApiHelper } = require('./helpers/api.helper');

/**
 * Test Suite: Transaction Search and Filtering
 * Epic: QE-8356 - Transaction Management and Monitoring
 * Test Cases: QE-8459 TS-001 TC-001, QE-8459 TS-002 TC-001, QE-8459 TS-003 TC-001
 */

test.describe('Transaction Search and Filtering', () => {
  let transactionsPage;
  let apiHelper;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    apiHelper = new ApiHelper(page);
  });

  /**
   * Test Case ID: QE-8459 TS-001 TC-001
   * Description: Verify date range filter returns transactions within range with response time under 1 second
   */
  test('TC-001: Verify valid date range filter returns transactions within 1 second', async ({ page }) => {
    // Step 1: Setup test user with 60 days of transactions
    const testUserId = 'testuser_datefilter';

    // Step 2: Calculate date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Step 3 & 4: Send API request and measure response time
    const startTime = Date.now();
    const response = await apiHelper.getTransactionsWithDateFilter(testUserId, startDateStr, endDateStr);
    const responseTime = Date.now() - startTime;

    // Verify response time is under 1 second
    expect(responseTime).toBeLessThan(1000);
    expect(response.status).toBe(200);

    // Step 5 & 6: Validate all transactions are within date range
    const txData = await response.json();
    for (const transaction of txData.transactions) {
      const txDate = new Date(transaction.transactionDate);
      expect(txDate >= startDate && txDate <= endDate).toBeTruthy();
    }

    // Verify on UI
    await transactionsPage.navigate();
    await transactionsPage.setDateRangeFilter(startDateStr, endDateStr);
    await transactionsPage.clickApplyFilters();

    const displayedTransactions = await transactionsPage.getTransactionRows();
    for (const row of displayedTransactions) {
      const dateText = await row.transactionDate.textContent();
      const txDate = new Date(dateText);
      expect(txDate >= startDate && txDate <= endDate).toBeTruthy();
    }
  });

  /**
   * Test Case ID: QE-8459 TS-002 TC-001
   * Description: Verify validation error when start date is after end date
   */
  test('TC-002: Verify validation error for invalid date range (start after end)', async ({ page }) => {
    // Step 1: Prepare invalid date range
    const startDate = '2023-12-10';
    const endDate = '2023-11-10';

    // Step 2: Send API request with invalid date range
    const response = await apiHelper.getTransactionsWithDateFilter('testuser', startDate, endDate);

    // Step 3: Validate error response
    expect(response.status).toBe(400);

    // Step 4: Verify error message
    const errorData = await response.json();
    expect(errorData.error.message).toContain('Invalid date range');

    // Step 5: Verify no transaction data returned
    expect(errorData.transactions).toBeUndefined();

    // Verify on UI
    await transactionsPage.navigate();
    await transactionsPage.setDateRangeFilter(startDate, endDate);
    await transactionsPage.clickApplyFilters();

    await expect(transactionsPage.errorMessage).toBeVisible();
    await expect(transactionsPage.errorMessage).toContainText('Invalid date range');
  });

  /**
   * Test Case ID: QE-8459 TS-003 TC-001
   * Description: Verify filtering by non-existent card ID returns empty list with message
   */
  test('TC-003: Verify empty result with message for non-existent card ID filter', async ({ page }) => {
    // Step 1: Identify non-existent card ID
    const nonExistentCardId = 'card_nonexistent_999';

    // Step 2: Send API request with non-existent card filter
    const response = await apiHelper.getTransactionsByCardId('testuser', nonExistentCardId);
    expect(response.status).toBe(200);

    // Step 3: Validate empty transaction array
    const txData = await response.json();
    expect(txData.transactions.length).toBe(0);

    // Step 4: Verify message indicating no transactions found
    expect(txData.message).toBe('No transactions found for the specified card');

    // Step 5: Verify total count is 0
    expect(txData.totalCount).toBe(0);

    // Verify on UI
    await transactionsPage.navigate();
    await transactionsPage.setCardIdFilter(nonExistentCardId);
    await transactionsPage.clickApplyFilters();

    await expect(transactionsPage.emptyStateMessage).toBeVisible();
    await expect(transactionsPage.emptyStateMessage).toContainText('No transactions found for the specified card');
    await expect(transactionsPage.paginationInfo).toContainText('0 transactions');
  });
});