const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');

test.describe('Analytics and Spending Trends Tests - CreditCardNew20261109190104', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    Logger.info('Navigating to analytics page');
    await analyticsPage.navigate();
  });

  test('TC-6004: Verify monthly spend trend returns accurate aggregated data for 12 months', async ({ page }) => {
    Logger.info('Test Case ID: QE-9023 TS-001 TC-001');
    
    // Step 1: Prepare test data - 12 months of transaction history
    const testData = {
      userId: 'user123',
      period: '12months',
      expectedMonthlySpend: [
        { month: 'Jan', amount: 1200 },
        { month: 'Feb', amount: 1500 },
        { month: 'Mar', amount: 1800 },
        { month: 'Apr', amount: 1600 },
        { month: 'May', amount: 2000 },
        { month: 'Jun', amount: 2200 },
        { month: 'Jul', amount: 1900 },
        { month: 'Aug', amount: 2100 },
        { month: 'Sep', amount: 1700 },
        { month: 'Oct', amount: 2300 },
        { month: 'Nov', amount: 2500 },
        { month: 'Dec', amount: 2400 }
      ]
    };
    
    // Step 2: Send API request to retrieve monthly spend trend data
    const response = await analyticsPage.getMonthlyTrends(testData.userId, testData.period);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with trend analysis data');
    
    const trendData = await response.json();
    
    // Step 3: Validate response contains exactly 12 monthly data points
    await expect(trendData.monthlyTrends.length).toBe(12);
    Logger.info('Response contains 12 monthly data points');
    
    // Step 4: Verify monthly spending totals match expected amounts
    for (let i = 0; i < 12; i++) {
      await expect(trendData.monthlyTrends[i].totalSpend).toBe(testData.expectedMonthlySpend[i].amount);
    }
    Logger.info('Monthly spending totals validated');
    
    // Step 5: Validate chronological ordering
    await expect(trendData.monthlyTrends[0].month).toContain('Jan');
    await expect(trendData.monthlyTrends[11].month).toContain('Dec');
    Logger.info('Chronological ordering validated');
    
    // Step 6: Verify trend indicators are correctly calculated
    await expect(trendData.monthlyTrends[1].trend).toBe('increasing');
    await expect(trendData.monthlyTrends[3].trend).toBe('decreasing');
    Logger.info('Trend indicators validated');
  });

  test('TC-6005: Verify monthly spend trend calculates correct percentage changes', async ({ page }) => {
    Logger.info('Test Case ID: QE-9023 TS-001 TC-002');
    
    // Step 1: Prepare test data with known spending amounts
    const testData = {
      userId: 'user456',
      includePercentageChange: true,
      expectedData: [
        { month: 'Month1', amount: 1000, percentageChange: null },
        { month: 'Month2', amount: 1200, percentageChange: 20 },
        { month: 'Month3', amount: 900, percentageChange: -25 },
        { month: 'Month4', amount: 1350, percentageChange: 50 }
      ]
    };
    
    // Step 2: Send API request with percentage change flag
    const response = await analyticsPage.getMonthlyTrendsWithPercentage(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with percentage changes');
    
    const trendData = await response.json();
    
    // Step 3: Validate percentage change from Month1 to Month2
    await expect(trendData.monthlyTrends[1].percentageChange).toBeCloseTo(20, 1);
    Logger.info('Month2 percentage change validated: +20%');
    
    // Step 4: Validate percentage change from Month2 to Month3
    await expect(trendData.monthlyTrends[2].percentageChange).toBeCloseTo(-25, 1);
    Logger.info('Month3 percentage change validated: -25%');
    
    // Step 5: Validate percentage change from Month3 to Month4
    await expect(trendData.monthlyTrends[3].percentageChange).toBeCloseTo(50, 1);
    Logger.info('Month4 percentage change validated: +50%');
    
    // Step 6: Verify first month has no percentage change
    await expect(trendData.monthlyTrends[0].percentageChange).toBeNull();
    Logger.info('Month1 has no percentage change (baseline)');
  });

  test('TC-6006: Verify system returns empty trend dataset when user has no transaction history', async ({ page }) => {
    Logger.info('Test Case ID: QE-9023 TS-002 TC-001');
    
    // Step 1: Prepare test data - user with no transactions
    const testData = {
      userId: 'user999',
      transactionCount: 0
    };
    
    // Step 2: Send API request to retrieve monthly spend trend
    const response = await analyticsPage.getMonthlyTrends(testData.userId, '12months');
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK (not error)');
    
    const trendData = await response.json();
    
    // Step 3: Validate response contains empty trend data array
    await expect(trendData.monthlyTrends).toEqual([]);
    await expect(trendData.monthlyTrends.length).toBe(0);
    Logger.info('Empty trend data array validated');
    
    // Step 4: Verify response includes appropriate messaging
    await expect(trendData.message).toContain('Insufficient data for trend analysis');
    await expect(trendData.message).toContain('No transaction history available');
    Logger.info('Appropriate messaging validated');
    
    // Step 5: Validate response metadata
    await expect(trendData.metadata.dataAvailable).toBe(false);
    await expect(trendData.metadata.reason).toBe('no_transactions');
    Logger.info('Metadata validated');
  });

  test('TC-6007: Verify custom date range filter returns only 6-month trend data', async ({ page }) => {
    Logger.info('Test Case ID: QE-9023 TS-003 TC-001');
    
    // Step 1: Prepare test data - 24 months of history
    const testData = {
      userId: 'user789',
      startDate: '2024-07-01',
      endDate: '2024-12-31'
    };
    
    // Step 2: Send API request with custom date range filter
    const response = await analyticsPage.getMonthlyTrendsWithDateRange(
      testData.userId,
      testData.startDate,
      testData.endDate
    );
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with filtered data');
    
    const trendData = await response.json();
    
    // Step 3: Validate response contains exactly 6 monthly data points
    await expect(trendData.monthlyTrends.length).toBe(6);
    Logger.info('Response contains exactly 6 months');
    
    // Step 4: Verify no data from 2023 or Jan-Jun 2024
    const allMonths = trendData.monthlyTrends.map(t => t.month);
    await expect(allMonths.every(m => m.includes('2024'))).toBe(true);
    await expect(allMonths.every(m => !m.includes('2023'))).toBe(true);
    Logger.info('No data from outside date range');
    
    // Step 5: Validate spending calculations exclude outside transactions
    for (const monthData of trendData.monthlyTrends) {
      await expect(monthData.totalSpend).toBeGreaterThanOrEqual(2500);
      await expect(monthData.totalSpend).toBeLessThanOrEqual(3500);
    }
    Logger.info('Spending calculations validated for date range');
    
    // Step 6: Verify trend indicators calculated within filtered period
    await expect(trendData.monthlyTrends[0].month).toContain('Jul');
    await expect(trendData.monthlyTrends[5].month).toContain('Dec');
    Logger.info('Trend indicators calculated within filtered period');
  });

  test('TC-6008: Verify category-wise spending returns accurate totals for all 9 categories', async ({ page }) => {
    Logger.info('Test Case ID: QE-9022 TS-001 TC-001');
    
    // Step 1: Prepare test data - transactions across all 9 categories
    const testData = {
      userId: 'user123',
      expectedCategories: [
        { category: 'Food & Dining', amount: 1200, percentage: 19.35 },
        { category: 'Fuel', amount: 300, percentage: 4.84 },
        { category: 'Shopping', amount: 800, percentage: 12.90 },
        { category: 'Travel', amount: 1500, percentage: 24.19 },
        { category: 'Entertainment', amount: 400, percentage: 6.45 },
        { category: 'Utilities', amount: 600, percentage: 9.68 },
        { category: 'Healthcare', amount: 500, percentage: 8.06 },
        { category: 'Education', amount: 700, percentage: 11.29 },
        { category: 'Miscellaneous', amount: 200, percentage: 3.23 }
      ],
      totalSpend: 6200
    };
    
    // Step 2: Send API request to retrieve category-wise spending
    const response = await analyticsPage.getCategorySpending(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with category breakdown');
    
    const categoryData = await response.json();
    
    // Step 3: Validate spending totals for each category
    for (const expected of testData.expectedCategories) {
      const actual = categoryData.categories.find(c => c.category === expected.category);
      await expect(actual.totalAmount).toBe(expected.amount);
    }
    Logger.info('Spending totals validated for all categories');
    
    // Step 4: Verify percentage distribution
    for (const expected of testData.expectedCategories) {
      const actual = categoryData.categories.find(c => c.category === expected.category);
      await expect(actual.percentage).toBeCloseTo(expected.percentage, 1);
    }
    Logger.info('Percentage distribution validated');
    
    // Step 5: Validate sum of all percentages equals 100%
    const totalPercentage = categoryData.categories.reduce((sum, c) => sum + c.percentage, 0);
    await expect(totalPercentage).toBeCloseTo(100, 0.1);
    Logger.info('Total percentage sums to 100%');
    
    // Step 6: Verify all 9 categories are present
    await expect(categoryData.categories.length).toBe(9);
    Logger.info('All 9 categories present in response');
  });

  test('TC-6009: Verify unclassified transactions are categorized under Miscellaneous', async ({ page }) => {
    Logger.info('Test Case ID: QE-9022 TS-002 TC-001');
    
    // Step 1: Prepare test data - transactions with missing/invalid categories
    const testData = {
      userId: 'user456',
      transactions: [
        { amount: 100, category: null },
        { amount: 150, category: '' },
        { amount: 200, category: 'INVALID' },
        { amount: 250, category: 'Unknown' }
      ],
      expectedMiscellaneousTotal: 700
    };
    
    // Step 2: Send API request to retrieve category-wise spending
    const response = await analyticsPage.getCategorySpending(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK without errors');
    
    const categoryData = await response.json();
    
    // Step 3: Validate unclassified transactions grouped under Miscellaneous
    const miscellaneous = categoryData.categories.find(c => c.category === 'Miscellaneous');
    await expect(miscellaneous.totalAmount).toBe(testData.expectedMiscellaneousTotal);
    Logger.info('Unclassified transactions grouped under Miscellaneous: $700');
    
    // Step 4: Verify no error messages or warnings
    await expect(categoryData.status).toBe('success');
    await expect(categoryData.error).toBeUndefined();
    Logger.info('No error messages present');
    
    // Step 5: Validate spending data is valid and complete
    for (const category of categoryData.categories) {
      await expect(typeof category.totalAmount).toBe('number');
      await expect(category.totalAmount).toBeGreaterThanOrEqual(0);
    }
    const totalPercentage = categoryData.categories.reduce((sum, c) => sum + c.percentage, 0);
    await expect(totalPercentage).toBeCloseTo(100, 0.1);
    Logger.info('Spending data is valid and complete');
  });

  test('TC-6010: Verify category-wise spending returns zero values for empty categories', async ({ page }) => {
    Logger.info('Test Case ID: QE-9022 TS-003 TC-001');
    
    // Step 1: Prepare test data - transactions in only 3 categories
    const testData = {
      userId: 'user789',
      populatedCategories: [
        { category: 'Food & Dining', amount: 1500, percentage: 50 },
        { category: 'Fuel', amount: 400, percentage: 13.33 },
        { category: 'Shopping', amount: 1100, percentage: 36.67 }
      ],
      emptyCategories: ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'],
      totalSpend: 3000
    };
    
    // Step 2: Send API request to retrieve category-wise spending
    const response = await analyticsPage.getCategorySpending(testData.userId);
    await expect(response.status).toBe(200);
    Logger.info('API returned 200 OK with spending data');
    
    const categoryData = await response.json();
    
    // Step 3: Validate populated categories show correct amounts
    for (const expected of testData.populatedCategories) {
      const actual = categoryData.categories.find(c => c.category === expected.category);
      await expect(actual.totalAmount).toBe(expected.amount);
    }
    Logger.info('Populated categories validated');
    
    // Step 4: Verify unpopulated categories show zero values
    for (const emptyCategory of testData.emptyCategories) {
      const actual = categoryData.categories.find(c => c.category === emptyCategory);
      await expect(actual.totalAmount).toBe(0);
    }
    Logger.info('Empty categories show $0');
    
    // Step 5: Validate percentage distribution
    for (const expected of testData.populatedCategories) {
      const actual = categoryData.categories.find(c => c.category === expected.category);
      await expect(actual.percentage).toBeCloseTo(expected.percentage, 1);
    }
    for (const emptyCategory of testData.emptyCategories) {
      const actual = categoryData.categories.find(c => c.category === emptyCategory);
      await expect(actual.percentage).toBe(0);
    }
    Logger.info('Percentage distribution validated');
    
    // Step 6: Verify response includes all 9 categories
    await expect(categoryData.categories.length).toBe(9);
    Logger.info('All 9 categories included (including $0 amounts)');
  });
});
