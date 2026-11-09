const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { AuthService } = require('./services/auth.service');

// Test cases for Analytics Module - QE-8091 and QE-8089

test.describe('Monthly Spending Trend Tests - QE-8091', () => {
  let analyticsPage;
  let authService;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    authService = new AuthService(page);
  });

  test('QE-8091 TS-001 TC-001: Verify trend visualization displays 12 months of complete transaction history with interactive chart rendering under 1 second', async ({ page }) => {
    // Step 1: Authenticate user with 12 months of complete transaction history
    await authService.login('user_12months_complete', 'password123');

    // Step 2: Navigate to the trend visualization feature
    await analyticsPage.navigate();
    await analyticsPage.navigateToTrendView();

    // Step 3: Verify interactive chart displays all 12 months of spending data
    const startTime = Date.now();
    await expect(analyticsPage.trendChart).toBeVisible();
    const monthCount = await analyticsPage.getTrendMonthCount();
    expect(monthCount).toBe(12);
    
    const months = await analyticsPage.getTrendMonthLabels();
    expect(months.length).toBe(12);

    // Step 4: Measure chart rendering time from data load to display completion
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000); // Performance threshold: < 1000ms

    // Step 5: Verify touch-enabled interactions (tap on data points)
    await analyticsPage.clickTrendDataPoint('March 2024');
    const tooltipVisible = await analyticsPage.isTrendTooltipVisible();
    expect(tooltipVisible).toBe(true);
    const tooltipText = await analyticsPage.getTrendTooltipText();
    expect(tooltipText).toContain('March 2024');
  });

  test('QE-8091 TS-002 TC-001: Verify trend visualization handles user with only 2 months of transaction history and displays appropriate message', async ({ page }) => {
    // Step 1: Authenticate user with only 2 months of transaction history
    await authService.login('user_2months_only', 'password123');

    // Step 2: Navigate to the trend visualization feature
    await analyticsPage.navigate();
    await analyticsPage.navigateToTrendView();

    // Step 3: Verify chart displays only the 2 available months of data
    await expect(analyticsPage.trendChart).toBeVisible();
    const monthCount = await analyticsPage.getTrendMonthCount();
    expect(monthCount).toBe(2);
    
    const months = await analyticsPage.getTrendMonthLabels();
    expect(months).toContain('Nov 2024');
    expect(months).toContain('Dec 2024');

    // Step 4: Verify informational message is displayed indicating limited historical data
    const infoMessage = await analyticsPage.getInformationalMessage();
    expect(infoMessage).toMatch(/Additional historical data will populate|more months of transactions/i);

    // Step 5: Verify chart renders in under 1 second despite limited data
    const startTime = Date.now();
    await page.reload();
    await expect(analyticsPage.trendChart).toBeVisible();
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000);
  });

  test('QE-8091 TS-003 TC-001: Verify trend visualization accurately displays 12 months including months with zero spending', async ({ page }) => {
    // Step 1: Authenticate user with 12 months of transaction history including zero-spend months
    await authService.login('user_12months_with_zeros', 'password123');

    // Step 2: Navigate to the trend visualization feature
    await analyticsPage.navigate();
    await analyticsPage.navigateToTrendView();

    // Step 3: Verify chart displays all 12 months including months with $0.00 spending
    await expect(analyticsPage.trendChart).toBeVisible();
    const monthCount = await analyticsPage.getTrendMonthCount();
    expect(monthCount).toBe(12);
    
    const zeroSpendMonths = await analyticsPage.getZeroSpendMonths();
    expect(zeroSpendMonths).toContain('Feb 2024');
    expect(zeroSpendMonths).toContain('May 2024');
    expect(zeroSpendMonths).toContain('Aug 2024');

    // Step 4: Verify zero-spend months are clearly distinguishable on the chart
    for (const month of ['Feb 2024', 'May 2024', 'Aug 2024']) {
      const value = await analyticsPage.getTrendValueForMonth(month);
      expect(parseFloat(value)).toBe(0);
    }

    // Step 5: Verify chart renders in under 1 second
    const startTime = Date.now();
    await page.reload();
    await expect(analyticsPage.trendChart).toBeVisible();
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000);
  });
});

test.describe('Category-Wise Spending Tests - QE-8089', () => {
  let analyticsPage;
  let authService;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    authService = new AuthService(page);
  });

  test('QE-8089 TS-001 TC-001: Verify spending analytics dashboard displays complete category breakdown for user with transactions across all 9 predefined categories, rendered within 1 second', async ({ page }) => {
    // Step 1: Authenticate user with transactions across all 9 predefined categories
    await authService.login('user_all_9_categories', 'password123');

    // Step 2: Navigate to the spending analytics dashboard
    await analyticsPage.navigate();

    // Step 3: Verify category breakdown displays all 9 predefined categories
    const startTime = Date.now();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(9);
    
    const categories = await analyticsPage.getCategoryLabels();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }

    // Step 4: Verify accurate spending amounts are displayed for each category
    for (const category of expectedCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(parseFloat(amount)).toBeGreaterThan(0);
    }

    // Step 5: Measure chart rendering time from data load to display completion
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000); // Performance threshold: < 1000ms
  });

  test('QE-8089 TS-002 TC-001: Verify spending analytics dashboard handles user with no transaction history and displays appropriate empty state message', async ({ page }) => {
    // Step 1: Authenticate user with no transaction history
    await authService.login('user_no_transactions', 'password123');

    // Step 2: Navigate to the spending analytics dashboard
    await analyticsPage.navigate();

    // Step 3: Verify appropriate message is displayed indicating no spending data available
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toMatch(/No spending data is available|No transactions found/i);

    // Step 4: Verify empty or zero-value chart is displayed for all categories
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories.length).toBeGreaterThanOrEqual(9);
    
    for (const category of categories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(parseFloat(amount)).toBe(0);
    }

    // Step 5: Verify page renders without errors despite no data
    const hasErrors = await analyticsPage.hasPageErrors();
    expect(hasErrors).toBe(false);
    await expect(analyticsPage.analyticsContainer).toBeVisible();
  });

  test('QE-8089 TS-003 TC-001: Verify spending analytics dashboard displays partial category data for user with transactions in only 3 out of 9 categories, rendered within 1 second', async ({ page }) => {
    // Step 1: Authenticate user with transactions in only 3 out of 9 categories
    await authService.login('user_3_categories_only', 'password123');

    // Step 2: Navigate to the spending analytics dashboard
    await analyticsPage.navigate();

    // Step 3: Verify category breakdown displays all 9 categories
    const startTime = Date.now();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(9);

    // Step 4: Verify 3 active categories display non-zero spending amounts
    const activeCategories = await analyticsPage.getActiveCategoriesWithSpending();
    expect(activeCategories.length).toBe(3);
    
    for (const category of activeCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(parseFloat(amount)).toBeGreaterThan(0);
    }

    // Step 5: Verify remaining 6 categories display zero or no data
    const allCategories = await analyticsPage.getCategoryLabels();
    const inactiveCategories = allCategories.filter(cat => !activeCategories.includes(cat));
    expect(inactiveCategories.length).toBe(6);
    
    for (const category of inactiveCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(parseFloat(amount)).toBe(0);
    }

    // Step 6: Measure chart rendering time from data load to display completion
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000); // Performance threshold: < 1000ms
  });
});