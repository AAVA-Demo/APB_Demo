const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

// Test Suite for Category-Wise Spending Visualization - Story QE-10442
test.describe('Spending Analytics Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await page.goto(testData.baseUrl);
  });

  // Test Case: QE-10511 TS-001 TC-001
  test('TC-007: Verify category-wise spending breakdown is correctly displayed in an interactive pie chart', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.multiCategory.username, testData.users.multiCategory.password);
    
    // Step 3: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();
    const startTime = Date.now();
    await analyticsPage.waitForAnalyticsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    // Step 4: Verify pie chart displayed
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    // Step 5: Verify all categories represented
    const categories = await analyticsPage.getAllCategorySegments();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });
    
    // Step 6: Verify spending amounts accurate
    const categoryAmounts = await analyticsPage.getCategoryAmounts();
    expect(categoryAmounts['Food & Dining']).toBe('$450.00');
    expect(categoryAmounts['Fuel']).toBe('$200.00');
    expect(categoryAmounts['Shopping']).toBe('$350.00');
    expect(categoryAmounts['Travel']).toBe('$600.00');
    
    // Step 7: Verify percentages calculated correctly
    const categoryPercentages = await analyticsPage.getCategoryPercentages();
    expect(parseFloat(categoryPercentages['Food & Dining'])).toBeCloseTo(18, 0);
    expect(parseFloat(categoryPercentages['Travel'])).toBeCloseTo(24, 0);
    
    // Step 8: Verify chart interactivity
    await analyticsPage.hoverOverCategorySegment('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    await expect(analyticsPage.categoryTooltip).toContainText('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toContainText('$450');
  });

  // Test Case: QE-10511 TS-002 TC-001
  test('TC-008: Verify appropriate message and empty/placeholder chart are displayed when no transaction data exists', async ({ page }) => {
    // Step 1-2: Launch and authenticate with no transactions user
    await loginPage.login(testData.users.noTransactions.username, testData.users.noTransactions.password);
    
    // Step 3: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 4: Verify no spending data message
    await expect(analyticsPage.noDataMessage).toBeVisible();
    await expect(analyticsPage.noDataMessage).toContainText('No spending data available');
    
    // Step 5: Verify placeholder chart
    await expect(analyticsPage.placeholderChart).toBeVisible();
    
    // Step 6: Verify no category segments rendered
    const segmentCount = await analyticsPage.getCategorySegmentCount();
    expect(segmentCount).toBe(0);
  });

  // Test Case: QE-10511 TS-003 TC-001
  test('TC-009: Verify uncategorized transactions are correctly assigned to Miscellaneous category without data loss', async ({ page }) => {
    // Step 2: Mock uncategorized transactions
    await page.route('**/api/transactions**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { transactionId: 'txn1', category: null, amount: 100 },
          { transactionId: 'txn2', category: undefined, amount: 150 },
          { transactionId: 'txn3', category: 'Food & Dining', amount: 200 }
        ])
      });
    });
    
    // Step 3: Authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 4: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 5: Verify Miscellaneous category contains uncategorized transactions
    const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscAmount).toBe('$250.00');
    
    // Step 6: Verify Food & Dining shows correct amount
    const foodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(foodAmount).toBe('$200.00');
    
    // Step 7: Verify no data loss
    const totalSpend = await analyticsPage.getTotalSpendDisplayed();
    expect(totalSpend).toBe('$350.00');
    
    // Step 8: Verify no errors
    await expect(analyticsPage.errorMessage).not.toBeVisible();
  });
});

// Test Suite for Monthly Spend Trend Analysis - Story QE-10445
test.describe('Monthly Spend Trend Tests', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await page.goto(testData.baseUrl);
  });

  // Test Case: QE-10512 TS-001 TC-001
  test('TC-016: Verify monthly spending trends are correctly displayed in an interactive line graph for 12 months', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.twelveMonths.username, testData.users.twelveMonths.password);
    
    // Step 3-4: Navigate to Trend Analysis
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    // Step 5: Verify render time
    const startTime = Date.now();
    await analyticsPage.waitForTrendGraphLoad();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(3000);
    
    // Step 6: Verify 12 months displayed
    const dataPoints = await analyticsPage.getTrendDataPointCount();
    expect(dataPoints).toBe(12);
    
    // Step 7: Verify accurate spend values
    const monthlyValues = await analyticsPage.getMonthlySpendValues();
    expect(monthlyValues.length).toBe(12);
    
    // Step 8: Verify interactivity
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.trendTooltip).toBeVisible();
    
    // Step 9: Verify axes labeled
    await expect(analyticsPage.xAxisLabel).toBeVisible();
    await expect(analyticsPage.yAxisLabel).toBeVisible();
  });

  // Test Case: QE-10512 TS-002 TC-001
  test('TC-017: Verify trend graph displays available data with informational message for limited history', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.threeMonths.username, testData.users.threeMonths.password);
    
    // Step 3-4: Navigate to Trend Analysis
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    // Step 5: Verify 3 months displayed
    const dataPoints = await analyticsPage.getTrendDataPointCount();
    expect(dataPoints).toBe(3);
    
    // Step 6: Verify informational message
    await expect(analyticsPage.limitedDataMessage).toBeVisible();
    await expect(analyticsPage.limitedDataMessage).toContainText('Limited data available');
    
    // Step 7: Verify spend values accurate
    const monthlyValues = await analyticsPage.getMonthlySpendValues();
    expect(monthlyValues.length).toBe(3);
  });

  // Test Case: QE-10512 TS-003 TC-001
  test('TC-018: Verify error message with retry option when analytics engine fails', async ({ page }) => {
    // Step 2: Mock analytics engine failure
    await page.route('**/api/analytics/trends', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    
    // Step 3: Authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 4-5: Navigate to Trend Analysis
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToTrendAnalysis();
    
    // Step 6: Verify error message
    await expect(analyticsPage.errorMessage).toBeVisible();
    await expect(analyticsPage.errorMessage).toContainText('Trend data is temporarily unavailable');
    
    // Step 7: Verify retry option
    await expect(analyticsPage.retryButton).toBeVisible();
    await expect(analyticsPage.retryButton).toBeEnabled();
    
    // Step 8: Verify application functional
    await expect(analyticsPage.navigationMenu).toBeVisible();
  });
});
