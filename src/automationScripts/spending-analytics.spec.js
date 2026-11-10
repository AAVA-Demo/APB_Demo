const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-10428 TS-001 TC-001
test.describe('Spending Analytics - Category Breakdown', () => {
  test('TC-001: Verify all nine categories with accurate totals and percentages', async ({ page }) => {
    logger.info('Starting TC-001: Category breakdown test');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_allcategories', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Analytics page loaded');

    // Step 3: Verify category breakdown displayed
    const breakdownVisible = await analyticsPage.isCategoryBreakdownVisible();
    expect(breakdownVisible).toBe(true);
    logger.info('Category breakdown section visible');

    // Step 4: Verify all nine categories
    const categories = await analyticsPage.getCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories).toEqual(expectedCategories);
    logger.info('All nine categories verified');

    // Step 5: Verify spending totals
    const categoryTotals = await analyticsPage.getCategoryTotals();
    expect(categoryTotals['Food & Dining']).toBe(2500);
    expect(categoryTotals['Fuel']).toBe(800);
    logger.info('Category totals verified');

    // Step 6: Verify percentages
    const categoryPercentages = await analyticsPage.getCategoryPercentages();
    expect(categoryPercentages['Food & Dining']).toBe('31.25%');
    expect(categoryPercentages['Fuel']).toBe('10.00%');
    logger.info('Category percentages verified');

    // Step 7: Calculate sum manually
    const manualSum = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    expect(manualSum).toBe(8000);
    logger.info('Manual sum calculated: $8,000');

    // Step 8: Verify total monthly spend matches
    const displayedTotal = await analyticsPage.getTotalMonthlySpend();
    expect(displayedTotal).toBe(8000);
    logger.info('Total monthly spend matches: $8,000');

    // Step 9: Verify percentages sum to 100%
    const percentageSum = Object.values(categoryPercentages).reduce((a, b) => a + parseFloat(b), 0);
    expect(Math.abs(percentageSum - 100)).toBeLessThan(0.1);
    logger.info('Percentages sum to 100%');

    // Step 10: Verify visualization displayed
    const chartVisible = await analyticsPage.isChartVisible();
    expect(chartVisible).toBe(true);
    logger.info('Interactive visualization displayed');

    // Step 11: Verify visualization data matches
    await analyticsPage.verifyChartDataAccuracy();
    logger.info('Visualization data accuracy: 100%');
  });
});

// Test Case - QE-10428 TS-002 TC-001
test.describe('Spending Analytics - Empty State', () => {
  test('TC-002: Verify empty state for period with no transactions', async ({ page }) => {
    logger.info('Starting TC-002: Empty state test');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    logger.info('User authenticated');

    // Step 2: Navigate to Analytics
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Analytics page loaded');

    // Step 3: Select period with no transactions
    await analyticsPage.selectTimePeriod('January 2025');
    logger.info('Selected period: January 2025 (no transactions)');

    // Step 4: Verify empty state message
    const emptyMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyMessage).toContain('No spending data available');
    logger.info('Empty state message verified');

    // Step 5: Verify all categories show $0
    const categoryTotals = await analyticsPage.getCategoryTotals();
    Object.values(categoryTotals).forEach(amount => {
      expect(amount).toBe(0);
    });
    logger.info('All categories show $0.00');

    // Step 6: Verify all percentages are 0%
    const categoryPercentages = await analyticsPage.getCategoryPercentages();
    Object.values(categoryPercentages).forEach(percentage => {
      expect(percentage).toBe('0.00%');
    });
    logger.info('All percentages are 0.00%');

    // Step 7: Verify total spend is $0
    const totalSpend = await analyticsPage.getTotalMonthlySpend();
    expect(totalSpend).toBe(0);
    logger.info('Total monthly spend: $0.00');

    // Step 8: Verify no misleading visualization
    const chartVisible = await analyticsPage.isChartVisible();
    if (chartVisible) {
      const chartData = await analyticsPage.getChartData();
      expect(chartData.every(val => val === 0)).toBe(true);
    }
    logger.info('No misleading visualization generated');

    // Step 9: Verify no fake data
    const pageContent = await page.content();
    expect(pageContent).not.toContain('placeholder');
    logger.info('No placeholder or fake data generated');
  });
});

// Test Case - QE-10428 TS-003 TC-001
test.describe('Spending Analytics - Category Drill-down', () => {
  test('TC-003: Verify drill-down into Food & Dining shows detailed transactions', async ({ page }) => {
    logger.info('Starting TC-003: Category drill-down test');
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login and navigate
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    logger.info('Analytics page loaded');

    // Step 2: Identify Food & Dining total
    const foodDiningTotal = await analyticsPage.getCategoryTotal('Food & Dining');
    expect(foodDiningTotal).toBe(2500);
    logger.info('Food & Dining total: $2,500');

    // Step 3: Click on Food & Dining category
    await analyticsPage.clickCategory('Food & Dining');
    logger.info('Clicked on Food & Dining category');

    // Step 4: Verify transaction list displayed
    const transactionListVisible = await analyticsPage.isTransactionListVisible();
    expect(transactionListVisible).toBe(true);
    logger.info('Transaction list displayed');

    // Step 5: Verify merchant names
    const merchantNames = await analyticsPage.getMerchantNames();
    expect(merchantNames.length).toBeGreaterThan(0);
    expect(merchantNames).toContain('Joe\'s Diner');
    logger.info('Merchant names verified');

    // Step 6: Verify transaction amounts
    const transactionAmounts = await analyticsPage.getTransactionAmounts();
    expect(transactionAmounts.length).toBeGreaterThan(0);
    logger.info('Transaction amounts verified');

    // Step 7: Verify transaction dates
    const transactionDates = await analyticsPage.getTransactionDates();
    expect(transactionDates.length).toBeGreaterThan(0);
    logger.info('Transaction dates verified');

    // Step 8: Verify transaction descriptions
    const descriptions = await analyticsPage.getTransactionDescriptions();
    expect(descriptions.length).toBeGreaterThan(0);
    logger.info('Transaction descriptions verified');

    // Step 9: Calculate sum manually
    const manualSum = transactionAmounts.reduce((a, b) => a + b, 0);
    expect(manualSum).toBe(2500);
    logger.info('Manual sum: $2,500');

    // Step 10: Verify sum matches category total
    expect(manualSum).toBe(foodDiningTotal);
    logger.info('Transaction sum matches category total: 100% accurate');

    // Step 11: Verify all transactions are Food & Dining
    const allCategories = await analyticsPage.getTransactionCategories();
    expect(allCategories.every(cat => cat === 'Food & Dining')).toBe(true);
    logger.info('All transactions belong to Food & Dining category');
  });
});
