const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Monthly Trend Analysis Tests - QE-10613', () => {

  test('QE-10613 TS-001 TC-001: Verify monthly trend analysis with 6+ months data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with 6-month user
    await loginPage.navigate();
    await loginPage.login('user_6months', 'Pass@123');

    // Step 2: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Access Monthly Trend Analysis
    await analyticsPage.selectMonthlyTrendAnalysis();
    await analyticsPage.waitForChartToLoad();

    // Step 4: Verify graph displays 6 months of data
    const monthCount = await analyticsPage.getMonthlyTrendDataPointCount();
    expect(monthCount).toBeGreaterThanOrEqual(6);
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();

    // Step 5: Verify graph is interactive
    const isInteractive = await analyticsPage.verifyChartInteractivity();
    expect(isInteractive).toBe(true);

    // Step 6: Verify month-by-month comparison is clear
    const hasConnectedPoints = await analyticsPage.verifyTrendLineConnected();
    expect(hasConnectedPoints).toBe(true);
  });

  test('QE-10613 TS-001 TC-002: Verify monthly trend analysis allows card filtering', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with multi-card user
    await loginPage.navigate();
    await loginPage.login('user_6months_multicard', 'Pass@123');

    // Step 2: Navigate to Monthly Trend Analysis
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendAnalysis();
    await analyticsPage.waitForChartToLoad();

    // Step 3: Select specific card
    await analyticsPage.selectCardFilter('Visa Platinum (****1234)');

    // Step 4: Apply filter
    await analyticsPage.clickApplyFilter();
    await analyticsPage.waitForChartToLoad();

    // Step 5: Verify graph shows card-specific spending
    const chartTitle = await analyticsPage.getChartTitle();
    expect(chartTitle).toContain('Visa Platinum');
    const dataChanged = await analyticsPage.verifyChartDataChanged();
    expect(dataChanged).toBe(true);
  });

  test('QE-10613 TS-002 TC-001: Verify notification for insufficient data (less than 2 months)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with 1-month user
    await loginPage.navigate();
    await loginPage.login('new_user_1month', 'Pass@123');

    // Step 2: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Attempt to access Monthly Trend Analysis
    await analyticsPage.selectMonthlyTrendAnalysis();

    // Step 4: Verify notification message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient data');
    expect(messageText).toContain('2 months');

    // Step 5: Verify no graph is displayed
    await expect(analyticsPage.monthlyTrendChart).not.toBeVisible();
  });

  test('QE-10613 TS-003 TC-001: Verify 12-month trend identifies highest and lowest spending months', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with 12-month user
    await loginPage.navigate();
    await loginPage.login('user_12months', 'Pass@123');

    // Step 2: Navigate to Monthly Trend Analysis
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendAnalysis();
    await analyticsPage.waitForChartToLoad();

    // Step 3: Verify 12 months of data
    const monthCount = await analyticsPage.getMonthlyTrendDataPointCount();
    expect(monthCount).toBe(12);

    // Step 4: Verify highest spending month is highlighted
    const highestMonth = await analyticsPage.getHighestSpendingMonth();
    expect(highestMonth.isHighlighted).toBe(true);
    expect(highestMonth.label).toBeTruthy();

    // Step 5: Verify lowest spending month is highlighted
    const lowestMonth = await analyticsPage.getLowestSpendingMonth();
    expect(lowestMonth.isHighlighted).toBe(true);
    expect(lowestMonth.label).toBeTruthy();

    // Step 6: Verify trend line connects all data points
    const allPointsConnected = await analyticsPage.verifyAllDataPointsConnected();
    expect(allPointsConnected).toBe(true);
  });

  test('QE-10613 TS-003 TC-002: Verify 12-month trend calculates total and average spending', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with 12-month user
    await loginPage.navigate();
    await loginPage.login('user_12months', 'Pass@123');

    // Step 2: Navigate to Monthly Trend Analysis
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendAnalysis();
    await analyticsPage.waitForChartToLoad();

    // Step 3: Verify total spending is displayed
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBeTruthy();

    // Step 4: Verify average monthly spending is displayed
    const averageSpending = await analyticsPage.getAverageMonthlySpending();
    expect(averageSpending).toBeTruthy();

    // Step 5: Manually verify calculations
    const monthlyData = await analyticsPage.getMonthlySpendingData();
    const calculatedTotal = monthlyData.reduce((sum, month) => sum + month.amount, 0);
    const calculatedAverage = calculatedTotal / monthlyData.length;
    const displayedTotal = parseFloat(totalSpending.replace(/[^0-9.-]+/g, ''));
    const displayedAverage = parseFloat(averageSpending.replace(/[^0-9.-]+/g, ''));
    expect(Math.abs(calculatedTotal - displayedTotal)).toBeLessThan(1);
    expect(Math.abs(calculatedAverage - displayedAverage)).toBeLessThan(1);
  });

});