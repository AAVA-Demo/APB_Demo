const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Analytics and Spending Insights Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
  });

  test('QE-8476 TS-001 TC-001 - Verify interactive chart displays spending across all nine categories', async ({ page }) => {
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getCategoryLabels();
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
  });

  test('QE-8471 TS-001 TC-001 - Verify drill-down to transaction details when clicking Food and Dining category', async ({ page }) => {
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.clickCategorySegment('Food & Dining');
    await analyticsPage.waitForDrillDownLoad();
    await expect(analyticsPage.drillDownView).toBeVisible();
    await expect(analyticsPage.categoryFilterOptions).toBeVisible();
  });

  test('QE-8471 TS-002 TC-001 - Verify message when interacting with category having zero transactions', async ({ page }) => {
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.clickCategorySegment('Healthcare');
    await expect(analyticsPage.noCategoryDataMessage).toBeVisible();
    await expect(analyticsPage.noCategoryDataMessage).toContainText('No transactions exist for the selected category');
  });

  test('QE-8472 TS-001 TC-001 - Verify interactive line chart displays month-over-month spending trends for 12 months', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('longhistory@example.com', 'Test@1234');
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartLoad();
    await expect(analyticsPage.trendChart).toBeVisible();
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBeGreaterThanOrEqual(12);
  });

  test('QE-8472 TS-003 TC-001 - Verify tooltip displays exact spending amount when hovering over month', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('longhistory@example.com', 'Test@1234');
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartLoad();
    await analyticsPage.hoverOverMonthDataPoint('March 2024');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
  });

  test('QE-8485 TS-001 TC-001 - Verify interactive chart displays spending across all nine categories within 3 seconds', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('multicategory@example.com', 'Test@1234');
    await analyticsPage.navigateToAnalytics();
    const startTime = Date.now();
    await analyticsPage.waitForAnalyticsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories.length).toBe(9);
  });
});
