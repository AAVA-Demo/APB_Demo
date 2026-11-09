const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');
const Logger = require('../utils/logger');

const logger = new Logger('TransactionSpec');

test.describe('Transaction History and Listing - QE-7947', () => {
  let transactionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
    logger.info('Test setup: Initializing transaction tests');
  });

  test('QE-7947 TS-001 TC-001: Verify user with multiple cards views complete transaction list within 1 second', async ({ page }) => {
    logger.info('Starting test: QE-7947 TS-001 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_transactions.username, testData.users.test_user_transactions.password);
    logger.info('User authenticated successfully');

    // Step 2: Navigate to Transaction Management and measure load time
    const startTime = Date.now();
    await transactionPage.navigateToTransactions();
    const loadTime = Date.now() - startTime;
    logger.info(`Transaction page loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);

    // Step 3: Verify complete transaction list displayed
    await expect(transactionPage.transactionListContainer).toBeVisible();
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(150);
    logger.info(`Verified ${transactionCount} transactions displayed`);

    // Step 4: Verify transaction details
    const firstTransaction = await transactionPage.getTransactionDetails(0);
    expect(firstTransaction.merchantName).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.category).toBeTruthy();
    expect(firstTransaction.status).toBeTruthy();
    expect(firstTransaction.cardUsed).toBeTruthy();
    logger.info('Transaction details verified: Merchant, Amount, Date, Category, Status, Card');

    // Step 5: Verify load time within 1-second NFR
    expect(loadTime).toBeLessThan(1000);
    logger.info('Transaction list loaded within 1-second NFR requirement');
  });

  test('QE-7947 TS-002 TC-001: Verify user with no transactions views empty list with message', async ({ page }) => {
    logger.info('Starting test: QE-7947 TS-002 TC-001');
    
    // Step 1: Authenticate user with no transactions
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_no_transactions.username, testData.users.test_user_no_transactions.password);
    logger.info('User with no transactions authenticated');

    // Step 2: Navigate to Transaction Management
    const startTime = Date.now();
    await transactionPage.navigateToTransactions();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);

    // Step 3: Verify no transactions message
    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    const message = await transactionPage.getNoTransactionsMessageText();
    expect(message).toContain('No transactions found');
    logger.info('No transactions message verified');

    // Step 4: Verify empty transaction list
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    logger.info('Verified empty transaction list');

    // Step 5: Verify no errors or broken UI
    await expect(transactionPage.errorMessage).not.toBeVisible();
    await expect(transactionPage.transactionListContainer).toBeVisible();
    logger.info('Page displays cleanly with no errors');
  });

  test('QE-7947 TS-003 TC-001: Verify transactions sorted by date descending with card-wise segregation', async ({ page }) => {
    logger.info('Starting test: QE-7947 TS-003 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_sorted_transactions.username, testData.users.test_user_sorted_transactions.password);

    // Step 2: Navigate to Transaction Management
    await transactionPage.navigateToTransactions();
    await expect(transactionPage.transactionListContainer).toBeVisible();

    // Step 3: Verify transactions sorted by date descending
    const transactions = await transactionPage.getAllTransactionDates();
    const firstDate = new Date(transactions[0]);
    const lastDate = new Date(transactions[transactions.length - 1]);
    expect(firstDate.getTime()).toBeGreaterThanOrEqual(lastDate.getTime());
    logger.info('Verified transactions sorted by date descending (most recent first)');

    // Step 4: Verify card-wise segregation
    const firstTransaction = await transactionPage.getTransactionDetails(0);
    expect(firstTransaction.cardUsed).toContain('****');
    logger.info(`Card used displayed: ${firstTransaction.cardUsed}`);

    // Step 5: Verify user can identify transactions by card
    const visaTransactions = await transactionPage.filterTransactionsByCard('Visa ****1234');
    expect(visaTransactions.length).toBeGreaterThan(0);
    logger.info(`Found ${visaTransactions.length} transactions for Visa ****1234`);
  });
});

test.describe('Transaction Search and Filtering - QE-7948', () => {
  let transactionPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionPage = new TransactionPage(page);
  });

  test('QE-7948 TS-001 TC-001: Verify user applies date range and card filters with results within 1 second', async ({ page }) => {
    logger.info('Starting test: QE-7948 TS-001 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_multi_card.username, testData.users.test_user_multi_card.password);

    // Step 2: Navigate to Transaction Management
    await transactionPage.navigateToTransactions();
    await expect(transactionPage.transactionListContainer).toBeVisible();

    // Step 3: Apply date range filter
    await transactionPage.setDateFromFilter('2024-01-01');
    await transactionPage.setDateToFilter('2024-03-31');
    logger.info('Date range filter applied: 2024-01-01 to 2024-03-31');

    // Step 4: Select card filter
    await transactionPage.selectCardFilter('Visa ****1234');
    logger.info('Card filter applied: Visa ****1234');

    // Step 5: Apply filters and measure response time
    const startTime = Date.now();
    await transactionPage.clickApplyFilters();
    await transactionPage.waitForFilterResults();
    const responseTime = Date.now() - startTime;
    logger.info(`Filter results displayed in ${responseTime}ms`);
    expect(responseTime).toBeLessThan(1000);

    // Step 6: Verify filtered results
    const transactions = await transactionPage.getAllTransactions();
    for (const transaction of transactions) {
      expect(transaction.cardUsed).toContain('Visa ****1234');
      const transactionDate = new Date(transaction.date);
      expect(transactionDate.getTime()).toBeGreaterThanOrEqual(new Date('2024-01-01').getTime());
      expect(transactionDate.getTime()).toBeLessThanOrEqual(new Date('2024-03-31').getTime());
    }
    logger.info('All displayed transactions match filter criteria');
  });

  test('QE-7948 TS-002 TC-001: Verify no transactions found message when filters return no results', async ({ page }) => {
    logger.info('Starting test: QE-7948 TS-002 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_transactions.username, testData.users.test_user_transactions.password);

    // Step 2: Navigate to Transaction Management
    await transactionPage.navigateToTransactions();

    // Step 3: Apply future date range filter
    await transactionPage.setDateFromFilter('2025-01-01');
    await transactionPage.setDateToFilter('2025-12-31');
    logger.info('Applied future date range filter');

    // Step 4: Select card filter
    await transactionPage.selectCardFilter('Mastercard ****5678');

    // Step 5: Apply filters
    await transactionPage.clickApplyFilters();
    await transactionPage.waitForFilterResults();

    // Verify no transactions message
    await expect(transactionPage.noResultsMessage).toBeVisible();
    const message = await transactionPage.getNoResultsMessageText();
    expect(message).toContain('No transactions found matching your criteria');
    logger.info('No transactions found message verified');

    // Step 6: Verify data integrity and no errors
    await expect(transactionPage.errorMessage).not.toBeVisible();
    const dateFrom = await transactionPage.getDateFromValue();
    expect(dateFrom).toBe('2025-01-01');
    logger.info('Filter state preserved, no errors displayed');
  });

  test('QE-7948 TS-003 TC-001: Verify multiple filters applied with filter state maintained', async ({ page }) => {
    logger.info('Starting test: QE-7948 TS-003 TC-001');
    
    // Step 1: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_advanced_filters.username, testData.users.test_user_advanced_filters.password);

    // Step 2: Navigate to Transaction Management
    await transactionPage.navigateToTransactions();

    // Step 3: Apply multiple filters
    await transactionPage.setDateFromFilter('2024-06-01');
    await transactionPage.setDateToFilter('2024-06-30');
    await transactionPage.selectCardFilter('Visa ****1234');
    await transactionPage.setMinAmountFilter('50');
    await transactionPage.setMaxAmountFilter('500');
    await transactionPage.setMerchantNameFilter('Amazon');
    logger.info('All filters applied: Date, Card, Amount, Merchant');

    // Step 4: Apply filters and measure response time
    const startTime = Date.now();
    await transactionPage.clickApplyFilters();
    await transactionPage.waitForFilterResults();
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(1000);
    logger.info(`Filtered results displayed in ${responseTime}ms`);

    // Step 5: Verify all filter criteria matched
    const transactions = await transactionPage.getAllTransactions();
    for (const transaction of transactions) {
      expect(transaction.cardUsed).toContain('Visa ****1234');
      const amount = parseFloat(transaction.amount.replace(/[^0-9.-]+/g, ''));
      expect(amount).toBeGreaterThanOrEqual(50);
      expect(amount).toBeLessThanOrEqual(500);
      expect(transaction.merchantName).toContain('Amazon');
    }
    logger.info('All transactions match all filter criteria');

    // Step 6: Navigate away and return to verify filter state
    await transactionPage.navigateToDashboard();
    await transactionPage.navigateToTransactions();
    
    // Verify filters retained
    expect(await transactionPage.getDateFromValue()).toBe('2024-06-01');
    expect(await transactionPage.getSelectedCardValue()).toBe('Visa ****1234');
    expect(await transactionPage.getMerchantNameValue()).toBe('Amazon');
    logger.info('Filter state maintained after navigation');
  });
});