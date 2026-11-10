const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Transaction Management and Monitoring Tests', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    await loginPage.navigate();
  });

  test('TC-7110: Verify multi-card transaction listing displays all transactions with correct details within 1.5 seconds', async ({ page }) => {
    // Step 1-2: Login with valid user credentials who has multiple credit cards with transaction history
    await loginPage.login('testuser_multicards', 'Test@123');
    
    // Step 3: Navigate to the Transaction Management section
    await transactionsPage.navigate();
    
    // Step 4: Record page load time and verify it loads within 1.5 seconds
    const startTime = Date.now();
    await transactionsPage.waitForTransactionListLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1500);
    
    // Verify transaction list displays with correct fields
    await expect(transactionsPage.transactionList).toBeVisible();
    
    const firstTransaction = transactionsPage.transactionItems.first();
    await expect(firstTransaction).toBeVisible();
    
    // Verify all required fields are displayed
    await expect(transactionsPage.getTransactionDate(firstTransaction)).toBeVisible();
    await expect(transactionsPage.getTransactionMerchant(firstTransaction)).toBeVisible();
    await expect(transactionsPage.getTransactionAmount(firstTransaction)).toBeVisible();
    await expect(transactionsPage.getTransactionCategory(firstTransaction)).toBeVisible();
    await expect(transactionsPage.getTransactionCard(firstTransaction)).toBeVisible();
    
    // Step 5: Verify that transactions from all registered credit cards are displayed
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    
    // Step 6: Verify pagination controls are displayed
    await expect(transactionsPage.paginationControls).toBeVisible();
    await expect(transactionsPage.previousButton).toBeVisible();
    await expect(transactionsPage.nextButton).toBeVisible();
  });

  test('TC-7112: Verify error message is displayed when Transaction Processing Service returns 500 error', async ({ page }) => {
    // Mock API to return 500 error
    await page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });
    
    // Step 1-2: Login with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    
    // Step 3-4: Navigate to the Transaction Management section
    await transactionsPage.navigate();
    
    // Step 5: Verify error message is displayed
    await transactionsPage.waitForErrorMessage();
    await expect(transactionsPage.errorMessage).toBeVisible();
    
    const errorText = await transactionsPage.getErrorMessageText();
    expect(errorText).toMatch(/Failed to load transactions|Please try again/i);
    
    // Step 6: Verify that no transaction data is displayed
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(0);
  });

  test('TC-7114: Verify appropriate message is displayed when user has no transaction history', async ({ page }) => {
    // Mock API to return empty transaction list
    await page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ transactions: [], totalCount: 0 })
      });
    });
    
    // Step 1-2: Login with user with no transaction history
    await loginPage.login('newuser_notransactions', 'Test@123');
    
    // Step 3: Navigate to the Transaction Management section
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionListLoad();
    
    // Step 4: Verify informational message is displayed
    await expect(transactionsPage.emptyStateMessage).toBeVisible();
    const emptyStateText = await transactionsPage.getEmptyStateMessageText();
    expect(emptyStateText).toMatch(/No transactions found/i);
    
    // Step 5: Verify transaction list area is empty
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    
    // Step 6: Verify pagination controls show minimal state
    const paginationText = await transactionsPage.getPaginationText();
    expect(paginationText).toMatch(/Page 1 of 1/);
  });

  test('TC-7116: Verify transaction list filters correctly when a specific credit card is selected from dropdown', async ({ page }) => {
    // Step 1-2: Login with valid user credentials who has multiple credit cards
    await loginPage.login('testuser_multicards', 'Test@123');
    
    // Step 3: Navigate to the Transaction Management section
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionListLoad();
    
    // Step 4: Note the total number of transactions before filtering
    const initialCount = await transactionsPage.getTransactionCount();
    expect(initialCount).toBeGreaterThan(0);
    
    // Step 5: Locate the 'Filter by Card' dropdown
    await expect(transactionsPage.cardFilterDropdown).toBeVisible();
    
    const defaultSelection = await transactionsPage.getSelectedCardFilter();
    expect(defaultSelection).toMatch(/All Cards/i);
    
    // Step 6-7: Select 'Visa Gold' from the filter dropdown
    await transactionsPage.selectCardFilter('Visa Gold');
    await transactionsPage.waitForTransactionListLoad();
    
    // Verify transaction list updates to show only Visa Gold transactions
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Step 8: Verify all displayed transactions belong to Visa Gold card
    const allTransactionsMatchFilter = await transactionsPage.verifyAllTransactionsMatchCard('Visa Gold');
    expect(allTransactionsMatchFilter).toBeTruthy();
  });

  test('TC-7118: Verify transaction list resets to show all cards when filter is reset to All Cards', async ({ page }) => {
    // Step 1-2: Login and navigate to Transaction Management
    await loginPage.login('testuser_multicards', 'Test@123');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionListLoad();
    
    const initialCount = await transactionsPage.getTransactionCount();
    
    // Step 3-4: Select 'MasterCard Platinum' from filter dropdown
    await transactionsPage.selectCardFilter('MasterCard Platinum');
    await transactionsPage.waitForTransactionListLoad();
    
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Verify only MasterCard Platinum transactions are displayed
    const allMatchFilter = await transactionsPage.verifyAllTransactionsMatchCard('MasterCard Platinum');
    expect(allMatchFilter).toBeTruthy();
    
    // Step 5-6: Change filter back to 'All Cards'
    await transactionsPage.selectCardFilter('All Cards');
    await transactionsPage.waitForTransactionListLoad();
    
    const resetCount = await transactionsPage.getTransactionCount();
    expect(resetCount).toBe(initialCount);
    
    // Step 7: Verify transactions from all cards are visible
    const hasMultipleCards = await transactionsPage.verifyMultipleCardsDisplayed();
    expect(hasMultipleCards).toBeTruthy();
  });

  test('TC-7120: Verify appropriate message is displayed when filtering by a card with no transaction history', async ({ page }) => {
    // Mock API to return empty transactions for specific card filter
    await page.route('**/api/transactions*cardId=*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ transactions: [], totalCount: 0 })
      });
    });
    
    // Step 1-2: Login with user who has a card with no transactions
    await loginPage.login('testuser_newcard', 'Test@123');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionListLoad();
    
    // Step 3: Select 'New Card' from filter dropdown
    await transactionsPage.selectCardFilter('New Card');
    await transactionsPage.waitForTransactionListLoad();
    
    // Step 4: Verify informational message is displayed
    await expect(transactionsPage.emptyStateMessage).toBeVisible();
    const emptyStateText = await transactionsPage.getEmptyStateMessageText();
    expect(emptyStateText).toMatch(/No transactions found|No transactions available for the selected card/i);
    
    // Step 5: Verify transaction list area is empty
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    
    // Step 6: Verify filter dropdown still shows 'New Card' as selected
    const selectedFilter = await transactionsPage.getSelectedCardFilter();
    expect(selectedFilter).toMatch(/New Card/i);
  });
});