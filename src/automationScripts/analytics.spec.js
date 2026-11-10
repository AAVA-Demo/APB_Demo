const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Analytics and Spending Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Starting analytics test setup');
  });

  test('QE-9785 TS-001 TC-001 - Verify monthly spending trends visualization with 12 months data', async ({ page }) => {
    logger.info('Test Case: QE-9785 TS-001 TC-001 - Monthly Trends 12 Months');
    
    // Step 1: Login with full history user
    await loginPage.navigate();
    await loginPage.login('fullhistory@example.com', 'Test@123');
    logger.info('User with 12 months history logged in');
    
    // Step 2: Navigate to Monthly Spend Trends
    await analyticsPage.navigateToTrends();
    await expect(page).toHaveURL(/.*trends/, { timeout: 3000 });
    logger.info('Trend analysis view loaded within 3 seconds');
    
    // Step 3: Verify 12 data points
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    await expect(dataPoints).toBe(12);
    logger.info('Graph displays 12 months of data');
    
    // Step 4: Verify accurate aggregation
    await analyticsPage.verifyMonthlyAggregation();
    logger.info('Monthly spending accurately aggregated');
    
    // Step 5: Click on specific month
    await analyticsPage.clickMonthDataPoint(5);
    await expect(analyticsPage.transactionDetailView).toBeVisible();
    logger.info('Drill-down to month details successful');
    
    // Step 6: Verify transaction details
    await analyticsPage.verifyTransactionDetails();
    logger.info('Transaction details include date, amount, category, merchant');
  });

  test('QE-9785 TS-002 TC-001 - Verify insufficient historical data handling', async ({ page }) => {
    logger.info('Test Case: QE-9785 TS-002 TC-001 - Insufficient Data');
    
    // Step 1: Login with 6 months history user
    await loginPage.navigate();
    await loginPage.login('newuser6months@example.com', 'Test@123');
    logger.info('User with 6 months history logged in');
    
    // Step 2: Navigate to Trends
    await analyticsPage.navigateToTrends();
    logger.info('Trend analysis view loaded');
    
    // Step 3: Verify insufficient data notification
    await expect(analyticsPage.insufficientDataNotification).toBeVisible();
    await expect(analyticsPage.insufficientDataNotification).toContainText('Only 6 months of historical data available');
    logger.info('Insufficient data notification displayed');
    
    // Step 4: Verify 6 months displayed
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    await expect(dataPoints).toBe(6);
    logger.info('Graph displays 6 months of available data');
    
    // Step 5: Verify X-axis labels
    await analyticsPage.verifyXAxisLabels(6);
    logger.info('X-axis displays 6 month labels');
  });

  test('QE-9785 TS-003 TC-001 - Verify error message when Analytics Service unavailable', async ({ page }) => {
    logger.info('Test Case: QE-9785 TS-003 TC-001 - Analytics Service Unavailable');
    
    // Step 1: Mock analytics service unavailability
    await page.route('**/api/analytics', route => route.abort('failed'));
    logger.info('Analytics service mocked as unavailable');
    
    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Trends
    await analyticsPage.navigateToTrends();
    logger.info('Trend analysis view attempted to load');
    
    // Step 4: Verify error message
    await expect(analyticsPage.serviceUnavailableError).toBeVisible();
    await expect(analyticsPage.serviceUnavailableError).toContainText('Analytics service is temporarily unavailable');
    logger.info('Error message displayed');
    
    // Step 5: Verify retry button
    await expect(analyticsPage.retryButton).toBeVisible();
    await expect(analyticsPage.retryButton).toBeEnabled();
    logger.info('Retry button visible and enabled');
    
    // Step 6: Click retry
    await analyticsPage.retryButton.click();
    logger.info('Retry button clicked');
  });

  test('QE-9783 TS-001 TC-001 - Verify category-wise spending visualization for all 9 categories', async ({ page }) => {
    logger.info('Test Case: QE-9783 TS-001 TC-001 - All 9 Categories');
    
    // Step 1: Login with all categories user
    await loginPage.navigate();
    await loginPage.login('allcategories@example.com', 'Test@123');
    logger.info('User with all 9 categories logged in');
    
    // Step 2: Navigate to Spending Insights
    await analyticsPage.navigateToSpendingInsights();
    await expect(page).toHaveURL(/.*insights/, { timeout: 3000 });
    logger.info('Spending insights dashboard loaded within 3 seconds');
    
    // Step 3: Verify 9 category segments
    const categoryCount = await analyticsPage.getCategoryCount();
    await expect(categoryCount).toBe(9);
    logger.info('Pie chart displays 9 category segments');
    
    // Step 4: Verify accurate spending amounts
    await analyticsPage.verifyCategorySpendingAmounts();
    logger.info('Category spending amounts accurate');
    
    // Step 5: Verify percentages sum to 100%
    const totalPercentage = await analyticsPage.getTotalCategoryPercentage();
    await expect(totalPercentage).toBeCloseTo(100, 1);
    logger.info('Category percentages sum to 100%');
    
    // Step 6: Click on category segment
    await analyticsPage.clickCategorySegment('Food & Dining');
    await expect(analyticsPage.categoryDetailView).toBeVisible();
    logger.info('Category detail view displayed');
  });

  test('QE-9783 TS-002 TC-001 - Verify chart displays only categories with spending data', async ({ page }) => {
    logger.info('Test Case: QE-9783 TS-002 TC-001 - Partial Categories');
    
    // Step 1: Login with limited categories user
    await loginPage.navigate();
    await loginPage.login('limitedcategories@example.com', 'Test@123');
    logger.info('User with 3 categories logged in');
    
    // Step 2: Navigate to Spending Insights
    await analyticsPage.navigateToSpendingInsights();
    logger.info('Spending insights dashboard loaded');
    
    // Step 3: Verify only 3 categories displayed
    const categoryCount = await analyticsPage.getCategoryCount();
    await expect(categoryCount).toBe(3);
    logger.info('Chart displays only 3 categories with data');
    
    // Step 4: Verify categories with no transactions omitted
    const displayedCategories = await analyticsPage.getDisplayedCategories();
    await expect(displayedCategories).toContain('Food & Dining');
    await expect(displayedCategories).toContain('Fuel');
    await expect(displayedCategories).toContain('Shopping');
    logger.info('Only categories with spending data displayed');
    
    // Step 5: Verify percentages sum to 100%
    const totalPercentage = await analyticsPage.getTotalCategoryPercentage();
    await expect(totalPercentage).toBeCloseTo(100, 1);
    logger.info('Displayed category percentages sum to 100%');
  });

  test('QE-9783 TS-003 TC-001 - Verify error when Category Classification Engine fails', async ({ page }) => {
    logger.info('Test Case: QE-9783 TS-003 TC-001 - Category Service Failure');
    
    // Step 1: Mock category service failure
    await page.route('**/api/categories', route => route.abort('failed'));
    logger.info('Category Classification Engine mocked as failed');
    
    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Spending Insights
    await analyticsPage.navigateToSpendingInsights();
    logger.info('Spending insights dashboard attempted to load');
    
    // Step 4: Verify error message
    await expect(analyticsPage.categoryServiceError).toBeVisible();
    await expect(analyticsPage.categoryServiceError).toContainText('Category classification service is unavailable');
    logger.info('Error message displayed');
    
    // Step 5: Verify retry and support buttons
    await expect(analyticsPage.retryButton).toBeVisible();
    await expect(analyticsPage.contactSupportButton).toBeVisible();
    logger.info('Retry and Contact Support buttons visible');
  });
});