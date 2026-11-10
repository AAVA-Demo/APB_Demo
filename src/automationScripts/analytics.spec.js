const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Category-Wise Spending Visualization - QE-10302', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('TC-7433: Verify user with transactions across all nine categories can view accurate spending amounts and percentages', async ({ page }) => {
    await loginPage.login('testuserallcategories', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
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
    const categoryData = await analyticsPage.getCategoryData('Food & Dining');
    expect(parseFloat(categoryData.amount.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(categoryData.percentage.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
  });

  test('TC-7434: Verify category-wise spending visualization is interactive and allows user exploration', async ({ page }) => {
    await loginPage.login('testuserallcategories', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    const tooltipText = await analyticsPage.categoryTooltip.textContent();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toMatch(/₹[0-9,]+/);
  });

  test('TC-7435: Verify user with transactions in only one category sees 100% spending in that category', async ({ page }) => {
    await loginPage.login('testuseronecategory', 'Pass@123');
    await analyticsPage.navigate();
    const categoryData = await analyticsPage.getCategoryData('Food & Dining');
    expect(categoryData.percentage).toContain('100');
    const fuelData = await analyticsPage.getCategoryData('Fuel');
    expect(fuelData.amount).toContain('₹0');
    expect(fuelData.percentage).toContain('0');
  });

  test('TC-7436: Verify system correctly handles single-category spending without misleading visualizations', async ({ page }) => {
    await loginPage.login('testuseronecategory', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
    expect(categories).toHaveLength(9);
    const categoryData = await analyticsPage.getCategoryData('Food & Dining');
    expect(categoryData.percentage).toContain('100');
  });

  test('TC-7437: Verify system displays error message or places uncategorized transactions into Miscellaneous when categorization service fails', async ({ page }) => {
    await page.route('**/analytics/spending', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load analytics data');
  });

  test('TC-7438: Verify system handles categorization service failure gracefully without data loss', async ({ page }) => {
    await page.route('**/analytics/spending', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    await analyticsPage.navigateToDashboard();
    await expect(page).toHaveURL(/dashboard/);
  });
});

test.describe('Monthly Spend Trends Analysis - QE-10303', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('TC-7427: Verify user with six months of transaction history can view accurate monthly spending trends', async ({ page }) => {
    await loginPage.login('testuser6months', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.trendChart).toBeVisible();
    const trendData = await analyticsPage.getTrendData();
    expect(trendData).toHaveLength(6);
    expect(trendData[0].month).toBe('2024-01');
    expect(trendData[5].month).toBe('2024-06');
    await analyticsPage.hoverOverTrendDataPoint(2);
    await expect(analyticsPage.trendTooltip).toBeVisible();
  });

  test('TC-7428: Verify monthly spending trends chart is interactive and allows drill-down into specific time periods', async ({ page }) => {
    await loginPage.login('testuser6months', 'Pass@123');
    await analyticsPage.navigate();
    await analyticsPage.clickOnTrendDataPoint(2);
    await expect(page).toHaveURL(/2024-03/);
  });

  test('TC-7429: Verify user with only one month of transaction history sees single data point or appropriate message', async ({ page }) => {
    await loginPage.login('testuser1month', 'Pass@123');
    await analyticsPage.navigate();
    const trendData = await analyticsPage.getTrendData();
    expect(trendData).toHaveLength(1);
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('Insufficient data for trend analysis');
  });

  test('TC-7430: Verify system does not display misleading visualizations when only one month of data available', async ({ page }) => {
    await loginPage.login('testuser1month', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.trendChart).toBeVisible();
    const trendData = await analyticsPage.getTrendData();
    expect(trendData).toHaveLength(1);
    const chartType = await analyticsPage.getChartType();
    expect(chartType).not.toBe('line');
  });

  test('TC-7431: Verify system displays error message when analytics engine fails to aggregate monthly data', async ({ page }) => {
    await page.route('**/analytics/trends', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load analytics data');
  });

  test('TC-7432: Verify system handles analytics engine failure gracefully without exposing technical errors', async ({ page }) => {
    await page.route('**/analytics/trends', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigate();
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.errorMessage.textContent();
    expect(errorText).not.toContain('stack trace');
    expect(errorText).not.toContain('500');
    await analyticsPage.navigateToDashboard();
    await expect(page).toHaveURL(/dashboard/);
  });
});