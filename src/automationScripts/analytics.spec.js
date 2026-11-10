const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Analytics and Spending Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9957 TS-001 TC-001: Verify category-wise spending breakdown displays all categories', async ({ page }) => {
    await loginPage.login(testData.users.multiCategory.username, testData.users.multiCategory.password);
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.categorySpendingSection).toBeVisible();
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    await expect(analyticsPage.categoryTable).toBeVisible();
    
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    for (const category of categories) {
      await expect(analyticsPage.getCategoryRow(category)).toBeVisible();
    }
    
    const expectedAmounts = {
      'Food & Dining': '$500',
      'Fuel': '$200',
      'Shopping': '$800',
      'Travel': '$300',
      'Entertainment': '$150',
      'Utilities': '$100',
      'Healthcare': '$50',
      'Education': '$75',
      'Miscellaneous': '$25'
    };
    
    for (const [category, amount] of Object.entries(expectedAmounts)) {
      const actualAmount = await analyticsPage.getCategoryAmount(category);
      expect(actualAmount).toContain(amount);
    }
    
    const percentages = await analyticsPage.getAllCategoryPercentages();
    const totalPercentage = percentages.reduce((sum, p) => sum + parseFloat(p), 0);
    expect(totalPercentage).toBeCloseTo(100, 0.1);
  });

  test('QE-9957 TS-002 TC-001: Verify unmapped categories are categorized as Miscellaneous', async ({ page }) => {
    await loginPage.login(testData.users.unmappedCat.username, testData.users.unmappedCat.password);
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.categorySpendingSection).toBeVisible();
    
    const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscAmount).toContain('$300');
    
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toContain('$1,500');
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(2000);
    expect(consoleErrors).toHaveLength(0);
    
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    await expect(analyticsPage.categoryTable).toBeVisible();
  });

  test('QE-9957 TS-003 TC-001: Verify date range filter updates category-wise analysis', async ({ page }) => {
    await loginPage.login(testData.users.dateFilter.username, testData.users.dateFilter.password);
    await analyticsPage.navigateToAnalytics();
    
    const initialFoodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(initialFoodAmount).toContain('$1,200');
    
    const initialPercentage = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(initialPercentage).toContain('30');
    
    await analyticsPage.setDateRange('2023-01-01', '2023-06-30');
    await analyticsPage.applyDateFilter();
    
    await page.waitForTimeout(2000);
    
    const updatedFoodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(updatedFoodAmount).toContain('$600');
    
    const updatedPercentage = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(updatedPercentage).toContain('35');
    
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toContain('$1,714');
  });

  test('QE-9954 TS-001 TC-001: Verify monthly spend trends displays 12 months of data', async ({ page }) => {
    await loginPage.login(testData.users.yearlyData.username, testData.users.yearlyData.password);
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.monthlyTrendsSection).toBeVisible();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    const startTime = Date.now();
    await analyticsPage.monthlyTrendsChart.waitFor({ state: 'visible' });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    const dataPoints = await analyticsPage.getChartDataPointCount();
    expect(dataPoints).toBe(12);
    
    const xAxisLabels = await analyticsPage.getChartXAxisLabels();
    expect(xAxisLabels).toHaveLength(12);
    expect(xAxisLabels[0]).toMatch(/2023-01/);
    expect(xAxisLabels[11]).toMatch(/2023-12/);
    
    for (let i = 0; i < xAxisLabels.length - 1; i++) {
      expect(xAxisLabels[i] < xAxisLabels[i + 1]).toBe(true);
    }
    
    await analyticsPage.hoverOverDataPoint(5);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.chartTooltip.textContent();
    expect(tooltipText).toMatch(/2023-06.*\$[0-9,]+\.[0-9]{2}/);
  });

  test('QE-9954 TS-002 TC-001: Verify chart renders correctly with only 2 data points', async ({ page }) => {
    await loginPage.login(testData.users.twoMonths.username, testData.users.twoMonths.password);
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    const dataPoints = await analyticsPage.getChartDataPointCount();
    expect(dataPoints).toBe(2);
    
    const xAxisLabels = await analyticsPage.getChartXAxisLabels();
    expect(xAxisLabels).toHaveLength(2);
    expect(xAxisLabels[0]).toMatch(/2023-11/);
    expect(xAxisLabels[1]).toMatch(/2023-12/);
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(2000);
    expect(consoleErrors).toHaveLength(0);
    
    await expect(analyticsPage.chartXAxis).toBeVisible();
    await expect(analyticsPage.chartYAxis).toBeVisible();
    await expect(analyticsPage.chartLegend).toBeVisible();
  });

  test('QE-9954 TS-003 TC-001: Verify custom date range filter updates monthly trends', async ({ page }) => {
    await loginPage.login(testData.users.rangeFilter.username, testData.users.rangeFilter.password);
    await analyticsPage.navigateToAnalytics();
    
    let dataPoints = await analyticsPage.getChartDataPointCount();
    expect(dataPoints).toBe(12);
    
    let xAxisLabels = await analyticsPage.getChartXAxisLabels();
    expect(xAxisLabels[0]).toMatch(/2023-01/);
    expect(xAxisLabels[11]).toMatch(/2023-12/);
    
    await analyticsPage.setDateRange('2023-01-01', '2023-06-30');
    await analyticsPage.applyDateFilter();
    
    await page.waitForTimeout(2000);
    
    dataPoints = await analyticsPage.getChartDataPointCount();
    expect(dataPoints).toBe(6);
    
    xAxisLabels = await analyticsPage.getChartXAxisLabels();
    expect(xAxisLabels).toHaveLength(6);
    expect(xAxisLabels[0]).toMatch(/2023-01/);
    expect(xAxisLabels[5]).toMatch(/2023-06/);
    
    for (const label of xAxisLabels) {
      const month = parseInt(label.split('-')[1]);
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(6);
    }
  });
});