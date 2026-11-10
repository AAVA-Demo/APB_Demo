const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { TransactionPage } = require('./pages/transaction.page');

test.describe('Multi-Card Transaction Management Tests - QE-10618', () => {

  test('QE-10618 TS-001 TC-001: Verify consolidated transaction list displays all card transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Login with multi-card user
    await loginPage.navigate();
    await loginPage.login('multicard_user', 'Pass@123');

    // Step 2: Navigate to Transaction Management
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionsToLoad();

    // Step 3: Verify transactions from all cards are displayed
    const hasVisaPlatinum = await transactionPage.hasTransactionsForCard('Visa Platinum');
    const hasMastercardGold = await transactionPage.hasTransactionsForCard('Mastercard Gold');
    const hasAmexBlue = await transactionPage.hasTransactionsForCard('Amex Blue');
    expect(hasVisaPlatinum).toBe(true);
    expect(hasMastercardGold).toBe(true);
    expect(hasAmexBlue).toBe(true);

    // Step 4: Verify transaction details are complete
    const firstTransaction = await transactionPage.getFirstTransaction();
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.category).toBeTruthy();
    expect(firstTransaction.card).toBeTruthy();

    // Step 5: Verify transactions are sorted by date descending
    const isSortedDescending = await transactionPage.verifyDateSortingDescending();
    expect(isSortedDescending).toBe(true);
  });

  test('QE-10618 TS-001 TC-002: Verify user can filter by specific credit card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('multicard_user', 'Pass@123');

    // Step 2: Navigate to Transaction Management
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionsToLoad();

    // Step 3: Select specific card from filter
    await transactionPage.selectCardFilter('Visa Platinum (****1234)');

    // Step 4: Apply filter
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForTransactionsToLoad();

    // Step 5: Verify all transactions are from selected card
    const allFromSelectedCard = await transactionPage.verifyAllTransactionsFromCard('Visa Platinum');
    expect(allFromSelectedCard).toBe(true);
  });

  test('QE-10618 TS-002 TC-001: Verify message when user has no transaction history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Login with user having no transactions
    await loginPage.navigate();
    await loginPage.login('new_user_no_txn', 'Pass@123');

    // Step 2: Navigate to Transaction Management
    await transactionPage.navigateToTransactions();

    // Step 3: Verify no transactions message
    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    const messageText = await transactionPage.getNoTransactionsMessageText();
    expect(messageText).toContain('No transactions available');

    // Step 4: Verify table and pagination are not displayed
    await expect(transactionPage.transactionTable).not.toBeVisible();
    await expect(transactionPage.paginationControls).not.toBeVisible();
  });

  test('QE-10618 TS-003 TC-001: Verify unauthorized access is denied', async ({ page }) => {
    const transactionPage = new TransactionPage(page);

    // Step 1: Launch application
    await page.goto('/transactions');

    // Step 2 & 3: Verify redirect to login with error
    await expect(page).toHaveURL(/login/);
    await expect(transactionPage.authErrorMessage).toBeVisible();
    const errorText = await transactionPage.getAuthErrorMessageText();
    expect(errorText).toMatch(/logged in|Unauthorized/);

    // Step 4: Verify user remains on login page
    await expect(page).toHaveURL(/login/);
  });

});