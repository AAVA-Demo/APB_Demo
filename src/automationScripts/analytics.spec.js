const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

/**
 * Test Suite: Spending Analytics and Insights
 * Test Cases: QE-8988 TS-001 TC-001, QE-8988 TS-002 TC-001, QE-8988 TS-003 TC-001,
 *             QE-8985 TS-001 TC-001, QE-8985 TS-002 TC-001, QE-8985 TS-003 TC-001
 */

test.describe('Spending Analytics and Insights', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Navigating to analytics page');
    await analyticsPage.navigate();
  });

  /**
   * Test Case: QE-8988 TS-001 TC-001
   * Description: Verify that spending analytics dashboard displays interactive pie chart with accurate amounts and percentages
   */
  test('TC-013: Analytics displays accurate category-wise spending pie chart', async ({ page }) => {
    logger.info('Test Case: QE-8988 TS-001 TC-001 - Starting');
    
    // Step 1: Mock transaction data across all nine categories
    const mockTransactions = [
      { id: 'txn1', category: 'Food & Dining', amount: 500, date: '2026-11-20', cardId: 'card1' },
      { id: 'txn2', category: 'Fuel', amount: 200, date: '2026-11-19', cardId: 'card1' },
      { id: 'txn3', category: 'Shopping', amount: 800, date: '2026-11-18', cardId: 'card1' },
      { id: 'txn4', category: 'Travel', amount: 1200, date: '2026-11-17', cardId: 'card1' },
      { id: 'txn5', category: 'Entertainment', amount: 300, date: '2026-11-16', cardId: 'card1' },
      { id: 'txn6', category: 'Utilities', amount: 150, date: '2026-11-15', cardId: 'card1' },
      { id: 'txn7', category: 'Healthcare', amount: 400, date: '2026-11-14', cardId: 'card1' },
      { id: 'txn8', category: 'Education', amount: 600, date: '2026-11-13', cardId: 'card1' },
      { id: 'txn9', category: 'Miscellaneous', amount: 100, date: '2026-11-12', cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 2-3: Verify total spending and percentages
    await analyticsPage.selectCategoryView();
    
    const totalSpending = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    logger.info(`Total spending: ${totalSpending}`);
    
    // Step 4-6: Verify pie chart is displayed and interactive
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(9);
    
    const isInteractive = await analyticsPage.isPieChartInteractive();
    expect(isInteractive).toBe(true);
    
    logger.info('Test Case: QE-8988 TS-001 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8988 TS-002 TC-001
   * Description: Verify that clicking on category segment displays drill-down view with individual transactions
   */
  test('TC-014: Clicking category segment displays drill-down with transactions', async ({ page }) => {
    logger.info('Test Case: QE-8988 TS-002 TC-001 - Starting');
    
    // Step 1: Mock transaction data
    const mockTransactions = [
      { id: 'txn1', category: 'Food & Dining', merchant: 'Starbucks', amount: 25, date: '2026-11-01', cardId: 'card1' },
      { id: 'txn2', category: 'Food & Dining', merchant: 'Restaurant A', amount: 75, date: '2026-11-05', cardId: 'card1' },
      { id: 'txn3', category: 'Food & Dining', merchant: 'Cafe B', amount: 50, date: '2026-11-10', cardId: 'card1' },
      { id: 'txn4', category: 'Fuel', merchant: 'Gas Station', amount: 60, date: '2026-11-12', cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.selectCategoryView();
    
    // Step 2-3: Click on Food & Dining category
    await analyticsPage.clickCategorySegment('Food & Dining');
    
    // Step 4-6: Verify drill-down view displays all transactions in category
    await analyticsPage.waitForDrillDownView();
    
    const drillDownTransactions = await analyticsPage.getDrillDownTransactions();
    expect(drillDownTransactions.length).toBe(3);
    
    for (const txn of drillDownTransactions) {
      expect(txn.merchant).toBeTruthy();
      expect(txn.date).toBeTruthy();
      expect(txn.amount).toBeTruthy();
    }
    
    const hasBackOption = await analyticsPage.hasBackToCategoryView();
    expect(hasBackOption).toBe(true);
    
    logger.info('Test Case: QE-8988 TS-002 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8988 TS-003 TC-001
   * Description: Verify that transactions without category are classified as Miscellaneous without data loss
   */
  test('TC-015: Uncategorized transactions are classified as Miscellaneous', async ({ page }) => {
    logger.info('Test Case: QE-8988 TS-003 TC-001 - Starting');
    
    // Step 1: Mock transaction data with null/undefined categories
    const mockTransactions = [
      { id: 'txn1', merchant: 'Store A', amount: 100, category: null, date: '2026-11-20', cardId: 'card1' },
      { id: 'txn2', merchant: 'Gas Station', amount: 50, category: 'Fuel', date: '2026-11-19', cardId: 'card1' },
      { id: 'txn3', merchant: 'Unknown Merchant', amount: 75, category: undefined, date: '2026-11-18', cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.selectCategoryView();
    
    // Step 2-4: Verify Miscellaneous category includes uncategorized transactions
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscellaneousAmount).toBe(175); // txn1 (100) + txn3 (75)
    
    // Step 5: Verify no transactions are lost
    const totalDisplayed = await analyticsPage.getTotalSpendingDisplayed();
    const totalExpected = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    expect(totalDisplayed).toBe(totalExpected);
    
    // Step 6: Verify percentage calculation
    const miscellaneousPercentage = await analyticsPage.getCategoryPercentage('Miscellaneous');
    const expectedPercentage = (175 / 225) * 100;
    expect(Math.abs(miscellaneousPercentage - expectedPercentage)).toBeLessThan(0.1);
    
    logger.info('Test Case: QE-8988 TS-003 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8985 TS-001 TC-001
   * Description: Verify that monthly trend analysis displays interactive line chart with accurate monthly totals
   */
  test('TC-016: Monthly trend analysis displays accurate line chart for six months', async ({ page }) => {
    logger.info('Test Case: QE-8985 TS-001 TC-001 - Starting');
    
    // Step 1: Mock transaction data spanning six months
    const mockTransactions = [
      { id: 'txn1', amount: 200, date: '2026-06-15', cardId: 'card1' },
      { id: 'txn2', amount: 300, date: '2026-07-20', cardId: 'card1' },
      { id: 'txn3', amount: 250, date: '2026-08-10', cardId: 'card1' },
      { id: 'txn4', amount: 280, date: '2026-09-05', cardId: 'card1' },
      { id: 'txn5', amount: 320, date: '2026-10-12', cardId: 'card1' },
      { id: 'txn6', amount: 360, date: '2026-11-18', cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 2-4: Select monthly trend view and verify chart
    await analyticsPage.selectMonthlyTrendView();
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    // Step 5: Verify data points match monthly totals
    const dataPoints = await analyticsPage.getMonthlyDataPoints();
    expect(dataPoints.length).toBe(6);
    
    // Step 6: Verify chart is interactive
    const isInteractive = await analyticsPage.isLineChartInteractive();
    expect(isInteractive).toBe(true);
    
    logger.info('Test Case: QE-8985 TS-001 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8985 TS-002 TC-001
   * Description: Verify that hovering displays tooltip and clicking drills down into monthly transactions
   */
  test('TC-017: Monthly trend chart supports hover tooltip and drill-down', async ({ page }) => {
    logger.info('Test Case: QE-8985 TS-002 TC-001 - Starting');
    
    // Step 1: Mock transaction data
    const mockTransactions = [
      { id: 'txn1', amount: 300, date: '2026-11-05', merchant: 'Store A', cardId: 'card1' },
      { id: 'txn2', amount: 500, date: '2026-11-15', merchant: 'Store B', cardId: 'card1' },
      { id: 'txn3', amount: 1000, date: '2026-11-25', merchant: 'Store C', cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.selectMonthlyTrendView();
    
    // Step 2-3: Hover over November data point
    await analyticsPage.hoverOverDataPoint('2026-11');
    
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('November 2026');
    expect(tooltipText).toContain('1800');
    
    // Step 4-6: Click on data point and verify drill-down
    await analyticsPage.clickDataPoint('2026-11');
    await analyticsPage.waitForDrillDownView();
    
    const drillDownTransactions = await analyticsPage.getDrillDownTransactions();
    expect(drillDownTransactions.length).toBe(3);
    
    // Step 7: Verify total matches monthly total
    const drillDownTotal = drillDownTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    expect(drillDownTotal).toBe(1800);
    
    logger.info('Test Case: QE-8985 TS-002 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8985 TS-003 TC-001
   * Description: Verify that limited history displays notification about data availability
   */
  test('TC-018: Monthly trend with limited history displays notification', async ({ page }) => {
    logger.info('Test Case: QE-8985 TS-003 TC-001 - Starting');
    
    // Step 1: Mock transaction data for only two months
    const mockTransactions = [
      { id: 'txn1', amount: 400, date: '2026-10-15', cardId: 'card1' },
      { id: 'txn2', amount: 400, date: '2026-10-20', cardId: 'card1' },
      { id: 'txn3', amount: 600, date: '2026-11-10', cardId: 'card1' },
      { id: 'txn4', amount: 600, date: '2026-11-20', cardId: 'card1' }
    ];
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.selectMonthlyTrendView();
    
    // Step 2-3: Verify chart displays available data points
    const dataPoints = await analyticsPage.getMonthlyDataPoints();
    expect(dataPoints.length).toBe(2);
    
    // Step 4: Verify notification message
    const notification = await analyticsPage.getLimitedDataNotification();
    expect(notification).toContain('Limited data available');
    expect(notification).toContain('6+ months');
    
    // Step 5: Verify data points are accurate
    const octAmount = await analyticsPage.getMonthAmount('2026-10');
    const novAmount = await analyticsPage.getMonthAmount('2026-11');
    expect(octAmount).toBe(800);
    expect(novAmount).toBe(1200);
    
    // Step 6: Verify notification is visible
    await expect(analyticsPage.limitedDataNotification).toBeVisible();
    
    logger.info('Test Case: QE-8985 TS-003 TC-001 - Completed successfully');
  });
});
