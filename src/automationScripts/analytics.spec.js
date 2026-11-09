const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Analytics - Spending Visualization and Trends', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');
    await analyticsPage.navigate();
    logger.info('Navigated to analytics page');
  });

  test('QE-8169-TS001-TC001: Verify interactive category drill-down displays individual transactions', async ({ page }) => {
    logger.info('Starting test: QE-8169-TS001-TC001');
    await analyticsPage.waitForCategoryChartLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
    logger.info(`Categories displayed: ${categories.join(', ')}`);
    expect(categories).toContain('Food & Dining');
    await analyticsPage.clickCategorySegment('Food & Dining');
    await expect(analyticsPage.transactionList).toBeVisible();
    const transactions = await analyticsPage.getTransactionDetails();
    logger.info(`Transactions found: ${transactions.length}`);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0]).toHaveProperty('merchantName');
    expect(transactions[0]).toHaveProperty('amount');
    expect(transactions[0]).toHaveProperty('date');
    logger.info('Category drill-down successful with transaction details');
  });

  test('QE-8169-TS002-TC001: Verify pagination is implemented for categories with 1000+ transactions', async ({ page }) => {
    logger.info('Starting test: QE-8169-TS002-TC001');
    await loginPage.logout();
    await loginPage.login('testuser_large_data', 'Test@123');
    await analyticsPage.navigate();
    await analyticsPage.clickCategorySegment('Shopping');
    await expect(analyticsPage.paginationControls).toBeVisible();
    const pageInfo = await analyticsPage.getPaginationInfo();
    logger.info(`Pagination info: ${pageInfo}`);
    expect(pageInfo).toContain('page 1 of');
    await analyticsPage.clickNextPage();
    await expect(analyticsPage.transactionList).toBeVisible();
    logger.info('Pagination working correctly for large dataset');
  });

  test('QE-8169-TS003-TC001: Verify category tooltip displays accurate spending details on hover', async ({ page }) => {
    logger.info('Starting test: QE-8169-TS003-TC001');
    await analyticsPage.waitForCategoryChartLoad();
    await analyticsPage.hoverOverCategory('Travel');
    await expect(analyticsPage.tooltip).toBeVisible();
    const tooltipData = await analyticsPage.getTooltipData();
    logger.info(`Tooltip data: ${JSON.stringify(tooltipData)}`);
    expect(tooltipData.amount).toMatch(/₹[0-9,]+/);
    expect(tooltipData.percentage).toMatch(/\d+%/);
    expect(tooltipData.transactionCount).toMatch(/\d+/);
    logger.info('Tooltip displays accurate spending details');
  });

  test('QE-8168-TS001-TC001: Verify recurring spending patterns are highlighted in visualization', async ({ page }) => {
    logger.info('Starting test: QE-8168-TS001-TC001');
    await loginPage.logout();
    await loginPage.login('user_with_history', 'Test@123');
    await analyticsPage.navigateToPatternAnalysis();
    await expect(analyticsPage.patternVisualization).toBeVisible();
    const recurringPatterns = await analyticsPage.getRecurringPatterns();
    logger.info(`Recurring patterns found: ${recurringPatterns.length}`);
    expect(recurringPatterns.length).toBeGreaterThan(0);
    const utilityPattern = recurringPatterns.find(p => p.category === 'Utilities');
    expect(utilityPattern).toBeDefined();
    expect(utilityPattern.highlighted).toBe(true);
    logger.info('Recurring patterns highlighted correctly');
  });

  test('QE-8168-TS002-TC001: Verify insufficient data message for users with less than 3 months history', async ({ page }) => {
    logger.info('Starting test: QE-8168-TS002-TC001');
    await loginPage.logout();
    await loginPage.login('new_user', 'Test@123');
    await analyticsPage.navigateToPatternAnalysis();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessageText();
    logger.info(`Message: ${message}`);
    expect(message).toContain('at least 3-6 months');
  });

  test('QE-8168-TS003-TC001: Verify drill-down into spending anomaly shows detailed transaction data', async ({ page }) => {
    logger.info('Starting test: QE-8168-TS003-TC001');
    await analyticsPage.navigateToPatternAnalysis();
    await expect(analyticsPage.anomalyIndicator).toBeVisible();
    await analyticsPage.clickAnomalyMonth('March 2024');
    await expect(analyticsPage.detailedTransactionView).toBeVisible();
    const transactions = await analyticsPage.getTransactionDetails();
    const largeTransaction = transactions.find(t => t.amount >= 35000);
    logger.info(`Large transaction: ${JSON.stringify(largeTransaction)}`);
    expect(largeTransaction).toBeDefined();
    expect(largeTransaction.category).toBe('Travel');
    logger.info('Anomaly drill-down displays detailed transactions');
  });

  test('QE-8164-TS001-TC001: Verify category-wise spending visualization displays all nine categories accurately', async ({ page }) => {
    logger.info('Starting test: QE-8164-TS001-TC001');
    await loginPage.logout();
    await loginPage.login('testuser_all_categories', 'Test@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryChartLoad();
    const categories = await analyticsPage.getAllCategories();
    logger.info(`Categories displayed: ${categories.join(', ')}`);
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expectedCategories.forEach(cat => {
      expect(categories).toContain(cat);
    });
    logger.info('All nine categories displayed accurately');
  });

  test('QE-8164-TS002-TC001: Verify visualization displays only populated categories for users with limited spending', async ({ page }) => {
    logger.info('Starting test: QE-8164-TS002-TC001');
    await loginPage.logout();
    await loginPage.login('testuser_limited', 'Test@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForCategoryChartLoad();
    const visibleCategories = await analyticsPage.getVisibleCategories();
    logger.info(`Visible categories: ${visibleCategories.join(', ')}`);
    expect(visibleCategories).toContain('Food & Dining');
    expect(visibleCategories).toContain('Fuel');
    expect(visibleCategories.length).toBeLessThanOrEqual(3);
    logger.info('Only populated categories displayed');
  });

  test('QE-8164-TS003-TC001: Verify fallback to table view when visualization rendering fails', async ({ page, context }) => {
    logger.info('Starting test: QE-8164-TS003-TC001');
    await context.route('**/api/chart/**', route => route.abort());
    await page.reload();
    await analyticsPage.navigate();
    await expect(analyticsPage.tableView).toBeVisible();
    const tableData = await analyticsPage.getTableData();
    logger.info(`Table data rows: ${tableData.length}`);
    expect(tableData.length).toBeGreaterThan(0);
    await expect(analyticsPage.retryButton).toBeVisible();
    logger.info('Fallback table view displayed on rendering failure');
  });

  test('QE-8163-TS001-TC001: Verify monthly spend trend analysis displays 12 months with drill-down capability', async ({ page }) => {
    logger.info('Starting test: QE-8163-TS001-TC001');
    await loginPage.logout();
    await loginPage.login('testuser_12months', 'Test@123');
    await analyticsPage.navigateToTrendAnalysis();
    await expect(analyticsPage.trendChart).toBeVisible();
    const months = await analyticsPage.getTrendMonths();
    logger.info(`Months displayed: ${months.length}`);
    expect(months.length).toBe(12);
    await analyticsPage.clickMonth('March 2024');
    await expect(analyticsPage.monthDetailView).toBeVisible();
    const breakdown = await analyticsPage.getMonthBreakdown();
    logger.info(`Month breakdown categories: ${breakdown.categories.length}`);
    expect(breakdown.categories.length).toBeGreaterThan(0);
    logger.info('Trend analysis with drill-down working correctly');
  });

  test('QE-8163-TS002-TC001: Verify trend analysis displays available months for users with less than 12 months history', async ({ page }) => {
    logger.info('Starting test: QE-8163-TS002-TC001');
    await loginPage.logout();
    await loginPage.login('testuser_3months', 'Test@123');
    await analyticsPage.navigateToTrendAnalysis();
    await expect(analyticsPage.trendChart).toBeVisible();
    const months = await analyticsPage.getTrendMonths();
    logger.info(`Months displayed: ${months.length}`);
    expect(months.length).toBe(3);
    await expect(analyticsPage.infoMessage).toBeVisible();
    const message = await analyticsPage.getInfoMessageText();
    expect(message).toContain('sufficient history');
    logger.info('Partial trend displayed with informational message');
  });

  test('QE-8163-TS003-TC001: Verify drill-down handles corrupted month data gracefully', async ({ page, context }) => {
    logger.info('Starting test: QE-8163-TS003-TC001');
    await context.route('**/api/transactions/month/2024-02', route => route.abort());
    await analyticsPage.navigateToTrendAnalysis();
    await analyticsPage.clickMonth('February 2024');
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.getErrorMessageText();
    logger.info(`Error message: ${errorText}`);
    expect(errorText).toContain('Unable to load');
    await expect(analyticsPage.trendChart).toBeVisible();
    logger.info('Trend chart remains intact despite drill-down error');
  });
});
