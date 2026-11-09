const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Category-Wise Spending Analytics', () => {
  let analyticsPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto('/analytics');
  });

  test('TC-4797: Verify category-wise spending breakdown displays accurate totals, transaction counts, and percentages across 7 categories', async ({ page }) => {
    // Step 1: Prepare test data - handled by mock service
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 2: Call AnalyticsService.loadAnalytics() without date range filter
    await analyticsPage.loadCategorySpending();
    
    // Step 3: Validate categorySpending array contains 7 category objects
    const categoryCount = await analyticsPage.getCategoryCount();
    await expect(categoryCount).toBe(7);
    
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Healthcare', 'Education'];
    for (const category of expectedCategories) {
      await expect(categories).toContain(category);
    }
    
    // Step 4: Verify Food & Dining category totals
    const foodDining = await analyticsPage.getCategoryData('Food & Dining');
    await expect(foodDining.totalAmount).toBe(3050);
    await expect(foodDining.transactionCount).toBe(2);
    await expect(Math.abs(foodDining.percentage - 4.68)).toBeLessThan(0.1);
    
    // Step 5: Verify sum of all category totalAmounts equals overall total spend
    const totalSpend = await analyticsPage.getTotalSpendFromCategories();
    await expect(totalSpend).toBe(65150);
    
    // Step 6: Verify sum of all category percentages equals 100%
    const totalPercentage = await analyticsPage.getTotalPercentage();
    await expect(Math.abs(totalPercentage - 100)).toBeLessThan(0.1);
  });

  test('TC-4798: Verify transaction count accuracy for each category in the spending breakdown', async ({ page }) => {
    // Step 1: Retrieve all transactions
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 2: Manually count transactions per category from raw transaction data
    const expectedCounts = {
      'Food & Dining': 2,
      'Fuel': 2,
      'Shopping': 2,
      'Travel': 2,
      'Entertainment': 1,
      'Healthcare': 2,
      'Education': 1,
      'Miscellaneous': 1
    };
    
    // Step 3: Call AnalyticsService.loadAnalytics() to get category breakdown
    await analyticsPage.loadCategorySpending();
    
    // Step 4: Compare transactionCount from analytics with manual count for each category
    for (const [category, expectedCount] of Object.entries(expectedCounts)) {
      const categoryData = await analyticsPage.getCategoryData(category);
      if (categoryData) {
        await expect(categoryData.transactionCount).toBe(expectedCount);
      }
    }
    
    // Step 5: Verify total transaction count across all categories
    const totalTransactions = await analyticsPage.getTotalTransactionCount();
    await expect(totalTransactions).toBe(15);
  });

  test('TC-4799: Verify percentage calculation accuracy for category-wise spending', async ({ page }) => {
    // Step 1: Call AnalyticsService.loadAnalytics() to retrieve category spending data
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.loadCategorySpending();
    
    // Step 2: Calculate expected percentage for Travel category (highest spend)
    const travelData = await analyticsPage.getCategoryData('Travel');
    const expectedTravelPercentage = (22200 / 65150) * 100;
    
    // Step 3: Validate Travel category percentage matches calculated value
    await expect(Math.abs(travelData.percentage - expectedTravelPercentage)).toBeLessThan(0.01);
    
    // Step 4: Calculate and validate percentage for smallest category (Entertainment)
    const entertainmentData = await analyticsPage.getCategoryData('Entertainment');
    const expectedEntertainmentPercentage = (2200 / 65150) * 100;
    await expect(Math.abs(entertainmentData.percentage - expectedEntertainmentPercentage)).toBeLessThan(0.01);
    
    // Step 5: Verify all percentages are positive numbers between 0 and 100
    const allCategories = await analyticsPage.getAllCategoryData();
    for (const category of allCategories) {
      await expect(category.percentage).toBeGreaterThan(0);
      await expect(category.percentage).toBeLessThan(100);
    }
  });

  test('TC-4800: Verify category-wise spending correctly filters transactions by specified date range (Sep-Nov 2026)', async ({ page }) => {
    // Step 1: Define date range filter for September 1, 2026 to November 30, 2026
    const dateRange = {
      start: new Date('2026-09-01'),
      end: new Date('2026-11-30')
    };
    
    // Step 2: Call AnalyticsService.loadAnalytics(dateRange) with the specified date range
    await analyticsPage.applyDateRangeFilter(dateRange.start, dateRange.end);
    await analyticsPage.loadCategorySpending();
    
    // Step 3: Retrieve categorySpending array from analytics result
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 4: Manually count transactions within date range from mock data
    // Expected transactions in range: 12 (excludes 3 transactions from earlier months)
    
    // Step 5: Verify totalTransactions field in analytics result
    const totalTransactions = await analyticsPage.getTotalTransactionCount();
    await expect(totalTransactions).toBe(12);
    
    // Step 6: Calculate expected total spend for date range
    // Total spend within range = ₹56,250 (excludes ₹8,900 from outside range)
    
    // Step 7: Verify sum of category totalAmounts equals calculated total for date range
    const totalSpend = await analyticsPage.getTotalSpendFromCategories();
    await expect(totalSpend).toBe(56250);
  });

  test('TC-4801: Verify category aggregation accuracy after date range filtering', async ({ page }) => {
    // Step 1: Apply date range filter for November 2026 only
    const dateRange = {
      start: new Date('2026-11-01'),
      end: new Date('2026-11-30')
    };
    
    // Step 2: Call AnalyticsService.loadAnalytics(dateRange) for November 2026
    await analyticsPage.applyDateRangeFilter(dateRange.start, dateRange.end);
    await analyticsPage.loadCategorySpending();
    
    // Step 3: Identify categories present in November 2026 transactions
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Healthcare', 'Entertainment'];
    for (const category of expectedCategories) {
      await expect(categories).toContain(category);
    }
    
    // Step 4: Verify Food & Dining category total for November
    const foodDining = await analyticsPage.getCategoryData('Food & Dining');
    await expect(foodDining.totalAmount).toBe(3050);
    await expect(foodDining.transactionCount).toBe(2);
    
    // Step 5: Verify Fuel category total for November
    const fuel = await analyticsPage.getCategoryData('Fuel');
    await expect(fuel.totalAmount).toBe(6700);
    await expect(fuel.transactionCount).toBe(2);
    
    // Step 6: Verify sum of all November category totals
    const totalSpend = await analyticsPage.getTotalSpendFromCategories();
    await expect(totalSpend).toBe(27600);
  });

  test('TC-4802: Verify system handles date range with no transactions gracefully without errors', async ({ page }) => {
    // Step 1: Define date range for January 2025 (no transactions exist in this period)
    const dateRange = {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31')
    };
    
    // Step 2: Call AnalyticsService.loadAnalytics(dateRange) with empty date range
    await analyticsPage.applyDateRangeFilter(dateRange.start, dateRange.end);
    await analyticsPage.loadCategorySpending();
    
    // Step 3: Verify categorySpending array is empty
    const categoryCount = await analyticsPage.getCategoryCount();
    await expect(categoryCount).toBe(0);
    
    // Step 4: Verify totalTransactions field is zero
    const totalTransactions = await analyticsPage.getTotalTransactionCount();
    await expect(totalTransactions).toBe(0);
    
    // Step 5: Verify dateRange field in result matches input
    const appliedDateRange = await analyticsPage.getAppliedDateRange();
    await expect(appliedDateRange.start).toBe('2025-01-01');
    await expect(appliedDateRange.end).toBe('2025-01-31');
    
    // Step 6: Verify no incomplete or partial data is returned
    const hasNullData = await analyticsPage.hasNullOrUndefinedData();
    await expect(hasNullData).toBe(false);
  });
});