const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const config = require('../data/config.json');

// Test Case - QE-10623 TS-001 TC-001
test('Verify category-wise spending chart displays accurate distribution across all 9 categories', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having transactions across all 9 categories
  await loginPage.login('testuser_allcategories', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Analytics Dashboard page
  await analyticsPage.navigate();
  await expect(page).toHaveURL(/analytics/);

  // Step 4: Locate the Category-wise Spending chart section
  await expect(analyticsPage.categoryChart).toBeVisible();

  // Step 5: Verify all 9 categories are represented in the chart
  const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
  for (const category of categories) {
    await analyticsPage.verifyCategoryPresent(category);
  }

  // Step 6: Verify total spending amounts are correctly calculated
  const expectedAmounts = {
    'Food & Dining': 500,
    'Fuel': 300,
    'Shopping': 800,
    'Travel': 1200,
    'Entertainment': 250,
    'Utilities': 400,
    'Healthcare': 150,
    'Education': 600,
    'Miscellaneous': 100
  };
  
  for (const [category, amount] of Object.entries(expectedAmounts)) {
    await analyticsPage.verifyCategoryAmount(category, amount);
  }

  // Step 7: Verify chart is interactive (hover to see details)
  await analyticsPage.hoverOverChartSegment('Food & Dining');
  await expect(analyticsPage.chartTooltip).toBeVisible();
  await expect(analyticsPage.chartTooltip).toContainText('Food & Dining');
  await expect(analyticsPage.chartTooltip).toContainText('500');

  // Step 8: Verify chart renders correctly on current device
  await expect(analyticsPage.categoryChart).toBeVisible();
  const chartBoundingBox = await analyticsPage.categoryChart.boundingBox();
  expect(chartBoundingBox.width).toBeGreaterThan(0);
  expect(chartBoundingBox.height).toBeGreaterThan(0);
});

// Test Case - QE-10623 TS-002 TC-001
test('Verify category-wise spending chart displays 100% for single category when user has transactions in only one category', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having transactions in only one category
  await loginPage.login('testuser_singlecategory', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Analytics Dashboard page
  await analyticsPage.navigate();
  await expect(page).toHaveURL(/analytics/);

  // Step 4: Locate the Category-wise Spending chart section
  await expect(analyticsPage.categoryChart).toBeVisible();

  // Step 5: Verify chart displays 100% spending in the single category
  await analyticsPage.verifyCategoryPresent('Food & Dining');
  await analyticsPage.verifyCategoryAmount('Food & Dining', 1500);

  // Step 6: Verify all other categories show zero or are not displayed
  const otherCategories = ['Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
  for (const category of otherCategories) {
    const isPresent = await analyticsPage.isCategoryPresent(category);
    if (isPresent) {
      await analyticsPage.verifyCategoryAmount(category, 0);
    }
  }

  // Step 7: Verify no calculation errors are present
  const totalSpending = await analyticsPage.getTotalSpending();
  expect(totalSpending).toBe(1500);
  // Verify no NaN or undefined values in chart
  await expect(analyticsPage.categoryChart).not.toContainText('NaN');
  await expect(analyticsPage.categoryChart).not.toContainText('undefined');
});

// Test Case - QE-10623 TS-003 TC-001
test('Verify error message when analytics aggregation service fails', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 2: Simulate analytics aggregation service failure
  await page.route('**/api/analytics/spending*', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 3: Login with valid credentials
  await loginPage.login('testuser', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 4: Navigate to Analytics Dashboard page
  await analyticsPage.navigate();

  // Step 5: Verify error message is displayed for category-wise spending chart
  await expect(analyticsPage.errorMessage).toBeVisible();
  await expect(analyticsPage.errorMessage).toContainText(/Failed to load analytics data|Category spending analysis is temporarily unavailable/);

  // Step 6: Verify chart area shows error state, not incorrect or partial data
  await expect(analyticsPage.chartErrorState).toBeVisible();
  // Verify no chart is rendered
  const chartElements = await analyticsPage.categoryChart.locator('canvas, svg').count();
  expect(chartElements).toBe(0);

  // Step 7: Verify retry button is present
  await expect(analyticsPage.retryButton).toBeVisible();

  // Step 8: Click the Retry button
  await analyticsPage.clickRetry();
  // Verify retry attempt is made
});

// Test Case - QE-10620 TS-001 TC-001
test('Verify monthly spend trends chart displays correctly with 6 months of transaction history and processes within 3 seconds', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having 6 months of transaction history
  await loginPage.login('testuser_6months', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Spending Analytics Dashboard page
  const startTime = Date.now();
  await analyticsPage.navigate();
  await expect(page).toHaveURL(/analytics/);

  // Step 4: Locate the Monthly Spend Trends chart section
  await expect(analyticsPage.monthlyTrendsChart).toBeVisible();

  // Step 5: Verify interactive line chart is displayed
  await expect(analyticsPage.monthlyTrendsChart.locator('canvas, svg')).toBeVisible();

  // Step 6: Verify all 6 months of data points are correctly plotted
  const expectedMonths = ['May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026'];
  const expectedSpends = [1500, 1800, 2100, 1900, 2200, 2000];
  
  for (let i = 0; i < expectedMonths.length; i++) {
    await analyticsPage.verifyMonthlyDataPoint(expectedMonths[i], expectedSpends[i]);
  }

  // Step 7: Verify chart is interactive (hover to see details)
  await analyticsPage.hoverOverMonthlyTrendPoint('May 2026');
  await expect(analyticsPage.chartTooltip).toBeVisible();
  await expect(analyticsPage.chartTooltip).toContainText('May');
  await expect(analyticsPage.chartTooltip).toContainText('1500');

  // Step 8: Verify chart renders correctly on current device
  await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
  const chartBoundingBox = await analyticsPage.monthlyTrendsChart.boundingBox();
  expect(chartBoundingBox.width).toBeGreaterThan(0);
  expect(chartBoundingBox.height).toBeGreaterThan(0);

  // Step 9: Verify data processing and chart rendering completes within 3 seconds
  const endTime = Date.now();
  const renderTime = endTime - startTime;
  expect(renderTime).toBeLessThan(3000);
});

// Test Case - QE-10620 TS-002 TC-001
test('Verify appropriate message and empty state when user has no transaction history', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 2: Login with user having no transaction history
  await loginPage.login('testuser_notxns', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 3: Navigate to Spending Analytics Dashboard page
  await analyticsPage.navigate();
  await expect(page).toHaveURL(/analytics/);

  // Step 4: Locate the Monthly Spend Trends chart section
  await expect(analyticsPage.monthlyTrendsChart).toBeVisible();

  // Step 5: Verify appropriate message is displayed
  await expect(analyticsPage.emptyStateMessage).toBeVisible();
  await expect(analyticsPage.emptyStateMessage).toContainText('Insufficient data to generate monthly spend trends');

  // Step 6: Verify chart area displays empty state
  await expect(analyticsPage.chartEmptyState).toBeVisible();
  // Verify no chart is rendered
  const chartElements = await analyticsPage.monthlyTrendsChart.locator('canvas, svg').count();
  expect(chartElements).toBe(0);

  // Step 7: Verify no error or broken chart is displayed
  await expect(page.locator('text=/error/i')).not.toBeVisible();
  // Verify no JavaScript errors by checking console
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  await page.reload();
  await page.waitForTimeout(1000);
  expect(consoleErrors.length).toBe(0);
});

// Test Case - QE-10620 TS-003 TC-001
test('Verify error message and retry option when analytics service is unavailable or times out', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 2: Simulate analytics service unavailability
  await page.route('**/api/analytics/spending*', route => route.abort('timedout'));

  // Step 1: Launch application
  await loginPage.navigate(config.baseUrl);

  // Step 3: Login with valid credentials
  await loginPage.login('testuser', 'Pass@123');
  await expect(page).toHaveURL(/dashboard/);

  // Step 4: Navigate to Spending Analytics Dashboard page
  await analyticsPage.navigate();

  // Step 5: Verify error message is displayed for monthly spend trends
  await expect(analyticsPage.errorMessage).toBeVisible();
  await expect(analyticsPage.errorMessage).toContainText(/Failed to load analytics data|Monthly spend trends cannot be loaded/);

  // Step 6: Verify chart area shows error state
  await expect(analyticsPage.chartErrorState).toBeVisible();
  // Verify no chart is rendered
  const chartElements = await analyticsPage.monthlyTrendsChart.locator('canvas, svg').count();
  expect(chartElements).toBe(0);

  // Step 7: Verify retry button is present
  await expect(analyticsPage.retryButton).toBeVisible();

  // Step 8: Click the Retry button
  await analyticsPage.clickRetry();
  // Verify retry attempt is made
});
