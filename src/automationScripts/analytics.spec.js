const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Spending Analytics and Insights
 * Test Cases: TC-7011, TC-7012, TC-7013, TC-7017, TC-7018, TC-7019
 * User Stories: QE-9695 (Monthly Spend Trends), QE-9693 (Category-wise Spending Visualization)
 */

test.describe('Analytics - Spending Insights', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: TC-7011
   * Scenario: QE-9898 TS-001 TC-001
   * Description: Verify monthly trends chart displays 12 months of spending data chronologically
   */
  test('TC-7011: Verify monthly trends chart displays 12 months chronologically', async ({ page }) => {
    // Step 1: Navigate to Analytics section
    await loginPage.login('testuser_12months', 'Test@123');
    await analyticsPage.navigate();

    // Step 3: Navigate to Monthly Spend Trends section
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();

    // Step 4: Verify chart displays exactly 12 months chronologically
    const monthsDisplayed = await analyticsPage.getMonthlyTrendsMonthCount();
    expect(monthsDisplayed).toBe(12);

    const monthLabels = await analyticsPage.getMonthlyTrendsLabels();
    expect(monthLabels[0]).toContain('Jan 2023');
    expect(monthLabels[11]).toContain('Dec 2023');

    // Step 5: Verify chart is interactive
    await analyticsPage.hoverOverMonthDataPoint(0);
    const tooltipValue = await analyticsPage.getChartTooltipValue();
    expect(tooltipValue).toBeTruthy();
  });

  /**
   * Test Case ID: TC-7012
   * Scenario: QE-9898 TS-002 TC-001
   * Description: Verify system displays available months with message when user has less than 12 months history
   */
  test('TC-7012: Verify system displays available months when less than 12 months history', async ({ page }) => {
    // Step 1: Navigate to Analytics section
    await loginPage.login('testuser_6months', 'Test@123');
    await analyticsPage.navigate();

    // Step 3: Navigate to Monthly Spend Trends section
    await analyticsPage.waitForAnalyticsLoad();

    // Step 4: Verify chart displays only 6 available months
    const monthsDisplayed = await analyticsPage.getMonthlyTrendsMonthCount();
    expect(monthsDisplayed).toBe(6);

    // Step 5: Verify informational message is displayed
    const infoMessage = await analyticsPage.getInsufficientDataMessage();
    expect(infoMessage).toContain('Full 12-month trend analysis will be available');
  });

  /**
   * Test Case ID: TC-7013
   * Scenario: QE-9898 TS-003 TC-001
   * Description: Verify user can drill down into specific month to view category-wise spending breakdown
   */
  test('TC-7013: Verify drill down into specific month shows category breakdown', async ({ page }) => {
    // Step 1: Navigate to Analytics with monthly trends displayed
    await loginPage.login('testuser_12months', 'Test@123');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();

    // Step 2: Click on specific month (November 2023)
    await analyticsPage.clickMonthDataPoint(10); // Index 10 for November

    // Step 3: Verify category-wise spending breakdown is displayed
    await analyticsPage.waitForDrillDownView();
    
    const categoryBreakdown = await analyticsPage.getCategoryBreakdownForMonth();
    expect(categoryBreakdown['Food & Dining']).toBe('$500');
    expect(categoryBreakdown['Shopping']).toBe('$600');

    // Step 4: Verify total matches monthly total
    const totalSpend = await analyticsPage.getDrillDownTotalSpend();
    expect(totalSpend).toBe('$1,800');
  });

  /**
   * Test Case ID: TC-7017
   * Scenario: QE-9896 TS-001 TC-001
   * Description: Verify category-wise spending visualization displays all nine categories with amounts and percentages
   */
  test('TC-7017: Verify category-wise spending displays all nine categories', async ({ page }) => {
    // Step 1: Navigate to Analytics section
    await loginPage.login('testuser_allcategories', 'Test@123');
    await analyticsPage.navigate();

    // Step 3: Observe Category-wise Spending section
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.categorySpendingChart).toBeVisible();

    // Verify pie chart displays all nine categories
    const categories = await analyticsPage.getCategorySpendingCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');

    // Step 4: Verify each category displays amount and percentage
    const foodDiningData = await analyticsPage.getCategoryData('Food & Dining');
    expect(foodDiningData.amount).toBe('$500');
    expect(foodDiningData.percentage).toBe('20%');

    // Step 5: Verify sum of percentages equals 100%
    const totalPercentage = await analyticsPage.getTotalCategoryPercentage();
    expect(totalPercentage).toBe(100);
  });

  /**
   * Test Case ID: TC-7018
   * Scenario: QE-9896 TS-002 TC-001
   * Description: Verify system displays empty chart with message when user has no transactions in current month
   */
  test('TC-7018: Verify empty chart displayed when no transactions in current month', async ({ page }) => {
    // Step 1: Navigate to Analytics section
    await loginPage.login('testuser_notransactions', 'Test@123');
    await analyticsPage.navigate();

    // Step 3: Observe Category-wise Spending section
    await analyticsPage.waitForAnalyticsLoad();

    // Verify empty chart is displayed
    const isChartEmpty = await analyticsPage.isCategoryChartEmpty();
    expect(isChartEmpty).toBe(true);

    // Step 4: Verify informational message is displayed
    const noDataMessage = await analyticsPage.getNoSpendingDataMessage();
    expect(noDataMessage).toContain('No spending data is available for the current month');
  });

  /**
   * Test Case ID: TC-7019
   * Scenario: QE-9896 TS-003 TC-001
   * Description: Verify transactions with invalid or missing category data are automatically categorized as Miscellaneous
   */
  test('TC-7019: Verify invalid category data categorized as Miscellaneous', async ({ page }) => {
    // Step 1: Navigate to Analytics section
    await loginPage.login('testuser_invalidcategory', 'Test@123');
    await analyticsPage.navigate();

    // Step 3: Observe Category-wise Spending section
    await analyticsPage.waitForAnalyticsLoad();

    // Verify Miscellaneous category includes invalid/missing transactions
    const miscellaneousData = await analyticsPage.getCategoryData('Miscellaneous');
    expect(miscellaneousData.amount).toBe('$400');

    // Step 4: Verify transactions with null/invalid category included in Miscellaneous
    const categories = await analyticsPage.getCategorySpendingCategories();
    expect(categories).toContain('Miscellaneous');

    // Step 5: Verify total spend includes all transactions
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBe('$1,500');
  });
});
