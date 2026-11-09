const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const logger = require('../utils/logger');

/**
 * Test Suite: Transaction Management and Filtering
 * Test Cases: QE-8986 TS-001 TC-001, QE-8986 TS-002 TC-001, QE-8986 TS-003 TC-001,
 *             QE-8987 TS-001 TC-001, QE-8987 TS-002 TC-001, QE-8987 TS-003 TC-001
 */

test.describe('Transaction Management and Filtering', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
    logger.info('Navigating to transactions page');
    await transactionsPage.navigate();
  });

  /**
   * Test Case: QE-8986 TS-001 TC-001
   * Description: Verify that the transaction history page displays a consolidated list of all transactions across three credit cards
   */
  test('TC-007: Transaction history displays consolidated list across multiple cards', async ({ page }) => {
    logger.info('Test Case: QE-8986 TS-001 TC-001 - Starting');
    
    // Step 1-2: Mock transaction and card data
    const mockCards = [
      { id: 'card1', name: 'Visa Platinum', lastFourDigits: '1234' },
      { id: 'card2', name: 'MasterCard Gold', lastFourDigits: '5678' },
      { id: 'card3', name: 'Amex Blue', lastFourDigits: '9012' }
    ];
    
    const mockTransactions = [
      { id: 'txn1', cardId: 'card1', date: '2026-11-30', merchant: 'Store A', amount: 100 },
      { id: 'txn2', cardId: 'card2', date: '2026-11-29', merchant: 'Store B', amount: 50 },
      { id: 'txn3', cardId: 'card3', date: '2026-11-28', merchant: 'Store C', amount: 75 }
    ];
    
    await page.route('**/api/cards', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockCards) });
    });
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 3-4: Verify consolidated list is sorted by date (most recent first)
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(mockTransactions.length);
    
    const firstTransaction = await transactionsPage.getTransactionAtIndex(0);
    expect(firstTransaction.date).toBe('2026-11-30');
    
    // Step 5-6: Verify all transaction details are displayed
    for (let i = 0; i < mockTransactions.length; i++) {
      const transaction = await transactionsPage.getTransactionAtIndex(i);
      expect(transaction.date).toBeTruthy();
      expect(transaction.merchant).toBeTruthy();
      expect(transaction.amount).toBeTruthy();
      expect(transaction.cardName).toBeTruthy();
      expect(transaction.lastFourDigits).toBeTruthy();
    }
    
    logger.info('Test Case: QE-8986 TS-001 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8986 TS-002 TC-001
   * Description: Verify that clicking on a transaction navigates to detailed transaction view
   */
  test('TC-008: Clicking transaction navigates to detail view with complete information', async ({ page }) => {
    logger.info('Test Case: QE-8986 TS-002 TC-001 - Starting');
    
    // Step 1: Display transaction list
    const mockTransactions = [
      { 
        id: 'txn123', 
        date: '2026-11-25', 
        merchant: 'Starbucks', 
        category: 'Food & Dining', 
        amount: 25, 
        cardId: 'card1' 
      }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 2-3: Click on transaction
    await transactionsPage.clickTransactionAtIndex(0);
    
    // Step 4: Verify navigation to detail view
    await expect(page).toHaveURL(/\/transactions\/txn123/);
    
    // Step 5-6: Verify all transaction details are displayed
    const transactionId = await transactionsPage.getDetailTransactionId();
    const date = await transactionsPage.getDetailDate();
    const merchant = await transactionsPage.getDetailMerchant();
    const category = await transactionsPage.getDetailCategory();
    const amount = await transactionsPage.getDetailAmount();
    
    expect(transactionId).toBe('txn123');
    expect(date).toContain('2026-11-25');
    expect(merchant).toBe('Starbucks');
    expect(category).toBe('Food & Dining');
    expect(amount).toContain('25');
    
    logger.info('Test Case: QE-8986 TS-002 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8986 TS-003 TC-001
   * Description: Verify that transaction history page displays appropriate message when user has no transactions
   */
  test('TC-009: Transaction history displays message when no transactions exist', async ({ page }) => {
    logger.info('Test Case: QE-8986 TS-003 TC-001 - Starting');
    
    // Step 1-2: Mock empty transaction data
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 3: Verify appropriate message is displayed
    const noTransactionsMessage = await transactionsPage.getNoTransactionsMessage();
    expect(noTransactionsMessage).toContain('No transactions found');
    
    // Step 4: Verify no errors are thrown
    const hasErrors = await transactionsPage.hasErrors();
    expect(hasErrors).toBe(false);
    
    // Step 5: Verify navigation remains functional
    const isNavigationFunctional = await transactionsPage.isNavigationFunctional();
    expect(isNavigationFunctional).toBe(true);
    
    logger.info('Test Case: QE-8986 TS-003 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8987 TS-001 TC-001
   * Description: Verify that applying date range filter displays only transactions within specified period
   */
  test('TC-010: Date range filter displays only transactions within specified period', async ({ page }) => {
    logger.info('Test Case: QE-8987 TS-001 TC-001 - Starting');
    
    // Step 1: Mock transaction data spanning six months
    const mockTransactions = [
      { id: 'txn1', date: '2026-11-15', merchant: 'Store A', amount: 100, cardId: 'card1' },
      { id: 'txn2', date: '2026-11-10', merchant: 'Store B', amount: 50, cardId: 'card1' },
      { id: 'txn3', date: '2026-10-20', merchant: 'Store C', amount: 75, cardId: 'card1' },
      { id: 'txn4', date: '2026-09-15', merchant: 'Store D', amount: 200, cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 2-3: Apply date range filter for last 30 days
    const startDate = '2026-11-01';
    const endDate = '2026-11-30';
    await transactionsPage.setDateRangeFilter(startDate, endDate);
    
    // Step 4-6: Verify only transactions within date range are displayed
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBe(2); // Only txn1 and txn2 are in November
    
    const transactions = await transactionsPage.getAllTransactions();
    for (const txn of transactions) {
      const txnDate = new Date(txn.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      expect(txnDate >= start && txnDate <= end).toBe(true);
    }
    
    logger.info('Test Case: QE-8987 TS-001 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8987 TS-002 TC-001
   * Description: Verify that merchant search filter displays only matching transactions (case-insensitive)
   */
  test('TC-011: Merchant search filter displays matching transactions case-insensitively', async ({ page }) => {
    logger.info('Test Case: QE-8987 TS-002 TC-001 - Starting');
    
    // Step 1: Mock transaction data with various merchant names
    const mockTransactions = [
      { id: 'txn1', merchant: 'Starbucks', amount: 25, date: '2026-11-20', cardId: 'card1' },
      { id: 'txn2', merchant: 'Walmart', amount: 100, date: '2026-11-19', cardId: 'card1' },
      { id: 'txn3', merchant: 'starbucks', amount: 15, date: '2026-11-18', cardId: 'card1' },
      { id: 'txn4', merchant: 'STARBUCKS', amount: 30, date: '2026-11-17', cardId: 'card1' },
      { id: 'txn5', merchant: 'Target', amount: 50, date: '2026-11-16', cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 2-3: Enter search term
    await transactionsPage.setMerchantSearch('Starbucks');
    
    // Step 4-6: Verify only matching transactions are displayed (case-insensitive)
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBe(3); // All three Starbucks variations
    
    const transactions = await transactionsPage.getAllTransactions();
    for (const txn of transactions) {
      expect(txn.merchant.toLowerCase()).toContain('starbucks');
    }
    
    logger.info('Test Case: QE-8987 TS-002 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8987 TS-003 TC-001
   * Description: Verify that multiple filters with no matching results displays appropriate message
   */
  test('TC-012: Multiple filters with no results displays message and clear option', async ({ page }) => {
    logger.info('Test Case: QE-8987 TS-003 TC-001 - Starting');
    
    // Step 1: Mock transaction data
    const mockTransactions = [
      { id: 'txn1', cardId: 'card1', date: '2026-11-20', merchant: 'Store A', amount: 100 },
      { id: 'txn2', cardId: 'card2', date: '2026-11-19', merchant: 'Store B', amount: 50 }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 2-4: Apply multiple filters
    await transactionsPage.setDateRangeFilter('2026-11-24', '2026-11-30');
    await transactionsPage.setCardFilter('card1');
    await transactionsPage.setMerchantSearch('NonExistentMerchant');
    
    // Step 5: Verify no transactions message and clear filters option
    const noResultsMessage = await transactionsPage.getNoTransactionsMessage();
    expect(noResultsMessage).toContain('No transactions found');
    
    const hasClearFiltersButton = await transactionsPage.hasClearFiltersButton();
    expect(hasClearFiltersButton).toBe(true);
    
    // Step 6: Verify clear filters functionality
    await transactionsPage.clickClearFilters();
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(mockTransactions.length);
    
    logger.info('Test Case: QE-8987 TS-003 TC-001 - Completed successfully');
  });
});
