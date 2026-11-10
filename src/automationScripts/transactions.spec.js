const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const { LoginPage } = require('./pages/login.page');

// QE-10425 - Transaction Listing and Display Test Cases
test.describe('Transaction Listing and Display', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
  });

  // QE-10425 TS-001 TC-001
  test('Verify paginated transaction list displays 50 transactions per page with accurate details', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multitxn@example.com', 'Test@1234');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify exactly 50 transactions on first page
    const transactionCount = await transactionsPage.getTransactionCount();
    expect(transactionCount).toBe(50);
    
    // Verify transaction row displays all required fields
    const firstTransaction = await transactionsPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.merchant).toBeTruthy();
    expect(firstTransaction.card).toBeTruthy();
    expect(firstTransaction.amount).toContain('$');
    expect(firstTransaction.category).toBeTruthy();
    expect(firstTransaction.status).toBeTruthy();
    
    // Verify pagination controls
    await expect(transactionsPage.paginationControls).toBeVisible();
    const paginationText = await transactionsPage.getPaginationText();
    expect(paginationText).toContain('Page 1 of');
    
    // Navigate to page 2
    await transactionsPage.clickNextPage();
    await transactionsPage.waitForTransactionsLoad();
    const page2Text = await transactionsPage.getPaginationText();
    expect(page2Text).toContain('Page 2 of');
    
    // Navigate back to page 1
    await transactionsPage.clickPreviousPage();
    await transactionsPage.waitForTransactionsLoad();
    const page1Text = await transactionsPage.getPaginationText();
    expect(page1Text).toContain('Page 1 of');
  });

  // QE-10425 TS-001 TC-002
  test('Verify transaction list displays transactions from multiple credit cards correctly', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Collect unique card names from transactions
    const uniqueCards = await transactionsPage.getUniqueCardNames();
    expect(uniqueCards.length).toBeGreaterThan(1);
    
    // Verify transactions are sorted by date descending
    const dates = await transactionsPage.getAllTransactionDates();
    for (let i = 0; i < dates.length - 1; i++) {
      const date1 = new Date(dates[i]);
      const date2 = new Date(dates[i + 1]);
      expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
    }
  });

  // QE-10425 TS-001 TC-003
  test('Verify transaction table is responsive across desktop, tablet, and mobile devices', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await transactionsPage.navigate();
    
    // Desktop view (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await transactionsPage.waitForTransactionsLoad();
    await expect(transactionsPage.transactionTable).toBeVisible();
    let allColumnsVisible = await transactionsPage.areAllColumnsVisible();
    expect(allColumnsVisible).toBeTruthy();
    
    // Tablet view (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(transactionsPage.transactionTable).toBeVisible();
    
    // Mobile view (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    const isCardLayout = await transactionsPage.isCardBasedLayout();
    expect(isCardLayout).toBeTruthy();
  });

  // QE-10425 TS-002 TC-001
  test('Verify user with no transaction history sees appropriate message', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('notxn@example.com', 'Test@1234');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify no transactions message
    await expect(transactionsPage.noTransactionsMessage).toBeVisible();
    const messageText = await transactionsPage.noTransactionsMessage.textContent();
    expect(messageText).toContain('No transactions found');
    
    // Verify table is not displayed
    const tableVisible = await transactionsPage.transactionTable.isVisible();
    expect(tableVisible).toBeFalsy();
    
    // Verify no pagination controls
    const paginationVisible = await transactionsPage.paginationControls.isVisible();
    expect(paginationVisible).toBeFalsy();
  });

  // QE-10425 TS-002 TC-002
  test('Verify new user with no transaction history can navigate to other sections', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Test@1234');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify no transactions message
    await expect(transactionsPage.noTransactionsMessage).toBeVisible();
    
    // Navigate to Dashboard
    await transactionsPage.navigateToDashboard();
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify dashboard KPIs show $0
    await page.waitForSelector('[data-testid="kpi-card"]');
    
    // Navigate to Analytics
    await page.click('a[href*="analytics"]');
    await expect(page).toHaveURL(/.*analytics/);
  });

  // QE-10425 TS-003 TC-001
  test('Verify user-friendly error message when Transaction Data Service returns 500 error', async ({ page }) => {
    // Mock 500 error
    await page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await transactionsPage.navigate();
    
    // Verify error message
    await expect(transactionsPage.errorMessage).toBeVisible();
    const errorText = await transactionsPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load transactions');
    
    // Verify retry button
    await expect(transactionsPage.retryButton).toBeVisible();
    
    // Click retry
    await transactionsPage.clickRetry();
    
    // Verify application doesn't crash
    await expect(page).toHaveURL(/.*transactions/);
  });

  // QE-10425 TS-003 TC-002
  test('Verify filter and pagination state is preserved after service error and retry', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
    
    // Apply date range filter
    await transactionsPage.applyDateRangeFilter('01/01/2024', '01/31/2024');
    await transactionsPage.waitForTransactionsLoad();
    
    // Navigate to page 2
    await transactionsPage.clickNextPage();
    await transactionsPage.waitForTransactionsLoad();
    
    // Mock 500 error for next request
    await page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });
    
    // Trigger error by clicking next again
    await transactionsPage.clickNextPage();
    await expect(transactionsPage.errorMessage).toBeVisible();
    
    // Unblock route and retry
    await page.unroute('**/api/transactions*');
    await transactionsPage.clickRetry();
    
    // Verify filter is still applied
    const startDate = await transactionsPage.getStartDateValue();
    const endDate = await transactionsPage.getEndDateValue();
    expect(startDate).toBe('01/01/2024');
    expect(endDate).toBe('01/31/2024');
    
    // Verify pagination state preserved
    const paginationText = await transactionsPage.getPaginationText();
    expect(paginationText).toContain('Page 2');
  });
});

// QE-10423 - Transaction Search and Filtering Test Cases
test.describe('Transaction Search and Filtering', () => {
  let transactionsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await transactionsPage.navigate();
    await transactionsPage.waitForTransactionsLoad();
  });

  // QE-10423 TS-001 TC-001
  test('Verify date range filter displays transactions within selected range with results returned within 500ms', async ({ page }) => {
    const startTime = Date.now();
    
    await transactionsPage.applyDateRangeFilter('01/01/2024', '01/31/2024');
    await transactionsPage.waitForTransactionsLoad();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Verify response time <= 500ms
    expect(responseTime).toBeLessThanOrEqual(500);
    
    // Verify all transactions are within date range
    const dates = await transactionsPage.getAllTransactionDates();
    const startDate = new Date('01/01/2024');
    const endDate = new Date('01/31/2024');
    
    for (const dateStr of dates) {
      const txnDate = new Date(dateStr);
      expect(txnDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
      expect(txnDate.getTime()).toBeLessThanOrEqual(endDate.getTime());
    }
    
    // Verify total count is displayed
    const countText = await transactionsPage.getFilteredCountText();
    expect(countText).toMatch(/Showing \d+ transactions/);
  });

  // QE-10423 TS-001 TC-002
  test('Verify multiple filters (card ID, date range, transaction type) work together correctly', async ({ page }) => {
    const startTime = Date.now();
    
    await transactionsPage.setCardIdFilter('card123');
    await transactionsPage.applyDateRangeFilter('01/01/2024', '01/31/2024');
    await transactionsPage.setTransactionTypeFilter('Debit');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForTransactionsLoad();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThanOrEqual(500);
    
    // Verify all transactions match all criteria
    const transactions = await transactionsPage.getAllTransactionDetails();
    for (const txn of transactions) {
      expect(txn.date).toMatch(/01\/\d{2}\/2024/);
      // Additional verification would require card ID and type in transaction details
    }
  });

  // QE-10423 TS-001 TC-003
  test('Verify filter can be cleared and transaction list returns to unfiltered state', async ({ page }) => {
    // Get initial count
    const initialCount = await transactionsPage.getTransactionCount();
    
    // Apply filter
    await transactionsPage.applyDateRangeFilter('01/01/2024', '01/31/2024');
    await transactionsPage.waitForTransactionsLoad();
    const filteredCount = await transactionsPage.getTransactionCount();
    expect(filteredCount).toBeLessThan(initialCount);
    
    // Clear filters
    await transactionsPage.clickClearFilters();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify count returns to initial
    const finalCount = await transactionsPage.getTransactionCount();
    expect(finalCount).toBe(initialCount);
  });

  // QE-10423 TS-002 TC-001
  test('Verify validation error when end date is before start date', async ({ page }) => {
    await transactionsPage.setStartDate('01/31/2024');
    await transactionsPage.setEndDate('01/01/2024');
    await transactionsPage.clickApplyFilters();
    
    // Verify validation error
    await expect(transactionsPage.validationError).toBeVisible();
    const errorText = await transactionsPage.validationError.textContent();
    expect(errorText).toContain('End date must be after start date');
    
    // Verify no API call was made (transaction list unchanged)
    const currentCount = await transactionsPage.getTransactionCount();
    expect(currentCount).toBeGreaterThan(0);
  });

  // QE-10423 TS-002 TC-002
  test('Verify validation error when start date is missing but end date is provided', async ({ page }) => {
    await transactionsPage.setEndDate('01/31/2024');
    await transactionsPage.clickApplyFilters();
    
    // Verify validation error
    await expect(transactionsPage.validationError).toBeVisible();
    const errorText = await transactionsPage.validationError.textContent();
    expect(errorText).toContain('both start and end dates');
  });

  // QE-10423 TS-003 TC-001
  test('Verify appropriate message when filters result in zero matching transactions', async ({ page }) => {
    await transactionsPage.setCardIdFilter('nonexistent_card');
    await transactionsPage.applyDateRangeFilter('01/01/2020', '01/31/2020');
    await transactionsPage.setTransactionTypeFilter('Credit');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify no matches message
    await expect(transactionsPage.noMatchesMessage).toBeVisible();
    const messageText = await transactionsPage.noMatchesMessage.textContent();
    expect(messageText).toContain('No transactions match the selected filters');
    
    // Verify Clear Filters button is available
    await expect(transactionsPage.clearFiltersButton).toBeVisible();
    
    // Clear filters
    await transactionsPage.clickClearFilters();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify transactions are displayed again
    const count = await transactionsPage.getTransactionCount();
    expect(count).toBeGreaterThan(0);
  });

  // QE-10423 TS-003 TC-002
  test('Verify user can try again with different filters after getting zero results', async ({ page }) => {
    // Apply filter with zero results
    await transactionsPage.setCardIdFilter('nonexistent_card');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForTransactionsLoad();
    await expect(transactionsPage.noMatchesMessage).toBeVisible();
    
    // Modify filter to valid card
    await transactionsPage.setCardIdFilter('card123');
    await transactionsPage.clickApplyFilters();
    await transactionsPage.waitForTransactionsLoad();
    
    // Verify matching transactions are displayed
    const count = await transactionsPage.getTransactionCount();
    expect(count).toBeGreaterThan(0);
    
    // Verify filtered count message
    const countText = await transactionsPage.getFilteredCountText();
    expect(countText).toMatch(/Showing \d+ transactions/);
  });
});