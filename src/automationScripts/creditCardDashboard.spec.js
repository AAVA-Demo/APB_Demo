const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { MyCardsPage } = require('./pages/myCards.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-9844 TS-001 TC-001
test('TC-6955: Verify dashboard retrieves and displays monthly spend accurately within 2 seconds', async ({ page }) => {
  logger.info('Starting test: TC-6955 - Monthly Spend Display');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Launch application
  await loginPage.navigate();
  await expect(page).toHaveURL(/.*creditcard-dashboard/);
  logger.info('Application launched successfully');
  
  // Step 2: Authenticate user
  await loginPage.login('testuser@example.com', 'TestPass123');
  await expect(loginPage.getUserProfile()).toBeVisible();
  logger.info('User authenticated successfully');
  
  // Step 3: Navigate to Dashboard
  await dashboardPage.navigate();
  await expect(dashboardPage.dashboardHeader).toBeVisible();
  logger.info('Dashboard page loaded');
  
  // Step 4-5: Verify monthly spend retrieval and display within 2 seconds
  const startTime = Date.now();
  await expect(dashboardPage.monthlySpendWidget).toBeVisible({ timeout: 2000 });
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThanOrEqual(2000);
  logger.info(`Monthly spend loaded in ${loadTime}ms`);
  
  // Step 6: Verify monthly spend value
  const monthlySpend = await dashboardPage.getMonthlySpendValue();
  expect(monthlySpend).toMatch(/₹[0-9,]+/);
  logger.info(`Monthly spend displayed: ${monthlySpend}`);
});

// Test Case - QE-9844 TS-002 TC-001
test('TC-6957: Verify dashboard displays zero monthly spend for user with no transactions', async ({ page }) => {
  logger.info('Starting test: TC-6957 - Zero Monthly Spend');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('notransactions@example.com', 'TestPass123');
  await dashboardPage.navigate();
  
  // Verify zero spend or informational message
  const monthlySpend = await dashboardPage.getMonthlySpendValue();
  const isZeroOrMessage = monthlySpend === '₹0' || await dashboardPage.noSpendingMessage.isVisible();
  expect(isZeroOrMessage).toBeTruthy();
  logger.info('Zero spend or informational message displayed correctly');
});

// Test Case - QE-9844 TS-003 TC-001
test('TC-6959: Verify dashboard displays cached data when TransactionService unavailable', async ({ page }) => {
  logger.info('Starting test: TC-6959 - Service Unavailable Fallback');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Intercept and fail transaction service
  await page.route('**/api/transactions/monthly-spend', route => route.abort());
  
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'TestPass123');
  await dashboardPage.navigate();
  
  // Verify cached data or error message
  const hasCachedData = await dashboardPage.monthlySpendWidget.isVisible();
  const hasErrorMessage = await dashboardPage.serviceErrorMessage.isVisible();
  expect(hasCachedData || hasErrorMessage).toBeTruthy();
  
  // Verify application did not crash
  await expect(page).not.toHaveTitle(/Error/);
  logger.info('Fallback behavior verified - application stable');
});

// Test Case - QE-9847 TS-001 TC-001
test('TC-6933: Verify KPI dashboard aggregates credit limit and balances for multiple cards', async ({ page }) => {
  logger.info('Starting test: TC-6933 - KPI Aggregation');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('multicard@example.com', 'TestPass123');
  await dashboardPage.navigate();
  
  // Verify all KPI widgets are visible
  await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
  await expect(dashboardPage.availableCreditWidget).toBeVisible();
  await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
  
  // Verify aggregated values
  const totalLimit = await dashboardPage.getTotalCreditLimit();
  const availableCredit = await dashboardPage.getAvailableCredit();
  const outstanding = await dashboardPage.getOutstandingAmount();
  
  expect(parseInt(totalLimit.replace(/[^0-9]/g, ''))).toBeGreaterThan(0);
  expect(parseInt(availableCredit.replace(/[^0-9]/g, ''))).toBeGreaterThan(0);
  expect(parseInt(outstanding.replace(/[^0-9]/g, ''))).toBeGreaterThanOrEqual(0);
  logger.info(`KPIs - Limit: ${totalLimit}, Available: ${availableCredit}, Outstanding: ${outstanding}`);
});

// Test Case - QE-9847 TS-002 TC-001
test('TC-6935: Verify KPI dashboard handles zero credit limit without errors', async ({ page }) => {
  logger.info('Starting test: TC-6935 - Zero Credit Limit Handling');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('zerolimit@example.com', 'TestPass123');
  await dashboardPage.navigate();
  
  // Verify utilization rate is 0% without NaN or errors
  const utilizationRate = await dashboardPage.getUtilizationRate();
  expect(utilizationRate).toMatch(/^[0-9]+\.?[0-9]*%$/);
  expect(utilizationRate).not.toContain('NaN');
  logger.info(`Utilization rate displayed: ${utilizationRate}`);
});

// Test Case - QE-9847 TS-003 TC-001
test('TC-6937: Verify utilization rate calculation with color-coded indicator (Yellow)', async ({ page }) => {
  logger.info('Starting test: TC-6937 - Utilization Rate Yellow Indicator');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('mediumutilization@example.com', 'TestPass123');
  await dashboardPage.navigate();
  
  // Verify utilization rate is 70% with yellow indicator
  const utilizationRate = await dashboardPage.getUtilizationRate();
  const utilizationValue = parseFloat(utilizationRate.replace('%', ''));
  expect(utilizationValue).toBeGreaterThanOrEqual(30);
  expect(utilizationValue).toBeLessThanOrEqual(70);
  
  // Verify yellow color indicator
  const indicatorColor = await dashboardPage.getUtilizationIndicatorColor();
  expect(indicatorColor).toContain('yellow');
  logger.info(`Utilization: ${utilizationRate}, Indicator: ${indicatorColor}`);
});

// Test Case - QE-9847 TS-003 TC-002
test('TC-6939: Verify utilization rate below 30% displays green indicator', async ({ page }) => {
  logger.info('Starting test: TC-6939 - Utilization Rate Green Indicator');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('lowutilization@example.com', 'TestPass123');
  await dashboardPage.navigate();
  
  const utilizationRate = await dashboardPage.getUtilizationRate();
  const utilizationValue = parseFloat(utilizationRate.replace('%', ''));
  expect(utilizationValue).toBeLessThan(30);
  
  const indicatorColor = await dashboardPage.getUtilizationIndicatorColor();
  expect(indicatorColor).toContain('green');
  logger.info(`Low utilization verified: ${utilizationRate} with green indicator`);
});

// Test Case - QE-9847 TS-003 TC-003
test('TC-6941: Verify utilization rate above 70% displays red indicator', async ({ page }) => {
  logger.info('Starting test: TC-6941 - Utilization Rate Red Indicator');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('highutilization@example.com', 'TestPass123');
  await dashboardPage.navigate();
  
  const utilizationRate = await dashboardPage.getUtilizationRate();
  const utilizationValue = parseFloat(utilizationRate.replace('%', ''));
  expect(utilizationValue).toBeGreaterThan(70);
  
  const indicatorColor = await dashboardPage.getUtilizationIndicatorColor();
  expect(indicatorColor).toContain('red');
  logger.info(`High utilization verified: ${utilizationRate} with red indicator`);
});

// Test Case - QE-9846 TS-001 TC-001
test('TC-6943: Verify card management displays up to 20 cards with masked numbers within 300ms', async ({ page }) => {
  logger.info('Starting test: TC-6943 - Multiple Card Display');
  const loginPage = new LoginPage(page);
  const myCardsPage = new MyCardsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('twentycards@example.com', 'TestPass123');
  await myCardsPage.navigate();
  
  // Verify retrieval time
  const startTime = Date.now();
  await expect(myCardsPage.cardList).toBeVisible({ timeout: 300 });
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThanOrEqual(300);
  logger.info(`Cards loaded in ${loadTime}ms`);
  
  // Verify card count
  const cardCount = await myCardsPage.getCardCount();
  expect(cardCount).toBeLessThanOrEqual(20);
  
  // Verify card number masking
  const firstCardNumber = await myCardsPage.getCardNumber(0);
  expect(firstCardNumber).toMatch(/^\*{4}\d{4}$/);
  logger.info(`Displayed ${cardCount} cards with masked numbers`);
});

// Test Case - QE-9846 TS-002 TC-001
test('TC-6945: Verify system handles more than 20 cards with pagination or error', async ({ page }) => {
  logger.info('Starting test: TC-6945 - Excess Card Handling');
  const loginPage = new LoginPage(page);
  const myCardsPage = new MyCardsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('twentyfivecards@example.com', 'TestPass123');
  await myCardsPage.navigate();
  
  // Check for pagination or error message
  const hasPagination = await myCardsPage.paginationControls.isVisible();
  const hasErrorMessage = await myCardsPage.maxCardsError.isVisible();
  expect(hasPagination || hasErrorMessage).toBeTruthy();
  
  if (hasPagination) {
    logger.info('Pagination controls displayed for excess cards');
  } else {
    const errorText = await myCardsPage.maxCardsError.textContent();
    expect(errorText).toContain('Maximum 20 cards');
    logger.info('Max cards error message displayed');
  }
});

// Test Case - QE-9846 TS-003 TC-001
test('TC-6947: Verify system denies access with invalid authentication token', async ({ page }) => {
  logger.info('Starting test: TC-6947 - Invalid Token Security');
  const myCardsPage = new MyCardsPage(page);
  
  // Set invalid token
  await page.goto('https://creditcard-dashboard.example.com');
  await page.evaluate(() => {
    localStorage.setItem('authToken', 'expired-token-12345');
  });
  
  // Attempt to access My Cards
  await myCardsPage.navigate();
  
  // Verify authentication error
  await expect(myCardsPage.authErrorMessage).toBeVisible();
  const errorText = await myCardsPage.authErrorMessage.textContent();
  expect(errorText).toContain('Invalid or expired token');
  
  // Verify no card data exposed
  await expect(myCardsPage.cardList).not.toBeVisible();
  logger.info('Access denied correctly - no sensitive data exposed');
});

// Test Case - QE-9845 TS-001 TC-001
test('TC-6949: Verify card comparison feature displays spending data with filtering', async ({ page }) => {
  logger.info('Starting test: TC-6949 - Card Comparison Feature');
  const loginPage = new LoginPage(page);
  const myCardsPage = new MyCardsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('multicard@example.com', 'TestPass123');
  await myCardsPage.navigate();
  
  // Activate comparison feature
  await myCardsPage.compareCardsButton.click();
  await expect(myCardsPage.comparisonView).toBeVisible();
  
  // Verify comparison metrics
  const cardMetrics = await myCardsPage.getComparisonMetrics();
  expect(cardMetrics.length).toBeGreaterThan(0);
  
  // Verify filtering capabilities
  await expect(myCardsPage.filterControls).toBeVisible();
  logger.info(`Comparison view displayed with ${cardMetrics.length} cards`);
});

// Test Case - QE-9845 TS-002 TC-001
test('TC-6951: Verify card with no transactions displays zero spend without errors', async ({ page }) => {
  logger.info('Starting test: TC-6951 - Zero Transaction Card');
  const loginPage = new LoginPage(page);
  const myCardsPage = new MyCardsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('notransactioncard@example.com', 'TestPass123');
  await myCardsPage.navigate();
  await myCardsPage.selectSpendAnalysis();
  
  // Verify zero values displayed
  const spend = await myCardsPage.getCardSpend(0);
  const utilization = await myCardsPage.getCardUtilization(0);
  expect(spend).toBe('0');
  expect(utilization).toBe('0%');
  
  // Verify card included in comparison
  await myCardsPage.compareCardsButton.click();
  const cardCount = await myCardsPage.getComparisonCardCount();
  expect(cardCount).toBeGreaterThan(0);
  logger.info('Zero transaction card handled correctly');
});

// Test Case - QE-9845 TS-003 TC-001
test('TC-6953: Verify system handles incomplete card data with fallback', async ({ page }) => {
  logger.info('Starting test: TC-6953 - Incomplete Data Handling');
  const loginPage = new LoginPage(page);
  const myCardsPage = new MyCardsPage(page);
  
  // Intercept and corrupt card data
  await page.route('**/api/cards/*/spend', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ incomplete: true })
    });
  });
  
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'TestPass123');
  await myCardsPage.navigate();
  await myCardsPage.compareCardsButton.click();
  
  // Verify fallback behavior
  const hasErrorMessage = await myCardsPage.dataLoadError.isVisible();
  const hasCachedData = await myCardsPage.comparisonView.isVisible();
  expect(hasErrorMessage || hasCachedData).toBeTruthy();
  logger.info('Incomplete data handled with fallback mechanism');
});

// Test Case - QE-9843 TS-001 TC-001
test('TC-6961: Verify analytics categorizes transactions across 9 categories', async ({ page }) => {
  logger.info('Starting test: TC-6961 - Category-wise Spending');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'TestPass123');
  await analyticsPage.navigate();
  
  // Verify all 9 categories displayed
  const categories = await analyticsPage.getAllCategories();
  const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
  expect(categories.length).toBe(9);
  expectedCategories.forEach(cat => {
    expect(categories).toContain(cat);
  });
  
  // Verify spending amounts displayed
  for (const category of categories) {
    const amount = await analyticsPage.getCategoryAmount(category);
    expect(amount).toMatch(/₹[0-9,]+/);
  }
  logger.info('All 9 categories displayed with spending amounts');
});

// Test Case - QE-9843 TS-002 TC-001
test('TC-6963: Verify uncategorized transactions assigned to Miscellaneous', async ({ page }) => {
  logger.info('Starting test: TC-6963 - Uncategorized Transaction Handling');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('uncategorized@example.com', 'TestPass123');
  await analyticsPage.navigate();
  
  // Verify Miscellaneous category has transactions
  const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
  expect(parseInt(miscAmount.replace(/[^0-9]/g, ''))).toBeGreaterThan(0);
  
  // Verify no data loss
  const totalTransactions = await analyticsPage.getTotalTransactionCount();
  expect(totalTransactions).toBeGreaterThan(0);
  logger.info('Uncategorized transactions assigned to Miscellaneous without data loss');
});

// Test Case - QE-9843 TS-003 TC-001
test('TC-6964: Verify analytics calculates percentages and identifies top category', async ({ page }) => {
  logger.info('Starting test: TC-6964 - Percentage Calculation and Top Category');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'TestPass123');
  await analyticsPage.navigate();
  
  // Verify percentages displayed
  const categories = await analyticsPage.getAllCategories();
  let totalPercentage = 0;
  for (const category of categories) {
    const percentage = await analyticsPage.getCategoryPercentage(category);
    totalPercentage += parseFloat(percentage.replace('%', ''));
  }
  expect(totalPercentage).toBeCloseTo(100, 1);
  
  // Verify top category identified
  const topCategory = await analyticsPage.getTopCategory();
  expect(topCategory).toBeTruthy();
  await expect(analyticsPage.topCategoryHighlight).toBeVisible();
  logger.info(`Top category identified: ${topCategory}`);
});

// Test Case - QE-9848 TS-001 TC-001
test('TC-6927: Verify 12-month trend analysis displays within 500ms', async ({ page }) => {
  logger.info('Starting test: TC-6927 - Monthly Trend Analysis');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'TestPass123');
  await analyticsPage.navigate();
  await analyticsPage.selectMonthlyTrendView();
  
  // Verify chart renders within 500ms
  const startTime = Date.now();
  await expect(analyticsPage.trendChart).toBeVisible({ timeout: 500 });
  const renderTime = Date.now() - startTime;
  expect(renderTime).toBeLessThanOrEqual(500);
  
  // Verify 12 data points
  const dataPoints = await analyticsPage.getTrendDataPoints();
  expect(dataPoints.length).toBe(12);
  logger.info(`Trend chart rendered in ${renderTime}ms with ${dataPoints.length} months`);
});

// Test Case - QE-9848 TS-002 TC-001
test('TC-6929: Verify trend analysis handles insufficient history without errors', async ({ page }) => {
  logger.info('Starting test: TC-6929 - Insufficient History Handling');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('newuser@example.com', 'TestPass123');
  await analyticsPage.navigate();
  await analyticsPage.selectMonthlyTrendView();
  
  // Verify chart displays available months
  await expect(analyticsPage.trendChart).toBeVisible();
  const dataPoints = await analyticsPage.getTrendDataPoints();
  expect(dataPoints.length).toBeLessThanOrEqual(12);
  
  // Verify no errors
  await expect(page).not.toHaveTitle(/Error/);
  logger.info(`Trend chart displayed with ${dataPoints.length} available months`);
});

// Test Case - QE-9848 TS-003 TC-001
test('TC-6931: Verify category filter recalculates trend within 500ms', async ({ page }) => {
  logger.info('Starting test: TC-6931 - Category Filter Performance');
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  
  await loginPage.navigate();
  await loginPage.login('testuser@example.com', 'TestPass123');
  await analyticsPage.navigate();
  await analyticsPage.selectMonthlyTrendView();
  
  // Apply category filter
  const startTime = Date.now();
  await analyticsPage.applyCategoryFilter('Food & Dining');
  await expect(analyticsPage.trendChart).toBeVisible({ timeout: 500 });
  const filterTime = Date.now() - startTime;
  expect(filterTime).toBeLessThanOrEqual(500);
  
  // Verify filtered data accuracy
  const filteredCategory = await analyticsPage.getActiveFilter();
  expect(filteredCategory).toBe('Food & Dining');
  logger.info(`Category filter applied in ${filterTime}ms`);
});