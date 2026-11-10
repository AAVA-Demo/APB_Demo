const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { MultiCardPage } = require('./pages/multiCard.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - Multiple Credit Card Display (QE-9878)', () => {
  let loginPage, dashboardPage, multiCardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    multiCardPage = new MultiCardPage(page);
    logger.info('Test setup completed');
  });

  test('TC-6928: Verify user with 5 credit cards can view all cards with complete details', async ({ page }) => {
    logger.info('Starting test case TC-6928');
    
    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Credit Card Dashboard/);
    logger.info('Application launched successfully');
    
    // Step 2: Login with user who has 5 cards
    await loginPage.login('user_with_5_cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User authenticated successfully');
    
    // Step 3: Navigate to credit card management interface
    await multiCardPage.navigateToCardManagement();
    await expect(multiCardPage.cardManagementContainer).toBeVisible();
    logger.info('Navigated to card management interface');
    
    // Step 4: Verify exactly 5 cards are displayed
    const cardCount = await multiCardPage.getCardCount();
    expect(cardCount).toBe(5);
    logger.info('Verified 5 cards are displayed');
    
    // Step 5: Verify each card displays complete details
    const expectedCards = [
      { number: '**** 1234', type: 'Visa', issuer: 'Chase', limit: 15000, available: 12000, outstanding: 3000 },
      { number: '**** 5678', type: 'Mastercard', issuer: 'Citi', limit: 20000, available: 15000, outstanding: 5000 },
      { number: '**** 9012', type: 'Amex', issuer: 'American Express', limit: 25000, available: 20000, outstanding: 5000 },
      { number: '**** 3456', type: 'Visa', issuer: 'Bank of America', limit: 10000, available: 8000, outstanding: 2000 },
      { number: '**** 7890', type: 'Discover', issuer: 'Discover', limit: 18000, available: 14000, outstanding: 4000 }
    ];
    
    for (let i = 0; i < expectedCards.length; i++) {
      await multiCardPage.verifyCardDetails(i, expectedCards[i]);
    }
    logger.info('All card details verified successfully');
  });

  test('TC-6930: Verify user with 15 credit cards sees only first 10 cards or validation error', async ({ page }) => {
    logger.info('Starting test case TC-6930');
    
    await loginPage.navigate();
    await loginPage.login('user_with_15_cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User with 15 cards authenticated');
    
    await multiCardPage.navigateToCardManagement();
    await expect(multiCardPage.cardManagementContainer).toBeVisible();
    
    // Verify system behavior for exceeding maximum card limit
    const cardCount = await multiCardPage.getCardCount();
    const errorMessage = await multiCardPage.getErrorMessage();
    
    const isValidBehavior = (cardCount === 10 && !errorMessage) || 
                           (errorMessage && errorMessage.includes('Maximum card limit'));
    
    expect(isValidBehavior).toBeTruthy();
    logger.info('System correctly handles 15 cards scenario');
  });

  test('TC-6932: Verify user with no credit cards sees empty state with appropriate message', async ({ page }) => {
    logger.info('Starting test case TC-6932');
    
    await loginPage.navigate();
    await loginPage.login('user_with_no_cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await multiCardPage.navigateToCardManagement();
    await expect(multiCardPage.cardManagementContainer).toBeVisible();
    
    const emptyStateMessage = await multiCardPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('No credit cards available');
    logger.info('Empty state message verified');
  });
});

test.describe('Credit Card Dashboard - Card-wise Spend Analysis (QE-9877)', () => {
  let loginPage, dashboardPage, multiCardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    multiCardPage = new MultiCardPage(page);
  });

  test('TC-6934: Verify detailed spending metrics for specific card with transactions', async ({ page }) => {
    logger.info('Starting test case TC-6934');
    
    await loginPage.navigate();
    await loginPage.login('user_multi_cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await multiCardPage.navigateToCardManagement();
    await expect(multiCardPage.cardManagementContainer).toBeVisible();
    
    // Select specific card
    await multiCardPage.selectCard('**** 1234');
    await expect(multiCardPage.cardDetailsSection).toBeVisible();
    logger.info('Card selected and details section visible');
    
    // Verify spending metrics
    const metrics = await multiCardPage.getCardSpendingMetrics();
    expect(metrics.totalSpend).toBe(5000);
    expect(metrics.transactionCount).toBe(25);
    expect(metrics.averageTransaction).toBe(200);
    
    // Verify category breakdown
    const categories = await multiCardPage.getCategoryBreakdown();
    expect(categories['Food & Dining']).toBe(1500);
    expect(categories['Fuel']).toBe(800);
    expect(categories['Shopping']).toBe(2700);
    logger.info('Spending metrics verified successfully');
  });

  test('TC-6936: Verify spending metrics with zero values for card with no transactions', async ({ page }) => {
    logger.info('Starting test case TC-6936');
    
    await loginPage.navigate();
    await loginPage.login('user_no_txn_card', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await multiCardPage.navigateToCardManagement();
    await multiCardPage.selectCard('**** 5678');
    await expect(multiCardPage.cardDetailsSection).toBeVisible();
    
    const metrics = await multiCardPage.getCardSpendingMetrics();
    expect(metrics.totalSpend).toBe(0);
    expect(metrics.transactionCount).toBe(0);
    expect(metrics.averageTransaction).toBe(0);
    
    const noTransactionMessage = await multiCardPage.getNoTransactionMessage();
    expect(noTransactionMessage).toContain('No transactions on this card');
    logger.info('Zero value metrics verified');
  });

  test('TC-6938: Verify error message for deactivated card spending analysis', async ({ page }) => {
    logger.info('Starting test case TC-6938');
    
    await loginPage.navigate();
    await loginPage.login('user_deactivated_card', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Attempt to access deactivated card
    await page.goto('/cards/card-deactivated-9999/analysis');
    
    const errorMessage = await multiCardPage.getErrorMessage();
    const isValidError = errorMessage.includes('no longer available') || 
                        errorMessage.includes('deactivated');
    expect(isValidError).toBeTruthy();
    logger.info('Deactivated card error verified');
  });
});

test.describe('Credit Card Dashboard - Total Credit Limit Display (QE-9876)', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC-6940: Verify accurate aggregated total credit limit for multiple cards', async ({ page }) => {
    logger.info('Starting test case TC-6940');
    
    await loginPage.navigate();
    await loginPage.login('user_multi_cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await dashboardPage.navigateToFinancialOverview();
    await expect(dashboardPage.financialOverviewSection).toBeVisible();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe(60000);
    logger.info('Total credit limit verified: $60,000');
  });

  test('TC-6942: Verify total credit limit equals single card limit', async ({ page }) => {
    logger.info('Starting test case TC-6942');
    
    await loginPage.navigate();
    await loginPage.login('user_single_card', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await dashboardPage.navigateToFinancialOverview();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe(15000);
    logger.info('Single card credit limit verified: $15,000');
  });

  test('TC-6944: Verify total credit limit zero or message for no cards', async ({ page }) => {
    logger.info('Starting test case TC-6944');
    
    await loginPage.navigate();
    await loginPage.login('user_no_cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await dashboardPage.navigateToFinancialOverview();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    
    const isValidState = totalCreditLimit === 0 || noCardsMessage.includes('No credit cards available');
    expect(isValidState).toBeTruthy();
    logger.info('No cards state verified');
  });
});

test.describe('Credit Card Dashboard - Category-wise Spending Visualization (QE-9875)', () => {
  let loginPage, dashboardPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
  });

  test('TC-6946: Verify accurate spending chart for all 9 categories within 3 seconds', async ({ page }) => {
    logger.info('Starting test case TC-6946');
    
    await loginPage.navigate();
    await loginPage.login('user_all_categories', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    const startTime = Date.now();
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.spendingChart).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(3000);
    logger.info(`Chart loaded in ${loadTime}ms`);
    
    const categoryData = await analyticsPage.getCategorySpending();
    expect(categoryData['Food & Dining']).toBe(1500);
    expect(categoryData['Fuel']).toBe(800);
    expect(categoryData['Shopping']).toBe(2700);
    expect(categoryData['Travel']).toBe(1200);
    expect(categoryData['Entertainment']).toBe(600);
    expect(categoryData['Utilities']).toBe(400);
    expect(categoryData['Healthcare']).toBe(300);
    expect(categoryData['Education']).toBe(500);
    expect(categoryData['Miscellaneous']).toBe(200);
    logger.info('All 9 categories verified');
  });

  test('TC-6948: Verify chart with data for 3 categories and zero for remaining', async ({ page }) => {
    logger.info('Starting test case TC-6948');
    
    await loginPage.navigate();
    await loginPage.login('user_three_categories', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.spendingChart).toBeVisible();
    
    const categoryData = await analyticsPage.getCategorySpending();
    expect(categoryData['Food & Dining']).toBe(1500);
    expect(categoryData['Fuel']).toBe(800);
    expect(categoryData['Shopping']).toBe(2700);
    
    const otherCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of otherCategories) {
      const value = categoryData[category] || 0;
      expect(value).toBe(0);
    }
    logger.info('Partial category data verified');
  });

  test('TC-6950: Verify empty chart or message for no transactions', async ({ page }) => {
    logger.info('Starting test case TC-6950');
    
    await loginPage.navigate();
    await loginPage.login('user_no_transactions', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await analyticsPage.navigateToSpendingAnalytics();
    
    const emptyMessage = await analyticsPage.getEmptyDataMessage();
    const isChartEmpty = await analyticsPage.isChartEmpty();
    
    const isValidState = isChartEmpty || emptyMessage.includes('No spending data available');
    expect(isValidState).toBeTruthy();
    logger.info('Empty state verified');
  });
});

test.describe('Credit Card Dashboard - Monthly Spend Trends Analysis (QE-9874)', () => {
  let loginPage, dashboardPage, analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    analyticsPage = new AnalyticsPage(page);
  });

  test('TC-6952: Verify interactive trend chart with drill-down capability', async ({ page }) => {
    logger.info('Starting test case TC-6952');
    
    await loginPage.navigate();
    await loginPage.login('user_current_month_txn', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.trendChart).toBeVisible();
    
    const trendData = await analyticsPage.getWeeklyTrends();
    expect(trendData['Week 1']).toBe(1200);
    expect(trendData['Week 2']).toBe(1500);
    expect(trendData['Week 3']).toBe(1800);
    expect(trendData['Week 4']).toBe(2000);
    logger.info('Trend data verified');
    
    // Test drill-down
    await analyticsPage.clickTrendDataPoint('Week 2');
    await expect(analyticsPage.transactionDetailsList).toBeVisible();
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    logger.info('Drill-down functionality verified');
  });

  test('TC-6954: Verify empty trend chart for no current month transactions', async ({ page }) => {
    logger.info('Starting test case TC-6954');
    
    await loginPage.navigate();
    await loginPage.login('user_previous_month_only', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await analyticsPage.navigateToSpendingAnalytics();
    
    const emptyMessage = await analyticsPage.getEmptyTrendMessage();
    const isChartEmpty = await analyticsPage.isTrendChartEmpty();
    
    const isValidState = isChartEmpty || emptyMessage.includes('No spending data for current month');
    expect(isValidState).toBeTruthy();
    logger.info('Empty trend state verified');
  });

  test('TC-6956: Verify appropriate message for drill-down with no transactions', async ({ page }) => {
    logger.info('Starting test case TC-6956');
    
    await loginPage.navigate();
    await loginPage.login('user_sparse_txn', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.trendChart).toBeVisible();
    
    // Click on date range with no transactions
    await analyticsPage.clickTrendDataPoint('Jan 15-21');
    
    const noTransactionMessage = await analyticsPage.getNoTransactionMessage();
    expect(noTransactionMessage).toContain('No transactions for selected period');
    logger.info('No transaction message verified');
  });
});

test.describe('Credit Card Dashboard - Monthly Spend KPI Display (QE-9873)', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC-6958: Verify monthly spend KPI displays within 2 seconds', async ({ page }) => {
    logger.info('Starting test case TC-6958');
    
    await loginPage.navigate();
    await loginPage.login('user_active', 'Pass@123');
    
    const startTime = Date.now();
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe(12450.75);
    logger.info('Monthly spend KPI verified: $12,450.75');
  });

  test('TC-6960: Verify monthly spend KPI zero for first day of new month', async ({ page }) => {
    logger.info('Starting test case TC-6960');
    
    await loginPage.navigate();
    await loginPage.login('user_new_month', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const noSpendingMessage = await dashboardPage.getNoSpendingMessage();
    
    const isValidState = monthlySpend === 0 || noSpendingMessage.includes('No spending this month');
    expect(isValidState).toBeTruthy();
    logger.info('New month zero spend verified');
  });

  test('TC-6962: Verify error message or cached value when service unavailable', async ({ page }) => {
    logger.info('Starting test case TC-6962');
    
    // Simulate service unavailability by intercepting network requests
    await page.route('**/api/kpi/metrics**', route => route.abort());
    
    await loginPage.navigate();
    await loginPage.login('user_service_down', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    const cachedIndicator = await dashboardPage.getCachedDataIndicator();
    
    const isValidState = errorMessage.includes('Unable to load real-time data') || 
                        cachedIndicator.includes('Data as of');
    expect(isValidState).toBeTruthy();
    logger.info('Service unavailable state verified');
  });
});