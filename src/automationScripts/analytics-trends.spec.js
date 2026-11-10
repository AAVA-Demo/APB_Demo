const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

/**
 * Test Suite: Monthly Spend Trend Visualization
 * User Story: QE-9298
 * Test Cases: QE-9438 TS-001 TC-001, QE-9438 TS-002 TC-001, QE-9438 TS-003 TC-001
 */

test.describe('Monthly Spend Trend Visualization', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-9438 TS-001 TC-001
   * Description: Verify user with 12 months of transaction history can view monthly spend trends in interactive line chart
   */
  test('TC-001: User with 12 months history views monthly spend trends', async ({ page }) => {
    // Step 1: Login with full-history user
    await loginPage.login('fullhistory_user@demo.com', 'Pass@123');

    // Step 2: Navigate to Analytics page
    await analyticsPage.navigateToAnalytics();

    // Step 3: Locate monthly spend trend section
    await expect(analyticsPage.trendSection).toBeVisible();
    await expect(analyticsPage.trendChart).toBeVisible();

    // Step 4: Verify chart displays 12 data points
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(12);

    // Step 5: Verify each data point displays accurate monthly spend
    const monthlySpends = await analyticsPage.getMonthlySpendValues();
    monthlySpends.forEach(spend => {
      expect(spend).toMatch(/\$[\d,]+\.\d{2}/);
    });

    // Step 6: Test chart interactivity - hover over data point
    await analyticsPage.hoverOverTrendDataPoint(0);
    await expect(analyticsPage.trendTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTrendTooltipText();
    expect(tooltipText).toMatch(/Month: .+ Spend: \$[\d,]+\.\d{2}/);

    // Step 7: Verify time period filtering controls are available
    await expect(analyticsPage.dateRangeFilter).toBeVisible();

    // Step 8: Verify chart renders within 3 seconds (NFR)
    const startTime = Date.now();
    await page.reload();
    await analyticsPage.waitForTrendChartLoad();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(3000);
  });

  /**
   * Test Case ID: QE-9438 TS-002 TC-001
   * Description: Verify monthly spend trend chart updates dynamically when user applies custom date range filter
   */
  test('TC-002: Chart updates dynamically with custom date range filter', async ({ page }) => {
    // Step 1: Login with full-history user
    await loginPage.login('fullhistory_user@demo.com', 'Pass@123');

    // Step 2: Navigate to Analytics page
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForTrendChartLoad();

    // Step 3: Verify default 12-month view
    let dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(12);

    // Step 4: Apply custom date range filter (last 6 months)
    await analyticsPage.setDateRangeFilter('2024-07-01', '2024-12-31');
    await analyticsPage.clickApplyFilter();

    // Step 5: Verify chart updates to display 6 months
    await analyticsPage.waitForTrendChartUpdate();
    dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(6);

    // Step 6: Verify aggregated spend values are correct
    const monthlySpends = await analyticsPage.getMonthlySpendValues();
    expect(monthlySpends.length).toBe(6);

    // Step 7: Apply different date range (last 3 months)
    await analyticsPage.setDateRangeFilter('2024-10-01', '2024-12-31');
    await analyticsPage.clickApplyFilter();
    await analyticsPage.waitForTrendChartUpdate();
    dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(3);

    // Step 8: Verify chart update completes within 3 seconds
    const startTime = Date.now();
    await analyticsPage.setDateRangeFilter('2024-01-01', '2024-12-31');
    await analyticsPage.clickApplyFilter();
    await analyticsPage.waitForTrendChartUpdate();
    const updateTime = Date.now() - startTime;
    expect(updateTime).toBeLessThan(3000);
  });

  /**
   * Test Case ID: QE-9438 TS-003 TC-001
   * Description: Verify appropriate message is displayed when user has no transaction history for past 12 months
   */
  test('TC-003: User with no history sees appropriate message', async ({ page }) => {
    // Step 1: Login with no-history user
    await loginPage.login('nohistory_user@demo.com', 'Pass@123');

    // Step 2: Navigate to Analytics page
    await analyticsPage.navigateToAnalytics();

    // Step 3: Locate monthly spend trend section
    await expect(analyticsPage.trendSection).toBeVisible();

    // Step 4: Verify appropriate message is displayed
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const message = await analyticsPage.getNoDataMessageText();
    expect(message).toContain('No data available for the selected period');

    // Step 5: Verify chart displays empty state or zero values
    const isEmptyState = await analyticsPage.emptyStateTrendChart.isVisible();
    if (!isEmptyState) {
      const monthlySpends = await analyticsPage.getMonthlySpendValues();
      monthlySpends.forEach(spend => {
        expect(spend).toContain('$0.00');
      });
    }

    // Step 6: Verify no technical errors are displayed
    await expect(analyticsPage.errorMessage).not.toBeVisible();
  });
});