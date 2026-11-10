const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Analytics - Category Breakdown and Trend Charts Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.authenticate('user123', 'valid-token');
  });

  test('QE-9879 TS-001 TC-001: Verify category breakdown displays accurate totals for all 9 categories', async () => {
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoryTotals = await analyticsPage.getAllCategoryTotals();
    
    expect(categoryTotals['Food & Dining']).toBe(12000);
    expect(categoryTotals['Fuel']).toBe(8000);
    expect(categoryTotals['Shopping']).toBe(25000);
    expect(categoryTotals['Travel']).toBe(18000);
    expect(categoryTotals['Entertainment']).toBe(9000);
    expect(categoryTotals['Utilities']).toBe(5000);
    expect(categoryTotals['Healthcare']).toBe(7000);
    expect(categoryTotals['Education']).toBe(4000);
    expect(categoryTotals['Miscellaneous']).toBe(6000);
    
    const totalSpending = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    expect(totalSpending).toBe(94000);
  });

  test('QE-9879 TS-001 TC-002: Verify category percentages are calculated correctly relative to total spending', async () => {
    await analyticsPage.authenticate('user456', 'valid-token');
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoryPercentages = await analyticsPage.getAllCategoryPercentages();
    
    expect(categoryPercentages['Food & Dining']).toBeCloseTo(12.77, 1);
    expect(categoryPercentages['Fuel']).toBeCloseTo(8.51, 1);
    expect(categoryPercentages['Shopping']).toBeCloseTo(26.60, 1);
    expect(categoryPercentages['Travel']).toBeCloseTo(19.15, 1);
    expect(categoryPercentages['Entertainment']).toBeCloseTo(9.57, 1);
    expect(categoryPercentages['Utilities']).toBeCloseTo(5.32, 1);
    expect(categoryPercentages['Healthcare']).toBeCloseTo(7.45, 1);
    expect(categoryPercentages['Education']).toBeCloseTo(4.26, 1);
    expect(categoryPercentages['Miscellaneous']).toBeCloseTo(6.38, 1);
    
    const totalPercentage = Object.values(categoryPercentages).reduce((sum, val) => sum + val, 0);
    expect(totalPercentage).toBeCloseTo(100, 0);
  });

  test('QE-9879 TS-001 TC-003: Verify category breakdown handles transactions with varying amounts correctly', async () => {
    await analyticsPage.authenticate('user789', 'valid-token');
    await analyticsPage.waitForAnalyticsLoad();
    
    const foodDiningTotal = await analyticsPage.getCategoryTotal('Food & Dining');
    expect(foodDiningTotal).toBe(12000);
    
    const categoryTotals = await analyticsPage.getAllCategoryTotals();
    const allCategoriesPresent = Object.keys(categoryTotals).length === 9;
    expect(allCategoriesPresent).toBe(true);
  });

  test('QE-9879 TS-002 TC-001: Verify empty category breakdown displays zero amounts for all categories when no transactions exist', async () => {
    await analyticsPage.authenticate('user111', 'valid-token');
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoryTotals = await analyticsPage.getAllCategoryTotals();
    const allZero = Object.values(categoryTotals).every(val => val === 0);
    expect(allZero).toBe(true);
    
    const noDataMessage = await analyticsPage.getNoDataMessage();
    expect(noDataMessage).toContain('No transaction data available');
  });

  test('QE-9879 TS-002 TC-002: Verify system handles newly registered user with no transaction history gracefully', async () => {
    await analyticsPage.authenticate('user222', 'valid-token');
    await analyticsPage.waitForAnalyticsLoad();
    
    const welcomeMessage = await analyticsPage.getWelcomeMessage();
    expect(welcomeMessage).toContain('Welcome! Your spending analytics will appear here');
  });

  test('QE-9879 TS-003 TC-001: Verify category breakdown displays amounts for 3 active categories and zero for remaining 6', async () => {
    await analyticsPage.authenticate('user333', 'valid-token');
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoryTotals = await analyticsPage.getAllCategoryTotals();
    
    expect(categoryTotals['Food & Dining']).toBe(15000);
    expect(categoryTotals['Fuel']).toBe(6000);
    expect(categoryTotals['Shopping']).toBe(22000);
    
    expect(categoryTotals['Travel']).toBe(0);
    expect(categoryTotals['Entertainment']).toBe(0);
    expect(categoryTotals['Utilities']).toBe(0);
    expect(categoryTotals['Healthcare']).toBe(0);
    expect(categoryTotals['Education']).toBe(0);
    expect(categoryTotals['Miscellaneous']).toBe(0);
  });

  test('QE-9879 TS-003 TC-002: Verify total spending calculation includes only active categories', async () => {
    await analyticsPage.authenticate('user444', 'valid-token');
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoryTotals = await analyticsPage.getAllCategoryTotals();
    const totalSpending = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    expect(totalSpending).toBe(43000);
    expect(categoryTotals['Food & Dining']).toBe(15000);
    expect(categoryTotals['Fuel']).toBe(6000);
    expect(categoryTotals['Shopping']).toBe(22000);
  });

  test('QE-9879 TS-003 TC-003: Verify category percentages are calculated correctly when only 3 categories have data', async () => {
    await analyticsPage.authenticate('user555', 'valid-token');
    await analyticsPage.waitForAnalyticsLoad();
    
    const categoryPercentages = await analyticsPage.getAllCategoryPercentages();
    
    expect(categoryPercentages['Food & Dining']).toBeCloseTo(34.88, 1);
    expect(categoryPercentages['Fuel']).toBeCloseTo(13.95, 1);
    expect(categoryPercentages['Shopping']).toBeCloseTo(51.16, 1);
    
    const activePercentages = categoryPercentages['Food & Dining'] + categoryPercentages['Fuel'] + categoryPercentages['Shopping'];
    expect(activePercentages).toBeCloseTo(100, 0);
  });

  test('QE-9884 TS-001 TC-001: Verify trend chart displays 6 months of spending data with all data points within 3 seconds', async () => {
    const startTime = Date.now();
    await analyticsPage.waitForTrendChartLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(3000);
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBe(6);
    
    expect(monthlyData[0].month).toBe('2024-01');
    expect(monthlyData[0].amount).toBe(25000);
    expect(monthlyData[1].amount).toBe(30000);
    expect(monthlyData[2].amount).toBe(28000);
    expect(monthlyData[3].amount).toBe(32000);
    expect(monthlyData[4].amount).toBe(27000);
    expect(monthlyData[5].amount).toBe(29000);
  });

  test('QE-9884 TS-001 TC-002: Verify trend chart calculates accurate monthly totals across all transaction categories', async () => {
    await analyticsPage.authenticate('user456', 'valid-token');
    await analyticsPage.waitForTrendChartLoad();
    
    const januaryTotal = await analyticsPage.getMonthTotal('2024-01');
    expect(januaryTotal).toBe(25000);
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    const expectedTotals = [25000, 30000, 28000, 32000, 27000, 29000];
    
    monthlyData.forEach((data, index) => {
      expect(data.amount).toBe(expectedTotals[index]);
    });
  });

  test('QE-9884 TS-001 TC-003: Verify trend chart handles multiple credit cards and aggregates spending correctly', async () => {
    await analyticsPage.authenticate('user789', 'valid-token');
    await analyticsPage.waitForTrendChartLoad();
    
    const januaryTotal = await analyticsPage.getMonthTotal('2024-01');
    expect(januaryTotal).toBe(25000);
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBe(6);
  });

  test('QE-9884 TS-002 TC-001: Verify trend chart displays single data point when only current month data exists', async () => {
    await analyticsPage.authenticate('user111', 'valid-token');
    await analyticsPage.waitForTrendChartLoad();
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBe(1);
    expect(monthlyData[0].month).toBe('2024-06');
    expect(monthlyData[0].amount).toBe(12000);
    
    const insufficientDataMessage = await analyticsPage.getInsufficientDataMessage();
    expect(insufficientDataMessage).toContain('Insufficient data for trend analysis');
  });

  test('QE-9884 TS-002 TC-002: Verify system handles zero transaction history gracefully', async () => {
    await analyticsPage.authenticate('user222', 'valid-token');
    await analyticsPage.waitForTrendChartLoad();
    
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    expect(monthlyData.length).toBe(0);
    
    const noDataMessage = await analyticsPage.getNoTransactionDataMessage();
    expect(noDataMessage).toContain('No transaction data available');
  });

  test('QE-9884 TS-003 TC-001: Verify interactive filter correctly filters 12-month data to last 3 months within 3 seconds', async () => {
    await analyticsPage.authenticate('user333', 'valid-token');
    await analyticsPage.waitForTrendChartLoad();
    
    const initialData = await analyticsPage.getMonthlyTrendData();
    expect(initialData.length).toBe(12);
    
    const startTime = Date.now();
    await analyticsPage.applyDateFilter('2024-04-01', '2024-06-30');
    await analyticsPage.waitForTrendChartLoad();
    const filterTime = Date.now() - startTime;
    
    expect(filterTime).toBeLessThanOrEqual(3000);
    
    const filteredData = await analyticsPage.getMonthlyTrendData();
    expect(filteredData.length).toBe(3);
    expect(filteredData[0].month).toBe('2024-04');
    expect(filteredData[1].month).toBe('2024-05');
    expect(filteredData[2].month).toBe('2024-06');
  });

  test('QE-9884 TS-003 TC-002: Verify filter correctly handles date range boundaries and excludes out-of-range data', async () => {
    await analyticsPage.authenticate('user444', 'valid-token');
    await analyticsPage.waitForTrendChartLoad();
    
    await analyticsPage.applyDateFilter('2024-04-01', '2024-06-30');
    await analyticsPage.waitForTrendChartLoad();
    
    const filteredData = await analyticsPage.getMonthlyTrendData();
    const months = filteredData.map(d => d.month);
    
    expect(months).not.toContain('2024-03');
    expect(months).not.toContain('2024-07');
    expect(months).toContain('2024-04');
    expect(months).toContain('2024-05');
    expect(months).toContain('2024-06');
  });

  test('QE-9884 TS-003 TC-003: Verify filter can be cleared to restore full 12-month view', async () => {
    await analyticsPage.authenticate('user555', 'valid-token');
    await analyticsPage.waitForTrendChartLoad();
    
    await analyticsPage.applyDateFilter('2024-04-01', '2024-06-30');
    await analyticsPage.waitForTrendChartLoad();
    
    let filteredData = await analyticsPage.getMonthlyTrendData();
    expect(filteredData.length).toBe(3);
    
    await analyticsPage.clearDateFilter();
    await analyticsPage.waitForTrendChartLoad();
    
    const fullData = await analyticsPage.getMonthlyTrendData();
    expect(fullData.length).toBe(12);
  });
});