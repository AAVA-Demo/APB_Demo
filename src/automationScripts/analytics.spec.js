const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../../utils/logger');

test.describe('Credit Card Analytics - Spending Trends and Visualization', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test - navigating to application');
    analyticsPage = new AnalyticsPage(page);
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  test('QE-10395 TS-001 TC-001 - Verify 12-month trend chart with accurate data aggregation', async ({ page }) => {
    logger.info('Test Case: QE-10395 TS-001 TC-001 - Monthly spend trend analysis');
    
    // Step 1-2: Login and navigate to Analytics
    await loginPage.login('user_12months@example.com', 'SecurePass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsPageLoad();
    logger.info('Navigated to Analytics page');
    
    // Step 3: Access Monthly Trends section
    await analyticsPage.navigateToMonthlyTrends();
    logger.info('Monthly Trends section accessed');
    
    // Step 4: Verify trend chart displayed
    await analyticsPage.verifyTrendChartVisible();
    logger.info('Trend chart visualization rendered');
    
    // Step 5: Verify 12 months displayed
    const monthCount = await analyticsPage.getTrendChartMonthCount();
    expect(monthCount).toBe(12);
    logger.info('Chart displays data for 12 months');
    
    // Step 6: Verify monthly spending values
    const expectedValues = [1200, 1500, 1800, 2000, 1700, 1900, 2100, 2300, 2000, 1800, 2200, 2400];
    const actualValues = await analyticsPage.getMonthlySpendingValues();
    
    for (let i = 0; i < 12; i++) {
      expect(actualValues[i]).toBe(expectedValues[i]);
    }
    logger.info('All monthly spending values verified');
    
    // Step 7: Verify data aggregation accuracy
    await analyticsPage.verifyDataAggregationAccuracy();
    logger.info('Spending values accurately aggregated from transaction data');
    
    // Step 8: Verify chart interactivity
    await analyticsPage.hoverOverMonth('January');
    const januaryValue = await analyticsPage.getHoverValue();
    expect(januaryValue).toBe('$1,200.00');
    logger.info('Chart is interactive - hover displays exact values');
    
    // Step 9: Verify render time
    const renderTime = await analyticsPage.getChartRenderTime();
    expect(renderTime).toBeLessThan(3000);
    logger.info(`Chart rendered in ${renderTime}ms (under 3 seconds)`);
  });

  test('QE-10395 TS-002 TC-001 - Verify drill-down to specific month transaction breakdown', async ({ page }) => {
    logger.info('Test Case: QE-10395 TS-002 TC-001 - Monthly trend drill-down');
    
    // Step 1-2: Login and navigate to Monthly Trends
    await loginPage.login('user_12months@example.com', 'SecurePass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartLoad();
    logger.info('Monthly trends chart displayed');
    
    // Step 3: Click on March in the trend chart
    await analyticsPage.clickMonthInChart('March');
    logger.info('Clicked on March in trend chart');
    
    // Step 4: Verify detailed view opens
    await analyticsPage.verifyMonthDetailViewVisible();
    logger.info('Detailed transaction breakdown modal/page displayed');
    
    // Step 5: Verify individual transactions displayed
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(15);
    expect(transactionCount).toBeLessThanOrEqual(20);
    logger.info(`${transactionCount} transactions displayed for March`);
    
    // Step 6: Verify total matches chart value
    const transactionTotal = await analyticsPage.calculateTransactionTotal();
    expect(transactionTotal).toBe(1800.00);
    logger.info('Sum of transactions equals monthly total from chart');
    
    // Step 7: Verify spending patterns displayed
    await analyticsPage.verifySpendingPatternsVisible();
    logger.info('Spending patterns visualization displayed');
    
    // Step 8: Verify Back/Close option
    await analyticsPage.clickBackToTrendChart();
    await analyticsPage.verifyTrendChartVisible();
    logger.info('User navigated back to main trend chart view');
  });

  test('QE-10395 TS-003 TC-001 - Verify insufficient data message for new account', async ({ page }) => {
    logger.info('Test Case: QE-10395 TS-003 TC-001 - Insufficient historical data handling');
    
    // Step 1-2: Login with new account
    await loginPage.login('user_newaccount@example.com', 'SecurePass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsPageLoad();
    logger.info('New account user logged in');
    
    // Step 3: Attempt to access Monthly Trends
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 4: Verify insufficient data message
    await analyticsPage.verifyInsufficientDataMessage();
    logger.info('Insufficient historical data message displayed');
    
    // Step 5: Verify minimum requirement notice
    await analyticsPage.verifyMinimumDataRequirementNotice();
    logger.info('Minimum 1 month data requirement notice displayed');
    
    // Step 6: Verify no chart or empty state
    const isChartVisible = await analyticsPage.isTrendChartVisible();
    expect(isChartVisible).toBeFalsy();
    logger.info('Trend chart not displayed or shows empty state');
    
    // Step 7: Verify other analytics features accessible
    const isCategorySpendingAccessible = await analyticsPage.isCategorySpendingAccessible();
    expect(isCategorySpendingAccessible).toBeTruthy();
    logger.info('Other analytics sections remain accessible');
  });

  test('QE-10394 TS-001 TC-001 - Verify category-wise spending pie chart with all 9 categories', async ({ page }) => {
    logger.info('Test Case: QE-10394 TS-001 TC-001 - Category-wise spending visualization');
    
    // Step 1-2: Login and navigate to Analytics
    await loginPage.login('user_allcategories@example.com', 'SecurePass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsPageLoad();
    logger.info('User with all category transactions logged in');
    
    // Step 3: Verify pie chart displayed
    await analyticsPage.verifyCategoryPieChartVisible();
    logger.info('Pie chart for category-wise spending rendered');
    
    // Step 4: Verify all 9 categories displayed
    const categories = await analyticsPage.getCategoryNames();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    expect(categories.sort()).toEqual(expectedCategories.sort());
    logger.info('All 9 spending categories displayed in chart');
    
    // Step 5: Verify spending amounts
    const expectedAmounts = {
      'Food & Dining': 600,
      'Fuel': 300,
      'Shopping': 500,
      'Travel': 400,
      'Entertainment': 200,
      'Utilities': 150,
      'Healthcare': 100,
      'Education': 250,
      'Miscellaneous': 100
    };
    
    for (const [category, amount] of Object.entries(expectedAmounts)) {
      const actualAmount = await analyticsPage.getCategoryAmount(category);
      expect(actualAmount).toBe(amount);
    }
    logger.info('Each category displays correct spending amount');
    
    // Step 6: Verify percentages
    const expectedPercentages = {
      'Food & Dining': 24,
      'Fuel': 12,
      'Shopping': 20,
      'Travel': 16,
      'Entertainment': 8,
      'Utilities': 6,
      'Healthcare': 4,
      'Education': 10,
      'Miscellaneous': 4
    };
    
    for (const [category, percentage] of Object.entries(expectedPercentages)) {
      const actualPercentage = await analyticsPage.getCategoryPercentage(category);
      expect(actualPercentage).toBe(percentage);
    }
    logger.info('Each category displays correct percentage');
    
    // Step 7: Verify percentages sum to 100%
    const totalPercentage = await analyticsPage.getTotalPercentage();
    expect(totalPercentage).toBe(100);
    logger.info('Total of all percentages equals 100%');
    
    // Step 8: Verify chart interactivity
    await analyticsPage.hoverOverCategory('Food & Dining');
    const hoverText = await analyticsPage.getCategoryHoverText();
    expect(hoverText).toContain('Food & Dining: $600 (24%)');
    logger.info('Chart is interactive - hover shows details');
    
    // Step 9: Verify render time
    const renderTime = await analyticsPage.getCategoryChartRenderTime();
    expect(renderTime).toBeLessThan(3000);
    logger.info(`Category chart rendered in ${renderTime}ms`);
  });

  test('QE-10394 TS-002 TC-001 - Verify drill-down to category transaction list', async ({ page }) => {
    logger.info('Test Case: QE-10394 TS-002 TC-001 - Category drill-down');
    
    // Step 1-2: Login and view category pie chart
    await loginPage.login('user_allcategories@example.com', 'SecurePass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartLoad();
    logger.info('Category-wise spending pie chart displayed');
    
    // Step 3: Click on Food & Dining category
    await analyticsPage.clickCategorySegment('Food & Dining');
    logger.info('Clicked on Food & Dining category');
    
    // Step 4: Verify detailed transaction list
    await analyticsPage.verifyCategoryDetailViewVisible();
    logger.info('Detailed transaction list modal/page displayed');
    
    // Step 5-7: Verify transaction details
    const transactions = await analyticsPage.getCategoryTransactions();
    
    for (const transaction of transactions) {
      expect(transaction.date).toBeTruthy();
      expect(transaction.amount).toBeGreaterThan(0);
      expect(transaction.merchant).toBeTruthy();
    }
    logger.info('All transactions display dates, amounts, and merchant names');
    
    // Step 8: Verify total matches category total
    const transactionTotal = await analyticsPage.calculateCategoryTransactionTotal();
    expect(transactionTotal).toBe(600.00);
    logger.info('Sum of transactions equals category total from chart');
    
    // Step 9: Verify Back/Close option
    await analyticsPage.clickBackToCategoryChart();
    await analyticsPage.verifyCategoryPieChartVisible();
    logger.info('User navigated back to main analytics view');
  });

  test('QE-10394 TS-003 TC-001 - Verify no transactions message with option to view previous months', async ({ page }) => {
    logger.info('Test Case: QE-10394 TS-003 TC-001 - No transactions handling');
    
    // Step 1-2: Login with user having no current month transactions
    await loginPage.login('user_notransactions@example.com', 'SecurePass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsPageLoad();
    logger.info('User with no current month transactions logged in');
    
    // Step 3: Attempt to view category-wise spending
    // (Already on analytics page)
    
    // Step 4: Verify no data message
    await analyticsPage.verifyNoSpendingDataMessage();
    logger.info('No spending data message displayed');
    
    // Step 5: Verify no chart or empty state
    const isChartVisible = await analyticsPage.isCategoryPieChartVisible();
    expect(isChartVisible).toBeFalsy();
    logger.info('Chart not rendered or shows empty state');
    
    // Step 6: Verify View Previous Months option
    await analyticsPage.verifyViewPreviousMonthsOptionVisible();
    logger.info('View Previous Months option displayed');
    
    // Step 7: Select previous month
    await analyticsPage.selectPreviousMonth('October 2026');
    logger.info('Selected previous month: October 2026');
    
    // Step 8: Verify category chart displayed for previous month
    await analyticsPage.verifyCategoryPieChartVisible();
    const chartPeriod = await analyticsPage.getChartPeriod();
    expect(chartPeriod).toContain('October 2026');
    logger.info('Category-wise spending chart displayed for October 2026');
  });
});
