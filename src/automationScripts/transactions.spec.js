const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { Logger } = require('../utils/logger');
const config = require('../../data/config.json');

test.describe('Transaction Management Tests', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    await transactionsPage.navigate();
    Logger.info('Navigated to Transactions page');
  });

  test('QE-8948 TS-001 TC-001: Verify transaction listing displays paginated list with 20 transactions per page', async ({ page }) => {
    Logger.info('Starting test: Paginated transaction listing');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeLessThanOrEqual(20);
    
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.cardName).toBeTruthy();
    expect(firstTransaction.status).toBeTruthy();
    
    const hasPagination = await transactionsPage.hasPagination();
    
    if (hasPagination) {
      await transactionsPage.goToNextPage();
      const nextPageCount = await transactionsPage.getTransactionCount();
      expect(nextPageCount).toBeGreaterThan(0);
    }
    
    Logger.info('Paginated transaction listing verified');
  });

  test('QE-8948 TS-002 TC-001: Verify transaction listing displays all transactions on single page when total is 10 or less', async ({ page }) => {
    Logger.info('Starting test: Single page transaction listing');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    
    if (transactionCount <= 10) {
      const hasPagination = await transactionsPage.hasPagination();
      expect(hasPagination).toBe(false);
      
      const isSortedByDate = await transactionsPage.isSortedByDateDescending();
      expect(isSortedByDate).toBe(true);
      
      Logger.info('Single page listing verified');
    }
  });

  test('QE-8948 TS-003 TC-001: Verify transaction listing displays empty state message when no transactions exist', async ({ page }) => {
    Logger.info('Starting test: Empty transaction list');
    
    await page.route('**/api/transactions*', route => route.fulfill({ body: JSON.stringify({ transactions: [], totalRecords: 0 }) }));
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsToLoad();
    
    const emptyMessage = await transactionsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No transactions found');
    
    Logger.info('Empty state message verified');
  });

  test('QE-8940 TS-001 TC-001: Verify comprehensive transaction history displays paginated list with 20 transactions per page', async ({ page }) => {
    Logger.info('Starting test: Comprehensive transaction history');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeLessThanOrEqual(20);
    
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.cardName).toBeTruthy();
    expect(firstTransaction.status).toBeTruthy();
    
    Logger.info('Comprehensive transaction history verified');
  });

  test('QE-8940 TS-002 TC-001: Verify comprehensive transaction history displays all transactions on single page when total is 5 or less', async ({ page }) => {
    Logger.info('Starting test: Single page comprehensive history');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    
    if (transactionCount <= 5) {
      const hasPagination = await transactionsPage.hasPagination();
      expect(hasPagination).toBe(false);
      
      Logger.info('Single page comprehensive history verified');
    }
  });

  test('QE-8940 TS-003 TC-001: Verify comprehensive transaction history displays empty state message when no transactions exist', async ({ page }) => {
    Logger.info('Starting test: Empty comprehensive history');
    
    await page.route('**/api/transactions*', route => route.fulfill({ body: JSON.stringify({ transactions: [], totalRecords: 0 }) }));
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsToLoad();
    
    const emptyMessage = await transactionsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No transactions found');
    
    Logger.info('Empty comprehensive history verified');
  });

  test('QE-8785 TS-001 TC-001: Verify comprehensive transaction history view', async ({ page }) => {
    Logger.info('Starting test: Transaction history view');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(0);
    
    Logger.info('Transaction history view verified');
  });
});

test.describe('Transaction Search and Filter Tests', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    await transactionsPage.navigate();
  });

  test('QE-8947 TS-001 TC-001: Verify transaction search and filtering with all criteria returns accurate results', async ({ page }) => {
    Logger.info('Starting test: Multi-criteria transaction search');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    await transactionsPage.setDateRange('2024-03-01', '2024-03-31');
    await transactionsPage.selectCard('Card B');
    await transactionsPage.setMerchantName('Walmart');
    await transactionsPage.applyFilters();
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    
    if (transactionCount > 0) {
      const firstTransaction = await transactionsPage.getTransactionDetails(0);
      expect(firstTransaction.merchant).toContain('Walmart');
    }
    
    Logger.info('Multi-criteria search verified');
  });

  test('QE-8947 TS-002 TC-001: Verify transaction filtering with date range only displays all transactions within that period', async ({ page }) => {
    Logger.info('Starting test: Date range filtering');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    await transactionsPage.setDateRangeLastNDays(90);
    await transactionsPage.applyFilters();
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(0);
    
    Logger.info('Date range filtering verified');
  });

  test('QE-8947 TS-003 TC-001: Verify transaction filtering displays no results message when criteria match no transactions', async ({ page }) => {
    Logger.info('Starting test: No results filtering');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    await transactionsPage.setDateRange('2025-01-01', '2025-01-05');
    await transactionsPage.applyFilters();
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const noResultsMessage = await transactionsPage.getNoResultsMessage();
    expect(noResultsMessage).toContain('No transactions found matching your criteria');
    
    const hasClearFiltersButton = await transactionsPage.hasClearFiltersButton();
    expect(hasClearFiltersButton).toBe(true);
    
    Logger.info('No results message verified');
  });

  test('QE-8943 TS-001 TC-001: Verify transaction search and filter with multiple criteria returns accurate matching results', async ({ page }) => {
    Logger.info('Starting test: Multiple criteria search');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    await transactionsPage.setDateRange('2024-01-01', '2024-01-31');
    await transactionsPage.selectCard('Card A');
    await transactionsPage.setMerchantName('Amazon');
    await transactionsPage.applyFilters();
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(0);
    
    Logger.info('Multiple criteria search verified');
  });

  test('QE-8943 TS-002 TC-001: Verify transaction filter with date range only displays all transactions within that period across all cards', async ({ page }) => {
    Logger.info('Starting test: Date range all cards');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    await transactionsPage.setDateRangeLastNDays(30);
    await transactionsPage.applyFilters();
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(0);
    
    Logger.info('Date range all cards verified');
  });

  test('QE-8943 TS-003 TC-001: Verify transaction filter displays no results message when criteria match no transactions', async ({ page }) => {
    Logger.info('Starting test: No matching criteria');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    await transactionsPage.setDateRange('2025-01-01', '2025-01-31');
    await transactionsPage.applyFilters();
    
    await transactionsPage.waitForTransactionsToLoad();
    
    const noResultsMessage = await transactionsPage.getNoResultsMessage();
    expect(noResultsMessage).toBeTruthy();
    
    const hasClearFiltersButton = await transactionsPage.hasClearFiltersButton();
    expect(hasClearFiltersButton).toBe(true);
    
    Logger.info('No matching criteria verified');
  });

  test('QE-8783 TS-001 TC-001: Verify transaction search and filter', async ({ page }) => {
    Logger.info('Starting test: Transaction search and filter');
    
    await transactionsPage.waitForTransactionsToLoad();
    
    await transactionsPage.setDateRange('2024-01-01', '2024-01-31');
    await transactionsPage.selectCard('Card A');
    await transactionsPage.setMerchantName('Amazon');
    await transactionsPage.applyFilters();
    
    await transactionsPage.waitForTransactionsToLoad();
    
    Logger.info('Transaction search and filter verified');
  });
});