const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { TransactionPage } = require('./pages/transaction.page');

test.describe('Transaction History Tests - QE-10619', () => {

  test('QE-10619 TS-001 TC-001: Verify paginated transaction history retrieval with 12 months of data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Launch the Credit Card Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2: Log in with valid credentials
    await loginPage.login('testuser_12months', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to Transaction History section
    await transactionPage.navigateToTransactions();
    await expect(transactionPage.transactionTable).toBeVisible();

    // Step 4: Verify first page displays transactions with pagination controls
    await transactionPage.waitForTransactionsToLoad();
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(20);
    await expect(transactionPage.paginationControls).toBeVisible();
    await expect(transactionPage.nextButton).toBeVisible();
    await expect(transactionPage.previousButton).toBeVisible();

    // Step 5: Click Next button
    await transactionPage.clickNext();
    await transactionPage.waitForTransactionsToLoad();
    const secondPageCount = await transactionPage.getTransactionCount();
    expect(secondPageCount).toBe(20);

    // Step 6: Verify total transaction count
    const totalCount = await transactionPage.getTotalTransactionCount();
    expect(totalCount).toBeGreaterThanOrEqual(240);
  });

  test('QE-10619 TS-001 TC-002: Verify pagination controls functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_12months', 'Pass@123');

    // Step 2: Navigate to Transaction History
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionsToLoad();

    // Step 3: Verify Previous button is disabled on first page
    await expect(transactionPage.previousButton).toBeDisabled();

    // Step 4: Jump to page 3
    await transactionPage.goToPage(3);
    await transactionPage.waitForTransactionsToLoad();
    const currentPage = await transactionPage.getCurrentPage();
    expect(currentPage).toBe(3);

    // Step 5: Click Previous button
    await transactionPage.clickPrevious();
    await transactionPage.waitForTransactionsToLoad();
    const newPage = await transactionPage.getCurrentPage();
    expect(newPage).toBe(2);

    // Step 6: Navigate to last page
    await transactionPage.goToLastPage();
    await transactionPage.waitForTransactionsToLoad();
    await expect(transactionPage.nextButton).toBeDisabled();
  });

  test('QE-10619 TS-002 TC-001: Verify date range filter returns only transactions within specified range', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');

    // Step 2: Navigate to Transaction History
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionsToLoad();

    // Step 3 & 4: Enter date range
    await transactionPage.setStartDate('2024-01-01');
    await transactionPage.setEndDate('2024-03-31');

    // Step 5: Apply filter
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForTransactionsToLoad();

    // Step 6: Verify all transactions are within date range
    const allDatesValid = await transactionPage.verifyTransactionDatesInRange('2024-01-01', '2024-03-31');
    expect(allDatesValid).toBe(true);
  });

  test('QE-10619 TS-002 TC-002: Verify date range filter with single day range', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');

    // Step 2: Navigate to Transaction History
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionsToLoad();

    // Step 3: Enter same date for start and end
    await transactionPage.setStartDate('2024-02-15');
    await transactionPage.setEndDate('2024-02-15');

    // Step 4: Apply filter
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForTransactionsToLoad();

    // Step 5: Verify all transactions are from specified date
    const allDatesMatch = await transactionPage.verifyAllTransactionsHaveDate('2024-02-15');
    expect(allDatesMatch).toBe(true);
  });

  test('QE-10619 TS-003 TC-001: Verify system rejects invalid date range (end before start)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');

    // Step 2: Navigate to Transaction History
    await transactionPage.navigateToTransactions();
    await transactionPage.waitForTransactionsToLoad();

    // Step 3 & 4: Enter invalid date range
    await transactionPage.setStartDate('2024-06-01');
    await transactionPage.setEndDate('2024-05-01');

    // Step 5: Apply filter and verify error
    await transactionPage.clickApplyFilter();
    await expect(transactionPage.validationErrorMessage).toBeVisible();
    const errorText = await transactionPage.getValidationErrorText();
    expect(errorText).toContain('Invalid date range');

    // Step 6: Verify transaction list remains unchanged
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
  });

});