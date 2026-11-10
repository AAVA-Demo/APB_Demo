const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CreditCardOverviewPage } = require('./pages/creditCardOverview.page');
const { TransactionHistoryPage } = require('./pages/transactionHistory.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

// Test Case - QE-10328 TS-001 TC-001
test('Verify credit card overview page displays all cards with real-time balance information for user with multiple active credit cards', async ({ page }) => {
  logger.info('Starting test: QE-10328 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const overviewPage = new CreditCardOverviewPage(page);

  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Pass@123');
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  logger.info('User authenticated and redirected to dashboard');

  await dashboardPage.navigateToCreditCards();
  await expect(overviewPage.pageHeader).toBeVisible();
  logger.info('Credit card overview page loaded');

  await expect(overviewPage.getCardByNumber('****1234')).toBeVisible();
  await expect(overviewPage.getCardByNumber('****5678')).toBeVisible();
  await expect(overviewPage.getCardByNumber('****9012')).toBeVisible();
  logger.info('All registered credit cards are displayed');

  await overviewPage.verifyCardDetails('****1234', { limit: '50000', outstanding: '12000', available: '38000', monthlySpend: '8500' });
  logger.info('Real-time balance information verified for CC001');

  await overviewPage.verifyResponsiveLayout();
  logger.info('Responsive layout verified');
});

// Test Case - QE-10328 TS-002 TC-001
test('Verify credit card overview page displays accurate zero values for cards with zero balances and zero credit limits', async ({ page }) => {
  logger.info('Starting test: QE-10328 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const overviewPage = new CreditCardOverviewPage(page);

  await loginPage.navigate();
  await loginPage.login('zerobalance@example.com', 'Pass@123');
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  logger.info('User with zero balance cards authenticated');

  await dashboardPage.navigateToCreditCards();
  await expect(overviewPage.pageHeader).toBeVisible();
  logger.info('Credit card overview page loaded');

  await overviewPage.verifyAllCardsHaveZeroValues();
  logger.info('All cards display zero values correctly');

  await overviewPage.verifyNoCalculationErrors();
  logger.info('No calculation errors or display issues detected');
});

// Test Case - QE-10328 TS-003 TC-001
test('Verify unauthenticated user is denied access to credit card overview page with authentication failure message', async ({ page }) => {
  logger.info('Starting test: QE-10328 TS-003 TC-001');
  const overviewPage = new CreditCardOverviewPage(page);

  await overviewPage.navigateDirectly();
  logger.info('Attempted direct access to credit card overview page');

  await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
  logger.info('System redirected to login page');

  await overviewPage.verifyAuthenticationError();
  logger.info('Authentication failure message verified');

  await overviewPage.verifyNoSensitiveDataDisplayed();
  logger.info('No credit card information revealed');
});

// Test Case - QE-10327 TS-001 TC-001
test('Verify dashboard displays aggregated KPIs within 2 seconds for user with multiple registered credit cards', async ({ page }) => {
  logger.info('Starting test: QE-10327 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigate();
  await loginPage.login('multicard@example.com', 'Pass@123');
  logger.info('User with multiple cards authenticated');

  const startTime = Date.now();
  await dashboardPage.waitForDashboardLoad();
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThanOrEqual(2000);
  logger.info(`Dashboard loaded in ${loadTime}ms`);

  await dashboardPage.verifyKPI('Monthly Spend', '45500');
  logger.info('Total Monthly Spend KPI verified');

  await dashboardPage.verifyKPI('Total Credit Limit', '225000');
  logger.info('Total Credit Limit KPI verified');

  await dashboardPage.verifyKPI('Available Credit', '158000');
  logger.info('Available Credit KPI verified');

  await dashboardPage.verifyKPI('Outstanding Amount', '67000');
  logger.info('Outstanding Amount KPI verified');
});

// Test Case - QE-10327 TS-002 TC-001
test('Verify dashboard displays zero values for all KPIs with appropriate messaging for user with no registered credit cards', async ({ page }) => {
  logger.info('Starting test: QE-10327 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigate();
  await loginPage.login('nocards@example.com', 'Pass@123');
  logger.info('User with no cards authenticated');

  await dashboardPage.waitForDashboardLoad();
  logger.info('Dashboard loaded');

  await dashboardPage.verifyKPI('Monthly Spend', '0');
  await dashboardPage.verifyKPI('Total Credit Limit', '0');
  await dashboardPage.verifyKPI('Available Credit', '0');
  await dashboardPage.verifyKPI('Outstanding Amount', '0');
  logger.info('All KPIs display zero values');

  await dashboardPage.verifyNoCardsMessage();
  logger.info('Appropriate message displayed for no registered cards');
});

// Test Case - QE-10327 TS-003 TC-001
test('Verify unauthenticated user is denied dashboard access with authentication error and no financial data displayed', async ({ page }) => {
  logger.info('Starting test: QE-10327 TS-003 TC-001');
  const dashboardPage = new DashboardPage(page);

  await dashboardPage.navigateDirectly();
  logger.info('Attempted direct access to dashboard');

  await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
  logger.info('System redirected to login page');

  await dashboardPage.verifyAuthenticationError();
  logger.info('Authentication error message verified');

  await dashboardPage.verifyNoFinancialDataDisplayed();
  logger.info('No KPI or financial data displayed');
});

// Test Case - QE-10326 TS-001 TC-001
test('Verify transaction history page displays all transactions from all registered cards with complete details in consolidated list', async ({ page }) => {
  logger.info('Starting test: QE-10326 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const transactionPage = new TransactionHistoryPage(page);

  await loginPage.navigate();
  await loginPage.login('multicard@example.com', 'Pass@123');
  logger.info('User with multiple cards authenticated');

  await dashboardPage.navigateToTransactions();
  await expect(transactionPage.pageHeader).toBeVisible();
  logger.info('Transaction history page loaded');

  await transactionPage.verifyTransactionsFromAllCards(['CC001', 'CC002', 'CC003']);
  logger.info('Transactions from all cards displayed in consolidated list');

  await transactionPage.verifyTransactionDetailsComplete();
  logger.info('All transaction details (date, card, merchant, category, amount, status) verified');
});

// Test Case - QE-10326 TS-002 TC-001
test('Verify transaction history page displays empty list with appropriate message for user with no transaction history', async ({ page }) => {
  logger.info('Starting test: QE-10326 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const transactionPage = new TransactionHistoryPage(page);

  await loginPage.navigate();
  await loginPage.login('notransactions@example.com', 'Pass@123');
  logger.info('User with no transactions authenticated');

  await dashboardPage.navigateToTransactions();
  await expect(transactionPage.pageHeader).toBeVisible();
  logger.info('Transaction history page loaded');

  await transactionPage.verifyEmptyTransactionList();
  logger.info('Transaction list is empty');

  await transactionPage.verifyNoTransactionsMessage();
  logger.info('Appropriate message displayed for no transactions');
});

// Test Case - QE-10326 TS-003 TC-001
test('Verify unauthenticated user is denied access to transaction history page with authentication error', async ({ page }) => {
  logger.info('Starting test: QE-10326 TS-003 TC-001');
  const transactionPage = new TransactionHistoryPage(page);

  await transactionPage.navigateDirectly();
  logger.info('Attempted direct access to transaction history page');

  await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
  logger.info('System redirected to login page');

  await transactionPage.verifyAuthenticationError();
  logger.info('Authentication error message verified');

  await transactionPage.verifyNoTransactionDataDisplayed();
  logger.info('No transaction data displayed');
});

// Test Case - QE-10325 TS-001 TC-001
test('Verify spending insights section displays interactive monthly spend trend chart with accurate aggregated amounts and drill-down capabilities', async ({ page }) => {
  logger.info('Starting test: QE-10325 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const analyticsPage = new AnalyticsPage(page);

  await loginPage.navigate();
  await loginPage.login('multimonth@example.com', 'Pass@123');
  logger.info('User with multi-month transaction history authenticated');

  await dashboardPage.navigateToAnalytics();
  await analyticsPage.navigateToSpendingInsights();
  await expect(analyticsPage.spendingInsightsHeader).toBeVisible();
  logger.info('Spending insights page loaded');

  await analyticsPage.verifyMonthlyTrendChartDisplayed();
  logger.info('Monthly spend trend chart displayed');

  await analyticsPage.verifyMonthsChronologicalOrder(['2024-1', '2024-2', '2024-3']);
  logger.info('Months sorted chronologically on X-axis');

  await analyticsPage.verifyMonthlySpendingAmounts({ '2024-1': '35000', '2024-2': '42000' });
  logger.info('Accurate aggregated spending amounts verified');

  await analyticsPage.clickMonthDataPoint('2024-1');
  await analyticsPage.verifyDrillDownDetails();
  logger.info('Drill-down capability verified');
});

// Test Case - QE-10325 TS-002 TC-001
test('Verify spending insights section displays monthly trend chart with single data point for user with single month transaction history', async ({ page }) => {
  logger.info('Starting test: QE-10325 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const analyticsPage = new AnalyticsPage(page);

  await loginPage.navigate();
  await loginPage.login('singlemonth@example.com', 'Pass@123');
  logger.info('User with single month transaction history authenticated');

  await dashboardPage.navigateToAnalytics();
  await analyticsPage.navigateToSpendingInsights();
  await expect(analyticsPage.spendingInsightsHeader).toBeVisible();
  logger.info('Spending insights page loaded');

  await analyticsPage.verifySingleDataPoint('2024-2', '28000');
  logger.info('Monthly trend chart displays single data point correctly');

  await analyticsPage.verifyNoErrors();
  logger.info('Chart renders without errors');
});

// Test Case - QE-10325 TS-003 TC-001
test('Verify spending insights section displays empty monthly trend chart with appropriate message for user with no transaction history', async ({ page }) => {
  logger.info('Starting test: QE-10325 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const analyticsPage = new AnalyticsPage(page);

  await loginPage.navigate();
  await loginPage.login('notransactions@example.com', 'Pass@123');
  logger.info('User with no transaction history authenticated');

  await dashboardPage.navigateToAnalytics();
  await analyticsPage.navigateToSpendingInsights();
  await expect(analyticsPage.spendingInsightsHeader).toBeVisible();
  logger.info('Spending insights page loaded');

  await analyticsPage.verifyEmptyChart();
  logger.info('Monthly trend chart is empty');

  await analyticsPage.verifyInsufficientDataMessage();
  logger.info('Appropriate message displayed for insufficient data');
});

// Test Case - QE-10324 TS-001 TC-001
test('Verify analytics dashboard displays interactive category-wise spending visualization with accurate amounts and percentages for all predefined categories', async ({ page }) => {
  logger.info('Starting test: QE-10324 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const analyticsPage = new AnalyticsPage(page);

  await loginPage.navigate();
  await loginPage.login('multicategory@example.com', 'Pass@123');
  logger.info('User with transactions across multiple categories authenticated');

  await dashboardPage.navigateToAnalytics();
  await expect(analyticsPage.analyticsHeader).toBeVisible();
  logger.info('Analytics dashboard loaded');

  await analyticsPage.verifyCategoryChartDisplayed();
  logger.info('Category-wise spending visualization displayed');

  await analyticsPage.verifyAllCategories(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
  logger.info('All predefined categories represented');

  await analyticsPage.verifyCategoryAmount('Food & Dining', '4000');
  await analyticsPage.verifyCategoryPercentage('Food & Dining', '10');
  logger.info('Spending amounts and percentages verified');

  await analyticsPage.hoverOverCategory('Food & Dining');
  await analyticsPage.verifyInteractiveDetails();
  logger.info('Chart interactivity verified');
});

// Test Case - QE-10324 TS-002 TC-001
test('Verify analytics dashboard automatically categorizes transactions with invalid or missing category data as Miscellaneous and displays corrected breakdown', async ({ page }) => {
  logger.info('Starting test: QE-10324 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const analyticsPage = new AnalyticsPage(page);

  await loginPage.navigate();
  await loginPage.login('invalidcategory@example.com', 'Pass@123');
  logger.info('User with invalid category data authenticated');

  await dashboardPage.navigateToAnalytics();
  await expect(analyticsPage.analyticsHeader).toBeVisible();
  logger.info('Analytics dashboard loaded');

  await analyticsPage.verifyCategoryChartDisplayed();
  logger.info('Chart displayed without errors');

  await analyticsPage.verifyMiscellaneousIncludesInvalidCategories();
  logger.info('Invalid categories auto-corrected to Miscellaneous');

  await analyticsPage.verifyCategoryAmount('Miscellaneous', '5200');
  logger.info('Corrected category breakdown verified');
});

// Test Case - QE-10324 TS-003 TC-001
test('Verify analytics dashboard displays empty category visualization with appropriate message for user with no transaction history', async ({ page }) => {
  logger.info('Starting test: QE-10324 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const analyticsPage = new AnalyticsPage(page);

  await loginPage.navigate();
  await loginPage.login('notransactions@example.com', 'Pass@123');
  logger.info('User with no transaction history authenticated');

  await dashboardPage.navigateToAnalytics();
  await expect(analyticsPage.analyticsHeader).toBeVisible();
  logger.info('Analytics dashboard loaded');

  await analyticsPage.verifyEmptyCategoryChart();
  logger.info('Category visualization is empty');

  await analyticsPage.verifyNoDataMessage();
  logger.info('Appropriate message displayed for no data');
});

// Test Case - QE-10323 TS-001 TC-001
test('Verify transaction monitoring interface aggregates and displays transactions from all cards in single responsive view with card identification', async ({ page }) => {
  logger.info('Starting test: QE-10323 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const transactionPage = new TransactionHistoryPage(page);

  await loginPage.navigate();
  await loginPage.login('multicard@example.com', 'Pass@123');
  logger.info('User with multiple active cards authenticated');

  await dashboardPage.navigateToTransactions();
  await expect(transactionPage.pageHeader).toBeVisible();
  logger.info('Transaction monitoring interface loaded');

  await transactionPage.verifyAggregatedView(['CC001', 'CC002', 'CC003']);
  logger.info('Transactions aggregated in single view');

  await transactionPage.verifyCardIdentification();
  logger.info('Each transaction identifies its card');

  await transactionPage.verifyResponsiveView();
  logger.info('Responsive view verified');
});

// Test Case - QE-10323 TS-002 TC-001
test('Verify transaction monitoring interface displays transactions from single card without aggregation errors or missing data', async ({ page }) => {
  logger.info('Starting test: QE-10323 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const transactionPage = new TransactionHistoryPage(page);

  await loginPage.navigate();
  await loginPage.login('singlecard@example.com', 'Pass@123');
  logger.info('User with single card authenticated');

  await dashboardPage.navigateToTransactions();
  await expect(transactionPage.pageHeader).toBeVisible();
  logger.info('Transaction monitoring interface loaded');

  await transactionPage.verifyAllTransactionsFromSingleCard('CC001');
  logger.info('All transactions from single card displayed');

  await transactionPage.verifyNoAggregationErrors();
  logger.info('No aggregation errors detected');

  await transactionPage.verifyCompleteTransactionDetails();
  logger.info('All transaction details complete');
});

// Test Case - QE-10323 TS-003 TC-001
test('Verify transaction monitoring interface rejects access for user with expired or invalid session token with session validation error', async ({ page }) => {
  logger.info('Starting test: QE-10323 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  const transactionPage = new TransactionHistoryPage(page);

  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Pass@123');
  logger.info('User authenticated and session token created');

  await page.evaluate(() => sessionStorage.clear());
  logger.info('Session token invalidated');

  await transactionPage.navigateDirectly();
  logger.info('Attempted access with expired token');

  await transactionPage.verifySessionValidationError();
  logger.info('Session validation error displayed');

  await transactionPage.verifyNoTransactionDataDisplayed();
  logger.info('No transaction data displayed');
});
