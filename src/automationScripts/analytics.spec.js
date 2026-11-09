const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

// Test Case: QE-8917 TS-001 TC-001
test('Verify category-wise spending visualization displays all nine categories with accurate percentages and amounts', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  
  // Step 2: Login with all categories user
  await loginPage.login('testuser_allcategories', 'Pass@123');
  
  // Step 3: Click Analytics menu
  await analyticsPage.clickAnalyticsMenu();
  
  // Step 4: Observe pie chart - measure render time
  const startTime = Date.now();
  await analyticsPage.waitForCategoryChartToLoad();
  const renderTime = Date.now() - startTime;
  
  // Verify all nine categories
  const categories = await analyticsPage.getCategoryChartData();
  expect(categories.length).toBe(9);
  
  const expectedCategories = [
    'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
    'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
  ];
  
  for (const expected of expectedCategories) {
    const found = categories.some(cat => cat.name === expected);
    expect(found).toBe(true);
  }
  
  // Step 5: Verify percentages and amounts
  for (const category of categories) {
    expect(category.percentage).toBeGreaterThan(0);
    expect(category.amount).toMatch(/\$[\d,]+\.\d{2}/);
  }
  
  // Step 6: Verify legend
  await expect(analyticsPage.chartLegend).toBeVisible();
  const legendItems = await analyticsPage.getLegendItems();
  expect(legendItems.length).toBe(9);
  
  // Step 7: Verify render time
  expect(renderTime).toBeLessThan(2000);
});

// Test Case: QE-8917 TS-002 TC-001
test('Verify drill-down functionality displays detailed transaction list for selected category', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  
  // Step 2: Login
  await loginPage.login('testuser_shopping', 'Pass@123');
  
  // Step 3: Navigate to Analytics
  await analyticsPage.clickAnalyticsMenu();
  await analyticsPage.waitForCategoryChartToLoad();
  
  // Step 4: Click Shopping category
  await analyticsPage.clickCategorySlice('Shopping');
  
  // Step 5: Verify transaction list
  await expect(analyticsPage.drillDownPanel).toBeVisible();
  const transactions = await analyticsPage.getDrillDownTransactions();
  
  for (const txn of transactions) {
    expect(txn.category).toBe('Shopping');
    expect(txn.merchant).toBeTruthy();
  }
  
  // Step 6: Verify date and amount format
  for (const txn of transactions) {
    expect(txn.date).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(txn.amount).toMatch(/\$[\d,]+\.\d{2}/);
  }
  
  // Step 7: Verify total matches chart
  const totalFromList = transactions.reduce((sum, txn) => {
    return sum + parseFloat(txn.amount.replace(/[$,]/g, ''));
  }, 0);
  
  const chartTotal = await analyticsPage.getCategoryTotal('Shopping');
  expect(totalFromList).toBeCloseTo(chartTotal, 2);
});

// Test Case: QE-8917 TS-003 TC-001
test('Verify category-wise spending visualization displays 100% for single category with other categories at 0% or hidden', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  
  // Step 2: Login with fuel only user
  await loginPage.login('testuser_fuelonly', 'Pass@123');
  
  // Step 3: Navigate to Analytics
  await analyticsPage.clickAnalyticsMenu();
  
  // Step 4: Observe pie chart
  await analyticsPage.waitForCategoryChartToLoad();
  
  // Step 5: Verify Fuel at 100%
  const categories = await analyticsPage.getCategoryChartData();
  const fuelCategory = categories.find(cat => cat.name === 'Fuel');
  
  expect(fuelCategory).toBeTruthy();
  expect(fuelCategory.percentage).toBe(100);
  expect(fuelCategory.amount).toMatch(/\$450\.00/);
  
  // Step 6: Verify other categories
  const otherCategories = categories.filter(cat => cat.name !== 'Fuel');
  
  for (const cat of otherCategories) {
    expect(cat.percentage).toBe(0);
  }
  
  // Step 7: Verify render time
  const startTime = Date.now();
  await analyticsPage.waitForCategoryChartToLoad();
  const renderTime = Date.now() - startTime;
  expect(renderTime).toBeLessThan(2000);
});

// Test Case: QE-8913 TS-001 TC-001
test('Verify monthly trend analysis displays interactive line graph with 6 months of spending data and drill-down capability', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  
  // Step 2: Login with six months user
  await loginPage.login('testuser_sixmonths', 'Pass@123');
  
  // Step 3: Navigate to Analytics
  await analyticsPage.clickAnalyticsMenu();
  
  // Step 4: Locate Monthly Spend Trend
  await expect(analyticsPage.monthlyTrendSection).toBeVisible();
  await analyticsPage.waitForMonthlyTrendToLoad();
  
  // Step 5: Verify 6 months displayed
  const months = await analyticsPage.getMonthlyTrendMonths();
  expect(months.length).toBe(6);
  
  // Step 6: Verify accurate amounts
  const monthlyData = await analyticsPage.getMonthlyTrendData();
  
  for (const data of monthlyData) {
    expect(data.month).toBeTruthy();
    expect(data.amount).toBeGreaterThan(0);
  }
  
  // Step 7: Click December data point
  await analyticsPage.clickMonthDataPoint('December 2023');
  
  // Step 8: Verify drill-down
  await expect(analyticsPage.drillDownPanel).toBeVisible();
  const transactions = await analyticsPage.getDrillDownTransactions();
  
  for (const txn of transactions) {
    expect(txn.date).toContain('12/'); // December
    expect(txn.merchant).toBeTruthy();
    expect(txn.category).toBeTruthy();
    expect(txn.amount).toMatch(/\$[\d,]+\.\d{2}/);
  }
  
  // Step 9: Verify total matches
  const totalFromList = transactions.reduce((sum, txn) => {
    return sum + parseFloat(txn.amount.replace(/[$,]/g, ''));
  }, 0);
  
  expect(totalFromList).toBeCloseTo(4000, 2);
});

// Test Case: QE-8913 TS-002 TC-001
test('Verify monthly trend analysis displays appropriate message when only current month data exists', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  // Step 1: Launch application
  await analyticsPage.navigate();
  
  // Step 2: Login with new user
  await loginPage.login('testuser_newuser', 'Pass@123');
  
  // Step 3: Navigate to Analytics
  await analyticsPage.clickAnalyticsMenu();
  
  // Step 4: Locate Monthly Spend Trend
  await expect(analyticsPage.monthlyTrendSection).toBeVisible();
  
  // Step 5: Verify insufficient data message
  await expect(analyticsPage.insufficientDataMessage).toBeVisible();
  await expect(analyticsPage.insufficientDataMessage).toContainText(/Insufficient historical data/);
  
  // Step 6: Verify single data point
  const months = await analyticsPage.getMonthlyTrendMonths();
  expect(months.length).toBe(1);
  
  const currentMonthData = await analyticsPage.getMonthlyTrendData();
  expect(currentMonthData[0].amount).toBeGreaterThan(0);
  
  // Step 7: Verify no errors
  const errorVisible = await analyticsPage.errorMessage.isVisible().catch(() => false);
  expect(errorVisible).toBe(false);
});

// Test Case: QE-8913 TS-003 TC-001
test('Verify drill-down into month with zero transactions displays appropriate message without errors', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  // Step 1: Login with gap months user
  await analyticsPage.navigate();
  await loginPage.login('testuser_gapmonths', 'Pass@123');
  
  // Step 2: Navigate to Analytics and locate trend
  await analyticsPage.clickAnalyticsMenu();
  await analyticsPage.waitForMonthlyTrendToLoad();
  
  // Step 3: Identify zero transaction month
  const monthlyData = await analyticsPage.getMonthlyTrendData();
  const zeroMonth = monthlyData.find(m => m.amount === 0);
  expect(zeroMonth).toBeTruthy();
  
  // Step 4: Click on zero month
  await analyticsPage.clickMonthDataPoint(zeroMonth.month);
  
  // Step 5: Verify no transactions message
  await expect(analyticsPage.noTransactionsMessage).toBeVisible();
  await expect(analyticsPage.noTransactionsMessage).toContainText(/No transactions found/);
  
  // Step 6: Verify no errors
  const errorVisible = await analyticsPage.errorMessage.isVisible().catch(() => false);
  expect(errorVisible).toBe(false);
  
  // Step 7: Verify back navigation
  await expect(analyticsPage.backButton).toBeVisible();
  await analyticsPage.clickBackButton();
  await expect(analyticsPage.monthlyTrendSection).toBeVisible();
});
