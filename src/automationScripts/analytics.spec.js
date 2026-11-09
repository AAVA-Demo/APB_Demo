const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');

test.describe('Spending Analytics and Insights', () => {
  let analyticsPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    logger = new Logger('AnalyticsTests');
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    logger.info('Navigated to Analytics page');
  });

  // Test Case: QE-7654 TS-001 TC-001
  test('TC-001: Verify category-wise spending aggregation across all nine predefined categories', async () => {
    logger.info('Starting TC-001: Category-wise spending test');
    
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify category chart is visible
    const isCategoryChartVisible = await analyticsPage.isCategoryChartVisible();
    await expect(isCategoryChartVisible).toBe(true);
    
    // Verify all nine categories are present
    const categories = await analyticsPage.getCategoryLabels();
    logger.info(`Categories found: ${categories.join(', ')}`);
    
    const expectedCategories = [
      'Food & Dining',
      'Fuel',
      'Shopping',
      'Travel',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Miscellaneous'
    ];
    
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });
    
    // Verify each category has totalAmount and transactionCount
    const categoryData = await analyticsPage.getCategorySpendData();
    categoryData.forEach(data => {
      expect(data).toHaveProperty('category');
      expect(data).toHaveProperty('totalAmount');
      expect(data).toHaveProperty('transactionCount');
      expect(data.totalAmount).toBeGreaterThanOrEqual(0);
      expect(data.transactionCount).toBeGreaterThanOrEqual(0);
    });
    
    logger.info('TC-001 completed successfully');
  });

  // Test Case: QE-7654 TS-002 TC-001
  test('TC-002: Verify system handles empty transaction data for category-wise spending', async () => {
    logger.info('Starting TC-002: Empty category data test');
    
    // Load empty transaction data
    await analyticsPage.loadEmptyAnalyticsData();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify category chart shows empty state
    const categoryCount = await analyticsPage.getCategoryCount();
    await expect(categoryCount).toBe(0);
    
    // Verify no error is displayed
    const hasError = await analyticsPage.hasErrorMessage();
    await expect(hasError).toBe(false);
    
    // Verify loading state is false
    const isLoading = await analyticsPage.isLoadingIndicatorVisible();
    await expect(isLoading).toBe(false);
    
    logger.info('TC-002 completed successfully');
  });

  // Test Case: QE-7654 TS-003 TC-001
  test('TC-003: Verify uncategorized transactions are automatically assigned to Miscellaneous category', async () => {
    logger.info('Starting TC-003: Uncategorized transaction test');
    
    // Load data with uncategorized transactions
    await analyticsPage.loadUncategorizedTransactionData();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify Miscellaneous category exists
    const categories = await analyticsPage.getCategoryLabels();
    await expect(categories).toContain('Miscellaneous');
    
    // Verify Miscellaneous category has correct transaction count
    const miscData = await analyticsPage.getCategoryDataByName('Miscellaneous');
    logger.info(`Miscellaneous data: ${JSON.stringify(miscData)}`);
    await expect(miscData.transactionCount).toBe(2);
    
    // Verify Miscellaneous total amount matches sum of uncategorized transactions
    await expect(miscData.totalAmount).toBeGreaterThan(0);
    
    logger.info('TC-003 completed successfully');
  });

  // Test Case: QE-7655 TS-001 TC-001
  test('TC-004: Verify monthly spend trend aggregation for three months with correct totals and chronological order', async () => {
    logger.info('Starting TC-004: Monthly trend test');
    
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify monthly trend chart is visible
    const isMonthlyChartVisible = await analyticsPage.isMonthlyTrendChartVisible();
    await expect(isMonthlyChartVisible).toBe(true);
    
    // Verify three months of data
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    logger.info(`Monthly data points: ${monthlyData.length}`);
    await expect(monthlyData.length).toBe(3);
    
    // Verify first month data
    await expect(monthlyData[0].month).toBe('2024-01');
    await expect(monthlyData[0].totalAmount).toBe(16700);
    
    // Verify second month data
    await expect(monthlyData[1].month).toBe('2024-02');
    await expect(monthlyData[1].totalAmount).toBe(13600);
    
    // Verify third month data
    await expect(monthlyData[2].month).toBe('2024-03');
    await expect(monthlyData[2].totalAmount).toBe(10200);
    
    // Verify chronological order
    for (let i = 0; i < monthlyData.length - 1; i++) {
      expect(monthlyData[i].month < monthlyData[i + 1].month).toBe(true);
    }
    
    logger.info('TC-004 completed successfully');
  });

  // Test Case: QE-7655 TS-002 TC-001
  test('TC-005: Verify system handles empty transaction history for monthly trend analysis', async () => {
    logger.info('Starting TC-005: Empty monthly trend test');
    
    // Load empty analytics data
    await analyticsPage.loadEmptyAnalyticsData();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify monthly trend data is empty
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    await expect(monthlyData.length).toBe(0);
    
    // Verify no error is displayed
    const hasError = await analyticsPage.hasErrorMessage();
    await expect(hasError).toBe(false);
    
    // Verify loading state is false
    const isLoading = await analyticsPage.isLoadingIndicatorVisible();
    await expect(isLoading).toBe(false);
    
    logger.info('TC-005 completed successfully');
  });

  // Test Case: QE-7655 TS-003 TC-001
  test('TC-006: Verify monthly trend display with single month data point', async () => {
    logger.info('Starting TC-006: Single month trend test');
    
    // Load single month data
    await analyticsPage.loadSingleMonthData();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify monthly trend chart is visible
    const isMonthlyChartVisible = await analyticsPage.isMonthlyTrendChartVisible();
    await expect(isMonthlyChartVisible).toBe(true);
    
    // Verify single month data
    const monthlyData = await analyticsPage.getMonthlyTrendData();
    await expect(monthlyData.length).toBe(1);
    
    // Verify month and amount
    await expect(monthlyData[0].month).toBe('2024-01');
    await expect(monthlyData[0].totalAmount).toBe(8200);
    
    // Verify chart renders correctly with single data point
    const chartLabels = await analyticsPage.getMonthlyTrendLabels();
    await expect(chartLabels.length).toBe(1);
    await expect(chartLabels[0]).toBe('2024-01');
    
    logger.info('TC-006 completed successfully');
  });
});