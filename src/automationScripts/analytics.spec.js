const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { Logger } = require('../utils/logger');
const testData = require('../data/testData.json');

test.describe('Analytics and Spending Insights Tests', () => {
  let analyticsPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger = new Logger('AnalyticsSpec');
    logger.info('Navigating to analytics dashboard');
    await analyticsPage.navigate();
  });

  test('QE-8897 TS-001 TC-001: Verify multi-category spending visualization displays all 9 predefined categories', async ({ page }) => {
    logger.info('Test Case: QE-8897 TS-001 TC-001 - Multi-category Visualization Test');
    
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categories = await analyticsPage.getAllCategoryLabels();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    expect(categories.length).toBe(9);
    expectedCategories.forEach(cat => {
      expect(categories).toContain(cat);
    });
    
    const categoryAmounts = await analyticsPage.getCategorySpendingAmounts();
    logger.info(`Category amounts: ${JSON.stringify(categoryAmounts)}`);
    
    expect(categoryAmounts['Food & Dining']).toBe('$1,250.00');
    expect(categoryAmounts['Fuel']).toBe('$320.00');
    expect(categoryAmounts['Shopping']).toBe('$890.00');
    
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBeTruthy();
  });

  test('QE-8897 TS-002 TC-001: Verify limited category spending displays only categories with transactions', async ({ page }) => {
    logger.info('Test Case: QE-8897 TS-002 TC-001 - Limited Category Test');
    
    const user = testData.users.testuser_limited_spending;
    await analyticsPage.loginAndNavigate(user.username, user.password);
    
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    const visibleCategories = await analyticsPage.getVisibleCategories();
    expect(visibleCategories.length).toBe(2);
    expect(visibleCategories).toContain('Food & Dining');
    expect(visibleCategories).toContain('Fuel');
    
    const categoryAmounts = await analyticsPage.getCategorySpendingAmounts();
    expect(categoryAmounts['Food & Dining']).toBe('$850.00');
    expect(categoryAmounts['Fuel']).toBe('$420.00');
    
    const zeroCategories = ['Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const cat of zeroCategories) {
      const amount = categoryAmounts[cat];
      if (amount) {
        expect(amount).toBe('$0.00');
      }
    }
    
    logger.info('Limited category scenario validated');
  });

  test('QE-8897 TS-003 TC-001: Verify category drill-down displays all transactions for selected category', async ({ page }) => {
    logger.info('Test Case: QE-8897 TS-003 TC-001 - Category Drill-down Test');
    
    await analyticsPage.waitForAnalyticsDashboardLoad();
    
    await analyticsPage.clickCategory('Shopping');
    
    await expect(analyticsPage.transactionDetailView).toBeVisible();
    
    const transactions = await analyticsPage.getTransactionList();
    expect(transactions.length).toBeGreaterThanOrEqual(5);
    
    const expectedMerchants = ['Amazon', 'Target', 'BestBuy', 'Walmart', "Macy's"];
    const transactionMerchants = transactions.map(t => t.merchant);
    
    expectedMerchants.forEach(merchant => {
      expect(transactionMerchants.some(m => m.includes(merchant))).toBeTruthy();
    });
    
    const totalAmount = await analyticsPage.getTransactionTotal();
    expect(totalAmount).toBe('$890.00');
    
    logger.info('Category drill-down validated successfully');
  });

  test('QE-8896 TS-001 TC-001: Verify monthly spend trend chart displays accurate spending for past 6 months', async ({ page }) => {
    logger.info('Test Case: QE-8896 TS-001 TC-001 - Monthly Trend Test');
    
    const user = testData.users.testuser_6months;
    await analyticsPage.loginAndNavigate(user.username, user.password);
    
    await analyticsPage.navigateToTrendAnalysis();
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    const months = await analyticsPage.getMonthLabels();
    expect(months.length).toBe(6);
    
    const expectedMonths = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];
    expect(months).toEqual(expectedMonths);
    
    const monthlyAmounts = await analyticsPage.getMonthlySpendingAmounts();
    expect(monthlyAmounts['Jan 2024']).toBe('$2,500.00');
    expect(monthlyAmounts['Feb 2024']).toBe('$2,800.00');
    expect(monthlyAmounts['Mar 2024']).toBe('$3,100.00');
    expect(monthlyAmounts['Apr 2024']).toBe('$2,900.00');
    expect(monthlyAmounts['May 2024']).toBe('$3,200.00');
    expect(monthlyAmounts['Jun 2024']).toBe('$2,700.00');
    
    const hasTooltips = await analyticsPage.verifyChartTooltips();
    expect(hasTooltips).toBeTruthy();
  });

  test('QE-8896 TS-002 TC-001: Verify drill-down from monthly trend chart displays detailed transaction breakdown', async ({ page }) => {
    logger.info('Test Case: QE-8896 TS-002 TC-001 - Monthly Drill-down Test');
    
    await analyticsPage.navigateToTrendAnalysis();
    
    await analyticsPage.clickMonth('March 2024');
    
    await expect(analyticsPage.monthlyTransactionView).toBeVisible();
    
    const transactions = await analyticsPage.getMonthlyTransactions();
    expect(transactions.length).toBeGreaterThanOrEqual(15);
    
    transactions.forEach(txn => {
      expect(txn.date).toContain('Mar 2024');
      expect(txn.merchant).toBeTruthy();
      expect(txn.amount).toMatch(/^\$[\d,]+\.\d{2}$/);
    });
    
    const totalAmount = await analyticsPage.getMonthlyTransactionTotal();
    expect(totalAmount).toBe('$3,100.00');
    
    logger.info('Monthly drill-down validated successfully');
  });

  test('QE-8896 TS-003 TC-001: Verify user with insufficient transaction history receives appropriate message', async ({ page }) => {
    logger.info('Test Case: QE-8896 TS-003 TC-001 - Insufficient History Test');
    
    const user = testData.users.testuser_3months;
    await analyticsPage.loginAndNavigate(user.username, user.password);
    
    await analyticsPage.navigateToTrendAnalysis();
    
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    
    const messageText = await analyticsPage.getInsufficientDataMessage();
    expect(messageText).toContain('Insufficient data for 6-month trend');
    expect(messageText).toContain('Displaying available 3 months');
    
    const months = await analyticsPage.getMonthLabels();
    expect(months.length).toBe(3);
    
    const monthlyAmounts = await analyticsPage.getMonthlySpendingAmounts();
    expect(monthlyAmounts['Apr 2024']).toBe('$2,900.00');
    expect(monthlyAmounts['May 2024']).toBe('$3,200.00');
    expect(monthlyAmounts['Jun 2024']).toBe('$2,700.00');
    
    logger.info('Insufficient history scenario validated');
  });
});
