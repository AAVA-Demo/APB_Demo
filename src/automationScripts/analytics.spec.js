const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');

test.describe('Credit Card Analytics - Spending Trends and Category Visualization', () => {
  let analyticsPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    logger = new Logger('AnalyticsSpec');
    analyticsPage = new AnalyticsPage(page);
    logger.info('Navigating to analytics dashboard');
    await analyticsPage.navigate();
  });

  test('QE-10030 TS-001 TC-001 - Verify 12-month spending trend visualization with drill-down capability', async ({ page }) => {
    logger.info('Test Case: QE-10030 TS-001 TC-001 - 12-month trend visualization validation');
    
    // Step 1-2: Login and navigate completed in beforeEach
    logger.info('Step 1-2: Navigation to spending trends page completed');
    
    // Step 3: Verify line chart displays 12 months of data
    logger.info('Step 3: Verifying 12-month line chart display');
    await expect(analyticsPage.trendChart).toBeVisible();
    
    const monthLabels = await analyticsPage.getTrendChartMonths();
    expect(monthLabels.length).toBe(12);
    logger.info(`Chart displays ${monthLabels.length} months: ${monthLabels.join(', ')}`);
    
    const monthlySpending = await analyticsPage.getTrendChartValues();
    expect(monthlySpending.length).toBe(12);
    
    for (let i = 0; i < monthlySpending.length; i++) {
      expect(monthlySpending[i]).toMatch(/\$[\d,]+/);
      logger.info(`${monthLabels[i]}: ${monthlySpending[i]}`);
    }
    
    // Step 4: Click on specific month to drill down
    logger.info('Step 4: Clicking on March data point for drill-down');
    await analyticsPage.clickMonthDataPoint('March');
    
    // Step 5: Verify drill-down view
    logger.info('Step 5: Verifying drill-down detailed view');
    await expect(analyticsPage.drillDownView).toBeVisible();
    
    const drillDownData = await analyticsPage.getDrillDownData();
    expect(drillDownData.month).toBe('March');
    expect(drillDownData.details.length).toBeGreaterThan(0);
    
    logger.info(`Drill-down data for March: ${drillDownData.details.length} items`);
    
    logger.info('Test completed successfully');
  });

  test('QE-10030 TS-002 TC-001 - Verify spending trend visualization with insufficient historical data (less than 12 months)', async ({ page }) => {
    logger.info('Test Case: QE-10030 TS-002 TC-001 - Insufficient data handling validation');
    
    // Step 1: Login with user having only 3 months of history
    logger.info('Step 1: Logging in with user having 3 months of transaction history');
    await analyticsPage.loginWithCredentials('newuser@example.com', 'SecurePass123');
    
    // Step 2: Navigate to spending trends
    logger.info('Step 2: Navigating to spending trends page');
    await analyticsPage.navigate();
    
    // Step 3: Verify line chart displays only 3 months
    logger.info('Step 3: Verifying chart displays only available 3 months');
    await expect(analyticsPage.trendChart).toBeVisible();
    
    const monthLabels = await analyticsPage.getTrendChartMonths();
    expect(monthLabels.length).toBe(3);
    logger.info(`Chart displays ${monthLabels.length} months: ${monthLabels.join(', ')}`);
    
    const monthlySpending = await analyticsPage.getTrendChartValues();
    expect(monthlySpending.length).toBe(3);
    
    for (let i = 0; i < monthlySpending.length; i++) {
      logger.info(`${monthLabels[i]}: ${monthlySpending[i]}`);
    }
    
    // Step 4: Verify insufficient data message
    logger.info('Step 4: Verifying insufficient historical data message');
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('3 months of data available');
    expect(messageText).toContain('12 months');
    logger.info(`Insufficient data message: ${messageText}`);
    
    logger.info('Test completed successfully');
  });

  test('QE-10030 TS-003 TC-001 - Verify error handling when analytics engine fails to calculate monthly aggregates', async ({ page }) => {
    logger.info('Test Case: QE-10030 TS-003 TC-001 - Analytics engine failure handling');
    
    // Step 1: Login completed in beforeEach
    logger.info('Step 1: User authentication completed');
    
    // Step 2: Simulate analytics engine failure
    logger.info('Step 2: Simulating analytics engine failure');
    await page.route('**/api/analytics/**', route => route.abort());
    await page.route('**/api/spending/**', route => route.abort());
    
    // Step 3: Navigate to spending trends
    logger.info('Step 3: Navigating to spending trends page');
    await page.reload();
    await analyticsPage.waitForPageLoad();
    
    // Step 4: Verify error message
    logger.info('Step 4: Verifying trend data unavailable error message');
    await expect(analyticsPage.analyticsErrorMessage).toBeVisible();
    const errorText = await analyticsPage.analyticsErrorMessage.textContent();
    expect(errorText).toContain('temporarily unavailable');
    logger.info(`Error message: ${errorText}`);
    
    // Step 5: Verify no broken chart is rendered
    logger.info('Step 5: Verifying no chart is rendered');
    const isChartVisible = await analyticsPage.trendChart.isVisible().catch(() => false);
    expect(isChartVisible).toBeFalsy();
    logger.info('Verified: No chart displayed');
    
    logger.info('Test completed successfully');
  });

  test('QE-10026 TS-001 TC-001 - Verify category-wise spending chart displays all nine categories with spending amounts', async ({ page }) => {
    logger.info('Test Case: QE-10026 TS-001 TC-001 - Category-wise spending visualization');
    
    // Step 1-2: Login and navigate completed in beforeEach
    logger.info('Step 1-2: Navigation to analytics dashboard completed');
    
    // Step 3: Verify interactive chart displays all 9 categories
    logger.info('Step 3: Verifying category-wise spending chart');
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categories = await analyticsPage.getCategoryChartLabels();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    expect(categories.length).toBe(9);
    
    for (const expectedCategory of expectedCategories) {
      expect(categories).toContain(expectedCategory);
    }
    
    logger.info(`Categories displayed: ${categories.join(', ')}`);
    
    const spendingAmounts = await analyticsPage.getCategoryChartValues();
    expect(spendingAmounts.length).toBe(9);
    
    for (let i = 0; i < categories.length; i++) {
      expect(spendingAmounts[i]).toMatch(/\$[\d,]+/);
      logger.info(`${categories[i]}: ${spendingAmounts[i]}`);
    }
    
    // Step 4: Verify chart interactivity
    logger.info('Step 4: Verifying chart interactivity');
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    
    const tooltipText = await analyticsPage.categoryTooltip.textContent();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toMatch(/\$[\d,]+/);
    logger.info(`Tooltip displayed: ${tooltipText}`);
    
    logger.info('Test completed successfully');
  });

  test('QE-10026 TS-002 TC-001 - Verify empty chart with message is displayed when user has no transactions in current month', async ({ page }) => {
    logger.info('Test Case: QE-10026 TS-002 TC-001 - No transactions handling');
    
    // Step 1: Login with user having no transactions
    logger.info('Step 1: Logging in with user having no transactions in current month');
    await analyticsPage.loginWithCredentials('newuser@example.com', 'SecurePass123');
    
    // Step 2: Navigate to analytics dashboard
    logger.info('Step 2: Navigating to analytics dashboard');
    await analyticsPage.navigate();
    
    // Step 3: Verify empty chart is displayed
    logger.info('Step 3: Verifying empty chart display');
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categories = await analyticsPage.getCategoryChartLabels();
    const values = await analyticsPage.getCategoryChartValues();
    
    // Empty chart should have no data or all zero values
    const hasNoData = categories.length === 0 || values.every(v => v === '$0' || v === '0');
    expect(hasNoData).toBeTruthy();
    logger.info('Empty chart verified');
    
    // Step 4: Verify no spending data message
    logger.info('Step 4: Verifying no spending data message');
    await expect(analyticsPage.noSpendingDataMessage).toBeVisible();
    const messageText = await analyticsPage.noSpendingDataMessage.textContent();
    expect(messageText).toContain('No spending data available');
    expect(messageText).toContain('current month');
    logger.info(`Message displayed: ${messageText}`);
    
    logger.info('Test completed successfully');
  });

  test('QE-10026 TS-003 TC-001 - Verify fallback error message is displayed when transaction categorization service returns malformed data', async ({ page }) => {
    logger.info('Test Case: QE-10026 TS-003 TC-001 - Malformed data handling');
    
    // Step 1: Login completed in beforeEach
    logger.info('Step 1: User authentication completed');
    
    // Step 2: Simulate malformed data response
    logger.info('Step 2: Simulating malformed data from categorization service');
    await page.route('**/api/analytics/spending', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{invalid json}'
      });
    });
    
    // Step 3: Navigate to analytics dashboard
    logger.info('Step 3: Navigating to analytics dashboard');
    await page.reload();
    await analyticsPage.waitForPageLoad();
    
    // Step 4: Verify fallback error message
    logger.info('Step 4: Verifying fallback error message');
    await expect(analyticsPage.dataErrorMessage).toBeVisible();
    const errorText = await analyticsPage.dataErrorMessage.textContent();
    expect(errorText).toContain('Unable to load spending data');
    expect(errorText).toContain('data error');
    logger.info(`Error message: ${errorText}`);
    
    // Step 5: Verify no broken chart is rendered
    logger.info('Step 5: Verifying no chart is rendered');
    const isChartVisible = await analyticsPage.categoryChart.isVisible().catch(() => false);
    expect(isChartVisible).toBeFalsy();
    logger.info('Verified: No chart displayed');
    
    logger.info('Test completed successfully');
  });
});