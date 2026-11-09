const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Monthly Spend Trend Analysis', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await page.goto('/analytics');
  });

  test('TC-4807: Verify monthly spend trend analysis returns chronologically sorted data for 6-month transaction history', async ({ page }) => {
    // Step 1: Prepare test data - handled by mock service
    
    // Step 2: Call AnalyticsService.loadAnalytics() without date range filter
    await analyticsPage.loadMonthlyTrends();
    await analyticsPage.waitForTrendsLoad();
    
    // Step 3: Retrieve monthlyTrends array from analytics result
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    
    // Step 4: Verify monthlyTrends array is sorted chronologically
    const months = monthlyTrends.map(m => m.month);
    const sortedMonths = [...months].sort();
    await expect(months).toEqual(sortedMonths);
    
    // Step 5: Verify each month object contains month, totalSpend, and categoryBreakdown fields
    for (const trend of monthlyTrends) {
      await expect(trend).toHaveProperty('month');
      await expect(trend).toHaveProperty('totalSpend');
      await expect(trend).toHaveProperty('categoryBreakdown');
      await expect(Array.isArray(trend.categoryBreakdown)).toBe(true);
    }
    
    // Step 6: Verify September 2026 totalSpend calculation
    const septemberData = monthlyTrends.find(m => m.month === '2026-09');
    if (septemberData) {
      await expect(septemberData.totalSpend).toBe(8900);
    }
    
    // Step 7: Verify October 2026 totalSpend calculation
    const octoberData = monthlyTrends.find(m => m.month === '2026-10');
    if (octoberData) {
      await expect(octoberData.totalSpend).toBe(27700);
    }
    
    // Step 8: Verify November 2026 totalSpend calculation
    const novemberData = monthlyTrends.find(m => m.month === '2026-11');
    if (novemberData) {
      await expect(novemberData.totalSpend).toBe(27600);
    }
    
    // Step 9: Verify each month object includes categoryBreakdown array with drill-down data
    for (const trend of monthlyTrends) {
      for (const category of trend.categoryBreakdown) {
        await expect(category).toHaveProperty('category');
        await expect(category).toHaveProperty('amount');
      }
    }
  });

  test('TC-4808: Verify category breakdown drill-down data for each month in trend analysis', async ({ page }) => {
    // Step 1: Call AnalyticsService.loadAnalytics() to retrieve monthly trends
    await analyticsPage.loadMonthlyTrends();
    await analyticsPage.waitForTrendsLoad();
    
    // Step 2: Select November 2026 month object from monthlyTrends
    const novemberData = await analyticsPage.getMonthData('2026-11');
    await expect(novemberData).toBeDefined();
    
    // Step 3: Verify November categoryBreakdown contains Food & Dining category
    const foodDining = novemberData.categoryBreakdown.find(c => c.category === 'Food & Dining');
    await expect(foodDining).toBeDefined();
    await expect(foodDining.amount).toBe(3050);
    
    // Step 4: Verify November categoryBreakdown contains Fuel category
    const fuel = novemberData.categoryBreakdown.find(c => c.category === 'Fuel');
    await expect(fuel).toBeDefined();
    await expect(fuel.amount).toBe(6700);
    
    // Step 5: Verify sum of November category breakdown amounts equals November totalSpend
    const categorySum = novemberData.categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
    await expect(categorySum).toBe(novemberData.totalSpend);
    
    // Step 6: Select October 2026 month object and verify category breakdown
    const octoberData = await analyticsPage.getMonthData('2026-10');
    const octoberCategories = octoberData.categoryBreakdown.map(c => c.category);
    await expect(octoberCategories).toContain('Travel');
    await expect(octoberCategories).toContain('Utilities');
    await expect(octoberCategories).toContain('Healthcare');
    
    // Step 7: Verify sum of October category breakdown amounts equals October totalSpend
    const octoberSum = octoberData.categoryBreakdown.reduce((sum, cat) => sum + cat.amount, 0);
    await expect(octoberSum).toBe(octoberData.totalSpend);
  });

  test('TC-4809: Verify monthly aggregation groups transactions by YYYY-MM format correctly', async ({ page }) => {
    // Step 1: Call AnalyticsService.loadAnalytics() to retrieve monthly trends
    await analyticsPage.loadMonthlyTrends();
    await analyticsPage.waitForTrendsLoad();
    
    // Step 2: Verify month field format for all month objects
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    const monthPattern = /^\d{4}-\d{2}$/;
    for (const trend of monthlyTrends) {
      await expect(trend.month).toMatch(monthPattern);
    }
    
    // Step 3: Verify no duplicate month entries in monthlyTrends array
    const months = monthlyTrends.map(m => m.month);
    const uniqueMonths = [...new Set(months)];
    await expect(months.length).toBe(uniqueMonths.length);
    
    // Step 4: Verify transactions from same month are aggregated together
    const novemberData = await analyticsPage.getMonthData('2026-11');
    await expect(novemberData.totalSpend).toBe(27600);
    
    // Step 5: Verify transactions from different months are separated
    await expect(monthlyTrends.length).toBeGreaterThanOrEqual(3);
  });

  test('TC-4810: Verify category breakdown within each month shows spending pattern identification', async ({ page }) => {
    // Step 1: Call AnalyticsService.loadAnalytics() to retrieve monthly trends with category breakdowns
    await analyticsPage.loadMonthlyTrends();
    await analyticsPage.waitForTrendsLoad();
    
    // Step 2: Identify dominant spending category for November 2026
    const novemberData = await analyticsPage.getMonthData('2026-11');
    const novemberDominant = novemberData.categoryBreakdown.reduce((max, cat) => 
      cat.amount > max.amount ? cat : max
    );
    await expect(novemberDominant.category).toBe('Shopping');
    await expect(novemberDominant.amount).toBe(8900);
    
    // Step 3: Identify dominant spending category for October 2026
    const octoberData = await analyticsPage.getMonthData('2026-10');
    const octoberDominant = octoberData.categoryBreakdown.reduce((max, cat) => 
      cat.amount > max.amount ? cat : max
    );
    await expect(octoberDominant.category).toBe('Travel');
    await expect(octoberDominant.amount).toBe(22200);
    
    // Step 4: Compare category contributions across months to identify spending patterns
    // Travel spending concentrated in October, Shopping concentrated in November
    const travelInOctober = octoberData.categoryBreakdown.find(c => c.category === 'Travel');
    const shoppingInNovember = novemberData.categoryBreakdown.find(c => c.category === 'Shopping');
    await expect(travelInOctober.amount).toBeGreaterThan(20000);
    await expect(shoppingInNovember.amount).toBeGreaterThan(8000);
    
    // Step 5: Verify each category breakdown entry has category name and amount
    const allTrends = await analyticsPage.getMonthlyTrends();
    for (const trend of allTrends) {
      for (const category of trend.categoryBreakdown) {
        await expect(typeof category.category).toBe('string');
        await expect(typeof category.amount).toBe('number');
      }
    }
  });

  test('TC-4811: Verify system handles user with only one month of transaction history without errors', async ({ page }) => {
    // Step 1: Filter transactions to include only November 2026 data
    const dateRange = {
      start: new Date('2026-11-01'),
      end: new Date('2026-11-30')
    };
    
    // Step 2: Call AnalyticsService.loadAnalytics(dateRange) with single-month filter
    await analyticsPage.applyDateRangeFilter(dateRange.start, dateRange.end);
    await analyticsPage.loadMonthlyTrends();
    await analyticsPage.waitForTrendsLoad();
    
    // Step 3: Verify monthlyTrends array contains exactly 1 month object
    const monthlyTrends = await analyticsPage.getMonthlyTrends();
    await expect(monthlyTrends.length).toBe(1);
    await expect(monthlyTrends[0].month).toBe('2026-11');
    
    // Step 4: Verify single month object contains valid totalSpend
    await expect(monthlyTrends[0].totalSpend).toBe(27600);
    
    // Step 5: Verify single month object contains categoryBreakdown
    await expect(Array.isArray(monthlyTrends[0].categoryBreakdown)).toBe(true);
    await expect(monthlyTrends[0].categoryBreakdown.length).toBeGreaterThan(0);
    
    // Step 6: Verify system does not attempt to calculate trends or comparisons
    const hasErrors = await analyticsPage.hasConsoleErrors();
    await expect(hasErrors).toBe(false);
    
    // Step 7: Verify available data is still displayed correctly
    await expect(monthlyTrends[0]).toHaveProperty('month');
    await expect(monthlyTrends[0]).toHaveProperty('totalSpend');
    await expect(monthlyTrends[0]).toHaveProperty('categoryBreakdown');
  });
});