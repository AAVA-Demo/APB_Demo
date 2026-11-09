const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Analytics and Spending Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('TC-4590: Verify monthly spend trends graph displays correctly for 12+ months', async ({ page }) => {
    await loginPage.login(testData.users.userWith12Months.username, testData.users.userWith12Months.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForTrendsGraphLoad();
    const dataPointsCount = await analyticsPage.getTrendsDataPointsCount();
    expect(dataPointsCount).toBe(12);
    
    const isInteractive = await analyticsPage.isTrendsGraphInteractive();
    expect(isInteractive).toBe(true);
    
    const labels = await analyticsPage.getTrendsGraphLabels();
    expect(labels.length).toBe(12);
  });

  test('TC-4591: Verify system handles user with less than 12 months gracefully', async ({ page }) => {
    await loginPage.login(testData.users.newUser3Months.username, testData.users.newUser3Months.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForTrendsSection();
    const dataPointsCount = await analyticsPage.getTrendsDataPointsCount();
    expect(dataPointsCount).toBe(3);
    
    const message = await analyticsPage.getInsufficientDataMessage();
    expect(message).toContain('Insufficient historical data');
    
    await expect(page.locator('text=null')).toHaveCount(0);
    await expect(page.locator('text=undefined')).toHaveCount(0);
  });

  test('TC-4592: Verify validation error for insufficient transaction history', async ({ page }) => {
    await loginPage.login(testData.users.newUser1Month.username, testData.users.newUser1Month.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForTrendsSection();
    const errorMessage = await analyticsPage.getValidationErrorMessage();
    expect(errorMessage).toContain('Minimum 12 months');
    
    const graphVisible = await analyticsPage.isTrendsGraphVisible();
    expect(graphVisible).toBe(false);
  });

  test('TC-4593: Verify user can interact with trends graph by hovering', async ({ page }) => {
    await loginPage.login(testData.users.userWith12Months.username, testData.users.userWith12Months.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForTrendsGraphLoad();
    await analyticsPage.hoverOverDataPoint(2);
    
    const tooltipVisible = await analyticsPage.isTooltipVisible();
    expect(tooltipVisible).toBe(true);
    
    const tooltipContent = await analyticsPage.getTooltipContent();
    expect(tooltipContent).toContain('Total Spend');
    expect(tooltipContent).toContain('Total Transactions');
  });

  test('TC-4594: Verify user can interact with trends graph by clicking', async ({ page }) => {
    await loginPage.login(testData.users.userWith12Months.username, testData.users.userWith12Months.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForTrendsGraphLoad();
    await analyticsPage.clickDataPoint(5);
    
    const breakdownVisible = await analyticsPage.isBreakdownPanelVisible();
    expect(breakdownVisible).toBe(true);
    
    const breakdownContent = await analyticsPage.getBreakdownContent();
    expect(breakdownContent).toContain('Food & Dining');
    expect(breakdownContent).toContain('Total Transactions');
  });

  test('TC-4605: Verify category-wise spending chart displays all 9 categories', async ({ page }) => {
    await loginPage.login(testData.users.userWithAllCategories.username, testData.users.userWithAllCategories.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForCategoryChartLoad();
    const categories = await analyticsPage.getCategoryChartCategories();
    expect(categories.length).toBe(9);
    
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }
    
    const isInteractive = await analyticsPage.isCategoryChartInteractive();
    expect(isInteractive).toBe(true);
  });

  test('TC-4606: Verify transactions with null categories are categorized as Miscellaneous', async ({ page }) => {
    await loginPage.login(testData.users.userWithNullCategories.username, testData.users.userWithNullCategories.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForCategoryChartLoad();
    const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscAmount).toBeGreaterThan(0);
    
    const errorVisible = await analyticsPage.isValidationErrorVisible();
    expect(errorVisible).toBe(false);
  });

  test('TC-4607: Verify validation error for missing category values', async ({ page }) => {
    await loginPage.login(testData.users.userWithNullCategories.username, testData.users.userWithNullCategories.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForCategoryChartLoad();
    const errorMessage = await analyticsPage.getValidationErrorMessage();
    
    if (errorMessage) {
      expect(errorMessage).toContain('missing category information');
    }
    
    const chartVisible = await analyticsPage.isCategoryChartVisible();
    expect(chartVisible).toBe(true);
  });

  test('TC-4608: Verify user can select category and view filtered transactions', async ({ page }) => {
    await loginPage.login(testData.users.userWithAllCategories.username, testData.users.userWithAllCategories.password);
    await analyticsPage.navigateToAnalytics();
    
    await analyticsPage.waitForCategoryChartLoad();
    await analyticsPage.selectCategory('Food & Dining');
    
    const transactionsVisible = await analyticsPage.isFilteredTransactionsVisible();
    expect(transactionsVisible).toBe(true);
    
    const transactions = await analyticsPage.getFilteredTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions) {
      expect(txn.date).toBeTruthy();
      expect(txn.merchant).toBeTruthy();
      expect(txn.amount).toBeGreaterThan(0);
    }
    
    const totalAmount = await analyticsPage.getFilteredTransactionsTotal();
    const categoryTotal = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(Math.abs(totalAmount - categoryTotal)).toBeLessThan(0.01);
  });
});
