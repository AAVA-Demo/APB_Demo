const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const testData = require('../data/testData.json');

test.describe('Category-Wise Spending Visualization Tests - QE-10455', () => {

  test('QE-10455 TS-001 TC-001: Verify analytics dashboard displays spending breakdown by all 9 categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    const userId = 'user123';
    await analyticsPage.loadSpendingInsights(userId, '2026-01', '2026-11');
    
    // Validate 9 categories displayed
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(9);
    
    // Validate category totals
    const foodDining = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(foodDining).toBe('$500');
    
    const fuel = await analyticsPage.getCategoryAmount('Fuel');
    expect(fuel).toBe('$300');
    
    const shopping = await analyticsPage.getCategoryAmount('Shopping');
    expect(shopping).toBe('$1,000');
    
    // Validate percentages
    const foodDiningPct = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(foodDiningPct).toBe('13.89%');
    
    const shoppingPct = await analyticsPage.getCategoryPercentage('Shopping');
    expect(shoppingPct).toBe('27.78%');
  });

  test('QE-10455 TS-002 TC-001: Verify analytics dashboard returns empty category data when user has zero transactions', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    const userId = 'user456';
    await analyticsPage.loadSpendingInsights(userId, '2026-01', '2026-11');
    
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(0);
    
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available for the selected period');
  });

  test('QE-10455 TS-003 TC-001: Verify analytics dashboard recalculates spending when user filters by date range', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    const userId = 'user123';
    await analyticsPage.loadSpendingInsights(userId, '2026-06', '2026-11');
    
    // Validate only transactions in filtered period included
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(2);
    
    const shopping = await analyticsPage.getCategoryAmount('Shopping');
    expect(shopping).toBe('$1,000');
    
    const travel = await analyticsPage.getCategoryAmount('Travel');
    expect(travel).toBe('$700');
    
    // Validate percentages for filtered period
    const shoppingPct = await analyticsPage.getCategoryPercentage('Shopping');
    expect(shoppingPct).toBe('58.82%');
    
    const travelPct = await analyticsPage.getCategoryPercentage('Travel');
    expect(travelPct).toBe('41.18%');
  });

});

test.describe('Monthly Spend Trends Analysis Tests - QE-10454', () => {

  test('QE-10454 TS-001 TC-001: Verify trends analysis displays monthly spending totals for past 12 months', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    const userId = 'user123';
    await analyticsPage.loadSpendingInsights(userId, '2025-11', '2026-10');
    
    // Validate 12 monthly entries
    const monthCount = await analyticsPage.getMonthlyTrendCount();
    expect(monthCount).toBe(12);
    
    // Validate monthly totals
    const nov2025 = await analyticsPage.getMonthlySpend('2025-11');
    expect(nov2025).toBe('$1,000');
    
    const oct2026 = await analyticsPage.getMonthlySpend('2026-10');
    expect(oct2026).toBe('$2,100');
    
    // Verify chronological order
    const isChronological = await analyticsPage.isMonthlyTrendsChronological();
    expect(isChronological).toBe(true);
  });

  test('QE-10454 TS-002 TC-001: Verify trends analysis displays only available months when user has less than 12 months', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    const userId = 'user456';
    await analyticsPage.loadSpendingInsights(userId, '2025-11', '2026-11');
    
    // Validate only 3 entries (no placeholder data)
    const monthCount = await analyticsPage.getMonthlyTrendCount();
    expect(monthCount).toBe(3);
    
    const sep2026 = await analyticsPage.getMonthlySpend('2026-09');
    expect(sep2026).toBe('$1,000');
    
    const nov2026 = await analyticsPage.getMonthlySpend('2026-11');
    expect(nov2026).toBe('$1,500');
    
    // Verify no errors or placeholder data
    const hasPlaceholderData = await analyticsPage.hasPlaceholderMonthlyData();
    expect(hasPlaceholderData).toBe(false);
  });

  test('QE-10454 TS-003 TC-001: Verify trends analysis filters by specific category when user drills down', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    const userId = 'user123';
    await analyticsPage.loadSpendingInsights(userId, '2025-11', '2026-10');
    
    // Drill down into Food & Dining category
    await analyticsPage.selectCategoryFilter('Food & Dining');
    
    // Validate Food & Dining spending for each month
    const nov2025FoodDining = await analyticsPage.getCategoryMonthlySpend('2025-11', 'Food & Dining');
    expect(nov2025FoodDining).toBe('$300');
    
    const dec2025FoodDining = await analyticsPage.getCategoryMonthlySpend('2025-12', 'Food & Dining');
    expect(dec2025FoodDining).toBe('$350');
    
    const oct2026FoodDining = await analyticsPage.getCategoryMonthlySpend('2026-10', 'Food & Dining');
    expect(oct2026FoodDining).toBe('$500');
    
    // Verify trend chart displays only Food & Dining
    const displayedCategory = await analyticsPage.getSelectedCategoryFilter();
    expect(displayedCategory).toBe('Food & Dining');
  });

});