const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Credit Card Analytics - Category-Wise Spending', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('TC-4778: Verify category-wise spending chart displays all 9 categories with accurate calculations', async ({ page }) => {
    // Test Case ID: QE-7985 TS-001 TC-001
    // Step 1-2: Launch and authenticate
    await analyticsPage.login('testuser_all_categories', 'Pass@123');
    
    // Step 3: Navigate to Spending Analytics page
    await analyticsPage.navigateToSpendingAnalytics();
    
    // Step 4: Verify all 9 categories displayed
    const categories = await analyticsPage.getCategoryList();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories.length).toBe(9);
    expectedCategories.forEach(cat => {
      expect(categories).toContain(cat);
    });
    
    // Step 5: Verify accurate spending amounts
    const foodDiningAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(foodDiningAmount).toBe('$1,250.50');
    
    // Step 6: Verify percentage calculations
    const percentages = await analyticsPage.getAllCategoryPercentages();
    const totalPercentage = percentages.reduce((sum, p) => sum + parseFloat(p), 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    // Step 7: Verify chart interactivity
    await analyticsPage.hoverOverCategory('Food & Dining');
    const tooltipVisible = await analyticsPage.isTooltipVisible();
    expect(tooltipVisible).toBeTruthy();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('$1,250.50');
    expect(tooltipText).toContain('%');
  });

  test('TC-4780: Verify appropriate message displayed for user with no transaction history', async ({ page }) => {
    // Test Case ID: QE-7985 TS-002 TC-001
    // Step 1-2: Launch and authenticate
    await analyticsPage.login('testuser_no_transactions', 'Pass@123');
    
    // Step 3: Navigate to Spending Analytics page
    await analyticsPage.navigateToSpendingAnalytics();
    
    // Step 4: Verify appropriate message
    const message = await analyticsPage.getEmptyStateMessage();
    expect(message).toContain('Insufficient data to generate category-wise spending analysis');
    
    // Step 5: Verify no chart rendered
    const chartExists = await analyticsPage.isChartRendered();
    expect(chartExists).toBeFalsy();
    
    // Step 6: Verify no errors in console
    const consoleErrors = await analyticsPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
  });

  test('TC-4782: Verify category-wise spending chart updates dynamically based on date range filter', async ({ page }) => {
    // Test Case ID: QE-7985 TS-003 TC-001
    // Step 1-2: Launch and authenticate
    await analyticsPage.login('testuser_multi_month', 'Pass@123');
    
    // Step 3: Navigate to Spending Analytics page
    await analyticsPage.navigateToSpendingAnalytics();
    
    // Step 4: Note initial values
    const initialFoodDining = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(initialFoodDining).toBe('$3,500.00');
    const initialTotal = await analyticsPage.getTotalSpend();
    expect(initialTotal).toBe('$17,500.00');
    
    // Step 5: Apply date range filter
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    await analyticsPage.applyDateRangeFilter(thirtyDaysAgo, today);
    
    // Step 6: Verify chart updates
    await analyticsPage.waitForChartUpdate();
    const filteredTotal = await analyticsPage.getTotalSpend();
    expect(filteredTotal).toBe('$5,200.00');
    
    // Step 7: Verify category totals recalculated
    const filteredFoodDining = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(filteredFoodDining).toBe('$1,100.00');
    const filteredFuel = await analyticsPage.getCategoryAmount('Fuel');
    expect(filteredFuel).toBe('$300.00');
    const filteredShopping = await analyticsPage.getCategoryAmount('Shopping');
    expect(filteredShopping).toBe('$1,800.00');
    
    // Step 8: Verify percentages recalculated
    const foodDiningPercentage = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(parseFloat(foodDiningPercentage)).toBeCloseTo(21.15, 1);
  });
});

test.describe('Credit Card Analytics - Monthly Spend Trends', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('TC-4784: Verify monthly spend trends chart displays 12 months of data with drill-down capability', async ({ page }) => {
    // Test Case ID: QE-7984 TS-001 TC-001
    // Step 1-2: Launch and authenticate
    await analyticsPage.login('testuser_12months', 'Pass@123');
    
    // Step 3: Navigate to Monthly Trends
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 4: Verify 12 months displayed
    const monthsDisplayed = await analyticsPage.getMonthsDisplayed();
    expect(monthsDisplayed.length).toBe(12);
    
    // Step 5: Verify accurate spending values
    const janSpend = await analyticsPage.getMonthSpend('Jan 2024');
    expect(janSpend).toBe('$2,500.00');
    const febSpend = await analyticsPage.getMonthSpend('Feb 2024');
    expect(febSpend).toBe('$3,100.00');
    const marSpend = await analyticsPage.getMonthSpend('Mar 2024');
    expect(marSpend).toBe('$2,800.00');
    
    // Step 6: Verify axis labels
    const hasXAxisLabels = await analyticsPage.hasXAxisLabels();
    const hasYAxisLabels = await analyticsPage.hasYAxisLabels();
    expect(hasXAxisLabels).toBeTruthy();
    expect(hasYAxisLabels).toBeTruthy();
    
    // Step 7: Click on specific month
    await analyticsPage.clickMonth('March 2024');
    
    // Step 8: Verify drill-down view
    const drillDownVisible = await analyticsPage.isDrillDownViewVisible();
    expect(drillDownVisible).toBeTruthy();
    const transactions = await analyticsPage.getDrillDownTransactions();
    expect(transactions.length).toBeGreaterThan(0);
  });

  test('TC-4786: Verify notification displayed for insufficient historical data (less than 2 months)', async ({ page }) => {
    // Test Case ID: QE-7984 TS-002 TC-001
    // Step 1-2: Launch and authenticate
    await analyticsPage.login('testuser_new_account', 'Pass@123');
    
    // Step 3: Navigate to Monthly Trends
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 4: Verify notification message
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toContain('Insufficient historical data');
    expect(message).toContain('minimum 2 months required');
    
    // Step 5: Verify no chart rendered
    const chartRendered = await analyticsPage.isMonthlyTrendsChartRendered();
    expect(chartRendered).toBeFalsy();
    
    // Step 6: Verify recommendation
    const recommendation = await analyticsPage.getRecommendationText();
    expect(recommendation).toContain('Continue using your credit cards');
  });

  test('TC-4787: Verify drill-down functionality shows detailed breakdown for selected month', async ({ page }) => {
    // Test Case ID: QE-7984 TS-003 TC-001
    // Step 1-2: Launch and authenticate
    await analyticsPage.login('testuser_multi_month', 'Pass@123');
    
    // Step 3: Navigate to Monthly Trends
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 4: Select specific month
    await analyticsPage.clickMonth('April 2024');
    
    // Step 5: Verify category-wise distribution
    const drillDownCategories = await analyticsPage.getDrillDownCategories();
    expect(drillDownCategories['Food & Dining']).toBe('$800.00');
    expect(drillDownCategories['Fuel']).toBe('$200.00');
    expect(drillDownCategories['Shopping']).toBe('$1,500.00');
    const totalApril = await analyticsPage.getDrillDownTotal();
    expect(totalApril).toBe('$3,200.00');
    
    // Step 6: Verify top merchants
    const topMerchants = await analyticsPage.getTopMerchants();
    expect(topMerchants[0]).toEqual({ name: 'Amazon', amount: '$450.00' });
    expect(topMerchants[1]).toEqual({ name: 'Walmart', amount: '$380.00' });
    expect(topMerchants[2]).toEqual({ name: 'Starbucks', amount: '$220.00' });
    
    // Step 7: Verify transaction count
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBe(45);
    
    // Step 8: Navigate back
    await analyticsPage.clickBackToTrends();
    const trendsVisible = await analyticsPage.isMonthlyTrendsChartRendered();
    expect(trendsVisible).toBeTruthy();
  });
});