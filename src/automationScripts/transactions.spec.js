const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');

test.describe('Credit Card Transactions - Search and Filter', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    await transactionsPage.navigate();
  });

  test('TC-4788: Verify date range filter returns only transactions within specified 30-day window', async ({ page }) => {
    // Test Case ID: QE-7983 TS-001 TC-001
    // Step 1-2: Launch and authenticate
    await transactionsPage.login('testuser_large_history', 'Pass@123');
    
    // Step 3: Navigate to Transaction Management
    await transactionsPage.navigateToTransactions();
    const initialCount = await transactionsPage.getTransactionCount();
    expect(initialCount).toBe(120);
    
    // Step 4: Apply date range filter
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    await transactionsPage.applyDateRangeFilter(thirtyDaysAgo, today);
    
    // Step 5: Verify filtered count
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBe(25);
    
    // Step 6: Verify chronological order
    const transactions = await transactionsPage.getAllTransactions();
    const firstDate = new Date(transactions[0].date);
    const lastDate = new Date(transactions[transactions.length - 1].date);
    expect(firstDate.getTime()).toBeGreaterThanOrEqual(lastDate.getTime());
    
    // Step 7: Verify all dates within range
    transactions.forEach(txn => {
      const txnDate = new Date(txn.date);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
      expect(txnDate.getTime()).toBeLessThanOrEqual(today.getTime());
    });
  });

  test('TC-4789: Verify validation error for invalid date range (from date after to date)', async ({ page }) => {
    // Test Case ID: QE-7983 TS-002 TC-001
    // Step 1-2: Launch and authenticate
    await transactionsPage.login('testuser', 'Pass@123');
    
    // Step 3: Navigate to Transaction Management
    await transactionsPage.navigateToTransactions();
    
    // Step 4: Enter invalid date range
    await transactionsPage.setFromDate('2024-03-01');
    await transactionsPage.setToDate('2024-02-01');
    
    // Step 5: Attempt to apply filter
    await transactionsPage.clickApplyFilter();
    
    // Step 6: Verify validation error
    const errorMessage = await transactionsPage.getValidationError();
    expect(errorMessage).toContain('Invalid date range');
    expect(errorMessage).toContain('From date cannot be after To date');
    
    // Step 7: Verify list unchanged
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
  });

  test('TC-4790: Verify multiple filters applied simultaneously with AND logic', async ({ page }) => {
    // Test Case ID: QE-7983 TS-003 TC-001
    // Step 1-2: Launch and authenticate
    await transactionsPage.login('testuser', 'Pass@123');
    
    // Step 3: Navigate to Transaction Management
    await transactionsPage.navigateToTransactions();
    const initialCount = await transactionsPage.getTransactionCount();
    expect(initialCount).toBe(150);
    
    // Step 4-7: Apply all filters
    const today = new Date();
    const sixtyDaysAgo = new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000));
    await transactionsPage.applyDateRangeFilter(sixtyDaysAgo, today);
    await transactionsPage.setMerchantKeyword('Amazon');
    await transactionsPage.setAmountRange(50, 500);
    await transactionsPage.selectCard('**** **** **** 1234');
    
    // Step 8: Apply filters
    await transactionsPage.clickApplyFilter();
    
    // Step 9: Verify filtered results
    const filteredTransactions = await transactionsPage.getAllTransactions();
    expect(filteredTransactions.length).toBe(8);
    
    filteredTransactions.forEach(txn => {
      // Verify date range
      const txnDate = new Date(txn.date);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(sixtyDaysAgo.getTime());
      expect(txnDate.getTime()).toBeLessThanOrEqual(today.getTime());
      
      // Verify merchant keyword
      expect(txn.merchant.toLowerCase()).toContain('amazon');
      
      // Verify amount range
      expect(txn.amount).toBeGreaterThanOrEqual(50);
      expect(txn.amount).toBeLessThanOrEqual(500);
      
      // Verify card
      expect(txn.cardNumber).toContain('1234');
    });
    
    // Step 10: Verify result count display
    const resultMessage = await transactionsPage.getResultCountMessage();
    expect(resultMessage).toBe('Showing 8 of 150 transactions');
    
    // Step 11: Reset filters
    await transactionsPage.clickResetFilters();
    const resetCount = await transactionsPage.getTransactionCount();
    expect(resetCount).toBe(150);
  });
});

test.describe('Credit Card Transactions - Multi-Card Aggregation', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    await transactionsPage.navigate();
  });

  test('TC-4794: Verify consolidated transaction list displays all transactions from 3 linked cards in chronological order', async ({ page }) => {
    // Test Case ID: QE-7981 TS-001 TC-001
    // Step 1-2: Launch and authenticate
    await transactionsPage.login('testuser_3cards', 'Pass@123');
    
    // Step 3: Navigate to Transaction Management
    await transactionsPage.navigateToTransactions();
    
    // Step 4: Verify transactions from all 3 cards
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBe(45);
    
    const card1Txns = transactions.filter(t => t.cardNumber.includes('1234'));
    const card2Txns = transactions.filter(t => t.cardNumber.includes('5678'));
    const card3Txns = transactions.filter(t => t.cardNumber.includes('9012'));
    
    expect(card1Txns.length).toBeGreaterThan(0);
    expect(card2Txns.length).toBeGreaterThan(0);
    expect(card3Txns.length).toBeGreaterThan(0);
    
    // Step 5: Verify reverse chronological order
    const firstDate = new Date(transactions[0].date);
    const lastDate = new Date(transactions[transactions.length - 1].date);
    expect(firstDate.getTime()).toBeGreaterThanOrEqual(lastDate.getTime());
    
    // Step 6: Verify card number displayed
    transactions.forEach(txn => {
      expect(txn.cardNumber).toMatch(/\*{4} \*{4} \*{4} \d{4}/);
    });
    
    // Step 7: Verify transaction details
    const sampleTxn = transactions[0];
    expect(sampleTxn.merchant).toBeDefined();
    expect(sampleTxn.amount).toBeGreaterThan(0);
    expect(sampleTxn.date).toBeDefined();
    expect(sampleTxn.category).toBeDefined();
  });

  test('TC-4795: Verify notification displayed for cards with data synchronization issues', async ({ page }) => {
    // Test Case ID: QE-7981 TS-002 TC-001
    // Step 1-2: Launch and authenticate
    await transactionsPage.login('testuser_sync_issue', 'Pass@123');
    
    // Step 3: Navigate to Transaction Management
    await transactionsPage.navigateToTransactions();
    
    // Step 4: Verify partial transaction list
    const transactions = await transactionsPage.getAllTransactions();
    expect(transactions.length).toBe(30);
    
    const card1Txns = transactions.filter(t => t.cardNumber.includes('1234'));
    const card2Txns = transactions.filter(t => t.cardNumber.includes('5678'));
    expect(card1Txns.length).toBeGreaterThan(0);
    expect(card2Txns.length).toBeGreaterThan(0);
    
    // Step 5: Verify notification
    const notification = await transactionsPage.getSyncNotification();
    expect(notification).toContain('Data synchronization issue detected');
    expect(notification).toContain('**** 9012');
    
    // Step 6: Verify last sync timestamp
    const lastSync = await transactionsPage.getLastSyncTimestamp();
    expect(lastSync).toContain('2024-03-14 10:30 AM');
    
    // Step 7: Verify retry option
    const hasRetryButton = await transactionsPage.hasRetrySyncButton();
    expect(hasRetryButton).toBeTruthy();
  });

  test('TC-4796: Verify efficient loading of 500+ transactions with pagination or infinite scroll', async ({ page }) => {
    // Test Case ID: QE-7981 TS-003 TC-001
    // Step 1-2: Launch and authenticate
    await transactionsPage.login('testuser_large_dataset', 'Pass@123');
    
    // Step 3: Navigate to Transaction Management
    const startTime = Date.now();
    await transactionsPage.navigateToTransactions();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    // Step 4: Verify initial batch
    const initialTransactions = await transactionsPage.getVisibleTransactions();
    expect(initialTransactions.length).toBe(50);
    
    // Step 5: Verify pagination controls
    const hasPagination = await transactionsPage.hasPaginationControls();
    expect(hasPagination).toBeTruthy();
    const totalPages = await transactionsPage.getTotalPages();
    expect(totalPages).toBe(11);
    
    // Step 6: Load next batch
    const nextPageStartTime = Date.now();
    await transactionsPage.goToNextPage();
    const nextPageLoadTime = Date.now() - nextPageStartTime;
    expect(nextPageLoadTime).toBeLessThan(1000);
    
    const secondPageTransactions = await transactionsPage.getVisibleTransactions();
    expect(secondPageTransactions.length).toBe(50);
    
    // Step 7: Verify chronological order maintained
    const allLoadedTransactions = [...initialTransactions, ...secondPageTransactions];
    for (let i = 0; i < allLoadedTransactions.length - 1; i++) {
      const currentDate = new Date(allLoadedTransactions[i].date);
      const nextDate = new Date(allLoadedTransactions[i + 1].date);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
    
    // Step 8: Verify all 5 cards represented
    const totalCount = await transactionsPage.getTotalTransactionCount();
    expect(totalCount).toBe(520);
    
    await transactionsPage.loadAllTransactions();
    const allTransactions = await transactionsPage.getAllTransactions();
    
    const uniqueCards = new Set(allTransactions.map(t => t.cardNumber));
    expect(uniqueCards.size).toBe(5);
    expect(uniqueCards.has('**** **** **** 1234')).toBeTruthy();
    expect(uniqueCards.has('**** **** **** 5678')).toBeTruthy();
    expect(uniqueCards.has('**** **** **** 9012')).toBeTruthy();
    expect(uniqueCards.has('**** **** **** 3456')).toBeTruthy();
    expect(uniqueCards.has('**** **** **** 7890')).toBeTruthy();
  });
});