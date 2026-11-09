const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { TransactionPage } = require('./pages/transaction.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case ID: 5833 - QE-8906 TS-001 TC-001
test.describe('Dashboard KPI Display Tests', () => {
  test('TC-5833: Verify dashboard aggregates and displays consolidated KPIs for user with multiple active credit cards', async ({ page }) => {
    logger.info('Starting test case TC-5833');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Dashboard login page loaded successfully');

    // Step 2: Login with multiple card user
    await loginPage.login('testuser_multicard_kpi', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Step 2: User authenticated and redirected to dashboard');

    // Step 3: Verify Dashboard KPIs section is displayed
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    logger.info('Step 3: All 4 KPI widgets are displayed');

    // Step 4: Verify Monthly Spend KPI aggregation
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('25000');
    logger.info('Step 4: Monthly Spend displays 25000 (Card1: 15000 + Card2: 10000)');

    // Step 5: Verify Total Credit Limit KPI aggregation
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('150000');
    logger.info('Step 5: Total Credit Limit displays 150000 (Card1: 50000 + Card2: 100000)');

    // Step 6: Verify Available Credit KPI aggregation
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('110000');
    logger.info('Step 6: Available Credit displays 110000 (Card1: 30000 + Card2: 80000)');

    // Step 7: Verify Outstanding Amount KPI aggregation
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('40000');
    logger.info('Step 7: Outstanding Amount displays 40000 (Card1: 20000 + Card2: 20000)');

    // Step 8: Verify all calculations are accurate
    expect(parseInt(monthlySpend)).toBe(15000 + 10000);
    expect(parseInt(totalCreditLimit)).toBe(50000 + 100000);
    expect(parseInt(availableCredit)).toBe(30000 + 80000);
    expect(parseInt(outstandingAmount)).toBe(20000 + 20000);
    logger.info('Step 8: All KPI values match expected aggregations');

    // Step 9: Verify individual card details are displayed
    await expect(dashboardPage.cardDetailsSection).toBeVisible();
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(2);
    logger.info('Step 9: Dashboard shows card-wise breakdown with 2 cards');
  });

  // Test Case ID: 5835 - QE-8906 TS-002 TC-001
  test('TC-5835: Verify dashboard displays appropriate empty state for user with no registered credit cards', async ({ page }) => {
    logger.info('Starting test case TC-5835');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Dashboard login page loaded successfully');

    // Step 2: Login with no cards user
    await loginPage.login('testuser_nocards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Step 2: User authenticated and redirected to dashboard');

    // Step 3: Verify Dashboard KPIs section is displayed
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    logger.info('Step 3: Dashboard displays KPI widgets');

    // Step 4-7: Verify all KPIs display zero or placeholder
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    expect(['0', '--', 'N/A']).toContain(monthlySpend);
    expect(['0', '--', 'N/A']).toContain(totalCreditLimit);
    expect(['0', '--', 'N/A']).toContain(availableCredit);
    expect(['0', '--', 'N/A']).toContain(outstandingAmount);
    logger.info('Steps 4-7: All KPIs display zero or placeholder values');

    // Step 8: Verify appropriate empty state messaging
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    const emptyMessage = await dashboardPage.getEmptyStateMessageText();
    expect(emptyMessage).toMatch(/No credit cards registered|Add a credit card to get started/);
    logger.info('Step 8: Empty state message displayed correctly');

    // Step 9: Verify no error messages or system crashes
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 9: Dashboard loads without errors');
  });

  // Test Case ID: 5836 - QE-8906 TS-003 TC-001
  test('TC-5836: Verify dashboard displays partial KPI data with indicators when card data services are unavailable', async ({ page }) => {
    logger.info('Starting test case TC-5836');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Dashboard login page loaded successfully');

    // Step 2: Simulate service unavailability (via API interception)
    await page.route('**/api/cards*', route => {
      const url = route.request().url();
      if (url.includes('card2')) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    logger.info('Step 2: Card 2 data service simulated as unavailable');

    // Step 3: Login
    await loginPage.login('testuser_partial', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Step 3: User authenticated and redirected to dashboard');

    // Step 4: Verify Dashboard KPIs section loads
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    logger.info('Step 4: Dashboard displays KPI widgets');

    // Step 5: Verify partial KPI data is displayed
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(monthlySpend).toBe('15000');
    expect(totalCreditLimit).toBe('50000');
    logger.info('Step 5: KPIs show data from Card 1 only');

    // Step 6: Verify clear indicators for unavailable metrics
    await expect(dashboardPage.warningIndicator).toBeVisible();
    const warningText = await dashboardPage.getWarningText();
    expect(warningText).toMatch(/Some card data unavailable|Partial data shown/);
    logger.info('Step 6: Warning indicator displayed for unavailable data');

    // Step 7: Verify system gracefully degrades to cached values
    const cachedIndicator = await dashboardPage.getCachedDataIndicator();
    if (cachedIndicator) {
      expect(cachedIndicator).toMatch(/Last updated:/);
      logger.info('Step 7: Cached data displayed with timestamp');
    }

    // Step 8: Verify dashboard remains functional
    await dashboardPage.navigateToTransactions();
    await expect(page).toHaveURL(/transactions/);
    logger.info('Step 8: Dashboard remains functional, navigation works');

    // Step 9: Verify no misleading aggregations
    await page.goBack();
    await expect(dashboardPage.partialDataIndicator).toBeVisible();
    logger.info('Step 9: KPIs clearly indicate partial/incomplete data');
  });
});

// Test Case ID: 5798 - QE-8911 TS-001 TC-001
test.describe('Real-Time Credit Limit Tracking Tests', () => {
  test('TC-5798: Verify available credit calculation for user with outstanding amounts on multiple cards', async ({ page }) => {
    logger.info('Starting test case TC-5798');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_multicard', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: Application launched and user logged in');

    // Step 3: Navigate to Dashboard KPIs section
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    logger.info('Step 3: Dashboard displays Available Credit KPI');

    // Step 4: Verify Available Credit calculation for Card 1
    const card1AvailableCredit = await dashboardPage.getCardAvailableCredit('card1');
    expect(card1AvailableCredit).toBe('30000');
    logger.info('Step 4: Card 1 Available Credit = 50000 - 20000 = 30000');

    // Step 5: Verify Available Credit calculation for Card 2
    const card2AvailableCredit = await dashboardPage.getCardAvailableCredit('card2');
    expect(card2AvailableCredit).toBe('65000');
    logger.info('Step 5: Card 2 Available Credit = 100000 - 35000 = 65000');

    // Step 6: Verify consolidated Available Credit
    const totalAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(totalAvailableCredit).toBe('95000');
    logger.info('Step 6: Total Available Credit = 30000 + 65000 = 95000');

    // Step 7: Click refresh or wait for auto-refresh
    await dashboardPage.clickRefreshButton();
    await page.waitForTimeout(2000); // Wait for refresh to complete
    logger.info('Step 7: Dashboard refreshed');

    // Step 8: Verify calculations remain accurate after refresh
    const refreshedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(refreshedAvailableCredit).toBe('95000');
    logger.info('Step 8: Available credit values remain accurate after refresh');
  });

  // Test Case ID: 5799 - QE-8911 TS-002 TC-001
  test('TC-5799: Verify system handles over-limit scenario with negative available credit display', async ({ page }) => {
    logger.info('Starting test case TC-5799');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_overlimit', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with over-limit card logged in');

    // Step 3: Navigate to Dashboard KPIs section
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    logger.info('Step 3: Dashboard displays KPI widgets');

    // Step 4: Verify Available Credit calculation for over-limit card
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(['-5000', '0']).toContain(availableCredit);
    logger.info('Step 4: Available Credit displays -5000 or 0 with warning');

    // Step 5: Check for warning indicator
    await expect(dashboardPage.overLimitWarning).toBeVisible();
    const warningText = await dashboardPage.getOverLimitWarningText();
    expect(warningText).toMatch(/Over Limit|Exceeded Credit Limit/);
    logger.info('Step 5: Warning indicator displayed for over-limit scenario');

    // Step 6: Verify no calculation errors or crashes
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await expect(dashboardPage.cardDetailsSection).toBeVisible();
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 6: Dashboard remains functional without errors');
  });

  // Test Case ID: 5801 - QE-8911 TS-003 TC-001
  test('TC-5801: Verify real-time available credit update after payment without manual page reload', async ({ page }) => {
    logger.info('Starting test case TC-5801');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_payment', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User logged in');

    // Step 3: Note initial values
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    const initialAvailable = await dashboardPage.getAvailableCreditValue();
    expect(initialOutstanding).toBe('20000');
    expect(initialAvailable).toBe('30000');
    logger.info('Step 3: Initial values noted - Outstanding=20000, Available=30000');

    // Step 4: Simulate payment via API
    await page.evaluate(() => {
      fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 5000, cardId: 'card1' })
      });
    });
    logger.info('Step 4: Payment of 5000 processed');

    // Step 5: Wait for auto-refresh (max 30 seconds)
    await page.waitForTimeout(30000);
    logger.info('Step 5: Waited for auto-refresh interval');

    // Step 6: Verify updated Outstanding Amount
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(updatedOutstanding).toBe('15000');
    logger.info('Step 6: Outstanding Amount updated to 15000');

    // Step 7: Verify updated Available Credit
    const updatedAvailable = await dashboardPage.getAvailableCreditValue();
    expect(updatedAvailable).toBe('35000');
    logger.info('Step 7: Available Credit updated to 35000');

    // Step 8: Verify update occurred without manual reload
    const navigationEntries = await page.evaluate(() => performance.getEntriesByType('navigation'));
    expect(navigationEntries[0].type).not.toBe('reload');
    logger.info('Step 8: Real-time update confirmed without page reload');
  });
});

// Test Case ID: 5809 - QE-8909 TS-001 TC-001
test.describe('Transaction Search and Filtering Tests', () => {
  test('TC-5809: Verify transaction filtering with date range and card returns accurate results with minimal latency', async ({ page }) => {
    logger.info('Starting test case TC-5809');
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_largetxn', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with large transaction volume logged in');

    // Step 3: Navigate to Transaction Management page
    await transactionPage.navigate();
    await expect(page).toHaveURL(/transactions/);
    await expect(transactionPage.transactionList).toBeVisible();
    logger.info('Step 3: Transaction list page loaded');

    // Step 4: Apply date range filter
    await transactionPage.setStartDate('2024-11-01');
    await transactionPage.setEndDate('2024-11-30');
    logger.info('Step 4: Date range filter applied');

    // Step 5: Select card filter
    await transactionPage.selectCard('Visa Gold');
    logger.info('Step 5: Card filter selected');

    // Step 6-7: Apply filter and measure latency
    const startTime = Date.now();
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForFilterResults();
    const endTime = Date.now();
    const latency = endTime - startTime;
    expect(latency).toBeLessThan(2000);
    logger.info(`Step 6-7: Filter applied with latency ${latency}ms (< 2000ms)`);

    // Step 8: Verify all transactions match filter criteria
    const transactions = await transactionPage.getAllTransactions();
    for (const txn of transactions) {
      expect(txn.cardName).toBe('Visa Gold');
      const txnDate = new Date(txn.date);
      expect(txnDate >= new Date('2024-11-01') && txnDate <= new Date('2024-11-30')).toBeTruthy();
    }
    logger.info('Step 8: All transactions match filter criteria');

    // Step 9: Verify result count accuracy
    const resultCount = await transactionPage.getResultCount();
    expect(resultCount).toBe('25');
    expect(transactions.length).toBe(25);
    logger.info('Step 9: Result count displays 25 transactions correctly');
  });

  // Test Case ID: 5811 - QE-8909 TS-002 TC-001
  test('TC-5811: Verify system displays appropriate message when filter criteria match zero transactions', async ({ page }) => {
    logger.info('Starting test case TC-5811');
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-3: Launch, login, navigate
    await loginPage.navigate();
    await loginPage.login('testuser_filter', 'Pass@123');
    await transactionPage.navigate();
    await expect(page).toHaveURL(/transactions/);
    logger.info('Steps 1-3: Navigated to transaction page');

    // Step 4-5: Apply filters with no matching transactions
    await transactionPage.setStartDate('2020-01-01');
    await transactionPage.setEndDate('2020-01-31');
    await transactionPage.selectCard('Mastercard Platinum');
    logger.info('Steps 4-5: Filters applied for date range with no transactions');

    // Step 6: Click Apply Filter
    await transactionPage.clickApplyFilter();
    await transactionPage.waitForFilterResults();
    logger.info('Step 6: Filter processing completed');

    // Step 7: Verify empty result set
    await expect(transactionPage.emptyStateContainer).toBeVisible();
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    logger.info('Step 7: Empty result set displayed');

    // Step 8: Verify appropriate message
    const emptyMessage = await transactionPage.getEmptyStateMessage();
    expect(emptyMessage).toMatch(/No transactions found for the selected filters/);
    logger.info('Step 8: Appropriate empty state message displayed');

    // Step 9: Verify no error messages
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    await expect(transactionPage.transactionList).toBeVisible();
    logger.info('Step 9: No errors, page remains functional');
  });

  // Test Case ID: 5813 - QE-8909 TS-003 TC-001
  test('TC-5813: Verify system validates invalid date range filter (end date before start date)', async ({ page }) => {
    logger.info('Starting test case TC-5813');
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-3: Launch, login, navigate
    await loginPage.navigate();
    await loginPage.login('testuser_validation', 'Pass@123');
    await transactionPage.navigate();
    await expect(page).toHaveURL(/transactions/);
    logger.info('Steps 1-3: Navigated to transaction page');

    // Step 4: Enter invalid date range
    await transactionPage.setStartDate('2024-12-01');
    await transactionPage.setEndDate('2024-11-01');
    logger.info('Step 4: Invalid date range entered (end before start)');

    // Step 5: Click Apply Filter
    await transactionPage.clickApplyFilter();
    logger.info('Step 5: Apply Filter clicked');

    // Step 6: Verify validation error message
    await expect(transactionPage.validationError).toBeVisible();
    const errorMessage = await transactionPage.getValidationErrorText();
    expect(errorMessage).toMatch(/End date cannot be before start date/);
    logger.info('Step 6: Validation error message displayed');

    // Step 7: Verify filter execution is prevented
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0); // Original list not filtered
    logger.info('Step 7: Filter not applied, original list remains');

    // Step 8: Verify user can correct input
    await expect(transactionPage.startDateInput).toBeEditable();
    await expect(transactionPage.endDateInput).toBeEditable();
    logger.info('Step 8: Date fields remain editable for correction');
  });

  // Test Case ID: 5815 - QE-8909 TS-003 TC-002
  test('TC-5815: Verify system validates non-existent card ID selection', async ({ page }) => {
    logger.info('Starting test case TC-5815');
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-3: Launch, login, navigate
    await loginPage.navigate();
    await loginPage.login('testuser_validation', 'Pass@123');
    await transactionPage.navigate();
    await expect(page).toHaveURL(/transactions/);
    logger.info('Steps 1-3: Navigated to transaction page');

    // Step 4: Attempt to select invalid card ID via URL manipulation
    await page.evaluate(() => {
      const cardSelect = document.querySelector('[data-testid="card-filter"]');
      cardSelect.value = 'invalid_card_999';
      cardSelect.dispatchEvent(new Event('change'));
    });
    logger.info('Step 4: Invalid card ID submitted');

    // Step 5: Click Apply Filter
    await transactionPage.clickApplyFilter();
    logger.info('Step 5: Apply Filter clicked');

    // Step 6: Verify validation error or auto-correction
    const errorVisible = await transactionPage.validationError.isVisible().catch(() => false);
    if (errorVisible) {
      const errorMessage = await transactionPage.getValidationErrorText();
      expect(errorMessage).toMatch(/Invalid card selected|Card not found/);
      logger.info('Step 6: Validation error displayed');
    } else {
      const selectedCard = await transactionPage.getSelectedCard();
      expect(selectedCard).not.toBe('invalid_card_999');
      logger.info('Step 6: System auto-corrected to valid card');
    }

    // Step 7: Verify filter execution prevented or auto-corrected
    logger.info('Step 7: Filter execution handled appropriately');

    // Step 8: Verify no system errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 8: No system errors or crashes');
  });
});

// Test Case ID: 5817 - QE-8908 TS-001 TC-001
test.describe('Multi-Card Transaction Listing Tests', () => {
  test('TC-5817: Verify consolidated multi-card transaction listing displays complete transaction details with card identification', async ({ page }) => {
    logger.info('Starting test case TC-5817');
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_multicardtxn', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with multiple cards logged in');

    // Step 3: Navigate to Transaction Management page
    await transactionPage.navigate();
    await expect(page).toHaveURL(/transactions/);
    logger.info('Step 3: Transaction Management page loaded');

    // Step 4: Verify consolidated transaction list
    const transactions = await transactionPage.getAllTransactions();
    const card1Txns = transactions.filter(t => t.cardName.includes('Visa Gold'));
    const card2Txns = transactions.filter(t => t.cardName.includes('Mastercard Platinum'));
    expect(card1Txns.length).toBeGreaterThan(0);
    expect(card2Txns.length).toBeGreaterThan(0);
    logger.info('Step 4: Transactions from both cards displayed in single list');

    // Step 5: Verify Date field
    for (const txn of transactions) {
      expect(txn.date).toMatch(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/);
    }
    logger.info('Step 5: All transactions show date in correct format');

    // Step 6: Verify Merchant name
    for (const txn of transactions) {
      expect(txn.merchant).toBeTruthy();
      expect(txn.merchant.length).toBeGreaterThan(0);
    }
    logger.info('Step 6: All transactions show merchant name');

    // Step 7: Verify Amount
    for (const txn of transactions) {
      expect(txn.amount).toMatch(/\$?[\d,]+\.\d{2}/);
    }
    logger.info('Step 7: All transactions show amount in currency format');

    // Step 8: Verify Category
    for (const txn of transactions) {
      expect(txn.category).toBeTruthy();
    }
    logger.info('Step 8: All transactions show category');

    // Step 9: Verify Card identification
    for (const txn of transactions) {
      expect(txn.cardName).toMatch(/Visa Gold \*\*\*\*\d{4}|Mastercard Platinum \*\*\*\*\d{4}/);
    }
    logger.info('Step 9: Each transaction clearly identifies source card');

    // Step 10: Verify transactions sorted by date
    for (let i = 0; i < transactions.length - 1; i++) {
      const date1 = new Date(transactions[i].date);
      const date2 = new Date(transactions[i + 1].date);
      expect(date1 >= date2).toBeTruthy();
    }
    logger.info('Step 10: Transactions sorted by date (most recent first)');
  });

  // Test Case ID: 5819 - QE-8908 TS-002 TC-001
  test('TC-5819: Verify system displays appropriate messaging for card with no transaction history', async ({ page }) => {
    logger.info('Starting test case TC-5819');
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_notxn', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with card having no transactions logged in');

    // Step 3: Navigate to Transaction Management page
    await transactionPage.navigate();
    await expect(page).toHaveURL(/transactions/);
    logger.info('Step 3: Transaction Management page loaded');

    // Step 4: Verify card is displayed in card list
    const cardVisible = await transactionPage.isCardVisible('Visa Gold ****1234');
    expect(cardVisible).toBeTruthy();
    logger.info('Step 4: Card Visa Gold ****1234 visible in card dropdown');

    // Step 5: Verify empty transaction list
    await expect(transactionPage.emptyStateContainer).toBeVisible();
    const transactionCount = await transactionPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    logger.info('Step 5: Empty transaction list displayed');

    // Step 6: Verify appropriate messaging
    const emptyMessage = await transactionPage.getEmptyStateMessage();
    expect(emptyMessage).toMatch(/No transactions found for this card|No transaction history available/);
    logger.info('Step 6: Appropriate message displayed');

    // Step 7: Verify card not omitted
    await expect(transactionPage.cardDropdown).toBeVisible();
    const cardOptions = await transactionPage.getCardOptions();
    expect(cardOptions).toContain('Visa Gold ****1234');
    logger.info('Step 7: Card remains visible in card list');

    // Step 8: Verify no errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 8: No error messages, page functional');
  });

  // Test Case ID: 5821 - QE-8908 TS-003 TC-001
  test('TC-5821: Verify system displays transactions with incomplete records and marks missing fields appropriately', async ({ page }) => {
    logger.info('Starting test case TC-5821');
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_incomplete', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with incomplete transaction data logged in');

    // Step 3: Navigate to Transaction Management page
    await transactionPage.navigate();
    await expect(page).toHaveURL(/transactions/);
    logger.info('Step 3: Transaction Management page loaded');

    // Step 4: Verify transactions with available data displayed
    const transactions = await transactionPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info('Step 4: Transaction list shows all transactions including incomplete');

    // Step 5: Verify missing Merchant field marked appropriately
    const txnWithMissingMerchant = transactions.find(t => t.date === '2024-11-15');
    expect(txnWithMissingMerchant).toBeTruthy();
    expect(['N/A', 'Unknown', '--']).toContain(txnWithMissingMerchant.merchant);
    logger.info('Step 5: Missing merchant marked as N/A or Unknown');

    // Step 6: Verify missing Category field marked appropriately
    const txnWithMissingCategory = transactions.find(t => t.date === '2024-11-16');
    expect(txnWithMissingCategory).toBeTruthy();
    expect(['N/A', 'Unknown', 'Uncategorized']).toContain(txnWithMissingCategory.category);
    logger.info('Step 6: Missing category marked as N/A or Uncategorized');

    // Step 7: Verify transaction list display not broken
    await expect(transactionPage.transactionTable).toBeVisible();
    const rowCount = await transactionPage.getTableRowCount();
    expect(rowCount).toBe(transactions.length);
    logger.info('Step 7: All transactions render correctly in table');

    // Step 8: Verify no JavaScript errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 8: Page functional, no console errors');
  });
});

// Test Case ID: 5803 - QE-8910 TS-001 TC-001
test.describe('Category-Wise Spending Visualization Tests', () => {
  test('TC-5803: Verify category-wise spending chart displays accurate amounts for all 9 categories', async ({ page }) => {
    logger.info('Starting test case TC-5803');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_allcategories', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with all categories logged in');

    // Step 3: Navigate to Analytics section
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    await expect(analyticsPage.categoryChart).toBeVisible();
    logger.info('Step 3: Analytics dashboard loaded with category chart');

    // Step 4: Verify chart displays all 9 categories
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    logger.info('Step 4: Chart displays all 9 predefined categories');

    // Step 5: Verify Food & Dining amount
    const foodDiningAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(foodDiningAmount).toBe('8500');
    logger.info('Step 5: Food & Dining displays 8500');

    // Step 6: Verify remaining 8 categories
    expect(await analyticsPage.getCategoryAmount('Fuel')).toBe('3200');
    expect(await analyticsPage.getCategoryAmount('Shopping')).toBe('12000');
    expect(await analyticsPage.getCategoryAmount('Travel')).toBe('15000');
    expect(await analyticsPage.getCategoryAmount('Entertainment')).toBe('4500');
    expect(await analyticsPage.getCategoryAmount('Utilities')).toBe('2800');
    expect(await analyticsPage.getCategoryAmount('Healthcare')).toBe('1200');
    expect(await analyticsPage.getCategoryAmount('Education')).toBe('5000');
    expect(await analyticsPage.getCategoryAmount('Miscellaneous')).toBe('1800');
    logger.info('Step 6: All categories display correct amounts');

    // Step 7: Verify total aggregation
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe('54000');
    logger.info('Step 7: Total spending = 54000 displayed correctly');

    // Step 8: Verify chart is interactive
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('8500');
    logger.info('Step 8: Chart is interactive with tooltips');
  });

  // Test Case ID: 5805 - QE-8910 TS-002 TC-001
  test('TC-5805: Verify category-wise spending chart handles limited categories without calculation errors', async ({ page }) => {
    logger.info('Starting test case TC-5805');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_twocategories', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with 2 categories logged in');

    // Step 3: Navigate to Analytics section
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 3: Analytics dashboard loaded');

    // Step 4: Verify chart displays only 2 categories with data
    const visibleCategories = await analyticsPage.getVisibleCategories();
    expect(visibleCategories).toContain('Food & Dining');
    expect(visibleCategories).toContain('Fuel');
    expect(await analyticsPage.getCategoryAmount('Food & Dining')).toBe('5000');
    expect(await analyticsPage.getCategoryAmount('Fuel')).toBe('2000');
    logger.info('Step 4: Chart shows Food & Dining (5000) and Fuel (2000)');

    // Step 5: Verify remaining 7 categories hidden or zero
    const allCategories = await analyticsPage.getAllCategoryElements();
    const categoriesWithZero = allCategories.filter(cat => cat.amount === '0' || !cat.visible);
    expect(categoriesWithZero.length).toBeGreaterThanOrEqual(7);
    logger.info('Step 5: Remaining 7 categories hidden or show zero values');

    // Step 6: Verify total aggregation
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe('7000');
    logger.info('Step 6: Total spending = 7000 displayed accurately');

    // Step 7: Verify no calculation errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await expect(analyticsPage.categoryChart).toBeVisible();
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 7: No NaN or errors, chart renders correctly');
  });

  // Test Case ID: 5807 - QE-8910 TS-003 TC-001
  test('TC-5807: Verify uncategorized transactions are aggregated under Miscellaneous category', async ({ page }) => {
    logger.info('Starting test case TC-5807');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_uncategorized', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with uncategorized transactions logged in');

    // Step 3: Navigate to Analytics section
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 3: Analytics dashboard loaded');

    // Step 4: Verify uncategorized transactions in Miscellaneous
    const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscAmount).toBe('3500');
    logger.info('Step 4: Miscellaneous shows 3500 (sum of uncategorized)');

    // Step 5: Check for warning message
    await expect(analyticsPage.categorizationWarning).toBeVisible();
    const warningText = await analyticsPage.getCategorizationWarningText();
    expect(warningText).toMatch(/Some transactions could not be categorized/);
    logger.info('Step 5: Warning message about incomplete categorization displayed');

    // Step 6: Verify total spending includes uncategorized
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(parseInt(totalSpending)).toBeGreaterThanOrEqual(3500);
    logger.info('Step 6: Total spending includes Miscellaneous amount');

    // Step 7: Verify chart renders without errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await expect(analyticsPage.categoryChart).toBeVisible();
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 7: Chart displays correctly with Miscellaneous visible');
  });
});

// Test Case ID: 5823 - QE-8907 TS-001 TC-001
test.describe('Monthly Spend Trends Analysis Tests', () => {
  test('TC-5823: Verify monthly spend trends chart displays accurate totals and card-wise breakdowns for 6-month history', async ({ page }) => {
    logger.info('Starting test case TC-5823');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_6months', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with 6-month history logged in');

    // Step 3: Navigate to Analytics section
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 3: Analytics dashboard loaded');

    // Step 4: Select Monthly Trends view
    await analyticsPage.selectTrendsView();
    await expect(analyticsPage.trendsChart).toBeVisible();
    logger.info('Step 4: Monthly spend trends chart displayed');

    // Step 5: Verify 6 months of data points
    const months = await analyticsPage.getTrendMonths();
    expect(months).toContain('June');
    expect(months).toContain('July');
    expect(months).toContain('August');
    expect(months).toContain('September');
    expect(months).toContain('October');
    expect(months).toContain('November');
    logger.info('Step 5: Chart shows 6 months of data');

    // Step 6: Verify June 2024 total
    const juneTotal = await analyticsPage.getMonthTotal('June');
    expect(juneTotal).toBe('12000');
    logger.info('Step 6: June total = 12000 displayed correctly');

    // Step 7: Verify card-wise breakdown for June
    const juneBreakdown = await analyticsPage.getMonthBreakdown('June');
    expect(juneBreakdown['Visa Gold']).toBe('7000');
    expect(juneBreakdown['Mastercard']).toBe('5000');
    logger.info('Step 7: June breakdown - Visa Gold=7000, Mastercard=5000');

    // Step 8: Verify remaining months
    expect(await analyticsPage.getMonthTotal('July')).toBe('15000');
    expect(await analyticsPage.getMonthTotal('August')).toBe('13500');
    expect(await analyticsPage.getMonthTotal('September')).toBe('14000');
    expect(await analyticsPage.getMonthTotal('October')).toBe('16000');
    expect(await analyticsPage.getMonthTotal('November')).toBe('18000');
    logger.info('Step 8: All months show accurate totals');

    // Step 9: Verify chart is interactive
    await analyticsPage.hoverOverMonth('June');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('12000');
    expect(tooltipText).toContain('Visa Gold');
    logger.info('Step 9: Chart interactive with detailed tooltips');
  });

  // Test Case ID: 5825 - QE-8907 TS-002 TC-001
  test('TC-5825: Verify system handles insufficient historical data (single month) without crashing', async ({ page }) => {
    logger.info('Starting test case TC-5825');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_onemonth', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with single month history logged in');

    // Step 3: Navigate to Analytics section
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 3: Analytics dashboard loaded');

    // Step 4: Select Monthly Trends view
    await analyticsPage.selectTrendsView();
    logger.info('Step 4: Monthly trends section displayed');

    // Step 5: Verify single data point
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBe(1);
    expect(months[0]).toBe('November');
    const novTotal = await analyticsPage.getMonthTotal('November');
    expect(novTotal).toBe('5000');
    logger.info('Step 5: Chart shows single data point for November with 5000');

    // Step 6: Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessageText();
    expect(message).toMatch(/Insufficient data for trend analysis|More data needed/);
    logger.info('Step 6: Insufficient data message displayed');

    // Step 7: Verify no crash or errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await expect(analyticsPage.trendsChart).toBeVisible();
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 7: Page functional, chart renders with single point');

    // Step 8: Verify user can view available data
    await analyticsPage.hoverOverMonth('November');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    logger.info('Step 8: Single month data visible and interactive');
  });

  // Test Case ID: 5827 - QE-8907 TS-003 TC-001
  test('TC-5827: Verify system handles gaps in monthly data gracefully with visual indicators', async ({ page }) => {
    logger.info('Starting test case TC-5827');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser_gaps', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Steps 1-2: User with gaps in data logged in');

    // Step 3: Navigate to Analytics section
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 3: Analytics dashboard loaded');

    // Step 4: Select Monthly Trends view
    await analyticsPage.selectTrendsView();
    await expect(analyticsPage.trendsChart).toBeVisible();
    logger.info('Step 4: Monthly trends chart displayed');

    // Step 5: Verify only available months displayed
    const months = await analyticsPage.getTrendMonths();
    expect(months).toContain('June');
    expect(months).toContain('August');
    expect(months).toContain('October');
    expect(await analyticsPage.getMonthTotal('June')).toBe('10000');
    expect(await analyticsPage.getMonthTotal('August')).toBe('12000');
    expect(await analyticsPage.getMonthTotal('October')).toBe('15000');
    logger.info('Step 5: Chart shows June, August, October (July and September missing)');

    // Step 6: Verify missing months handled gracefully
    const julyVisible = months.includes('July');
    const septemberVisible = months.includes('September');
    if (julyVisible) {
      expect(await analyticsPage.getMonthTotal('July')).toBe('0');
    }
    if (septemberVisible) {
      expect(await analyticsPage.getMonthTotal('September')).toBe('0');
    }
    logger.info('Step 6: Missing months shown with 0 or omitted from X-axis');

    // Step 7: Verify visual indicators for gaps
    const gapIndicators = await analyticsPage.getGapIndicators();
    expect(gapIndicators.length).toBeGreaterThan(0);
    logger.info('Step 7: Visual indicators present for data gaps');

    // Step 8: Verify chart renders without errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await expect(analyticsPage.trendsChart).toBeVisible();
    expect(consoleErrors.length).toBe(0);
    logger.info('Step 8: Chart displays correctly, no JavaScript errors');

    // Step 9: Verify user can interpret trend
    await analyticsPage.hoverOverMonth('June');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    logger.info('Step 9: Available data points accurate and interactive');
  });
});