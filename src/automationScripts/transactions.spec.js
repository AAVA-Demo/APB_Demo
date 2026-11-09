const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { LoginPage } = require('./pages/login.page');

// Test Case: QE-8916 TS-001 TC-001
test('Verify multi-card transaction history displays first 50 transactions in paginated view sorted by date', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);
  
  // Step 1: Launch application
  await transactionPage.navigate();
  
  // Step 2: Login with multi-cards user
  await loginPage.login('testuser_multicards', 'Pass@123');
  
  // Step 3: Click Transactions menu
  await transactionPage.clickTransactionsMenu();
  
  // Step 4: Observe transaction list - measure load time
  const startTime = Date.now();
  await transactionPage.waitForTransactionListToLoad();
  const loadTime = Date.now() - startTime;
  
  const transactionCount = await transactionPage.getTransactionCount();
  expect(transactionCount).toBe(50);
  
  // Step 5: Verify date sorting
  const dates = await transactionPage.getAllTransactionDates();
  const isSortedDescending = transactionPage.verifyDatesSortedDescending(dates);
  expect(isSortedDescending).toBe(true);
  
  // Step 6: Verify all required fields
  const transactions = await transactionPage.getAllTransactions();
  
  for (const txn of transactions) {
    expect(txn.cardName).toBeTruthy();
    expect(txn.merchant).toBeTruthy();
    expect(txn.category).toBeTruthy();
    expect(txn.amount).toMatch(/\$[\d,]+\.\d{2}/);
    expect(txn.status).toMatch(/Posted|Pending/);
  }
  
  // Step 7: Verify pagination controls
  await expect(transactionPage.paginationInfo).toContainText('Page 1 of 3');
  await expect(transactionPage.nextButton).toBeEnabled();
  await expect(transactionPage.previousButton).toBeDisabled();
  
  // Step 8: Verify load time
  expect(loadTime).toBeLessThan(3000);
});

// Test Case: QE-8916 TS-002 TC-001
test('Verify page navigation loads next 50 transactions with updated pagination controls', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);
  
  // Step 1: Login
  await transactionPage.navigate();
  await loginPage.login('testuser_multicards', 'Pass@123');
  
  // Step 2: Navigate to Transactions
  await transactionPage.clickTransactionsMenu();
  await transactionPage.waitForTransactionListToLoad();
  
  // Step 3: Click Next button
  await transactionPage.clickNextPage();
  
  // Step 4: Observe page 2 - measure load time
  const startTime = Date.now();
  await transactionPage.waitForTransactionListToLoad();
  const loadTime = Date.now() - startTime;
  
  const transactionCount = await transactionPage.getTransactionCount();
  expect(transactionCount).toBe(50);
  
  // Step 5: Verify pagination updated
  await expect(transactionPage.paginationInfo).toContainText('Page 2 of 3');
  await expect(transactionPage.previousButton).toBeEnabled();
  await expect(transactionPage.nextButton).toBeEnabled();
  
  // Step 6: Verify different transactions
  const page2Transactions = await transactionPage.getAllTransactions();
  
  // Navigate back to page 1 to compare
  await transactionPage.clickPreviousPage();
  await transactionPage.waitForTransactionListToLoad();
  const page1Transactions = await transactionPage.getAllTransactions();
  
  // Verify transactions are different
  expect(page1Transactions[0].merchant).not.toBe(page2Transactions[0].merchant);
  
  // Step 7: Verify load time
  expect(loadTime).toBeLessThan(3000);
});

// Test Case: QE-8916 TS-003 TC-001
test('Verify transaction history displays empty state message when no transactions exist', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);
  
  // Step 1: Launch application
  await transactionPage.navigate();
  
  // Step 2: Login with no transactions user
  await loginPage.login('testuser_notransactions', 'Pass@123');
  
  // Step 3: Navigate to Transactions
  await transactionPage.clickTransactionsMenu();
  
  // Step 4: Observe empty state
  await expect(transactionPage.emptyStateMessage).toBeVisible();
  await expect(transactionPage.emptyStateMessage).toContainText(/No transactions found/);
  
  // Step 5: Verify table is empty
  const transactionCount = await transactionPage.getTransactionCount();
  expect(transactionCount).toBe(0);
  
  // Step 6: Verify pagination hidden/disabled
  const paginationVisible = await transactionPage.paginationControls.isVisible().catch(() => false);
  if (paginationVisible) {
    await expect(transactionPage.previousButton).toBeDisabled();
    await expect(transactionPage.nextButton).toBeDisabled();
  }
});

// Test Case: QE-8915 TS-001 TC-001
test('Verify date range filter displays only transactions within last 30 days within 1 second', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);
  
  // Step 1: Launch application
  await transactionPage.navigate();
  
  // Step 2: Login
  await loginPage.login('testuser_filter', 'Pass@123');
  
  // Step 3: Navigate to Transactions
  await transactionPage.clickTransactionsMenu();
  await transactionPage.waitForTransactionListToLoad();
  
  // Step 4: Locate date filters
  await expect(transactionPage.fromDateFilter).toBeVisible();
  await expect(transactionPage.toDateFilter).toBeVisible();
  
  // Step 5-6: Set date range
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  await transactionPage.setDateRange(
    thirtyDaysAgo.toISOString().split('T')[0],
    today.toISOString().split('T')[0]
  );
  
  // Step 7: Measure filter response time
  const startTime = Date.now();
  await transactionPage.waitForTransactionListToLoad();
  const filterTime = Date.now() - startTime;
  
  // Step 8: Verify all transactions within range
  const transactions = await transactionPage.getAllTransactions();
  
  for (const txn of transactions) {
    const txnDate = new Date(txn.date);
    expect(txnDate).toBeGreaterThanOrEqual(thirtyDaysAgo);
    expect(txnDate).toBeLessThanOrEqual(today);
  }
  
  // Step 9: Verify filter time
  expect(filterTime).toBeLessThan(1000);
});

// Test Case: QE-8915 TS-002 TC-001
test('Verify real-time search by merchant name filters transactions within 1 second', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);
  
  // Step 1: Login
  await transactionPage.navigate();
  await loginPage.login('testuser_search', 'Pass@123');
  
  // Step 2: Navigate to Transactions
  await transactionPage.clickTransactionsMenu();
  await transactionPage.waitForTransactionListToLoad();
  
  // Step 3: Locate search field
  await expect(transactionPage.searchField).toBeVisible();
  await expect(transactionPage.searchField).toHaveAttribute('placeholder', /Search transactions/);
  
  // Step 4-5: Enter merchant name and measure response time
  const startTime = Date.now();
  await transactionPage.searchByMerchant('Amazon');
  await transactionPage.waitForTransactionListToLoad();
  const searchTime = Date.now() - startTime;
  
  // Step 6: Verify all transactions have Amazon
  const transactions = await transactionPage.getAllTransactions();
  
  for (const txn of transactions) {
    expect(txn.merchant.toLowerCase()).toContain('amazon');
  }
  
  // Step 7: Verify multi-card results
  const uniqueCards = new Set(transactions.map(t => t.cardName));
  expect(uniqueCards.size).toBeGreaterThan(0);
  
  // Step 8: Verify search time
  expect(searchTime).toBeLessThan(1000);
});

// Test Case: QE-8915 TS-003 TC-001
test('Verify system displays appropriate message when multiple filters result in zero matching transactions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionPage(page);
  
  // Step 1: Login
  await transactionPage.navigate();
  await loginPage.login('testuser_nofilter', 'Pass@123');
  
  // Step 2: Navigate to Transactions
  await transactionPage.clickTransactionsMenu();
  await transactionPage.waitForTransactionListToLoad();
  
  // Step 3: Apply date range filter
  await transactionPage.setDateRange('2024-01-01', '2024-01-05');
  
  // Step 4: Apply category filter
  await transactionPage.selectCategory('Healthcare');
  
  // Step 5: Apply card filter
  await transactionPage.selectCard('Visa Platinum');
  
  // Step 6: Verify no results message
  await expect(transactionPage.noResultsMessage).toBeVisible();
  await expect(transactionPage.noResultsMessage).toContainText(/No transactions found matching your search criteria/);
  
  // Step 7: Verify table is empty
  const transactionCount = await transactionPage.getTransactionCount();
  expect(transactionCount).toBe(0);
  
  // Step 8: Verify no errors
  const errorVisible = await transactionPage.errorMessage.isVisible().catch(() => false);
  expect(errorVisible).toBe(false);
});
