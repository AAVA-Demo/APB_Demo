const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

/**
 * Test Suite: Category-Wise Spending Analysis
 * User Story: QE-9293
 * Test Cases: QE-9440 TS-001 TC-001, QE-9440 TS-002 TC-001, QE-9440 TS-003 TC-001
 */

test.describe('Category-Wise Spending Analysis', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-9440 TS-001 TC-001
   * Description: Verify user can view category-wise spending across all nine predefined categories with accurate percentages
   */
  test('TC-001: User views category-wise spending across all 9 categories', async ({ page }) => {
    // Step 1: Login with all-category user
    await loginPage.login('allcategory_user@demo.com', 'Pass@123');

    // Step 2: Navigate to Analytics page
    await analyticsPage.navigateToAnalytics();

    // Step 3: Locate category-wise spending section
    await expect(analyticsPage.categorySection).toBeVisible();
    await expect(analyticsPage.categoryChart).toBeVisible();

    // Step 4: Verify all 9 categories are displayed
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories.length).toBe(9);
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });

    // Step 5: Verify each category displays spending amount in currency format
    const amounts = await analyticsPage.getCategoryAmounts();
    amounts.forEach(amount => {
      expect(amount).toMatch(/\$[\d,]+\.\d{2}/);
    });

    // Step 6: Verify each category displays percentage breakdown
    const percentages = await analyticsPage.getCategoryPercentages();
    percentages.forEach(percentage => {
      expect(percentage).toMatch(/\d+\.\d%/);
    });

    // Step 7: Verify sum of all percentages equals 100%
    const percentageValues = percentages.map(p => parseFloat(p.replace('%', '')));
    const totalPercentage = percentageValues.reduce((sum, val) => sum + val, 0);
    expect(Math.round(totalPercentage)).toBe(100);

    // Step 8: Test chart interactivity (hover)
    await analyticsPage.hoverOverCategorySegment(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
  });

  /**
   * Test Case ID: QE-9440 TS-002 TC-001
   * Description: Verify category-wise spending displays correctly when user has transactions in only 3 out of 9 categories
   */
  test('TC-002: User with partial category coverage views spending correctly', async ({ page }) => {
    // Step 1: Login with partial-category user
    await loginPage.login('partialcategory_user@demo.com', 'Pass@123');

    // Step 2: Navigate to Analytics page
    await analyticsPage.navigateToAnalytics();

    // Step 3: Verify chart displays only 3 active categories
    await expect(analyticsPage.categoryChart).toBeVisible();
    const visibleCategories = await analyticsPage.getVisibleCategoryLabels();
    expect(visibleCategories.length).toBe(3);
    expect(visibleCategories).toContain('Food & Dining');
    expect(visibleCategories).toContain('Fuel');
    expect(visibleCategories).toContain('Shopping');

    // Step 4: Verify inactive categories are excluded or show zero
    const amounts = await analyticsPage.getCategoryAmounts();
    const nonZeroAmounts = amounts.filter(amount => !amount.includes('$0.00'));
    expect(nonZeroAmounts.length).toBe(3);

    // Step 5: Verify chart maintains proper proportions
    const percentages = await analyticsPage.getCategoryPercentages();
    const percentageValues = percentages.map(p => parseFloat(p.replace('%', '')));
    expect(percentageValues[0]).toBeCloseTo(33.3, 1); // Food & Dining
    expect(percentageValues[1]).toBeCloseTo(16.7, 1); // Fuel
    expect(percentageValues[2]).toBeCloseTo(50.0, 1); // Shopping

    // Step 6: Verify sum of displayed percentages equals 100%
    const totalPercentage = percentageValues.reduce((sum, val) => sum + val, 0);
    expect(Math.round(totalPercentage)).toBe(100);
  });

  /**
   * Test Case ID: QE-9440 TS-003 TC-001
   * Description: Verify appropriate message is displayed when user has no categorized transactions
   */
  test('TC-003: User with no categorized transactions sees appropriate message', async ({ page }) => {
    // Step 1: Login with no-category user
    await loginPage.login('nocategory_user@demo.com', 'Pass@123');

    // Step 2: Navigate to Analytics page
    await analyticsPage.navigateToAnalytics();

    // Step 3: Verify appropriate message is displayed
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessageText();
    expect(message).toContain('Insufficient data for category analysis');

    // Step 4: Verify chart displays empty state or single Miscellaneous category
    const isEmptyState = await analyticsPage.emptyStateChart.isVisible();
    if (!isEmptyState) {
      const categories = await analyticsPage.getCategoryLabels();
      expect(categories.length).toBe(1);
      expect(categories[0]).toBe('Miscellaneous');
      const percentages = await analyticsPage.getCategoryPercentages();
      expect(percentages[0]).toContain('100');
    }

    // Step 5: Verify no technical errors are displayed
    await expect(analyticsPage.errorMessage).not.toBeVisible();
  });
});