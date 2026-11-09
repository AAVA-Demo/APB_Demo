const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { logger } = require('../utils/logger');

test.describe('Analytics and Visualization Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    logger.info('Navigated to Analytics Dashboard');
  });

  test('QE-8259 TS001 TC-001: Verify monthly spend trend chart displays correctly', async ({ page }) => {
    logger.info('Test: Verify monthly spend trend chart');
    
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    const chartData = await analyticsPage.getChartData();
    expect(chartData.length).toBeGreaterThan(0);
    logger.info(`Chart displays ${chartData.length} months of data`);
    
    await analyticsPage.clickOnMonth('March 2024');
    await expect(analyticsPage.drillDownView).toBeVisible();
    
    logger.info('Monthly trend chart verified successfully');
  });

  test('QE-8257 TS001 TC-001: Verify nine-category spending visualization', async ({ page }) => {
    logger.info('Test: Verify nine-category spending visualization');
    
    await analyticsPage.navigateToCategorySpending();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories.length).toBe(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    logger.info('Nine-category visualization verified successfully');
  });

  test('QE-8256 TS001 TC-001: Verify chart drill-down renders within 1 second', async ({ page }) => {
    logger.info('Test: Verify chart drill-down performance');
    
    await analyticsPage.navigateToCategorySpending();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const startTime = Date.now();
    await analyticsPage.clickOnCategory('Food & Dining');
    await expect(analyticsPage.drillDownView).toBeVisible();
    const drillDownTime = Date.now() - startTime;
    
    expect(drillDownTime).toBeLessThan(1000);
    logger.info(`Drill-down rendered in ${drillDownTime}ms`);
    
    const transactionCount = await analyticsPage.getDrillDownTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    
    logger.info('Chart drill-down verified successfully');
  });

  test('QE-8241 TS001 TC-001: Verify interactive charts render within 1 second', async ({ page }) => {
    logger.info('Test: Verify interactive charts render time');
    
    const startTime = Date.now();
    await analyticsPage.navigate();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const renderTime = Date.now() - startTime;
    
    expect(renderTime).toBeLessThan(1000);
    logger.info(`Charts rendered in ${renderTime}ms`);
    
    await expect(analyticsPage.drillDownButton).toBeEnabled();
    
    logger.info('Interactive charts verified successfully');
  });

  test('QE-8250 TS001 TC-001: Verify multi-card spend comparison with category breakdown', async ({ page }) => {
    logger.info('Test: Verify multi-card spend comparison');
    
    await analyticsPage.navigateToCardComparison();
    
    await expect(analyticsPage.cardComparisonChart).toBeVisible();
    
    const cardData = await analyticsPage.getCardComparisonData();
    expect(cardData.length).toBeGreaterThan(0);
    
    for (const card of cardData) {
      expect(card.spending).toBeDefined();
      expect(card.categoryBreakdown).toBeDefined();
    }
    
    logger.info('Multi-card spend comparison verified successfully');
  });

  test('QE-8243 TS001 TC-001: Verify monthly trend shows increasing/decreasing patterns', async ({ page }) => {
    logger.info('Test: Verify monthly trend patterns');
    
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    await expect(analyticsPage.trendIndicator).toBeVisible();
    
    const trendDirection = await analyticsPage.getTrendDirection();
    expect(['increasing', 'decreasing', 'stable']).toContain(trendDirection.toLowerCase());
    logger.info(`Trend direction: ${trendDirection}`);
    
    logger.info('Monthly trend patterns verified successfully');
  });
});