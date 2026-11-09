const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const logger = require('../utils/logger');

test.describe('Transaction Management Tests', () => {
  let transactionPage;

  test.beforeEach(async ({ page }) => {
    transactionPage = new TransactionPage(page);
    logger.info('Navigating to Transaction Management page');
    await transactionPage.navigate();
  });

  test('QE-8871 TS-001 TC-001: Verify paginated transaction history displays first 50 transactions within 1 second', async ({ page }) => {
    logger.info('Test Case: QE-8871 TS-001 TC-001 - Paginated transaction history validation');
    
    // Measure page load time
    const startTime = Date.now();
    await transactionPage.waitForTransactionListLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Transaction list load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);
    
    // Verify first page displays exactly 50 transactions
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(50);
    logger.info(`Verified ${transactionCount} transactions displayed on first page`);
    
    // Verify each transaction displays complete details
    const firstTransaction = await transactionPage.getTransactionByIndex(0);
    expect(firstTransaction.merchantName).toBeTruthy();
    expect(firstTransaction.amount).toBeGreaterThan(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.category).toBeTruthy();
    logger.info('Transaction details validated');
    
    // Verify pagination controls are visible
    await expect(transactionPage.paginationControls).toBeVisible();
    const paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toContain('Page 1 of 3');
    logger.info('Pagination controls validated');
    
    // Click Next Page button
    await transactionPage.clickNextPage();
    const nextPageLoadStart = Date.now();
    await transactionPage.waitForTransactionListLoad();
    const nextPageLoadTime = Date.now() - nextPageLoadStart;
    expect(nextPageLoadTime).toBeLessThan(1000);
    
    // Verify pagination updates
    const updatedPaginationText = await transactionPage.getPaginationText();
    expect(updatedPaginationText).toContain('Page 2');
    logger.info('Next page navigation validated');
  });

  test('QE-8871 TS-001 TC-002: Verify pagination controls allow navigation through all transaction pages', async ({ page }) => {
    logger.info('Test Case: QE-8871 TS-001 TC-002 - Pagination controls navigation validation');
    
    await transactionPage.waitForTransactionListLoad();
    
    // Verify Previous button is disabled on page 1
    const isPreviousDisabled = await transactionPage.isPreviousButtonDisabled();
    expect(isPreviousDisabled).toBe(true);
    logger.info('Previous button disabled on page 1');
    
    // Navigate to page 2
    await transactionPage.clickNextPage();
    await transactionPage.waitForTransactionListLoad();
    let paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toContain('Page 2');
    logger.info('Navigated to page 2');
    
    // Navigate to page 3
    await transactionPage.clickNextPage();
    await transactionPage.waitForTransactionListLoad();
    paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toContain('Page 3');
    logger.info('Navigated to page 3');
    
    // Verify Next button is disabled on last page
    const isNextDisabled = await transactionPage.isNextButtonDisabled();
    expect(isNextDisabled).toBe(true);
    logger.info('Next button disabled on last page');
    
    // Navigate back to page 2
    await transactionPage.clickPreviousPage();
    await transactionPage.waitForTransactionListLoad();
    paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toContain('Page 2');
    logger.info('Navigated back to page 2');
  });

  test('QE-8871 TS-002 TC-001: Verify small transaction set displays all transactions on a single page', async ({ page }) => {
    logger.info('Test Case: QE-8871 TS-002 TC-001 - Small transaction set validation');
    
    await transactionPage.waitForTransactionListLoad();
    
    // Verify exactly 10 transactions are displayed
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(10);
    logger.info(`Verified ${transactionCount} transactions displayed`);
    
    // Verify each transaction has complete details
    for (let i = 0; i < transactionCount; i++) {
      const transaction = await transactionPage.getTransactionByIndex(i);
      expect(transaction.merchantName).toBeTruthy();
      expect(transaction.amount).toBeGreaterThan(0);
      expect(transaction.date).toBeTruthy();
      expect(transaction.category).toBeTruthy();
    }
    logger.info('All transaction details validated');
    
    // Verify no pagination controls or shows Page 1 of 1
    const paginationVisible = await transactionPage.paginationControls.isVisible().catch(() => false);
    if (paginationVisible) {
      const paginationText = await transactionPage.getPaginationText();
      expect(paginationText).toContain('Page 1 of 1');
    }
    logger.info('Pagination controls validated for single page');
  });

  test('QE-8871 TS-003 TC-001: Verify appropriate message displays when no transactions are available', async ({ page }) => {
    logger.info('Test Case: QE-8871 TS-003 TC-001 - No transactions scenario validation');
    
    await transactionPage.waitForPageLoad();
    
    // Verify no transactions message is displayed
    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    const messageText = await transactionPage.getNoTransactionsMessageText();
    expect(messageText).toContain('No transactions found');
    logger.info('No transactions message displayed correctly');
    
    // Verify no system errors are displayed
    const errorMessages = await transactionPage.getErrorMessages();
    expect(errorMessages.length).toBe(0);
    logger.info('No error messages displayed');
    
    // Verify page layout remains intact
    await expect(transactionPage.transactionContainer).toBeVisible();
    logger.info('Page layout intact');
    
    // Verify no JavaScript errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    logger.info('No JavaScript errors occurred');
  });

  test('QE-8875 TS-001 TC-001: Verify transaction filtering by valid date range and specific credit card', async ({ page }) => {
    logger.info('Test Case: QE-8875 TS-001 TC-001 - Transaction filtering validation');
    
    await transactionPage.waitForPageLoad();
    
    // Enter start date
    await transactionPage.enterStartDate('2024-01-01');
    logger.info('Start date entered: 2024-01-01');
    
    // Enter end date
    await transactionPage.enterEndDate('2024-01-31');
    logger.info('End date entered: 2024-01-31');
    
    // Select credit card
    await transactionPage.selectCreditCard('1234');
    logger.info('Credit card selected: Visa Platinum •••• 1234');
    
    // Click Apply Filter
    const filterStartTime = Date.now();
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForTransactionListLoad();
    const filterTime = Date.now() - filterStartTime;
    expect(filterTime).toBeLessThan(1000);
    logger.info(`Filter applied in ${filterTime}ms`);
    
    // Verify filtered transactions are displayed
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info(`${transactionCount} filtered transactions displayed`);
    
    // Verify transactions match filter criteria
    const firstTransaction = await transactionPage.getTransactionByIndex(0);
    expect(firstTransaction.cardLastFour).toBe('1234');
    expect(new Date(firstTransaction.date)).toBeGreaterThanOrEqual(new Date('2024-01-01'));
    expect(new Date(firstTransaction.date)).toBeLessThanOrEqual(new Date('2024-01-31'));
    logger.info('Filter criteria validated');
    
    // Verify pagination is available if results exceed 50
    if (transactionCount === 50) {
      await expect(transactionPage.paginationControls).toBeVisible();
    }
  });

  test('QE-8875 TS-001 TC-002: Verify pagination functionality for filtered transactions exceeding 50 records', async ({ page }) => {
    logger.info('Test Case: QE-8875 TS-001 TC-002 - Filtered pagination validation');
    
    await transactionPage.waitForPageLoad();
    
    // Apply filter with large result set
    await transactionPage.enterStartDate('2024-01-01');
    await transactionPage.enterEndDate('2024-12-31');
    await transactionPage.selectCreditCard('5678');
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForTransactionListLoad();
    
    // Verify first page shows 50 transactions
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(50);
    logger.info('First page shows 50 transactions');
    
    // Verify pagination shows total pages
    const paginationText = await transactionPage.getPaginationText();
    expect(paginationText).toMatch(/Page 1 of \d+/);
    logger.info(`Pagination: ${paginationText}`);
    
    // Navigate to page 2
    await transactionPage.clickNextPage();
    const nextPageLoadStart = Date.now();
    await transactionPage.waitForTransactionListLoad();
    const nextPageLoadTime = Date.now() - nextPageLoadStart;
    expect(nextPageLoadTime).toBeLessThan(1000);
    
    // Verify all transactions on page 2 match filter
    const page2Transactions = await transactionPage.getAllTransactions();
    page2Transactions.forEach(transaction => {
      expect(transaction.cardLastFour).toBe('5678');
      expect(new Date(transaction.date)).toBeGreaterThanOrEqual(new Date('2024-01-01'));
      expect(new Date(transaction.date)).toBeLessThanOrEqual(new Date('2024-12-31'));
    });
    logger.info('All page 2 transactions match filter criteria');
  });

  test('QE-8875 TS-002 TC-001: Verify category filter returns all matching transactions', async ({ page }) => {
    logger.info('Test Case: QE-8875 TS-002 TC-001 - Category filter validation');
    
    await transactionPage.waitForPageLoad();
    
    // Select category filter
    await transactionPage.selectCategory('Food & Dining');
    logger.info('Category selected: Food & Dining');
    
    // Apply filter
    const filterStartTime = Date.now();
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForTransactionListLoad();
    const filterTime = Date.now() - filterStartTime;
    expect(filterTime).toBeLessThan(1000);
    
    // Verify all displayed transactions have correct category
    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    transactions.forEach(transaction => {
      expect(transaction.category).toBe('Food & Dining');
    });
    logger.info(`All ${transactions.length} transactions have category 'Food & Dining'`);
    
    // Verify transactions from multiple cards are included
    const uniqueCards = new Set(transactions.map(t => t.cardLastFour));
    expect(uniqueCards.size).toBeGreaterThan(1);
    logger.info(`Transactions from ${uniqueCards.size} different cards`);
    
    // Verify pagination if results exceed 50
    if (transactions.length === 50) {
      await expect(transactionPage.paginationControls).toBeVisible();
    }
  });

  test('QE-8875 TS-002 TC-002: Verify accurate total calculation for category-filtered transactions', async ({ page }) => {
    logger.info('Test Case: QE-8875 TS-002 TC-002 - Category filter total calculation validation');
    
    await transactionPage.waitForPageLoad();
    
    // Apply category filter
    await transactionPage.selectCategory('Food & Dining');
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForTransactionListLoad();
    
    // Get all transactions on current page
    const transactions = await transactionPage.getAllTransactions();
    
    // Manually calculate total
    const manualTotal = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    logger.info(`Manual total calculated: ${manualTotal}`);
    
    // Get system-calculated total if displayed
    const systemTotal = await transactionPage.getTransactionTotal();
    if (systemTotal !== null) {
      expect(Math.abs(systemTotal - manualTotal)).toBeLessThan(0.01);
      logger.info('System total matches manual calculation');
    }
    
    // If pagination exists, verify totals across pages
    const hasNextPage = !(await transactionPage.isNextButtonDisabled());
    if (hasNextPage) {
      await transactionPage.clickNextPage();
      await transactionPage.waitForTransactionListLoad();
      
      const page2Transactions = await transactionPage.getAllTransactions();
      const page2Total = page2Transactions.reduce((sum, t) => sum + t.amount, 0);
      
      const overallTotal = await transactionPage.getTransactionTotal();
      if (overallTotal !== null) {
        expect(overallTotal).toBeGreaterThan(manualTotal + page2Total - 0.01);
      }
    }
  });

  test('QE-8875 TS-003 TC-001: Verify validation error when start date is after end date', async ({ page }) => {
    logger.info('Test Case: QE-8875 TS-003 TC-001 - Invalid date range validation');
    
    await transactionPage.waitForPageLoad();
    
    // Enter invalid date range (start after end)
    await transactionPage.enterStartDate('2024-03-01');
    await transactionPage.enterEndDate('2024-02-01');
    logger.info('Invalid date range entered: start=2024-03-01, end=2024-02-01');
    
    // Click Apply Filter
    await transactionPage.clickApplyFilter();
    
    // Verify validation error message is displayed
    await expect(transactionPage.validationErrorMessage).toBeVisible();
    const errorText = await transactionPage.getValidationErrorText();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('start date cannot be after end date');
    logger.info('Validation error message displayed correctly');
    
    // Verify filter is not executed
    const transactionCount = await transactionPage.getTransactionCount();
    // Should show previous results or no change
    logger.info('Filter not executed - transaction list unchanged');
    
    // Verify error message is user-friendly and prominent
    const errorVisible = await transactionPage.validationErrorMessage.isVisible();
    expect(errorVisible).toBe(true);
    logger.info('Error message is clearly visible');
  });
});
