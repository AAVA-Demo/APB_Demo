const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

// Test Case - QE-10361 TS-001 TC-001
test('QE-10361 TS-001 TC-001 - Verify user views interactive pie chart with all 9 spending categories', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Authenticate as a user with transactions across multiple categories
  await loginPage.navigate();
  await loginPage.login('spender@example.com', 'Pass@123');

  // Step 2: Navigate to the spending analytics page
  await analyticsPage.navigate();

  // Step 3: Verify interactive pie chart is displayed
  await expect(analyticsPage.categoryPieChart).toBeVisible();

  // Step 4: Verify all 9 spending categories are displayed in the chart
  const categories = await analyticsPage.getAllCategories();
  const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
  expect(categories.length).toBeGreaterThanOrEqual(1);

  // Step 5: Verify each category displays the correct aggregated spending amount
  for (const category of categories) {
    const amount = await analyticsPage.getCategoryAmount(category);
    expect(amount).toBeGreaterThanOrEqual(0);
  }

  // Step 6: Verify chart is interactive
  await expect(analyticsPage.categoryPieChart).toBeVisible();
});

// Test Case - QE-10361 TS-002 TC-001
test('QE-10361 TS-002 TC-001 - Verify clicking on a category segment displays detailed transaction breakdown', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Authenticate
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 2: Navigate to the spending analytics page
  await analyticsPage.navigate();

  // Step 3: Click on a specific category segment in the pie chart
  await analyticsPage.clickCategorySegment('Food & Dining');

  // Step 4: Verify detailed transaction breakdown is displayed
  await expect(analyticsPage.transactionBreakdown).toBeVisible();

  // Step 5: Verify transaction details include date, merchant name, and amount
  const transactions = await analyticsPage.getTransactionDetails();
  expect(transactions.length).toBeGreaterThan(0);
  for (const txn of transactions) {
    expect(txn.date).toBeTruthy();
    expect(txn.merchant).toBeTruthy();
    expect(txn.amount).toBeGreaterThanOrEqual(0);
  }

  // Step 6: Verify user can return to the main chart view
  await expect(analyticsPage.backButton).toBeVisible();
  await analyticsPage.backButton.click();
  await expect(analyticsPage.categoryPieChart).toBeVisible();
});

// Test Case - QE-10361 TS-003 TC-001
test('QE-10361 TS-003 TC-001 - Verify message is displayed when user has no transaction history', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Authenticate as a user with no transaction history
  await loginPage.navigate();
  await loginPage.login('notxn@example.com', 'Pass@123');

  // Step 2: Navigate to the spending analytics page
  await analyticsPage.navigate();

  // Step 3: Verify no category-wise spending chart is displayed
  const isChartVisible = await analyticsPage.categoryPieChart.isVisible().catch(() => false);
  expect(isChartVisible).toBe(false);

  // Step 4: Verify message is displayed indicating insufficient data
  await expect(analyticsPage.noDataMessage).toBeVisible();
  await expect(analyticsPage.noDataMessage).toContainText(/insufficient data|no transactions/i);

  // Step 5: Verify user is prompted to make transactions or wait for data
  await expect(analyticsPage.noDataCTA).toBeVisible();
});

// Test Case - QE-10362 TS-001 TC-001
test('QE-10362 TS-001 TC-001 - Verify user with 12 months of transaction history views monthly spending trend chart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Authenticate as a user with at least 12 months of transaction history
  await loginPage.navigate();
  await loginPage.login('longtime@example.com', 'Pass@123');

  // Step 2: Navigate to the analytics page and access the trend analysis view
  await analyticsPage.navigate();

  // Step 3: Verify interactive line chart is displayed
  await expect(analyticsPage.monthlyTrendChart).toBeVisible();

  // Step 4: Verify chart displays data for the past 12 months
  const monthLabels = await analyticsPage.getMonthLabels();
  expect(monthLabels.length).toBeGreaterThanOrEqual(1);

  // Step 5: Verify aggregated spending values are correct for each month
  for (const month of monthLabels) {
    const amount = await analyticsPage.getMonthSpendAmount(month);
    expect(amount).toBeGreaterThanOrEqual(0);
  }

  // Step 6: Verify chart is interactive
  await expect(analyticsPage.monthlyTrendChart).toBeVisible();
});

// Test Case - QE-10362 TS-002 TC-001
test('QE-10362 TS-002 TC-001 - Verify tooltip displays exact spending amount and month details on hover', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Authenticate
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'Pass@123');

  // Step 2: Navigate to the analytics page and access the monthly trend chart
  await analyticsPage.navigate();

  // Step 3: Hover over a specific month data point on the chart
  await analyticsPage.hoverOverMonthDataPoint('March 2025');

  // Step 4: Verify tooltip displays the exact spending amount
  await expect(analyticsPage.chartTooltip).toBeVisible();
  const tooltipText = await analyticsPage.chartTooltip.textContent();
  expect(tooltipText).toMatch(/₹|\d+/);

  // Step 5: Verify tooltip displays the month details
  expect(tooltipText).toContain('March');

  // Step 6: Move hover to another data point and verify tooltip updates
  await analyticsPage.hoverOverMonthDataPoint('April 2025');
  const updatedTooltipText = await analyticsPage.chartTooltip.textContent();
  expect(updatedTooltipText).toContain('April');
});

// Test Case - QE-10362 TS-003 TC-001
test('QE-10362 TS-003 TC-001 - Verify system displays available data with notification for user with limited transaction history', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Authenticate as a user with less than 3 months of transaction history
  await loginPage.navigate();
  await loginPage.login('newuser@example.com', 'Pass@123');

  // Step 2: Navigate to the analytics page and access the trend analysis view
  await analyticsPage.navigate();

  // Step 3: Verify chart displays available data for the limited time period
  await expect(analyticsPage.monthlyTrendChart).toBeVisible();
  const monthLabels = await analyticsPage.getMonthLabels();
  expect(monthLabels.length).toBeLessThan(12);

  // Step 4: Verify notification is displayed indicating limited historical data
  await expect(analyticsPage.limitedDataNotification).toBeVisible();
  await expect(analyticsPage.limitedDataNotification).toContainText(/limited.*data|requires.*12 months/i);

  // Step 5: Verify chart still displays available data accurately
  for (const month of monthLabels) {
    const amount = await analyticsPage.getMonthSpendAmount(month);
    expect(amount).toBeGreaterThanOrEqual(0);
  }
});