const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

/**
 * Test Suite: Analytics Feature Tests
 * Covers: QE-8890 (Category-wise Spending) and QE-8885 (Monthly Trends)
 * Total Test Cases: 6
 */

test.describe('Analytics - Category-wise Spending Visualization (QE-8890)', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
  });

  /**
   * Test Case ID: QE-8890 TS-001 TC-001
   * Test Case: Verify all nine spending categories are displayed in interactive visualization
   */
  test('TC-001: All nine spending categories displayed with accurate amounts and percentages', async ({ page }) => {
    // Step 1: Authenticate as user with transactions across all nine categories
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('user_with_all_categories');
    
    // Step 2: Navigate to spending analytics view
    const startTime = Date.now();
    await analyticsPage.waitForAnalyticsLoad();
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within 1 second
    expect(loadTime).toBeLessThanOrEqual(1000);
    
    // Step 3: Verify category-wise spending visualization is displayed
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    // Step 4: Validate all nine categories are present
    const categories = await analyticsPage.getAllCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    expect(categories.length).toBe(9);
    
    // Step 5: Verify spending amounts match expected values
    const categoryData = await analyticsPage.getCategorySpendingData();
    expect(categoryData['Food & Dining']).toBe('$850.00');
    expect(categoryData['Fuel']).toBe('$320.00');
    expect(categoryData['Shopping']).toBe('$1,200.00');
    expect(categoryData['Travel']).toBe('$1,500.00');
    expect(categoryData['Entertainment']).toBe('$180.00');
    expect(categoryData['Utilities']).toBe('$120.00');
    expect(categoryData['Healthcare']).toBe('$50.00');
    expect(categoryData['Education']).toBe('$30.00');
    expect(categoryData['Miscellaneous']).toBe('$5.00');
    
    // Step 6: Verify percentage calculations are accurate
    const percentages = await analyticsPage.getCategoryPercentages();
    expect(percentages['Food & Dining']).toBe('20.0%');
    expect(percentages['Fuel']).toBe('7.5%');
    expect(percentages['Shopping']).toBe('28.2%');
    expect(percentages['Travel']).toBe('35.3%');
    
    // Step 7: Test interactivity by hovering over category segments
    const tooltipData = await analyticsPage.hoverOverCategory('Travel');
    expect(tooltipData).toContain('Travel');
    expect(tooltipData).toContain('$1,500');
    expect(tooltipData).toContain('35.3%');
  });

  /**
   * Test Case ID: QE-8890 TS-002 TC-001
   * Test Case: Verify clicking on category drills down to detailed transaction breakdown
   */
  test('TC-002: Category drill-down shows detailed transaction breakdown', async ({ page }) => {
    // Step 1: Navigate to spending analytics view
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('user_with_travel_transactions');
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 2: Identify Travel category in visualization
    await expect(analyticsPage.categoryChart).toBeVisible();
    const travelCategory = await analyticsPage.getCategoryElement('Travel');
    await expect(travelCategory).toBeVisible();
    
    // Step 3: Click on Travel category segment
    await travelCategory.click();
    
    // Step 4: Verify detailed transaction breakdown is displayed
    await expect(analyticsPage.drillDownPanel).toBeVisible();
    
    // Step 5: Validate transaction count is displayed
    const transactionCount = await analyticsPage.getDrillDownTransactionCount();
    expect(transactionCount).toBe(5);
    
    // Step 6: Validate total amount is displayed
    const totalAmount = await analyticsPage.getDrillDownTotalAmount();
    expect(totalAmount).toBe('$1,500.00');
    
    // Step 7: Validate average transaction value is calculated
    const averageValue = await analyticsPage.getDrillDownAverageValue();
    expect(averageValue).toBe('$300.00');
    
    // Step 8: Verify individual transactions are listed with details
    const transactions = await analyticsPage.getDrillDownTransactions();
    expect(transactions.length).toBe(5);
    
    for (const txn of transactions) {
      expect(txn.merchantName).toBeTruthy();
      expect(txn.date).toBeTruthy();
      expect(txn.amount).toBeTruthy();
    }
  });

  /**
   * Test Case ID: QE-8890 TS-003 TC-001
   * Test Case: Verify visualization correctly displays two categories with spending and zero for others
   */
  test('TC-003: Two categories with spending shows zero for remaining seven categories', async ({ page }) => {
    // Step 1: Authenticate as user with transactions in only two categories
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('user_with_two_categories');
    
    // Step 2: Navigate to spending analytics view
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 3: Verify visualization displays two categories with spending
    const categoryData = await analyticsPage.getCategorySpendingData();
    expect(categoryData['Food & Dining']).toBe('$850.00');
    expect(categoryData['Fuel']).toBe('$320.00');
    
    // Step 4: Verify remaining seven categories show zero spending
    expect(categoryData['Shopping']).toMatch(/\$0\.00|0%/);
    expect(categoryData['Travel']).toMatch(/\$0\.00|0%/);
    expect(categoryData['Entertainment']).toMatch(/\$0\.00|0%/);
    expect(categoryData['Utilities']).toMatch(/\$0\.00|0%/);
    expect(categoryData['Healthcare']).toMatch(/\$0\.00|0%/);
    expect(categoryData['Education']).toMatch(/\$0\.00|0%/);
    expect(categoryData['Miscellaneous']).toMatch(/\$0\.00|0%/);
    
    // Step 5: Validate zero-spending categories display explicit values, not empty/null
    const allCategories = await analyticsPage.getAllCategories();
    expect(allCategories.length).toBe(9);
    
    // Step 6: Verify total spending calculation includes only active categories
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe('$1,170.00');
    
    // Step 7: Verify percentage calculations for active categories
    const percentages = await analyticsPage.getCategoryPercentages();
    expect(percentages['Food & Dining']).toBe('72.6%');
    expect(percentages['Fuel']).toBe('27.4%');
  });
});

test.describe('Analytics - Monthly Spend Trend Analysis (QE-8885)', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
  });

  /**
   * Test Case ID: QE-8885 TS-001 TC-001
   * Test Case: Verify six months history displays interactive chart with drill-down capability
   */
  test('TC-001: Six months history displays interactive monthly trend chart with drill-down', async ({ page }) => {
    // Step 1: Authenticate as user with six months transaction history
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('user_with_six_months_history');
    
    // Step 2: Navigate to monthly trend analysis view
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 3: Verify interactive chart is displayed with six data points
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBe(6);
    
    // Step 4: Verify each month displays total spending amount
    const monthlyData = await analyticsPage.getMonthlySpendingData();
    expect(monthlyData['January 2024']).toBeTruthy();
    expect(monthlyData['February 2024']).toBeTruthy();
    expect(monthlyData['March 2024']).toBeTruthy();
    expect(monthlyData['April 2024']).toBeTruthy();
    expect(monthlyData['May 2024']).toBeTruthy();
    expect(monthlyData['June 2024']).toBeTruthy();
    
    // Step 5: Test hover interactivity
    const tooltipData = await analyticsPage.hoverOverMonthDataPoint('March 2024');
    expect(tooltipData).toContain('March 2024');
    expect(tooltipData).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    
    // Step 6: Test drill-down capability
    await analyticsPage.clickMonthDataPoint('March 2024');
    await expect(analyticsPage.drillDownPanel).toBeVisible();
    
    // Step 7: Verify drill-down shows card-wise breakdown
    const cardBreakdown = await analyticsPage.getCardWiseBreakdown();
    expect(cardBreakdown['Platinum Rewards']).toBeTruthy();
    expect(cardBreakdown['Gold Cashback']).toBeTruthy();
    expect(cardBreakdown['Travel Elite']).toBeTruthy();
    
    // Step 8: Verify chart rendering completes within 1 second
    const renderTime = await analyticsPage.measureChartRenderTime();
    expect(renderTime).toBeLessThanOrEqual(1000);
  });

  /**
   * Test Case ID: QE-8885 TS-002 TC-001
   * Test Case: Verify card filter dynamically updates monthly trend chart
   */
  test('TC-002: Card filter dynamically updates monthly trend chart for selected card', async ({ page }) => {
    // Step 1: Authenticate as user with multi-card history
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('user_with_multi_card_history');
    
    // Step 2: Navigate to monthly trend analysis view
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 3: Verify initial chart displays combined spending for all cards
    const initialData = await analyticsPage.getMonthlySpendingData();
    const initialTotal = Object.values(initialData).reduce((sum, val) => sum + parseFloat(val.replace(/[$,]/g, '')), 0);
    expect(initialTotal).toBeGreaterThan(0);
    
    // Step 4: Locate and interact with card filter dropdown
    await expect(analyticsPage.cardFilterDropdown).toBeVisible();
    
    // Step 5: Select Platinum Rewards card from filter
    await analyticsPage.selectCardFilter('Platinum Rewards');
    
    // Step 6: Verify chart dynamically updates to display only Platinum Rewards spending
    await analyticsPage.waitForChartUpdate();
    const filteredData = await analyticsPage.getMonthlySpendingData();
    const filteredTotal = Object.values(filteredData).reduce((sum, val) => sum + parseFloat(val.replace(/[$,]/g, '')), 0);
    
    // Filtered total should be different from initial total
    expect(filteredTotal).not.toBe(initialTotal);
    expect(filteredTotal).toBeGreaterThan(0);
    
    // Step 7: Verify time period remains the same after filtering
    const filteredMonths = Object.keys(filteredData);
    const initialMonths = Object.keys(initialData);
    expect(filteredMonths).toEqual(initialMonths);
    
    // Step 8: Verify chart interactivity is maintained after filtering
    const tooltipAfterFilter = await analyticsPage.hoverOverMonthDataPoint('March 2024');
    expect(tooltipAfterFilter).toBeTruthy();
    expect(tooltipAfterFilter).toContain('March 2024');
  });

  /**
   * Test Case ID: QE-8885 TS-003 TC-001
   * Test Case: Verify one month history shows single data point with insufficient data message
   */
  test('TC-003: One month history displays single data point with insufficient data message', async ({ page }) => {
    // Step 1: Authenticate as user with only current month history
    await analyticsPage.navigate();
    await analyticsPage.authenticateUser('user_with_one_month_history');
    
    // Step 2: Navigate to monthly trend analysis view
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 3: Verify chart displays single data point for current month
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const dataPoints = await analyticsPage.getMonthlyTrendDataPoints();
    expect(dataPoints.length).toBe(1);
    
    // Step 4: Verify message indicating insufficient historical data
    const insufficientDataMessage = await analyticsPage.getInsufficientDataMessage();
    expect(insufficientDataMessage).toMatch(/insufficient data|at least 2 months/i);
    
    // Step 5: Verify single data point displays accurate spending for current month
    const monthlyData = await analyticsPage.getMonthlySpendingData();
    const currentMonthSpending = Object.values(monthlyData)[0];
    expect(currentMonthSpending).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    
    // Step 6: Verify no error message or error state is displayed
    const hasError = await analyticsPage.hasErrorMessage();
    expect(hasError).toBe(false);
    
    // Step 7: Verify chart is not empty or blank
    const isChartVisible = await analyticsPage.monthlyTrendChart.isVisible();
    expect(isChartVisible).toBe(true);
    
    const hasDataPoint = dataPoints.length > 0;
    expect(hasDataPoint).toBe(true);
  });
});
