const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');

/**
 * Test Suite: Transaction Listing, Filtering, and Search
 * Test Cases: QE-7959 TS-001 TC-001, QE-7959 TS-002 TC-001, QE-7959 TS-003 TC-001,
 *             QE-7955 TS-001 TC-001, QE-7955 TS-002 TC-001, QE-7955 TS-003 TC-001
 */

test.describe('Transaction Management Tests', () => {
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    transactionsPage = new TransactionsPage(page);
  });

  /**
   * Test Case ID: QE-7959 TS-001 TC-001
   * Description: Verify that selecting a specific credit card from the filter dropdown displays
   *              only transactions for that card within 1 second
   */
  test('TC-001: Filter transactions by specific credit card within 1 second', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Transactions page
    await transactionsPage.navigate();
    await transactionsPage.login('testuser@example.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    // Step 3: Verify user has transaction history on at least 3 different credit cards
    await expect(transactionsPage.transactionList).toBeVisible();
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    
    const uniqueCards = await transactionsPage.getUniqueCardNumbers();
    expect(uniqueCards.length).toBeGreaterThanOrEqual(3);
    
    // Step 4: Locate and expand card filter dropdown
    await transactionsPage.clickCardFilterDropdown();
    await expect(transactionsPage.cardFilterDropdown).toBeVisible();
    
    // Step 5: Select 'Visa *1234' from dropdown
    const startTime = Date.now();
    await transactionsPage.selectCardFromFilter('Visa *1234');
    
    // Step 6: Measure transaction list update time
    await transactionsPage.waitForTransactionListUpdate();
    const filterTime = Date.now() - startTime;
    expect(filterTime).toBeLessThan(1000);
    
    // Step 7: Verify all displayed transactions belong to selected card
    const displayedTransactions = await transactionsPage.getAllDisplayedTransactions();
    displayedTransactions.forEach(transaction => {
      expect(transaction.cardNumber).toBe('Visa *1234');
    });
    
    // Step 8: Verify transaction count matches expected number
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBe(25);
  });

  /**
   * Test Case ID: QE-7959 TS-002 TC-001
   * Description: Verify that selecting a credit card with no transaction history displays
   *              an appropriate 'No transactions found' message
   */
  test('TC-002: Display appropriate message for card with no transactions', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Transactions page
    await transactionsPage.navigate();
    await transactionsPage.login('testuser@example.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    // Step 3: Verify user has at least one card with no transaction history
    await expect(transactionsPage.transactionList).toBeVisible();
    
    // Step 4: Open card filter dropdown and select card with no transactions
    await transactionsPage.clickCardFilterDropdown();
    await transactionsPage.selectCardFromFilter('Discover *3456');
    
    // Step 5: Observe transaction list area
    await expect(transactionsPage.noTransactionsMessage).toBeVisible();
    const noDataMessage = await transactionsPage.getNoTransactionsMessage();
    expect(noDataMessage).toContain('No transactions found for this card');
    
    // Step 6: Verify no empty table structure or error state is displayed
    const hasEmptyTable = await transactionsPage.hasEmptyTableRows();
    expect(hasEmptyTable).toBe(false);
    
    const hasErrorState = await transactionsPage.hasErrorState();
    expect(hasErrorState).toBe(false);
    
    const hasNullValues = await transactionsPage.hasNullOrUndefinedValues();
    expect(hasNullValues).toBe(false);
    
    // Step 7: Verify page remains functional and allows changing filter
    await transactionsPage.clickCardFilterDropdown();
    await transactionsPage.selectCardFromFilter('Visa *1234');
    await expect(transactionsPage.transactionList).toBeVisible();
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
  });

  /**
   * Test Case ID: QE-7959 TS-003 TC-001
   * Description: Verify that applying a card filter during high latency displays a loading indicator
   *              and timeout error with retry option
   */
  test('TC-003: Display loading indicator and timeout error during high latency', async ({ page, context }) => {
    // Step 1-2: Launch application, login, and navigate to Transactions page
    await transactionsPage.navigate();
    await transactionsPage.login('testuser@example.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    // Step 3: Simulate high latency (6 seconds delay)
    await context.route('**/api/transactions**', async route => {
      await page.waitForTimeout(6000);
      await route.continue();
    });
    
    // Step 4: Select credit card from filter dropdown
    await transactionsPage.clickCardFilterDropdown();
    await transactionsPage.selectCardFromFilter('Visa *1234');
    
    // Step 5: Observe UI immediately after applying filter
    await expect(transactionsPage.loadingIndicator).toBeVisible();
    const loadingMessage = await transactionsPage.getLoadingMessage();
    expect(loadingMessage).toContain('Loading transactions');
    
    // Step 6: Wait for timeout and verify error message
    await expect(transactionsPage.timeoutErrorMessage).toBeVisible({ timeout: 12000 });
    const errorMessage = await transactionsPage.getTimeoutErrorMessage();
    expect(errorMessage).toContain('Request timed out');
    expect(errorMessage).toContain('Please try again');
    
    // Step 7: Verify Retry button is available
    await expect(transactionsPage.retryButton).toBeVisible();
    const retryButtonText = await transactionsPage.retryButton.textContent();
    expect(retryButtonText).toContain('Retry');
    
    // Step 8: Click Retry button
    await transactionsPage.clickRetryButton();
    await expect(transactionsPage.loadingIndicator).toBeVisible();
    
    // Step 9: Verify application does not crash or freeze
    await expect(transactionsPage.dashboardNavLink).toBeEnabled();
    await expect(transactionsPage.analyticsNavLink).toBeEnabled();
  });

  /**
   * Test Case ID: QE-7955 TS-001 TC-001
   * Description: Verify that entering a merchant name in the search field displays matching transactions
   *              within 1 second with the search term highlighted
   */
  test('TC-004: Search transactions by merchant name with highlighted results within 1 second', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Transactions page
    await transactionsPage.navigate();
    await transactionsPage.login('testuser@example.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    // Step 3: Verify user has transaction history including Starbucks transactions
    await expect(transactionsPage.transactionList).toBeVisible();
    
    // Step 4: Locate search field
    await expect(transactionsPage.searchField).toBeVisible();
    const placeholderText = await transactionsPage.searchField.getAttribute('placeholder');
    expect(placeholderText).toContain('Search by merchant or description');
    
    // Step 5: Enter 'Starbucks' in search field
    const startTime = Date.now();
    await transactionsPage.enterSearchTerm('Starbucks');
    
    // Step 6: Measure transaction list update time
    await transactionsPage.waitForSearchResults();
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(1000);
    
    // Step 7: Verify all displayed transactions have 'Starbucks' in merchant name
    const displayedTransactions = await transactionsPage.getAllDisplayedTransactions();
    expect(displayedTransactions.length).toBeGreaterThanOrEqual(3);
    displayedTransactions.forEach(transaction => {
      expect(transaction.merchantName).toContain('Starbucks');
    });
    
    // Step 8: Verify search term is highlighted
    const isHighlighted = await transactionsPage.isSearchTermHighlighted('Starbucks');
    expect(isHighlighted).toBe(true);
    
    // Step 9: Verify transactions from other merchants are not displayed
    const hasOtherMerchants = await transactionsPage.hasTransactionsFromMerchants(['Amazon', 'Shell', 'Walmart']);
    expect(hasOtherMerchants).toBe(false);
  });

  /**
   * Test Case ID: QE-7955 TS-002 TC-001
   * Description: Verify that entering a search term with no matches displays a 'No matching transactions found'
   *              message and allows clearing the search
   */
  test('TC-005: Display no results message and allow clearing search for non-matching term', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Transactions page
    await transactionsPage.navigate();
    await transactionsPage.login('testuser@example.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    // Step 3: Verify user has transaction history (at least 10 transactions)
    await expect(transactionsPage.transactionList).toBeVisible();
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(10);
    
    // Step 4: Locate search field
    await expect(transactionsPage.searchField).toBeVisible();
    
    // Step 5: Enter search term that matches no transactions
    await transactionsPage.enterSearchTerm('NonExistentMerchant');
    
    // Step 6: Observe transaction list area
    await expect(transactionsPage.noMatchingTransactionsMessage).toBeVisible();
    const noMatchMessage = await transactionsPage.getNoMatchingTransactionsMessage();
    expect(noMatchMessage).toContain('No matching transactions found');
    
    // Step 7: Verify no empty table structure or error state
    const hasEmptyTable = await transactionsPage.hasEmptyTableRows();
    expect(hasEmptyTable).toBe(false);
    
    const hasErrorState = await transactionsPage.hasErrorState();
    expect(hasErrorState).toBe(false);
    
    const hasNullValues = await transactionsPage.hasNullOrUndefinedValues();
    expect(hasNullValues).toBe(false);
    
    // Step 8: Verify Clear Search button is available
    await expect(transactionsPage.clearSearchButton).toBeVisible();
    
    // Step 9: Click Clear Search button and verify all transactions are displayed
    await transactionsPage.clickClearSearchButton();
    await expect(transactionsPage.transactionList).toBeVisible();
    const allTransactionsCount = await transactionsPage.getTransactionCount();
    expect(allTransactionsCount).toBeGreaterThanOrEqual(10);
  });

  /**
   * Test Case ID: QE-7955 TS-003 TC-001
   * Description: Verify that entering a partial merchant name performs a case-insensitive partial match search
   *              and displays results within 1 second
   */
  test('TC-006: Perform case-insensitive partial match search within 1 second', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Transactions page
    await transactionsPage.navigate();
    await transactionsPage.login('testuser@example.com', 'Test@123');
    await transactionsPage.navigateToTransactions();
    
    // Step 3: Verify user has transactions from merchants containing 'Star'
    await expect(transactionsPage.transactionList).toBeVisible();
    
    // Step 4: Locate search field
    await expect(transactionsPage.searchField).toBeVisible();
    
    // Step 5: Enter partial search term 'Star'
    const startTime = Date.now();
    await transactionsPage.enterSearchTerm('Star');
    
    // Step 6: Measure transaction list update time
    await transactionsPage.waitForSearchResults();
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(1000);
    
    // Step 7: Verify all displayed transactions have merchant names containing 'Star'
    const displayedTransactions = await transactionsPage.getAllDisplayedTransactions();
    const expectedMerchants = ['Starbucks', 'StarMart', 'Star Cinemas'];
    displayedTransactions.forEach(transaction => {
      const matchesExpected = expectedMerchants.some(merchant => 
        transaction.merchantName.toLowerCase().includes('star')
      );
      expect(matchesExpected).toBe(true);
    });
    
    // Step 8: Test case-insensitivity with lowercase 'star'
    await transactionsPage.clearSearch();
    const startTimeLower = Date.now();
    await transactionsPage.enterSearchTerm('star');
    await transactionsPage.waitForSearchResults();
    const searchTimeLower = Date.now() - startTimeLower;
    
    // Step 9: Verify search results are returned within 1 second for lowercase
    expect(searchTimeLower).toBeLessThan(1000);
    
    const displayedTransactionsLower = await transactionsPage.getAllDisplayedTransactions();
    expect(displayedTransactionsLower.length).toBe(displayedTransactions.length);
    
    // Step 10: Verify transactions from merchants not containing 'Star' are excluded
    const hasExcludedMerchants = await transactionsPage.hasTransactionsFromMerchants(['Amazon', 'Walmart', 'Shell']);
    expect(hasExcludedMerchants).toBe(false);
  });
});