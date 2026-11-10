const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Category-wise Spending Analytics Tests - QE-10612', () => {

  test('QE-10612 TS-001 TC-001: Verify category-wise spending displays all predefined categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with multi-category user
    await loginPage.navigate();
    await loginPage.login('user_multicategory', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Verify category chart is visible
    await expect(analyticsPage.categorySpendingChart).toBeVisible();

    // Step 4: Verify all 9 categories are represented
    const categories = await analyticsPage.getCategorySpendingCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories.length).toBe(9);
    for (const category of expectedCategories) {
      expect(categories).toContain(category);
    }

    // Step 5: Verify each category displays spending amount
    for (const category of categories) {
      const amount = await analyticsPage.getCategorySpendingAmount(category);
      expect(amount).toBeTruthy();
    }

    // Step 6: Verify chart is interactive
    const isInteractive = await analyticsPage.verifyCategoryChartInteractivity();
    expect(isInteractive).toBe(true);
  });

  test('QE-10612 TS-001 TC-002: Verify category chart excludes categories with zero spending', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with partial category user
    await loginPage.navigate();
    await loginPage.login('user_partial_categories', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Verify only categories with spending are displayed
    const categories = await analyticsPage.getCategorySpendingCategories();
    expect(categories.length).toBe(3);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
  });

  test('QE-10612 TS-002 TC-001: Verify message when user has no transactions in any category', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    // Step 1: Login with no-transaction user
    await loginPage.navigate();
    await loginPage.login('new_user_no_txn', 'Pass@123');

    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();

    // Step 3: Attempt to view category spending
    await expect(analyticsPage.noSpendingDataMessage).toBeVisible();

    // Step 4: Verify message indicates no spending data
    const messageText = await analyticsPage.getNoSpendingDataMessageText();
    expect(messageText).toContain('No spending data available');

    // Step 5: Verify no chart is displayed
    await expect(analyticsPage.categorySpendingChart).not.toBeVisible();
  });

  test('QE-10612 TS-003 TC-001: Verify sum of category totals equals total spending', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);
    const dashboardPage = require('./pages/dashboard.page').DashboardPage;
    const dashboard = new dashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('user_multicategory', 'Pass@123');

    // Step 2: Note total spending from Dashboard
    await dashboard.waitForDashboardToLoad();
    const totalSpendingFromDashboard = await dashboard.getTotalSpending();

    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categorySpendingChart).toBeVisible();

    // Step 4: Extract category spending amounts
    const categoryAmounts = await analyticsPage.getAllCategorySpendingAmounts();

    // Step 5: Manually sum category totals
    const calculatedSum = categoryAmounts.reduce((sum, amount) => sum + parseFloat(amount.replace(/[^0-9.-]+/g, '')), 0);
    const dashboardTotal = parseFloat(totalSpendingFromDashboard.replace(/[^0-9.-]+/g, ''));
    expect(Math.abs(calculatedSum - dashboardTotal)).toBeLessThan(1);

    // Step 6: Verify analytics page displays matching total
    const analyticsTotal = await analyticsPage.getTotalSpendingOnAnalyticsPage();
    const analyticsValue = parseFloat(analyticsTotal.replace(/[^0-9.-]+/g, ''));
    expect(Math.abs(analyticsValue - dashboardTotal)).toBeLessThan(1);
  });

});