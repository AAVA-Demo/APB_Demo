const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardManagementPage } = require('./pages/cardManagement.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { logger } = require('../utils/logger');

test.describe('Credit Card Dashboard - Real-Time Credit Utilization Tracking', () => {

  test('QE-8965 TS-001 TC-001: Verify that after making a transaction, refreshing the dashboard updates available credit and outstanding amount', async ({ page }) => {
    logger.info('Starting test: QE-8965 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the credit card dashboard application
    await loginPage.navigate();
    logger.info('Dashboard application launched');

    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('User logged in successfully');

    // Step 3: Note the current available credit and outstanding amount
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstandingAmount = await dashboardPage.getOutstandingAmount();
    logger.info(`Initial Available Credit: ${initialAvailableCredit}, Outstanding: ${initialOutstandingAmount}`);

    // Step 4: Simulate a transaction (via API or mock)
    await dashboardPage.simulateTransaction(100, 'Test Store');
    logger.info('Transaction of $100 simulated');

    // Step 5: Refresh the dashboard page
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard refreshed');

    // Step 6: Verify available credit decreased by transaction amount
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(updatedAvailableCredit).toBe(initialAvailableCredit - 100);
    logger.info(`Available credit updated correctly: ${updatedAvailableCredit}`);

    // Step 7: Verify outstanding amount increased by transaction amount
    const updatedOutstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(updatedOutstandingAmount).toBe(initialOutstandingAmount + 100);
    logger.info(`Outstanding amount updated correctly: ${updatedOutstandingAmount}`);
  });

  test('QE-8965 TS-002 TC-001: Verify that auto-refresh automatically updates available credit and outstanding amount after a transaction', async ({ page }) => {
    logger.info('Starting test: QE-8965 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    logger.info('User logged in successfully');

    // Step 3: Enable auto-refresh
    await dashboardPage.enableAutoRefresh(30);
    logger.info('Auto-refresh enabled with 30 second interval');

    // Step 4: Note current values
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstandingAmount = await dashboardPage.getOutstandingAmount();

    // Step 5: Simulate transaction
    await dashboardPage.simulateTransaction(150, 'Test Store');
    logger.info('Transaction of $150 simulated');

    // Step 6: Wait for auto-refresh (30 seconds)
    await page.waitForTimeout(31000); // Wait slightly longer than refresh interval
    logger.info('Waited for auto-refresh');

    // Step 7-8: Verify updates
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(updatedAvailableCredit).toBe(initialAvailableCredit - 150);
    expect(updatedOutstandingAmount).toBe(initialOutstandingAmount + 150);
    logger.info('Auto-refresh updated values correctly');
  });

  test('QE-8965 TS-003 TC-001: Verify that when backend transaction service fails, dashboard displays stale data with a warning message', async ({ page }) => {
    logger.info('Starting test: QE-8965 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');

    // Step 3: Note current values
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstandingAmount = await dashboardPage.getOutstandingAmount();

    // Step 4: Simulate backend service failure
    await page.route('**/api/transactions/**', route => route.abort());
    logger.info('Backend transaction service failure simulated');

    // Step 5: Attempt transaction
    await dashboardPage.simulateTransaction(100, 'Test Store');

    // Step 6: Refresh dashboard
    await page.reload();
    await dashboardPage.waitForDashboardLoad();

    // Step 7: Verify stale data
    const currentAvailableCredit = await dashboardPage.getAvailableCredit();
    const currentOutstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(currentAvailableCredit).toBe(initialAvailableCredit);
    expect(currentOutstandingAmount).toBe(initialOutstandingAmount);
    logger.info('Stale data verified');

    // Step 8: Verify warning message
    await expect(dashboardPage.warningMessage).toContainText('Credit utilization data may not be current');
    logger.info('Warning message displayed correctly');
  });
});

test.describe('Credit Card Dashboard - Category-Wise Spending Visualization', () => {

  test('QE-8964 TS-001 TC-001: Verify that user with transactions across all 9 categories can view category-wise spending breakdown within 3 seconds', async ({ page }) => {
    logger.info('Starting test: QE-8964 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_all_categories@example.com', 'Test@123');

    // Step 3: Navigate to analytics
    await analyticsPage.navigate();
    logger.info('Navigated to analytics section');

    // Step 4: Measure chart render time
    const startTime = Date.now();
    await analyticsPage.waitForCategoryChart();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(3000);
    logger.info(`Chart rendered in ${renderTime}ms`);

    // Step 5: Verify all 9 categories displayed
    const categories = await analyticsPage.getCategoryNames();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    logger.info('All 9 categories verified');

    // Step 6-7: Verify amounts and interactivity
    await expect(analyticsPage.categoryChart).toBeVisible();
    await analyticsPage.hoverOnCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    logger.info('Chart interactivity verified');
  });

  test('QE-8964 TS-002 TC-001: Verify that user with transactions in only 3 categories can view accurate category-wise spending breakdown', async ({ page }) => {
    logger.info('Starting test: QE-8964 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_3_categories@example.com', 'Test@123');
    await analyticsPage.navigate();

    // Step 4: Verify only 3 categories displayed
    const categories = await analyticsPage.getCategoryNames();
    expect(categories.length).toBe(3);
    logger.info('Only 3 categories displayed');

    // Step 5-6: Verify amounts and percentages
    const foodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    const fuelAmount = await analyticsPage.getCategoryAmount('Fuel');
    const shoppingAmount = await analyticsPage.getCategoryAmount('Shopping');
    expect(foodAmount).toBeGreaterThan(0);
    expect(fuelAmount).toBeGreaterThan(0);
    expect(shoppingAmount).toBeGreaterThan(0);

    const totalAmount = foodAmount + fuelAmount + shoppingAmount;
    const foodPercentage = (foodAmount / totalAmount) * 100;
    expect(foodPercentage).toBeCloseTo(33.33, 1);
    logger.info('Amounts and percentages verified');
  });

  test('QE-8964 TS-003 TC-001: Verify that user with no transaction history receives appropriate message in analytics section', async ({ page }) => {
    logger.info('Starting test: QE-8964 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_no_transactions@example.com', 'Test@123');
    await analyticsPage.navigate();

    // Step 4-5: Verify no chart and message displayed
    await expect(analyticsPage.categoryChart).not.toBeVisible();
    await expect(analyticsPage.noDataMessage).toContainText('No spending data available for visualization');
    logger.info('No data message verified');
  });
});

test.describe('Credit Card Dashboard - Monthly Spending Trend Analysis', () => {

  test('QE-8963 TS-001 TC-001: Verify that user with 12 months of transaction history can view monthly spending trend chart', async ({ page }) => {
    logger.info('Starting test: QE-8963 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_12_months@example.com', 'Test@123');
    await analyticsPage.navigate();

    // Step 4-6: Verify trend chart
    await expect(analyticsPage.trendChart).toBeVisible();
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBe(12);
    logger.info('12 months of data verified');
  });

  test('QE-8963 TS-002 TC-001: Verify that user with 3 months of transaction history can view accurate monthly spending trend chart', async ({ page }) => {
    logger.info('Starting test: QE-8963 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_3_months@example.com', 'Test@123');
    await analyticsPage.navigate();

    await expect(analyticsPage.trendChart).toBeVisible();
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBe(3);
    logger.info('3 months of data verified');
  });

  test('QE-8963 TS-003 TC-001: Verify that user with less than 3 months of transaction history receives insufficient data message', async ({ page }) => {
    logger.info('Starting test: QE-8963 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_1_month@example.com', 'Test@123');
    await analyticsPage.navigate();

    await expect(analyticsPage.trendChart).not.toBeVisible();
    await expect(analyticsPage.insufficientDataMessage).toContainText('Insufficient data for trend analysis');
    logger.info('Insufficient data message verified');
  });
});

test.describe('Credit Card Dashboard - Card-Wise Spending Analysis', () => {

  test('QE-8962 TS-001 TC-001: Verify that selecting a credit card displays card details page with total spend, transaction count, and spending trends', async ({ page }) => {
    logger.info('Starting test: QE-8962 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await cardManagementPage.navigate();

    // Step 4: Select card
    await cardManagementPage.selectCard('Visa Gold Card');
    logger.info('Card selected');

    // Step 5-7: Verify card details
    await expect(cardManagementPage.totalSpend).toBeVisible();
    await expect(cardManagementPage.transactionCount).toBeVisible();
    await expect(cardManagementPage.spendingTrendsChart).toBeVisible();
    logger.info('Card details verified');
  });

  test('QE-8962 TS-002 TC-001: Verify that card details page displays accurate category-wise breakdown for a card with multi-category transactions', async ({ page }) => {
    logger.info('Starting test: QE-8962 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('Mastercard Platinum');

    // Step 5-7: Verify category breakdown
    await expect(cardManagementPage.categoryBreakdown).toBeVisible();
    const categories = await cardManagementPage.getCategoryBreakdownData();
    expect(categories.length).toBeGreaterThan(1);
    logger.info('Category breakdown verified');
  });

  test('QE-8962 TS-003 TC-001: Verify that card details page displays zero values for a card with no transaction history', async ({ page }) => {
    logger.info('Starting test: QE-8962 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await cardManagementPage.navigate();
    await cardManagementPage.selectCard('Amex Blue Card');

    // Step 5-7: Verify zero values
    const totalSpend = await cardManagementPage.getTotalSpend();
    const transactionCount = await cardManagementPage.getTransactionCount();
    expect(totalSpend).toBe(0);
    expect(transactionCount).toBe(0);
    await expect(cardManagementPage.noTransactionMessage).toBeVisible();
    logger.info('Zero values verified');
  });
});

test.describe('Credit Card Dashboard - Multiple Credit Card Listing', () => {

  test('QE-8961 TS-001 TC-001: Verify that user with multiple credit cards can view consolidated card list within 1 second', async ({ page }) => {
    logger.info('Starting test: QE-8961 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_multi_cards@example.com', 'Test@123');

    // Step 3-4: Navigate and measure load time
    const startTime = Date.now();
    await cardManagementPage.navigate();
    await cardManagementPage.waitForCardList();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(1000);
    logger.info(`Card list loaded in ${loadTime}ms`);

    // Step 5-8: Verify all cards displayed with details
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBeGreaterThan(1);
    for (const card of cards) {
      expect(card.name).toBeTruthy();
      expect(card.creditLimit).toBeGreaterThan(0);
      expect(card.currentBalance).toBeGreaterThanOrEqual(0);
    }
    logger.info('All card details verified');
  });

  test('QE-8961 TS-002 TC-001: Verify that user with no registered credit cards receives appropriate message in card management section', async ({ page }) => {
    logger.info('Starting test: QE-8961 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser_no_cards@example.com', 'Test@123');
    await cardManagementPage.navigate();

    // Step 4-5: Verify no cards and message
    const cards = await cardManagementPage.getAllCards();
    expect(cards.length).toBe(0);
    await expect(cardManagementPage.noCardsMessage).toContainText('No credit cards available');
    logger.info('No cards message verified');
  });

  test('QE-8961 TS-003 TC-001: Verify that when backend service is unavailable, user receives error message in card management section', async ({ page }) => {
    logger.info('Starting test: QE-8961 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const cardManagementPage = new CardManagementPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');

    // Step 3: Simulate backend failure
    await page.route('**/api/creditcards/**', route => route.abort());
    logger.info('Backend service failure simulated');

    await cardManagementPage.navigate();

    // Step 5-6: Verify error message
    await expect(cardManagementPage.errorMessage).toContainText('Unable to retrieve card list');
    logger.info('Error message verified');
  });
});

test.describe('Credit Card Dashboard - KPI Display Interface', () => {

  test('QE-8960 TS-001 TC-001: Verify that dashboard displays all 4 KPIs within 2 seconds on desktop', async ({ page }) => {
    logger.info('Starting test: QE-8960 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');

    // Step 3: Measure load time
    const startTime = Date.now();
    await dashboardPage.waitForAllKPIs();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info(`KPIs loaded in ${loadTime}ms`);

    // Step 4-7: Verify all KPIs
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info('All 4 KPIs verified');
  });

  test('QE-8960 TS-001 TC-002: Verify that dashboard displays all 4 KPIs within 2 seconds on tablet', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Tablet test only on Safari/WebKit');
    logger.info('Starting test: QE-8960 TS-001 TC-002');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');

    const startTime = Date.now();
    await dashboardPage.waitForAllKPIs();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);

    await expect(dashboardPage.kpiContainer).toHaveCSS('display', 'flex');
    logger.info('Tablet responsive layout verified');
  });

  test('QE-8960 TS-001 TC-003: Verify that dashboard displays all 4 KPIs within 2 seconds on mobile', async ({ page }) => {
    logger.info('Starting test: QE-8960 TS-001 TC-003');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');

    const startTime = Date.now();
    await dashboardPage.waitForAllKPIs();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);

    await expect(dashboardPage.kpiContainer).toHaveCSS('flex-direction', 'column');
    logger.info('Mobile responsive layout verified');
  });

  test('QE-8960 TS-002 TC-001: Verify that when credit card data service is unavailable, dashboard displays error message with retry option', async ({ page }) => {
    logger.info('Starting test: QE-8960 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');

    // Step 3: Simulate service failure
    await page.route('**/api/creditcards/**', route => route.abort());
    await page.reload();

    // Step 4-7: Verify error and retry
    await expect(dashboardPage.kpiContainer).not.toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('KPIs cannot be loaded');
    await expect(dashboardPage.retryButton).toBeVisible();
    await dashboardPage.retryButton.click();
    logger.info('Error message and retry verified');
  });

  test('QE-8960 TS-003 TC-001: Verify that user with invalid or expired credentials is redirected to login page with unauthorized message', async ({ page }) => {
    logger.info('Starting test: QE-8960 TS-003 TC-001');
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('invaliduser@example.com', 'WrongPass@123');

    // Step 3-5: Verify redirect and message
    await expect(page).toHaveURL(/login/);
    await expect(loginPage.unauthorizedMessage).toContainText('Unauthorized access');
    logger.info('Unauthorized access verified');
  });
});
