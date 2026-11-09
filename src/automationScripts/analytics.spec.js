const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');

/**
 * Test Suite: Spending Analytics and Insights
 * Epic: QE-8190 - Spending Analytics and Insights
 * User Stories: QE-8305, QE-8307
 * Purpose: Validate category-wise spending visualization and monthly spend trend analysis
 */

test.describe('Spending Analytics and Insights', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    Logger.info('Initializing Analytics test suite');
  });

  /**
   * Test Case: QE-8412 TS-001 TC-001
   * Scenario: Category-wise spending pie chart displays all nine predefined categories with correct amounts rendered within 3 seconds
   */
  test('TC-QE-8412-TS-001: Verify category-wise spending pie chart displays all nine predefined categories with correct amounts rendered within 3 seconds', async ({ page }) => {
    Logger.info('Starting test: QE-8412 TS-001 TC-001');
    
    // Step 1: Authenticate as a valid user with active credit cards
    await analyticsPage.navigate();
    await analyticsPage.login('testuser', 'Pass@123');
    await expect(analyticsPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully and session is established');

    // Step 2: Navigate to the spending analytics section
    const startTime = Date.now();
    await analyticsPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*\/analytics/);
    Logger.info('Spending analytics page loaded successfully');

    // Step 3: Verify pie chart displays all nine categories with correct spending amounts
    await expect(analyticsPage.getCategoryPieChart()).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
    
    const expectedCategories = {
      'Food & Dining': '₹8,000',
      'Fuel': '₹3,000',
      'Shopping': '₹12,000',
      'Travel': '₹15,000',
      'Entertainment': '₹4,000',
      'Utilities': '₹2,500',
      'Healthcare': '₹1,500',
      'Education': '₹5,000',
      'Miscellaneous': '₹3,000'
    };

    for (const [category, expectedAmount] of Object.entries(expectedCategories)) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(amount).toBe(expectedAmount);
    }
    Logger.info('Pie chart shows all nine categories with correct amounts');

    // Step 4: Measure chart rendering time
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThanOrEqual(3000);
    Logger.info(`Pie chart rendered in ${renderTime}ms (within 3 second threshold)`);
  });

  /**
   * Test Case: QE-8412 TS-002 TC-001
   * Scenario: Uncategorized transactions are automatically assigned to Miscellaneous category with warning message
   */
  test('TC-QE-8412-TS-002: Verify uncategorized transactions are automatically assigned to Miscellaneous category with warning message', async ({ page }) => {
    Logger.info('Starting test: QE-8412 TS-002 TC-001');
    
    // Step 1: Authenticate as a user with transactions containing invalid/uncategorized category tags
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_uncategorized', 'Pass@123');
    await expect(analyticsPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the spending analytics section
    await analyticsPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*\/analytics/);
    Logger.info('Spending analytics page loaded successfully');

    // Step 3: Verify pie chart displays with uncategorized transactions assigned to Miscellaneous
    await expect(analyticsPage.getCategoryPieChart()).toBeVisible();
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    const miscellaneousNumeric = parseFloat(miscellaneousAmount.replace(/[₹,]/g, ''));
    expect(miscellaneousNumeric).toBeGreaterThan(0);
    Logger.info('Pie chart shows Miscellaneous category with aggregated amount including uncategorized transactions');

    // Step 4: Verify warning message is displayed
    await expect(analyticsPage.getWarningMessage()).toBeVisible();
    const warningText = await analyticsPage.getWarningMessageText();
    expect(warningText).toContain('Some transactions were auto-categorized to Miscellaneous');
    Logger.info('Warning message displayed correctly');
  });

  /**
   * Test Case: QE-8412 TS-003 TC-001
   * Scenario: Pie chart displays only active categories with non-zero values when user has spending in 3 out of 9 categories
   */
  test('TC-QE-8412-TS-003: Verify pie chart displays only active categories with non-zero values when user has spending in 3 out of 9 categories', async ({ page }) => {
    Logger.info('Starting test: QE-8412 TS-003 TC-001');
    
    // Step 1: Authenticate as a user with spending in only 3 categories
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_limited', 'Pass@123');
    await expect(analyticsPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the spending analytics section
    await analyticsPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*\/analytics/);
    Logger.info('Spending analytics page loaded successfully');

    // Step 3: Verify pie chart displays only 3 active categories with non-zero values
    await expect(analyticsPage.getCategoryPieChart()).toBeVisible();
    const activeCategories = ['Food & Dining', 'Fuel', 'Shopping'];
    const inactiveCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

    for (const category of activeCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      const amountNumeric = parseFloat(amount.replace(/[₹,]/g, ''));
      expect(amountNumeric).toBeGreaterThan(0);
    }
    Logger.info('Pie chart shows only Food & Dining, Fuel, and Shopping with respective amounts');

    // Step 4: Verify inactive categories are either hidden or displayed with 0% allocation
    for (const category of inactiveCategories) {
      const isVisible = await analyticsPage.isCategoryVisible(category);
      if (isVisible) {
        const percentage = await analyticsPage.getCategoryPercentage(category);
        expect(percentage).toBe('0%');
      }
    }
    Logger.info('Inactive categories (6 categories) are either not visible or shown with 0% percentage');
  });

  /**
   * Test Case: QE-8409 TS-001 TC-001
   * Scenario: User with 12 months of transaction history can view interactive line chart with drill-down capability rendered within 3 seconds
   */
  test('TC-QE-8409-TS-001: Verify user with 12 months of transaction history can view interactive line chart with drill-down capability rendered within 3 seconds', async ({ page }) => {
    Logger.info('Starting test: QE-8409 TS-001 TC-001');
    
    // Step 1: Authenticate as a user with 12 months of transaction history
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await expect(analyticsPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the spending analytics section
    await analyticsPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*\/analytics/);
    Logger.info('Analytics page loaded successfully');

    // Step 3: Select the monthly trend analysis view
    const startTime = Date.now();
    await analyticsPage.selectMonthlyTrendView();
    Logger.info('Monthly trend analysis view is activated');

    // Step 4: Verify interactive line chart displays spending trends from Jan 2025 to Dec 2025
    await expect(analyticsPage.getMonthlyTrendChart()).toBeVisible();
    const dataPoints = await analyticsPage.getChartDataPoints();
    expect(dataPoints.length).toBe(12);
    
    const expectedMonths = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 
                           'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'];
    const chartMonths = await analyticsPage.getChartMonthLabels();
    expect(chartMonths).toEqual(expectedMonths);
    Logger.info('Line chart shows 12 data points representing each month from Jan 2025 to Dec 2025');

    // Step 5: Verify drill-down capability to view category breakdowns for each month
    const isDrillDownEnabled = await analyticsPage.isDrillDownEnabled();
    expect(isDrillDownEnabled).toBe(true);
    Logger.info('User can click on any month to view category-wise spending breakdown for that month');

    // Step 6: Measure chart rendering time
    const endTime = Date.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThanOrEqual(3000);
    Logger.info(`Line chart rendered in ${renderTime}ms (within 3 second threshold)`);
  });

  /**
   * Test Case: QE-8409 TS-002 TC-001
   * Scenario: Warning message is displayed when user with 3 months of transaction history attempts to view 12-month trend analysis
   */
  test('TC-QE-8409-TS-002: Verify warning message is displayed when user with 3 months of transaction history attempts to view 12-month trend analysis', async ({ page }) => {
    Logger.info('Starting test: QE-8409 TS-002 TC-001');
    
    // Step 1: Authenticate as a user with only 3 months of transaction history
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_3months', 'Pass@123');
    await expect(analyticsPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the spending analytics section
    await analyticsPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*\/analytics/);
    Logger.info('Analytics page loaded successfully');

    // Step 3: Select the monthly trend analysis view for 12-month period
    await analyticsPage.selectMonthlyTrendView();
    Logger.info('Monthly trend analysis view is activated');

    // Step 4: Verify line chart displays only 3 data points
    await expect(analyticsPage.getMonthlyTrendChart()).toBeVisible();
    const dataPoints = await analyticsPage.getChartDataPoints();
    expect(dataPoints.length).toBe(3);
    Logger.info('Line chart shows only 3 data points representing available 3 months of data');

    // Step 5: Verify warning message is displayed
    await expect(analyticsPage.getWarningMessage()).toBeVisible();
    const warningText = await analyticsPage.getWarningMessageText();
    expect(warningText).toContain('Insufficient historical data - showing available 3 months only');
    Logger.info('Warning message displayed correctly');
  });

  /**
   * Test Case: QE-8409 TS-003 TC-001
   * Scenario: User can drill down into specific month to view category-wise spending breakdown with interactive filtering
   */
  test('TC-QE-8409-TS-003: Verify user can drill down into specific month to view category-wise spending breakdown with interactive filtering', async ({ page }) => {
    Logger.info('Starting test: QE-8409 TS-003 TC-001');
    
    // Step 1: Authenticate as a user with 12 months of transaction history
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months', 'Pass@123');
    await expect(analyticsPage.getUserProfile()).toBeVisible();
    Logger.info('User authenticated successfully');

    // Step 2: Navigate to the spending analytics section and select monthly trend analysis view
    await analyticsPage.navigateToAnalytics();
    await expect(page).toHaveURL(/.*\/analytics/);
    await analyticsPage.selectMonthlyTrendView();
    await expect(analyticsPage.getMonthlyTrendChart()).toBeVisible();
    Logger.info('Monthly trend line chart is displayed');

    // Step 3: Click on a specific month (e.g., June 2025) in the trend chart
    await analyticsPage.clickOnMonth('June 2025');
    await expect(analyticsPage.getDrillDownView()).toBeVisible();
    Logger.info('Drill-down view opens for June 2025');

    // Step 4: Verify category-wise spending breakdown is displayed for June 2025
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 
                               'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    const displayedCategories = await analyticsPage.getDrillDownCategories();
    
    for (const category of expectedCategories) {
      expect(displayedCategories).toContain(category);
    }
    
    const foodDiningAmount = await analyticsPage.getDrillDownCategoryAmount('Food & Dining');
    const fuelAmount = await analyticsPage.getDrillDownCategoryAmount('Fuel');
    const shoppingAmount = await analyticsPage.getDrillDownCategoryAmount('Shopping');
    
    expect(foodDiningAmount).toBe('₹5,000');
    expect(fuelAmount).toBe('₹2,000');
    expect(shoppingAmount).toBe('₹8,000');
    Logger.info('Category breakdown shows correct amounts for all categories');

    // Step 5: Verify interactive filtering is available
    const isFilterAvailable = await analyticsPage.isInteractiveFilterAvailable();
    expect(isFilterAvailable).toBe(true);
    Logger.info('User can filter by category to view specific category details');
  });
});
