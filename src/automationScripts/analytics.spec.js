const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Analytics - Monthly Spend Trend Analysis', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Navigating to Analytics section');
    await analyticsPage.navigate();
  });

  // Test Case ID: 5879 - QE-8959 TS-001 TC-001
  test('TC-5879: Verify user with 12+ months of transaction history can view interactive monthly spend trend chart', async ({ page }) => {
    logger.info('Test Case 5879: Testing monthly trend chart with 12+ months data');
    
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    await expect(analyticsPage.trendChart).toBeVisible();
    
    const dataPoints = await analyticsPage.getTrendDataPoints();
    logger.info(`Number of data points: ${dataPoints}`);
    expect(dataPoints).toBeGreaterThanOrEqual(12);
    
    await analyticsPage.verifyChartInteractivity();
    
    await analyticsPage.clickTrendDataPoint(0);
    await expect(analyticsPage.drillDownView).toBeVisible();
    
    logger.info('Trend chart verified successfully');
  });

  // Test Case ID: 5880 - QE-8959 TS-001 TC-002
  test('TC-5880: Verify monthly spend trend chart renders within 3 seconds performance requirement', async ({ page }) => {
    logger.info('Test Case 5880: Testing trend chart performance');
    
    await analyticsPage.login('testuser_12months', 'Pass@123');
    
    const startTime = Date.now();
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    await analyticsPage.waitForTrendChartLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Trend chart loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
    
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints).toBeGreaterThanOrEqual(12);
  });

  // Test Case ID: 5881 - QE-8959 TS-002 TC-001
  test('TC-5881: Verify user with less than 12 months of transaction history receives appropriate message', async ({ page }) => {
    logger.info('Test Case 5881: Testing insufficient historical data scenario');
    
    await analyticsPage.login('testuser_6months', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    const hasChart = await analyticsPage.trendChart.isVisible().catch(() => false);
    const hasMessage = await analyticsPage.insufficientDataMessage.isVisible().catch(() => false);
    
    if (hasChart) {
      const dataPoints = await analyticsPage.getTrendDataPoints();
      logger.info(`Partial chart displayed with ${dataPoints} data points`);
      expect(dataPoints).toBe(6);
      await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    } else if (hasMessage) {
      const messageText = await analyticsPage.insufficientDataMessage.textContent();
      logger.info(`Message displayed: ${messageText}`);
      expect(messageText).toContain('Insufficient historical data');
    }
  });

  // Test Case ID: 5882 - QE-8959 TS-003 TC-001
  test('TC-5882: Verify user can drill down into a specific month and view detailed transaction breakdown', async ({ page }) => {
    logger.info('Test Case 5882: Testing drill-down functionality');
    
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    await analyticsPage.clickTrendDataPoint(0);
    
    await expect(analyticsPage.drillDownView).toBeVisible();
    await expect(analyticsPage.categoryBreakdown).toBeVisible();
    
    const categories = await analyticsPage.getCategoryBreakdown();
    logger.info(`Categories displayed: ${categories.length}`);
    expect(categories.length).toBe(9);
    
    await expect(analyticsPage.transactionCount).toBeVisible();
    const count = await analyticsPage.transactionCount.textContent();
    logger.info(`Transaction count: ${count}`);
    expect(count).toMatch(/\d+/);
    
    await expect(analyticsPage.totalSpend).toBeVisible();
    const total = await analyticsPage.totalSpend.textContent();
    logger.info(`Total spend: ${total}`);
    expect(total).toMatch(/\$/);
  });
});

test.describe('Analytics - Category-Wise Spending Visualization', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  // Test Case ID: 5887 - QE-8957 TS-001 TC-001
  test('TC-5887: Verify user with transactions across multiple categories can view category-wise spending visualization', async ({ page }) => {
    logger.info('Test Case 5887: Testing category-wise spending visualization');
    
    await analyticsPage.login('testuser_multicategory', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    await expect(analyticsPage.categorySpendingChart).toBeVisible();
    
    const categories = await analyticsPage.getAllCategories();
    logger.info(`Categories displayed: ${categories.length}`);
    expect(categories.length).toBe(9);
    
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
    
    const amounts = await analyticsPage.getCategoryAmounts();
    logger.info(`Category amounts: ${JSON.stringify(amounts)}`);
    
    const percentages = await analyticsPage.getCategoryPercentages();
    const totalPercentage = percentages.reduce((sum, p) => sum + parseFloat(p), 0);
    logger.info(`Total percentage: ${totalPercentage}`);
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    await analyticsPage.verifyChartInteractivity();
  });

  // Test Case ID: 5888 - QE-8957 TS-001 TC-002
  test('TC-5888: Verify category-wise spending visualization renders within 3 seconds', async ({ page }) => {
    logger.info('Test Case 5888: Testing category visualization performance');
    
    await analyticsPage.login('testuser_multicategory', 'Pass@123');
    
    const startTime = Date.now();
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Category chart loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
    
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
  });

  // Test Case ID: 5889 - QE-8957 TS-002 TC-001
  test('TC-5889: Verify user with no transactions receives appropriate message or sees zero values', async ({ page }) => {
    logger.info('Test Case 5889: Testing no transactions scenario');
    
    await analyticsPage.login('testuser_notransactions', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    const hasChart = await analyticsPage.categorySpendingChart.isVisible().catch(() => false);
    const hasMessage = await analyticsPage.noDataMessage.isVisible().catch(() => false);
    
    if (hasMessage) {
      const messageText = await analyticsPage.noDataMessage.textContent();
      logger.info(`Message displayed: ${messageText}`);
      expect(messageText).toContain('No spending data available');
    } else if (hasChart) {
      const amounts = await analyticsPage.getCategoryAmounts();
      logger.info('Chart displayed with zero values');
      amounts.forEach(amount => {
        expect(amount).toBe('0');
      });
    }
    
    // Verify no crash or error
    await expect(analyticsPage.navigationMenu).toBeVisible();
  });

  // Test Case ID: 5891 - QE-8957 TS-003 TC-001
  test('TC-5891: Verify user can drill down into a specific spending category and view detailed transaction list', async ({ page }) => {
    logger.info('Test Case 5891: Testing category drill-down');
    
    await analyticsPage.login('testuser_multicategory', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.clickCategory('Food & Dining');
    
    await expect(analyticsPage.transactionList).toBeVisible();
    
    const transactions = await analyticsPage.getTransactionDetails();
    logger.info(`Number of transactions: ${transactions.length}`);
    
    for (const transaction of transactions) {
      expect(transaction.merchant).toBeTruthy();
      expect(transaction.date).toBeTruthy();
      expect(transaction.amount).toMatch(/\$/);
      expect(transaction.description).toBeTruthy();
    }
    
    await expect(analyticsPage.categoryTotal).toBeVisible();
    const total = await analyticsPage.categoryTotal.textContent();
    logger.info(`Category total: ${total}`);
    expect(total).toMatch(/\$/);
  });
});