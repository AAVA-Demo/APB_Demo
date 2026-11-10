const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const logger = require('../utils/logger');

test.describe('Transaction Listing and Detail View', () => {

  test('QE-9566 TS-001 TC-001 - Verify transaction list retrieval for user with multiple credit cards returns all transactions sorted by date descending within 1 second', async ({ page }) => {
    logger.info('Starting test: QE-9566 TS-001 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1: Authenticate user with valid credentials who has 3 registered credit cards
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('testuser@example.com', 'CC001,CC002,CC003');
    logger.info('User authenticated with 3 credit cards');
    
    // Step 2: Call TransactionService.getTransactions() without filters
    const startTime = Date.now();
    const transactions = await transactionsPage.getTransactions();
    const responseTime = Date.now() - startTime;
    logger.info(`Transactions retrieved in ${responseTime}ms`);
    
    // Step 3: Validate response contains transactions from all 3 cards
    const cardIds = transactions.map(txn => txn.cardId);
    expect(cardIds).toContain('CC001');
    expect(cardIds).toContain('CC002');
    expect(cardIds).toContain('CC003');
    logger.info('Transactions include all 3 card IDs: CC001, CC002, CC003');
    
    // Step 4: Verify transactions are sorted by date in descending order
    for (let i = 0; i < transactions.length - 1; i++) {
      const currentDate = new Date(transactions[i].date);
      const nextDate = new Date(transactions[i + 1].date);
      expect(currentDate >= nextDate).toBe(true);
    }
    logger.info('Transactions sorted by date in descending order');
    
    // Step 5: Measure API response time
    expect(responseTime).toBeLessThanOrEqual(1000);
    logger.info(`Response time within threshold: ${responseTime}ms <= 1000ms`);
  });

  test('QE-9566 TS-002 TC-001 - Verify system returns empty transaction list with appropriate message when user has no registered credit cards', async ({ page }) => {
    logger.info('Starting test: QE-9566 TS-002 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1: Authenticate user with zero registered credit cards
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('newuser@example.com', '');
    logger.info('User authenticated with no credit cards');
    
    // Step 2: Call TransactionService.getTransactions()
    const transactions = await transactionsPage.getTransactions();
    
    // Step 3: Validate response contains empty transaction list
    expect(transactions.length).toBe(0);
    logger.info('Empty transaction list returned');
    
    // Step 4: Verify status message indicates no cards are available
    const statusMessage = await transactionsPage.getStatusMessage();
    expect(statusMessage).toContain('No cards available');
    logger.info('Status message: No cards available');
  });

  test('QE-9566 TS-003 TC-001 - Verify system returns error response when transaction data service is unavailable and does not display partial or stale data', async ({ page }) => {
    logger.info('Starting test: QE-9566 TS-003 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1: Authenticate user with valid credentials
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('testuser@example.com', 'CC001');
    logger.info('User authenticated');
    
    // Step 2: Simulate transaction data service unavailability
    await transactionsPage.simulateServiceUnavailable();
    logger.info('Transaction service unavailability simulated');
    
    // Step 3: Call TransactionService.getTransactions()
    const errorResponse = await transactionsPage.getTransactionsWithError();
    
    // Validate error response code
    expect([503, 500]).toContain(errorResponse.statusCode);
    logger.info(`Error response received: HTTP ${errorResponse.statusCode}`);
    
    // Step 4: Validate error response does not contain partial or cached transaction data
    expect(errorResponse.transactions).toBeUndefined();
    logger.info('No partial or cached transaction data in error response');
    
    // Step 5: Verify error message is user-friendly and does not expose system details
    expect(errorResponse.message).toContain('Service temporarily unavailable');
    expect(errorResponse.message).not.toContain('stack');
    expect(errorResponse.message).not.toContain('error code');
    logger.info('User-friendly error message displayed without system details');
  });

  test('QE-9571 TS-001 TC-001 - Verify system retrieves and returns complete transaction details when valid transaction ID is provided', async ({ page }) => {
    logger.info('Starting test: QE-9571 TS-001 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1: Authenticate user with valid credentials
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('testuser@example.com', 'CC001');
    logger.info('User authenticated');
    
    // Step 2: Call TransactionService.getTransactionById() with valid transaction ID
    const transactionDetail = await transactionsPage.getTransactionById('TXN001');
    logger.info('Transaction detail retrieved for TXN001');
    
    // Step 3-8: Validate all transaction detail fields
    expect(transactionDetail.merchant).toBe('Amazon');
    logger.info('Merchant validated: Amazon');
    
    expect(transactionDetail.amount).toBe(2500);
    logger.info('Amount validated: 2500');
    
    expect(transactionDetail.date).toBe('2024-01-15T00:00:00Z');
    logger.info('Date validated: 2024-01-15T00:00:00Z');
    
    expect(transactionDetail.category).toBe('Shopping');
    logger.info('Category validated: Shopping');
    
    expect(transactionDetail.cardName).toBe('Visa Platinum *1234');
    logger.info('Card name validated: Visa Platinum *1234');
    
    expect(transactionDetail.status).toBe('Completed');
    logger.info('Status validated: Completed');
  });

  test('QE-9571 TS-002 TC-001 - Verify system returns Transaction Not Found error when invalid or non-existent transaction ID is provided', async ({ page }) => {
    logger.info('Starting test: QE-9571 TS-002 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1: Authenticate user with valid credentials
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('testuser@example.com', 'CC001');
    logger.info('User authenticated');
    
    // Step 2: Call TransactionService.getTransactionById() with invalid transaction ID
    const errorResponse = await transactionsPage.getTransactionByIdWithError('INVALID_TXN_999');
    
    // Validate HTTP 404 response
    expect(errorResponse.statusCode).toBe(404);
    logger.info('HTTP 404 response received');
    
    // Step 3: Validate error response message
    expect(errorResponse.message).toContain('Transaction Not Found');
    logger.info('Error message: Transaction Not Found');
    
    // Step 4: Verify response does not expose system details
    expect(errorResponse.message).not.toContain('stack');
    expect(errorResponse.message).not.toContain('database');
    expect(errorResponse.message).not.toContain('internal');
    logger.info('No system details exposed in error response');
  });

  test('QE-9571 TS-003 TC-001 - Verify system denies access and returns authorization error when user attempts to access another users transaction', async ({ page }) => {
    logger.info('Starting test: QE-9571 TS-003 TC-001');
    const transactionsPage = new TransactionsPage(page);
    
    // Step 1: Authenticate as User A
    await transactionsPage.navigate();
    await transactionsPage.authenticateUser('userA@example.com', 'CC001');
    logger.info('User A authenticated');
    
    // Step 2: Attempt to access transaction belonging to User B
    const errorResponse = await transactionsPage.getTransactionByIdWithError('TXN_USER_B_001');
    
    // Validate HTTP 403 Forbidden
    expect(errorResponse.statusCode).toBe(403);
    logger.info('HTTP 403 Forbidden response received');
    
    // Step 3: Validate authorization error response
    expect(errorResponse.message).toMatch(/Access Denied|Unauthorized/);
    logger.info('Authorization error message displayed');
    
    // Step 4: Verify no transaction data is returned in error response
    expect(errorResponse.transactionData).toBeUndefined();
    logger.info('No transaction data leaked in error response');
  });

});