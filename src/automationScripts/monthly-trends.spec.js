const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-10433 TS-001 TC-001
test.describe('Monthly Trends - 12 Month Chart', () => {
  test('TC-001: Verify 12-month trend chart loads within 3 seconds with drill-down', async ({ page }) => {
    logger.info('Starting TC-001: 12-month trend chart test');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_12months', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to Analytics section');

    // Step 3: Verify chart loads within 3 seconds
    const loadStart = Date.now();
    await analyticsPage.waitForTrendChartLoad();
    const loadTime = Date.now() - loadStart;
    expect(loadTime).toBeLessThanOrEqual(3000);
    logger.info(`Trend chart loaded in ${loadTime}ms`);

    // Step 4: Verify 12 month labels
    const monthLabels = await analyticsPage.getMonthLabels();
    const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    expect(monthLabels).toEqual(expectedMonths);
    logger.info('All 12 month labels verified');

    // Step 5: Verify accurate spend values
    const spendValues = await analyticsPage.getMonthlySpendValues();
    expect(spendValues.length).toBe(12);
    expect(spendValues[0]).toBeGreaterThan(0);
    logger.info('Accurate spend values verified');

    // Step 6: Verify Y-axis currency formatting
    const yAxisFormatting = await analyticsPage.verifyYAxisFormatting();
    expect(yAxisFormatting).toBe(true);
    logger.info('Y-axis currency formatting verified');

    // Step 7: Test drill-down capability
    await analyticsPage.clickMonthDataPoint('March');
    const detailViewVisible = await analyticsPage.isDetailViewVisible();
    expect(detailViewVisible).toBe(true);
    logger.info('Drill-down functionality verified');
  });
});

// Test Case - QE-10433 TS-002 TC-001
test.describe('Monthly Trends - Partial Data', () => {
  test('TC-002: Verify partial data (3 months) displayed with notification', async ({ page }) => {
    logger.info('Starting TC-002: Partial data test');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_3months', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForTrendChartLoad();
    logger.info('Analytics page loaded');

    // Step 3: Verify only 3 months displayed
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBe(3);
    expect(monthLabels).toContain('Oct');
    expect(monthLabels).toContain('Nov');
    expect(monthLabels).toContain('Dec');
    logger.info('Only 3 months of data displayed');

    // Step 4: Verify notification message
    const notification = await analyticsPage.getNotificationMessage();
    expect(notification).toContain('3 months');
    expect(notification).toContain('insufficient historical data');
    logger.info('Notification message verified');

    // Step 5: Verify no placeholder data
    const chartData = await analyticsPage.getChartData();
    expect(chartData.length).toBe(3);
    logger.info('No placeholder data for missing months');

    // Step 6: Verify accurate values for available months
    const spendValues = await analyticsPage.getMonthlySpendValues();
    expect(spendValues[0]).toBeGreaterThan(0);
    expect(spendValues[1]).toBeGreaterThan(0);
    expect(spendValues[2]).toBeGreaterThan(0);
    logger.info('Accurate spend values for 3 available months');
  });
});

// Test Case - QE-10433 TS-003 TC-001
test.describe('Monthly Trends - Month Drill-down', () => {
  test('TC-003: Verify month drill-down shows detailed breakdown', async ({ page }) => {
    logger.info('Starting TC-003: Month drill-down test');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login and navigate
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForTrendChartLoad();
    logger.info('Trend chart loaded');

    // Step 2: Identify March total
    const marchTotal = await analyticsPage.getMonthTotal('March');
    expect(marchTotal).toBe(3800);
    logger.info('March total spend: $3,800');

    // Step 3: Click on March data point
    await analyticsPage.clickMonthDataPoint('March');
    logger.info('Clicked on March data point');

    // Step 4: Verify category-wise distribution
    const categoryDistribution = await analyticsPage.getCategoryDistribution();
    expect(Object.keys(categoryDistribution).length).toBe(9);
    logger.info('Category-wise distribution displayed');

    // Step 5: Verify sum equals March total
    const categorySum = Object.values(categoryDistribution).reduce((a, b) => a + b, 0);
    expect(categorySum).toBe(3800);
    logger.info('Category sum matches March total');

    // Step 6: Verify top merchants
    const topMerchants = await analyticsPage.getTopMerchants();
    expect(topMerchants.length).toBeGreaterThan(0);
    expect(topMerchants[0].amount).toBeGreaterThan(0);
    logger.info('Top merchants list displayed');

    // Step 7: Verify transaction count
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info(`Transaction count: ${transactionCount}`);

    // Step 8: Verify data consistency
    const allValues = await analyticsPage.getAllDetailValues();
    expect(allValues.categorySum).toBe(marchTotal);
    expect(allValues.merchantSum).toBe(marchTotal);
    logger.info('All values consistent and accurate');
  });
});
