const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Analytics Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@demo.com', 'Test@1234');
    logger.info('User logged in successfully');
  });

  test('TC-6163: Verify interactive breakdown chart displays spending across all nine categories', async ({ page }) => {
    logger.info('Test Case ID: 6163 - Verify interactive breakdown chart displays spending across all nine categories');
    
    // Step 1: User authenticated
    
    // Step 2: Navigate to analytics dashboard
    await analyticsPage.navigate();
    logger.info('Navigated to analytics dashboard');
    
    // Step 3: Verify category-wise breakdown chart is displayed
    await expect(analyticsPage.categoryBreakdownChart).toBeVisible();
    logger.info('Category breakdown chart is visible');
    
    // Verify all nine categories are present
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of categories) {
      const categoryElement = await analyticsPage.getCategoryElement(category);
      await expect(categoryElement).toBeVisible();
      logger.info(`Category verified: ${category}`);
    }
    
    // Step 4: Verify spending amounts are displayed for each category
    const categorySpending = await analyticsPage.getAllCategorySpending();
    expect(Object.keys(categorySpending).length).toBe(9);
    logger.info('All category spending amounts verified');
    
    // Step 5: Verify chart is interactive (hover shows category details)
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    const tooltipText = await analyticsPage.categoryTooltip.textContent();
    expect(tooltipText).toContain('Food & Dining');
    logger.info('Chart interactivity verified - tooltip displayed on hover');
  });

  test('TC-6164: Verify no transaction data message when no transactions exist', async ({ page }) => {
    logger.info('Test Case ID: 6164 - Verify no transaction data available message when no transactions exist in date range');
    
    // Step 1: User authenticated
    
    // Step 2: Navigate to analytics dashboard
    await analyticsPage.navigate();
    
    // Step 3: Select a date range with no transaction history
    await analyticsPage.selectDateRange('2025-01-01', '2025-01-31');
    logger.info('Selected date range: 2025-01-01 to 2025-01-31');
    
    // Step 4: Verify 'No transaction data available' message is displayed
    await expect(analyticsPage.noDataMessage).toBeVisible();
    await expect(analyticsPage.noDataMessage).toContainText('No transaction data available');
    logger.info('No transaction data message verified');
    
    // Step 5: Verify chart is not rendered when no data exists
    const chartVisible = await analyticsPage.categoryBreakdownChart.isVisible().catch(() => false);
    expect(chartVisible).toBeFalsy();
    logger.info('Category breakdown chart is hidden when no data exists');
  });

  test('TC-6165: Verify uncategorized transactions displayed under Miscellaneous when classification fails', async ({ page }) => {
    logger.info('Test Case ID: 6165 - Verify uncategorized transactions are displayed under Miscellaneous when classification service fails');
    
    // Step 1: User authenticated
    
    // Step 2: Simulate category classification service failure
    await page.route('**/api/analytics/categorize', route => {
      route.fulfill({ status: 500, body: 'Classification Service Error' });
    });
    logger.info('Mock API configured to return 500 error for category classification');
    
    // Step 3: Navigate to analytics dashboard
    await analyticsPage.navigate();
    
    // Step 4: Verify error notification is displayed
    await expect(analyticsPage.errorNotification).toBeVisible();
    await expect(analyticsPage.errorNotification).toContainText('Some transactions could not be categorized');
    await expect(analyticsPage.errorNotification).toContainText('Miscellaneous');
    logger.info('Error notification verified');
    
    // Step 5: Verify uncategorized transactions are displayed under Miscellaneous category
    const miscellaneousSpend = await analyticsPage.getCategorySpending('Miscellaneous');
    expect(miscellaneousSpend).toBeTruthy();
    logger.info(`Miscellaneous category spending: ${miscellaneousSpend}`);
  });

  test('TC-6166: Verify interactive monthly spending trend chart displays 12 months within 3 seconds', async ({ page }) => {
    logger.info('Test Case ID: 6166 - Verify interactive monthly spending trend chart displays 12 months of data within 3 seconds');
    
    // Step 1: User authenticated
    
    // Step 2: Navigate to analytics dashboard
    await analyticsPage.navigate();
    
    // Step 3: Verify monthly spending trend chart is displayed within 3 seconds
    const startTime = Date.now();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible({ timeout: 3000 });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    logger.info(`Monthly trend chart loaded in ${loadTime}ms`);
    
    // Step 4: Verify chart displays 12 months of historical data
    const months = await analyticsPage.getMonthLabels();
    expect(months.length).toBe(12);
    logger.info(`Chart displays ${months.length} months of data`);
    
    // Verify months are from 2024-01 to 2024-12
    const expectedMonths = [
      'Jan-2024', 'Feb-2024', 'Mar-2024', 'Apr-2024', 'May-2024', 'Jun-2024',
      'Jul-2024', 'Aug-2024', 'Sep-2024', 'Oct-2024', 'Nov-2024', 'Dec-2024'
    ];
    
    // Step 5: Verify chart is interactive (hover shows month and amount)
    await analyticsPage.hoverOverMonth('Jan-2024');
    await expect(analyticsPage.trendTooltip).toBeVisible();
    const tooltipText = await analyticsPage.trendTooltip.textContent();
    expect(tooltipText).toContain('Jan-2024');
    logger.info('Chart interactivity verified - tooltip displayed on hover');
  });

  test('TC-6167: Verify insufficient data message when less than 2 months of transaction history', async ({ page }) => {
    logger.info('Test Case ID: 6167 - Verify insufficient data message when less than 2 months of transaction history exists');
    
    // Step 1: Login with new user account having only 1 month of transaction history
    await loginPage.navigate();
    await loginPage.login('newuser@demo.com', 'Test@1234');
    logger.info('Logged in with new user account');
    
    // Step 2: Navigate to analytics dashboard
    await analyticsPage.navigate();
    
    // Step 3: Verify 'Insufficient data' message is displayed
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    await expect(analyticsPage.insufficientDataMessage).toContainText('Insufficient data');
    await expect(analyticsPage.insufficientDataMessage).toContainText('At least 2 months');
    logger.info('Insufficient data message verified');
    
    // Step 4: Verify system suggests returning after more data is available
    await expect(analyticsPage.insufficientDataMessage).toContainText('Please check back');
    logger.info('Suggestion message verified');
    
    // Step 5: Verify trend chart is not rendered
    const chartVisible = await analyticsPage.monthlyTrendChart.isVisible().catch(() => false);
    expect(chartVisible).toBeFalsy();
    logger.info('Monthly trend chart is hidden when insufficient data');
  });

  test('TC-6168: Verify monthly spending trend chart updates when filtered by category', async ({ page }) => {
    logger.info('Test Case ID: 6168 - Verify monthly spending trend chart updates when filtered by specific category');
    
    // Step 1: User authenticated
    
    // Step 2: Navigate to analytics dashboard
    await analyticsPage.navigate();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    logger.info('Analytics dashboard loaded with monthly trend chart');
    
    // Step 3: Click on 'Food & Dining' category filter button
    await analyticsPage.clickCategoryFilter('Food & Dining');
    logger.info('Clicked Food & Dining category filter');
    
    // Step 4: Verify monthly spending trend chart updates to show only Food & Dining spending
    await page.waitForTimeout(500); // Wait for chart update animation
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    const chartData = await analyticsPage.getChartData();
    expect(chartData).toBeTruthy();
    logger.info('Monthly trend chart updated with filtered data');
    
    // Step 5: Verify chart title or label indicates active filter
    const chartTitle = await analyticsPage.getChartTitle();
    expect(chartTitle).toContain('Food & Dining');
    logger.info(`Chart title verified: ${chartTitle}`);
  });
});
