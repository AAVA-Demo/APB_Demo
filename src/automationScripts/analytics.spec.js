const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Analytics Feature Tests', () => {

  test('QE-7995 TS-001 TC-001 - Verify complete category breakdown visualization displays all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-7995 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Launch application', async () => {
      await analyticsPage.navigate();
      await expect(page).toHaveTitle(/Credit Card/);
      logger.info('Application loaded successfully');
    });

    await test.step('Authenticate user', async () => {
      await analyticsPage.login('testuser_allcategories', 'Pass@123');
      logger.info('User authenticated successfully');
    });

    await test.step('Navigate to Analytics page', async () => {
      await analyticsPage.navigateToAnalytics();
      await analyticsPage.waitForCategoryVisualization();
      logger.info('Analytics page loaded');
    });

    await test.step('Verify all 9 categories displayed', async () => {
      const categories = await analyticsPage.getAllCategories();
      expect(categories).toHaveLength(9);
      const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      for (const category of expectedCategories) {
        expect(categories).toContain(category);
      }
      logger.info('All 9 categories verified');
    });

    await test.step('Verify spending amounts and percentages', async () => {
      const categoryData = await analyticsPage.getCategoryBreakdown();
      expect(categoryData['Food & Dining']).toEqual({ amount: 400, percentage: 20 });
      expect(categoryData['Fuel']).toEqual({ amount: 200, percentage: 10 });
      expect(categoryData['Shopping']).toEqual({ amount: 300, percentage: 15 });
      expect(categoryData['Travel']).toEqual({ amount: 250, percentage: 12.5 });
      expect(categoryData['Entertainment']).toEqual({ amount: 150, percentage: 7.5 });
      expect(categoryData['Utilities']).toEqual({ amount: 200, percentage: 10 });
      expect(categoryData['Healthcare']).toEqual({ amount: 200, percentage: 10 });
      expect(categoryData['Education']).toEqual({ amount: 150, percentage: 7.5 });
      expect(categoryData['Miscellaneous']).toEqual({ amount: 150, percentage: 7.5 });
      logger.info('All category amounts and percentages verified');
    });
  });

  test('QE-7995 TS-002 TC-001 - Verify partial category data visualization', async ({ page }) => {
    logger.info('Starting test: QE-7995 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Launch application', async () => {
      await analyticsPage.navigate();
      logger.info('Application loaded');
    });

    await test.step('Authenticate user with partial data', async () => {
      await analyticsPage.login('testuser_partial', 'Pass@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to Analytics page', async () => {
      await analyticsPage.navigateToAnalytics();
      await analyticsPage.waitForCategoryVisualization();
    });

    await test.step('Verify only 2 categories with data displayed', async () => {
      const visibleCategories = await analyticsPage.getVisibleCategoriesWithData();
      expect(visibleCategories).toHaveLength(2);
      const categoryData = await analyticsPage.getCategoryBreakdown();
      expect(categoryData['Food & Dining'].amount).toBe(300);
      expect(categoryData['Fuel'].amount).toBe(100);
      logger.info('Partial category data verified');
    });

    await test.step('Verify remaining categories show zero or excluded', async () => {
      const zeroCategories = await analyticsPage.getZeroValueCategories();
      expect(zeroCategories.length).toBeGreaterThanOrEqual(7);
      logger.info('Zero value categories verified');
    });
  });

  test('QE-7995 TS-003 TC-001 - Verify invalid category classified as Miscellaneous', async ({ page }) => {
    logger.info('Starting test: QE-7995 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_invalid', 'Pass@123');
    
    await test.step('Trigger category classification', async () => {
      await analyticsPage.triggerCategoryClassification('TXN-001', 150, 'Unknown');
      logger.info('Category classification triggered');
    });

    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryVisualization();

    await test.step('Verify invalid transaction in Miscellaneous', async () => {
      const categoryData = await analyticsPage.getCategoryBreakdown();
      expect(categoryData['Miscellaneous'].amount).toBe(150);
      logger.info('Invalid category correctly classified as Miscellaneous');
    });
  });

  test('QE-7993 TS-001 TC-001 - Verify monthly spend trends for 6 months', async ({ page }) => {
    logger.info('Starting test: QE-7993 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_trends', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    await test.step('Verify 6 month data points', async () => {
      await analyticsPage.waitForMonthlyTrendsChart();
      const monthlyData = await analyticsPage.getMonthlyTrendsData();
      expect(monthlyData).toHaveLength(6);
      logger.info('6 months of data verified');
    });

    await test.step('Verify monthly spend amounts', async () => {
      const monthlyData = await analyticsPage.getMonthlyTrendsData();
      expect(monthlyData).toEqual([
        { month: 'June 2026', amount: 800 },
        { month: 'July 2026', amount: 950 },
        { month: 'August 2026', amount: 1100 },
        { month: 'September 2026', amount: 1050 },
        { month: 'October 2026', amount: 900 },
        { month: 'November 2026', amount: 1250 }
      ]);
      logger.info('Monthly amounts verified');
    });
  });

  test('QE-7993 TS-002 TC-001 - Verify drill-down to specific month', async ({ page }) => {
    logger.info('Starting test: QE-7993 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_drilldown', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForMonthlyTrendsChart();

    await test.step('Select November 2026', async () => {
      await analyticsPage.selectMonthOnChart('November 2026');
      logger.info('November 2026 selected');
    });

    await test.step('Verify detailed transactions displayed', async () => {
      await analyticsPage.waitForTransactionDetails();
      const transactions = await analyticsPage.getDetailedTransactions();
      expect(transactions.length).toBeGreaterThan(0);
      for (const txn of transactions) {
        const txnDate = new Date(txn.date);
        expect(txnDate.getMonth()).toBe(10);
        expect(txnDate.getFullYear()).toBe(2026);
      }
      logger.info('November 2026 transactions verified');
    });
  });

  test('QE-7993 TS-003 TC-001 - Verify empty trend chart message', async ({ page }) => {
    logger.info('Starting test: QE-7993 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_nohistory', 'Pass@123');
    await analyticsPage.navigateToAnalytics();

    await test.step('Verify empty chart', async () => {
      const dataPoints = await analyticsPage.getMonthlyTrendsDataPoints();
      expect(dataPoints).toBe(0);
      logger.info('Chart is empty as expected');
    });

    await test.step('Verify insufficient data message', async () => {
      const message = await analyticsPage.getEmptyChartMessage();
      expect(message).toContain('Insufficient data to generate monthly trends');
      logger.info('Empty chart message verified');
    });
  });
});