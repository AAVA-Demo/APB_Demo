const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { Logger } = require('../utils/logger');

test.describe('Transaction Management and Multi-card Transaction View', () => {
  let transactionsPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    logger = new Logger('TransactionTests');
    transactionsPage = new TransactionsPage(page);
    await transactionsPage.navigate();
    logger.info('Navigated to Transactions page');
  });

  // Test Case: QE-7656 TS-001 TC-001
  test('TC-001: Verify transaction listing displays all 15 transactions with complete details across three credit cards', async () => {
    logger.info('Starting TC-001: Transaction listing test');
    
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify transaction count
    const transactionCount = await transactionsPage.getTransactionCount();
    logger.info(`Transaction Count: ${transactionCount}`);
    await expect(transactionCount).toBe(15);
    
    // Verify all transactions have complete fields
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    logger.info(`First Transaction: ${JSON.stringify(firstTransaction)}`);
    await expect(firstTransaction.date).toBeTruthy();
    await expect(firstTransaction.merchant).toBeTruthy();
    await expect(firstTransaction.amount).toBeTruthy();
    await expect(firstTransaction.category).toBeTruthy();
    await expect(firstTransaction.cardId).toBeTruthy();
    await expect(firstTransaction.status).toBeTruthy();
    await expect(firstTransaction.description).toBeTruthy();
    
    // Verify transactions from all three cards are present
    const cardIds = await transactionsPage.getAllCardIds();
    logger.info(`Card IDs found: ${cardIds.join(', ')}`);
    await expect(cardIds).toContain('CC001');
    await expect(cardIds).toContain('CC002');
    await expect(cardIds).toContain('CC003');
    
    // Verify date range spans two months
    const dates = await transactionsPage.getAllTransactionDates();
    const hasJanuary = dates.some(date => date.includes('01/') || date.includes('Jan'));
    const hasFebruary = dates.some(date => date.includes('02/') || date.includes('Feb'));
    await expect(hasJanuary && hasFebruary).toBe(true);
    
    logger.info('TC-001 completed successfully');
  });

  // Test Case: QE-7656 TS-002 TC-001
  test('TC-002: Verify system handles empty transaction list gracefully', async () => {
    logger.info('Starting TC-002: Empty transaction list test');
    
    // Load empty transaction data
    await transactionsPage.loadEmptyTransactionData();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify transaction count is 0
    const transactionCount = await transactionsPage.getTransactionCount();
    await expect(transactionCount).toBe(0);
    
    // Verify no error message is displayed
    const hasError = await transactionsPage.hasErrorMessage();
    await expect(hasError).toBe(false);
    
    // Verify loading state is false
    const isLoading = await transactionsPage.isLoadingIndicatorVisible();
    await expect(isLoading).toBe(false);
    
    // Verify empty state message is displayed
    const emptyMessage = await transactionsPage.getEmptyStateMessage();
    await expect(emptyMessage).toContain('No transactions');
    
    logger.info('TC-002 completed successfully');
  });

  // Test Case: QE-7656 TS-003 TC-001
  test('TC-003: Verify system displays transactions with different statuses (Completed, Pending, Failed)', async () => {
    logger.info('Starting TC-003: Transaction status test');
    
    // Load transactions with various statuses
    await transactionsPage.loadMixedStatusTransactionData();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify total transaction count
    const transactionCount = await transactionsPage.getTransactionCount();
    await expect(transactionCount).toBe(10);
    
    // Verify Completed transactions
    const completedCount = await transactionsPage.getTransactionCountByStatus('Completed');
    logger.info(`Completed transactions: ${completedCount}`);
    await expect(completedCount).toBe(5);
    
    // Verify Pending transactions
    const pendingCount = await transactionsPage.getTransactionCountByStatus('Pending');
    logger.info(`Pending transactions: ${pendingCount}`);
    await expect(pendingCount).toBe(3);
    
    // Verify Failed transactions
    const failedCount = await transactionsPage.getTransactionCountByStatus('Failed');
    logger.info(`Failed transactions: ${failedCount}`);
    await expect(failedCount).toBe(2);
    
    // Verify each transaction has valid status
    const allStatuses = await transactionsPage.getAllTransactionStatuses();
    allStatuses.forEach(status => {
      expect(['Completed', 'Pending', 'Failed']).toContain(status);
    });
    
    logger.info('TC-003 completed successfully');
  });

  // Test Case: QE-7651 TS-001 TC-001
  test('TC-004: Verify card filter correctly filters transactions by selected card ID (CC001)', async () => {
    logger.info('Starting TC-004: Card filter test');
    
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify initial transaction count
    const initialCount = await transactionsPage.getTransactionCount();
    logger.info(`Initial transaction count: ${initialCount}`);
    await expect(initialCount).toBe(15);
    
    // Apply card filter for CC001
    await transactionsPage.selectCardFilter('CC001');
    await transactionsPage.clickApplyFilter();
    await transactionsPage.waitForFilteredResults();
    
    // Verify filtered transaction count
    const filteredCount = await transactionsPage.getTransactionCount();
    logger.info(`Filtered transaction count: ${filteredCount}`);
    await expect(filteredCount).toBe(5);
    
    // Verify all transactions belong to CC001
    const cardIds = await transactionsPage.getAllCardIds();
    cardIds.forEach(cardId => {
      expect(cardId).toBe('CC001');
    });
    
    // Verify no transactions from CC002 or CC003
    await expect(cardIds).not.toContain('CC002');
    await expect(cardIds).not.toContain('CC003');
    
    logger.info('TC-004 completed successfully');
  });

  // Test Case: QE-7651 TS-002 TC-001
  test('TC-005: Verify system handles filter for non-existent card ID gracefully', async () => {
    logger.info('Starting TC-005: Non-existent card filter test');
    
    await transactionsPage.waitForTransactionsLoad();
    
    // Apply filter for non-existent card
    await transactionsPage.selectCardFilter('CC999');
    await transactionsPage.clickApplyFilter();
    await transactionsPage.waitForFilteredResults();
    
    // Verify filtered transaction count is 0
    const filteredCount = await transactionsPage.getTransactionCount();
    await expect(filteredCount).toBe(0);
    
    // Verify no error is thrown
    const hasError = await transactionsPage.hasErrorMessage();
    await expect(hasError).toBe(false);
    
    // Verify empty state message
    const emptyMessage = await transactionsPage.getEmptyStateMessage();
    await expect(emptyMessage).toContain('No transactions found');
    
    logger.info('TC-005 completed successfully');
  });

  // Test Case: QE-7651 TS-003 TC-001
  test('TC-006: Verify clear filter functionality resets all filter fields and restores full transaction list', async () => {
    logger.info('Starting TC-006: Clear filter test');
    
    await transactionsPage.waitForTransactionsLoad();
    
    // Apply multiple filters
    await transactionsPage.selectCardFilter('CC001');
    await transactionsPage.selectCategoryFilter('Food & Dining');
    await transactionsPage.setStartDate('2024-01-01');
    await transactionsPage.setEndDate('2024-01-31');
    await transactionsPage.clickApplyFilter();
    await transactionsPage.waitForFilteredResults();
    
    // Verify filtered count is less than total
    const filteredCount = await transactionsPage.getTransactionCount();
    logger.info(`Filtered count: ${filteredCount}`);
    await expect(filteredCount).toBeLessThan(15);
    
    // Click clear filter
    await transactionsPage.clickClearFilter();
    await transactionsPage.waitForFilteredResults();
    
    // Verify all filter fields are reset
    const cardFilter = await transactionsPage.getSelectedCardFilter();
    await expect(cardFilter).toBe('');
    
    const categoryFilter = await transactionsPage.getSelectedCategoryFilter();
    await expect(categoryFilter).toBe('');
    
    const startDate = await transactionsPage.getStartDate();
    await expect(startDate).toBe('');
    
    const endDate = await transactionsPage.getEndDate();
    await expect(endDate).toBe('');
    
    // Verify full transaction list is restored
    const restoredCount = await transactionsPage.getTransactionCount();
    await expect(restoredCount).toBe(15);
    
    logger.info('TC-006 completed successfully');
  });
});