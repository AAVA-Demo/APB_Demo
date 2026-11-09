const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');

/**
 * Test Suite: Transactions Feature Tests
 * Covers: QE-8888 (Search & Filter) and QE-8887 (Multi-Card Listing)
 * Total Test Cases: 6
 */

test.describe('Transactions - Search and Filter (QE-8888)', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
  });

  /**
   * Test Case ID: QE-8888 TS-001 TC-001
   * Test Case: Verify date range and card filters return accurate matching transactions within 500ms
   */
  test('TC-001: Date range and card filters return matching transactions within 500ms', async ({ page }) => {
    // Step 1: Authenticate as user with 150 transactions
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('user_with_150_transactions');
    
    // Step 2: Navigate to transaction management interface
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify initial transaction count
    const initialCount = await transactionsPage.getTransactionCount();
    expect(initialCount).toBe(150);
    
    // Step 3: Apply date range filter (Jan 1-15, 2024)
    await transactionsPage.setDateRangeFilter('2024-01-01', '2024-01-15');
    
    // Step 4: Apply card selection filter (Platinum Rewards)
    await transactionsPage.selectCardFilter('Platinum Rewards');
    
    // Step 5: Apply filters and measure response time
    const startTime = Date.now();
    await transactionsPage.applyFilters();
    await transactionsPage.waitForFilterResults();
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThanOrEqual(500);
    
    // Step 6: Verify only matching transactions are displayed (23 transactions)
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBe(23);
    
    // Step 7: Validate each transaction matches date range filter
    const allTransactions = await transactionsPage.getAllTransactions();
    for (const txn of allTransactions) {
      const txnDate = new Date(txn.date);
      expect(txnDate >= new Date('2024-01-01')).toBe(true);
      expect(txnDate <= new Date('2024-01-15')).toBe(true);
    }
    
    // Step 8: Validate each transaction matches card selection filter
    for (const txn of allTransactions) {
      expect(txn.cardName).toBe('Platinum Rewards');
    }
  });

  /**
   * Test Case ID: QE-8888 TS-002 TC-001
   * Test Case: Verify search term performs case-insensitive search within 500ms
   */
  test('TC-002: Search term performs case-insensitive search within 500ms', async ({ page }) => {
    // Step 1: Authenticate as user with diverse transaction history
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('user_with_grocery_transactions');
    
    // Step 2: Navigate to transaction management interface
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 3: Enter search term 'grocery' (lowercase)
    await transactionsPage.enterSearchTerm('grocery');
    
    // Step 4: Trigger search and measure response time
    const startTime = Date.now();
    // Search auto-triggers after debounce (500ms) or on button click
    await transactionsPage.waitForSearchResults();
    const responseTime = Date.now() - startTime;
    
    // Step 5: Verify search completes within 500ms
    expect(responseTime).toBeLessThanOrEqual(500);
    
    // Step 6: Verify search is case-insensitive and matches merchant names
    const results = await transactionsPage.getAllTransactions();
    expect(results.length).toBeGreaterThan(0);
    
    for (const txn of results) {
      const merchantLower = txn.merchantName.toLowerCase();
      expect(merchantLower).toContain('grocery');
    }
    
    // Step 7: Verify search matches transaction descriptions
    // (Already validated in step 6 as search covers both merchant and description)
    
    // Step 8: Validate all returned transactions contain search term
    for (const txn of results) {
      const merchantMatch = txn.merchantName.toLowerCase().includes('grocery');
      const descriptionMatch = txn.description ? txn.description.toLowerCase().includes('grocery') : false;
      expect(merchantMatch || descriptionMatch).toBe(true);
    }
  });

  /**
   * Test Case ID: QE-8888 TS-003 TC-001
   * Test Case: Verify invalid date range displays clear error message and prevents filter execution
   */
  test('TC-003: Invalid date range displays error message and prevents filter execution', async ({ page }) => {
    // Step 1: Authenticate as user
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('test_user');
    
    // Step 2: Navigate to transaction management interface
    await transactionsPage.waitForTransactionsLoad();
    
    const initialCount = await transactionsPage.getTransactionCount();
    
    // Step 3: Enter invalid date range (end date before start date)
    await transactionsPage.setDateRangeFilter('2024-01-31', '2024-01-01');
    
    // Step 4: Click Apply Filters button
    await transactionsPage.applyFilters();
    
    // Step 5: Verify clear error message is displayed
    const errorMessage = await transactionsPage.getErrorMessage();
    expect(errorMessage).toMatch(/invalid date range|end date must be after start date/i);
    
    // Step 6: Verify filter execution is prevented and transaction list remains unchanged
    const currentCount = await transactionsPage.getTransactionCount();
    expect(currentCount).toBe(initialCount);
    
    // Step 7: Verify user is prompted to correct the date selection
    expect(errorMessage).toMatch(/please select|correct/i);
    
    // Step 8: Correct date range and re-apply filter
    await transactionsPage.setDateRangeFilter('2024-01-01', '2024-01-31');
    await transactionsPage.applyFilters();
    
    // Verify error message is cleared
    const hasError = await transactionsPage.hasErrorMessage();
    expect(hasError).toBe(false);
    
    // Verify filter executes successfully
    await transactionsPage.waitForFilterResults();
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBeGreaterThan(0);
  });
});

test.describe('Transactions - Multi-Card Transaction Listing (QE-8887)', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
  });

  /**
   * Test Case ID: QE-8887 TS-001 TC-001
   * Test Case: Verify user with multiple credit cards can access unified transaction interface
   */
  test('TC-001: Multiple cards display unified transaction interface with card identification', async ({ page }) => {
    // Step 1: Authenticate as user with multiple credit cards
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('user_with_multiple_cards');
    
    // Step 2: Navigate to transaction management interface
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 3: Verify transaction list displays transactions from all cards
    const transactions = await transactionsPage.getAllTransactions();
    const uniqueCards = new Set(transactions.map(txn => txn.cardName));
    
    expect(uniqueCards.has('Platinum Rewards')).toBe(true);
    expect(uniqueCards.has('Gold Cashback')).toBe(true);
    expect(uniqueCards.has('Travel Elite')).toBe(true);
    expect(uniqueCards.size).toBe(3);
    
    // Step 4: Verify each transaction displays card identification
    for (const txn of transactions) {
      expect(txn.cardName).toBeTruthy();
      expect(txn.cardName).toMatch(/Platinum Rewards|Gold Cashback|Travel Elite/);
    }
    
    // Step 5: Verify transaction list includes essential details
    for (const txn of transactions) {
      expect(txn.merchantName).toBeTruthy();
      expect(txn.amount).toBeTruthy();
      expect(txn.date).toBeTruthy();
      expect(txn.cardName).toBeTruthy();
    }
    
    // Step 6: Verify transactions from different cards are visually distinguishable
    const isDistinguishable = await transactionsPage.areCardsVisuallyDistinguishable();
    expect(isDistinguishable).toBe(true);
  });

  /**
   * Test Case ID: QE-8887 TS-002 TC-001
   * Test Case: Verify transactions across three cards are displayed in chronological order
   */
  test('TC-002: Three cards transactions display in chronological order with accurate card identification', async ({ page }) => {
    // Step 1: Authenticate as user with transactions across three cards
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('user_with_three_card_transactions');
    
    // Step 2: Navigate to transaction management interface
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 3: Verify system aggregates transactions from all three cards
    const transactions = await transactionsPage.getAllTransactions();
    const uniqueCards = new Set(transactions.map(txn => txn.cardName));
    
    expect(uniqueCards.has('Platinum Rewards')).toBe(true);
    expect(uniqueCards.has('Gold Cashback')).toBe(true);
    expect(uniqueCards.has('Travel Elite')).toBe(true);
    
    // Step 4: Verify transactions are in chronological order (descending)
    for (let i = 0; i < transactions.length - 1; i++) {
      const currentDate = new Date(transactions[i].date);
      const nextDate = new Date(transactions[i + 1].date);
      expect(currentDate >= nextDate).toBe(true);
    }
    
    // Step 5: Validate chronological ordering by checking first and last dates
    const firstDate = new Date(transactions[0].date);
    const lastDate = new Date(transactions[transactions.length - 1].date);
    expect(firstDate >= lastDate).toBe(true);
    
    // Step 6: Verify each transaction displays accurate card identification
    for (const txn of transactions) {
      expect(txn.cardName).toMatch(/Platinum Rewards|Gold Cashback|Travel Elite/);
    }
    
    // Step 7: Verify transactions are interspersed chronologically, not grouped by card
    let previousCard = null;
    let cardSwitchCount = 0;
    for (const txn of transactions) {
      if (previousCard && txn.cardName !== previousCard) {
        cardSwitchCount++;
      }
      previousCard = txn.cardName;
    }
    // Expect at least one card switch (not all from same card)
    expect(cardSwitchCount).toBeGreaterThan(0);
  });

  /**
   * Test Case ID: QE-8887 TS-003 TC-001
   * Test Case: Verify user with no transaction history receives appropriate message
   */
  test('TC-003: No transaction history displays appropriate message instead of empty list', async ({ page }) => {
    // Step 1: Authenticate as user with no transaction history
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('user_with_no_transactions');
    
    // Step 2: Navigate to transaction management interface
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 3: Verify appropriate message is displayed
    const noTransactionsMessage = await transactionsPage.getNoTransactionsMessage();
    expect(noTransactionsMessage).toMatch(/no transactions found|no transaction history/i);
    
    // Step 4: Verify message is clear and user-friendly
    expect(noTransactionsMessage).not.toMatch(/error|failed|exception/i);
    
    // Step 5: Verify no empty list or blank page without explanation
    const hasMessage = await transactionsPage.hasNoTransactionsMessage();
    expect(hasMessage).toBe(true);
    
    // Step 6: Verify no error message or error state is triggered
    const hasError = await transactionsPage.hasErrorMessage();
    expect(hasError).toBe(false);
  });
});
