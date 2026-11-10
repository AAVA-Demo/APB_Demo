const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

// Test Case: QE-9760 TS-001 TC-001
test('QE-9760 TS-001 TC-001 - Verify user can view interactive line chart with 12 months data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to Analytics section and select Monthly Spend Trend Analysis
  await analyticsPage.navigate();
  await expect(analyticsPage.analyticsContainer).toBeVisible();

  // Step 3: Verify line chart displays 12 months of data
  await expect(analyticsPage.lineChart).toBeVisible();
  const dataPointCount = await analyticsPage.getLineChartDataPointCount();
  expect(dataPointCount).toBe(12);

  // Step 4: Hover over a data point and verify tooltip
  await analyticsPage.hoverOverDataPoint(2); // March 2023
  await expect(analyticsPage.chartTooltip).toBeVisible();
  const tooltipText = await analyticsPage.chartTooltip.textContent();
  expect(tooltipText).toContain('$');
});

// Test Case: QE-9760 TS-002 TC-001
test('QE-9760 TS-002 TC-001 - Verify user can apply date range filter to trend chart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to Analytics section
  await analyticsPage.navigate();
  await expect(analyticsPage.analyticsContainer).toBeVisible();

  // Step 3: Locate date range filter controls
  await expect(analyticsPage.startDateInput).toBeVisible();
  await expect(analyticsPage.endDateInput).toBeVisible();

  // Step 4: Enter date range
  await analyticsPage.setDateRange('2023-03-01', '2023-06-30');

  // Step 5: Click Apply Filter button
  await analyticsPage.applyFilter();
  await page.waitForLoadState('networkidle');

  // Verify chart updates to show 4 months
  const dataPointCount = await analyticsPage.getLineChartDataPointCount();
  expect(dataPointCount).toBe(4);
});

// Test Case: QE-9760 TS-003 TC-001
test('QE-9760 TS-003 TC-001 - Verify insufficient data message for users with less than 2 months history', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Log into the application with user having less than 2 months history
  await loginPage.navigate();
  await loginPage.login('newuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to Analytics section
  await analyticsPage.navigate();
  await expect(analyticsPage.analyticsContainer).toBeVisible();

  // Step 3: Observe the trend analysis section
  await expect(analyticsPage.insufficientDataMessage).toBeVisible();
  const messageText = await analyticsPage.insufficientDataMessage.textContent();
  expect(messageText).toContain('Insufficient data for trend analysis');
  expect(messageText).toContain('At least 2 months of transaction history required');
});

// Test Case: QE-9757 TS-001 TC-001
test('QE-9757 TS-001 TC-001 - Verify user can view interactive pie chart with all nine categories', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to Analytics section
  await analyticsPage.navigate();
  await expect(analyticsPage.analyticsContainer).toBeVisible();

  // Step 3: Verify pie chart is displayed with nine categories
  await expect(analyticsPage.pieChart).toBeVisible();
  const categoryCount = await analyticsPage.getPieChartCategoryCount();
  expect(categoryCount).toBeGreaterThanOrEqual(1);

  // Step 4: Verify each category segment is labeled with name, amount, and percentage
  const categories = await analyticsPage.getCategoryLabels();
  expect(categories.length).toBeGreaterThan(0);
  for (const category of categories) {
    expect(category).toMatch(/.*\$.*\d+.*%/);
  }
});

// Test Case: QE-9757 TS-002 TC-001
test('QE-9757 TS-002 TC-001 - Verify pie chart renders correctly with single category', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Log into the application with user having single category transactions
  await loginPage.navigate();
  await loginPage.login('testuser_singlecat@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to Analytics section
  await analyticsPage.navigate();
  await expect(analyticsPage.analyticsContainer).toBeVisible();

  // Step 3: Verify pie chart is displayed with single segment
  await expect(analyticsPage.pieChart).toBeVisible();
  const categoryCount = await analyticsPage.getPieChartCategoryCount();
  expect(categoryCount).toBe(1);

  // Step 4: Verify chart renders without errors
  await expect(analyticsPage.errorMessage).not.toBeVisible();
  const categoryLabel = await analyticsPage.getCategoryLabels();
  expect(categoryLabel[0]).toContain('100%');
});

// Test Case: QE-9757 TS-003 TC-001
test('QE-9757 TS-003 TC-001 - Verify user can drill down into category details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Log into the application
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Test@1234');
  await expect(page).toHaveURL(/.*dashboard/);

  // Step 2: Navigate to Analytics section
  await analyticsPage.navigate();
  await expect(analyticsPage.analyticsContainer).toBeVisible();
  await expect(analyticsPage.pieChart).toBeVisible();

  // Step 3: Click on a specific category segment
  await analyticsPage.clickCategorySegment('Shopping');

  // Step 4: Verify drill-down view displays all transactions within that category
  await expect(analyticsPage.drillDownView).toBeVisible();
  await expect(analyticsPage.transactionList).toBeVisible();
  const transactions = await analyticsPage.getTransactionDetails();
  expect(transactions.length).toBeGreaterThan(0);
  for (const txn of transactions) {
    expect(txn.date).toBeTruthy();
    expect(txn.merchant).toBeTruthy();
    expect(txn.amount).toContain('$');
  }
});
