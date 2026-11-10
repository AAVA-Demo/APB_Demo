const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Analytics and Spending Insights Tests - QE-9811 & QE-9804', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
  });

  test('TC-7077: Verify category-wise spending visualization with transactions across all 9 categories', async ({ page }) => {
    // Step 3: Navigate to the analytics dashboard
    await analyticsPage.navigateToAnalytics();

    // Step 4: Verify pie chart is rendered within 1.5 seconds
    const startTime = Date.now();
    await expect(analyticsPage.categoryPieChart).toBeVisible({ timeout: 1500 });
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThanOrEqual(1500);

    // Step 5: Verify all 9 categories are displayed in the chart
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories.length).toBe(9);
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });

    // Step 6: Verify spending amounts are displayed for each category
    const amounts = await analyticsPage.getAllCategoryAmounts();
    expect(amounts.length).toBe(9);
    amounts.forEach(amount => {
      expect(amount).toMatch(/\$[\d,]+\.\d{2}/);
    });

    // Step 7: Verify percentages are displayed for each category
    const percentages = await analyticsPage.getAllCategoryPercentages();
    expect(percentages.length).toBe(9);
    percentages.forEach(percentage => {
      expect(percentage).toMatch(/\d+(\.\d+)?%/);
    });

    // Step 8: Verify categorization accuracy meets 95% NFR requirement
    // Note: This requires backend validation or test data verification
    const totalTransactions = await analyticsPage.getTotalTransactionCount();
    const categorizedTransactions = await analyticsPage.getCategorizedTransactionCount();
    const accuracy = (categorizedTransactions / totalTransactions) * 100;
    expect(accuracy).toBeGreaterThanOrEqual(95);

    // Step 9: Verify chart is interactive (hover/click functionality)
    await analyticsPage.hoverOverCategorySegment('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
  });

  test('TC-7078: Verify transactions with unrecognized merchant codes are categorized as Miscellaneous', async ({ page }) => {
    // Step 3: Ensure test data includes transactions with unrecognized MCC codes
    // Note: This requires test data setup with MCC codes 9999, 1111, 8888

    // Step 4: Navigate to the analytics dashboard
    await analyticsPage.navigateToAnalytics();

    // Step 5: Verify pie chart is rendered
    await expect(analyticsPage.categoryPieChart).toBeVisible();

    // Step 6: Verify Miscellaneous category is present in the chart
    const categories = await analyticsPage.getAllCategories();
    expect(categories).toContain('Miscellaneous');

    // Step 7: Verify unrecognized transactions are included in Miscellaneous
    const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscAmount).toMatch(/\$[\d,]+\.\d{2}/);

    // Step 8: Verify no transactions are omitted from the visualization
    const chartTotal = await analyticsPage.getChartTotalAmount();
    const databaseTotal = await analyticsPage.getDatabaseTotalAmount();
    expect(chartTotal).toBe(databaseTotal);

    // Step 9: Verify visualization does not fail or crash
    await expect(analyticsPage.categoryPieChart).toBeVisible();
  });

  test('TC-7079: Verify error handling when categorization engine is unavailable', async ({ page }) => {
    // Step 3: Simulate categorization engine unavailability
    await page.route('**/api/categorization/**', route => route.abort());

    // Step 4: Navigate to the analytics dashboard
    await analyticsPage.navigateToAnalytics();

    // Step 5: Verify transactions are displayed in Uncategorized group OR raw transaction data is shown
    const hasUncategorized = await analyticsPage.hasUncategorizedGroup();
    const hasRawData = await analyticsPage.hasRawTransactionData();
    expect(hasUncategorized || hasRawData).toBe(true);

    // Step 6: Verify warning message is displayed
    await expect(analyticsPage.warningMessage).toBeVisible();
    const warningText = await analyticsPage.getWarningMessage();
    expect(warningText).toMatch(/category analysis.*unavailable/i);

    // Step 7: Verify user can still view spending information
    const transactions = await analyticsPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);

    // Step 8: Verify no application crash or undefined errors occur
    await expect(page).toHaveURL(/analytics/);
  });

  test('TC-7080: Verify monthly spend trend chart displays 12 months of data with drill-down capability', async ({ page }) => {
    // Step 3: Ensure test user has 12 months of transaction history
    // Note: This requires test data setup

    // Step 4: Navigate to the spending insights section
    await analyticsPage.navigateToSpendingInsights();

    // Step 5: Verify trend chart renders within 1.5 seconds
    const startTime = Date.now();
    await expect(analyticsPage.trendChart).toBeVisible({ timeout: 1500 });
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThanOrEqual(1500);

    // Step 6: Verify chart displays 12 months of data
    const months = await analyticsPage.getAllMonthsInChart();
    expect(months.length).toBe(12);

    // Step 7: Verify each month displays total spending amount
    const monthlyTotals = await analyticsPage.getAllMonthlyTotals();
    expect(monthlyTotals.length).toBe(12);
    monthlyTotals.forEach(total => {
      expect(total).toMatch(/\$[\d,]+\.\d{2}/);
    });

    // Step 8: Click on a specific month (e.g., Nov 2026) to drill down
    await analyticsPage.clickOnMonth('Nov 2026');
    await expect(analyticsPage.drillDownView).toBeVisible();

    // Step 9: Verify category breakdown shows all spending categories for the selected month
    const drillDownCategories = await analyticsPage.getDrillDownCategories();
    expect(drillDownCategories.length).toBeGreaterThan(0);
  });

  test('TC-7081: Verify trend chart displays only available months when user has insufficient history', async ({ page }) => {
    // Re-login with newuser (3 months history)
    await loginPage.navigate();
    await loginPage.login('newuser', 'Pass@123');

    // Step 4: Navigate to the spending insights section
    await analyticsPage.navigateToSpendingInsights();

    // Step 5: Verify trend chart displays only 3 months of data
    await expect(analyticsPage.trendChart).toBeVisible();
    const months = await analyticsPage.getAllMonthsInChart();
    expect(months.length).toBe(3);

    // Step 6: Verify message indicating insufficient historical data is displayed
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toMatch(/insufficient historical data/i);

    // Step 7: Verify no empty or null values are displayed for missing months
    const chartData = await analyticsPage.getChartDataPoints();
    chartData.forEach(dataPoint => {
      expect(dataPoint).not.toMatch(/null|undefined|empty/i);
    });

    // Step 8: Verify chart renders correctly with available data
    await expect(analyticsPage.trendChart).toBeVisible();
  });

  test('TC-7082: Verify error handling when data aggregation service fails', async ({ page }) => {
    // Step 3: Simulate data aggregation service failure
    await page.route('**/api/aggregation/**', route => route.abort());

    // Step 4: Navigate to the spending insights section
    await analyticsPage.navigateToSpendingInsights();

    // Step 5: Verify error message is displayed
    await expect(analyticsPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await analyticsPage.getErrorMessage();
    expect(errorText).toMatch(/trend analysis.*unavailable/i);

    // Step 6: Verify error is logged for investigation
    // Note: This requires backend log verification

    // Step 7: Verify application does not crash
    await expect(page).toHaveURL(/analytics/);

    // Step 8: Verify raw transaction data is not exposed
    const pageText = await page.textContent('body');
    expect(pageText).not.toMatch(/stack trace|raw data|database/i);
  });
});
