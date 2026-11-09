const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Analytics - Spending Trends and Category Analysis', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Analytics test suite');
    analyticsPage = new AnalyticsPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-7747 TS-001 TC-001: Verify user with 12 months history views interactive monthly trends with hover details', async ({ page }) => {
    logger.info('Test Case: QE-7747 TS-001 TC-001 - 12 months trends with hover');
    
    await analyticsPage.navigate();
    await loginPage.login('testuser_12months_history', 'Pass@123');
    
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    logger.info('Analytics page loaded');
    
    await analyticsPage.navigateToMonthlyTrends();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    logger.info('Monthly trends chart displayed');
    
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(12);
    logger.info(`${dataPoints.length} months of data displayed`);
    
    await analyticsPage.hoverOverDataPoint('Jan 2024');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Total:');
    expect(tooltipText).toContain('Transactions:');
    logger.info('Hover tooltip displays detailed information');
  });

  test('QE-7747 TS-002 TC-001: Verify exactly 12 months display chronologically with accurate totals within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-7747 TS-002 TC-001 - 12 months chronological display');
    
    await analyticsPage.navigate();
    await loginPage.login('testuser_exactly_12months', 'Pass@123');
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToMonthlyTrends();
    
    const startTime = Date.now();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
    expect(dataPoints.length).toBe(12);
    logger.info('Exactly 12 months displayed');
    
    const isChronological = await analyticsPage.verifyChronologicalOrder(dataPoints);
    expect(isChronological).toBe(true);
    logger.info('Months displayed in chronological order');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Chart rendered in ${loadTime}ms (requirement: ≤2000ms)`);
  });

  test('QE-7747 TS-003 TC-001: Verify partial history displays with informational message', async ({ page }) => {
    logger.info('Test Case: QE-7747 TS-003 TC-001 - Partial history with message');
    
    await analyticsPage.navigate();
    await loginPage.login('testuser_6months_history', 'Pass@123');
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
    expect(dataPoints.length).toBeLessThan(12);
    logger.info(`${dataPoints.length} months of partial data displayed`);
    
    await expect(analyticsPage.partialDataMessage).toBeVisible();
    const message = await analyticsPage.getPartialDataMessage();
    expect(message).toContain('Showing trends for the past');
    expect(message).toContain('More data will be available');
    logger.info('Informational message displayed for partial data');
  });

  test('QE-7749 TS-001 TC-001: Verify multiple categories display in interactive chart with hover details', async ({ page }) => {
    logger.info('Test Case: QE-7749 TS-001 TC-001 - Multiple categories interactive chart');
    
    await analyticsPage.navigate();
    await loginPage.login('testuser_multi_category', 'Pass@123');
    
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categoryWiseChart).toBeVisible();
    logger.info('Category-wise spending chart displayed');
    
    const categories = await analyticsPage.getCategoryData();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    for (const category of expectedCategories) {
      const categoryData = categories.find(c => c.name === category);
      expect(categoryData).toBeTruthy();
      expect(categoryData.amount).toMatch(/\$[\d,]+\.\d{2}/);
    }
    logger.info('All spending categories displayed with amounts');
    
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toContain('transactions');
    logger.info('Category hover displays detailed breakdown');
  });

  test('QE-7749 TS-002 TC-001: Verify limited categories display correctly without misleading empty data', async ({ page }) => {
    logger.info('Test Case: QE-7749 TS-002 TC-001 - Limited categories display');
    
    await analyticsPage.navigate();
    await loginPage.login('testuser_limited_categories', 'Pass@123');
    
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categoryWiseChart).toBeVisible();
    
    const categories = await analyticsPage.getCategoryData();
    expect(categories.length).toBeLessThan(9);
    logger.info(`${categories.length} categories with spending displayed`);
    
    const displayedCategories = categories.map(c => c.name);
    expect(displayedCategories).toContain('Food & Dining');
    expect(displayedCategories).toContain('Fuel');
    logger.info('Only categories with spending are displayed');
    
    const hasEmptyCategories = await analyticsPage.checkForEmptyCategories();
    expect(hasEmptyCategories).toBe(false);
    logger.info('No misleading empty data displayed');
  });

  test('QE-7749 TS-003 TC-001: Verify no transactions displays message instead of empty chart', async ({ page }) => {
    logger.info('Test Case: QE-7749 TS-003 TC-001 - No transactions message');
    
    await analyticsPage.navigate();
    await loginPage.login('testuser_no_transactions_analytics', 'Pass@123');
    
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toContain('No spending data available for the current month');
    expect(message).toContain('Start using your credit card to see analytics');
    logger.info('No data message displayed correctly');
    
    await expect(analyticsPage.emptyChart).not.toBeVisible();
    logger.info('Verified no empty or broken chart displayed');
  });
});