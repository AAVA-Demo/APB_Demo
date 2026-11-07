const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

/**
 * Test Suite: Spending Analytics and Insights
 * Epic: QE-7498 - Spending Analytics and Insights
 * User Stories: QE-7512, QE-7511
 */

test.describe('Spending Analytics and Insights', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-7512 TS-001 TC-001
   * User Story: QE-7512 - Monthly Spend Trend Analysis
   * Scenario: TS-001 (Positive)
   * Description: Verify monthly trend analysis displays interactive line chart with 12 months of data
   */
  test('TC-001: Verify monthly trend analysis displays interactive line chart with 12 months of data', async () => {
    // Step 1-2: Login with user having 12 months of history
    await loginPage.login(testData.users.testuser_12months.username, testData.users.testuser_12months.password);
    
    // Step 3-4: Navigate to Analytics and Monthly Trend Analysis
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Verify line chart is displayed
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    const chartType = await analyticsPage.getChartType('monthlyTrend');
    expect(chartType).toBe('line');
    
    // Step 6: Verify chart displays 12 months of data
    const dataPointCount = await analyticsPage.getMonthlyTrendDataPointCount();
    expect(dataPointCount).toBe(12);
    
    // Step 7: Verify X-axis shows month labels
    const monthLabels = await analyticsPage.getMonthlyTrendXAxisLabels();
    expect(monthLabels.length).toBe(12);
    
    // Step 8: Verify Y-axis shows spending amounts with currency
    const yAxisFormat = await analyticsPage.getYAxisFormat('monthlyTrend');
    expect(yAxisFormat).toContain('$');
    
    // Step 9: Verify data points represent monthly totals
    const firstDataPoint = await analyticsPage.getMonthlyTrendDataPoint(0);
    expect(firstDataPoint.value).toBeGreaterThan(0);
  });

  /**
   * Test Case ID: QE-7512 TS-001 TC-002
   * User Story: QE-7512 - Monthly Spend Trend Analysis
   * Scenario: TS-001 (Positive)
   * Description: Verify monthly trend chart data accuracy by comparing with transaction data
   */
  test('TC-002: Verify monthly trend chart data accuracy by comparing with transaction data', async () => {
    // Step 1-2: Login
    await loginPage.login(testData.users.testuser_12months.username, testData.users.testuser_12months.password);
    
    // Step 3-4: Navigate to transactions and filter by January 2024
    const transactionsPage = new (require('./pages/transactions.page').TransactionsPage)(analyticsPage.page);
    await transactionsPage.navigate();
    await transactionsPage.filterByDateRange('01/01/2024', '01/31/2024');
    
    // Step 5: Calculate total from transactions
    const transactionTotal = await transactionsPage.calculateTotalAmount();
    
    // Step 6-7: Navigate to analytics and check January data point
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    await analyticsPage.hoverOverDataPoint('monthlyTrend', 'January 2024');
    
    // Step 8: Verify chart value matches calculated total
    const chartValue = await analyticsPage.getTooltipValue();
    expect(chartValue).toBe(transactionTotal);
  });

  /**
   * Test Case ID: QE-7512 TS-001 TC-003
   * User Story: QE-7512 - Monthly Spend Trend Analysis
   * Scenario: TS-001 (Positive)
   * Description: Verify monthly trend chart displays correct chronological order of months
   */
  test('TC-003: Verify monthly trend chart displays correct chronological order of months', async () => {
    // Step 1-4: Login and navigate to monthly trend
    await loginPage.login(testData.users.testuser_12months.username, testData.users.testuser_12months.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Verify months in chronological order
    const monthLabels = await analyticsPage.getMonthlyTrendXAxisLabels();
    const isChronological = analyticsPage.verifyChronologicalOrder(monthLabels);
    expect(isChronological).toBe(true);
    
    // Step 6: Verify chart starts with oldest month
    const firstMonth = monthLabels[0];
    const expectedOldestMonth = analyticsPage.getExpectedOldestMonth();
    expect(firstMonth).toBe(expectedOldestMonth);
    
    // Step 7: Verify chart ends with most recent month
    const lastMonth = monthLabels[monthLabels.length - 1];
    const expectedNewestMonth = analyticsPage.getExpectedNewestMonth();
    expect(lastMonth).toBe(expectedNewestMonth);
  });

  /**
   * Test Case ID: QE-7512 TS-002 TC-001
   * User Story: QE-7512 - Monthly Spend Trend Analysis
   * Scenario: TS-002 (Negative)
   * Description: Verify insufficient data message when user has less than 3 months of history
   */
  test('TC-004: Verify insufficient data message when user has less than 3 months of transaction history', async () => {
    // Step 1-4: Login with user having only 1 month of history
    await loginPage.login(testData.users.testuser_1month.username, testData.users.testuser_1month.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toContain('Insufficient data for trend analysis');
    expect(message).toContain('At least 3 months');
    
    // Step 6: Verify available data is shown
    const dataPointCount = await analyticsPage.getMonthlyTrendDataPointCount();
    expect(dataPointCount).toBe(1);
    
    // Step 7: Verify no empty placeholders
    const hasEmptyPlaceholders = await analyticsPage.hasEmptyMonthPlaceholders();
    expect(hasEmptyPlaceholders).toBe(false);
  });

  /**
   * Test Case ID: QE-7512 TS-003 TC-001
   * User Story: QE-7512 - Monthly Spend Trend Analysis
   * Scenario: TS-003 (Positive)
   * Description: Verify tooltips display exact spending amount when hovering over data points
   */
  test('TC-005: Verify tooltips display exact spending amount when hovering over monthly trend data points', async () => {
    // Step 1-4: Login and navigate to monthly trend
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    
    // Step 5-6: Hover over January and verify tooltip
    await analyticsPage.hoverOverDataPoint('monthlyTrend', 0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const januaryAmount = await analyticsPage.getTooltipValue();
    expect(januaryAmount).toMatch(/\$[0-9,]+\.\d{2}/);
    
    // Step 7: Hover over February and verify tooltip updates
    await analyticsPage.hoverOverDataPoint('monthlyTrend', 1);
    const februaryAmount = await analyticsPage.getTooltipValue();
    expect(februaryAmount).toMatch(/\$[0-9,]+\.\d{2}/);
    expect(februaryAmount).not.toBe(januaryAmount);
    
    // Step 8: Verify tooltip disappears when not hovering
    await analyticsPage.moveMouseAway();
    const tooltipVisible = await analyticsPage.chartTooltip.isVisible();
    expect(tooltipVisible).toBe(false);
  });

  /**
   * Test Case ID: QE-7512 TS-003 TC-002
   * User Story: QE-7512 - Monthly Spend Trend Analysis
   * Scenario: TS-003 (Positive)
   * Description: Verify clicking on data point filters transactions to show only that month
   */
  test('TC-006: Verify clicking on monthly trend data point filters transactions to show only that months transactions', async () => {
    // Step 1-4: Login and navigate to monthly trend
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Click on March data point
    await analyticsPage.clickDataPoint('monthlyTrend', 'March 2024');
    
    // Step 6: Verify navigation to transactions or filtered view
    const transactionsPage = new (require('./pages/transactions.page').TransactionsPage)(analyticsPage.page);
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 7: Verify transactions filtered to March 2024
    const filterApplied = await transactionsPage.isFilterApplied();
    expect(filterApplied).toBe(true);
    
    // Step 8: Verify filter indicator
    const filterText = await transactionsPage.getActiveFilterText();
    expect(filterText).toContain('March 2024');
    
    // Step 9: Verify all transactions are from March 2024
    const allTransactionsInRange = await transactionsPage.verifyAllTransactionsInDateRange('03/01/2024', '03/31/2024');
    expect(allTransactionsInRange).toBe(true);
  });

  /**
   * Test Case ID: QE-7512 TS-003 TC-003
   * User Story: QE-7512 - Monthly Spend Trend Analysis
   * Scenario: TS-003 (Positive)
   * Description: Verify monthly trend chart interactivity with multiple data point interactions
   */
  test('TC-007: Verify monthly trend chart interactivity with multiple data point interactions', async () => {
    // Step 1-3: Login and navigate to monthly trend
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    
    // Step 4: Hover over January and note amount
    await analyticsPage.hoverOverDataPoint('monthlyTrend', 0);
    const januaryAmount = await analyticsPage.getTooltipValue();
    
    // Step 5: Click on January
    await analyticsPage.clickDataPoint('monthlyTrend', 0);
    const transactionsPage = new (require('./pages/transactions.page').TransactionsPage)(analyticsPage.page);
    await transactionsPage.waitForTransactionsLoad();
    const januaryFilterApplied = await transactionsPage.getActiveFilterText();
    expect(januaryFilterApplied).toContain('January');
    
    // Step 6: Return to analytics
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrendAnalysis();
    await analyticsPage.waitForChartLoad();
    
    // Step 7: Hover over June and note amount
    await analyticsPage.hoverOverDataPoint('monthlyTrend', 5);
    const juneAmount = await analyticsPage.getTooltipValue();
    expect(juneAmount).not.toBe(januaryAmount);
    
    // Step 8: Click on June
    await analyticsPage.clickDataPoint('monthlyTrend', 5);
    await transactionsPage.waitForTransactionsLoad();
    
    // Step 9: Verify June filter replaced January filter
    const juneFilterApplied = await transactionsPage.getActiveFilterText();
    expect(juneFilterApplied).toContain('June');
    expect(juneFilterApplied).not.toContain('January');
  });

  /**
   * Test Case ID: QE-7511 TS-001 TC-001
   * User Story: QE-7511 - Category-wise Spending Visualization
   * Scenario: TS-001 (Positive)
   * Description: Verify category-wise spending chart displays all 9 predefined categories
   */
  test('TC-008: Verify category-wise spending chart displays all 9 predefined categories with accurate amounts', async () => {
    // Step 1-4: Login and navigate to category-wise spending
    await loginPage.login(testData.users.testuser_allcategories.username, testData.users.testuser_allcategories.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Verify chart is displayed
    await expect(analyticsPage.categorySpendingChart).toBeVisible();
    
    // Step 6: Verify all 9 categories are displayed
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    const displayedCategories = await analyticsPage.getCategoryLabels();
    expect(displayedCategories.sort()).toEqual(expectedCategories.sort());
    
    // Step 7: Verify each category shows spending amount
    for (const category of expectedCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      expect(amount).toMatch(/\$[0-9,]+/);
    }
    
    // Step 8: Verify each category shows percentage
    for (const category of expectedCategories) {
      const percentage = await analyticsPage.getCategoryPercentage(category);
      expect(percentage).toMatch(/\d+%/);
    }
    
    // Step 9: Verify chart is interactive
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
  });

  /**
   * Test Case ID: QE-7511 TS-001 TC-002
   * User Story: QE-7511 - Category-wise Spending Visualization
   * Scenario: TS-001 (Positive)
   * Description: Verify category-wise spending percentages sum to 100%
   */
  test('TC-009: Verify category-wise spending percentages sum to 100 percent', async () => {
    // Step 1-4: Login and navigate to category spending
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Get all category percentages
    const percentages = await analyticsPage.getAllCategoryPercentages();
    
    // Step 6: Calculate sum
    const sum = percentages.reduce((total, pct) => total + pct, 0);
    
    // Step 7: Verify sum equals 100% (allowing for rounding)
    expect(sum).toBeGreaterThanOrEqual(99);
    expect(sum).toBeLessThanOrEqual(101);
  });

  /**
   * Test Case ID: QE-7511 TS-001 TC-003
   * User Story: QE-7511 - Category-wise Spending Visualization
   * Scenario: TS-001 (Positive)
   * Description: Verify category-wise spending chart displays categories with zero spending
   */
  test('TC-010: Verify category-wise spending chart displays categories with zero spending appropriately', async () => {
    // Step 1-4: Login with user having some categories with zero spending
    await loginPage.login(testData.users.testuser_somecategories.username, testData.users.testuser_somecategories.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Verify categories with zero spending show $0 or are excluded
    const allCategories = await analyticsPage.getCategoryLabels();
    for (const category of allCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      if (amount === 0) {
        const percentage = await analyticsPage.getCategoryPercentage(category);
        expect(percentage).toBe(0);
      }
    }
    
    // Step 6: Verify categories with spending > $0 are prominently displayed
    const categoriesWithSpending = await analyticsPage.getCategoriesWithSpending();
    expect(categoriesWithSpending.length).toBeGreaterThan(0);
    
    // Step 7: Verify legend clearly indicates categories
    await expect(analyticsPage.chartLegend).toBeVisible();
  });

  /**
   * Test Case ID: QE-7511 TS-002 TC-001
   * User Story: QE-7511 - Category-wise Spending Visualization
   * Scenario: TS-002 (Negative)
   * Description: Verify empty state message when user has no transaction history
   */
  test('TC-011: Verify empty state message when user has no transaction history in any category', async () => {
    // Step 1-4: Login with user having no transactions
    await loginPage.login(testData.users.testuser_nodata.username, testData.users.testuser_nodata.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Verify empty state message
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    const message = await analyticsPage.getEmptyStateMessage();
    expect(message).toContain('No spending data available');
    
    // Step 6: Verify guidance message
    const guidance = await analyticsPage.getEmptyStateGuidance();
    expect(guidance).toContain('Start using your credit cards');
    
    // Step 7: Verify no chart is displayed
    const chartVisible = await analyticsPage.categorySpendingChart.isVisible();
    expect(chartVisible).toBe(false);
  });

  /**
   * Test Case ID: QE-7511 TS-003 TC-001
   * User Story: QE-7511 - Category-wise Spending Visualization
   * Scenario: TS-003 (Positive)
   * Description: Verify sum of all category amounts equals total spending amount
   */
  test('TC-012: Verify sum of all category amounts equals total spending amount displayed', async () => {
    // Step 1-4: Login and navigate to category spending
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    
    // Step 5: Note total spending amount
    const totalSpending = await analyticsPage.getTotalSpendingAmount();
    
    // Step 6: Get all category amounts
    const categoryAmounts = await analyticsPage.getAllCategoryAmounts();
    
    // Step 7: Calculate sum
    const sum = categoryAmounts.reduce((total, amount) => total + amount, 0);
    
    // Step 8: Verify sum equals total
    expect(sum).toBe(totalSpending);
  });

  /**
   * Test Case ID: QE-7511 TS-003 TC-002
   * User Story: QE-7511 - Category-wise Spending Visualization
   * Scenario: TS-003 (Positive)
   * Description: Verify each category shows correct transaction count
   */
  test('TC-013: Verify each category shows correct transaction count', async () => {
    // Step 1-5: Login and navigate to category spending
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    const foodDiningCount = await analyticsPage.getCategoryTransactionCount('Food & Dining');
    
    // Step 6-7: Navigate to transactions and filter by Food & Dining
    const transactionsPage = new (require('./pages/transactions.page').TransactionsPage)(analyticsPage.page);
    await transactionsPage.navigate();
    await transactionsPage.filterByCategory('Food & Dining');
    
    // Step 8: Count transactions
    const actualCount = await transactionsPage.getTransactionCount();
    
    // Step 9: Return to analytics and verify count matches
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    const displayedCount = await analyticsPage.getCategoryTransactionCount('Food & Dining');
    expect(displayedCount).toBe(actualCount);
  });

  /**
   * Test Case ID: QE-7511 TS-003 TC-003
   * User Story: QE-7511 - Category-wise Spending Visualization
   * Scenario: TS-003 (Positive)
   * Description: Verify percentage calculation accuracy for each category
   */
  test('TC-014: Verify percentage calculation accuracy for each category', async () => {
    // Step 1-5: Login and navigate to category spending
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await analyticsPage.navigate();
    await analyticsPage.navigateToCategorySpending();
    await analyticsPage.waitForChartLoad();
    const totalSpending = await analyticsPage.getTotalSpendingAmount();
    
    // Step 6: Get Food & Dining amount and percentage
    const foodDiningAmount = await analyticsPage.getCategoryAmountValue('Food & Dining');
    const foodDiningPercentage = await analyticsPage.getCategoryPercentageValue('Food & Dining');
    
    // Step 7: Calculate expected percentage
    const expectedPercentage = Math.round((foodDiningAmount / totalSpending) * 100);
    
    // Step 8: Verify calculated matches displayed
    expect(foodDiningPercentage).toBeCloseTo(expectedPercentage, 0);
    
    // Step 9: Repeat for 2 more categories
    const shoppingAmount = await analyticsPage.getCategoryAmountValue('Shopping');
    const shoppingPercentage = await analyticsPage.getCategoryPercentageValue('Shopping');
    const expectedShoppingPct = Math.round((shoppingAmount / totalSpending) * 100);
    expect(shoppingPercentage).toBeCloseTo(expectedShoppingPct, 0);
    
    const travelAmount = await analyticsPage.getCategoryAmountValue('Travel');
    const travelPercentage = await analyticsPage.getCategoryPercentageValue('Travel');
    const expectedTravelPct = Math.round((travelAmount / totalSpending) * 100);
    expect(travelPercentage).toBeCloseTo(expectedTravelPct, 0);
  });
});