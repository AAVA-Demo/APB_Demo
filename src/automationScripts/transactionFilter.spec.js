const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { Logger } = require('../utils/logger');

test.describe('Transaction Search and Filtering - QE-8455', () => {
  let transactionPage;
  const logger = new Logger();

  test.beforeEach(async ({ page }) => {
    transactionPage = new TransactionPage(page);
    await transactionPage.navigate();
    logger.info('Navigated to transaction page');
  });

  test('QE-8455 TS-001 TC-001: Verify date range filter returns only transactions within last 30 days and completes within 1 second', async () => {
    logger.info('Starting test: Date range filter validation');
    
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 30);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = currentDate.toISOString().split('T')[0];
    
    logger.info(`Date range: ${startDateStr} to ${endDateStr}`);
    
    const startTime = Date.now();
    await transactionPage.applyDateRangeFilter(startDateStr, endDateStr);
    const responseTime = Date.now() - startTime;
    
    logger.info(`Response time: ${responseTime}ms`);
    expect(responseTime).toBeLessThanOrEqual(1000);
    
    await transactionPage.waitForTransactionsToLoad();
    const transactions = await transactionPage.getDisplayedTransactions();
    
    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
      expect(txnDate.getTime()).toBeLessThanOrEqual(currentDate.getTime());
    }
    
    logger.info(`Validated ${transactions.length} transactions within date range`);
  });

  test('QE-8455 TS-002 TC-001: Verify system rejects filter with end date before start date', async () => {
    logger.info('Starting test: Invalid date range validation');
    
    const startDate = '2024-12-01';
    const endDate = '2024-11-01';
    
    await transactionPage.applyDateRangeFilter(startDate, endDate);
    
    const errorMessage = await transactionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.toLowerCase()).toContain('end date');
    
    logger.info(`Error message validated: ${errorMessage}`);
  });

  test('QE-8455 TS-002 TC-002: Verify system rejects filter with negative amount values', async () => {
    logger.info('Starting test: Negative amount validation');
    
    await transactionPage.applyAmountFilter(-50, 100);
    
    const errorMessage = await transactionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.toLowerCase()).toContain('non-negative');
    
    logger.info(`Error message validated: ${errorMessage}`);
  });

  test('QE-8455 TS-002 TC-003: Verify system rejects filter with non-numeric amount values', async () => {
    logger.info('Starting test: Non-numeric amount validation');
    
    await transactionPage.fillAmountFilterField('minAmount', 'abc');
    await transactionPage.fillAmountFilterField('maxAmount', '!@#');
    await transactionPage.clickApplyFilters();
    
    const errorMessage = await transactionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.toLowerCase()).toContain('numeric');
    
    logger.info(`Error message validated: ${errorMessage}`);
  });

  test('QE-8455 TS-003 TC-001: Verify multiple simultaneous filters return only matching transactions using AND logic', async () => {
    logger.info('Starting test: Multiple filters with AND logic');
    
    await transactionPage.applyDateRangeFilter('2024-11-01', '2024-12-15');
    await transactionPage.applyMerchantFilter('Starbucks');
    await transactionPage.applyCategoryFilter('Food & Dining');
    await transactionPage.applyCardFilter('CARD1');
    await transactionPage.clickApplyFilters();
    
    await transactionPage.waitForTransactionsToLoad();
    const transactions = await transactionPage.getDisplayedTransactions();
    
    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(new Date('2024-11-01').getTime());
      expect(txnDate.getTime()).toBeLessThanOrEqual(new Date('2024-12-15').getTime());
      expect(txn.merchant.toLowerCase()).toContain('starbucks');
      expect(txn.category).toBe('Food & Dining');
      expect(txn.cardId).toBe('CARD1');
    }
    
    logger.info(`Validated ${transactions.length} transactions matching all criteria`);
  });
});
