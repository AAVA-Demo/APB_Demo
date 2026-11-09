const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');
const logger = require('../utils/logger');

test.describe('Analytics and Spending Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    logger.info('Test setup: Navigating to application');
    await loginPage.navigate();
  });

  test('TC-4646: Verify category-wise spending pie chart displays correctly with 9 categories', async ({ page }) => {
    logger.info('Starting test: Category-wise spending visualization');
    
    await loginPage.login(testData.users.category_user.username, testData.users.category_user.password);
    logger.info('Logged in with user having transactions across multiple categories');
    
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to spending analytics page');
    
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    logger.info('Interactive pie chart is displayed');
    
    const categories = await analyticsPage.getCategorySegments();
    expect(categories.length).toBeGreaterThanOrEqual(8);
    logger.info(`Chart displays ${categories.length} category segments`);
    
    const expectedCategories = [
      { name: 'Food & Dining', amount: 2500, percentage: 25 },
      { name: 'Fuel', amount: 1800, percentage: 18 },
      { name: 'Shopping', amount: 3200, percentage: 32 },
      { name: 'Travel', amount: 1200, percentage: 12 },
      { name: 'Entertainment', amount: 800, percentage: 8 },
      { name: 'Utilities', amount: 300, percentage: 3 },
      { name: 'Healthcare', amount: 150, percentage: 1.5 },
      { name: 'Miscellaneous', amount: 50, percentage: 0.5 }
    ];
    
    for (const expected of expectedCategories) {
      const segment = await analyticsPage.getCategorySegment(expected.name);
      expect(segment).toBeTruthy();
      expect(segment.amount).toBe(expected.amount);
      expect(segment.percentage).toBeCloseTo(expected.percentage, 1);
      logger.info(`Verified ${expected.name}: $${expected.amount} (${expected.percentage}%)`);
    }
    
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe(10000);
    logger.info('Total spending calculation verified: $10,000');
    
    logger.info('Test completed successfully: Category-wise spending chart validated');
  });

  test('TC-4647: Verify category drill-down displays detailed transaction list', async ({ page }) => {
    logger.info('Starting test: Category drill-down functionality');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to spending analytics page');
    
    await analyticsPage.clickCategorySegment('Food & Dining');
    logger.info('Clicked on Food & Dining category segment');
    
    await expect(analyticsPage.drillDownView).toBeVisible();
    logger.info('Drill-down view displayed');
    
    const transactions = await analyticsPage.getDrillDownTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    logger.info(`Drill-down shows ${transactions.length} transactions`);
    
    for (const txn of transactions) {
      expect(txn.merchantName).toBeTruthy();
      expect(txn.date).toBeTruthy();
      expect(txn.amount).toBeGreaterThan(0);
      logger.info(`Transaction: ${txn.merchantName} - $${txn.amount} on ${txn.date}`);
    }
    
    const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    expect(totalAmount).toBe(2500);
    logger.info('Total amount of transactions matches category total: $2,500');
    
    const isSortable = await analyticsPage.verifyTransactionsSortable();
    expect(isSortable).toBe(true);
    logger.info('Transactions are sortable for pattern analysis');
    
    logger.info('Test completed successfully: Category drill-down validated');
  });

  test('TC-4648: Verify system displays message when user has no transaction history', async ({ page }) => {
    logger.info('Starting test: No transaction history handling');
    
    await loginPage.login(testData.users.new_user_no_txn.username, testData.users.new_user_no_txn.password);
    logger.info('Logged in with user having no transaction history');
    
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to spending analytics page');
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const messageText = await analyticsPage.noDataMessage.textContent();
    expect(messageText).toContain('Insufficient categorized data');
    expect(messageText).toContain('Start using your credit card');
    logger.info('Appropriate message displayed for no transaction history');
    
    const chartVisible = await analyticsPage.categoryPieChart.isVisible();
    expect(chartVisible).toBe(false);
    logger.info('No pie chart displayed (or empty placeholder shown)');
    
    logger.info('Test completed successfully: No transaction history handling validated');
  });

  test('TC-4649: Verify system displays 100% Miscellaneous when all transactions uncategorized', async ({ page }) => {
    logger.info('Starting test: All transactions miscellaneous handling');
    
    await loginPage.login(testData.users.uncategorized_user.username, testData.users.uncategorized_user.password);
    logger.info('Logged in with user having all transactions as Miscellaneous');
    
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to spending analytics page');
    
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    logger.info('Pie chart is displayed');
    
    const segments = await analyticsPage.getCategorySegments();
    expect(segments.length).toBe(1);
    expect(segments[0].name).toBe('Miscellaneous');
    expect(segments[0].percentage).toBe(100);
    logger.info('Chart displays 100% Miscellaneous spending');
    
    await expect(analyticsPage.categorizationPrompt).toBeVisible();
    const promptText = await analyticsPage.categorizationPrompt.textContent();
    expect(promptText).toContain('Review your transactions');
    logger.info('Informational message prompts user to review categorization');
    
    await analyticsPage.clickCategorySegment('Miscellaneous');
    await expect(analyticsPage.drillDownView).toBeVisible();
    logger.info('User can drill down into Miscellaneous transactions');
    
    logger.info('Test completed successfully: All miscellaneous handling validated');
  });

  test('TC-4636: Verify monthly spend trend chart displays correctly with 6+ months data', async ({ page }) => {
    logger.info('Starting test: Monthly spend trend chart with historical data');
    
    await loginPage.login(testData.users.historical_user.username, testData.users.historical_user.password);
    logger.info('Logged in with user having 6+ months transaction history');
    
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to analytics page');
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    logger.info('Monthly spend trend line chart is displayed');
    
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(6);
    logger.info(`Chart displays ${dataPoints.length} months of data`);
    
    const expectedData = [
      { month: 'Aug 2023', amount: 8500 },
      { month: 'Sep 2023', amount: 9200 },
      { month: 'Oct 2023', amount: 7800 },
      { month: 'Nov 2023', amount: 10500 },
      { month: 'Dec 2023', amount: 12000 },
      { month: 'Jan 2024', amount: 10000 }
    ];
    
    for (const expected of expectedData) {
      const dataPoint = dataPoints.find(dp => dp.month === expected.month);
      expect(dataPoint).toBeTruthy();
      expect(dataPoint.amount).toBe(expected.amount);
      logger.info(`Verified ${expected.month}: $${expected.amount}`);
    }
    
    const axesLabeled = await analyticsPage.verifyChartAxesLabeled();
    expect(axesLabeled).toBe(true);
    logger.info('Chart axes are clearly labeled (X: months, Y: spending)');
    
    await analyticsPage.hoverOverDataPoint('Dec 2023');
    await expect(analyticsPage.tooltip).toBeVisible();
    const tooltipText = await analyticsPage.tooltip.textContent();
    expect(tooltipText).toContain('Dec 2023');
    expect(tooltipText).toContain('$12,000');
    logger.info('Tooltip displays exact spending amount on hover');
    
    logger.info('Test completed successfully: Monthly trend chart validated');
  });

  test('TC-4637: Verify drill-down displays detailed breakdown when clicking month data point', async ({ page }) => {
    logger.info('Starting test: Monthly data point drill-down');
    
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    logger.info('User logged in successfully');
    
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to analytics page');
    
    await analyticsPage.clickTrendDataPoint('Dec 2023');
    logger.info('Clicked on Dec 2023 data point');
    
    await expect(analyticsPage.drillDownPanel).toBeVisible();
    logger.info('Drill-down panel displayed');
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(categoryBreakdown).toBeTruthy();
    logger.info('Category-wise distribution displayed for December 2023');
    
    const categoryTotal = Object.values(categoryBreakdown).reduce((sum, val) => sum + val, 0);
    expect(categoryTotal).toBe(12000);
    logger.info('Category breakdown totals $12,000');
    
    const cardWiseBreakdown = await analyticsPage.getCardWiseBreakdown();
    expect(cardWiseBreakdown).toBeTruthy();
    expect(cardWiseBreakdown['CC001']).toBe(8000);
    expect(cardWiseBreakdown['CC002']).toBe(4000);
    logger.info('Card-wise spend analysis displayed: CC001 ($8,000), CC002 ($4,000)');
    
    logger.info('Test completed successfully: Monthly drill-down validated');
  });

  test('TC-4638: Verify system displays message when user has less than 6 months history', async ({ page }) => {
    logger.info('Starting test: Limited historical data handling');
    
    await loginPage.login(testData.users.new_user.username, testData.users.new_user.password);
    logger.info('Logged in with user having only 2-3 months transaction history');
    
    await analyticsPage.navigateToAnalytics();
    logger.info('Navigated to analytics page');
    
    await expect(analyticsPage.limitedDataMessage).toBeVisible();
    const messageText = await analyticsPage.limitedDataMessage.textContent();
    expect(messageText).toContain('Trend analysis is most meaningful with at least 6 months');
    expect(messageText).toContain('Displaying available data');
    logger.info('Informational message displayed regarding limited historical data');
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    logger.info('Chart renders with available data points');
    
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(2);
    expect(dataPoints.length).toBeLessThan(6);
    logger.info(`Chart displays ${dataPoints.length} months of available data`);
    
    const isInteractive = await analyticsPage.verifyChartInteractive();
    expect(isInteractive).toBe(true);
    logger.info('Chart remains interactive despite limited data');
    
    logger.info('Test completed successfully: Limited historical data handling validated');
  });
});
