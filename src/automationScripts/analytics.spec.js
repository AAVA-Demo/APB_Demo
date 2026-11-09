const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Analytics - Category-Wise Spending Visualization', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await analyticsPage.navigateToAnalytics();
  });

  test('TC-021: Verify category-wise spending chart is displayed', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    expect(await analyticsPage.isCategoryChartVisible()).toBe(true);
  });

  test('TC-022: Verify all 9 spending categories are present', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    const categories = await analyticsPage.getAllCategories();
    
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });
  });

  test('TC-023: Verify category spending amounts are displayed', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    const categoryData = await analyticsPage.getCategorySpendingData();
    
    expect(categoryData.length).toBeGreaterThan(0);
    categoryData.forEach(data => {
      expect(data.category).toBeTruthy();
      expect(data.amount).toBeTruthy();
      expect(data.percentage).toBeTruthy();
    });
  });

  test('TC-024: Verify interactive chart allows drill-down', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.clickCategorySegment('Food & Dining');
    
    expect(await analyticsPage.isCategoryDetailVisible()).toBe(true);
  });

  test('TC-025: Verify tooltip displays on category hover', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.hoverOverCategory('Travel');
    
    expect(await analyticsPage.isTooltipVisible()).toBe(true);
    const tooltipContent = await analyticsPage.getTooltipContent();
    expect(tooltipContent).toContain('Travel');
  });

  test('TC-026: Verify empty state when no spending data available', async ({ page }) => {
    // Login with user having no transactions
    await loginPage.navigate();
    await loginPage.login(testData.users.noTransactionsUser.username, testData.users.noTransactionsUser.password);
    await analyticsPage.navigateToAnalytics();
    
    expect(await analyticsPage.isEmptyStateVisible()).toBe(true);
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available');
  });
});

test.describe('Analytics - Monthly Spend Trend Analysis', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await analyticsPage.navigateToAnalytics();
  });

  test('TC-027: Verify monthly trend chart is displayed', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.navigateToTrendAnalysis();
    
    expect(await analyticsPage.isTrendChartVisible()).toBe(true);
  });

  test('TC-028: Verify trend chart displays multiple months of data', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.navigateToTrendAnalysis();
    
    const monthsDisplayed = await analyticsPage.getTrendChartMonthCount();
    expect(monthsDisplayed).toBeGreaterThanOrEqual(3);
  });

  test('TC-029: Verify hovering over data point shows details', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.navigateToTrendAnalysis();
    await analyticsPage.hoverOverTrendDataPoint(0);
    
    expect(await analyticsPage.isTooltipVisible()).toBe(true);
  });

  test('TC-030: Verify clicking data point shows drill-down view', async ({ page }) => {
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.navigateToTrendAnalysis();
    await analyticsPage.clickTrendDataPoint(0);
    
    expect(await analyticsPage.isDrillDownViewVisible()).toBe(true);
  });

  test('TC-031: Verify insufficient data warning for less than 3 months', async ({ page }) => {
    // Login with user having limited transaction history
    await loginPage.navigate();
    await loginPage.login(testData.users.limitedHistoryUser.username, testData.users.limitedHistoryUser.password);
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    expect(await analyticsPage.isInsufficientDataWarningVisible()).toBe(true);
  });
});
