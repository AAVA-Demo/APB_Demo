const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

/**
 * Test Suite: Monthly Spend Trend Analysis and Category-Wise Spending Visualization
 * Test Cases: QE-7958 TS-001 TC-001, QE-7958 TS-002 TC-001, QE-7958 TS-003 TC-001,
 *             QE-7957 TS-001 TC-001, QE-7957 TS-002 TC-001, QE-7957 TS-003 TC-001
 */

test.describe('Analytics and Insights Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
  });

  /**
   * Test Case ID: QE-7958 TS-001 TC-001
   * Description: Verify that a user with 12 months of transaction history can view an interactive line chart
   *              showing monthly spending trends rendered within 2 seconds
   */
  test('TC-001: Display interactive monthly spend trend chart for 12 months within 2 seconds', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Analytics page
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 3: Verify user has transaction history spanning at least 12 months
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    
    // Step 4: Locate Monthly Spend Trend section
    await expect(analyticsPage.monthlySpendTrendSection).toBeVisible();
    const sectionHeading = await analyticsPage.getMonthlySpendTrendHeading();
    expect(sectionHeading).toContain('Monthly Spend Trend');
    
    // Step 5: Measure chart rendering time
    const startTime = Date.now();
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(2000);
    
    // Step 6: Verify chart displays accurate spending amounts for each month
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBe(12);
    
    const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dataPoints.forEach((dataPoint, index) => {
      expect(dataPoint.month).toContain(expectedMonths[index]);
      expect(dataPoint.amount).toMatch(/\$\d{1,3}(,\d{3})*\.\d{2}/);
    });
    
    // Step 7: Verify chart is interactive
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBe(true);
    
    // Step 8: Verify chart renders smoothly without lag or visual glitches
    const hasVisualGlitches = await analyticsPage.hasVisualGlitches();
    expect(hasVisualGlitches).toBe(false);
  });

  /**
   * Test Case ID: QE-7958 TS-002 TC-001
   * Description: Verify that a user with only 1 month of transaction history sees the available data point
   *              with a message indicating insufficient data for trend analysis
   */
  test('TC-002: Display single data point with insufficient data message for 1 month history', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Analytics page
    await analyticsPage.navigate();
    await analyticsPage.login('newuser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 3: Verify user has transaction history for only 1 month
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    
    // Step 4: Locate Monthly Spend Trend section
    await expect(analyticsPage.monthlySpendTrendSection).toBeVisible();
    
    // Step 5: Observe chart rendering
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBe(1);
    expect(dataPoints[0].month).toContain('Dec 2024');
    expect(dataPoints[0].amount).toMatch(/\$1,200\.00/);
    
    // Step 6: Verify message indicating insufficient data is displayed
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const insufficientDataMsg = await analyticsPage.getInsufficientDataMessage();
    expect(insufficientDataMsg).toContain('Insufficient data for trend analysis');
    expect(insufficientDataMsg).toContain('At least 3 months of transaction history is recommended');
    
    // Step 7: Verify chart does not fail to render or display error state
    const hasErrorState = await analyticsPage.hasErrorState();
    expect(hasErrorState).toBe(false);
    
    const hasBrokenUI = await analyticsPage.hasBrokenUIElements();
    expect(hasBrokenUI).toBe(false);
    
    // Step 8: Verify user can still interact with the chart
    const canInteract = await analyticsPage.canInteractWithChart();
    expect(canInteract).toBe(true);
    
    await analyticsPage.hoverOverDataPoint(0);
    const tooltipVisible = await analyticsPage.isTooltipVisible();
    expect(tooltipVisible).toBe(true);
    
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Dec 2024');
    expect(tooltipText).toContain('$1,200.00');
  });

  /**
   * Test Case ID: QE-7958 TS-003 TC-001
   * Description: Verify that hovering over data points on the monthly trend chart displays detailed tooltips
   *              with spending amounts accurate to 2 decimal places and formatted as currency
   */
  test('TC-003: Display tooltips with accurate currency formatting on hover', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Analytics page
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 3: Verify Monthly Spend Trend chart is rendered with at least 3 months of data
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(3);
    
    // Step 4: Hover over data point for October 2024
    await analyticsPage.hoverOverDataPointByMonth('Oct 2024');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    const octTooltip = await analyticsPage.getTooltipText();
    expect(octTooltip).toContain('Oct 2024');
    expect(octTooltip).toContain('$1,234.56');
    
    // Step 5: Verify tooltip displays amount with exactly 2 decimal places
    const octAmount = await analyticsPage.extractAmountFromTooltip(octTooltip);
    expect(octAmount).toMatch(/^\$\d{1,3}(,\d{3})*\.\d{2}$/);
    
    // Step 6: Verify tooltip displays currency symbol before amount
    expect(octAmount).toMatch(/^\$/);
    
    // Step 7: Move cursor to data point for November 2024
    await analyticsPage.hoverOverDataPointByMonth('Nov 2024');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    const novTooltip = await analyticsPage.getTooltipText();
    expect(novTooltip).toContain('Nov 2024');
    expect(novTooltip).toContain('$1,567.89');
    
    // Step 8: Verify November tooltip also displays correct formatting
    const novAmount = await analyticsPage.extractAmountFromTooltip(novTooltip);
    expect(novAmount).toMatch(/^\$\d{1,3}(,\d{3})*\.\d{2}$/);
    
    // Step 9: Move cursor away from chart and verify tooltip disappears
    await analyticsPage.moveMouseAwayFromChart();
    await expect(analyticsPage.chartTooltip).not.toBeVisible();
  });

  /**
   * Test Case ID: QE-7957 TS-001 TC-001
   * Description: Verify that a user with transactions across all 9 predefined categories can view
   *              an interactive pie chart with accurate spending amounts rendered within 2 seconds
   */
  test('TC-004: Display interactive category-wise spending pie chart for all 9 categories within 2 seconds', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Analytics page
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 3: Verify user has transactions across all 9 predefined categories
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    
    // Step 4: Locate Category-Wise Spending section
    await expect(analyticsPage.categorySpendingSection).toBeVisible();
    const sectionHeading = await analyticsPage.getCategorySpendingHeading();
    expect(sectionHeading).toContain('Category-Wise Spending');
    
    // Step 5: Measure pie chart rendering time
    const startTime = Date.now();
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(2000);
    
    // Step 6: Verify pie chart displays all 9 categories with spending amounts
    const categoryData = await analyticsPage.getCategorySpendingData();
    expect(categoryData.length).toBe(9);
    
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    expectedCategories.forEach(category => {
      const categoryExists = categoryData.some(data => data.category === category);
      expect(categoryExists).toBe(true);
    });
    
    // Step 7: Verify all amounts are displayed with exactly 2 decimal places
    categoryData.forEach(data => {
      expect(data.amount).toMatch(/^\$\d{1,3}(,\d{3})*\.\d{2}$/);
    });
    
    // Step 8: Verify chart is interactive
    const isInteractive = await analyticsPage.isCategoryChartInteractive();
    expect(isInteractive).toBe(true);
    
    // Step 9: Verify total of all category amounts equals user's total spending
    const totalSpending = await analyticsPage.calculateTotalCategorySpending(categoryData);
    expect(totalSpending).toMatch(/\$2,100\.00/);
  });

  /**
   * Test Case ID: QE-7957 TS-002 TC-001
   * Description: Verify that a user with transactions in only 2 categories sees a chart showing
   *              only those 2 categories without distorting the visualization
   */
  test('TC-005: Display pie chart for 2 categories without distortion', async ({ page }) => {
    // Step 1-2: Launch application, login, and navigate to Analytics page
    await analyticsPage.navigate();
    await analyticsPage.login('limiteduser@example.com', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    
    // Step 3: Verify user has transactions in only 2 categories
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    
    // Step 4: Locate Category-Wise Spending section
    await expect(analyticsPage.categorySpendingSection).toBeVisible();
    
    // Step 5: Observe pie chart rendering
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    const categoryData = await analyticsPage.getCategorySpendingData();
    
    const categoriesWithData = categoryData.filter(data => parseFloat(data.amount.replace(/[$,]/g, '')) > 0);
    expect(categoriesWithData.length).toBe(2);
    
    expect(categoriesWithData[0].category).toBe('Food & Dining');
    expect(categoriesWithData[0].amount).toMatch(/\$500\.00/);
    
    expect(categoriesWithData[1].category).toBe('Fuel');
    expect(categoriesWithData[1].amount).toMatch(/\$300\.00/);
    
    // Step 6: Verify remaining 7 categories are excluded or shown with $0.00
    const totalCategories = categoryData.length;
    expect(totalCategories === 2 || totalCategories === 9).toBe(true);
    
    // Step 7: Verify chart visualization is not distorted
    const proportions = await analyticsPage.getCategoryProportions();
    const foodDiningProportion = proportions['Food & Dining'];
    const fuelProportion = proportions['Fuel'];
    
    expect(foodDiningProportion).toBeCloseTo(62.5, 1);
    expect(fuelProportion).toBeCloseTo(37.5, 1);
    
    // Step 8: Verify chart legend correctly lists categories with data
    const legendItems = await analyticsPage.getChartLegendItems();
    expect(legendItems).toContain('Food & Dining: $500.00');
    expect(legendItems).toContain('Fuel: $300.00');
  });

  /**
   * Test Case ID: QE-7957 TS-003 TC-001
   * Description: Verify that when the Category Classification Service returns miscategorized transactions,
   *              the system displays spending data according to the received categorization without calculation errors
   */
  test('TC-006: Display spending data with miscategorized transactions without calculation errors', async ({ page, context }) => {
    // Step 1: Launch application and login
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Test@123');
    
    // Step 2: Simulate miscategorization (fuel transaction as Miscellaneous)
    await context.route('**/api/transactions**', async route => {
      const response = await route.fetch();
      const json = await response.json();
      
      // Find Shell Gas Station transaction and change category to Miscellaneous
      json.forEach(transaction => {
        if (transaction.merchantName === 'Shell Gas Station' && transaction.amount === 50.00) {
          transaction.category = 'Miscellaneous';
        }
      });
      
      await route.fulfill({ response, json });
    });
    
    // Step 3: Navigate to Analytics page
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Locate Category-Wise Spending section and observe pie chart
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    const categoryData = await analyticsPage.getCategorySpendingData();
    
    // Step 5: Verify Miscellaneous category includes $50.00 from miscategorized fuel transaction
    const miscellaneousData = categoryData.find(data => data.category === 'Miscellaneous');
    expect(miscellaneousData).toBeDefined();
    
    const miscAmount = parseFloat(miscellaneousData.amount.replace(/[$,]/g, ''));
    expect(miscAmount).toBeGreaterThanOrEqual(50.00);
    
    // Step 6: Verify Fuel category does NOT include the $50.00 from miscategorized transaction
    const fuelData = categoryData.find(data => data.category === 'Fuel');
    if (fuelData) {
      const fuelAmount = parseFloat(fuelData.amount.replace(/[$,]/g, ''));
      // Verify fuel amount does not include the $50 Shell transaction
      const expectedFuelWithoutShell = await analyticsPage.getExpectedFuelAmountWithoutShell();
      expect(fuelAmount).toBeCloseTo(expectedFuelWithoutShell, 2);
    }
    
    // Step 7: Verify total spending across all categories is accurate
    const totalSpending = await analyticsPage.calculateTotalCategorySpending(categoryData);
    const expectedTotal = await analyticsPage.getExpectedTotalSpending();
    expect(parseFloat(totalSpending.replace(/[$,]/g, ''))).toBeCloseTo(parseFloat(expectedTotal.replace(/[$,]/g, '')), 2);
    
    // Step 8: Verify system does not display calculation errors or data integrity warnings
    const hasCalculationErrors = await analyticsPage.hasCalculationErrors();
    expect(hasCalculationErrors).toBe(false);
    
    const hasUndefinedValues = await analyticsPage.hasUndefinedValues();
    expect(hasUndefinedValues).toBe(false);
    
    const hasDataIntegrityWarnings = await analyticsPage.hasDataIntegrityWarnings();
    expect(hasDataIntegrityWarnings).toBe(false);
  });
});