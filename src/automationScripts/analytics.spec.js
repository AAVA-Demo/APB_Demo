const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Spending Analytics and Insights Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-8905 TS-001 TC-001: Verify monthly spend trends chart displays accurate data for last 12 months', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlySpendTrends();
    
    const chartData = await analyticsPage.getMonthlyTrendsChartData();
    expect(chartData.length).toBe(12);
    
    const months = await analyticsPage.getMonthLabels();
    expect(months.length).toBe(12);
    
    for (const month of months) {
      expect(month).toMatch(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/);
    }
    
    const isChartInteractive = await analyticsPage.isChartInteractive();
    expect(isChartInteractive).toBe(true);
  });

  test('QE-8905 TS-002 TC-001: Verify system handles missing or incomplete transaction data without breaking chart', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlySpendTrends();
    
    const chartData = await analyticsPage.getMonthlyTrendsChartData();
    
    const hasZeroValues = chartData.some(data => data.amount === 0 || data.amount === null);
    expect(hasZeroValues).toBe(true);
    
    const isChartRendered = await analyticsPage.isChartVisible();
    expect(isChartRendered).toBe(true);
    
    const trendLine = await analyticsPage.getTrendLine();
    expect(trendLine).toBeDefined();
  });

  test('QE-8905 TS-003 TC-001: Verify system displays error message when analytics engine fails', async ({ page }) => {
    await page.route('**/api/transactions*', route => route.abort());
    
    await loginPage.login('testuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlySpendTrends();
    
    const errorMessage = await analyticsPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load analytics data. Please try again.');
    
    const hasRetryButton = await analyticsPage.hasRetryButton();
    expect(hasRetryButton).toBe(true);
  });

  test('QE-8902 TS-001 TC-001: Verify category-wise spending breakdown displays accurate distribution', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseSpending();
    
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    expect(categories.length).toBe(9);
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
    
    const categoryData = await analyticsPage.getCategoryWiseData();
    for (const data of categoryData) {
      expect(data.amount).toBeDefined();
      expect(data.percentage).toBeDefined();
    }
    
    const totalPercentage = categoryData.reduce((sum, data) => sum + parseFloat(data.percentage), 0);
    expect(Math.round(totalPercentage)).toBe(100);
    
    const isChartInteractive = await analyticsPage.isChartInteractive();
    expect(isChartInteractive).toBe(true);
  });

  test('QE-8902 TS-002 TC-001: Verify system categorizes invalid transactions under Miscellaneous', async ({ page }) => {
    await loginPage.login('invalidcategoryuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseSpending();
    
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(parseFloat(miscellaneousAmount.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    
    const totalSpending = await analyticsPage.getTotalSpending();
    const chartTotal = await analyticsPage.getChartTotalSpending();
    
    expect(totalSpending).toBe(chartTotal);
    
    const isChartRendered = await analyticsPage.isChartVisible();
    expect(isChartRendered).toBe(true);
  });

  test('QE-8902 TS-003 TC-001: Verify system displays empty chart with message when no transactions exist', async ({ page }) => {
    await loginPage.login('notransactionuser@demo.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseSpending();
    
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available for the selected period');
    
    const isChartContainerVisible = await analyticsPage.isChartContainerVisible();
    expect(isChartContainerVisible).toBe(true);
  });
});
