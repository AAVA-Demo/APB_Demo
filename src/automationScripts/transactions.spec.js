const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

/**
 * Test Suite: Transaction Management and Viewing
 * Epic: QE-7500 - Transaction Management and Viewing
 * User Stories: QE-7514, QE-7513
 */

test.describe('Transaction Management and Viewing', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-7514 TS-001 TC-001
   * User Story: QE-7514 - Transaction Listing and Viewing
   * Scenario: TS-001 (Positive)
   * Description: Verify paginated transaction list displays all transactions across multiple credit cards
   */
  test('TC-001: Verify paginated transaction list displays all transactions across multiple credit cards with correct pagination', async () => {
    // Step 1-4: Login with user having multiple cards and transactions
    await loginPage.login(testData.users.testuser_transactions.username, testData.users.testuser_transactions.password);
    
    // Step 5: Navigate to Transaction Management section
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 6: Verify transactions from all cards are displayed
    const hasMultipleCards = await transactionsPage.verifyTransactionsFromMultipleCards();
    expect(hasMultipleCards).toBe(true);
    
    // Step 7: Verify transaction date column
    await expect(transactionsPage.dateColumn).toBeVisible();
    const firstDate = await transactionsPage.getTransactionDate(0);
    expect(firstDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    
    // Step 8: Verify merchant name column
    await expect(transactionsPage.merchantColumn).toBeVisible();
    const firstMerchant = await transactionsPage.getTransactionMerchant(0);
    expect(firstMerchant).toBeTruthy();
    
    // Step 9: Verify transaction amount column
    await expect(transactionsPage.amountColumn).toBeVisible();
    const firstAmount = await transactionsPage.getTransactionAmount(0);
    expect(firstAmount).toMatch(/^\$[0-9,]+\.\d{2}$/);
    
    // Step 10: Verify transaction category column
    await expect(transactionsPage.categoryColumn).toBeVisible();
    const firstCategory = await transactionsPage.getTransactionCategory(0);
    expect(firstCategory).toBeTruthy();
    
    // Step 11: Verify card information column
    await expect(transactionsPage.cardColumn).toBeVisible();
    const firstCard = await transactionsPage.getTransactionCard(0);
    expect(firstCard).toMatch(/\*{4}\d{4}/);
    
    // Step 12: Verify pagination controls
    await expect(transactionsPage.paginationControls).toBeVisible();
    
    // Step 13: Verify current page is 1
    const currentPage = await transactionsPage.getCurrentPage();
    expect(currentPage).toBe(1);
  });

  /**
   * Test Case ID: QE-7514 TS-001 TC-002
   * User Story: QE-7514 - Transaction Listing and Viewing
   * Scenario: TS-001 (Positive)
   * Description: Verify pagination navigation works correctly across multiple pages
   */
  test('TC-002: Verify pagination navigation works correctly across multiple pages of transactions', async () => {
    // Step 1-3: Login and navigate to transactions
    await loginPage.login(testData.users.testuser_transactions.username, testData.users.testuser_transactions.password);
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 4: Note transaction count on page 1
    const page1Count = await transactionsPage.getTransactionCount();
    expect(page1Count).toBeLessThanOrEqual(100);
    
    // Step 5: Click Next or Page 2
    await transactionsPage.clickNextPage();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 6: Verify page indicator shows Page 2
    const currentPage = await transactionsPage.getCurrentPage();
    expect(currentPage).toBe(2);
    
    // Step 7: Verify transactions are different from page 1
    const page2FirstTransaction = await transactionsPage.getTransactionId(0);
    await transactionsPage.clickPreviousPage();
    await transactionsPage.waitForTransactionsLoad();
    const page1FirstTransaction = await transactionsPage.getTransactionId(0);
    expect(page2FirstTransaction).not.toBe(page1FirstTransaction);
    
    // Step 8-9: Verify return to page 1
    const backToPage1 = await transactionsPage.getCurrentPage();
    expect(backToPage1).toBe(1);
  });

  /**
   * Test Case ID: QE-7514 TS-002 TC-001
   * User Story: QE-7514 - Transaction Listing and Viewing
   * Scenario: TS-002 (Negative)
   * Description: Verify empty state message when no transactions exist
   */
  test('TC-003: Verify empty state message is displayed when no transactions exist for registered cards', async () => {
    // Step 1-4: Login with user having no transactions
    await loginPage.login(testData.users.testuser_notransactions.username, testData.users.testuser_notransactions.password);
    
    // Step 5: Navigate to Transaction Management
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 6: Verify empty state message
    await expect(transactionsPage.emptyStateMessage).toBeVisible();
    const message = await transactionsPage.getEmptyStateMessage();
    expect(message).toContain('No transactions found');
    
    // Step 7: Verify guidance message
    const guidance = await transactionsPage.getEmptyStateGuidance();
    expect(guidance).toContain('Start using your credit cards');
    
    // Step 8: Verify no transaction rows
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    
    // Step 9: Verify pagination is hidden or shows 0 of 0
    const paginationVisible = await transactionsPage.paginationControls.isVisible();
    if (paginationVisible) {
      const pageInfo = await transactionsPage.getPaginationInfo();
      expect(pageInfo).toContain('0');
    }
  });

  /**
   * Test Case ID: QE-7514 TS-003 TC-001
   * User Story: QE-7514 - Transaction Listing and Viewing
   * Scenario: TS-003 (Negative)
   * Description: Verify system handles invalid page number navigation
   */
  test('TC-004: Verify system handles invalid page number navigation with appropriate error or redirect', async () => {
    // Step 1-3: Login with user having 5 pages of transactions
    await loginPage.login(testData.users.testuser_transactions.username, testData.users.testuser_transactions.password);
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 4-5: Navigate to invalid page 999
    await transactionsPage.navigateToPage(999);
    
    // Step 6: Verify validation error message
    const errorVisible = await transactionsPage.errorMessage.isVisible();
    if (errorVisible) {
      const errorText = await transactionsPage.getErrorMessage();
      expect(errorText).toContain('Invalid page number');
    }
    
    // Step 7: Verify redirect to last valid page
    await transactionsPage.waitForTransactionsLoad();
    const currentPage = await transactionsPage.getCurrentPage();
    const totalPages = await transactionsPage.getTotalPages();
    expect(currentPage).toBe(totalPages);
    
    // Step 8: Verify transactions are displayed
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
  });

  /**
   * Test Case ID: QE-7513 TS-001 TC-001
   * User Story: QE-7513 - Transaction Details Display
   * Scenario: TS-001 (Positive)
   * Description: Verify transaction details page displays all required information
   */
  test('TC-005: Verify transaction details page displays all required information when clicking on a transaction', async () => {
    // Step 1-3: Login and navigate to transactions
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 4: Click on first transaction
    await transactionsPage.clickTransaction(0);
    await transactionsPage.waitForTransactionDetailsLoad();
    
    // Step 5: Verify merchant name
    await expect(transactionsPage.detailMerchantName).toBeVisible();
    const merchantName = await transactionsPage.getDetailMerchantName();
    expect(merchantName).toBeTruthy();
    
    // Step 6: Verify transaction date
    await expect(transactionsPage.detailTransactionDate).toBeVisible();
    const transactionDate = await transactionsPage.getDetailTransactionDate();
    expect(transactionDate).toBeTruthy();
    
    // Step 7: Verify transaction amount
    await expect(transactionsPage.detailAmount).toBeVisible();
    const amount = await transactionsPage.getDetailAmount();
    expect(amount).toMatch(/\$[0-9,]+\.\d{2}/);
    
    // Step 8: Verify category
    await expect(transactionsPage.detailCategory).toBeVisible();
    const category = await transactionsPage.getDetailCategory();
    expect(category).toBeTruthy();
    
    // Step 9: Verify card used
    await expect(transactionsPage.detailCardUsed).toBeVisible();
    const cardUsed = await transactionsPage.getDetailCardUsed();
    expect(cardUsed).toMatch(/\*{4}\d{4}/);
    
    // Step 10: Verify transaction ID
    await expect(transactionsPage.detailTransactionId).toBeVisible();
    const transactionId = await transactionsPage.getDetailTransactionId();
    expect(transactionId).toBeTruthy();
    
    // Step 11: Verify transaction type
    await expect(transactionsPage.detailTransactionType).toBeVisible();
    const transactionType = await transactionsPage.getDetailTransactionType();
    expect(transactionType).toBeTruthy();
    
    // Step 12: Verify status
    await expect(transactionsPage.detailStatus).toBeVisible();
    const status = await transactionsPage.getDetailStatus();
    expect(status).toBeTruthy();
  });

  /**
   * Test Case ID: QE-7513 TS-001 TC-002
   * User Story: QE-7513 - Transaction Details Display
   * Scenario: TS-001 (Positive)
   * Description: Verify transaction details page has navigation back to transaction list
   */
  test('TC-006: Verify transaction details page has navigation back to transaction list', async () => {
    // Step 1-4: Login, navigate to transactions, note page number
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    await transactionsPage.clickNextPage();
    await transactionsPage.waitForTransactionsLoad();
    const originalPage = await transactionsPage.getCurrentPage();
    
    // Step 5: Click on transaction
    await transactionsPage.clickTransaction(0);
    await transactionsPage.waitForTransactionDetailsLoad();
    
    // Step 6: Verify Back button is present
    await expect(transactionsPage.backToListButton).toBeVisible();
    
    // Step 7: Click Back to List
    await transactionsPage.clickBackToList();
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 8: Verify return to same page
    const returnedPage = await transactionsPage.getCurrentPage();
    expect(returnedPage).toBe(originalPage);
  });

  /**
   * Test Case ID: QE-7513 TS-002 TC-001
   * User Story: QE-7513 - Transaction Details Display
   * Scenario: TS-002 (Negative)
   * Description: Verify error message when attempting to view non-existent transaction
   */
  test('TC-007: Verify appropriate error message when attempting to view non-existent transaction', async () => {
    // Step 1-3: Login and navigate to non-existent transaction URL
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await transactionsPage.navigateToTransactionDetail('txn-nonexistent-999');
    
    // Step 5: Verify error message
    await expect(transactionsPage.transactionNotFoundError).toBeVisible();
    const errorMessage = await transactionsPage.getTransactionNotFoundMessage();
    expect(errorMessage).toContain('Transaction not found');
    
    // Step 6: Verify return option
    await expect(transactionsPage.returnToListButton).toBeVisible();
    
    // Step 7-8: Click return and verify list loads
    await transactionsPage.clickReturnToList();
    await transactionsPage.waitForTransactionsLoad();
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
  });

  /**
   * Test Case ID: QE-7513 TS-003 TC-001
   * User Story: QE-7513 - Transaction Details Display
   * Scenario: TS-003 (Negative)
   * Description: Verify unauthorized access error when attempting to view another user's transaction
   */
  test('TC-008: Verify unauthorized access error when attempting to view another users transaction', async () => {
    // Step 1-3: Login as User A and navigate to User B's transaction
    await loginPage.login(testData.users.userA.username, testData.users.userA.password);
    await transactionsPage.navigateToTransactionDetail('txn-userB-12345');
    
    // Step 5: Verify access denied error
    await expect(transactionsPage.unauthorizedError).toBeVisible();
    const errorMessage = await transactionsPage.getUnauthorizedMessage();
    expect(errorMessage).toMatch(/Forbidden|Unauthorized access/);
    
    // Step 6: Verify no transaction details visible
    const detailsVisible = await transactionsPage.detailContainer.isVisible();
    expect(detailsVisible).toBe(false);
    
    // Step 7: Verify return option
    await expect(transactionsPage.returnToMyTransactionsButton).toBeVisible();
    
    // Step 8: Click return and verify navigation to own transactions
    await transactionsPage.clickReturnToMyTransactions();
    await transactionsPage.waitForTransactionsLoad();
    const currentUrl = transactionsPage.page.url();
    expect(currentUrl).toContain('/transactions');
  });
});