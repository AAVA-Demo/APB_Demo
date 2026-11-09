const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-8343 TS001 TC-001
test('TC-5175: Verify category-wise spending breakdown with accurate amounts for all nine categories', async ({ page }) => {
  logger.info('Starting test: TC-5175');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupTransactions([
    { category: 'Food & Dining', amount: 150 },
    { category: 'Fuel', amount: 60 },
    { category: 'Shopping', amount: 200 }
  ]);
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  const categoryBreakdown = await analyticsPage.getCategoryWiseSpending();
  expect(categoryBreakdown['Food & Dining']).toBe('$150.00');
  expect(categoryBreakdown['Fuel']).toBe('$60.00');
  expect(categoryBreakdown['Shopping']).toBe('$200.00');
  
  // Verify all 9 categories are present
  const categories = await analyticsPage.getAllCategories();
  expect(categories).toHaveLength(9);
  expect(categories).toContain('Food & Dining');
  expect(categories).toContain('Fuel');
  expect(categories).toContain('Shopping');
  expect(categories).toContain('Travel');
  expect(categories).toContain('Entertainment');
  expect(categories).toContain('Utilities');
  expect(categories).toContain('Healthcare');
  expect(categories).toContain('Education');
  expect(categories).toContain('Miscellaneous');
  
  logger.info('Category-wise spending breakdown verified');
});

// Test Case - QE-8343 TS002 TC-001
test('TC-5176: Verify uncategorized transactions grouped under Miscellaneous with warning', async ({ page }) => {
  logger.info('Starting test: TC-5176');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupTransactions([
    { merchantCode: 'UNKNOWN-001', amount: 75 },
    { merchantCode: 'INVALID-999', amount: 125 }
  ]);
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  const categoryBreakdown = await analyticsPage.getCategoryWiseSpending();
  expect(categoryBreakdown['Miscellaneous']).toBe('$200.00');
  
  const warningMessage = await analyticsPage.getWarningMessage();
  await expect(warningMessage).toContainText('some transactions could not be categorized');
  await expect(warningMessage).toContainText('assigned to Miscellaneous');
  
  logger.info('Uncategorized transactions scenario verified');
});

// Test Case - QE-8343 TS003 TC-001
test('TC-5177: Verify error message when visualization rendering service fails', async ({ page }) => {
  logger.info('Starting test: TC-5177');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate visualization service failure
  await page.route('**/api/analytics/visualization', route => route.abort());
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  const errorMessage = await analyticsPage.getErrorMessage();
  await expect(errorMessage).toContainText('charts cannot be displayed');
  await expect(errorMessage).toContainText('service failure');
  
  logger.info('Visualization service failure scenario verified');
});

// Test Case - QE-8328 TS001 TC-001
test('TC-5220: Verify interactive visualizations for spending across all nine categories', async ({ page }) => {
  logger.info('Starting test: TC-5220');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupTransactions([
    { category: 'Food & Dining', amount: 150 },
    { category: 'Fuel', amount: 60 },
    { category: 'Shopping', amount: 200 },
    { category: 'Travel', amount: 500 },
    { category: 'Entertainment', amount: 80 },
    { category: 'Utilities', amount: 120 },
    { category: 'Healthcare', amount: 300 },
    { category: 'Education', amount: 250 },
    { category: 'Miscellaneous', amount: 50 }
  ]);
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  const visualization = await analyticsPage.getCategoryVisualization();
  await expect(visualization).toBeVisible();
  
  const categories = await analyticsPage.getAllCategories();
  expect(categories).toHaveLength(9);
  
  logger.info('All nine categories visualization verified');
});

// Test Case - QE-8328 TS002 TC-001
test('TC-5221: Verify visualization with transactions in only one category', async ({ page }) => {
  logger.info('Starting test: TC-5221');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupTransactions([
    { category: 'Food & Dining', amount: 350 }
  ]);
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  const categoryBreakdown = await analyticsPage.getCategoryWiseSpending();
  expect(categoryBreakdown['Food & Dining']).toBe('$350.00');
  
  // Verify other categories show zero
  const categories = ['Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
  for (const category of categories) {
    expect(categoryBreakdown[category]).toBe('$0.00');
  }
  
  logger.info('Single category spending verified');
});

// Test Case - QE-8328 TS003 TC-001
test('TC-5222: Verify error message when transaction categorization service fails', async ({ page }) => {
  logger.info('Starting test: TC-5222');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate categorization service failure
  await page.route('**/api/transactions/categorize', route => route.abort());
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  const errorMessage = await analyticsPage.getErrorMessage();
  await expect(errorMessage).toContainText('Spending data cannot be categorized for display');
  
  logger.info('Categorization service failure verified');
});

// Test Case - QE-8324 TS001 TC-001
test('TC-5232: Verify interactive responsive charts load within 3 seconds across all device types', async ({ page }) => {
  logger.info('Starting test: TC-5232');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupTransactions([
    { category: 'Food & Dining', amount: 150 },
    { category: 'Fuel', amount: 60 },
    { category: 'Shopping', amount: 200 }
  ]);
  
  // Test desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  const startTime1 = Date.now();
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  const loadTime1 = Date.now() - startTime1;
  expect(loadTime1).toBeLessThan(3000);
  
  // Verify chart interactivity
  const isInteractive = await analyticsPage.verifyChartInteractivity();
  expect(isInteractive).toBeTruthy();
  
  // Test tablet
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.reload();
  const startTime2 = Date.now();
  await analyticsPage.waitForAnalyticsLoad();
  const loadTime2 = Date.now() - startTime2;
  expect(loadTime2).toBeLessThan(3000);
  
  // Test mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  const startTime3 = Date.now();
  await analyticsPage.waitForAnalyticsLoad();
  const loadTime3 = Date.now() - startTime3;
  expect(loadTime3).toBeLessThan(3000);
  
  logger.info('Responsive charts verified across all devices');
});

// Test Case - QE-8324 TS002 TC-001
test('TC-5233: Verify empty charts with message when no categorized transactions exist', async ({ page }) => {
  logger.info('Starting test: TC-5233');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  const message = await analyticsPage.getInfoMessage();
  await expect(message).toContainText('No spending data available for visualization');
  
  logger.info('Empty charts scenario verified');
});

// Test Case - QE-8324 TS003 TC-001
test('TC-5234: Verify timeout warning on slow network connection', async ({ page }) => {
  logger.info('Starting test: TC-5234');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate slow network
  await page.route('**/api/analytics/**', async route => {
    await page.waitForTimeout(5000);
    await route.continue();
  });
  
  const startTime = Date.now();
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeGreaterThan(3000);
  
  const warningMessage = await analyticsPage.getWarningMessage();
  await expect(warningMessage).toContainText('Charts are taking longer to load');
  await expect(warningMessage).toContainText('network conditions');
  
  logger.info('Slow network scenario verified');
});

// Test Case - QE-8336 TS001 TC-001
test('TC-5196: Verify interactive chart displays monthly spending for 12 months', async ({ page }) => {
  logger.info('Starting test: TC-5196');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupMonthlyTransactions(12, 120);
  
  await analyticsPage.navigate();
  await analyticsPage.navigateToTrendAnalysis();
  await analyticsPage.waitForTrendChartLoad();
  
  const monthlyData = await analyticsPage.getMonthlyTrendData();
  expect(monthlyData.length).toBe(12);
  
  // Verify chart interactivity
  const isInteractive = await analyticsPage.verifyChartInteractivity();
  expect(isInteractive).toBeTruthy();
  
  logger.info('12-month trend analysis verified');
});

// Test Case - QE-8336 TS002 TC-001
test('TC-5197: Verify limited historical data message with only 2 months', async ({ page }) => {
  logger.info('Starting test: TC-5197');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupMonthlyTransactions(2, 20);
  
  await analyticsPage.navigate();
  await analyticsPage.navigateToTrendAnalysis();
  await analyticsPage.waitForTrendChartLoad();
  
  const monthlyData = await analyticsPage.getMonthlyTrendData();
  expect(monthlyData.length).toBe(2);
  
  const message = await analyticsPage.getInfoMessage();
  await expect(message).toContainText('Limited historical data');
  await expect(message).toContainText('only 2 months available');
  
  logger.info('Limited data scenario verified');
});

// Test Case - QE-8336 TS003 TC-001
test('TC-5198: Verify error message when reporting engine is down', async ({ page }) => {
  logger.info('Starting test: TC-5198');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate reporting engine outage
  await page.route('**/api/analytics/trends', route => route.abort());
  
  await analyticsPage.navigate();
  await analyticsPage.navigateToTrendAnalysis();
  
  const errorMessage = await analyticsPage.getErrorMessage();
  await expect(errorMessage).toContainText('Trend data cannot be generated');
  await expect(errorMessage).toContainText('service unavailability');
  
  logger.info('Reporting engine outage verified');
});

// Test Case - QE-8330 TS001 TC-001
test('TC-5214: Verify interactive charts with filtering and drill-down render within 3 seconds', async ({ page }) => {
  logger.info('Starting test: TC-5214');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupMonthlyTransactions(3, 45);
  
  await analyticsPage.navigate();
  await analyticsPage.navigateToTrendAnalysis();
  
  const startTime = Date.now();
  await analyticsPage.waitForTrendChartLoad();
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
  
  // Apply filter
  await analyticsPage.applyFilter('category', 'Shopping');
  await analyticsPage.waitForChartUpdate();
  
  // Perform drill-down
  await analyticsPage.clickMonth('2024-01');
  const detailView = await analyticsPage.getDetailedTransactionView();
  await expect(detailView).toBeVisible();
  
  logger.info('Filtering and drill-down verified');
});

// Test Case - QE-8330 TS002 TC-001
test('TC-5215: Verify insufficient data message with less than 3 months', async ({ page }) => {
  logger.info('Starting test: TC-5215');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupMonthlyTransactions(1, 15);
  
  await analyticsPage.navigate();
  await analyticsPage.navigateToTrendAnalysis();
  
  const message = await analyticsPage.getInfoMessage();
  await expect(message).toContainText('Insufficient data for trend analysis');
  await expect(message).toContainText('At least 3 months of transaction history required');
  
  logger.info('Insufficient data scenario verified');
});

// Test Case - QE-8330 TS003 TC-001
test('TC-5216: Verify performance warning with complex filters exceeding 3-second threshold', async ({ page }) => {
  logger.info('Starting test: TC-5216');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.navigate();
  await analyticsPage.navigateToTrendAnalysis();
  
  // Apply complex filters
  await analyticsPage.applyMultipleFilters({
    categories: ['Food', 'Fuel', 'Shopping'],
    dateRange: '12 months',
    cards: ['card1', 'card2', 'card3']
  });
  
  // Simulate slow rendering
  await page.route('**/api/analytics/filtered', async route => {
    await page.waitForTimeout(5000);
    await route.continue();
  });
  
  const startTime = Date.now();
  await analyticsPage.performDrillDown();
  const renderTime = Date.now() - startTime;
  
  expect(renderTime).toBeGreaterThan(3000);
  
  const warningMessage = await analyticsPage.getWarningMessage();
  await expect(warningMessage).toContainText('Chart rendering is taking longer than expected');
  await expect(warningMessage).toContainText('complex filters');
  
  logger.info('Complex filter performance warning verified');
});

// Test Case - QE-8338 TS001 TC-001
test('TC-5190: Verify drill-down into Food & Dining category shows detailed breakdown', async ({ page }) => {
  logger.info('Starting test: TC-5190');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.setupTransactions([
    { category: 'Food & Dining', merchant: 'Restaurant A', amount: 50 },
    { category: 'Food & Dining', merchant: 'Cafe B', amount: 30 },
    { category: 'Food & Dining', merchant: 'Restaurant C', amount: 70 }
  ]);
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  await analyticsPage.clickCategory('Food & Dining');
  
  const detailView = await analyticsPage.getDetailedTransactionView();
  await expect(detailView).toBeVisible();
  
  const transactions = await analyticsPage.getDetailedTransactions();
  expect(transactions.length).toBe(3);
  expect(transactions[0].merchant).toBe('Restaurant A');
  expect(transactions[0].amount).toBe('$50.00');
  
  logger.info('Category drill-down verified');
});

// Test Case - QE-8338 TS002 TC-001
test('TC-5191: Verify empty detail view with message for category with no transactions', async ({ page }) => {
  logger.info('Starting test: TC-5191');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  await analyticsPage.clickCategory('Healthcare');
  
  const detailView = await analyticsPage.getDetailedTransactionView();
  await expect(detailView).toBeVisible();
  
  const message = await analyticsPage.getInfoMessage();
  await expect(message).toContainText('No transactions exist for this category');
  
  logger.info('Empty category drill-down verified');
});

// Test Case - QE-8338 TS003 TC-001
test('TC-5192: Verify error message when detailed transaction service is unavailable', async ({ page }) => {
  logger.info('Starting test: TC-5192');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate transaction detail service failure
  await page.route('**/api/transactions/details/**', route => route.abort());
  
  await analyticsPage.navigate();
  await analyticsPage.waitForAnalyticsLoad();
  
  await analyticsPage.clickCategory('Food & Dining');
  
  const errorMessage = await analyticsPage.getErrorMessage();
  await expect(errorMessage).toContainText('Detailed breakdown cannot be displayed');
  await expect(errorMessage).toContainText('service unavailability');
  
  logger.info('Transaction detail service failure verified');
});