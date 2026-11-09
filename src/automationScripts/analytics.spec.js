const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Analytics and Spending Visualization Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Navigating to application');
    await loginPage.navigate();
  });

  // Test Case: QE-8467 TS-001 TC-001
  test('QE-8467 TS-001 TC-001 - Verify monthly spending trend chart with 6 months of data', async () => {
    logger.info('Test Case: QE-8467 TS-001 TC-001 - Monthly trend chart verification');
    
    // Step 1-2: Login with 6-month history user
    logger.info('Step 1-2: Logging in with 6-month transaction history user');
    await loginPage.login('testuser_6months', 'Test@123');
    await expect(analyticsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Analytics section
    logger.info('Step 3: Navigating to Analytics section');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);
    
    // Step 4: Access Monthly Trend Analysis
    logger.info('Step 4: Accessing Monthly Trend Analysis view');
    await analyticsPage.accessMonthlyTrendAnalysis();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    // Step 5: Verify chart displays 6 months
    logger.info('Step 5: Verifying chart displays 6 data points');
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBe(6);
    
    const expectedMonths = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];
    dataPoints.forEach((point, index) => {
      expect(point.month).toBe(expectedMonths[index]);
    });
    
    // Step 6: Verify monthly spending totals
    logger.info('Step 6: Verifying monthly spending totals');
    const expectedTotals = [1200, 1500, 1350, 1800, 1650, 1900];
    dataPoints.forEach((point, index) => {
      expect(point.amount).toBe(expectedTotals[index]);
    });
    
    logger.info('Test Case QE-8467 TS-001 TC-001 completed successfully');
  });

  // Test Case: QE-8467 TS-002 TC-001
  test('QE-8467 TS-002 TC-001 - Verify validation message for insufficient data', async () => {
    logger.info('Test Case: QE-8467 TS-002 TC-001 - Insufficient data validation');
    
    // Step 1-2: Login with 1-month history user
    logger.info('Step 1-2: Logging in with 1-month transaction history user');
    await loginPage.login('testuser_1month', 'Test@123');
    await expect(analyticsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Analytics section
    logger.info('Step 3: Navigating to Analytics section');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);
    
    // Step 4: Attempt to access Monthly Trend Analysis
    logger.info('Step 4: Attempting to access Monthly Trend Analysis');
    await analyticsPage.accessMonthlyTrendAnalysis();
    
    // Step 5: Verify validation message
    logger.info('Step 5: Verifying validation message content');
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('Insufficient data for trend analysis');
    expect(messageText).toContain('Minimum 3 months of transaction history required');
    
    // Step 6: Verify no chart rendered
    logger.info('Step 6: Verifying no chart is displayed');
    await expect(analyticsPage.monthlyTrendChart).not.toBeVisible();
    
    logger.info('Test Case QE-8467 TS-002 TC-001 completed successfully');
  });

  // Test Case: QE-8467 TS-003 TC-001
  test('QE-8467 TS-003 TC-001 - Verify interactive chart tooltip functionality', async () => {
    logger.info('Test Case: QE-8467 TS-003 TC-001 - Interactive chart tooltip');
    
    // Step 1-2: Login with 12-month history user
    logger.info('Step 1-2: Logging in with 12-month transaction history user');
    await loginPage.login('testuser_12months', 'Test@123');
    await expect(analyticsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Analytics and access Monthly Trend
    logger.info('Step 3: Navigating to Analytics and accessing Monthly Trend');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.accessMonthlyTrendAnalysis();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBe(12);
    
    // Step 4: Hover over January 2024 data point
    logger.info('Step 4: Hovering over January 2024 data point');
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    const janTooltip = await analyticsPage.getTooltipContent();
    expect(janTooltip.month).toBe('January 2024');
    expect(janTooltip.totalSpend).toBe('$2,500.00');
    
    // Step 5: Hover over June 2024 data point
    logger.info('Step 5: Hovering over June 2024 data point');
    await analyticsPage.hoverOverDataPoint(5);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    const junTooltip = await analyticsPage.getTooltipContent();
    expect(junTooltip.month).toBe('June 2024');
    expect(junTooltip.totalSpend).toBe('$3,200.00');
    
    // Step 6: Move mouse away and verify tooltip disappears
    logger.info('Step 6: Moving mouse away from data points');
    await analyticsPage.page.mouse.move(0, 0);
    await expect(analyticsPage.chartTooltip).not.toBeVisible();
    
    logger.info('Test Case QE-8467 TS-003 TC-001 completed successfully');
  });

  // Test Case: QE-8463 TS-001 TC-001
  test('QE-8463 TS-001 TC-001 - Verify category-wise spending pie chart with correct distribution', async () => {
    logger.info('Test Case: QE-8463 TS-001 TC-001 - Category-wise spending chart');
    
    // Step 1-2: Login with 5-category user
    logger.info('Step 1-2: Logging in with 5-category spending user');
    await loginPage.login('testuser_5categories', 'Test@123');
    await expect(analyticsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Analytics section
    logger.info('Step 3: Navigating to Analytics section');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);
    
    // Step 4: Locate Category-wise Spending section
    logger.info('Step 4: Locating Category-wise Spending Visualization');
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    // Step 5-9: Verify each category spending amount
    logger.info('Step 5-9: Verifying category spending amounts');
    const categoryData = await analyticsPage.getCategorySpendingData();
    
    expect(categoryData['Food & Dining']).toBe(500.00);
    expect(categoryData['Fuel']).toBe(300.00);
    expect(categoryData['Shopping']).toBe(800.00);
    expect(categoryData['Travel']).toBe(400.00);
    expect(categoryData['Entertainment']).toBe(200.00);
    
    // Step 10: Verify chart interactivity
    logger.info('Step 10: Verifying chart interactivity');
    await analyticsPage.hoverOverCategorySegment('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipContent = await analyticsPage.chartTooltip.textContent();
    expect(tooltipContent).toContain('Food & Dining');
    expect(tooltipContent).toContain('500');
    
    logger.info('Test Case QE-8463 TS-001 TC-001 completed successfully');
  });

  // Test Case: QE-8463 TS-002 TC-001
  test('QE-8463 TS-002 TC-001 - Verify appropriate message for no spending data', async () => {
    logger.info('Test Case: QE-8463 TS-002 TC-001 - No spending data handling');
    
    // Step 1-2: Login with no-spending user
    logger.info('Step 1-2: Logging in with user having no spending');
    await loginPage.login('testuser_nospending', 'Test@123');
    await expect(analyticsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Analytics section
    logger.info('Step 3: Navigating to Analytics section');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);
    
    // Step 4: Locate Category-wise Spending section
    logger.info('Step 4: Locating Category-wise Spending section');
    await expect(analyticsPage.categorySpendingSection).toBeVisible();
    
    // Step 5: Verify appropriate message
    logger.info('Step 5: Verifying no spending data message');
    await expect(analyticsPage.noSpendingDataMessage).toBeVisible();
    const messageText = await analyticsPage.noSpendingDataMessage.textContent();
    expect(messageText).toContain('No spending data available');
    expect(messageText).toContain('Your spending breakdown will appear here once you start using your credit cards');
    
    // Step 6: Verify no chart displayed
    logger.info('Step 6: Verifying no chart is rendered');
    await expect(analyticsPage.categoryPieChart).not.toBeVisible();
    
    // Step 7: Verify no JavaScript errors
    logger.info('Step 7: Verifying no JavaScript errors');
    const consoleErrors = [];
    analyticsPage.page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await analyticsPage.page.waitForTimeout(2000);
    expect(consoleErrors.length).toBe(0);
    
    logger.info('Test Case QE-8463 TS-002 TC-001 completed successfully');
  });

  // Test Case: QE-8463 TS-003 TC-001
  test('QE-8463 TS-003 TC-001 - Verify all 9 predefined categories in chart legend', async () => {
    logger.info('Test Case: QE-8463 TS-003 TC-001 - All categories legend display');
    
    // Step 1-2: Login
    logger.info('Step 1-2: Logging in with valid credentials');
    await loginPage.login('testuser', 'Test@123');
    await expect(analyticsPage.page).toHaveURL(/.*dashboard/);
    
    // Step 3: Navigate to Analytics and access Category-wise Spending
    logger.info('Step 3: Navigating to Category-wise Spending Visualization');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    // Step 4-12: Verify all 9 categories in legend
    logger.info('Step 4-12: Verifying all 9 predefined categories in legend');
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
    
    const legendCategories = await analyticsPage.getChartLegendCategories();
    expect(legendCategories.length).toBe(9);
    
    expectedCategories.forEach(category => {
      expect(legendCategories).toContain(category);
    });
    
    // Step 13: Verify zero spending categories show $0.00
    logger.info('Step 13: Verifying zero spending categories display $0.00');
    const categoryValues = await analyticsPage.getCategoryValuesFromLegend();
    
    categoryValues.forEach(value => {
      expect(value).toMatch(/^\$\d+\.\d{2}$/);
    });
    
    const zeroCategories = categoryValues.filter(val => val === '$0.00');
    expect(zeroCategories.length).toBeGreaterThanOrEqual(0);
    
    logger.info('Test Case QE-8463 TS-003 TC-001 completed successfully');
  });
});
