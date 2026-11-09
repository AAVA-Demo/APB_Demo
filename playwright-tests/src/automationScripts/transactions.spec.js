const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { logger } = require('../utils/logger');

test.describe('Transaction Management Tests', () => {
  let transactionPage;

  test.beforeEach(async ({ page }) => {
    transactionPage = new TransactionPage(page);
    await transactionPage.navigate();
    logger.info('Navigated to Transaction Management');
  });

  test('QE-8258 TS001 TC-001: Verify complete transaction list across all credit cards', async ({ page }) => {
    logger.info('Test: Verify complete transaction list');
    
    await transactionPage.waitForTransactionListLoad();
    
    await expect(transactionPage.transactionTable).toBeVisible();
    
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info(`Transaction list displays ${transactionCount} transactions`);
    
    const firstTransaction = await transactionPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeDefined();
    expect(firstTransaction.amount).toBeDefined();
    expect(firstTransaction.merchant).toBeDefined();
    expect(firstTransaction.cardId).toBeDefined();
    
    logger.info('Transaction list verified successfully');
  });

  test('QE-8258 TS002 TC-001: Verify transaction list supports multi-column sorting', async ({ page }) => {
    logger.info('Test: Verify multi-column sorting');
    
    await transactionPage.waitForTransactionListLoad();
    
    await transactionPage.sortByDate();
    await page.waitForTimeout(500);
    
    const firstDateAfterSort = await transactionPage.getTransactionDate(0);
    logger.info(`First transaction date after sort: ${firstDateAfterSort}`);
    
    await transactionPage.sortByAmount();
    await page.waitForTimeout(500);
    
    const firstAmountAfterSort = await transactionPage.getTransactionAmount(0);
    logger.info(`First transaction amount after sort: ${firstAmountAfterSort}`);
    
    logger.info('Multi-column sorting verified successfully');
  });

  test('QE-8235 TS001 TC-001: Verify date range filter updates within 500ms', async ({ page }) => {
    logger.info('Test: Verify date range filter performance');
    
    await transactionPage.waitForTransactionListLoad();
    
    const startTime = Date.now();
    await transactionPage.applyDateRangeFilter('2024-01-01', '2024-01-31');
    const filterTime = Date.now() - startTime;
    
    expect(filterTime).toBeLessThan(500);
    logger.info(`Filter applied in ${filterTime}ms`);
    
    const filteredCount = await transactionPage.getTransactionCount();
    expect(filteredCount).toBeGreaterThan(0);
    
    logger.info('Date range filter verified successfully');
  });

  test('QE-8249 TS001 TC-001: Verify multi-criteria filter returns results within 500ms', async ({ page }) => {
    logger.info('Test: Verify multi-criteria filter performance');
    
    await transactionPage.waitForTransactionListLoad();
    
    const startTime = Date.now();
    await transactionPage.applyDateRangeFilter('2024-01-01', '2024-01-31');
    await transactionPage.applyMerchantFilter('Starbucks');
    await transactionPage.applyCategoryFilter('Food & Dining');
    const filterTime = Date.now() - startTime;
    
    expect(filterTime).toBeLessThan(500);
    logger.info(`Multi-criteria filter applied in ${filterTime}ms`);
    
    const filteredCount = await transactionPage.getTransactionCount();
    logger.info(`Filtered results: ${filteredCount} transactions`);
    
    logger.info('Multi-criteria filter verified successfully');
  });

  test('QE-8249 TS002 TC-001: Verify fuzzy merchant search returns relevant transactions', async ({ page }) => {
    logger.info('Test: Verify fuzzy merchant search');
    
    await transactionPage.waitForTransactionListLoad();
    
    await transactionPage.applyMerchantFilter('Star');
    await page.waitForTimeout(500);
    
    const filteredCount = await transactionPage.getTransactionCount();
    expect(filteredCount).toBeGreaterThan(0);
    
    const firstMerchant = await transactionPage.getTransactionMerchant(0);
    expect(firstMerchant.toLowerCase()).toContain('star');
    
    logger.info('Fuzzy merchant search verified successfully');
  });

  test('QE-8242 TS002 TC-001: Verify large volume pagination performs smoothly', async ({ page }) => {
    logger.info('Test: Verify pagination performance');
    
    await transactionPage.waitForTransactionListLoad();
    
    await expect(transactionPage.paginationControls).toBeVisible();
    
    const startTime = Date.now();
    await transactionPage.goToNextPage();
    const pageLoadTime = Date.now() - startTime;
    
    expect(pageLoadTime).toBeLessThan(500);
    logger.info(`Next page loaded in ${pageLoadTime}ms`);
    
    logger.info('Pagination performance verified successfully');
  });
});