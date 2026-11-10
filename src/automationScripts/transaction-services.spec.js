const { test, expect } = require('@playwright/test');
const { TransactionServicePage } = require('./pages/transaction-service.page');
const { Logger } = require('../utils/logger');

test.describe('Transaction Service - Search and Filtering', () => {
  let transactionPage;
  const logger = new Logger('TransactionServicesSpec');

  test.beforeEach(async ({ page }) => {
    transactionPage = new TransactionServicePage(page);
    logger.info('Test setup completed');
  });

  test('[QE-10368 TS-001 TC-001] Verify date range filtering within 1 second', async () => {
    logger.info('Starting test: Date range filtering performance');
    
    // Step 1: Initialize with 50 transactions spanning 90 days
    await transactionPage.initializeTransactionsSpanning90Days(50);
    logger.info('50 transactions initialized across 90 days');
    
    // Step 2: Create date range filter
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const filter = { startDate: thirtyDaysAgo, endDate: today };
    logger.info('Date range filter created: last 30 days');
    
    // Step 3: Start performance timer
    const startTime = Date.now();
    logger.info('Performance timer started');
    
    // Step 4: Get transactions with filter
    const result = await transactionPage.getTransactions(1, 50, filter);
    logger.info('Transactions retrieved with date filter');
    
    // Step 5: Verify execution time <= 1 second
    const executionTime = Date.now() - startTime;
    expect(executionTime).toBeLessThanOrEqual(1000);
    logger.info(`Execution time: ${executionTime}ms (within 1 second)`);
    
    // Step 6: Verify date range filtering
    for (const txn of result.transactions) {
      const txnDate = new Date(txn.transactionDate);
      expect(txnDate >= thirtyDaysAgo && txnDate <= today).toBe(true);
    }
    logger.info('All transactions within date range');
    
    // Step 7: Verify transaction count
    const expectedCount = await transactionPage.countTransactionsInDateRange(thirtyDaysAgo, today);
    expect(result.transactions.length).toBe(expectedCount);
    logger.info(`Transaction count verified: ${expectedCount}`);
    
    // Step 8: Verify no transactions outside range
    await transactionPage.verifyNoTransactionsOutsideRange(result.transactions, filter);
    logger.info('Confirmed no transactions outside date range');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10368 TS-002 TC-001] Verify category filtering', async () => {
    logger.info('Starting test: Category filtering');
    
    // Step 1: Initialize with transactions across categories
    await transactionPage.initializeTransactionsByCategory({
      'Food & Dining': 10,
      'Fuel': 5,
      'Shopping': 8
    });
    logger.info('23 transactions initialized across 3 categories');
    
    // Step 2: Create category filter
    const filter = { category: 'Food & Dining' };
    logger.info('Category filter created: Food & Dining');
    
    // Step 3: Validate filter
    await transactionPage.validateFilter(filter);
    logger.info('Filter validated successfully');
    
    // Step 4: Get transactions with filter
    const result = await transactionPage.getTransactions(1, 50, filter);
    logger.info('Transactions retrieved with category filter');
    
    // Step 5: Verify transaction count
    expect(result.transactions.length).toBe(10);
    logger.info('Transaction count verified: 10');
    
    // Step 6: Verify all transactions have correct category
    for (const txn of result.transactions) {
      expect(txn.category).toBe('Food & Dining');
    }
    logger.info('All transactions have category: Food & Dining');
    
    // Step 7: Verify no other categories included
    const otherCategories = result.transactions.filter(t => t.category !== 'Food & Dining');
    expect(otherCategories.length).toBe(0);
    logger.info('No Fuel or Shopping transactions in result');
    
    // Step 8: Verify totalCount
    expect(result.totalCount).toBe(10);
    logger.info('Total count verified: 10');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10368 TS-003 TC-001] Verify invalid date range validation', async () => {
    logger.info('Starting test: Invalid date range validation');
    
    // Step 1: Create invalid filter
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const invalidFilter = { startDate: today, endDate: thirtyDaysAgo };
    logger.info('Invalid filter created: startDate > endDate');
    
    // Step 2: Attempt to validate filter
    let errorThrown = false;
    let errorMessage = '';
    try {
      await transactionPage.validateFilter(invalidFilter);
    } catch (error) {
      errorThrown = true;
      errorMessage = error.message;
    }
    logger.info('Validation attempted');
    
    // Step 3: Verify error thrown
    expect(errorThrown).toBe(true);
    logger.info('Validation error thrown');
    
    // Step 4: Verify error message
    expect(errorMessage).toBe('Start date must be before end date');
    logger.info('Error message verified');
    
    // Step 5: Verify transaction service not invoked
    const serviceInvoked = await transactionPage.wasServiceInvoked();
    expect(serviceInvoked).toBe(false);
    logger.info('Transaction service not invoked');
    
    // Step 6: Verify no query executed
    const queryExecuted = await transactionPage.wasQueryExecuted();
    expect(queryExecuted).toBe(false);
    logger.info('No database query executed');
    
    // Step 7: Verify error propagation
    await transactionPage.verifyErrorPropagation(errorMessage);
    logger.info('Error properly propagated for user notification');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10366 TS-001 TC-001] Verify multi-card transaction aggregation', async () => {
    logger.info('Starting test: Multi-card transaction aggregation');
    
    // Step 1: Initialize with transactions from 3 cards
    await transactionPage.initializeTransactionsByCard({
      'CC001': 5,
      'CC002': 7,
      'CC003': 6
    });
    logger.info('18 transactions initialized across 3 cards');
    
    // Step 2: Get all transactions
    const result = await transactionPage.getTransactions(1, 50, {});
    logger.info('All transactions retrieved');
    
    // Step 3: Verify transaction count
    expect(result.transactions.length).toBe(18);
    logger.info('Transaction count verified: 18');
    
    // Step 4: Verify cardId field present
    for (const txn of result.transactions) {
      expect(txn).toHaveProperty('cardId');
    }
    logger.info('All transactions have cardId field');
    
    // Step 5: Verify cardNumber field present
    for (const txn of result.transactions) {
      expect(txn).toHaveProperty('cardNumber');
      expect(txn.cardNumber).toMatch(/\*{4}/); // Masked format
    }
    logger.info('All transactions have masked cardNumber field');
    
    // Step 6: Verify transaction distribution
    const cc001Txns = result.transactions.filter(t => t.cardId === 'CC001');
    const cc002Txns = result.transactions.filter(t => t.cardId === 'CC002');
    const cc003Txns = result.transactions.filter(t => t.cardId === 'CC003');
    expect(cc001Txns.length).toBe(5);
    expect(cc002Txns.length).toBe(7);
    expect(cc003Txns.length).toBe(6);
    logger.info('Transaction distribution verified: CC001=5, CC002=7, CC003=6');
    
    // Step 7: Verify no data loss
    await transactionPage.verifyAllTransactionFieldsPreserved(result.transactions);
    logger.info('All transaction fields preserved');
    
    // Step 8: Verify card identification
    await transactionPage.verifyCardIdentification(result.transactions);
    logger.info('Each transaction traceable to source card');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10366 TS-002 TC-001] Verify pagination with sorted results', async () => {
    logger.info('Starting test: Pagination with sorted results');
    
    // Step 1: Initialize with 50 transactions
    await transactionPage.initializeTransactionsForMultipleCards(50);
    logger.info('50 transactions initialized');
    
    // Step 2: Get first page
    const result = await transactionPage.getTransactions(1, 20, {});
    logger.info('First page retrieved with pageSize=20');
    
    // Step 3: Verify page size
    expect(result.transactions.length).toBe(20);
    logger.info('Page contains 20 transactions');
    
    // Step 4: Verify descending date order
    await transactionPage.verifyDescendingDateOrder(result.transactions);
    logger.info('Transactions sorted by date descending');
    
    // Step 5: Verify hasMore flag
    expect(result.hasMore).toBe(true);
    logger.info('hasMore flag verified: true');
    
    // Step 6: Verify totalCount
    expect(result.totalCount).toBe(50);
    logger.info('Total count verified: 50');
    
    // Step 7: Verify pageNumber
    expect(result.pageNumber).toBe(1);
    logger.info('Page number verified: 1');
    
    // Step 8: Verify pageSize
    expect(result.pageSize).toBe(20);
    logger.info('Page size verified: 20');
    
    logger.info('Test completed successfully');
  });

  test('[QE-10366 TS-003 TC-001] Verify empty transaction list handling', async () => {
    logger.info('Starting test: Empty transaction list handling');
    
    // Step 1: Initialize with no transactions
    await transactionPage.initializeEmptyTransactionList();
    logger.info('Empty transaction list initialized');
    
    // Step 2: Get transactions
    const result = await transactionPage.getTransactions(1, 20, {});
    logger.info('Transaction retrieval attempted');
    
    // Step 3: Verify valid response
    expect(result).toBeDefined();
    logger.info('Valid response object returned');
    
    // Step 4: Verify empty transactions array
    expect(result.transactions).toEqual([]);
    expect(result.transactions.length).toBe(0);
    logger.info('Transactions array is empty');
    
    // Step 5: Verify totalCount = 0
    expect(result.totalCount).toBe(0);
    logger.info('Total count verified: 0');
    
    // Step 6: Verify hasMore = false
    expect(result.hasMore).toBe(false);
    logger.info('hasMore flag verified: false');
    
    // Step 7: Verify graceful handling
    await transactionPage.verifyGracefulEmptyStateHandling(result);
    logger.info('Graceful empty state handling confirmed');
    
    logger.info('Test completed successfully');
  });
});
