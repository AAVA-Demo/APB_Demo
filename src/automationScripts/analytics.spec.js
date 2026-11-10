const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

// Test Case ID: QE-9377 - Category-wise Spending Visualization
test.describe('Category-wise Spending Visualization - QE-9377', () => {
  // Test Case ID: QE-9547 TS-001 TC-001
  test('TC-001: Verify interactive category-wise spending chart renders within 3 seconds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 3: Navigate to Analytics and verify load time
    const startTime = Date.now();
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);

    // Step 4: Verify category-wise spending chart is rendered
    await expect(analyticsPage.categoryChart).toBeVisible();
    await analyticsPage.verifyCategoryChartRendered();

    // Verify all predefined categories are present
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    await analyticsPage.verifyCategories(expectedCategories);

    // Step 5: Verify each category shows amount and percentage
    await analyticsPage.verifyCategoryData();

    // Step 6: Verify chart is interactive
    await analyticsPage.verifyChartInteractivity();
  });

  // Test Case ID: QE-9547 TS-002 TC-001
  test('TC-002: Verify message when no transaction data exists', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and authenticate with new user
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Test@1234');

    // Step 3: Navigate to Analytics
    await analyticsPage.navigate();

    // Step 4-5: Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient data');
    
    // Verify no chart is rendered
    await analyticsPage.verifyNoChartRendered();
  });

  // Test Case ID: QE-9547 TS-003 TC-001
  test('TC-003: Verify error message and retry option on analytics service failure', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Mock analytics service failure
    await context.route('**/api/analytics/category', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 4: Navigate to Analytics
    await analyticsPage.navigate();

    // Step 5-6: Verify error message and retry option
    await expect(analyticsPage.chartErrorMessage).toBeVisible();
    const errorText = await analyticsPage.getChartErrorMessageText();
    expect(errorText).toContain('could not be rendered');
    await expect(analyticsPage.retryButton).toBeVisible();
  });
});

// Test Case ID: QE-9379 - Monthly Spend Trend Analysis
test.describe('Monthly Spend Trend Analysis - QE-9379', () => {
  // Test Case ID: QE-9544 TS-001 TC-001
  test('TC-001: Verify monthly trend chart with drill-down renders within 3 seconds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 3: Navigate to Analytics and verify load time
    const startTime = Date.now();
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);

    // Step 4: Verify Monthly Spend Trend chart is rendered
    await expect(analyticsPage.trendChart).toBeVisible();
    await analyticsPage.verifyTrendChartRendered();

    // Step 5: Verify chart displays monthly spending trends
    await analyticsPage.verifyMonthlyTrendData();

    // Step 6: Verify drill-down capability
    await analyticsPage.verifyTrendChartDrillDown();
  });

  // Test Case ID: QE-9544 TS-002 TC-001
  test('TC-002: Verify message when user has less than 3 months history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1-2: Launch and authenticate with new user
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Test@1234');

    // Step 3: Navigate to Analytics
    await analyticsPage.navigate();

    // Step 4-6: Verify insufficient historical data message
    await expect(analyticsPage.insufficientHistoryMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientHistoryMessageText();
    expect(messageText).toMatch(/insufficient.*historical.*data/i);
    expect(messageText).toContain('3 months');
    
    // Verify no trend chart is rendered
    await analyticsPage.verifyNoTrendChartRendered();
  });

  // Test Case ID: QE-9544 TS-003 TC-001
  test('TC-003: Verify error message and retry on trend service failure', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Mock trend service failure
    await context.route('**/api/analytics/trends', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 4: Navigate to Analytics
    await analyticsPage.navigate();

    // Step 5-6: Verify error message and retry option
    await expect(analyticsPage.trendErrorMessage).toBeVisible();
    const errorText = await analyticsPage.getTrendErrorMessageText();
    expect(errorText).toContain('could not be rendered');
    await expect(analyticsPage.retryButton).toBeVisible();
  });
});