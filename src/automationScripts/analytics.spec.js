const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

/**
 * Test Suite: Spending Analytics and Category Insights
 * Epic: QE-9528 - Spending Analytics and Category Insights
 * User Story: QE-9651 - Category-Wise Spending Visualization
 * User Story: QE-9653 - Interactive Spending Pattern Analysis
 */

test.describe('Spending Analytics and Category Insights', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  /**
   * Test Case ID: QE-9807 TS-001 TC-001
   * Scenario: Analytics dashboard renders category-wise spending chart within 1 second
   * Test Data: Categories: Food & Dining, Fuel, Shopping, Travel, Entertainment
   */
  test('TC-6891: Verify category-wise spending chart renders within 1 second', async () => {
    const startTime = Date.now();
    
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThanOrEqual(1000);
    
    await analyticsPage.verifyAllCategoriesDisplayed();
    
    await analyticsPage.verifyChartInteractivity();
  });

  /**
   * Test Case ID: QE-9807 TS-002 TC-001
   * Scenario: System displays empty state message when no transactions exist
   * Test Data: User ID: user_new, Current Month Transactions: 0
   */
  test('TC-6892: Verify empty state message when no transactions available', async ({ page }) => {
    await page.route('**/api/analytics/category-spending*', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    const messageText = await analyticsPage.emptyStateMessage.textContent();
    expect(messageText).toContain('No spending data available');
    
    await expect(analyticsPage.emptyStateIcon).toBeVisible();
  });

  /**
   * Test Case ID: QE-9807 TS-003 TC-001
   * Scenario: Sum of category amounts equals total monthly spend
   * Test Data: Expected Monthly Spend: $2,500
   */
  test('TC-6893: Verify data integrity - category sum equals monthly spend', async ({ page }) => {
    const mockCategoryData = [
      { categoryId: '1', categoryName: 'Food & Dining', totalAmount: 500, percentage: 20, transactionCount: 10 },
      { categoryId: '2', categoryName: 'Fuel', totalAmount: 300, percentage: 12, transactionCount: 8 },
      { categoryId: '3', categoryName: 'Shopping', totalAmount: 700, percentage: 28, transactionCount: 15 },
      { categoryId: '4', categoryName: 'Travel', totalAmount: 400, percentage: 16, transactionCount: 5 },
      { categoryId: '5', categoryName: 'Entertainment', totalAmount: 200, percentage: 8, transactionCount: 6 },
      { categoryId: '6', categoryName: 'Utilities', totalAmount: 150, percentage: 6, transactionCount: 4 },
      { categoryId: '7', categoryName: 'Healthcare', totalAmount: 100, percentage: 4, transactionCount: 3 },
      { categoryId: '8', categoryName: 'Education', totalAmount: 50, percentage: 2, transactionCount: 2 },
      { categoryId: '9', categoryName: 'Miscellaneous', totalAmount: 100, percentage: 4, transactionCount: 5 }
    ];
    
    await page.route('**/api/analytics/category-spending*', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockCategoryData) });
    });
    
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    const categorySum = await analyticsPage.calculateCategorySum();
    expect(categorySum).toBe(2500);
    
    await analyticsPage.verifyAllTransactionsCategorized();
  });

  /**
   * Test Case ID: QE-9806 TS-001 TC-001
   * Scenario: Clicking category displays detailed spending pattern within 1 second
   * Test Data: Selected Category: Food & Dining
   */
  test('TC-6894: Verify category drill-down displays detailed analysis within 1 second', async ({ page }) => {
    const mockTransactions = [
      { transactionId: 'tx1', date: '2026-11-01', description: 'Restaurant ABC', amount: 50 },
      { transactionId: 'tx2', date: '2026-11-05', description: 'Grocery Store', amount: 120 }
    ];
    
    await page.route('**/api/transactions?categoryId=1*', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockTransactions) });
    });
    
    await analyticsPage.waitForAnalyticsLoad();
    
    const startTime = Date.now();
    await analyticsPage.clickCategorySegment('Food & Dining');
    
    await expect(analyticsPage.drillDownView).toBeVisible();
    const drillDownTime = Date.now() - startTime;
    expect(drillDownTime).toBeLessThanOrEqual(1000);
    
    await analyticsPage.verifyTransactionBreakdownDisplayed();
    await analyticsPage.verifyMonthlyTrendsDisplayed();
    await analyticsPage.verifyCategoryMetricsDisplayed();
  });

  /**
   * Test Case ID: QE-9806 TS-002 TC-001
   * Scenario: System updates detailed view correctly when drilling into multiple categories
   * Test Data: Category 1: Food & Dining ($500), Category 2: Travel ($400), Category 3: Shopping ($700)
   */
  test('TC-6895: Verify data isolation when drilling into multiple categories sequentially', async ({ page }) => {
    await page.route('**/api/transactions?categoryId=1*', route => {
      route.fulfill({ status: 200, body: JSON.stringify([
        { transactionId: 'tx1', date: '2026-11-01', description: 'Restaurant', amount: 50 },
        { transactionId: 'tx2', date: '2026-11-02', description: 'Grocery', amount: 120 }
      ]) });
    });
    
    await page.route('**/api/transactions?categoryId=4*', route => {
      route.fulfill({ status: 200, body: JSON.stringify([
        { transactionId: 'tx3', date: '2026-11-03', description: 'Flight Booking', amount: 400 }
      ]) });
    });
    
    await page.route('**/api/transactions?categoryId=3*', route => {
      route.fulfill({ status: 200, body: JSON.stringify([
        { transactionId: 'tx4', date: '2026-11-04', description: 'Online Store', amount: 200 },
        { transactionId: 'tx5', date: '2026-11-05', description: 'Electronics', amount: 500 }
      ]) });
    });
    
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickCategorySegment('Food & Dining');
    const foodTransactionCount = await analyticsPage.getTransactionCount();
    expect(foodTransactionCount).toBe(2);
    
    await analyticsPage.closeDrillDown();
    
    await analyticsPage.clickCategorySegment('Travel');
    const travelTransactionCount = await analyticsPage.getTransactionCount();
    expect(travelTransactionCount).toBe(1);
    expect(travelTransactionCount).not.toBe(foodTransactionCount);
    
    await analyticsPage.closeDrillDown();
    
    await analyticsPage.clickCategorySegment('Shopping');
    const shoppingTransactionCount = await analyticsPage.getTransactionCount();
    expect(shoppingTransactionCount).toBe(2);
  });

  /**
   * Test Case ID: QE-9806 TS-003 TC-001
   * Scenario: System displays appropriate message for category with no transactions
   * Test Data: Category: Healthcare, Amount: $0
   */
  test('TC-6896: Verify message display for category with no transactions', async ({ page }) => {
    await page.route('**/api/transactions?categoryId=7*', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickCategorySegment('Healthcare');
    
    await expect(analyticsPage.noCategoryDataMessage).toBeVisible();
    const messageText = await analyticsPage.noCategoryDataMessage.textContent();
    expect(messageText).toContain('No transactions available for Healthcare');
    
    await expect(analyticsPage.closeButton).toBeVisible();
    await analyticsPage.closeDrillDown();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
  });
});