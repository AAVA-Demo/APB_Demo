const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { logger } = require('../utils/logger');

test.describe('Credit Card Transaction Management', () => {

  test('QE-10350 TS-001 TC-001: Verify system retrieves and aggregates transactions from 3 credit cards', async ({ page }) => {
    logger.info('Starting test: QE-10350 TS-001 TC-001');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Set up test data with 3 credit cards
    await transactionPage.setupTestData({
      cardA: { id: 'card-a', transactionCount: 50 },
      cardB: { id: 'card-b', transactionCount: 50 },
      cardC: { id: 'card-c', transactionCount: 50 }
    });
    logger.info('Test data setup completed with 150 total transactions');
    
    // Step 2: Call TransactionService.getTransactions() with default pagination
    await transactionPage.navigate();
    await transactionPage.loadTransactions(1, 20);
    logger.info('Transactions loaded with pagination: page 1, size 20');
    
    // Step 3: Verify each transaction includes correct card identification
    const transactions = await transactionPage.getDisplayedTransactions();
    await expect(transactions).toHaveLength(20);
    for (const txn of transactions) {
      const cardId = await transactionPage.getTransactionCardId(txn);
      expect(['card-a', 'card-b', 'card-c']).toContain(cardId);
    }
    logger.info('Verified all transactions have correct card identification');
    
    // Step 4: Verify pagination metadata
    await expect(transactionPage.hasMoreIndicator).toBeVisible();
    const totalCount = await transactionPage.getTotalCount();
    expect(totalCount).toBe(150);
    logger.info('Pagination metadata verified: hasMore=true, totalCount=150');
    
    // Step 5: Verify transactions are ordered by date descending
    const isOrdered = await transactionPage.verifyDateOrdering('descending');
    expect(isOrdered).toBeTruthy();
    logger.info('Transaction ordering verified: descending by date');
  });

  test('QE-10350 TS-002 TC-001: Verify system handles partial transaction retrieval when one card source is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-10350 TS-002 TC-001');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Set up test data with Card C unavailable
    await transactionPage.setupTestDataWithError({
      cardA: { id: 'card-a', transactionCount: 30 },
      cardB: { id: 'card-b', transactionCount: 30 },
      cardC: { id: 'card-c', status: 503, error: 'Service Unavailable' }
    });
    logger.info('Test data setup with Card C unavailable (HTTP 503)');
    
    // Step 2: Call TransactionService.getTransactions()
    await transactionPage.navigate();
    await transactionPage.loadTransactions(1, 20);
    
    // Step 3: Verify response includes error indicator for Card C
    const errorIndicator = await transactionPage.getErrorIndicatorForCard('card-c');
    await expect(errorIndicator).toBeVisible();
    const errorMessage = await transactionPage.getErrorMessage('card-c');
    expect(errorMessage).toContain('unavailable');
    logger.info('Error indicator verified for Card C');
    
    // Step 4: Verify partial transaction list contains only valid cards
    const transactions = await transactionPage.getDisplayedTransactions();
    for (const txn of transactions) {
      const cardId = await transactionPage.getTransactionCardId(txn);
      expect(['card-a', 'card-b']).toContain(cardId);
      expect(cardId).not.toBe('card-c');
    }
    logger.info('Verified transactions only from available cards (A and B)');
    
    // Step 5: Verify totalCount reflects only available transactions
    const totalCount = await transactionPage.getTotalCount();
    expect(totalCount).toBe(60);
    logger.info('Total count verified: 60 (not 90)');
  });

  test('QE-10350 TS-002 TC-002: Verify system handles complete failure when all card sources return errors', async ({ page }) => {
    logger.info('Starting test: QE-10350 TS-002 TC-002');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Configure all card sources to fail
    await transactionPage.setupAllCardsWithError({
      cardA: { status: 500 },
      cardB: { status: 500 },
      cardC: { status: 500 }
    });
    logger.info('All card sources configured to return HTTP 500');
    
    // Step 2: Call TransactionService.getTransactions()
    await transactionPage.navigate();
    await transactionPage.loadTransactions(1, 20);
    
    // Step 3: Verify response indicates all card sources failed
    const errorIndicators = await transactionPage.getAllErrorIndicators();
    expect(errorIndicators.length).toBe(3);
    logger.info('All 3 card error indicators displayed');
    
    // Step 4: Verify totalCount is 0 and hasMore is false
    const totalCount = await transactionPage.getTotalCount();
    expect(totalCount).toBe(0);
    await expect(transactionPage.hasMoreIndicator).not.toBeVisible();
    logger.info('Verified totalCount=0 and hasMore=false');
  });

  test('QE-10350 TS-003 TC-001: Verify pagination returns correct transactions across multiple pages', async ({ page }) => {
    logger.info('Starting test: QE-10350 TS-003 TC-001');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Set up test data with 50 transactions
    await transactionPage.setupTestData({ totalTransactions: 50 });
    logger.info('Test data setup with 50 sequential transactions');
    
    // Step 2: Load page 1
    await transactionPage.navigate();
    await transactionPage.loadTransactions(1, 20);
    const page1Transactions = await transactionPage.getTransactionIds();
    expect(page1Transactions.length).toBe(20);
    logger.info('Page 1 loaded: 20 transactions');
    
    // Step 3: Verify page 1 contains transactions 1-20
    for (let i = 0; i < 20; i++) {
      expect(page1Transactions[i]).toBe(i + 1);
    }
    await transactionPage.verifyCardIdentificationForAll();
    logger.info('Page 1 transactions verified: IDs 1-20');
    
    // Step 4: Load page 2
    await transactionPage.loadTransactions(2, 20);
    const page2Transactions = await transactionPage.getTransactionIds();
    expect(page2Transactions.length).toBe(20);
    logger.info('Page 2 loaded: 20 transactions');
    
    // Step 5: Verify page 2 contains transactions 21-40 with no overlap
    for (let i = 0; i < 20; i++) {
      expect(page2Transactions[i]).toBe(i + 21);
    }
    const overlap = page1Transactions.filter(id => page2Transactions.includes(id));
    expect(overlap.length).toBe(0);
    logger.info('Page 2 transactions verified: IDs 21-40, no overlap');
    
    // Step 6: Load page 3
    await transactionPage.loadTransactions(3, 20);
    const page3Transactions = await transactionPage.getTransactionIds();
    expect(page3Transactions.length).toBe(10);
    logger.info('Page 3 loaded: 10 transactions');
    
    // Step 7: Verify page 3 contains transactions 41-50 and hasMore is false
    for (let i = 0; i < 10; i++) {
      expect(page3Transactions[i]).toBe(i + 41);
    }
    await expect(transactionPage.hasMoreIndicator).not.toBeVisible();
    logger.info('Page 3 transactions verified: IDs 41-50, hasMore=false');
  });

  test('QE-10347 TS-001 TC-001: Verify date range filter returns only transactions within specified range', async ({ page }) => {
    logger.info('Starting test: QE-10347 TS-001 TC-001');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Set up test data with 125 transactions spanning 6 months
    await transactionPage.setupTestDataWithDateRange({
      july2023ToDecember2023: 100,
      january2024: 25
    });
    logger.info('Test data setup: 100 txns (Jul-Dec 2023), 25 txns (Jan 2024)');
    
    // Step 2: Apply date range filter for January 2024
    await transactionPage.navigate();
    await transactionPage.applyDateRangeFilter('2024-01-01', '2024-01-31');
    logger.info('Date range filter applied: 2024-01-01 to 2024-01-31');
    
    // Step 3: Verify response contains only 25 transactions
    const totalCount = await transactionPage.getTotalCount();
    expect(totalCount).toBe(25);
    const displayedCount = await transactionPage.getDisplayedTransactionCount();
    expect(displayedCount).toBe(20);
    logger.info('Verified totalCount=25, displayed=20 (first page)');
    
    // Step 4: Verify all transactions have dates within January 2024
    const allDatesValid = await transactionPage.verifyAllTransactionDatesInRange('2024-01-01', '2024-01-31');
    expect(allDatesValid).toBeTruthy();
    logger.info('All transaction dates verified within January 2024');
    
    // Step 5: Verify pagination indicates more results
    await expect(transactionPage.hasMoreIndicator).toBeVisible();
    const hasMore = await transactionPage.getHasMoreStatus();
    expect(hasMore).toBeTruthy();
    logger.info('Pagination verified: hasMore=true (25 total, 20 on page 1)');
  });

  test('QE-10347 TS-002 TC-001: Verify multiple simultaneous filters return only matching transactions', async ({ page }) => {
    logger.info('Starting test: QE-10347 TS-002 TC-001');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Set up test data with 200 diverse transactions
    await transactionPage.setupDiverseTestData({
      totalTransactions: 200,
      cardIds: ['card-123', 'card-456', 'card-789'],
      amountRange: { min: 10, max: 2000 },
      dateRange: 'last90days',
      merchants: ['restaurant', 'store', 'gas station']
    });
    logger.info('Test data setup: 200 diverse transactions');
    
    // Step 2: Apply multiple filters simultaneously
    await transactionPage.navigate();
    await transactionPage.applyMultipleFilters({
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      cardId: 'card-123',
      minAmount: 50,
      maxAmount: 500,
      searchText: 'restaurant'
    });
    logger.info('Applied 5 filters: date range, card, amount range, search text');
    
    // Step 3: Verify all transactions match card-123
    const allMatchCard = await transactionPage.verifyAllTransactionsMatchCard('card-123');
    expect(allMatchCard).toBeTruthy();
    logger.info('Verified all transactions match card-123');
    
    // Step 4: Verify all transactions have amount between $50 and $500
    const allAmountsValid = await transactionPage.verifyAllAmountsInRange(50, 500);
    expect(allAmountsValid).toBeTruthy();
    logger.info('Verified all amounts between $50 and $500');
    
    // Step 5: Verify all transactions have date within last 30 days
    const allDatesValid = await transactionPage.verifyAllTransactionDatesInRange('2024-12-01', '2024-12-31');
    expect(allDatesValid).toBeTruthy();
    logger.info('Verified all dates within Dec 2024');
    
    // Step 6: Verify all transactions contain 'restaurant'
    const allContainRestaurant = await transactionPage.verifyAllTransactionsContainText('restaurant');
    expect(allContainRestaurant).toBeTruthy();
    logger.info('Verified all transactions contain "restaurant"');
    
    // Step 7: Verify totalCount reflects correct matching count
    const totalCount = await transactionPage.getTotalCount();
    expect(totalCount).toBeGreaterThan(0);
    logger.info(`Total matching transactions: ${totalCount}`);
  });

  test('QE-10347 TS-003 TC-001: Verify system rejects invalid date range filter', async ({ page }) => {
    logger.info('Starting test: QE-10347 TS-003 TC-001');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Apply invalid date range (start > end)
    await transactionPage.navigate();
    await transactionPage.applyDateRangeFilter('2024-12-31', '2024-01-01');
    logger.info('Applied invalid date range: start=2024-12-31, end=2024-01-01');
    
    // Step 2: Verify API returns validation error
    const errorVisible = await transactionPage.isValidationErrorVisible();
    expect(errorVisible).toBeTruthy();
    logger.info('Validation error displayed');
    
    // Step 3: Verify error message indicates date range constraint violation
    const errorMessage = await transactionPage.getValidationErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('start date');
    expect(errorMessage.toLowerCase()).toContain('before');
    logger.info('Error message verified: indicates date constraint violation');
  });

  test('QE-10347 TS-003 TC-002: Verify system rejects invalid amount range filter', async ({ page }) => {
    logger.info('Starting test: QE-10347 TS-003 TC-002');
    const transactionPage = new TransactionPage(page);
    
    // Step 1: Apply invalid amount range (min > max)
    await transactionPage.navigate();
    await transactionPage.applyAmountRangeFilter(1000, 100);
    logger.info('Applied invalid amount range: min=1000, max=100');
    
    // Step 2: Verify API returns validation error
    const errorVisible = await transactionPage.isValidationErrorVisible();
    expect(errorVisible).toBeTruthy();
    logger.info('Validation error displayed');
    
    // Step 3: Verify error message indicates amount range constraint violation
    const errorMessage = await transactionPage.getValidationErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('minimum amount');
    expect(errorMessage.toLowerCase()).toContain('maximum');
    logger.info('Error message verified: indicates amount constraint violation');
  });

});
