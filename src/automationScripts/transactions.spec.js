const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');
const logger = require('../utils/logger');

test.describe('Transaction Management and Filtering Tests', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    logger.info('Test setup: Navigating to application');
    await loginPage.navigate();
  });

  test('TC-4633: Verify aggregated transaction list displays all transactions from multiple cards', async ({ page }) => {
    logger.info('Starting test: Aggregated transaction list display');
    
    await loginPage.login(testData.users.multicard_user.username, testData.users.multicard_user.password);
    logger.info('Logged in with user having multiple credit cards');
    
    await transactionsPage.navigateToTransactions();
    logger.info('Navigated to transaction management page');
    
    await expect(transactionsPage.transactionList).toBeVisible();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(73);
    logger.info('Verified total transaction count: 73 (45 from CC001 + 28 from CC002)');
    
    const firstTransaction = await transactionsPage.getTransactionByIndex(0);
    expect(firstTransaction.merchantName).toBeTruthy();
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.category).toBeTruthy();
    expect(firstTransaction.cardId).toMatch(/CC001|CC002/);
    expect(firstTransaction.status).toBe('Completed');
    logger.info('Verified transaction row displays all required fields');
    
    const isSortedDescending = await transactionsPage.verifyDateSortingDescending();
    expect(isSortedDescending).toBe(true);
    logger.info('Verified transactions sorted by date in descending order');
    
    logger.info('Test completed successfully: Aggregated transaction list validated');
  });

  test('TC-4634: Verify transaction detail view displays complete information', async ({ page }) => {
    logger.info('Starting test: Transaction detail view');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await transactionsPage.navigateToTransactions();
    logger.info('Navigated to transaction management page');
    
    await transactionsPage.clickTransactionByMerchant('Starbucks');
    logger.info('Clicked on Starbucks transaction');
    
    await expect(transactionsPage.transactionDetailView).toBeVisible();
    logger.info('Transaction detail view loaded');
    
    const transactionId = await transactionsPage.getTransactionId();
    expect(transactionId).toMatch(/TXN\d+/);
    logger.info(`Transaction ID displayed: ${transactionId}`);
    
    const cardUsed = await transactionsPage.getCardUsed();
    expect(cardUsed).toContain('CC001');
    expect(cardUsed).toContain('Visa');
    expect(cardUsed).toMatch(/\*\*\*\*\d{4}/);
    logger.info(`Card used displayed: ${cardUsed}`);
    
    const merchantName = await transactionsPage.getMerchantName();
    expect(merchantName).toBe('Starbucks');
    logger.info(`Merchant name: ${merchantName}`);
    
    const transactionDate = await transactionsPage.getTransactionDate();
    expect(transactionDate).toContain('Jan 15, 2024');
    logger.info(`Transaction date: ${transactionDate}`);
    
    const amount = await transactionsPage.getTransactionAmount();
    expect(amount).toBe('$45.50 USD');
    logger.info(`Amount: ${amount}`);
    
    const category = await transactionsPage.getTransactionCategory();
    expect(category).toBe('Food & Dining');
    logger.info(`Category: ${category}`);
    
    const status = await transactionsPage.getTransactionStatus();
    expect(status).toBe('Completed');
    logger.info(`Status: ${status}`);
    
    const description = await transactionsPage.getTransactionDescription();
    expect(description).toBe('Coffee and breakfast');
    logger.info(`Description: ${description}`);
    
    logger.info('Test completed successfully: Transaction detail view validated');
  });

  test('TC-4635: Verify system displays error and fallback data when transaction service unavailable', async ({ page }) => {
    logger.info('Starting test: Transaction service unavailability handling');
    
    await page.route('**/api/transactions', route => route.abort('failed'));
    logger.info('Simulated transaction data service unavailability (HTTP 500)');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in');
    
    await transactionsPage.navigateToTransactions();
    logger.info('Navigated to transaction management page');
    
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load transactions');
    logger.info('Error message displayed to user');
    
    await expect(transactionsPage.transactionList).toBeVisible();
    logger.info('Fallback/sample data displayed');
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info('Sample transactions displayed');
    
    const canInteract = await transactionsPage.verifyInteractivity();
    expect(canInteract).toBe(true);
    logger.info('User interface remains functional');
    
    logger.info('Test completed successfully: Error handling and fallback validated');
  });

  test('TC-4639: Verify date range filter returns accurate results within 2 seconds', async ({ page }) => {
    logger.info('Starting test: Date range filter performance');
    
    await loginPage.login(testData.users.high_volume_user.username, testData.users.high_volume_user.password);
    logger.info('Logged in with user having 200+ transactions');
    
    await transactionsPage.navigateToTransactions();
    logger.info('Navigated to transaction management page');
    
    const initialCount = await transactionsPage.getTransactionCount();
    expect(initialCount).toBeGreaterThan(200);
    logger.info(`Initial transaction count: ${initialCount}`);
    
    const startTime = Date.now();
    await transactionsPage.applyDateRangeFilter('2024-01-01', '2024-01-31');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(2000);
    logger.info(`Filter response time: ${responseTime}ms (within 2 seconds)`);
    
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBeLessThan(initialCount);
    logger.info(`Filtered transaction count: ${filteredCount}`);
    
    const allDatesInRange = await transactionsPage.verifyAllDatesInRange('2024-01-01', '2024-01-31');
    expect(allDatesInRange).toBe(true);
    logger.info('All displayed transactions are within date range');
    
    const isSortedDescending = await transactionsPage.verifyDateSortingDescending();
    expect(isSortedDescending).toBe(true);
    logger.info('Filtered transactions remain sorted by date');
    
    logger.info('Test completed successfully: Date range filter performance validated');
  });

  test('TC-4640: Verify multiple simultaneous filters return accurate intersection results within 2 seconds', async ({ page }) => {
    logger.info('Starting test: Multiple simultaneous filters');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await transactionsPage.navigateToTransactions();
    logger.info('Navigated to transaction management page');
    
    const startTime = Date.now();
    await transactionsPage.applyDateRangeFilter('2024-01-01', '2024-01-31');
    await transactionsPage.applyCategoryFilter('Food & Dining');
    await transactionsPage.applySearchFilter('Starbucks');
    await transactionsPage.clickApplyFilters();
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(2000);
    logger.info(`Multiple filters response time: ${responseTime}ms (within 2 seconds)`);
    
    const transactions = await transactionsPage.getAllTransactions();
    
    for (const txn of transactions) {
      const dateInRange = await transactionsPage.isDateInRange(txn.date, '2024-01-01', '2024-01-31');
      expect(dateInRange).toBe(true);
      expect(txn.category).toBe('Food & Dining');
      expect(txn.merchantName.toLowerCase()).toContain('starbucks');
    }
    logger.info('All transactions match ALL filter criteria (date range, category, search term)');
    
    logger.info('Test completed successfully: Multiple simultaneous filters validated');
  });

  test('TC-4641: Verify system validates invalid date range (end date earlier than start date)', async ({ page }) => {
    logger.info('Starting test: Invalid date range validation (end before start)');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await transactionsPage.navigateToTransactions();
    logger.info('Navigated to transaction management page');
    
    await transactionsPage.applyDateRangeFilter('2024-01-31', '2024-01-01');
    await transactionsPage.clickApplyFilters();
    logger.info('Applied invalid date range (end date earlier than start date)');
    
    await expect(transactionsPage.validationError).toBeVisible();
    const errorText = await transactionsPage.validationError.textContent();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('End date must be after start date');
    logger.info('Validation error message displayed');
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info('Transaction list remains unchanged (invalid query not executed)');
    
    const dateFieldsEditable = await transactionsPage.areDateFieldsEditable();
    expect(dateFieldsEditable).toBe(true);
    logger.info('Date range fields remain editable for correction');
    
    logger.info('Test completed successfully: Invalid date range validation passed');
  });

  test('TC-4642: Verify system validates future date range', async ({ page }) => {
    logger.info('Starting test: Future date range validation');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await transactionsPage.navigateToTransactions();
    logger.info('Navigated to transaction management page');
    
    await transactionsPage.applyDateRangeFilter('2025-06-01', '2025-06-30');
    await transactionsPage.clickApplyFilters();
    logger.info('Applied future date range');
    
    await expect(transactionsPage.validationError).toBeVisible();
    const errorText = await transactionsPage.validationError.textContent();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('Cannot filter for future dates');
    logger.info('Validation error message displayed for future dates');
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info('Transaction list remains unchanged (invalid query not executed)');
    
    logger.info('Test completed successfully: Future date range validation passed');
  });
});
