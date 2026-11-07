const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Spending Analytics and Insights', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'ValidPass123');
    await analyticsPage.navigate();
  });

  test('TC-PerfTest6-013: Verify interactive pie chart for category-wise spending with 9 categories', async ({ page }) => {
    await analyticsPage.waitForPageLoad();
    await analyticsPage.waitForCategoryChartLoad();
    const categories = await analyticsPage.getCategoryList();
    expect(categories).toHaveLength(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    const isPieChartVisible = await analyticsPage.isPieChartVisible();
    expect(isPieChartVisible).toBeTruthy();
    await analyticsPage.hoverOverCategorySlice('Travel');
    const tooltipValue = await analyticsPage.getTooltipValue();
    expect(tooltipValue).toBeTruthy();
  });

  test('TC-PerfTest6-014: Verify category visualization for single-category spending', async ({ page }) => {
    const mockData = { 'Food & Dining': 1500, 'Fuel': 0, 'Shopping': 0, 'Travel': 0, 'Entertainment': 0, 'Utilities': 0, 'Healthcare': 0, 'Education': 0, 'Miscellaneous': 0 };
    await page.route('**/api/transactions', route => route.fulfill({ status: 200, body: JSON.stringify([{ category: 'Food & Dining', amount: 1500, date: '2024-06-01', merchant: 'Restaurant' }]) }));
    await page.reload();
    await analyticsPage.waitForPageLoad();
    await analyticsPage.waitForCategoryChartLoad();
    const isPieChartVisible = await analyticsPage.isPieChartVisible();
    expect(isPieChartVisible).toBeTruthy();
    const categoryValue = await analyticsPage.getCategoryValue('Food & Dining');
    expect(categoryValue).toContain('100%');
    const legendVisible = await analyticsPage.isCategoryLegendVisible();
    expect(legendVisible).toBeTruthy();
  });

  test('TC-PerfTest6-015: Verify empty state for analytics with no transactions', async ({ page }) => {
    await page.route('**/api/transactions', route => route.fulfill({ status: 200, body: JSON.stringify([]) }));
    await page.reload();
    await analyticsPage.waitForPageLoad();
    const emptyStateMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('No spending data available');
  });

  test('TC-PerfTest6-016: Verify interactive 12-month spend trend line chart', async ({ page }) => {
    await analyticsPage.waitForPageLoad();
    await analyticsPage.waitForTrendChartLoad();
    const isLineChartVisible = await analyticsPage.isLineChartVisible();
    expect(isLineChartVisible).toBeTruthy();
    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(1);
    expect(dataPoints.length).toBeLessThanOrEqual(12);
    await analyticsPage.hoverOverDataPoint('August 2024');
    const tooltipValue = await analyticsPage.getTooltipValue();
    expect(tooltipValue).toBeTruthy();
  });

  test('TC-PerfTest6-017: Verify card-wise comparison in trend analysis', async ({ page }) => {
    await analyticsPage.waitForPageLoad();
    await analyticsPage.toggleCardWiseComparison();
    await analyticsPage.waitForTrendChartLoad();
    const isLineChartVisible = await analyticsPage.isLineChartVisible();
    expect(isLineChartVisible).toBeTruthy();
    const trendLines = await analyticsPage.getTrendLineCount();
    expect(trendLines).toBeGreaterThan(1);
    await analyticsPage.hoverOverDataPoint('June 2024');
    const tooltipValue = await analyticsPage.getTooltipValue();
    expect(tooltipValue).toBeTruthy();
  });

  test('TC-PerfTest6-018: Verify trend analysis with limited data (1-2 months)', async ({ page }) => {
    const mockData = [{ month: '2024-05', amount: 1200 }, { month: '2024-06', amount: 1350 }];
    await page.route('**/api/transactions', route => route.fulfill({ status: 200, body: JSON.stringify([{ date: '2024-05-15', amount: 1200, category: 'Shopping', merchant: 'Store' }, { date: '2024-06-10', amount: 1350, category: 'Food & Dining', merchant: 'Restaurant' }]) }));
    await page.reload();
    await analyticsPage.waitForPageLoad();
    await analyticsPage.waitForTrendChartLoad();
    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBe(2);
    const infoMessage = await analyticsPage.getInformationalMessage();
    expect(infoMessage).toContain('Limited data available');
  });
});