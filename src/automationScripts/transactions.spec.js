const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');

// Test Case ID: QE-9376 - Transaction Listing and Display
test.describe('Transaction Listing and Display - QE-9376', () => {
  // Test Case ID: QE-9543 TS-001 TC-001
  test('TC-001: Verify user can view unified transaction list within 1 second', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionsPage = new TransactionsPage(page);

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 3: Navigate to transactions and verify load time
    const startTime = Date.now();
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionListLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);

    // Step 4: Verify transactions from all cards are displayed
    await expect(transactionsPage.transactionTable).toBeVisible();
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);

    // Step 5: Verify each transaction displays complete details
    await transactionsPage.verifyTransactionDetails(0);

    // Step 6: Verify transactions are sorted by date (most recent first)
    await transactionsPage.verifyTransactionsSortedByDate();
  });

  // Test Case ID: QE-9543 TS-002 TC-001
  test('TC-002: Verify message when no transaction history exists', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionsPage = new TransactionsPage(page);

    // Step 1-2: Launch and authenticate with new user
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Test@1234');

    // Step 3: Navigate to transactions
    await transactionsPage.navigate();

    // Step 4-5: Verify empty state message
    await expect(transactionsPage.noTransactionsMessage).toBeVisible();
    const messageText = await transactionsPage.getNoTransactionsMessageText();
    expect(messageText).toContain('No transactions');
  });

  // Test Case ID: QE-9543 TS-003 TC-001
  test('TC-003: Verify error message with retry option on service timeout', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const transactionsPage = new TransactionsPage(page);

    // Mock transaction service failure
    await context.route('**/api/transactions', route => route.abort());

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 4: Navigate to transactions
    await transactionsPage.navigate();

    // Step 5-6: Verify error message and retry option
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.getErrorMessageText();
    expect(errorText).toContain('could not be loaded');
    await expect(transactionsPage.retryButton).toBeVisible();
  });
});

// Test Case ID: QE-9378 - Transaction Search and Filtering
test.describe('Transaction Search and Filtering - QE-9378', () => {
  // Test Case ID: QE-9546 TS-001 TC-001
  test('TC-001: Verify transaction filter by date range and merchant within 1 second', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionsPage = new TransactionsPage(page);

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 3: Navigate to transactions
    await transactionsPage.navigate();

    // Step 4-5: Enter filter criteria
    await transactionsPage.setDateRangeFilter('2024-01-01', '2024-06-30');
    await transactionsPage.setMerchantFilter('Amazon');

    // Step 6: Apply filter and verify response time
    const startTime = Date.now();
    await transactionsPage.applyFilters();
    await transactionsPage.waitForFilterResults();
    const filterTime = Date.now() - startTime;
    expect(filterTime).toBeLessThan(1000);

    // Step 7: Verify filtered results
    await transactionsPage.verifyFilteredResults('2024-01-01', '2024-06-30', 'Amazon');
  });

  // Test Case ID: QE-9546 TS-002 TC-001
  test('TC-002: Verify validation error for invalid date range', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionsPage = new TransactionsPage(page);

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 3: Navigate to transactions
    await transactionsPage.navigate();

    // Step 4: Enter invalid date range
    await transactionsPage.setDateRangeFilter('2024-06-30', '2024-01-01');

    // Step 5: Apply filter and verify validation error
    await transactionsPage.applyFilters();
    await expect(transactionsPage.validationError).toBeVisible();
    const errorText = await transactionsPage.getValidationErrorText();
    expect(errorText).toMatch(/invalid.*date.*range/i);

    // Step 6: Verify no results displayed
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(0);
  });

  // Test Case ID: QE-9546 TS-003 TC-001
  test('TC-003: Verify message when filter returns zero results', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionsPage = new TransactionsPage(page);

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 3: Navigate to transactions
    await transactionsPage.navigate();

    // Step 4: Enter filter that matches no transactions
    await transactionsPage.setMerchantFilter('NonExistentMerchant12345');

    // Step 5: Apply filter
    await transactionsPage.applyFilters();

    // Step 5-6: Verify no results message
    await expect(transactionsPage.noResultsMessage).toBeVisible();
    const messageText = await transactionsPage.getNoResultsMessageText();
    expect(messageText).toContain('No transactions match');
  });
});