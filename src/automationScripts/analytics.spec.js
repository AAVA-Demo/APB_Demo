const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Analytics - Monthly Trends and Category Spending Tests', () => {

  test('QE-9371 TS-001 TC-001 - Verify monthly spend trend chart with 6 months data and drill-down capability', async ({ page }) => {
    logger.info('Starting test: QE-9371 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-2: Launch and authenticate
    logger.info('Step 1-2: Launching and authenticating as testuser_six_months');
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_six_months', 'Test@123');
    
    // Step 3: Navigate to Analytics section
    logger.info('Step 3: Navigating to Spending Analytics section');
    await analyticsPage.navigateToAnalytics();
    await expect(page).toHaveURL(/analytics/);
    
    // Step 4: Wait for monthly spend trend chart to load
    logger.info('Step 4: Waiting for monthly spend trend chart to load');
    await analyticsPage.waitForMonthlyTrendChartToLoad();
    
    // Step 5: Verify chart displays 6 months in chronological order
    logger.info('Step 5: Verifying chart displays 6 months in chronological order');
    const months = await analyticsPage.getMonthlyTrendMonths();
    expect(months.length).toBe(6);
    
    const expectedMonths = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
    for (let i = 0; i < expectedMonths.length; i++) {
      expect(months[i]).toContain(expectedMonths[i]);
    }
    logger.info(`Chart displays months: ${months.join(', ')}`);
    
    // Step 6: Click on March 2026 data point to drill down
    logger.info('Step 6: Clicking on March 2026 data point for drill-down');
    await analyticsPage.clickMonthDataPoint('2026-03');
    
    // Step 7: Verify drill-down view shows transaction details
    logger.info('Step 7: Verifying drill-down view shows transaction details for March 2026');
    const drillDownVisible = await analyticsPage.isDrillDownViewVisible();
    expect(drillDownVisible).toBeTruthy();
    
    const transactions = await analyticsPage.getDrillDownTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    // Verify first transaction has required details
    expect(transactions[0]).toHaveProperty('transactionId');
    expect(transactions[0]).toHaveProperty('merchant');
    expect(transactions[0]).toHaveProperty('amount');
    expect(transactions[0]).toHaveProperty('date');
    logger.info(`Drill-down shows ${transactions.length} transactions for March 2026`);
    
    logger.info('Test QE-9371 TS-001 TC-001 completed successfully');
  });

  test('QE-9371 TS-002 TC-001 - Verify single month data point with insufficient data message', async ({ page }) => {
    logger.info('Starting test: QE-9371 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, authenticate, and navigate to Analytics
    logger.info('Step 1-3: Launching and navigating to Analytics as testuser_one_month');
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_one_month', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Wait for monthly spend trend chart to load
    logger.info('Step 4: Waiting for monthly spend trend chart to load');
    await analyticsPage.waitForMonthlyTrendChartToLoad();
    
    // Step 5: Verify chart displays only one data point
    logger.info('Step 5: Verifying chart displays only one data point for current month');
    const months = await analyticsPage.getMonthlyTrendMonths();
    expect(months.length).toBe(1);
    expect(months[0]).toContain('2026-06');
    logger.info(`Chart displays single month: ${months[0]}`);
    
    // Step 6: Verify insufficient data message is displayed
    logger.info('Step 6: Verifying insufficient historical data message');
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toMatch(/insufficient historical data|more data will be available/i);
    logger.info(`Message displayed: ${message}`);
    
    logger.info('Test QE-9371 TS-002 TC-001 completed successfully');
  });

  test('QE-9371 TS-003 TC-001 - Verify error message for incomplete date information', async ({ page }) => {
    logger.info('Starting test: QE-9371 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch with incomplete date simulation and authenticate
    logger.info('Step 1-3: Launching with incomplete date simulation');
    await page.route('**/api/transactions/history', async route => {
      const response = await route.fetch();
      const json = await response.json();
      // Simulate incomplete date information
      if (json.length > 0) {
        json[0].transactionDate = null;
        json[1].transactionDate = 'invalid-date';
      }
      await route.fulfill({ response, json });
    });
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_incomplete_dates', 'Test@123');
    
    // Step 4: Navigate to Analytics section
    logger.info('Step 4: Navigating to Spending Analytics section');
    await analyticsPage.navigateToAnalytics();
    
    // Step 5-6: Verify error message for data quality issues
    logger.info('Step 5-6: Verifying error message for data quality issues');
    const errorMessage = await analyticsPage.getAnalyticsErrorMessage();
    expect(errorMessage).toMatch(/failed to load analytics|data quality issues|incomplete date/i);
    logger.info(`Error message displayed: ${errorMessage}`);
    
    logger.info('Test QE-9371 TS-003 TC-001 completed successfully');
  });

  test('QE-9370 TS-001 TC-001 - Verify category-wise spending breakdown for all nine categories', async ({ page }) => {
    logger.info('Starting test: QE-9370 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, authenticate, and navigate to Analytics
    logger.info('Step 1-3: Launching and navigating to Analytics as testuser_all_categories');
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_all_categories', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Wait for category-wise spending visualization to load
    logger.info('Step 4: Waiting for category-wise spending chart to load');
    await analyticsPage.waitForCategoryChartToLoad();
    
    // Step 5: Verify all nine categories are displayed
    logger.info('Step 5: Verifying all nine categories are displayed');
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    const displayedCategories = await analyticsPage.getCategoryNames();
    expect(displayedCategories.length).toBe(9);
    
    for (const category of expectedCategories) {
      expect(displayedCategories).toContain(category);
    }
    logger.info(`All nine categories displayed: ${displayedCategories.join(', ')}`);
    
    // Step 6: Verify each category displays correct spending amount
    logger.info('Step 6: Verifying each category displays spending amount');
    const categoryData = await analyticsPage.getCategorySpendingData();
    
    for (const data of categoryData) {
      expect(data.amount).toBeGreaterThan(0);
      logger.info(`${data.category}: $${data.amount.toFixed(2)}`);
    }
    
    // Step 7: Verify each category displays correct percentage
    logger.info('Step 7: Verifying each category displays percentage');
    let totalPercentage = 0;
    for (const data of categoryData) {
      expect(data.percentage).toBeGreaterThan(0);
      totalPercentage += data.percentage;
      logger.info(`${data.category}: ${data.percentage.toFixed(2)}%`);
    }
    
    // Total percentage should be approximately 100%
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    logger.info('Test QE-9370 TS-001 TC-001 completed successfully');
  });

  test('QE-9370 TS-002 TC-001 - Verify uncategorized transactions are classified as Miscellaneous', async ({ page }) => {
    logger.info('Starting test: QE-9370 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, authenticate, and navigate to Analytics
    logger.info('Step 1-3: Launching and navigating to Analytics as testuser_invalid_categories');
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_invalid_categories', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Wait for category-wise spending visualization to load
    logger.info('Step 4: Waiting for category-wise spending chart to load');
    await analyticsPage.waitForCategoryChartToLoad();
    
    // Step 5-6: Verify Miscellaneous category includes uncategorized transactions
    logger.info('Step 5-6: Verifying Miscellaneous category includes uncategorized transactions');
    const categoryData = await analyticsPage.getCategorySpendingData();
    const miscellaneousData = categoryData.find(data => data.category === 'Miscellaneous');
    
    expect(miscellaneousData).toBeDefined();
    expect(miscellaneousData.amount).toBeGreaterThan(0);
    logger.info(`Miscellaneous category amount: $${miscellaneousData.amount.toFixed(2)}`);
    
    // Step 7: Verify Miscellaneous displays correct total and percentage
    logger.info('Step 7: Verifying Miscellaneous displays correct total and percentage');
    expect(miscellaneousData.percentage).toBeGreaterThan(0);
    logger.info(`Miscellaneous category percentage: ${miscellaneousData.percentage.toFixed(2)}%`);
    
    logger.info('Test QE-9370 TS-002 TC-001 completed successfully');
  });

  test('QE-9370 TS-003 TC-001 - Verify category filtering updates spending visualization', async ({ page }) => {
    logger.info('Starting test: QE-9370 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-4: Launch, authenticate, navigate, and wait for chart
    logger.info('Step 1-4: Launching and navigating to Analytics as testuser_multi_categories');
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_multi_categories', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartToLoad();
    
    // Step 5-6: Select Food & Dining and Fuel categories
    logger.info('Step 5-6: Selecting Food & Dining and Fuel categories');
    await analyticsPage.selectCategoryFilter('Food & Dining');
    await analyticsPage.selectCategoryFilter('Fuel');
    
    // Step 7: Apply filter
    logger.info('Step 7: Applying category filter');
    await analyticsPage.applyFilter();
    await analyticsPage.waitForChartUpdate();
    
    // Step 8: Verify only selected categories are displayed
    logger.info('Step 8: Verifying only selected categories are displayed');
    const displayedCategories = await analyticsPage.getCategoryNames();
    expect(displayedCategories.length).toBe(2);
    expect(displayedCategories).toContain('Food & Dining');
    expect(displayedCategories).toContain('Fuel');
    logger.info(`Filtered categories displayed: ${displayedCategories.join(', ')}`);
    
    // Step 9: Verify percentages are recalculated
    logger.info('Step 9: Verifying spending amounts and percentages are recalculated');
    const categoryData = await analyticsPage.getCategorySpendingData();
    
    let totalPercentage = 0;
    for (const data of categoryData) {
      totalPercentage += data.percentage;
      logger.info(`${data.category}: $${data.amount.toFixed(2)} (${data.percentage.toFixed(2)}%)`);
    }
    
    // Total percentage should be approximately 100% for filtered categories
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    logger.info('Test QE-9370 TS-003 TC-001 completed successfully');
  });

});