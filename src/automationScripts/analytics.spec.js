const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Monthly Spend Trend Visualization Tests', () => {

  test('QE-9077 TS-001 TC-001 - Verify interactive line chart displays 12 months of monthly spend trends', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.user12Months.username, testData.users.user12Months.password);
    
    await analyticsPage.navigateToSpendingAnalytics();
    
    await expect(analyticsPage.monthlySpendTrendChart).toBeVisible();
    
    const chartMonths = await analyticsPage.getChartMonths();
    expect(chartMonths.length).toBe(12);
    expect(chartMonths).toContain('Jan');
    expect(chartMonths).toContain('Dec');
    
    await analyticsPage.hoverOverDataPoint('January');
    const januaryTooltip = await analyticsPage.getTooltipValue();
    expect(januaryTooltip).toContain('$2,100');
    
    await analyticsPage.hoverOverDataPoint('June');
    const juneTooltip = await analyticsPage.getTooltipValue();
    expect(juneTooltip).toContain('$2,800');
    
    await analyticsPage.hoverOverDataPoint('December');
    const decemberTooltip = await analyticsPage.getTooltipValue();
    expect(decemberTooltip).toContain('$3,200');
  });

  test('QE-9077 TS-002 TC-001 - Verify chart displays only 3 months of data with informational message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.user3Months.username, testData.users.user3Months.password);
    
    await analyticsPage.navigateToSpendingAnalytics();
    
    await expect(analyticsPage.monthlySpendTrendChart).toBeVisible();
    
    const chartMonths = await analyticsPage.getChartMonths();
    expect(chartMonths.length).toBe(3);
    
    await expect(analyticsPage.limitedDataMessage).toBeVisible();
    const messageText = await analyticsPage.getLimitedDataMessageText();
    expect(messageText).toContain('Limited historical data');
    expect(messageText).toContain('chart will display full 12-month trends as more data becomes available');
  });

  test('QE-9077 TS-003 TC-001 - Verify user can identify spending trend and drill down into specific month', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await analyticsPage.navigateToSpendingAnalytics();
    
    await expect(analyticsPage.monthlySpendTrendChart).toBeVisible();
    
    await analyticsPage.hoverOverDataPoint('January');
    const januaryValue = await analyticsPage.getTooltipValue();
    expect(januaryValue).toContain('$2,000');
    
    await analyticsPage.hoverOverDataPoint('June');
    const juneValue = await analyticsPage.getTooltipValue();
    expect(juneValue).toContain('$3,500');
    
    const increasePercentage = ((3500 - 2000) / 2000) * 100;
    expect(increasePercentage).toBe(75);
    
    await analyticsPage.clickDataPoint('June');
    
    await expect(analyticsPage.categoryBreakdownSection).toBeVisible();
    
    const categories = await analyticsPage.getCategoryBreakdownCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
  });
});
