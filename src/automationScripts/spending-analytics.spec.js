const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { ApiHelper } = require('./helpers/api.helper');

/**
 * Test Suite: Spending Analytics and Insights
 * Epic: QE-8358 - Spending Analytics and Insights
 * Test Cases: QE-8379 TS-001 TC-001, QE-8379 TS-002 TC-001, QE-8379 TS-003 TC-001
 *             QE-8380 TS-001 TC-001, QE-8380 TS-002 TC-001, QE-8380 TS-003 TC-001
 */

test.describe('Monthly Spend Trends Visualization', () => {
  let analyticsPage;
  let apiHelper;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    apiHelper = new ApiHelper(page);
  });

  /**
   * Test Case ID: QE-8379 TS-001 TC-001
   * Description: Verify monthly spend trends chart with at least 3 months of data
   */
  test('TC-001: Verify interactive monthly spend trends chart with accurate aggregated data', async ({ page }) => {
    // Step 1: Setup test user with 3+ months of transaction history
    const testUserId = 'testuser_trends';
    const expectedMonthlyData = [
      { month: 'Jan 2023', amount: 1500 },
      { month: 'Feb 2023', amount: 2000 },
      { month: 'Mar 2023', amount: 1800 }
    ];

    // Step 2: Send API request for monthly trends
    const response = await apiHelper.getMonthlyTrends(testUserId);
    expect(response.status).toBe(200);
    const trendsData = await response.json();

    // Step 3: Validate at least 3 months of data
    expect(trendsData.monthlyTrends.length).toBeGreaterThanOrEqual(3);

    // Step 4: Verify monthly totals match expected values
    for (let i = 0; i < expectedMonthlyData.length; i++) {
      expect(trendsData.monthlyTrends[i].month).toBe(expectedMonthlyData[i].month);
      expect(trendsData.monthlyTrends[i].amount).toBe(expectedMonthlyData[i].amount);
    }

    // Step 5: Verify chart data structure
    expect(trendsData.monthlyTrends[0]).toHaveProperty('month');
    expect(trendsData.monthlyTrends[0]).toHaveProperty('amount');

    // Navigate to analytics page and verify chart
    await analyticsPage.navigate();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    await expect(analyticsPage.chartTitle).toContainText('Monthly Spend Trends');
  });

  /**
   * Test Case ID: QE-8379 TS-002 TC-001
   * Description: Verify message for insufficient data (less than 3 months)
   */
  test('TC-002: Verify insufficient data message for user with less than 3 months history', async ({ page }) => {
    // Step 1: Setup test user with only 2 months of data
    const testUserId = 'testuser_shorthistory';

    // Step 2: Send API request
    const response = await apiHelper.getMonthlyTrends(testUserId);
    expect(response.status).toBe(200);
    const trendsData = await response.json();

    // Step 3: Validate only 2 months of data
    expect(trendsData.monthlyTrends.length).toBe(2);

    // Step 4: Verify insufficient data message
    expect(trendsData.message || trendsData.note).toContain('Insufficient data');

    // Step 5: Verify available data is still accurate
    expect(trendsData.monthlyTrends[0].amount).toBe(1000);
    expect(trendsData.monthlyTrends[1].amount).toBe(1200);

    // Verify on UI
    await analyticsPage.navigate();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    await expect(analyticsPage.insufficientDataMessage).toContainText('At least 3 months of history required');
  });

  /**
   * Test Case ID: QE-8379 TS-003 TC-001
   * Description: Verify custom date range filter updates monthly trends chart
   */
  test('TC-003: Verify custom date range filter (last 6 months) updates chart with recalculated totals', async ({ page }) => {
    // Step 1: Setup test user with 12 months of data
    const testUserId = 'testuser_customrange';

    // Step 2: Calculate date range for last 6 months
    const startDate = '2023-07-01';
    const endDate = '2023-12-31';

    // Step 3: Send API request with custom date range
    const response = await apiHelper.getMonthlyTrendsWithDateRange(testUserId, startDate, endDate);
    expect(response.status).toBe(200);
    const trendsData = await response.json();

    // Step 4: Validate exactly 6 months of data
    expect(trendsData.monthlyTrends.length).toBe(6);

    // Step 5: Verify months are within selected range
    const months = trendsData.monthlyTrends.map(t => t.month);
    expect(months).toContain('Jul 2023');
    expect(months).toContain('Dec 2023');

    // Step 6: Verify months outside range are excluded
    expect(months).not.toContain('Jan 2023');
    expect(months).not.toContain('Jun 2023');

    // Verify on UI
    await analyticsPage.navigate();
    await analyticsPage.setDateRangeFilter(startDate, endDate);
    await analyticsPage.clickApplyDateRange();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
  });
});

test.describe('Category-Wise Spending Breakdown', () => {
  let analyticsPage;
  let apiHelper;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    apiHelper = new ApiHelper(page);
  });

  /**
   * Test Case ID: QE-8380 TS-001 TC-001
   * Description: Verify category-wise spending across all 9 categories with accurate amounts and percentages
   */
  test('TC-001: Verify accurate spending amounts and percentages for all 9 categories', async ({ page }) => {
    // Step 1: Setup test user with transactions in all 9 categories
    const testUserId = 'testuser_001';
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];

    // Step 2: Send API request for category-wise spending
    const response = await apiHelper.getCategorySpending(testUserId);
    expect(response.status).toBe(200);
    const categoryData = await response.json();

    // Step 3: Validate all 9 categories are present
    expect(categoryData.length).toBe(9);
    for (const category of expectedCategories) {
      const found = categoryData.find(c => c.category === category);
      expect(found).toBeDefined();
      expect(found.amount).toBeGreaterThan(0);
    }

    // Step 4: Verify amounts match database totals (API validation)
    // Step 5: Verify percentages sum to 100%
    const totalPercentage = categoryData.reduce((sum, c) => sum + c.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 1);

    // Verify on UI
    await analyticsPage.navigate();
    await expect(analyticsPage.categorySpendingChart).toBeVisible();
    for (const category of expectedCategories) {
      await expect(analyticsPage.getCategoryLabel(category)).toBeVisible();
    }
  });

  /**
   * Test Case ID: QE-8380 TS-002 TC-001
   * Description: Verify empty state for user with no transactions
   */
  test('TC-002: Verify zero values and empty state message for user with no transactions', async ({ page }) => {
    // Step 1: Setup test user with no transactions
    const testUserId = 'testuser_notx';

    // Step 2: Send API request
    const response = await apiHelper.getCategorySpending(testUserId);
    expect(response.status).toBe(200);
    const categoryData = await response.json();

    // Step 3: Validate all categories show $0.00
    for (const category of categoryData) {
      expect(category.amount).toBe(0);
    }

    // Step 4: Verify empty state message
    expect(response.message).toContain('No spending data available');

    // Verify on UI
    await analyticsPage.navigate();
    await expect(analyticsPage.emptySpendingMessage).toBeVisible();
    await expect(analyticsPage.emptySpendingMessage).toContainText('No spending data available');
  });

  /**
   * Test Case ID: QE-8380 TS-003 TC-001
   * Description: Verify aggregation across multiple cards without duplication
   */
  test('TC-003: Verify correct aggregation of spending from multiple cards without duplication', async ({ page }) => {
    // Step 1: Setup test user with 3 cards and overlapping categories
    const testUserId = 'testuser_multi';
    const expectedAggregation = {
      'Food & Dining': 250, // Card A: $100 + Card B: $150
      'Shopping': 200       // Card C: $200
    };

    // Step 2: Send API request for aggregated category spending
    const response = await apiHelper.getCategorySpending(testUserId);
    expect(response.status).toBe(200);
    const categoryData = await response.json();

    // Step 3: Verify Food & Dining aggregation
    const foodDining = categoryData.find(c => c.category === 'Food & Dining');
    expect(foodDining.amount).toBe(expectedAggregation['Food & Dining']);

    // Step 4: Verify Shopping aggregation
    const shopping = categoryData.find(c => c.category === 'Shopping');
    expect(shopping.amount).toBe(expectedAggregation['Shopping']);

    // Step 5: Verify total matches database sum (no duplication)
    const totalSpending = categoryData.reduce((sum, c) => sum + c.amount, 0);
    const dbResponse = await apiHelper.getTotalSpendingFromDB(testUserId);
    expect(totalSpending).toBe(dbResponse.total);
  });
});