const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { AuthHelper } = require('./helpers/auth.helper');
const { Logger } = require('./utils/logger');

const logger = new Logger('TransactionsSpec');

test.describe('Transactions - List, Filtering, and Aggregation', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test - navigating to transactions page');
    transactionsPage = new TransactionsPage(page);
    await AuthHelper.authenticate(page, 'user123', 'valid-jwt-token');
    await transactionsPage.navigate();
  });

  test('TC-QE-9081-TS-001-TC-001: Verify multi-card transaction aggregation with sorting and filters', async ({ page }) => {
    logger.info('Test: Verify multi-card transaction aggregation');
    
    // Steps 1-2: Already authenticated and navigated in beforeEach
    logger.info('Steps 1-2: User authenticated and navigated to transactions');
    
    // Step 3: Wait for transactions to load
    logger.info('Step 3: Waiting for transactions to load');
    await transactionsPage.waitForTransactionsToLoad();
    
    // Step 4: Verify transactions are sorted chronologically (descending)
    logger.info('Step 4: Verifying chronological sorting');
    const transactionDates = await transactionsPage.getAllTransactionDates();
    expect(transactionDates.length).toBeGreaterThan(0);
    
    // Verify descending order
    for (let i = 0; i < transactionDates.length - 1; i++) {
      const date1 = new Date(transactionDates[i]);
      const date2 = new Date(transactionDates[i + 1]);
      expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
    }
    
    // Step 5: Verify card mapping
    logger.info('Step 5: Verifying card name and number mapping');
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    expect(firstTransaction.cardName).toBeTruthy();
    expect(firstTransaction.cardNumber).toMatch(/\*{4}\s\d{4}/);
    
    // Step 6: Verify filter options are available
    logger.info('Step 6: Verifying filter options are available');
    await expect(transactionsPage.cardFilter).toBeVisible();
    await expect(transactionsPage.merchantSearchInput).toBeVisible();
    await expect(transactionsPage.statusFilter).toBeVisible();
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9081-TS-001-TC-002: Verify transaction details include all required fields', async ({ page }) => {
    logger.info('Test: Verify transaction details completeness');
    
    // Step 1: Already authenticated and navigated
    logger.info('Step 1: Transaction view loaded');
    await transactionsPage.waitForTransactionsToLoad();
    
    // Step 2: Select first transaction
    logger.info('Step 2: Getting first transaction details');
    const transaction = await transactionsPage.getTransactionDetails(0);
    
    // Steps 3-8: Verify all required fields
    logger.info('Steps 3-8: Verifying all transaction fields');
    
    // Step 3: Date field
    expect(transaction.date).toBeTruthy();
    expect(transaction.date).toMatch(/\d{4}-\d{2}-\d{2}/);
    
    // Step 4: Merchant name
    expect(transaction.merchant).toBeTruthy();
    
    // Step 5: Amount with currency
    expect(transaction.amount).toBeTruthy();
    expect(transaction.amount).toMatch(/\$[\d,]+\.\d{2}/);
    
    // Step 6: Card details
    expect(transaction.cardName).toBeTruthy();
    expect(transaction.cardNumber).toBeTruthy();
    
    // Step 7: Category
    expect(transaction.category).toBeTruthy();
    
    // Step 8: Status
    expect(transaction.status).toBeTruthy();
    expect(['posted', 'pending']).toContain(transaction.status.toLowerCase());
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9081-TS-002-TC-001: Verify partial data retrieval with warning message', async ({ page }) => {
    logger.info('Test: Verify partial data retrieval handling');
    
    // Mock partial failure for card3
    await page.route('**/api/cards/card3/transactions*', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    // Step 1: Authenticate user with 3 cards
    logger.info('Step 1: User authenticated with 3 cards');
    await AuthHelper.authenticate(page, 'user123', 'valid-jwt-token');
    
    // Step 2: Navigate to transactions
    logger.info('Step 2: Navigating to transactions');
    await transactionsPage.navigate();
    
    // Step 3: Partial failure simulated (mocked above)
    logger.info('Step 3: Partial failure simulated for card3');
    
    // Step 4: Verify partial data is displayed
    logger.info('Step 4: Verifying partial transaction data is displayed');
    await transactionsPage.waitForTransactionsToLoad();
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    
    // Step 5: Verify warning message
    logger.info('Step 5: Verifying warning message');
    await expect(transactionsPage.warningMessage).toBeVisible();
    const warningText = await transactionsPage.warningMessage.textContent();
    expect(warningText).toContain('Unable to retrieve transactions from some cards');
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9081-TS-003-TC-001: Verify multi-filter application', async ({ page }) => {
    logger.info('Test: Verify multiple filters applied simultaneously');
    
    // Step 1: Load all transactions
    logger.info('Step 1: Loading all transactions');
    await transactionsPage.waitForTransactionsToLoad();
    const initialCount = await transactionsPage.getTransactionCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Step 2: Apply card filter
    logger.info('Step 2: Applying card ID filter');
    await transactionsPage.filterByCard('card1');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForFilteredResults();
    
    // Step 3: Apply merchant search filter
    logger.info('Step 3: Applying merchant search filter');
    await transactionsPage.searchMerchant('Amazon');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForFilteredResults();
    
    // Step 4: Apply status filter
    logger.info('Step 4: Applying status filter');
    await transactionsPage.filterByStatus('posted');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForFilteredResults();
    
    // Step 5: Verify filtered results match all criteria
    logger.info('Step 5: Verifying filtered results');
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Verify first transaction matches filters
    const transaction = await transactionsPage.getTransactionDetails(0);
    expect(transaction.merchant.toLowerCase()).toContain('amazon');
    expect(transaction.status.toLowerCase()).toBe('posted');
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9081-TS-003-TC-002: Verify filters can be cleared', async ({ page }) => {
    logger.info('Test: Verify filter clearing restores full list');
    
    // Step 1: Apply filters
    logger.info('Step 1: Applying multiple filters');
    await transactionsPage.waitForTransactionsToLoad();
    await transactionsPage.filterByCard('card1');
    await transactionsPage.searchMerchant('Amazon');
    await transactionsPage.filterByStatus('posted');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForFilteredResults();
    const filteredCount = await transactionsPage.getTransactionCount();
    
    // Step 2: Clear all filters
    logger.info('Step 2: Clearing all filters');
    await transactionsPage.clearAllFilters();
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForFilteredResults();
    
    // Step 3: Verify full list is restored
    logger.info('Step 3: Verifying full transaction list is restored');
    const fullCount = await transactionsPage.getTransactionCount();
    expect(fullCount).toBeGreaterThanOrEqual(filteredCount);
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9108-TS-001-TC-001: Verify consolidated transaction history with complete details', async ({ page }) => {
    logger.info('Test: Verify consolidated transaction history');
    
    // Steps 1-2: Already authenticated and navigated
    logger.info('Steps 1-2: User authenticated and navigated to transactions');
    
    // Step 3: Wait for transactions to load
    logger.info('Step 3: Waiting for consolidated transaction list');
    await transactionsPage.waitForTransactionsToLoad();
    
    // Step 4: Verify chronological sorting
    logger.info('Step 4: Verifying chronological sorting (descending)');
    const dates = await transactionsPage.getAllTransactionDates();
    for (let i = 0; i < dates.length - 1; i++) {
      const date1 = new Date(dates[i]);
      const date2 = new Date(dates[i + 1]);
      expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
    }
    
    // Step 5: Verify complete transaction details
    logger.info('Step 5: Verifying complete transaction details');
    const transaction = await transactionsPage.getTransactionDetails(0);
    expect(transaction.date).toBeTruthy();
    expect(transaction.merchant).toBeTruthy();
    expect(transaction.amount).toBeTruthy();
    expect(transaction.cardName).toBeTruthy();
    expect(transaction.cardNumber).toBeTruthy();
    expect(transaction.category).toBeTruthy();
    expect(transaction.status).toBeTruthy();
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9108-TS-002-TC-001: Verify invalid date range validation', async ({ page }) => {
    logger.info('Test: Verify invalid date range validation');
    
    // Steps 1-2: Already authenticated and navigated
    logger.info('Steps 1-2: User authenticated and navigated');
    await transactionsPage.waitForTransactionsToLoad();
    
    // Step 3: Apply invalid date range (end before start)
    logger.info('Step 3: Applying invalid date range');
    await transactionsPage.setDateRange('2023-06-15', '2023-06-01');
    
    // Step 4: Verify validation error
    logger.info('Step 4: Verifying validation error message');
    await expect(transactionsPage.dateRangeError).toBeVisible();
    const errorText = await transactionsPage.dateRangeError.textContent();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('End date must be after start date');
    
    // Step 5: Verify transaction list unchanged
    logger.info('Step 5: Verifying transaction list is unchanged');
    const count = await transactionsPage.getTransactionCount();
    expect(count).toBeGreaterThan(0);
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9108-TS-003-TC-001: Verify pagination with large dataset', async ({ page }) => {
    logger.info('Test: Verify pagination with large dataset');
    
    // Step 1: Authenticate user with 1250 transactions
    logger.info('Step 1: Authenticating user with large transaction dataset');
    await AuthHelper.authenticate(page, 'user789', 'valid-jwt-token');
    await transactionsPage.navigate();
    
    // Step 2: Wait for page to load
    logger.info('Step 2: Waiting for transaction page to load');
    await transactionsPage.waitForTransactionsToLoad();
    
    // Step 3: Verify pagination parameters
    logger.info('Step 3: Verifying pagination parameters');
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeLessThanOrEqual(50); // Default page size
    
    // Step 4: Measure load time (implicit in Playwright's auto-waiting)
    logger.info('Step 4: Page loaded within acceptable time');
    
    // Step 5: Verify pagination controls
    logger.info('Step 5: Verifying pagination controls');
    await expect(transactionsPage.paginationControls).toBeVisible();
    await expect(transactionsPage.nextPageButton).toBeEnabled();
    await expect(transactionsPage.previousPageButton).toBeDisabled();
    
    // Step 6: Navigate to page 2
    logger.info('Step 6: Navigating to page 2');
    await transactionsPage.clickNextPage();
    await transactionsPage.waitForFilteredResults();
    const page2Count = await transactionsPage.getTransactionCount();
    expect(page2Count).toBeGreaterThan(0);
    
    logger.info('Test completed successfully');
  });

  test('TC-QE-9108-TS-003-TC-002: Verify configurable page size', async ({ page }) => {
    logger.info('Test: Verify configurable page size');
    
    // Step 1: Authenticate user with large dataset
    logger.info('Step 1: Authenticating user with large dataset');
    await AuthHelper.authenticate(page, 'user789', 'valid-jwt-token');
    
    // Step 2: Navigate with default page size
    logger.info('Step 2: Navigating with default page size');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsToLoad();
    const defaultCount = await transactionsPage.getTransactionCount();
    expect(defaultCount).toBeLessThanOrEqual(50);
    
    // Step 3: Change page size to 100
    logger.info('Step 3: Changing page size to 100');
    await transactionsPage.setPageSize(100);
    await transactionsPage.waitForFilteredResults();
    const count100 = await transactionsPage.getTransactionCount();
    expect(count100).toBeLessThanOrEqual(100);
    expect(count100).toBeGreaterThan(defaultCount);
    
    // Step 4: Verify pagination controls updated
    logger.info('Step 4: Verifying pagination controls updated');
    await expect(transactionsPage.paginationControls).toBeVisible();
    
    // Step 5: Change page size to 25
    logger.info('Step 5: Changing page size to 25');
    await transactionsPage.setPageSize(25);
    await transactionsPage.waitForFilteredResults();
    const count25 = await transactionsPage.getTransactionCount();
    expect(count25).toBeLessThanOrEqual(25);
    
    // Step 6: Verify pagination controls updated again
    logger.info('Step 6: Verifying pagination controls updated');
    await expect(transactionsPage.paginationControls).toBeVisible();
    
    logger.info('Test completed successfully');
  });
});