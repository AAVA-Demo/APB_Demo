const { test, expect } = require('@playwright/test');
const { TrendAnalysisPage } = require('./pages/trendAnalysis.page');
const { AuthHelper } = require('./helpers/auth.helper');
const { Logger } = require('./utils/logger');

test.describe('Trend Analysis - Monthly Spending Trends', () => {
  let trendAnalysisPage;
  let authHelper;
  let logger;

  test.beforeEach(async ({ page }) => {
    trendAnalysisPage = new TrendAnalysisPage(page);
    authHelper = new AuthHelper(page);
    logger = new Logger();
    await authHelper.authenticate();
  });

  test('QE-10386 TS-001 TC-001: Verify trend analysis displays 12 months of data', async ({ page }) => {
    logger.info('Test Case ID: QE-10386 TS-001 TC-001');
    const userId = 'user-12-months-history-001';
    
    await authHelper.authenticateAsUser(userId);
    await trendAnalysisPage.navigateToTrendAnalysis();
    
    const trendData = await trendAnalysisPage.getMonthlyTrendData();
    expect(trendData.length).toBe(12);
    logger.info(`Retrieved ${trendData.length} months of trend data`);
    
    // Validate each trend object
    for (const trend of trendData) {
      expect(trend.month).toMatch(/^\d{4}-\d{2}$/);
      expect(trend.totalSpend).toBeGreaterThanOrEqual(0);
      logger.info(`Month: ${trend.month}, Spend: $${trend.totalSpend}`);
    }
    
    // Verify chronological order
    const isChronological = trendData.every((trend, idx) => {
      if (idx === 0) return true;
      return trend.month >= trendData[idx - 1].month;
    });
    expect(isChronological).toBeTruthy();
    logger.info('Trend data is in chronological order');
    
    // Verify chart renders
    await expect(trendAnalysisPage.trendChart).toBeVisible();
    const dataPointCount = await trendAnalysisPage.getChartDataPointCount();
    expect(dataPointCount).toBe(12);
    logger.info('Chart displays all 12 data points');
  });

  test('QE-10386 TS-001 TC-002: Verify trend aggregation accuracy', async ({ page }) => {
    logger.info('Test Case ID: QE-10386 TS-001 TC-002');
    const userId = 'user-trend-validation-001';
    const targetMonth = '2023-12';
    
    await authHelper.authenticateAsUser(userId);
    await trendAnalysisPage.navigateToTrendAnalysis();
    
    const trendData = await trendAnalysisPage.getMonthlyTrendData();
    const targetTrend = trendData.find(t => t.month === targetMonth);
    expect(targetTrend).toBeDefined();
    logger.info(`Target month ${targetMonth} trend: $${targetTrend.totalSpend}`);
    
    // Retrieve raw transaction data
    const rawTransactions = await trendAnalysisPage.getRawTransactionsForMonth(targetMonth);
    const calculatedSum = rawTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    logger.info(`Calculated sum from ${rawTransactions.length} transactions: $${calculatedSum}`);
    
    // Compare with tolerance
    expect(Math.abs(targetTrend.totalSpend - calculatedSum)).toBeLessThanOrEqual(0.01);
    logger.info('Trend aggregation matches raw transaction sum');
  });

  test('QE-10386 TS-002 TC-001: Verify insufficient data message for new users', async ({ page }) => {
    logger.info('Test Case ID: QE-10386 TS-002 TC-001');
    const userId = 'user-new-1-month-001';
    
    await authHelper.authenticateAsUser(userId);
    await trendAnalysisPage.navigateToTrendAnalysis();
    
    const trendData = await trendAnalysisPage.getMonthlyTrendData();
    expect(trendData.length).toBe(1);
    logger.info(`Retrieved ${trendData.length} month of data`);
    
    // Verify no errors
    const errors = await page.evaluate(() => window.errors || []);
    expect(errors.length).toBe(0);
    
    // Verify insufficient data message
    await expect(trendAnalysisPage.insufficientDataMessage).toBeVisible();
    const messageText = await trendAnalysisPage.insufficientDataMessage.textContent();
    expect(messageText).toMatch(/Insufficient data|Limited history/);
    logger.info(`Message displayed: ${messageText}`);
    
    // Verify 1 data point is still shown
    await expect(trendAnalysisPage.trendChart).toBeVisible();
    const dataPointCount = await trendAnalysisPage.getChartDataPointCount();
    expect(dataPointCount).toBe(1);
    logger.info('Chart displays the 1 available data point');
  });

  test('QE-10386 TS-003 TC-001: Verify category filter updates chart dynamically', async ({ page }) => {
    logger.info('Test Case ID: QE-10386 TS-003 TC-001');
    const userId = 'user-filter-test-001';
    
    await authHelper.authenticateAsUser(userId);
    await trendAnalysisPage.navigateToTrendAnalysis();
    
    const initialTrendData = await trendAnalysisPage.getMonthlyTrendData();
    logger.info(`Initial trend data: ${initialTrendData.length} months`);
    
    // Apply category filter
    const selectedCategories = ['Food & Dining', 'Travel'];
    await trendAnalysisPage.applyCategoryFilter(selectedCategories);
    logger.info(`Applied filter: ${selectedCategories.join(', ')}`);
    
    // Verify no page reload occurred
    const pageReloaded = await page.evaluate(() => window.performance.navigation.type === 1);
    expect(pageReloaded).toBeFalsy();
    logger.info('No page reload detected');
    
    // Verify filtered data
    const filteredTrendData = await trendAnalysisPage.getMonthlyTrendData();
    expect(filteredTrendData.length).toBe(initialTrendData.length);
    
    // Verify each month's spend is less than or equal to initial (since filtered)
    filteredTrendData.forEach((filtered, idx) => {
      expect(filtered.totalSpend).toBeLessThanOrEqual(initialTrendData[idx].totalSpend);
      logger.info(`Month ${filtered.month}: Filtered=$${filtered.totalSpend}, Initial=$${initialTrendData[idx].totalSpend}`);
    });
  });

  test('QE-10386 TS-003 TC-002: Verify date range filter updates chart dynamically', async ({ page }) => {
    logger.info('Test Case ID: QE-10386 TS-003 TC-002');
    const userId = 'user-date-filter-001';
    
    await authHelper.authenticateAsUser(userId);
    await trendAnalysisPage.navigateToTrendAnalysis();
    
    const initialTrendData = await trendAnalysisPage.getMonthlyTrendData();
    expect(initialTrendData.length).toBe(12);
    logger.info('Initial trend data: 12 months');
    
    // Apply date range filter
    const startDate = '2023-01';
    const endDate = '2023-06';
    await trendAnalysisPage.applyDateRangeFilter(startDate, endDate);
    logger.info(`Applied date range: ${startDate} to ${endDate}`);
    
    // Verify no page reload
    const pageReloaded = await page.evaluate(() => window.performance.navigation.type === 1);
    expect(pageReloaded).toBeFalsy();
    
    // Verify filtered data
    const filteredTrendData = await trendAnalysisPage.getMonthlyTrendData();
    expect(filteredTrendData.length).toBe(6);
    logger.info(`Filtered trend data: ${filteredTrendData.length} months`);
    
    // Verify months are within range
    const expectedMonths = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'];
    filteredTrendData.forEach((trend, idx) => {
      expect(trend.month).toBe(expectedMonths[idx]);
    });
    logger.info('All months are within specified date range');
  });
});
