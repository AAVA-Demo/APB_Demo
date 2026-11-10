const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const config = require('../data/config.json');
const logger = require('../utils/logger');

test.describe('Spending Analytics and Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    loginPage = new LoginPage(page);
    logger.info('Starting analytics test setup');
  });

  // Test Case ID: 7267 - QE-9979 TS-001 TC-001
  test('TC-7267: Verify category-wise spending visualization renders within 2 seconds', async ({ page }) => {
    logger.info('Test Case 7267: Starting category-wise spending visualization test');
    
    // Step 1-3: Login
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.testUser.username, config.users.testUser.password);
    logger.info('Steps 1-3: User authenticated');
    
    // Step 4: Navigate to Analytics page
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 4: Analytics page loaded');
    
    // Step 5: Verify chart renders within 2 seconds
    const startTime = Date.now();
    await analyticsPage.waitForCategoryChart();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThanOrEqual(2000);
    logger.info(`Step 5: Category chart rendered in ${renderTime}ms`);
    
    // Step 6: Verify all 9 categories displayed
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories).toEqual(expect.arrayContaining(expectedCategories));
    logger.info(`Step 6: All 9 categories verified: ${categories.join(', ')}`);
    
    // Step 7: Verify chart interactivity
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBeTruthy();
    logger.info('Step 7: Chart interactivity verified');
    
    // Step 8: Verify spending amounts accuracy
    const totalSpending = await analyticsPage.getTotalSpending();
    const categorySum = await analyticsPage.sumCategoryAmounts();
    expect(totalSpending).toBe(categorySum);
    logger.info('Step 8: Spending amounts accuracy verified');
  });

  // Test Case ID: 7268 - QE-9979 TS-002 TC-001
  test('TC-7268: Verify no spending data message for user with no transactions', async ({ page }) => {
    logger.info('Test Case 7268: Starting no transaction history test');
    
    // Step 1-3: Login with new user
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.newUser.username, config.users.newUser.password);
    logger.info('Steps 1-3: New user authenticated');
    
    // Step 4: Navigate to Analytics page
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 4: Analytics page loaded');
    
    // Step 5: Verify "No spending data available" message
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toContain('No spending data available');
    logger.info(`Step 5: No data message verified: ${message}`);
    
    // Step 6: Verify zero-state visualization
    const hasZeroState = await analyticsPage.hasZeroStateVisualization();
    expect(hasZeroState).toBeTruthy();
    logger.info('Step 6: Zero-state visualization verified');
    
    // Step 7: Verify application stability
    await expect(page).not.toHaveTitle(/Error/);
    const canNavigate = await analyticsPage.canNavigateToOtherSections();
    expect(canNavigate).toBeTruthy();
    logger.info('Step 7: Application remains stable');
  });

  // Test Case ID: 7269 - QE-9979 TS-003 TC-001
  test('TC-7269: Verify uncategorized transactions default to Miscellaneous', async ({ page }) => {
    logger.info('Test Case 7269: Starting uncategorized transactions test');
    
    // Step 1-3: Login
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.testUser.username, config.users.testUser.password);
    logger.info('Steps 1-3: User authenticated');
    
    // Step 4: Navigate to Analytics page
    await analyticsPage.navigate();
    await expect(page).toHaveURL(/analytics/);
    logger.info('Step 4: Analytics page loaded');
    
    // Step 5: Verify chart renders successfully
    await analyticsPage.waitForCategoryChart();
    await expect(analyticsPage.categoryChart).toBeVisible();
    logger.info('Step 5: Category chart rendered successfully');
    
    // Step 6: Verify Miscellaneous category includes uncategorized transactions
    const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(parseFloat(miscAmount)).toBeGreaterThan(0);
    logger.info(`Step 6: Miscellaneous category verified with amount: ${miscAmount}`);
    
    // Step 7: Verify total spending accuracy
    const totalSpending = await analyticsPage.getTotalSpending();
    const categorySum = await analyticsPage.sumCategoryAmounts();
    expect(totalSpending).toBe(categorySum);
    logger.info('Step 7: Total spending accuracy verified (includes uncategorized)');
    
    // Step 8: Verify visualization completeness
    const isComplete = await analyticsPage.isVisualizationComplete();
    expect(isComplete).toBeTruthy();
    logger.info('Step 8: Visualization completeness verified');
  });

  // Test Case ID: 7288 - QE-9983 TS-001 TC-001
  test('TC-7288: Verify monthly spending trends with 12 months history and drill-down', async ({ page }) => {
    logger.info('Test Case 7288: Starting monthly spending trends test');
    
    // Step 1-3: Login
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.user12Months.username, config.users.user12Months.password);
    logger.info('Steps 1-3: User with 12 months history authenticated');
    
    // Step 4-5: Navigate to Analytics and Spending Trends
    await analyticsPage.navigate();
    await analyticsPage.navigateToSpendingTrends();
    logger.info('Steps 4-5: Spending Trends section displayed');
    
    // Step 6: Verify interactive line chart
    await expect(analyticsPage.trendChart).toBeVisible();
    const chartType = await analyticsPage.getChartType();
    expect(chartType).toBe('line');
    logger.info('Step 6: Interactive line chart verified');
    
    // Step 7: Verify 12 months data
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBe(12);
    logger.info(`Step 7: 12 months data verified: ${monthLabels.join(', ')}`);
    
    // Step 8: Verify chart interactivity
    const isInteractive = await analyticsPage.isTrendChartInteractive();
    expect(isInteractive).toBeTruthy();
    logger.info('Step 8: Chart interactivity verified');
    
    // Step 9: Click on specific month to drill down
    await analyticsPage.clickMonthDataPoint('March 2024');
    await expect(analyticsPage.drillDownView).toBeVisible();
    logger.info('Step 9: Drill-down view displayed for March 2024');
    
    // Step 10: Verify category breakdown in drill-down
    const categories = await analyticsPage.getDrillDownCategories();
    expect(categories.length).toBeGreaterThanOrEqual(9);
    logger.info(`Step 10: Category breakdown verified: ${categories.length} categories`);
    
    // Step 11: Verify return to main chart
    await analyticsPage.clickBackButton();
    await expect(analyticsPage.trendChart).toBeVisible();
    logger.info('Step 11: Returned to main trend chart successfully');
  });

  // Test Case ID: 7290 - QE-9983 TS-002 TC-001
  test('TC-7290: Verify partial transaction history display with appropriate message', async ({ page }) => {
    logger.info('Test Case 7290: Starting partial history test');
    
    // Step 1-3: Login with 6-month history user
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.user6Months.username, config.users.user6Months.password);
    logger.info('Steps 1-3: User with 6 months history authenticated');
    
    // Step 4-5: Navigate to Spending Trends
    await analyticsPage.navigate();
    await analyticsPage.navigateToSpendingTrends();
    logger.info('Steps 4-5: Spending Trends section displayed');
    
    // Step 6: Verify message about available data
    const message = await analyticsPage.getDataAvailabilityMessage();
    expect(message).toContain('Displaying trends for available 6 months of data');
    logger.info(`Step 6: Data availability message verified: ${message}`);
    
    // Step 7: Verify chart shows 6 months data
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBe(6);
    logger.info(`Step 7: 6 months data verified: ${monthLabels.join(', ')}`);
    
    // Step 8: Verify no empty data points
    const hasEmptyDataPoints = await analyticsPage.hasEmptyDataPoints();
    expect(hasEmptyDataPoints).toBeFalsy();
    logger.info('Step 8: No empty data points verified');
    
    // Step 9: Verify chart interactivity
    const isInteractive = await analyticsPage.isTrendChartInteractive();
    expect(isInteractive).toBeTruthy();
    logger.info('Step 9: Chart interactivity verified');
    
    // Step 10: Verify application stability
    await expect(page).not.toHaveTitle(/Error/);
    logger.info('Step 10: Application remains stable');
  });

  // Test Case ID: 7292 - QE-9983 TS-003 TC-001
  test('TC-7292: Verify expired detailed data handling with graceful degradation', async ({ page }) => {
    logger.info('Test Case 7292: Starting expired data handling test');
    
    // Step 1-3: Login with expired data user
    await loginPage.navigate(config.baseUrl);
    await loginPage.login(config.users.userExpiredData.username, config.users.userExpiredData.password);
    logger.info('Steps 1-3: User with expired data authenticated');
    
    // Step 4-5: Navigate to Spending Trends
    await analyticsPage.navigate();
    await analyticsPage.navigateToSpendingTrends();
    logger.info('Steps 4-5: Spending Trends section displayed');
    
    // Step 6: Verify overall trend chart visible
    await expect(analyticsPage.trendChart).toBeVisible();
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBeGreaterThan(0);
    logger.info(`Step 6: Overall trend chart verified with ${monthLabels.length} months`);
    
    // Step 7: Click on expired month data point
    await analyticsPage.clickMonthDataPoint('January 2023');
    logger.info('Step 7: Clicked on expired month data point');
    
    // Step 8: Verify error message for expired data
    const errorMessage = await analyticsPage.getExpiredDataMessage();
    expect(errorMessage).toContain('Detailed data not available for this period');
    logger.info(`Step 8: Expired data error message verified: ${errorMessage}`);
    
    // Step 9: Verify main chart remains visible
    await expect(analyticsPage.trendChart).toBeVisible();
    logger.info('Step 9: Main trend chart visibility maintained');
    
    // Step 10: Verify drill-down works for available data
    await analyticsPage.clickMonthDataPoint('March 2024');
    await expect(analyticsPage.drillDownView).toBeVisible();
    logger.info('Step 10: Drill-down functional for available data');
    
    // Step 11: Verify application stability
    await expect(page).not.toHaveTitle(/Error/);
    logger.info('Step 11: Application remains responsive and stable');
  });
});
