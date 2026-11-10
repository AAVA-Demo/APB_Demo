const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { logger } = require('../utils/logger');

test.describe('Transaction Management Tests', () => {
  let transactionPage;

  test.beforeEach(async ({ page }) => {
    transactionPage = new TransactionPage(page);
    await transactionPage.navigate();
    await transactionPage.login('testuser@example.com', 'Test@123');
    logger.info('User logged in successfully for transaction tests');
  });

  test('QE-10334 TS-001 TC-001 - Verify comprehensive transaction history retrieval', async ({ page }) => {
    logger.info('Starting test: Verify comprehensive transaction history retrieval');
    
    await transactionPage.navigateToTransactions();
    
    await expect(transactionPage.transactionList).toBeVisible();
    logger.info('Transaction list is visible');
    
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info(`Found ${transactionCount} transactions`);
    
    const firstTransaction = await transactionPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.cardName).toBeTruthy();
    logger.info('First transaction has all required fields');
    
    const hasVisaTransactions = await transactionPage.hasTransactionsForCard('Visa Platinum');
    const hasMastercardTransactions = await transactionPage.hasTransactionsForCard('Mastercard Gold');
    expect(hasVisaTransactions).toBe(true);
    expect(hasMastercardTransactions).toBe(true);
    logger.info('Transactions from both cards are displayed');
    
    const isSortedDescending = await transactionPage.isTransactionsSortedByDateDescending();
    expect(isSortedDescending).toBe(true);
    logger.info('Transactions are sorted by date in descending order');
  });

  test('QE-10334 TS-002 TC-001 - Verify empty transaction list handling', async ({ page }) => {
    logger.info('Starting test: Verify empty transaction list handling');
    
    await transactionPage.logout();
    await transactionPage.login('newuser@example.com', 'Test@123');
    await transactionPage.navigateToTransactions();
    
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    logger.info('Transaction list is empty');
    
    await expect(transactionPage.emptyStateMessage).toBeVisible();
    const messageText = await transactionPage.getEmptyStateMessageText();
    expect(messageText).toContain('No transaction history available');
    logger.info('Empty state message displayed correctly');
  });

  test('QE-10334 TS-003 TC-001 - Verify service unavailability error handling', async ({ page }) => {
    logger.info('Starting test: Verify service unavailability error handling');
    
    await transactionPage.simulateServiceUnavailable();
    await transactionPage.navigateToTransactions();
    
    await expect(transactionPage.errorMessage).toBeVisible();
    const errorText = await transactionPage.getErrorMessageText();
    expect(errorText).toContain('Failed to load transactions');
    expect(errorText).toContain('currently unavailable');
    logger.info('Error message displayed correctly');
    
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    logger.info('No partial data displayed');
  });

  test('QE-10330 TS-001 TC-001 - Verify detailed transaction information view', async ({ page }) => {
    logger.info('Starting test: Verify detailed transaction information view');
    
    await transactionPage.navigateToTransactions();
    await transactionPage.selectTransaction(0);
    
    await expect(transactionPage.transactionDetailView).toBeVisible();
    logger.info('Transaction detail view is visible');
    
    const transactionId = await transactionPage.getDetailTransactionId();
    expect(transactionId).toBeTruthy();
    logger.info(`Transaction ID: ${transactionId}`);
    
    const dateTime = await transactionPage.getDetailDateTime();
    expect(dateTime).toBeTruthy();
    logger.info(`Date/Time: ${dateTime}`);
    
    const amount = await transactionPage.getDetailAmount();
    expect(amount).toBeTruthy();
    logger.info(`Amount: ${amount}`);
    
    const merchant = await transactionPage.getDetailMerchant();
    expect(merchant).toBeTruthy();
    logger.info(`Merchant: ${merchant}`);
    
    const category = await transactionPage.getDetailCategory();
    expect(category).toBeTruthy();
    logger.info(`Category: ${category}`);
    
    const cardInfo = await transactionPage.getDetailCardInfo();
    expect(cardInfo).toBeTruthy();
    expect(cardInfo).toContain('****');
    logger.info(`Card: ${cardInfo}`);
    
    const status = await transactionPage.getDetailStatus();
    expect(status).toBeTruthy();
    logger.info(`Status: ${status}`);
    
    const description = await transactionPage.getDetailDescription();
    expect(description).toBeTruthy();
    logger.info(`Description: ${description}`);
  });

  test('QE-10330 TS-002 TC-001 - Verify non-existent transaction ID error handling', async ({ page }) => {
    logger.info('Starting test: Verify non-existent transaction ID error');
    
    await transactionPage.navigateToTransactionDetail('TXN99999');
    
    await expect(transactionPage.errorMessage).toBeVisible();
    const errorText = await transactionPage.getErrorMessageText();
    expect(errorText).toContain('Transaction not found');
    logger.info('Transaction not found error displayed correctly');
    
    await expect(transactionPage.transactionDetailView).not.toBeVisible();
    logger.info('No transaction details displayed');
    
    await expect(transactionPage.backToTransactionsButton).toBeVisible();
    logger.info('Back to Transactions button is available');
  });

  test('QE-10330 TS-003 TC-001 - Verify unauthorized transaction access prevention', async ({ page }) => {
    logger.info('Starting test: Verify unauthorized transaction access prevention');
    
    await transactionPage.logout();
    await transactionPage.login('usera@example.com', 'Test@123');
    
    await transactionPage.navigateToTransactionDetail('TXN2001');
    
    await expect(transactionPage.errorMessage).toBeVisible();
    const errorText = await transactionPage.getErrorMessageText();
    expect(errorText).toContain('Access Denied');
    expect(errorText).toContain('not authorized');
    logger.info('Access denied error displayed correctly');
    
    await expect(transactionPage.transactionDetailView).not.toBeVisible();
    logger.info('No transaction details displayed for unauthorized access');
  });
});
