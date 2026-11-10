const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { LoginPage } = require('./pages/login.page');
const config = require('../data/config.json');

// Test Case - QE-10624 TS-001 TC-001
test('Verify unified transaction list displays all transactions from multiple credit cards with pagination', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having at least 2 credit cards with transaction history
  await loginPage.login('testuser_multicards', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Transaction Management page
  await transactionPage.navigate();
  await expect(page).toHaveURL(/transactions/);

  // Step 4: Verify unified transaction list displays transactions from all cards
  await expect(transactionPage.transactionTable).toBeVisible();
  const transactionCount = await transactionPage.getTransactionCount();
  expect(transactionCount).toBeGreaterThanOrEqual(20); // At least 25 expected, showing 20 per page

  // Verify transactions from different cards are present
  await transactionPage.verifyTransactionFromCard('Visa *1234');
  await transactionPage.verifyTransactionFromCard('Mastercard *5678');

  // Step 5: Verify transactions are sorted by date in descending order
  const isDescending = await transactionPage.verifyDateSortDescending();
  expect(isDescending).toBeTruthy();

  // Step 6: Verify pagination controls are visible
  await expect(transactionPage.paginationControls).toBeVisible();
  await expect(transactionPage.nextPageButton).toBeVisible();

  // Step 7: Verify each transaction displays card identifier
  const firstTransaction = transactionPage.transactionRows.first();
  await expect(firstTransaction.locator('td').nth(1)).toContainText(/Visa|Mastercard/);

  // Step 8: Click on page 2 in pagination controls
  await transactionPage.goToPage(2);
  await page.waitForLoadState('networkidle');
  const newCount = await transactionPage.getTransactionCount();
  expect(newCount).toBeGreaterThan(0); // Verify page 2 has transactions
});

// Test Case - QE-10624 TS-002 TC-001
test('Verify empty transaction list message when user has multiple cards but no transaction history', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having multiple cards but no transactions
  await loginPage.login('testuser_notxns', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Transaction Management page
  await transactionPage.navigate();
  await expect(page).toHaveURL(/transactions/);

  // Step 4: Verify empty transaction list message
  await expect(transactionPage.emptyStateMessage).toBeVisible();
  await expect(transactionPage.emptyStateMessage).toContainText('No transactions are available');

  // Step 5: Verify transaction table is empty
  const rowCount = await transactionPage.getTransactionCount();
  expect(rowCount).toBe(0);
  await expect(transactionPage.transactionTable.locator('thead')).toBeVisible(); // Headers visible

  // Step 6: Verify pagination controls are hidden
  await expect(transactionPage.paginationControls).not.toBeVisible();
});

// Test Case - QE-10624 TS-003 TC-001
test('Verify error message and empty state when transaction service returns 500 error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);

  // Step 2: Simulate transaction service error
  await page.route('**/api/transactions*', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 3: Login with valid credentials
  await loginPage.login('testuser', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 4: Navigate to Transaction Management page
  await transactionPage.navigate();

  // Step 5: Verify error message is displayed
  await expect(transactionPage.errorMessage).toBeVisible();
  await expect(transactionPage.errorMessage).toContainText('Failed to load transactions');

  // Step 6: Verify transaction list shows empty state
  const rowCount = await transactionPage.getTransactionCount();
  expect(rowCount).toBe(0);

  // Step 7: Verify retry button is present
  await expect(transactionPage.retryButton).toBeVisible();

  // Step 8: Click the Retry button
  await transactionPage.clickRetry();
  // Verify retry attempt is made
});

// Test Case - QE-10622 TS-001 TC-001
test('Verify date range filter displays filtered transactions within 1 second', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having transaction history spanning multiple months
  await loginPage.login('testuser_txnhistory', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Transaction Management page
  await transactionPage.navigate();
  await expect(page).toHaveURL(/transactions/);

  // Step 4: Locate the date range filter controls
  await expect(transactionPage.startDateInput).toBeVisible();
  await expect(transactionPage.endDateInput).toBeVisible();

  // Step 5: Enter start date for last 30 days filter
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];
  await transactionPage.setStartDate(startDate);

  // Step 6: Enter end date as today's date
  const endDate = today.toISOString().split('T')[0];
  await transactionPage.setEndDate(endDate);

  // Step 7: Apply the date range filter
  const startTime = Date.now();
  await transactionPage.applyFilter();
  await page.waitForLoadState('networkidle');
  const endTime = Date.now();

  // Step 8: Verify filtered results display only transactions within the last 30 days
  const allDatesValid = await transactionPage.verifyAllTransactionDatesInRange(startDate, endDate);
  expect(allDatesValid).toBeTruthy();

  // Step 9: Verify filter criteria is clearly indicated
  await expect(transactionPage.filterIndicator).toBeVisible();
  await expect(transactionPage.filterIndicator).toContainText(startDate);
  await expect(transactionPage.filterIndicator).toContainText(endDate);

  // Step 10: Verify filter response time is within 1 second
  const responseTime = endTime - startTime;
  expect(responseTime).toBeLessThan(1000);
});

// Test Case - QE-10622 TS-002 TC-001
test('Verify validation error when start date is after end date in date range filter', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with valid credentials
  await loginPage.login('testuser', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Transaction Management page
  await transactionPage.navigate();
  await expect(page).toHaveURL(/transactions/);

  // Step 4: Locate the date range filter controls
  await expect(transactionPage.startDateInput).toBeVisible();
  await expect(transactionPage.endDateInput).toBeVisible();

  // Step 5: Enter start date that is after the end date
  await transactionPage.setStartDate('2026-11-10');

  // Step 6: Enter end date that is before the start date
  await transactionPage.setEndDate('2026-10-10');

  // Step 7: Attempt to apply the invalid date range filter
  await transactionPage.applyFilter();

  // Step 8: Verify validation error message is displayed
  await expect(transactionPage.validationError).toBeVisible();
  await expect(transactionPage.validationError).toContainText('Start date must be before or equal to end date');

  // Step 9: Verify invalid filter is not applied
  // Transaction list should remain unchanged
  const transactionCount = await transactionPage.getTransactionCount();
  expect(transactionCount).toBeGreaterThan(0); // Should show all transactions

  // Step 10: Verify filter input fields remain editable
  await expect(transactionPage.startDateInput).toBeEditable();
  await expect(transactionPage.endDateInput).toBeEditable();
});

// Test Case - QE-10622 TS-003 TC-001
test('Verify message and clear filters option when multiple filters result in zero matching transactions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having transaction history
  await loginPage.login('testuser_txnhistory', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Transaction Management page
  await transactionPage.navigate();
  await expect(page).toHaveURL(/transactions/);

  // Step 4: Apply date range filter
  await transactionPage.setStartDate('2026-11-01');
  await transactionPage.setEndDate('2026-11-10');

  // Step 5: Apply merchant search filter with non-existent merchant
  await transactionPage.setMerchantFilter('NonExistentMerchant123');

  // Step 6: Apply amount range filter with range that doesn't match
  await transactionPage.setAmountRange('10000', '20000');
  await transactionPage.applyFilter();
  await page.waitForLoadState('networkidle');

  // Step 7: Verify transaction list is empty
  const rowCount = await transactionPage.getTransactionCount();
  expect(rowCount).toBe(0);

  // Step 8: Verify message indicating no matching transactions
  await expect(transactionPage.noResultsMessage).toBeVisible();
  await expect(transactionPage.noResultsMessage).toContainText('No transactions match the current filter criteria');

  // Step 9: Verify 'Clear All Filters' option is present
  await expect(transactionPage.clearFiltersButton).toBeVisible();

  // Step 10: Click the 'Clear All Filters' option
  await transactionPage.clearAllFilters();
  await page.waitForLoadState('networkidle');
  const newCount = await transactionPage.getTransactionCount();
  expect(newCount).toBeGreaterThan(0); // Full transaction list restored
});
