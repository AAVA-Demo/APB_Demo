const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Category-Wise Spending Visualization Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9968 TS-001 TC-001 - Verify interactive chart displays accurate spending for all 9 predefined categories', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForChartLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    const amounts = await analyticsPage.getCategoryAmounts();
    expect(amounts['Food & Dining']).toBe('₹12,500');
    expect(amounts['Fuel']).toBe('₹8,200');
    const percentages = await analyticsPage.getCategoryPercentages();
    expect(percentages['Food & Dining']).toBe('27.6%');
  });

  test('QE-9968 TS-002 TC-001 - Verify chart correctly displays spending for only 2 categories without rendering errors', async ({ page }) => {
    await loginPage.login('user2cats@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForChartLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const activeCategories = await analyticsPage.getActiveCategoryCount();
    expect(activeCategories).toBe(2);
    const amounts = await analyticsPage.getCategoryAmounts();
    expect(amounts['Food & Dining']).toBe('₹8,000');
    expect(amounts['Fuel']).toBe('₹5,000');
    const inactiveCategories = await analyticsPage.getInactiveCategoryCount();
    expect(inactiveCategories).toBe(7);
    await expect(analyticsPage.chartError).not.toBeVisible();
  });

  test('QE-9968 TS-003 TC-001 - Verify user can interact with chart to drill down into detailed transaction lists', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForChartLoad();
    await analyticsPage.clickCategorySegment('Food & Dining');
    await analyticsPage.waitForTransactionListLoad();
    await expect(analyticsPage.transactionList).toBeVisible();
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBe(45);
    const transactions = await analyticsPage.getAllTransactions();
    for (const txn of transactions) {
      await expect(txn.date).toBeVisible();
      await expect(txn.amount).toBeVisible();
      await expect(txn.merchant).toBeVisible();
    }
  });
});

test.describe('Monthly Spend Trend Analysis Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9967 TS-001 TC-001 - Verify interactive line chart displays 8 months of spending trends with hover functionality', async ({ page }) => {
    await loginPage.login('user8months@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendView();
    await analyticsPage.waitForTrendChartLoad();
    await expect(analyticsPage.trendChart).toBeVisible();
    const dataPoints = await analyticsPage.getTrendDataPointCount();
    expect(dataPoints).toBe(8);
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.tooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Jan 2024');
    expect(tooltipText).toContain('₹38,200');
  });

  test('QE-9967 TS-002 TC-001 - Verify informative message is displayed when user has insufficient transaction history', async ({ page }) => {
    await loginPage.login('user1month@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlyTrendView();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toContain('Insufficient data for trend analysis');
    expect(message).toContain('Minimum 3 months');
    await expect(analyticsPage.trendChart).not.toBeVisible();
  });

  test('QE-9967 TS-003 TC-001 - Verify line chart displays 12 months of spending trends with smooth rendering', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    const startTime = Date.now();
    await analyticsPage.selectMonthlyTrendView();
    await analyticsPage.waitForTrendChartLoad();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(5000);
    await expect(analyticsPage.trendChart).toBeVisible();
    const dataPoints = await analyticsPage.getTrendDataPointCount();
    expect(dataPoints).toBe(12);
    const monthlyValues = await analyticsPage.getMonthlySpendValues();
    expect(monthlyValues['Jan 2024']).toBe('₹38,200');
    expect(monthlyValues['Feb 2024']).toBe('₹41,500');
    expect(monthlyValues['Mar 2024']).toBe('₹45,230');
  });
});