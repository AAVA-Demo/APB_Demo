const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { Logger } = require('../utils/logger');

test.describe('Multi-Card Transaction Listing - QE-8452', () => {
  let transactionPage;
  const logger = new Logger();

  test.beforeEach(async ({ page }) => {
    transactionPage = new TransactionPage(page);
    await transactionPage.navigate();
    logger.info('Navigated to transaction page');
  });

  test('QE-8452 TS-001 TC-001: Verify system retrieves and displays all transactions from multiple credit cards in a single consolidated list with pagination within 1 second', async () => {
    logger.info('Starting test: Multi-card transaction listing');
    
    const startTime = Date.now();
    await transactionPage.loadTransactions(1, 50);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(1000);
    logger.info(`Transaction load time: ${loadTime}ms`);
    
    await transactionPage.waitForTransactionsToLoad();
    const transactions = await transactionPage.getDisplayedTransactions();
    
    const cardIds = new Set(transactions.map(txn => txn.cardId));
    expect(cardIds.has('CARD1')).toBeTruthy();
    expect(cardIds.has('CARD2')).toBeTruthy();
    expect(cardIds.has('CARD3')).toBeTruthy();
    
    for (const txn of transactions) {
      expect(txn).toHaveProperty('transactionDate');
      expect(txn).toHaveProperty('merchantName');
      expect(txn).toHaveProperty('amount');
      expect(txn).toHaveProperty('cardId');
    }
    
    logger.info(`Validated ${transactions.length} transactions from ${cardIds.size} cards`);
  });

  test('QE-8452 TS-002 TC-001: Verify system displays appropriate message when one or more credit cards have zero transactions', async () => {
    logger.info('Starting test: Zero transaction handling');
    
    await transactionPage.setupTestScenario({ card1Transactions: 50, card2Transactions: 0 });
    await transactionPage.navigate();
    
    await transactionPage.waitForTransactionsToLoad();
    const transactions = await transactionPage.getDisplayedTransactions();
    
    const card1Transactions = transactions.filter(txn => txn.cardId === 'CARD1');
    expect(card1Transactions.length).toBe(50);
    
    const emptyStateMessage = await transactionPage.getEmptyStateMessage('CARD2');
    expect(emptyStateMessage).toBeTruthy();
    expect(emptyStateMessage.toLowerCase()).toContain('no transactions');
    
    logger.info(`Empty state message validated: ${emptyStateMessage}`);
  });

  test('QE-8452 TS-003 TC-001: Verify transaction retrieval completes within 1 second for maximum supported transaction count (10,000 transactions)', async () => {
    logger.info('Starting test: Performance with 10,000 transactions');
    
    await transactionPage.setupTestScenario({ totalTransactions: 10000 });
    
    const startTime = Date.now();
    await transactionPage.loadTransactions(1, 50);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(1000);
    logger.info(`Transaction load time: ${loadTime}ms`);
    
    const paginationInfo = await transactionPage.getPaginationInfo();
    expect(paginationInfo.totalCount).toBe(10000);
    expect(paginationInfo.totalPages).toBe(200);
    
    logger.info('Performance validated for 10,000 transactions');
  });

  test('QE-8452 TS-003 TC-002: Verify system returns error or warning when transaction count exceeds 10,000 limit', async () => {
    logger.info('Starting test: Transaction limit exceeded');
    
    await transactionPage.setupTestScenario({ totalTransactions: 10001 });
    await transactionPage.navigate();
    
    const warningMessage = await transactionPage.getWarningMessage();
    expect(warningMessage).toBeTruthy();
    expect(warningMessage.toLowerCase()).toContain('exceeds');
    expect(warningMessage.toLowerCase()).toContain('10,000');
    
    logger.info(`Warning message validated: ${warningMessage}`);
  });
});
