const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Spending Analytics and Insights', () => {

  test('QE-8444 TS-001 TC-001 - Verify category analysis displays accurate spending for all 9 categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_all_categories', 'Test@123');

    // Step 3-4: Navigate to analytics
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategoryAnalysis();
    await expect(analyticsPage.categoryChartContainer).toBeVisible();

    // Step 5-13: Verify all 9 categories
    const expectedCategories = {
      'Food & Dining': { amount: 1200, percentage: 15 },
      'Fuel': { amount: 800, percentage: 10 },
      'Shopping': { amount: 2000, percentage: 25 },
      'Travel': { amount: 1500, percentage: 18.75 },
      'Entertainment': { amount: 600, percentage: 7.5 },
      'Utilities': { amount: 500, percentage: 6.25 },
      'Healthcare': { amount: 400, percentage: 5 },
      'Education': { amount: 700, percentage: 8.75 },
      'Miscellaneous': { amount: 300, percentage: 3.75 }
    };

    for (const [category, expected] of Object.entries(expectedCategories)) {
      const amount = await analyticsPage.getCategoryAmount(category);
      const percentage = await analyticsPage.getCategoryPercentage(category);

      expect(amount).toBe(expected.amount);
      expect(percentage).toBeCloseTo(expected.percentage, 2);
    }

    // Step 14: Verify total
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe(8000);

    const totalPercentage = await analyticsPage.getTotalPercentage();
    expect(totalPercentage).toBe(100);
  });

  test('QE-8444 TS-002 TC-001 - Verify appropriate messaging when user has no transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_no_transactions', 'Test@123');

    // Step 3-4: Navigate to analytics
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategoryAnalysis();

    // Step 5: Verify no data message
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toContain('No spending data available');

    // Step 6: Verify all categories show zero
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of categories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(amount).toBe(0);
    }

    // Step 7: Verify empty chart state
    const isChartEmpty = await analyticsPage.isChartEmpty();
    expect(isChartEmpty).toBeTruthy();
  });

  test('QE-8444 TS-003 TC-001 - Verify category breakdown for 3 active categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_partial_categories', 'Test@123');

    // Step 3: Navigate to analytics
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategoryAnalysis();

    // Step 4-6: Verify active categories
    const activeCategories = {
      'Food & Dining': { amount: 500, percentage: 50 },
      'Fuel': { amount: 300, percentage: 30 },
      'Shopping': { amount: 200, percentage: 20 }
    };

    for (const [category, expected] of Object.entries(activeCategories)) {
      const amount = await analyticsPage.getCategoryAmount(category);
      const percentage = await analyticsPage.getCategoryPercentage(category);

      expect(amount).toBe(expected.amount);
      expect(percentage).toBe(expected.percentage);
    }

    // Step 7: Verify remaining categories show zero
    const zeroCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of zeroCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      const percentage = await analyticsPage.getCategoryPercentage(category);

      expect(amount).toBe(0);
      expect(percentage).toBe(0);
    }

    // Step 8: Verify total
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe(1000);
  });

  test('QE-8440 TS-001 TC-001 - Verify monthly spend trend chart for 12 months history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_12_months_history', 'Test@123');

    // Step 3-4: Navigate to analytics
    await analyticsPage.navigate();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();

    // Step 5: Verify 12 months on X-axis
    const monthsDisplayed = await analyticsPage.getMonthsOnXAxis();
    expect(monthsDisplayed.length).toBe(12);

    // Step 6: Verify Y-axis range
    const yAxisRange = await analyticsPage.getYAxisRange();
    expect(yAxisRange.min).toBe(0);
    expect(yAxisRange.max).toBeGreaterThanOrEqual(5000);

    // Step 7: Verify data points
    const expectedData = {
      'Jan 2023': 2500,
      'Feb 2023': 3200,
      'Mar 2023': 2800,
      'Apr 2023': 3500,
      'May 2023': 4000,
      'Jun 2023': 3800,
      'Jul 2023': 4200,
      'Aug 2023': 3900,
      'Sep 2023': 3600,
      'Oct 2023': 4100,
      'Nov 2023': 4500,
      'Dec 2023': 3700
    };

    for (const [month, amount] of Object.entries(expectedData)) {
      const actualAmount = await analyticsPage.getMonthlySpendAmount(month);
      expect(actualAmount).toBe(amount);
    }

    // Step 8: Verify tooltip on hover
    await analyticsPage.hoverOverDataPoint('May 2023');
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('May 2023');
    expect(tooltipText).toContain('$4,000.00');

    // Step 9: Verify interactivity
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBeTruthy();
  });

  test('QE-8440 TS-002 TC-001 - Verify messaging for insufficient data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_new_account', 'Test@123');

    // Step 3: Navigate to analytics
    await analyticsPage.navigate();

    // Step 4: Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toContain('Insufficient data for trend analysis');

    // Step 5: Verify empty or minimal chart
    const hasMinimalData = await analyticsPage.hasMinimalChartData();
    expect(hasMinimalData).toBeTruthy();

    // Step 6: Verify current month data if exists
    const currentMonthData = await analyticsPage.getCurrentMonthData();
    if (currentMonthData) {
      expect(currentMonthData.amount).toBeGreaterThanOrEqual(0);
    }
  });

  test('QE-8440 TS-003 TC-001 - Verify trend chart with zero-spend months', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and login
    await loginPage.navigate();
    await loginPage.login('user_varied_spending', 'Test@123');

    // Step 3: Navigate to analytics
    await analyticsPage.navigate();

    // Step 4: Verify all 12 months displayed
    const monthsDisplayed = await analyticsPage.getMonthsOnXAxis();
    expect(monthsDisplayed.length).toBe(12);

    // Step 5: Verify spending months
    const spendingMonths = {
      'Jan 2023': 2500,
      'Feb 2023': 3000,
      'Apr 2023': 2800,
      'May 2023': 3200,
      'Jul 2023': 4000,
      'Sep 2023': 3500,
      'Nov 2023': 4200
    };

    for (const [month, amount] of Object.entries(spendingMonths)) {
      const actualAmount = await analyticsPage.getMonthlySpendAmount(month);
      expect(actualAmount).toBe(amount);
    }

    // Step 6: Verify zero-spend months
    const zeroMonths = ['Mar 2023', 'Jun 2023', 'Aug 2023', 'Oct 2023', 'Dec 2023'];
    for (const month of zeroMonths) {
      const amount = await analyticsPage.getMonthlySpendAmount(month);
      expect(amount).toBe(0);
    }

    // Step 7: Verify tooltip for zero-spend month
    await analyticsPage.hoverOverDataPoint('Mar 2023');
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('March 2023');
    expect(tooltipText).toContain('$0.00');

    // Step 8: Verify trend line continuity
    const hasContinuousTrendLine = await analyticsPage.hasContinuousTrendLine();
    expect(hasContinuousTrendLine).toBeTruthy();
  });

});
