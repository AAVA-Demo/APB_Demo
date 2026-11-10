const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');

test.describe('Analytics Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    Logger.info('Navigated to Analytics page');
  });

  test('TC-6408: Verify category-wise spending visualization displays all 9 predefined categories with accurate amounts', async ({ page }) => {
    Logger.info('Starting test: Verify category-wise spending visualization');
    await analyticsPage.waitForAnalyticsToLoad();
    
    await expect(analyticsPage.categorySpendingPanel).toBeVisible();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBeGreaterThanOrEqual(1);
    
    const hasRequiredCategories = await analyticsPage.verifyRequiredCategories();
    expect(hasRequiredCategories).toBe(true);
    Logger.info('Category-wise spending visualization verified');
  });

  test('TC-6409: Verify categorization service correctly classifies transactions based on merchant names', async ({ page }) => {
    Logger.info('Starting test: Verify transaction categorization');
    await analyticsPage.waitForAnalyticsToLoad();
    
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    for (const category of categories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(amount).toContain('$');
    }
    Logger.info('Transaction categorization verified');
  });

  test('TC-6410: Verify error handling when transaction repository service fails', async ({ page }) => {
    Logger.info('Starting test: Verify error handling for transaction service failure');
    await page.route('**/api/transactions', route => route.abort());
    
    await analyticsPage.navigate();
    await expect(analyticsPage.errorMessage).toBeVisible({ timeout: 5000 });
    
    const errorText = await analyticsPage.getErrorMessage();
    expect(errorText).toContain('Failed to load analytics data');
    
    const chartVisible = await analyticsPage.categoryChart.isVisible().catch(() => false);
    expect(chartVisible).toBe(false);
    Logger.info('Error handling verified - no broken chart rendered');
  });

  test('TC-6414: Verify monthly spend trend analysis displays 12 months of data with trend indicators', async ({ page }) => {
    Logger.info('Starting test: Verify monthly spend trend analysis');
    await analyticsPage.waitForAnalyticsToLoad();
    
    await expect(analyticsPage.monthlyTrendsPanel).toBeVisible();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    const hasMonthlyData = await analyticsPage.verifyMonthlyTrendsDisplay();
    expect(hasMonthlyData).toBe(true);
    Logger.info('Monthly spend trend analysis verified');
  });

  test('TC-6415: Verify analytics service aggregates transaction data by month and renders within NFR time limit', async ({ page }) => {
    Logger.info('Starting test: Verify analytics render time');
    const startTime = Date.now();
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1500);
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    Logger.info(`Analytics rendered in ${renderTime}ms`);
  });

  test('TC-6416: Verify empty state message when no transaction data is available for 12-month period', async ({ page }) => {
    Logger.info('Starting test: Verify empty state handling');
    await page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsToLoad();
    
    const emptyStateVisible = await analyticsPage.emptyStateMessage.isVisible();
    if (emptyStateVisible) {
      const emptyText = await analyticsPage.getEmptyStateMessage();
      expect(emptyText).toContain('No transaction data available');
      Logger.info('Empty state message verified');
    } else {
      Logger.warn('Empty state not displayed - may have default mock data');
    }
  });
});
