const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Transaction Analytics and Spending Insights', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Starting analytics test case');
  });

  test('QE-8500 TS-001 TC-001: Verify all nine spending categories are displayed with accurate amounts', async ({ page }) => {
    logger.info('Test Case: QE-8500 TS-001 TC-001');
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    const categories = await analyticsPage.getAllCategoryNames();
    expect(categories).toHaveLength(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    await analyticsPage.verifyCategoryAmount('Food & Dining', '1200');
    await analyticsPage.verifyCategoryAmount('Fuel', '3000');
    await analyticsPage.verifyCategoryAmount('Shopping', '5000');
    
    const isInteractive = await analyticsPage.verifyChartInteractivity();
    expect(isInteractive).toBeTruthy();
    
    logger.info('Test Case QE-8500 TS-001 TC-001 completed successfully');
  });

  test('QE-8500 TS-001 TC-002: Verify spending distribution percentages are calculated correctly', async ({ page }) => {
    logger.info('Test Case: QE-8500 TS-001 TC-002');
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe('17700');
    
    const foodPercentage = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(parseFloat(foodPercentage)).toBeCloseTo(6.78, 1);
    
    const fuelPercentage = await analyticsPage.getCategoryPercentage('Fuel');
    expect(parseFloat(fuelPercentage)).toBeCloseTo(16.95, 1);
    
    const allPercentages = await analyticsPage.getAllCategoryPercentages();
    const sumPercentages = allPercentages.reduce((sum, val) => sum + parseFloat(val), 0);
    expect(sumPercentages).toBeCloseTo(100, 1);
    
    logger.info('Test Case QE-8500 TS-001 TC-002 completed successfully');
  });

  test('QE-8500 TS-002 TC-001: Verify only three active categories are displayed', async ({ page }) => {
    logger.info('Test Case: QE-8500 TS-002 TC-001');
    
    await analyticsPage.navigateWithUser('test_user_partial_categories');
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    const activeCategories = await analyticsPage.getActiveCategoriesWithTransactions();
    expect(activeCategories).toHaveLength(3);
    expect(activeCategories).toContain('Food & Dining');
    expect(activeCategories).toContain('Fuel');
    expect(activeCategories).toContain('Shopping');
    
    const zeroCategoriesCount = await analyticsPage.getZeroValueCategoriesCount();
    expect(zeroCategoriesCount).toBe(6);
    
    logger.info('Test Case QE-8500 TS-002 TC-001 completed successfully');
  });

  test('QE-8500 TS-002 TC-002: Verify chart adapts correctly when only one spending category has transactions', async ({ page }) => {
    logger.info('Test Case: QE-8500 TS-002 TC-002');
    
    await analyticsPage.navigateWithUser('test_user_single_category');
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    const activeCategories = await analyticsPage.getActiveCategoriesWithTransactions();
    expect(activeCategories).toHaveLength(1);
    expect(activeCategories[0]).toBe('Food & Dining');
    
    const percentage = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(parseFloat(percentage)).toBe(100);
    
    const chartRendered = await analyticsPage.isChartRenderedCorrectly();
    expect(chartRendered).toBeTruthy();
    
    logger.info('Test Case QE-8500 TS-002 TC-002 completed successfully');
  });

  test('QE-8500 TS-003 TC-001: Verify appropriate empty state message is displayed when no transactions', async ({ page }) => {
    logger.info('Test Case: QE-8500 TS-003 TC-001');
    
    await analyticsPage.navigateWithUser('test_user_no_transactions');
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available');
    
    const hasErrors = await analyticsPage.checkForJavaScriptErrors();
    expect(hasErrors).toBeFalsy();
    
    const isDashboardStable = await analyticsPage.isDashboardStable();
    expect(isDashboardStable).toBeTruthy();
    
    logger.info('Test Case QE-8500 TS-003 TC-001 completed successfully');
  });

  test('QE-8500 TS-003 TC-002: Verify empty chart state renders gracefully without visual errors', async ({ page }) => {
    logger.info('Test Case: QE-8500 TS-003 TC-002');
    
    await analyticsPage.navigateWithUser('test_user_no_transactions');
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    const emptyStateVisible = await analyticsPage.isEmptyStateVisible();
    expect(emptyStateVisible).toBeTruthy();
    
    const allCategoriesZero = await analyticsPage.areAllCategoriesZeroOrHidden();
    expect(allCategoriesZero).toBeTruthy();
    
    const hasConsoleErrors = await analyticsPage.checkForConsoleErrors();
    expect(hasConsoleErrors).toBeFalsy();
    
    logger.info('Test Case QE-8500 TS-003 TC-002 completed successfully');
  });
});
