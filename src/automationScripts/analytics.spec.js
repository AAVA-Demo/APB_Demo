const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Spending Analytics and Insights', () => {

  test('QE-9570 TS-001 TC-001 - Verify system aggregates spending by category and renders interactive chart within 3 seconds when user has transactions across all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-9570 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Authenticate user with transactions in all 9 categories
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('testuser@example.com', 'all9categories');
    logger.info('User authenticated with transactions in all 9 categories');
    
    // Step 2: Retrieve transaction data
    const transactions = await analyticsPage.getTransactions();
    logger.info('Transaction data retrieved');
    
    // Step 3: Aggregate spending by category
    const startTime = Date.now();
    const categoryData = await analyticsPage.aggregateByCategory(transactions);
    logger.info('Spending aggregated by category');
    
    // Step 4: Validate all 9 categories are present
    expect(categoryData.length).toBe(9);
    const categories = categoryData.map(c => c.category);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    logger.info('All 9 categories present in aggregated data');
    
    // Step 5: Verify chart rendering completes within 3 seconds
    await analyticsPage.renderChart(categoryData);
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThanOrEqual(3000);
    logger.info(`Chart rendered in ${renderTime}ms <= 3000ms`);
    
    // Step 6: Validate chart is interactive
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBe(true);
    logger.info('Chart supports user interaction events');
  });

  test('QE-9570 TS-002 TC-001 - Verify system displays spending data for only populated categories and shows zero/no data for remaining categories when user has transactions in 3 out of 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-9570 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Authenticate user with transactions in only 3 categories
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('partialuser@example.com', 'Shopping,Fuel,Food & Dining');
    logger.info('User authenticated with transactions in 3 categories');
    
    // Step 2: Retrieve and filter transaction data
    const transactions = await analyticsPage.getTransactions();
    logger.info('Transaction data retrieved for 3 categories');
    
    // Step 3: Aggregate by category
    const categoryData = await analyticsPage.aggregateByCategory(transactions);
    expect(categoryData.length).toBe(3);
    logger.info('Aggregation returns 3 category objects');
    
    // Step 4: Validate remaining 6 categories have zero or null amounts
    const populatedCategories = categoryData.map(c => c.category);
    expect(populatedCategories).toContain('Shopping');
    expect(populatedCategories).toContain('Fuel');
    expect(populatedCategories).toContain('Food & Dining');
    
    const unpopulatedCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    unpopulatedCategories.forEach(cat => {
      expect(populatedCategories).not.toContain(cat);
    });
    logger.info('Remaining 6 categories excluded or have zero amount');
    
    // Step 5: Verify chart renders only populated categories
    await analyticsPage.renderChart(categoryData);
    const chartSegments = await analyticsPage.getChartSegmentCount();
    expect(chartSegments).toBe(3);
    logger.info('Chart displays 3 segments for populated categories');
  });

  test('QE-9570 TS-003 TC-001 - Verify system assigns uncategorized transactions to Miscellaneous and displays chart without data loss when category classification service fails', async ({ page }) => {
    logger.info('Starting test: QE-9570 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Authenticate user
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('testuser@example.com', 'CC001');
    logger.info('User authenticated');
    
    // Step 2: Simulate category classification failure
    const transactions = await analyticsPage.getTransactionsWithInvalidCategories();
    logger.info('Transactions with null/invalid categories retrieved');
    
    // Step 3: Categorize transactions
    const categorizedTransactions = await analyticsPage.categorizeTransactions(transactions);
    categorizedTransactions.forEach(txn => {
      expect(txn.category).toBe('Miscellaneous');
    });
    logger.info('All null/invalid categories assigned to Miscellaneous');
    
    // Step 4: Aggregate by category
    const categoryData = await analyticsPage.aggregateByCategory(categorizedTransactions);
    const miscCategory = categoryData.find(c => c.category === 'Miscellaneous');
    expect(miscCategory).toBeDefined();
    expect(miscCategory.totalAmount).toBeGreaterThan(0);
    logger.info('Miscellaneous category includes sum of all uncategorized transactions');
    
    // Step 5: Verify chart renders with Miscellaneous category and no data loss
    await analyticsPage.renderChart(categoryData);
    const totalChartAmount = await analyticsPage.getTotalChartAmount();
    const totalTransactionAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    expect(totalChartAmount).toBe(totalTransactionAmount);
    logger.info('All transaction amounts accounted for in chart - no data loss');
  });

  test('QE-9569 TS-001 TC-001 - Verify system aggregates spending by month and displays trend graph for user with 6 months of transaction history', async ({ page }) => {
    logger.info('Starting test: QE-9569 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Authenticate user with 6 months of transaction history
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('testuser@example.com', '2024-01:2024-06');
    logger.info('User authenticated with 6 months of transaction history');
    
    // Step 2: Retrieve transactions
    const transactions = await analyticsPage.getTransactions();
    logger.info('Transactions retrieved for 6 months');
    
    // Step 3: Aggregate by month
    const monthlyData = await analyticsPage.aggregateByMonth(transactions);
    expect(monthlyData.length).toBe(6);
    logger.info('Aggregation returns 6 monthly data points');
    
    // Step 4: Validate each month has totalSpend calculated
    monthlyData.forEach(monthData => {
      expect(monthData.month).toBeDefined();
      expect(monthData.totalSpend).toBeDefined();
      expect(monthData.totalSpend).toBeGreaterThanOrEqual(0);
    });
    logger.info('Each month object contains month key and totalSpend value');
    
    // Step 5: Verify trend graph renders with 6 data points
    await analyticsPage.renderMonthlyTrendChart(monthlyData);
    const chartDataPoints = await analyticsPage.getChartDataPointCount();
    expect(chartDataPoints).toBe(6);
    logger.info('Line chart displays 6 points representing monthly spending');
    
    // Step 6: Validate trend graph shows spending patterns
    const isTrendVisible = await analyticsPage.isTrendLineVisible();
    expect(isTrendVisible).toBe(true);
    logger.info('Graph visually represents spending trends over time');
  });

  test('QE-9569 TS-002 TC-001 - Verify system displays single data point and indicates insufficient data for trend analysis when user has only 1 month of history', async ({ page }) => {
    logger.info('Starting test: QE-9569 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Authenticate user with 1 month of transaction history
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('newuser@example.com', '2024-01');
    logger.info('User authenticated with 1 month of transaction history');
    
    // Step 2: Retrieve and filter transactions
    const transactions = await analyticsPage.getTransactions();
    logger.info('Transactions retrieved for 1 month');
    
    // Step 3: Aggregate by month
    const monthlyData = await analyticsPage.aggregateByMonth(transactions);
    expect(monthlyData.length).toBe(1);
    expect(monthlyData[0].month).toBe('2024-1');
    logger.info('Aggregation returns 1 monthly data point');
    
    // Step 4: Verify system displays single data point on graph
    await analyticsPage.renderMonthlyTrendChart(monthlyData);
    const chartDataPoints = await analyticsPage.getChartDataPointCount();
    expect(chartDataPoints).toBe(1);
    logger.info('Chart renders with 1 data point');
    
    // Step 5: Validate insufficient data message
    const insufficientDataMessage = await analyticsPage.getInsufficientDataMessage();
    expect(insufficientDataMessage).toContain('Insufficient data for trend analysis');
    expect(insufficientDataMessage).toContain('At least 2 months required');
    logger.info('Insufficient data message displayed');
  });

  test('QE-9569 TS-003 TC-001 - Verify system returns error message and does not render incomplete graph when analytics engine fails to aggregate monthly data due to missing date fields', async ({ page }) => {
    logger.info('Starting test: QE-9569 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Authenticate user
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('testuser@example.com', 'CC001');
    logger.info('User authenticated');
    
    // Step 2: Simulate transactions with missing date fields
    const transactions = await analyticsPage.getTransactionsWithMissingDates();
    logger.info('Transactions with missing date fields retrieved');
    
    // Step 3: Attempt to aggregate by month
    const aggregationResult = await analyticsPage.aggregateByMonthWithError(transactions);
    expect(aggregationResult.error).toBe(true);
    logger.info('Aggregation failed due to missing dates');
    
    // Step 4: Verify system returns error message
    const errorMessage = await analyticsPage.getAggregationErrorMessage();
    expect(errorMessage).toContain('Unable to generate monthly trend');
    expect(errorMessage).toContain('Date information missing');
    logger.info('Error message displayed: Unable to generate monthly trend');
    
    // Step 5: Validate no incomplete or misleading graph is rendered
    const isChartRendered = await analyticsPage.isChartVisible();
    expect(isChartRendered).toBe(false);
    
    const isErrorPlaceholderVisible = await analyticsPage.isErrorPlaceholderVisible();
    expect(isErrorPlaceholderVisible).toBe(true);
    logger.info('Chart area shows error placeholder, no partial data displayed');
  });

});