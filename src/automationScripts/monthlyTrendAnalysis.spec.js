const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { MonthlyTrendAnalysisPage } = require('./pages/monthlyTrendAnalysis.page');

test.describe('Monthly Spend Trend Analysis Tests', () => {

  test('QE-9713 TS-001 TC-001 - Verify user with 12 months of transaction history can view interactive chart displaying accurate month-over-month spending trends with all 12 months of data rendered correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const trendAnalysisPage = new MonthlyTrendAnalysisPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_12months', 'Test@123');

    // Step 3: Navigate to monthly trend analysis view
    await trendAnalysisPage.navigate();

    // Step 4: Observe interactive chart
    await expect(trendAnalysisPage.trendChart).toBeVisible();

    // Step 5: Verify all 12 months are displayed on X-axis
    const months = await trendAnalysisPage.getXAxisMonths();
    const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    expect(months).toEqual(expectedMonths);

    // Step 6: Verify spending amounts for each month
    const expectedSpending = {
      'Jan': '$2,500', 'Feb': '$3,000', 'Mar': '$2,800', 'Apr': '$3,200',
      'May': '$2,900', 'Jun': '$3,500', 'Jul': '$4,000', 'Aug': '$3,800',
      'Sep': '$3,300', 'Oct': '$3,600', 'Nov': '$4,200', 'Dec': '$4,500'
    };
    const actualSpending = await trendAnalysisPage.getMonthlySpendingData();
    expect(actualSpending).toEqual(expectedSpending);

    // Step 7: Interact with chart by hovering
    await trendAnalysisPage.hoverOverDataPoint('Jan');
    const tooltip = await trendAnalysisPage.getTooltipValue();
    expect(tooltip).toBe('$2,500');

    // Step 8: Verify trend line represents spending pattern
    await expect(trendAnalysisPage.trendLine).toBeVisible();
  });

  test('QE-9713 TS-002 TC-001 - Verify user can apply time period filter to view spending trends for last 6 months only and system correctly recalculates and displays filtered trend data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const trendAnalysisPage = new MonthlyTrendAnalysisPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_filter', 'Test@123');

    // Step 3: Navigate to monthly trend analysis view
    await trendAnalysisPage.navigate();

    // Step 4: Locate time period filter control
    await expect(trendAnalysisPage.timePeriodFilter).toBeVisible();

    // Step 5: Apply filter to select 'Last 6 Months'
    await trendAnalysisPage.selectTimePeriod('Last 6 Months');

    // Step 6: Observe chart after filter is applied
    await expect(trendAnalysisPage.trendChart).toBeVisible();

    // Step 7: Verify only 6 months are displayed
    const months = await trendAnalysisPage.getXAxisMonths();
    const expectedMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    expect(months).toEqual(expectedMonths);

    // Step 8: Verify spending amounts for filtered 6 months
    const expectedSpending = {
      'Jul': '$4,000', 'Aug': '$3,800', 'Sep': '$3,300',
      'Oct': '$3,600', 'Nov': '$4,200', 'Dec': '$4,500'
    };
    const actualSpending = await trendAnalysisPage.getMonthlySpendingData();
    expect(actualSpending).toEqual(expectedSpending);

    // Step 9: Verify months outside range are excluded
    const allMonths = await trendAnalysisPage.getXAxisMonths();
    expect(allMonths).not.toContain('Jan');
    expect(allMonths).not.toContain('Jun');
  });

  test('QE-9713 TS-003 TC-001 - Verify user with less than 1 month of transaction history receives appropriate message indicating insufficient data for trend analysis', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const trendAnalysisPage = new MonthlyTrendAnalysisPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_newaccount', 'Test@123');

    // Step 3: Navigate to monthly trend analysis view
    await trendAnalysisPage.navigate();

    // Step 4 & 5: Verify appropriate message is displayed
    const message = await trendAnalysisPage.getInsufficientDataMessage();
    expect(message).toMatch(/Insufficient transaction history|Monthly trend analysis requires at least 1 month/);

    // Step 6: Verify no chart is displayed
    await expect(trendAnalysisPage.trendChart).not.toBeVisible();
  });

});