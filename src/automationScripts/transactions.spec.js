const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const logger = require('../utils/logger');

test.describe('Transaction Listing and Filtering Tests', () => {

  test('QE-9369 TS-001 TC-001 - Verify paginated transaction list displays all card transactions with complete details', async ({ page }) => {
    logger.info('Starting test: QE-9369 TS-001 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1-2: Launch and authenticate
    logger.info('Step 1-2: Launching and authenticating as testuser_multi_cards_txns');
    await transactionsPage.navigate();
    await transactionsPage.login('testuser_multi_cards_txns', 'Test@123');
    
    // Step 3: Navigate to Transaction Management interface
    logger.info('Step 3: Navigating to Transaction Management interface');
    await transactionsPage.navigateToTransactions();
    await expect(page).toHaveURL(/transactions/);
    
    // Step 4: Wait for paginated transaction list to load
    logger.info('Step 4: Waiting for paginated transaction list to load');
    await transactionsPage.waitForTransactionListToLoad();
    
    // Step 5: Verify transactions from all cards are visible
    logger.info('Step 5: Verifying transactions from all registered credit cards');
    const transactions = await transactionsPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    
    const uniqueCards = new Set(transactions.map(txn => txn.cardNumber).filter(Boolean));
    expect(uniqueCards.size).toBeGreaterThan(1);
    logger.info(`Transactions from ${uniqueCards.size} different cards displayed`);
    
    // Step 6: Verify each transaction displays complete details
    logger.info('Step 6: Verifying each transaction displays complete details');
    const firstTransaction = transactions[0];
    expect(firstTransaction.transactionId).toBeDefined();
    expect(firstTransaction.merchantName).toBeDefined();
    expect(firstTransaction.amount).toBeGreaterThan(0);
    expect(firstTransaction.date).toBeDefined();
    expect(firstTransaction.cardNumber).toBeDefined();
    logger.info(`Sample transaction: ${firstTransaction.transactionId}, ${firstTransaction.merchantName}, $${firstTransaction.amount}, ${firstTransaction.date}, ${firstTransaction.cardNumber}`);
    
    // Step 7: Navigate to next page
    logger.info('Step 7: Navigating to next page using pagination controls');
    const hasNextPage = await transactionsPage.hasNextPage();
    if (hasNextPage) {
      await transactionsPage.clickNextPage();
      await transactionsPage.waitForTransactionListToLoad();
      logger.info('Successfully navigated to page 2');
    } else {
      logger.info('Only one page of transactions available');
    }
    
    // Step 8: Verify pagination controls
    logger.info('Step 8: Verifying pagination controls display correctly');
    const paginationInfo = await transactionsPage.getPaginationInfo();
    expect(paginationInfo.currentPage).toBeGreaterThan(0);
    expect(paginationInfo.totalPages).toBeGreaterThan(0);
    logger.info(`Pagination: Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`);
    
    logger.info('Test QE-9369 TS-001 TC-001 completed successfully');
  });

  test('QE-9369 TS-002 TC-001 - Verify appropriate error message when transaction service is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-9369 TS-002 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1-2: Configure service unavailability simulation
    logger.info('Step 1-2: Configuring transaction service unavailability simulation');
    await page.route('**/api/transactions*', async route => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.login('testuser_multi_cards_txns', 'Test@123');
    
    // Step 3-4: Navigate to Transaction Management interface
    logger.info('Step 3-4: Navigating to Transaction Management interface');
    await transactionsPage.navigateToTransactions();
    
    // Step 5-6: Verify error message is displayed
    logger.info('Step 5-6: Verifying appropriate error message is displayed');
    const errorMessage = await transactionsPage.getErrorMessage();
    expect(errorMessage).toMatch(/failed to load transactions|service.*unavailable|temporarily unavailable/i);
    logger.info(`Error message displayed: ${errorMessage}`);
    
    logger.info('Test QE-9369 TS-002 TC-001 completed successfully');
  });

  test('QE-9369 TS-003 TC-001 - Verify empty transaction list with message for user with no transactions', async ({ page }) => {
    logger.info('Starting test: QE-9369 TS-003 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1-3: Launch, authenticate, and navigate
    logger.info('Step 1-3: Launching and navigating as testuser_no_transactions');
    await transactionsPage.navigate();
    await transactionsPage.login('testuser_no_transactions', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    // Step 4: Wait for transaction list to load
    logger.info('Step 4: Waiting for transaction list section to load');
    await transactionsPage.waitForTransactionListToLoad();
    
    // Step 5: Verify transaction list is empty
    logger.info('Step 5: Verifying transaction list is empty');
    const transactions = await transactionsPage.getTransactionList();
    expect(transactions.length).toBe(0);
    logger.info('Transaction list is empty as expected');
    
    // Step 6: Verify no transactions message
    logger.info('Step 6: Verifying no transactions available message');
    const message = await transactionsPage.getNoTransactionsMessage();
    expect(message).toMatch(/no transactions available|start using your credit cards/i);
    logger.info(`Message displayed: ${message}`);
    
    logger.info('Test QE-9369 TS-003 TC-001 completed successfully');
  });

  test('QE-9368 TS-001 TC-001 - Verify multi-criteria filtering with large transaction history completes within 500ms', async ({ page }) => {
    logger.info('Starting test: QE-9368 TS-001 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1-3: Launch, authenticate, and navigate
    logger.info('Step 1-3: Launching and navigating as testuser_large_history');
    await transactionsPage.navigate();
    await transactionsPage.login('testuser_large_history', 'Test@123');
    await transactionsPage.navigateToTransactions();
    await transactionsPage.waitForTransactionListToLoad();
    
    // Step 4: Enter search text
    logger.info('Step 4: Entering search text "Starbucks"');
    await transactionsPage.enterSearchText('Starbucks');
    
    // Step 5: Select specific card filter
    logger.info('Step 5: Selecting card filter "card-001"');
    await transactionsPage.selectCardFilter('card-001');
    
    // Step 6: Set date range filter
    logger.info('Step 6: Setting date range filter (last 30 days)');
    await transactionsPage.setDateRangeFilter('2026-05-15', '2026-06-14');
    
    // Step 7-9: Record filter operation time
    logger.info('Step 7-9: Applying filters and measuring performance');
    const startTime = Date.now();
    await transactionsPage.applyFilters();
    await transactionsPage.waitForFilterResults();
    const filterTime = Date.now() - startTime;
    
    logger.info(`Filter operation completed in ${filterTime}ms`);
    expect(filterTime).toBeLessThanOrEqual(500);
    
    // Step 10: Verify filtered results
    logger.info('Step 10: Verifying filtered results match all criteria');
    const filteredTransactions = await transactionsPage.getTransactionList();
    expect(filteredTransactions.length).toBeGreaterThan(0);
    
    for (const txn of filteredTransactions) {
      expect(txn.merchantName).toContain('Starbucks');
      expect(txn.cardId || txn.cardNumber).toContain('card-001');
      
      const txnDate = new Date(txn.date);
      const fromDate = new Date('2026-05-15');
      const toDate = new Date('2026-06-14');
      expect(txnDate >= fromDate && txnDate <= toDate).toBeTruthy();
    }
    logger.info(`${filteredTransactions.length} transactions match all filter criteria`);
    
    logger.info('Test QE-9368 TS-001 TC-001 completed successfully');
  });

  test('QE-9368 TS-002 TC-001 - Verify empty result set with message when no transactions match search criteria', async ({ page }) => {
    logger.info('Starting test: QE-9368 TS-002 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1-3: Launch, authenticate, and navigate
    logger.info('Step 1-3: Launching and navigating as testuser_multi_cards_txns');
    await transactionsPage.navigate();
    await transactionsPage.login('testuser_multi_cards_txns', 'Test@123');
    await transactionsPage.navigateToTransactions();
    await transactionsPage.waitForTransactionListToLoad();
    
    // Step 4: Enter non-existent search term
    logger.info('Step 4: Entering non-existent search term "NonExistentMerchant123"');
    await transactionsPage.enterSearchText('NonExistentMerchant123');
    
    // Step 5: Apply search filter
    logger.info('Step 5: Applying search filter');
    await transactionsPage.applyFilters();
    await transactionsPage.waitForFilterResults();
    
    // Step 6: Verify transaction list is empty
    logger.info('Step 6: Verifying transaction list is empty');
    const transactions = await transactionsPage.getTransactionList();
    expect(transactions.length).toBe(0);
    logger.info('No transactions displayed as expected');
    
    // Step 7: Verify no matching results message
    logger.info('Step 7: Verifying no matching results message');
    const message = await transactionsPage.getNoMatchingResultsMessage();
    expect(message).toMatch(/no transactions match|try a different search|adjust your filters/i);
    logger.info(`Message displayed: ${message}`);
    
    logger.info('Test QE-9368 TS-002 TC-001 completed successfully');
  });

  test('QE-9368 TS-003 TC-001 - Verify date range filtering with chronological sorting completes within 500ms', async ({ page }) => {
    logger.info('Starting test: QE-9368 TS-003 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1-3: Launch, authenticate, and navigate
    logger.info('Step 1-3: Launching and navigating as testuser_multi_months');
    await transactionsPage.navigate();
    await transactionsPage.login('testuser_multi_months', 'Test@123');
    await transactionsPage.navigateToTransactions();
    await transactionsPage.waitForTransactionListToLoad();
    
    // Step 4-5: Set date range filter
    logger.info('Step 4-5: Setting date range filter (2026-01-01 to 2026-01-31)');
    await transactionsPage.setDateRangeFilter('2026-01-01', '2026-01-31');
    
    // Step 6-8: Apply filter and measure performance
    logger.info('Step 6-8: Applying date range filter and measuring performance');
    const startTime = Date.now();
    await transactionsPage.applyFilters();
    await transactionsPage.waitForFilterResults();
    const filterTime = Date.now() - startTime;
    
    logger.info(`Filter operation completed in ${filterTime}ms`);
    expect(filterTime).toBeLessThanOrEqual(500);
    
    // Step 9: Verify filtered results are within date range
    logger.info('Step 9: Verifying filtered results are within specified date range');
    const filteredTransactions = await transactionsPage.getTransactionList();
    expect(filteredTransactions.length).toBeGreaterThan(0);
    
    const fromDate = new Date('2026-01-01');
    const toDate = new Date('2026-01-31');
    
    for (const txn of filteredTransactions) {
      const txnDate = new Date(txn.date);
      expect(txnDate >= fromDate && txnDate <= toDate).toBeTruthy();
    }
    logger.info(`${filteredTransactions.length} transactions within date range`);
    
    // Step 10: Verify chronological sorting
    logger.info('Step 10: Verifying transactions are sorted chronologically');
    for (let i = 0; i < filteredTransactions.length - 1; i++) {
      const currentDate = new Date(filteredTransactions[i].date);
      const nextDate = new Date(filteredTransactions[i + 1].date);
      // Assuming ascending order (earliest to latest)
      expect(currentDate <= nextDate).toBeTruthy();
    }
    logger.info('Transactions are sorted chronologically');
    
    logger.info('Test QE-9368 TS-003 TC-001 completed successfully');
  });

});