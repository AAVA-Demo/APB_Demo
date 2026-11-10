const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

// Test Case: QE-9872 TS-001 TC-001
test('QE-9872 TS-001 TC-001 - Verify category-wise spending visualization displays all nine categories with accurate amounts', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has transactions across all nine categories
  await loginPage.login('testuser_allcategories', 'Test@123');

  // Step 3: Navigate to Spending Analytics section
  await analyticsPage.navigateToAnalytics();
  await expect(page).toHaveURL(/analytics/);

  // Step 4: Verify interactive chart displays all nine categories
  await analyticsPage.waitForChartLoad();
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

  // Step 5: Verify total spending matches sum of all categories
  const totalSpending = await analyticsPage.getTotalSpending();
  expect(totalSpending).toBe('$3,900.00');
});

// Test Case: QE-9872 TS-002 TC-001
test('QE-9872 TS-002 TC-001 - Verify empty state visualization is displayed when user has no transactions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has no transactions
  await loginPage.login('testuser_notransactions', 'Test@123');

  // Step 3: Navigate to Spending Analytics dashboard
  await analyticsPage.navigateToAnalytics();

  // Step 4: Verify empty state message is displayed
  await expect(analyticsPage.emptyStateMessage).toBeVisible();
  await expect(analyticsPage.emptyStateMessage).toContainText('No spending data is available for the selected period');

  // Step 5: Verify no chart rendering errors occur
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  await page.waitForTimeout(1000);
  expect(consoleErrors.length).toBe(0);
});

// Test Case: QE-9872 TS-003 TC-001
test('QE-9872 TS-003 TC-001 - Verify chart displays only categories with spending data when user has transactions in only 2 categories', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has transactions in only Food & Dining and Fuel
  await loginPage.login('testuser_twocategories', 'Test@123');

  // Step 3: Navigate to Spending Analytics dashboard
  await analyticsPage.navigateToAnalytics();

  // Step 4: Verify only Food & Dining and Fuel are displayed with amounts
  await analyticsPage.waitForChartLoad();
  const categoriesWithData = await analyticsPage.getCategoriesWithSpending();
  expect(categoriesWithData).toContain('Food & Dining');
  expect(categoriesWithData).toContain('Fuel');
  expect(categoriesWithData.length).toBeLessThanOrEqual(2);

  // Step 5: Verify chart readability and accurate percentage calculations
  const foodDiningPercentage = await analyticsPage.getCategoryPercentage('Food & Dining');
  const fuelPercentage = await analyticsPage.getCategoryPercentage('Fuel');
  expect(Math.round(parseFloat(foodDiningPercentage))).toBe(67);
  expect(Math.round(parseFloat(fuelPercentage))).toBe(33);
});

// Test Case: QE-9870 TS-001 TC-001
test('QE-9870 TS-001 TC-001 - Verify monthly spend trend analysis displays 12 months of data with smooth rendering', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has 12 months of transaction history
  await loginPage.login('testuser_12months', 'Test@123');

  // Step 3: Navigate to Analytics and select monthly trend analysis
  await analyticsPage.navigateToAnalytics();
  await analyticsPage.selectMonthlyTrendView();

  // Step 4: Verify interactive line graph displays all 12 months
  await analyticsPage.waitForTrendChartLoad();
  const months = await analyticsPage.getMonthsDisplayed();
  expect(months.length).toBe(12);

  // Step 5: Verify smooth rendering with no performance lag
  const renderTime = await analyticsPage.getChartRenderTime();
  expect(renderTime).toBeLessThan(3000);
  const isInteractive = await analyticsPage.isChartInteractive();
  expect(isInteractive).toBe(true);

  // Step 6: Verify monthly totals are accurate
  const januaryTotal = await analyticsPage.getMonthTotal('Jan');
  expect(januaryTotal).toBe('$2,500.00');
});

// Test Case: QE-9870 TS-002 TC-001
test('QE-9870 TS-002 TC-001 - Verify system displays notification when user has less than 12 months of transaction history', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has only 3 months of history
  await loginPage.login('testuser_3months', 'Test@123');

  // Step 3: Navigate to Analytics and select monthly trend analysis
  await analyticsPage.navigateToAnalytics();
  await analyticsPage.selectMonthlyTrendView();

  // Step 4: Verify notification is displayed
  await expect(analyticsPage.insufficientDataNotification).toBeVisible();
  await expect(analyticsPage.insufficientDataNotification).toContainText('Minimum 12-month history requirement is not met');

  // Step 5: Verify available data for 3 months is still displayed
  const months = await analyticsPage.getMonthsDisplayed();
  expect(months.length).toBe(3);

  // Step 6: Verify indicator shows insufficient data
  await expect(analyticsPage.insufficientDataIndicator).toBeVisible();
  await expect(analyticsPage.insufficientDataIndicator).toContainText('Insufficient data for full trend analysis');
});

// Test Case: QE-9870 TS-003 TC-001
test('QE-9870 TS-003 TC-001 - Verify system displays warning when one month exceeds 1000 transaction rendering limit', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);

  // Step 1: Launch the application
  await loginPage.navigate();

  // Step 2: Log in with user who has 1500 transactions in one month
  await loginPage.login('testuser_hightxn', 'Test@123');

  // Step 3: Navigate to Analytics and select monthly trend analysis
  await analyticsPage.navigateToAnalytics();
  await analyticsPage.selectMonthlyTrendView();

  // Step 4: Verify warning message is displayed
  await expect(analyticsPage.highTransactionWarning).toBeVisible();
  await expect(analyticsPage.highTransactionWarning).toContainText('Transaction volume for July 2024 exceeds optimal rendering capacity');

  // Step 5: Verify graph displays aggregated monthly totals for all 12 months
  await analyticsPage.waitForTrendChartLoad();
  const months = await analyticsPage.getMonthsDisplayed();
  expect(months.length).toBe(12);
  const julyTotal = await analyticsPage.getMonthTotal('Jul');
  expect(julyTotal).toBe('$8,500.00');

  // Step 6: Verify interactivity may be reduced but data is visible
  const julyDataVisible = await analyticsPage.isMonthDataVisible('Jul');
  expect(julyDataVisible).toBe(true);
});