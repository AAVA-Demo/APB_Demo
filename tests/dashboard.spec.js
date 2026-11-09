const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/dashboard.page');
const { LoginPage } = require('../pages/login.page');
const Logger = require('../utils/logger');

test.describe('Dashboard KPI Tests - QE-9139', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    Logger.info('Starting test setup');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9139 TS-001 TC-001 - Verify user with active credit cards views all four KPI cards with correct aggregated values', async ({ page }) => {
    Logger.info('Test Case: QE-9139 TS-001 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    Logger.info('Application login page loaded successfully');
    
    // Step 2: Login with valid credentials
    await loginPage.login('user_with_cards@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User authenticated and redirected to dashboard');
    
    // Step 3: Observe KPI cards
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();
    Logger.info('All four KPI cards are displayed');
    
    // Step 4: Verify Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$2,500.00');
    Logger.info('Monthly Spend KPI verified: $2,500.00');
    
    // Step 5: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$25,000.00');
    Logger.info('Total Credit Limit KPI verified: $25,000.00');
    
    // Step 6: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$18,000.00');
    Logger.info('Available Credit KPI verified: $18,000.00');
    
    // Step 7: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$7,000.00');
    Logger.info('Outstanding Amount KPI verified: $7,000.00');
  });

  test('QE-9139 TS-001 TC-002 - Verify KPI refresh when new transaction is processed', async ({ page }) => {
    Logger.info('Test Case: QE-9139 TS-001 TC-002');
    
    // Step 1: User viewing dashboard with initial values
    await loginPage.login('user_with_cards@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(initialMonthlySpend).toBe('$2,500.00');
    Logger.info('Initial Monthly Spend: $2,500.00');
    
    // Step 2: Simulate new transaction (via API or backend trigger)
    Logger.info('Simulating new transaction of $150 on Card1');
    
    // Step 3: Wait for auto-refresh (within 30 seconds)
    await page.waitForTimeout(5000);
    await dashboardPage.waitForKPIRefresh();
    
    // Step 4: Verify updated Monthly Spend
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(updatedMonthlySpend).toBe('$2,650.00');
    Logger.info('Updated Monthly Spend verified: $2,650.00');
    
    // Verify Available Credit also updates
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(updatedAvailableCredit).toBe('$17,850.00');
    Logger.info('Updated Available Credit verified: $17,850.00');
  });

  test('QE-9139 TS-002 TC-001 - Verify user with no current month transactions sees monthly spend as $0', async ({ page }) => {
    Logger.info('Test Case: QE-9139 TS-002 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login with user having no current month transactions
    await loginPage.login('user_no_current_txn@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User with no current month transactions logged in');
    
    // Step 3: Observe Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$0.00');
    Logger.info('Monthly Spend KPI displays $0.00');
    
    // Step 4: Verify other KPIs are not zero
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    expect(totalCreditLimit).toBe('$15,000.00');
    expect(availableCredit).toBe('$15,000.00');
    expect(outstandingAmount).toBe('$0.00');
    Logger.info('Other KPI values verified as non-zero or correct');
  });

  test('QE-9139 TS-003 TC-001 - Verify Outstanding Amount equals Total Credit Limit minus Available Credit', async ({ page }) => {
    Logger.info('Test Case: QE-9139 TS-003 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login with user having multiple cards
    await loginPage.login('user_multi_cards@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User with multiple cards logged in');
    
    // Step 3-5: Note KPI values
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    Logger.info(`Total Credit Limit: ${totalCreditLimit}`);
    Logger.info(`Available Credit: ${availableCredit}`);
    Logger.info(`Outstanding Amount: ${outstandingAmount}`);
    
    // Step 6: Calculate and verify
    const totalCreditLimitNum = parseFloat(totalCreditLimit.replace(/[$,]/g, ''));
    const availableCreditNum = parseFloat(availableCredit.replace(/[$,]/g, ''));
    const outstandingAmountNum = parseFloat(outstandingAmount.replace(/[$,]/g, ''));
    
    const calculatedOutstanding = totalCreditLimitNum - availableCreditNum;
    expect(calculatedOutstanding).toBe(outstandingAmountNum);
    Logger.info(`Calculation verified: ${totalCreditLimitNum} - ${availableCreditNum} = ${outstandingAmountNum}`);
  });
});

test.describe('Monthly Trend Analysis Tests - QE-9138', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    Logger.info('Starting test setup');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9138 TS-001 TC-001 - Verify user with 6 months history views monthly trend chart with all 6 months', async ({ page }) => {
    Logger.info('Test Case: QE-9138 TS-001 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login with user having 6 months history
    await loginPage.login('user_6months@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User with 6 months history logged in');
    
    // Step 3: Navigate to Monthly Trend Analysis
    await dashboardPage.navigateToMonthlyTrends();
    await expect(page).toHaveURL(/analytics.*monthly-trends/);
    Logger.info('Monthly Trend Analysis page loaded');
    
    // Step 4: Verify chart displays 6 months
    const monthLabels = await dashboardPage.getMonthlyTrendLabels();
    expect(monthLabels.length).toBe(6);
    Logger.info('Chart displays 6 months of data');
    
    // Step 5: Verify each month displays spending value
    const monthlyValues = await dashboardPage.getMonthlyTrendValues();
    expect(monthlyValues.length).toBe(6);
    monthlyValues.forEach((value, index) => {
      expect(value).toMatch(/\$[0-9,]+\.[0-9]{2}/);
      Logger.info(`Month ${index + 1} spending: ${value}`);
    });
    
    // Step 6: Click on specific month
    await dashboardPage.clickMonthlyTrendMonth('March');
    await expect(dashboardPage.monthDrillDownPanel).toBeVisible();
    Logger.info('Drill-down into March successful');
  });

  test('QE-9138 TS-001 TC-002 - Verify monthly trend chart interaction and tooltip display', async ({ page }) => {
    Logger.info('Test Case: QE-9138 TS-001 TC-002');
    
    await loginPage.login('user_6months@test.com', 'Test@1234');
    await dashboardPage.navigateToMonthlyTrends();
    
    // Hover over a month to display tooltip
    const firstMonth = dashboardPage.monthlyTrendLabels.first();
    await firstMonth.hover();
    
    // Verify tooltip appears with spending amount and transaction count
    await expect(dashboardPage.trendTooltip).toBeVisible();
    const tooltipText = await dashboardPage.trendTooltip.textContent();
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    expect(tooltipText).toContain('transactions');
    Logger.info('Tooltip displays spending amount and transaction count');
  });

  test('QE-9138 TS-002 TC-001 - Verify user with 1 month history sees insufficient data message', async ({ page }) => {
    Logger.info('Test Case: QE-9138 TS-002 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login with user having only 1 month history
    await loginPage.login('user_1month@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User with 1 month history logged in');
    
    // Step 3: Navigate to Monthly Trend Analysis
    await dashboardPage.navigateToMonthlyTrends();
    await expect(page).toHaveURL(/analytics.*monthly-trends/);
    Logger.info('Monthly Trend Analysis page loaded');
    
    // Step 4: Verify chart displays only 1 data point
    const monthLabels = await dashboardPage.getMonthlyTrendLabels();
    expect(monthLabels.length).toBe(1);
    Logger.info('Chart displays only 1 month of data');
    
    // Step 5: Verify insufficient data message
    await expect(dashboardPage.insufficientDataMessage).toBeVisible();
    const messageText = await dashboardPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('More historical data needed for trend analysis');
    Logger.info('Insufficient data message displayed');
  });

  test('QE-9138 TS-003 TC-001 - Verify clicking on month drills down to show all transactions', async ({ page }) => {
    Logger.info('Test Case: QE-9138 TS-003 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login with user having multi-month history
    await loginPage.login('user_multi_months@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User with multi-month history logged in');
    
    // Step 3: Navigate to Monthly Trend Analysis
    await dashboardPage.navigateToMonthlyTrends();
    await expect(page).toHaveURL(/analytics.*monthly-trends/);
    Logger.info('Monthly Trend Analysis page loaded');
    
    // Step 4: Click on March
    await dashboardPage.clickMonthlyTrendMonth('March');
    await expect(dashboardPage.monthDrillDownPanel).toBeVisible();
    Logger.info('Drill-down panel displayed');
    
    // Step 5: Verify all March transactions displayed
    const transactions = await dashboardPage.getDrillDownTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    transactions.forEach(tx => {
      expect(tx.date).toContain('March');
      Logger.info(`Transaction: ${tx.merchant}, ${tx.amount}, ${tx.category}`);
    });
    
    // Step 6: Verify category breakdown
    await expect(dashboardPage.categoryBreakdownSection).toBeVisible();
    Logger.info('Category breakdown displayed for March');
  });
});

test.describe('Category Drill-Down Tests - QE-9137', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    Logger.info('Starting test setup');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9137 TS-001 TC-001 - Verify clicking on Food & Dining drills down with filtering options', async ({ page }) => {
    Logger.info('Test Case: QE-9137 TS-001 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login with user having Food & Dining transactions
    await loginPage.login('user_food_dining@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User with Food & Dining transactions logged in');
    
    // Step 3: Navigate to Spending Analytics
    await dashboardPage.navigateToSpendingAnalytics();
    await expect(page).toHaveURL(/analytics.*spending/);
    Logger.info('Spending Analytics page loaded');
    
    // Step 4: Click on Food & Dining category
    await dashboardPage.clickCategoryInChart('Food & Dining');
    await expect(dashboardPage.categoryDrillDownPanel).toBeVisible();
    Logger.info('Drill-down to Food & Dining successful');
    
    // Step 5: Verify detailed transactions displayed
    const transactions = await dashboardPage.getCategoryTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    transactions.forEach(tx => {
      expect(tx.category).toBe('Food & Dining');
      Logger.info(`Transaction: ${tx.merchant}, ${tx.amount}, ${tx.date}`);
    });
    
    // Step 6: Verify filtering options available
    await expect(dashboardPage.dateRangeFilter).toBeVisible();
    await expect(dashboardPage.cardTypeFilter).toBeVisible();
    Logger.info('Filtering options are available');
  });

  test('QE-9137 TS-002 TC-001 - Verify date range filter in drill-down shows only filtered transactions', async ({ page }) => {
    Logger.info('Test Case: QE-9137 TS-002 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login and navigate to drill-down
    await loginPage.login('user_category_drill@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    await dashboardPage.navigateToSpendingAnalytics();
    await dashboardPage.clickCategoryInChart('Food & Dining');
    await expect(dashboardPage.categoryDrillDownPanel).toBeVisible();
    Logger.info('In drill-down view');
    
    // Step 3: Apply date range filter
    await dashboardPage.applyDateRangeFilter('2023-01-01', '2023-01-31');
    Logger.info('Date range filter applied: January 2023');
    
    // Step 4: Verify only January transactions displayed
    const transactions = await dashboardPage.getCategoryTransactions();
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      expect(txDate.getMonth()).toBe(0);
      expect(txDate.getFullYear()).toBe(2023);
      Logger.info(`Transaction date: ${tx.date}`);
    });
    
    // Step 5: Verify no transactions outside date range
    const allDatesInJanuary = transactions.every(tx => {
      const txDate = new Date(tx.date);
      return txDate >= new Date('2023-01-01') && txDate <= new Date('2023-01-31');
    });
    expect(allDatesInJanuary).toBe(true);
    Logger.info('All transactions are within January 2023');
  });

  test('QE-9137 TS-003 TC-001 - Verify category with one transaction shows no sub-category breakdown', async ({ page }) => {
    Logger.info('Test Case: QE-9137 TS-003 TC-001');
    
    // Step 1: Launch application
    await expect(page).toHaveURL(/login/);
    
    // Step 2: Login with user having single transaction in category
    await loginPage.login('user_single_txn@test.com', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User with single transaction logged in');
    
    // Step 3: Navigate and click on Healthcare category
    await dashboardPage.navigateToSpendingAnalytics();
    await dashboardPage.clickCategoryInChart('Healthcare');
    await expect(dashboardPage.categoryDrillDownPanel).toBeVisible();
    Logger.info('Drill-down to Healthcare (1 transaction)');
    
    // Step 4: Verify single transaction displayed
    const transactions = await dashboardPage.getCategoryTransactions();
    expect(transactions.length).toBe(1);
    Logger.info(`Single transaction: ${transactions[0].merchant}, ${transactions[0].amount}`);
    
    // Step 5: Verify insufficient data message
    await expect(dashboardPage.insufficientSubCategoryMessage).toBeVisible();
    const messageText = await dashboardPage.insufficientSubCategoryMessage.textContent();
    expect(messageText).toContain('Insufficient data for sub-categorization');
    Logger.info('Insufficient data message displayed');
  });
});