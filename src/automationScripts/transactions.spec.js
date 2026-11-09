const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { TransactionsPage } = require('./pages/transactions.page');
const logger = require('../utils/logger');

test.describe('Transaction History and Filtering Tests', () => {
  let loginPage;
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    logger.info('Navigating to application');
    await loginPage.navigate();
  });

  // Test Case: QE-8464 TS-001 TC-001
  test('QE-8464 TS-001 TC-001 - Verify chronological transaction list with all required details', async () => {
    logger.info('Test Case: QE-8464 TS-001 TC-001 - Transaction history display');
    
    // Step 1-2: Login with 50-transaction user
    logger.info('Step 1-2: Logging in with user having 50 transactions');
    await loginPage.login('testuser_50txns', 'Test@123');
    await expect(transactionsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Transactions section
    logger.info('Step 3: Navigating to Transactions section');
    await transactionsPage.navigateToTransactions();
    await expect(transactionsPage.page).toHaveURL(/.*transactions/);
    
    // Step 4: Verify chronological order
    logger.info('Step 4: Verifying transactions in chronological order');
    await expect(transactionsPage.transactionRows.first()).toBeVisible();
    const isChronological = await transactionsPage.verifyChronologicalOrder();
    expect(isChronological).toBe(true);
    
    // Step 5-8: Verify first transaction details
    logger.info('Step 5-8: Verifying first transaction details');
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    expect(firstTransaction.merchantName).toBe('Amazon');
    expect(firstTransaction.amount).toBe('$125.99');
    expect(firstTransaction.date).toBe('Jan 20, 2024');
    expect(firstTransaction.card).toBe('Visa Gold ****1234');
    
    // Step 9: Verify all 50 transactions accessible
    logger.info('Step 9: Verifying all 50 transactions are accessible');
    const totalTransactions = await transactionsPage.getTotalTransactionCount();
    expect(totalTransactions).toBe(50);
    
    logger.info('Test Case QE-8464 TS-001 TC-001 completed successfully');
  });

  // Test Case: QE-8464 TS-002 TC-001
  test('QE-8464 TS-002 TC-001 - Verify appropriate message for user with no transactions', async () => {
    logger.info('Test Case: QE-8464 TS-002 TC-001 - No transactions handling');
    
    // Step 1-2: Login with no-transactions user
    logger.info('Step 1-2: Logging in with user having no transactions');
    await loginPage.login('testuser_notxns', 'Test@123');
    await expect(transactionsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Transactions section
    logger.info('Step 3: Navigating to Transactions section');
    await transactionsPage.navigateToTransactions();
    await expect(transactionsPage.page).toHaveURL(/.*transactions/);
    
    // Step 4: Verify appropriate message
    logger.info('Step 4: Verifying no transactions message');
    await expect(transactionsPage.noTransactionsMessage).toBeVisible();
    const messageText = await transactionsPage.noTransactionsMessage.textContent();
    expect(messageText).toContain('No transactions found');
    expect(messageText).toContain('Your transaction history will appear here once you start using your credit cards');
    
    // Step 5: Verify no transaction table displayed
    logger.info('Step 5: Verifying no transaction table is rendered');
    await expect(transactionsPage.transactionRows).toHaveCount(0);
    
    // Step 6: Verify no JavaScript errors
    logger.info('Step 6: Verifying no JavaScript errors in console');
    const consoleErrors = [];
    transactionsPage.page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await transactionsPage.page.waitForTimeout(2000);
    expect(consoleErrors.length).toBe(0);
    
    logger.info('Test Case QE-8464 TS-002 TC-001 completed successfully');
  });

  // Test Case: QE-8464 TS-003 TC-001
  test('QE-8464 TS-003 TC-001 - Verify transaction displays all required fields with correct formatting', async () => {
    logger.info('Test Case: QE-8464 TS-003 TC-001 - Transaction field verification');
    
    // Step 1-2: Login
    logger.info('Step 1-2: Logging in with valid credentials');
    await loginPage.login('testuser', 'Test@123');
    await expect(transactionsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Transactions section
    logger.info('Step 3: Navigating to Transactions section');
    await transactionsPage.navigateToTransactions();
    await expect(transactionsPage.transactionRows.first()).toBeVisible();
    
    // Step 4-8: Verify all required fields
    logger.info('Step 4-8: Verifying all required transaction fields');
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    
    expect(firstTransaction.merchantName).toBe('Starbucks');
    expect(firstTransaction.amount).toBe('$15.50');
    expect(firstTransaction.date).toBe('Jan 15, 2024');
    expect(firstTransaction.card).toBe('Visa ****1234');
    
    logger.info('Test Case QE-8464 TS-003 TC-001 completed successfully');
  });

  // Test Case: QE-8462 TS-001 TC-001
  test('QE-8462 TS-001 TC-001 - Verify card-specific transaction filter functionality', async () => {
    logger.info('Test Case: QE-8462 TS-001 TC-001 - Card filter verification');
    
    // Step 1-2: Login with 3-card user
    logger.info('Step 1-2: Logging in with 3-card user');
    await loginPage.login('testuser_3cards', 'Test@123');
    await expect(transactionsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Transactions section
    logger.info('Step 3: Navigating to Transactions section');
    await transactionsPage.navigateToTransactions();
    await expect(transactionsPage.cardFilterDropdown).toBeVisible();
    
    // Step 4: Verify filter dropdown options
    logger.info('Step 4: Verifying card filter dropdown options');
    const filterOptions = await transactionsPage.getCardFilterOptions();
    expect(filterOptions).toContain('All Cards');
    expect(filterOptions).toContain('Visa Gold ****1234');
    expect(filterOptions).toContain('Mastercard Platinum ****5678');
    expect(filterOptions).toContain('Amex Blue ****9012');
    
    // Step 5: Select Visa Gold filter
    logger.info('Step 5: Selecting Visa Gold ****1234 filter');
    await transactionsPage.selectCardFilter('Visa Gold ****1234');
    await transactionsPage.page.waitForTimeout(1000);
    
    // Step 6: Verify only Visa Gold transactions displayed
    logger.info('Step 6: Verifying only Visa Gold transactions displayed');
    const filteredCount = await transactionsPage.getVisibleTransactionCount();
    expect(filteredCount).toBe(15);
    
    const allTransactions = await transactionsPage.getAllVisibleTransactionCards();
    allTransactions.forEach(card => {
      expect(card).toBe('Visa Gold ****1234');
    });
    
    // Step 7: Verify chronological order maintained
    logger.info('Step 7: Verifying chronological order after filtering');
    const isChronological = await transactionsPage.verifyChronologicalOrder();
    expect(isChronological).toBe(true);
    
    // Step 8: Verify no other card transactions visible
    logger.info('Step 8: Verifying no other card transactions visible');
    const hasOtherCards = await transactionsPage.hasTransactionsFromOtherCards(['Mastercard Platinum ****5678', 'Amex Blue ****9012']);
    expect(hasOtherCards).toBe(false);
    
    logger.info('Test Case QE-8462 TS-001 TC-001 completed successfully');
  });

  // Test Case: QE-8462 TS-002 TC-001
  test('QE-8462 TS-002 TC-001 - Verify empty filter results handling', async () => {
    logger.info('Test Case: QE-8462 TS-002 TC-001 - Empty filter results');
    
    // Step 1-2: Login with new-card user
    logger.info('Step 1-2: Logging in with user having card with no transactions');
    await loginPage.login('testuser_newcard', 'Test@123');
    await expect(transactionsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Transactions section
    logger.info('Step 3: Navigating to Transactions section');
    await transactionsPage.navigateToTransactions();
    await expect(transactionsPage.cardFilterDropdown).toBeVisible();
    
    // Step 4: Select card with no transactions
    logger.info('Step 4: Selecting card with no transactions');
    await transactionsPage.selectCardFilter('Amex Blue ****9012');
    await transactionsPage.page.waitForTimeout(1000);
    
    // Step 5: Verify appropriate message
    logger.info('Step 5: Verifying no transactions message for selected card');
    await expect(transactionsPage.noTransactionsForCardMessage).toBeVisible();
    const messageText = await transactionsPage.noTransactionsForCardMessage.textContent();
    expect(messageText).toContain('No transactions found for the selected card');
    expect(messageText).toContain('Transactions will appear here once you start using this card');
    
    // Step 6: Verify empty transaction list
    logger.info('Step 6: Verifying transaction list is empty');
    await expect(transactionsPage.transactionRows).toHaveCount(0);
    
    logger.info('Test Case QE-8462 TS-002 TC-001 completed successfully');
  });

  // Test Case: QE-8462 TS-003 TC-001
  test('QE-8462 TS-003 TC-001 - Verify filter clear and restore functionality', async () => {
    logger.info('Test Case: QE-8462 TS-003 TC-001 - Filter clear and restore');
    
    // Step 1-2: Login with multi-card user
    logger.info('Step 1-2: Logging in with multi-card user');
    await loginPage.login('testuser_multicard', 'Test@123');
    await expect(transactionsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Transactions section
    logger.info('Step 3: Navigating to Transactions section');
    await transactionsPage.navigateToTransactions();
    await expect(transactionsPage.transactionRows.first()).toBeVisible();
    
    const initialCount = await transactionsPage.getVisibleTransactionCount();
    expect(initialCount).toBe(45);
    
    // Step 4: Apply Visa Gold filter
    logger.info('Step 4: Applying Visa Gold filter');
    await transactionsPage.selectCardFilter('Visa Gold ****1234');
    await transactionsPage.page.waitForTimeout(1000);
    
    const filteredCount = await transactionsPage.getVisibleTransactionCount();
    expect(filteredCount).toBe(15);
    
    // Step 5: Clear filter by selecting All Cards
    logger.info('Step 5: Clearing filter by selecting All Cards');
    await transactionsPage.selectCardFilter('All Cards');
    await transactionsPage.page.waitForTimeout(1000);
    
    // Step 6: Verify all transactions restored
    logger.info('Step 6: Verifying all transactions restored');
    const restoredCount = await transactionsPage.getVisibleTransactionCount();
    expect(restoredCount).toBe(45);
    
    // Step 7: Verify transactions from all cards visible
    logger.info('Step 7: Verifying transactions from all cards visible');
    const allCards = await transactionsPage.getAllUniqueCardTypes();
    expect(allCards.length).toBeGreaterThan(1);
    expect(allCards).toContain('Visa Gold');
    expect(allCards).toContain('Mastercard Platinum');
    expect(allCards).toContain('Amex Blue');
    
    logger.info('Test Case QE-8462 TS-003 TC-001 completed successfully');
  });
});
