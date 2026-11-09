const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Spending Analytics - Category-Wise Visualization', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-8187 TS-001 TC-001 - Verify category-wise spending visualization displays all nine categories', async ({ page }) => {
    // Step 1: Launch the application
    await expect(page).toHaveURL(/.*login/);

    // Step 2: Log in with user having transactions across all nine categories
    await loginPage.login(testData.users.allCategoriesUser.username, testData.users.allCategoriesUser.password);

    // Step 3: Navigate to Spending Analytics dashboard
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/.*analytics/);

    // Step 4: Verify the interactive pie chart is displayed
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    const chartVisible = await analyticsPage.isCategoryChartRendered();
    expect(chartVisible).toBe(true);

    // Step 5: Verify each category displays spending amount and percentage
    const categories = await analyticsPage.getAllCategoryData();
    expect(categories.length).toBe(9);
    categories.forEach(category => {
      expect(category.amount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
      expect(category.percentage).toMatch(/^[0-9]+\.[0-9]{2}%$/);
    });

    // Step 6: Verify the sum of all percentages equals 100%
    const totalPercentage = await analyticsPage.calculateTotalPercentage();
    expect(totalPercentage).toBe(100.00);
  });

  test('QE-8187 TS-002 TC-001 - Verify 100% allocation when user has transactions in only one category', async ({ page }) => {
    // Step 1: Launch the application
    await expect(page).toHaveURL(/.*login/);

    // Step 2: Log in with user having transactions only in Food & Dining
    await loginPage.login(testData.users.foodOnlyUser.username, testData.users.foodOnlyUser.password);

    // Step 3: Navigate to Spending Analytics dashboard
    await analyticsPage.navigate();

    // Step 4: Verify pie chart displays 100% allocation to Food & Dining
    const foodDiningData = await analyticsPage.getCategoryData('Food & Dining');
    expect(foodDiningData.percentage).toBe('100.00%');
    expect(foodDiningData.amount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);

    // Step 5: Verify all other categories show zero values or are excluded
    const otherCategories = ['Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of otherCategories) {
      const categoryData = await analyticsPage.getCategoryData(category);
      if (categoryData) {
        expect(categoryData.amount).toBe('$0.00');
        expect(categoryData.percentage).toBe('0.00%');
      }
    }
  });

  test('QE-8187 TS-003 TC-001 - Verify interactive category details display on hover/click', async ({ page }) => {
    // Step 1: Log in with valid credentials
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);

    // Step 2: Navigate to Spending Analytics dashboard
    await analyticsPage.navigate();

    // Step 3: Hover over Food & Dining category segment
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toMatch(/Food & Dining.*\$[0-9,]+\.[0-9]{2}.*[0-9]+\.[0-9]{2}%/);

    // Step 4: Click on Shopping category segment
    await analyticsPage.clickCategory('Shopping');
    await expect(analyticsPage.categoryDetailPanel).toBeVisible();
    const detailData = await analyticsPage.getCategoryDetailData();
    expect(detailData.category).toBe('Shopping');
    expect(detailData.amount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    expect(detailData.percentage).toMatch(/^[0-9]+\.[0-9]{2}%$/);

    // Step 5: Verify all displayed amounts are accurate to 2 decimal places
    const decimalPart = detailData.amount.split('.')[1];
    expect(decimalPart.length).toBe(2);
  });
});

test.describe('Spending Analytics - Monthly Trends', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-8185 TS-001 TC-001 - Verify monthly trends chart displays six consecutive months', async ({ page }) => {
    // Step 1: Log in with user having 6 months of transaction history
    await loginPage.login(testData.users.sixMonthsUser.username, testData.users.sixMonthsUser.password);

    // Step 2: Navigate to Monthly Trends section
    await analyticsPage.navigateToMonthlyTrends();
    await expect(page).toHaveURL(/.*analytics.*trends/);

    // Step 3: Verify interactive line chart is displayed
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const chartRendered = await analyticsPage.isMonthlyTrendsChartRendered();
    expect(chartRendered).toBe(true);

    // Step 4: Verify chart displays data points for six consecutive months
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
    expect(dataPoints.length).toBe(6);
    const expectedMonths = ['June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026'];
    dataPoints.forEach((point, index) => {
      expect(point.month).toContain(expectedMonths[index]);
    });

    // Step 5: Verify chart clearly visualizes upward spending trends
    const hasUpwardTrend = await analyticsPage.hasUpwardTrend();
    expect(hasUpwardTrend).toBe(true);

    // Step 6: Verify chart clearly visualizes downward spending trends
    const hasDownwardTrend = await analyticsPage.hasDownwardTrend();
    expect(hasDownwardTrend).toBe(true);
  });

  test('QE-8185 TS-002 TC-001 - Verify single data point with insufficient historical data message', async ({ page }) => {
    // Step 1: Log in with user having only current month transactions
    await loginPage.login(testData.users.newUser.username, testData.users.newUser.password);

    // Step 2: Navigate to Monthly Trends section
    await analyticsPage.navigateToMonthlyTrends();

    // Step 3: Verify chart displays a single data point for current month
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
    expect(dataPoints.length).toBe(1);
    expect(dataPoints[0].month).toContain('November 2026');

    // Step 4: Verify informational message is displayed
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toMatch(/Insufficient historical data/i);
  });

  test('QE-8185 TS-003 TC-001 - Verify tooltip displays exact spend amount on hover', async ({ page }) => {
    // Step 1: Log in with user having multi-month transaction history
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);

    // Step 2: Navigate to Monthly Trends chart
    await analyticsPage.navigateToMonthlyTrends();

    // Step 3: Hover over data point for October 2026
    await analyticsPage.hoverOverMonthDataPoint('October 2026');
    await expect(analyticsPage.monthlyTrendsTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getMonthlyTrendsTooltipText();
    expect(tooltipText).toMatch(/October 2026.*\$[0-9,]+\.[0-9]{2}/);

    // Step 4: Verify spend amount is formatted to exactly 2 decimal places
    const amountMatch = tooltipText.match(/\$([0-9,]+\.[0-9]{2})/);
    expect(amountMatch).toBeTruthy();
    const decimalPart = amountMatch[1].split('.')[1];
    expect(decimalPart.length).toBe(2);

    // Step 5: Hover over additional data points to verify consistent behavior
    const months = ['September 2026', 'August 2026'];
    for (const month of months) {
      await analyticsPage.hoverOverMonthDataPoint(month);
      const tooltip = await analyticsPage.getMonthlyTrendsTooltipText();
      expect(tooltip).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    }
  });
});