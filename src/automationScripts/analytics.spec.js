const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Analytics and Spending Trends Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
  });

  test('QE-7935 TS-001 TC-001 - Verify monthly trends visualization displays 12 months with interactive line chart', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.lineChart).toBeVisible();
    
    const dataPointCount = await analyticsPage.getDataPointCount();
    expect(dataPointCount).toBe(12);
    
    await analyticsPage.verifyChartAxes();
    
    await analyticsPage.hoverOverDataPoint('March');
    await expect(analyticsPage.tooltip).toBeVisible();
    await expect(analyticsPage.tooltip).toContainText('March 2024');
    await expect(analyticsPage.tooltip).toContainText('$2,450.00');
    await expect(analyticsPage.tooltip).toContainText('23 transactions');
  });

  test('QE-7935 TS-001 TC-002 - Verify drill-down capability to view specific month details', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await analyticsPage.navigateToMonthlyTrends();
    
    await analyticsPage.clickDataPoint('June');
    
    await expect(analyticsPage.drillDownPanel).toBeVisible();
    
    const categories = await analyticsPage.getCategoryBreakdown();
    expect(categories).toHaveLength(9);
    
    const categoryNames = await analyticsPage.getCategoryNames();
    expect(categoryNames).toEqual(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
    
    const transactionCount = await analyticsPage.getMonthTransactionCount();
    expect(transactionCount).toBe(18);
    
    await analyticsPage.closeDrillDownPanel();
    await expect(analyticsPage.drillDownPanel).not.toBeVisible();
    await expect(analyticsPage.lineChart).toBeVisible();
  });

  test('QE-7935 TS-001 TC-003 - Verify interactive chart supports touch gestures on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile devices');
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(page).toHaveViewportSize({ width: 768, height: 1024 });
    
    await analyticsPage.performPinchZoom();
    
    await analyticsPage.performSwipeGesture();
    
    await analyticsPage.tapDataPoint('June');
    await expect(analyticsPage.drillDownPanel).toBeVisible();
  });

  test('QE-7935 TS-002 TC-001 - Verify system displays appropriate message with bar chart for 1 month data', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_1month', 'Pass@123');
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.notificationMessage).toContainText('Insufficient data for trend analysis');
    await expect(analyticsPage.notificationMessage).toContainText('At least 2 months of history required');
    
    await expect(analyticsPage.barChart).toBeVisible();
    await expect(analyticsPage.lineChart).not.toBeVisible();
    
    const barChartData = await analyticsPage.getBarChartData();
    expect(barChartData).toHaveLength(1);
    expect(barChartData[0].month).toBe('January 2025');
    expect(barChartData[0].amount).toBe(1200);
    
    await expect(page).not.toHaveURL(/.*error/);
  });

  test('QE-7935 TS-003 TC-001 - Verify seasonal spending increase detection and category drill-down', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_seasonal', 'Pass@123');
    await analyticsPage.navigateToMonthlyTrends();
    
    const novemberSpend = await analyticsPage.getDataPointValue('November');
    const decemberSpend = await analyticsPage.getDataPointValue('December');
    
    expect(novemberSpend).toBe(3000);
    expect(decemberSpend).toBe(4200);
    
    const increasePercentage = ((decemberSpend - novemberSpend) / novemberSpend) * 100;
    expect(increasePercentage).toBeCloseTo(40, 0);
    
    await analyticsPage.clickDataPoint('December');
    await expect(analyticsPage.drillDownPanel).toBeVisible();
    
    const shoppingAmount = await analyticsPage.getCategoryAmount('Shopping');
    const travelAmount = await analyticsPage.getCategoryAmount('Travel');
    
    expect(shoppingAmount).toBe(1800);
    expect(travelAmount).toBe(1200);
    
    await analyticsPage.clickDataPoint('November');
    const novShoppingAmount = await analyticsPage.getCategoryAmount('Shopping');
    expect(novShoppingAmount).toBe(800);
    
    expect(shoppingAmount).toBeGreaterThan(novShoppingAmount);
  });

  test('QE-7931 TS-001 TC-001 - Verify category-wise spending visualization displays pie chart with all 9 categories', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_7categories', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.pieChart).toBeVisible();
    
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(9);
    
    const categoryNames = await analyticsPage.getCategoryNames();
    expect(categoryNames).toEqual(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
    
    const categoryAmounts = await analyticsPage.getAllCategoryAmounts();
    expect(categoryAmounts).toEqual([850, 320, 1200, 600, 450, 280, 150, 0, 100]);
    
    const categoryPercentages = await analyticsPage.getAllCategoryPercentages();
    expect(categoryPercentages).toEqual([21.25, 8, 30, 15, 11.25, 7, 3.75, 0, 2.5]);
    
    const educationCategory = await analyticsPage.getCategoryData('Education');
    expect(educationCategory.amount).toBe(0);
    expect(educationCategory.percentage).toBe(0);
  });

  test('QE-7931 TS-002 TC-001 - Verify category-wise spending handles zero transactions gracefully', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_notransactions', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.selectTimePeriod('March 2025');
    
    await expect(analyticsPage.noDataMessage).toContainText('No transactions found for the selected period');
    
    await expect(analyticsPage.emptyChartPlaceholder).toBeVisible();
    
    await expect(page).not.toHaveURL(/.*error/);
    
    await expect(analyticsPage.timePeriodSelector).toBeEnabled();
  });

  test('QE-7931 TS-003 TC-001 - Verify data integrity - sum of categories equals total spend and percentages add to 100%', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_5ktotal', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    const categoryAmounts = await analyticsPage.getAllCategoryAmounts();
    expect(categoryAmounts).toEqual([1200, 600, 1500, 800, 400, 300, 150, 50, 0]);
    
    const totalSum = categoryAmounts.reduce((sum, amount) => sum + amount, 0);
    expect(totalSum).toBe(5000);
    
    const categoryPercentages = await analyticsPage.getAllCategoryPercentages();
    expect(categoryPercentages).toEqual([24, 12, 30, 16, 8, 6, 3, 1, 0]);
    
    const percentageSum = categoryPercentages.reduce((sum, pct) => sum + pct, 0);
    expect(percentageSum).toBe(100);
    
    for (let i = 0; i < categoryAmounts.length; i++) {
      const calculatedPercentage = (categoryAmounts[i] / totalSum) * 100;
      expect(categoryPercentages[i]).toBeCloseTo(calculatedPercentage, 0);
    }
  });
});