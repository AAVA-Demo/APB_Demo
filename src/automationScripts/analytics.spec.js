const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Spending Analytics and Insights', () => {
  let loginPage;
  let dashboardPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9014 TS-001 TC-001 - Verify interactive bar chart displays spending breakdown across all nine categories', async ({ page }) => {
    // Step 2: Log in with user credentials who has transactions across all nine categories
    await loginPage.login('testuser_allcategories', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the spending analytics page
    await dashboardPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*analytics/);

    // Step 4: Verify interactive bar chart is displayed
    await analyticsPage.waitForChartToLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();

    // Step 5: Verify chart displays all nine spending categories
    const categories = await analyticsPage.getAllCategoryBars();
    expect(categories.length).toBe(9);

    // Step 6: Verify each category displays dollar amount
    const categoryAmounts = await analyticsPage.getCategoryAmounts();
    expect(categoryAmounts['Food & Dining']).toContain('3,000');
    expect(categoryAmounts['Fuel']).toContain('1,200');
    expect(categoryAmounts['Shopping']).toContain('2,500');
    expect(categoryAmounts['Travel']).toContain('4,000');

    // Step 7: Verify each category displays percentage of total spend
    const categoryPercentages = await analyticsPage.getCategoryPercentages();
    expect(categoryPercentages['Food & Dining']).toContain('21.43');
    expect(categoryPercentages['Travel']).toContain('28.57');
  });

  test('QE-9014 TS-002 TC-001 - Verify message when user has no transaction history', async ({ page }) => {
    // Step 2: Log in with user credentials who has no transaction history
    await loginPage.login('testuser_nohistory', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the spending analytics page
    await dashboardPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*analytics/);

    // Step 4: Verify message indicating no spending data is displayed
    await analyticsPage.waitForNoDataMessage();
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toContain('No spending data is available');

    // Step 5: Verify all category amounts are displayed as zero
    const categoryAmounts = await analyticsPage.getCategoryAmounts();
    for (const amount of Object.values(categoryAmounts)) {
      expect(amount).toContain('0.00');
    }
  });

  test('QE-9014 TS-003 TC-001 - Verify error message when categorization service fails', async ({ page }) => {
    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the spending analytics page
    await dashboardPage.navigateToAnalytics();

    // Step 4: Simulate categorization service failure
    await page.route('**/api/transactions**', route => route.abort());
    await page.reload();

    // Step 5: Verify error message is displayed
    await analyticsPage.waitForErrorMessage();
    const errorMessage = await analyticsPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load spending analytics');

    // Step 6: Verify category breakdown chart is not rendered
    const chartVisible = await analyticsPage.categoryChart.isVisible().catch(() => false);
    expect(chartVisible).toBeFalsy();
  });

  test('QE-9016 TS-001 TC-001 - Verify interactive line chart displays 12-month spending trend', async ({ page }) => {
    // Step 2: Log in with user credentials who has at least 12 months of transaction history
    await loginPage.login('testuser_12months', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the spending analytics page
    await dashboardPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*analytics/);

    // Step 4: Navigate to the trend analysis section
    await analyticsPage.navigateToTrendSection();

    // Step 5: Verify interactive line chart is displayed
    await analyticsPage.waitForTrendChartToLoad();
    await expect(analyticsPage.trendChart).toBeVisible();

    // Step 6: Verify chart displays monthly spending totals for past 12 months
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(12);

    // Step 7: Verify month labels are clearly displayed on X-axis
    const monthLabels = await analyticsPage.getTrendMonthLabels();
    expect(monthLabels.length).toBe(12);
    expect(monthLabels).toContain('Jan');
    expect(monthLabels).toContain('Dec');

    // Step 8: Verify trend indicators show spending patterns over time
    await expect(analyticsPage.trendLine).toBeVisible();
  });

  test('QE-9016 TS-002 TC-001 - Verify chart displays only available months with limited historical data', async ({ page }) => {
    // Step 2: Log in with user credentials who has only 3 months of transaction history
    await loginPage.login('testuser_3months', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the spending analytics page
    await dashboardPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*analytics/);

    // Step 4: Navigate to the trend analysis section
    await analyticsPage.navigateToTrendSection();

    // Step 5: Verify chart displays only available months (3 months)
    await analyticsPage.waitForTrendChartToLoad();
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(3);

    // Step 6: Verify informational message is displayed
    const message = await analyticsPage.getLimitedDataMessage();
    expect(message).toContain('Limited historical data available');
    expect(message).toContain('3 months');
  });

  test('QE-9016 TS-003 TC-001 - Verify error message when analytics service fails', async ({ page }) => {
    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Navigate to the spending analytics page
    await dashboardPage.navigateToAnalytics();

    // Step 4: Navigate to the trend analysis section
    await analyticsPage.navigateToTrendSection();

    // Step 5: Simulate analytics service failure
    await page.route('**/api/transactions**', route => route.abort());
    await page.reload();

    // Step 6: Verify error message is displayed
    await analyticsPage.waitForTrendErrorMessage();
    const errorMessage = await analyticsPage.getTrendErrorMessage();
    expect(errorMessage).toContain('Failed to load monthly trend data');

    // Step 7: Verify trend chart is not rendered
    const chartVisible = await analyticsPage.trendChart.isVisible().catch(() => false);
    expect(chartVisible).toBeFalsy();

    // Step 8: Verify retry option is available
    await expect(analyticsPage.trendRetryButton).toBeVisible();
    await expect(analyticsPage.trendRetryButton).toBeEnabled();
  });
});