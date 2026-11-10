const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Spending Analytics and Visualization Tests', () => {

  test('QE-10615 TS-001 TC-001: Verify category-wise spending breakdown displays accurate amounts and percentages across all nine predefined categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_multicategory', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categoryBreakdownSection).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories.length).toBe(9);
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });
    const categoryData = await analyticsPage.getCategoryBreakdownData();
    categoryData.forEach(data => {
      expect(data.amount).toBeGreaterThanOrEqual(0);
      expect(data.percentage).toBeGreaterThanOrEqual(0);
      expect(data.percentage).toBeLessThanOrEqual(100);
    });
    const totalPercentage = categoryData.reduce((sum, data) => sum + data.percentage, 0);
    expect(Math.abs(totalPercentage - 100)).toBeLessThan(0.1);
  });

  test('QE-10615 TS-002 TC-001: Verify system displays appropriate message when user has no transactions in the selected period', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_notransactions', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const messageText = await analyticsPage.getNoDataMessageText();
    expect(messageText).toContain('No spending data available for the selected period');
    const categoryData = await analyticsPage.getCategoryBreakdownData();
    categoryData.forEach(data => {
      expect(data.amount).toBe(0);
    });
  });

  test('QE-10615 TS-003 TC-001: Verify spending breakdown displays amounts for active categories and zero/no data for inactive categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_partialcategory', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categoryBreakdownSection).toBeVisible();
    const categoryData = await analyticsPage.getCategoryBreakdownData();
    const activeCategories = categoryData.filter(data => data.amount > 0);
    const inactiveCategories = categoryData.filter(data => data.amount === 0);
    expect(activeCategories.length).toBe(3);
    expect(inactiveCategories.length).toBe(6);
    activeCategories.forEach(data => {
      expect(data.amount).toBeGreaterThan(0);
      expect(data.percentage).toBeGreaterThan(0);
    });
    inactiveCategories.forEach(data => {
      expect(data.amount).toBe(0);
      expect(data.percentage).toBe(0);
    });
    const totalPercentage = activeCategories.reduce((sum, data) => sum + data.percentage, 0);
    expect(Math.abs(totalPercentage - 100)).toBeLessThan(0.1);
  });

  test('QE-10608 TS-001 TC-001: Verify interactive trend chart renders within 1.5 seconds displaying spending patterns for selected category and date range', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategory('Food & Dining');
    await analyticsPage.setDateRange('2023-01-01', '2023-12-31');
    const startTime = Date.now();
    await analyticsPage.clickApplyFilters();
    await analyticsPage.waitForTrendChartToRender();
    const endTime = Date.now();
    const renderTime = (endTime - startTime) / 1000;
    expect(renderTime).toBeLessThanOrEqual(1.5);
    await expect(analyticsPage.trendChart).toBeVisible();
    const trendData = await analyticsPage.getTrendChartData();
    expect(trendData.length).toBeGreaterThan(0);
    trendData.forEach(data => {
      expect(data.period).toMatch(/2023/);
      expect(data.totalSpend).toBeGreaterThanOrEqual(0);
    });
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBe(true);
  });

  test('QE-10608 TS-002 TC-001: Verify system displays appropriate message when user has insufficient transaction history (less than 12 months)', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_newuser', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategory('Shopping');
    await analyticsPage.setDateRangeToLast12Months();
    await analyticsPage.clickApplyFilters();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient historical data');
    expect(messageText).toContain('meaningful trend analysis');
    const isChartVisible = await analyticsPage.trendChart.isVisible().catch(() => false);
    expect(isChartVisible).toBe(false);
  });

  test('QE-10608 TS-003 TC-001: Verify system rejects invalid date range (end date before start date) with validation error message', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategory('Travel');
    await analyticsPage.setDateRange('2023-12-31', '2023-01-01');
    await analyticsPage.clickApplyFilters();
    await expect(analyticsPage.validationError).toBeVisible();
    const errorText = await analyticsPage.getValidationErrorText();
    expect(errorText).toContain('Invalid date range');
    expect(errorText).toContain('End date must be after start date');
    const isChartVisible = await analyticsPage.trendChart.isVisible().catch(() => false);
    expect(isChartVisible).toBe(false);
  });

});