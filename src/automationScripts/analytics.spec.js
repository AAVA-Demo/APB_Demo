const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

// Test Suite: Spending Analytics and Insights
test.describe('Spending Analytics and Insights', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.activeUser.username, testData.users.activeUser.password);
  });

  // Test Case: QE-9050 TS-001 TC-001
  test('TC-001: Verify user views spending distribution visualization across all categories', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();

    await expect(analyticsPage.spendingChart).toBeVisible();
    
    const categories = await analyticsPage.getDisplayedCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    expect(categories.length).toBe(9);
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }

    const categoryData = await analyticsPage.getCategoryBreakdown();
    for (const data of categoryData) {
      expect(data).toHaveProperty('percentage');
      expect(data).toHaveProperty('amount');
    }
  });

  // Test Case: QE-9050 TS-002 TC-001
  test('TC-002: Verify user can drill down to detailed transaction list by clicking on a category', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();

    await analyticsPage.clickCategory('Food & Dining');
    await analyticsPage.waitForTransactionListLoad();

    await expect(analyticsPage.transactionList).toBeVisible();
    await expect(analyticsPage.transactionListHeader).toContainText('Food & Dining');
    
    const transactions = await analyticsPage.getTransactionDetails();
    for (const transaction of transactions) {
      expect(transaction).toHaveProperty('date');
      expect(transaction).toHaveProperty('merchant');
      expect(transaction).toHaveProperty('amount');
    }

    await expect(analyticsPage.backToSummaryButton).toBeVisible();
  });

  // Test Case: QE-9050 TS-003 TC-001
  test('TC-003: Verify user with limited category transactions views only categories with spending data', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(testData.users.limitedUser.username, testData.users.limitedUser.password);
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();

    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories.length).toBeLessThanOrEqual(2);

    const emptyCategories = await analyticsPage.getEmptyCategoryMessages();
    if (emptyCategories.length > 0) {
      for (const message of emptyCategories) {
        expect(message).toContain('No spending in this category');
      }
    }
  });

  // Test Case: QE-9052 TS-001 TC-001
  test('TC-004: Verify user with 12+ months of transaction history views interactive monthly spend trends chart', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(testData.users.longtermUser.username, testData.users.longtermUser.password);
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();

    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    const monthsDisplayed = await analyticsPage.getMonthsDisplayed();
    expect(monthsDisplayed).toBeGreaterThanOrEqual(12);

    await expect(analyticsPage.dateRangeFilter).toBeVisible();
    await expect(analyticsPage.categoryFilter).toBeVisible();
  });

  // Test Case: QE-9052 TS-002 TC-001
  test('TC-005: Verify monthly spend trends chart dynamically updates when user applies date range filter', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(testData.users.longtermUser.username, testData.users.longtermUser.password);
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();

    const initialMonths = await analyticsPage.getMonthsDisplayed();
    
    await analyticsPage.applyDateRangeFilter('Last 6 months');
    await analyticsPage.waitForChartUpdate();

    const filteredMonths = await analyticsPage.getMonthsDisplayed();
    expect(filteredMonths).toBe(6);
    expect(filteredMonths).toBeLessThan(initialMonths);

    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
  });

  // Test Case: QE-9052 TS-003 TC-001
  test('TC-006: Verify user with less than 12 months of transaction history receives insufficient data notification', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(testData.users.newUser.username, testData.users.newUser.password);
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();

    await expect(analyticsPage.insufficientDataNotification).toBeVisible();
    await expect(analyticsPage.insufficientDataNotification).toContainText('Insufficient historical data');
    await expect(analyticsPage.insufficientDataNotification).toContainText('at least 12 months');

    const availableMonths = await analyticsPage.getAvailableMonthsCount();
    expect(availableMonths).toBeLessThan(12);
  });
});
