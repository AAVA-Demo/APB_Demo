const { test, expect } = require('@playwright/test');
const { TransactionPage } = require('./pages/transaction.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Transaction Management and Details', () => {

  test('QE-8443 TS-001 TC-001 - Verify consolidated transaction list displays all transactions from multiple cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_multi_cards', 'Test@123');

    // Step 3: Navigate to transaction management
    await transactionPage.navigate();
    await expect(transactionPage.transactionListHeader).toBeVisible();

    // Step 4-5: Verify transactions from multiple cards
    const card1Transactions = await transactionPage.getTransactionsByCard('Visa Gold');
    expect(card1Transactions.length).toBeGreaterThanOrEqual(3);

    const card2Transactions = await transactionPage.getTransactionsByCard('MasterCard');
    expect(card2Transactions.length).toBeGreaterThanOrEqual(2);

    // Step 6-9: Verify transaction details
    const firstTransaction = await transactionPage.getFirstTransaction();
    expect(firstTransaction.date).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.amount).toMatch(/\$\d+\.\d{2}/);
    expect(firstTransaction.card).toBeTruthy();

    // Step 10: Verify sorting by date
    const isSortedByDate = await transactionPage.isTransactionsSortedByDate();
    expect(isSortedByDate).toBeTruthy();
  });

  test('QE-8443 TS-002 TC-001 - Verify appropriate messaging when user has no transaction history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_no_history', 'Test@123');

    // Step 3: Navigate to transaction management
    await transactionPage.navigate();

    // Step 4: Verify no transactions message
    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    const message = await transactionPage.getNoTransactionsMessage();
    expect(message).toContain('No transactions available');

    // Step 5: Verify empty list
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);

    // Step 6: Verify empty state visual
    await expect(transactionPage.emptyStateIcon).toBeVisible();
  });

  test('QE-8443 TS-003 TC-001 - Verify date range filter correctly filters and sorts transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_multi_month_txns', 'Test@123');

    // Step 3-4: Navigate and note total count
    await transactionPage.navigate();
    const initialCount = await transactionPage.getTransactionCount();
    expect(initialCount).toBeGreaterThan(0);

    // Step 5: Apply date range filter
    await transactionPage.applyDateRangeFilter('01/01/2024', '01/31/2024');

    // Step 6: Verify filtered transactions
    const filteredCount = await transactionPage.getTransactionCount();
    expect(filteredCount).toBeLessThan(initialCount);

    // Step 7: Verify no transactions outside range
    const allInRange = await transactionPage.areAllTransactionsInDateRange('01/01/2024', '01/31/2024');
    expect(allInRange).toBeTruthy();

    // Step 8: Verify sorting
    const isSorted = await transactionPage.isTransactionsSortedByDate();
    expect(isSorted).toBeTruthy();

    // Step 9: Clear filter
    await transactionPage.clearDateFilter();
    const finalCount = await transactionPage.getTransactionCount();
    expect(finalCount).toBe(initialCount);
  });

  test('QE-8441 TS-001 TC-001 - Verify complete transaction details are displayed for valid transaction', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');

    // Step 3: Navigate to transaction management
    await transactionPage.navigate();

    // Step 4: Select valid transaction
    await transactionPage.selectTransactionById('TXN-12345');

    // Step 5-10: Verify all transaction details
    await expect(transactionPage.transactionDetailContainer).toBeVisible();

    const merchantName = await transactionPage.getTransactionDetailField('merchantName');
    expect(merchantName).toBe('Amazon.com');

    const transactionDate = await transactionPage.getTransactionDetailField('date');
    expect(transactionDate).toContain('01/15/2024');

    const amount = await transactionPage.getTransactionDetailField('amount');
    expect(amount).toBe('$150.50');

    const category = await transactionPage.getTransactionDetailField('category');
    expect(category).toBe('Shopping');

    const card = await transactionPage.getTransactionDetailField('card');
    expect(card).toContain('Visa Gold');

    const status = await transactionPage.getTransactionDetailField('status');
    expect(status).toBe('Completed');
  });

  test('QE-8441 TS-002 TC-001 - Verify error message for non-existent transaction', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');

    // Step 3: Attempt to access non-existent transaction
    await transactionPage.navigateToTransactionDetail('TXN-99999');

    // Step 4: Verify error message
    await expect(transactionPage.transactionNotFoundError).toBeVisible();
    const errorMessage = await transactionPage.getErrorMessage();
    expect(errorMessage).toContain('Transaction not found');

    // Step 5: Verify no details displayed
    await expect(transactionPage.transactionDetailContainer).not.toBeVisible();

    // Step 6: Verify back button
    await expect(transactionPage.backToTransactionsButton).toBeVisible();
  });

  test('QE-8441 TS-003 TC-001 - Verify transaction details with special characters display correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');

    // Step 3: Navigate to transaction management
    await transactionPage.navigate();

    // Step 4: Select transaction with special characters
    await transactionPage.selectTransactionById('TXN-67890');

    // Step 5: Verify merchant name with special characters
    const merchantName = await transactionPage.getTransactionDetailField('merchantName');
    expect(merchantName).toBe("Joe's Café & Bakery (Ñoño's)");

    // Step 6: Verify no encoding issues
    expect(merchantName).toContain("'");
    expect(merchantName).toContain("&");
    expect(merchantName).toContain("Ñ");
    expect(merchantName).toContain("ñ");

    // Step 7: Verify other details
    const amount = await transactionPage.getTransactionDetailField('amount');
    expect(amount).toBe('$45.75');

    const category = await transactionPage.getTransactionDetailField('category');
    expect(category).toBe('Food & Dining');
  });

});
