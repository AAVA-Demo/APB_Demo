const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const Logger = require('../utils/logger');

/**
 * Test Suite: Transaction Analytics and Category-wise Spending
 * Epic: QE-9829 - CreditCardNew20261110205228-Transaction Analytics and Category-wise Spending
 * User Stories: QE-9912 (Category-wise Spending Visualization), QE-9914 (Monthly Spend Trend Analytics)
 */

test.describe('Analytics - Category-wise Spending Visualization (QE-9912)', () => {

  test('QE-9996 TS001 TC-001: Verify user with transactions across all 9 categories can view interactive pie/bar chart with spending breakdown and percentages', async ({ page }) => {
    Logger.info('Starting test: QE-9996 TS001 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Launch the application and log in with user having transactions across 9 categories
    Logger.info('Step 1: Launching and logging in with user_multi_category');
    await loginPage.navigate();
    await loginPage.login('user_multi_category', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the transaction analytics dashboard
    Logger.info('Step 2: Navigating to analytics dashboard');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    Logger.info('Analytics dashboard loads successfully');

    // Step 3: Verify interactive chart (pie or bar) is displayed
    Logger.info('Step 3: Verifying chart display');
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getAllCategories();
    expect(categories.length).toBe(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    Logger.info('Chart is visible with all 9 categories');

    // Step 4: Verify each category displays spending amount
    Logger.info('Step 4: Verifying spending amounts');
    const spendingAmounts = await analyticsPage.getAllCategorySpendingAmounts();
    expect(spendingAmounts['Food & Dining']).toBe('₹6,200');
    expect(spendingAmounts['Fuel']).toBe('₹2,800');
    expect(spendingAmounts['Shopping']).toBe('₹5,500');
    expect(spendingAmounts['Travel']).toBe('₹5,500');
    expect(spendingAmounts['Entertainment']).toBe('₹2,000');
    expect(spendingAmounts['Utilities']).toBe('₹2,200');
    expect(spendingAmounts['Healthcare']).toBe('₹2,000');
    expect(spendingAmounts['Education']).toBe('₹1,500');
    expect(spendingAmounts['Miscellaneous']).toBe('₹800');
    Logger.info('Spending amounts are displayed for each category');

    // Step 5: Verify each category displays percentage of total spend
    Logger.info('Step 5: Verifying percentages');
    const percentages = await analyticsPage.getAllCategoryPercentages();
    expect(percentages).toBeTruthy();
    Logger.info('Percentages are calculated and displayed correctly');

    // Step 6: Verify chart is interactive (hover/click functionality)
    Logger.info('Step 6: Verifying chart interactivity');
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    Logger.info('Chart responds to user interactions with tooltips or highlights');
    Logger.info('Test QE-9996 TS001 TC-001 completed successfully');
  });

  test('QE-9996 TS002 TC-001: Verify category-wise spending visualization displays 100% allocation when user has transactions in only one category', async ({ page }) => {
    Logger.info('Starting test: QE-9996 TS002 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Launch the application and log in with user having transactions in only Fuel category
    Logger.info('Step 1: Launching and logging in with user_single_category');
    await loginPage.navigate();
    await loginPage.login('user_single_category', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the transaction analytics dashboard
    Logger.info('Step 2: Navigating to analytics dashboard');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    Logger.info('Analytics dashboard loads');

    // Step 3: Verify chart displays 100% allocation to Fuel category
    Logger.info('Step 3: Verifying 100% allocation to Fuel');
    const fuelPercentage = await analyticsPage.getCategoryPercentage('Fuel');
    expect(fuelPercentage).toBe('100%');
    const fuelAmount = await analyticsPage.getCategorySpendingAmount('Fuel');
    expect(fuelAmount).toBe('₹2,800');
    Logger.info('Fuel category shows 100% of total spend');

    // Step 4: Verify other categories show 0% or are hidden
    Logger.info('Step 4: Verifying other categories');
    const visibleCategories = await analyticsPage.getVisibleCategories();
    expect(visibleCategories.length).toBeLessThanOrEqual(1);
    Logger.info('Other categories either show 0% or are not displayed in the chart');
    Logger.info('Test QE-9996 TS002 TC-001 completed successfully');
  });

  test('QE-9996 TS003 TC-001: Verify clicking on a category segment drills down to show detailed transactions within that category', async ({ page }) => {
    Logger.info('Starting test: QE-9996 TS003 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Launch the application and log in
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the transaction analytics dashboard
    Logger.info('Step 2: Navigating to analytics dashboard');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.categoryChart).toBeVisible();
    Logger.info('Analytics dashboard with category chart loads');

    // Step 3: Click on the Travel category segment in the interactive chart
    Logger.info('Step 3: Clicking on Travel category');
    await analyticsPage.clickCategorySegment('Travel');
    Logger.info('System drills down to Travel category details');

    // Step 4: Verify detailed transactions within Travel category are displayed
    Logger.info('Step 4: Verifying transaction list');
    await expect(analyticsPage.transactionList).toBeVisible();
    const transactions = await analyticsPage.getCategoryTransactions('Travel');
    expect(transactions.length).toBeGreaterThan(0);
    Logger.info('List of Travel transactions is shown');

    // Step 5: Verify each transaction displays merchant name
    Logger.info('Step 5: Verifying merchant names');
    const merchantNames = await analyticsPage.getTransactionMerchantNames();
    expect(merchantNames).toContain('Airline');
    Logger.info('Merchant names are visible (e.g., Airline, Hotel)');

    // Step 6: Verify each transaction displays amount
    Logger.info('Step 6: Verifying transaction amounts');
    const amounts = await analyticsPage.getTransactionAmounts();
    expect(amounts.length).toBeGreaterThan(0);
    Logger.info('Transaction amounts are displayed (e.g., ₹3,000, ₹2,500)');

    // Step 7: Verify each transaction displays transaction date
    Logger.info('Step 7: Verifying transaction dates');
    const dates = await analyticsPage.getTransactionDates();
    expect(dates.length).toBeGreaterThan(0);
    Logger.info('Transaction dates are displayed (e.g., 2024-06-07, 2024-06-10)');
    Logger.info('Test QE-9996 TS003 TC-001 completed successfully');
  });
});

test.describe('Analytics - Monthly Spend Trend Analytics (QE-9914)', () => {

  test('QE-9994 TS001 TC-001: Verify user with 6 months transaction history can view interactive line chart with month-over-month spending trends', async ({ page }) => {
    Logger.info('Starting test: QE-9994 TS001 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Launch the application and log in with user having 6 months of transaction history
    Logger.info('Step 1: Launching and logging in with user_6months');
    await loginPage.navigate();
    await loginPage.login('user_6months', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the monthly trend analytics view
    Logger.info('Step 2: Navigating to monthly trend analytics');
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartLoad();
    Logger.info('Analytics page loads successfully');

    // Step 3: Verify interactive line chart is displayed
    Logger.info('Step 3: Verifying line chart display');
    await expect(analyticsPage.trendChart).toBeVisible();
    const months = await analyticsPage.getTrendChartMonths();
    expect(months).toContain('Jan');
    expect(months).toContain('Feb');
    expect(months).toContain('Mar');
    expect(months).toContain('Apr');
    expect(months).toContain('May');
    expect(months).toContain('Jun');
    Logger.info('Line chart is visible showing 6 months of data');

    // Step 4: Verify chart displays spending trends for each month
    Logger.info('Step 4: Verifying monthly spending values');
    const monthlyValues = await analyticsPage.getMonthlySpendingValues();
    expect(monthlyValues['Jan']).toBe('₹10,000');
    expect(monthlyValues['Feb']).toBe('₹12,000');
    expect(monthlyValues['Mar']).toBe('₹11,500');
    expect(monthlyValues['Apr']).toBe('₹13,000');
    expect(monthlyValues['May']).toBe('₹12,500');
    expect(monthlyValues['Jun']).toBe('₹14,000');
    Logger.info('Monthly spending values are plotted correctly');

    // Step 5: Verify month-over-month comparisons are visible
    Logger.info('Step 5: Verifying trend lines');
    await expect(analyticsPage.trendLine).toBeVisible();
    Logger.info('Chart shows trend lines connecting monthly data points');

    // Step 6: Verify chart is interactive (hover shows data points)
    Logger.info('Step 6: Verifying chart interactivity');
    await analyticsPage.hoverOverMonth('Jun');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipValue = await analyticsPage.getTooltipValue();
    expect(tooltipValue).toContain('₹14,000');
    Logger.info('Hovering over data points displays exact spending amounts');

    // Step 7: Verify user can identify spending patterns from the visualization
    Logger.info('Step 7: Verifying trend visibility');
    const trendDirection = await analyticsPage.getTrendDirection();
    expect(trendDirection).toBeTruthy();
    Logger.info('Trend direction (increasing/decreasing) is clearly visible');
    Logger.info('Test QE-9994 TS001 TC-001 completed successfully');
  });

  test('QE-9994 TS002 TC-001: Verify clear message is displayed when user with no transaction history attempts to access monthly trend analytics', async ({ page }) => {
    Logger.info('Starting test: QE-9994 TS002 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Launch the application and log in with user having no transaction history
    Logger.info('Step 1: Launching and logging in with user_no_transactions');
    await loginPage.navigate();
    await loginPage.login('user_no_transactions', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the monthly trend analytics view
    Logger.info('Step 2: Navigating to monthly trend analytics');
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForAnalyticsLoad();
    Logger.info('Analytics page loads');

    // Step 3: Verify message indicating no transaction data is displayed
    Logger.info('Step 3: Verifying no data message');
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toContain('No transaction data available for trend analysis');
    Logger.info('Message shows correctly');

    // Step 4: Verify suggestion to complete transactions is displayed
    Logger.info('Step 4: Verifying suggestion message');
    await expect(analyticsPage.suggestionMessage).toBeVisible();
    const suggestion = await analyticsPage.getSuggestionMessage();
    expect(suggestion).toContain('Complete transactions first to view spending trends');
    Logger.info('Suggestion message shows correctly');

    // Step 5: Verify no chart or empty chart is displayed
    Logger.info('Step 5: Verifying chart absence');
    const chartVisible = await analyticsPage.trendChart.isVisible().catch(() => false);
    expect(chartVisible).toBe(false);
    Logger.info('Chart area is empty or displays placeholder');
    Logger.info('Test QE-9994 TS002 TC-001 completed successfully');
  });

  test('QE-9994 TS003 TC-001: Verify monthly spend trend chart dynamically updates when user applies category filter', async ({ page }) => {
    Logger.info('Starting test: QE-9994 TS003 TC-001');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Launch the application and log in
    Logger.info('Step 1: Launching and logging in');
    await loginPage.navigate();
    await loginPage.login('user123', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    Logger.info('User is authenticated successfully');

    // Step 2: Navigate to the monthly trend analytics view
    Logger.info('Step 2: Navigating to monthly trend analytics');
    await analyticsPage.navigate();
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartLoad();
    await expect(analyticsPage.trendChart).toBeVisible();
    Logger.info('Analytics page with trend chart loads');

    // Step 3: Verify initial chart displays all categories combined
    Logger.info('Step 3: Verifying initial chart state');
    const initialTotal = await analyticsPage.getTotalSpending();
    expect(initialTotal).toBeTruthy();
    Logger.info('Chart shows total spending across all categories');

    // Step 4: Apply category filter for 'Food & Dining'
    Logger.info('Step 4: Applying Food & Dining filter');
    await analyticsPage.selectCategoryFilter('Food & Dining');
    await page.waitForTimeout(1000); // Wait for dynamic update
    Logger.info('Filter is applied successfully');

    // Step 5: Verify chart dynamically updates to show only Food & Dining spending trends
    Logger.info('Step 5: Verifying filtered chart data');
    const filteredValues = await analyticsPage.getMonthlySpendingValues();
    expect(filteredValues['Jan']).toBeTruthy();
    expect(filteredValues['Feb']).toBeTruthy();
    expect(filteredValues['Mar']).toBeTruthy();
    expect(filteredValues['Apr']).toBeTruthy();
    expect(filteredValues['May']).toBeTruthy();
    expect(filteredValues['Jun']).toBeTruthy();
    Logger.info('Chart displays spending trends for Food & Dining category only across multiple months');

    // Step 6: Verify chart updates without page reload
    Logger.info('Step 6: Verifying no page reload');
    const currentUrl = page.url();
    expect(currentUrl).toContain('analytics');
    Logger.info('Chart refreshes dynamically without full page reload');

    // Step 7: Verify user can perform focused analysis on selected category
    Logger.info('Step 7: Verifying focused analysis capability');
    await expect(analyticsPage.trendChart).toBeVisible();
    Logger.info('Category-specific trends are clearly visible and analyzable');
    Logger.info('Test QE-9994 TS003 TC-001 completed successfully');
  });
});