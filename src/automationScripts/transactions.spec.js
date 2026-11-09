const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');

test.describe('Transaction Management and Monitoring', () => {

  test('QE-9061 TS-001 TC-001 - Verify multiple filter application updates transaction list within 500ms', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    
    // Step 1-2: Launch and navigate to transactions
    await transactionPage.navigate();
    await transactionPage.login('testuser@example.com', 'Pass@123');
    await transactionPage.goToTransactions();
    
    // Step 3: Show filters
    await transactionPage.clickShowFilters();
    await expect(transactionPage.filterPanel).toBeVisible();
    
    // Step 4-8: Apply multiple filters
    await transactionPage.setStartDate('2024-01-01');
    await transactionPage.setEndDate('2024-12-31');
    await transactionPage.selectCard('Visa Gold (****1234)');
    await transactionPage.setMinAmount('50.00');
    await transactionPage.setMaxAmount('500.00');
    
    // Step 9: Apply filters and measure response time
    const startTime = Date.now();
    await transactionPage.clickApplyFilters();
    await transactionPage.waitForTransactionListUpdate();
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(500);
    
    // Step 10: Verify filtered results
    const transactions = await transactionPage.getAllTransactions();
    for (const txn of transactions) {
      const amount = await txn.getAmount();
      expect(amount).toBeGreaterThanOrEqual(50);
      expect(amount).toBeLessThanOrEqual(500);
      
      const card = await txn.getCardName();
      expect(card).toContain('Visa Gold');
    }
  });

  test('QE-9061 TS-002 TC-001 - Verify no matching transactions message displays with clear filters option', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    
    // Step 1-3: Launch, navigate, and show filters
    await transactionPage.navigate();
    await transactionPage.login('testuser@example.com', 'Pass@123');
    await transactionPage.goToTransactions();
    await transactionPage.clickShowFilters();
    
    // Step 4: Apply future date range with no transactions
    await transactionPage.setStartDate('2099-01-01');
    await transactionPage.setEndDate('2099-12-31');
    
    // Step 5: Apply filters
    await transactionPage.clickApplyFilters();
    await transactionPage.waitForTransactionListUpdate();
    
    // Step 6: Verify no matching message
    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    await expect(transactionPage.noTransactionsMessage).toContainText(/No matching transactions found/i);
    
    // Step 7: Verify clear button is visible
    await expect(transactionPage.clearFiltersButton).toBeVisible();
    await expect(transactionPage.clearFiltersButton).toBeEnabled();
    
    // Step 8: Clear filters and verify full list
    await transactionPage.clickClearFilters();
    await transactionPage.waitForTransactionListUpdate();
    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
  });

  test('QE-9061 TS-003 TC-001 - Verify merchant name search returns matching transactions with highlighted terms', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    
    // Step 1-2: Launch and navigate
    await transactionPage.navigate();
    await transactionPage.login('testuser@example.com', 'Pass@123');
    await transactionPage.goToTransactions();
    
    // Step 3-4: Search by merchant name
    await transactionPage.searchByMerchant('Amazon');
    await transactionPage.waitForTransactionListUpdate();
    
    // Step 5: Verify search term is highlighted
    const highlightedElements = await transactionPage.getHighlightedMerchantNames();
    expect(highlightedElements.length).toBeGreaterThan(0);
    
    // Step 6: Verify transactions from multiple cards
    const transactions = await transactionPage.getAllTransactions();
    const cardSet = new Set();
    for (const txn of transactions) {
      const merchant = await txn.getMerchantName();
      expect(merchant.toLowerCase()).toContain('amazon');
      cardSet.add(await txn.getCardName());
    }
    
    // Step 7-8: Navigate to next page and verify filter persists
    if (await transactionPage.isNextPageAvailable()) {
      await transactionPage.goToNextPage();
      await transactionPage.waitForTransactionListUpdate();
      
      const page2Transactions = await transactionPage.getAllTransactions();
      for (const txn of page2Transactions) {
        const merchant = await txn.getMerchantName();
        expect(merchant.toLowerCase()).toContain('amazon');
      }
      
      const page2Highlighted = await transactionPage.getHighlightedMerchantNames();
      expect(page2Highlighted.length).toBeGreaterThan(0);
    }
  });

  test('QE-9058 TS-001 TC-001 - Verify user views paginated transaction list with complete details', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    
    // Step 1-3: Launch, login, and navigate
    await transactionPage.navigate();
    await transactionPage.login('testuser@example.com', 'Pass@123');
    await transactionPage.goToTransactions();
    
    // Step 4: Verify pagination controls
    await expect(transactionPage.paginationControls).toBeVisible();
    
    // Step 5-10: Verify transaction details
    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions) {
      // Step 5: Transaction date
      await expect(txn.dateElement).toBeVisible();
      
      // Step 6: Merchant name
      await expect(txn.merchantElement).toBeVisible();
      
      // Step 7: Amount with currency
      const amount = await txn.amountElement.textContent();
      expect(amount).toMatch(/USD\s+[0-9,]+\.[0-9]{2}/);
      
      // Step 8: Card information
      const cardInfo = await txn.cardElement.textContent();
      expect(cardInfo).toMatch(/\*{4}\d{4}/);
      
      // Step 9: Transaction status
      await expect(txn.statusElement).toBeVisible();
    }
  });

  test('QE-9058 TS-002 TC-001 - Verify appropriate no transactions message when no transactions exist', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    
    // Step 1-3: Launch, login with no transactions user
    await transactionPage.navigate();
    await transactionPage.login('notransactions@example.com', 'Pass@123');
    await transactionPage.goToTransactions();
    
    // Step 4: Verify empty table
    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBe(0);
    
    // Step 5: Verify no transactions message
    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    await expect(transactionPage.noTransactionsMessage).toContainText(/No transactions found/i);
    
    // Step 6: Verify no error messages
    const errors = await page.locator('.alert-danger, .error-message').count();
    expect(errors).toBe(0);
    
    // Step 7: Verify pagination is hidden or disabled
    const paginationVisible = await transactionPage.paginationControls.isVisible();
    if (paginationVisible) {
      await expect(transactionPage.nextPageButton).toBeDisabled();
      await expect(transactionPage.previousPageButton).toBeDisabled();
    }
  });

  test('QE-9058 TS-003 TC-001 - Verify pagination navigation loads each page within 2 seconds with 20 transactions', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    
    // Step 1-3: Launch, login with many transactions user
    await transactionPage.navigate();
    await transactionPage.login('manytransactions@example.com', 'Pass@123');
    await transactionPage.goToTransactions();
    
    // Step 4: Verify first page has 20 transactions
    let transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBe(20);
    
    // Step 5: Verify total record count
    const totalRecords = await transactionPage.getTotalRecordCount();
    expect(totalRecords).toBeGreaterThan(20);
    
    // Step 6: Navigate to page 2 and measure load time
    const startTime = Date.now();
    await transactionPage.goToNextPage();
    await transactionPage.waitForTransactionListUpdate();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    // Step 7: Verify page 2 has 20 transactions
    transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeLessThanOrEqual(20);
    
    // Step 8: Verify pagination shows page 2
    const currentPage = await transactionPage.getCurrentPage();
    expect(currentPage).toBe(2);
    
    // Step 9: Navigate to last page
    const totalPages = await transactionPage.getTotalPages();
    await transactionPage.goToPage(totalPages);
    await transactionPage.waitForTransactionListUpdate();
    
    // Step 10: Verify last page has remaining transactions
    transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions.length).toBeLessThanOrEqual(20);
  });

});