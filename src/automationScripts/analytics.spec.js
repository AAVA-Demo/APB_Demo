const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Spending Analytics and Insights - QE-8921, QE-8922, QE-8923', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-8921 TS-001 TC-001: Verify real-time credit availability update after a transaction within the refresh cycle', async ({ page }) => {
    await loginPage.login('user_with_credit_card', 'password');
    await analyticsPage.navigateToDashboard();
    const initialCredit = await analyticsPage.getAvailableCreditValue();
    expect(initialCredit).toBe('$7,500');
    await page.evaluate(() => {
      fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({ amount: 500 })
      });
    });
    await page.waitForTimeout(30000);
    const updatedCredit = await analyticsPage.getAvailableCreditValue();
    expect(updatedCredit).toBe('$7,000');
  });

  test('QE-8921 TS-002 TC-001: Verify stale available credit is displayed when pending transaction is not yet processed', async ({ page }) => {
    await loginPage.login('user_with_credit_card', 'password');
    await analyticsPage.navigateToDashboard();
    const initialCredit = await analyticsPage.getAvailableCreditValue();
    expect(initialCredit).toBe('$7,500');
    await page.evaluate(() => {
      fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({ amount: 500, pending: true })
      });
    });
    await page.waitForTimeout(1000);
    const currentCredit = await analyticsPage.getAvailableCreditValue();
    expect(currentCredit).toBe('$7,500');
    await expect(analyticsPage.pendingTransactionIndicator).not.toBeVisible();
  });

  test('QE-8921 TS-003 TC-001: Verify warning or alert when credit card has exceeded its credit limit', async ({ page }) => {
    await loginPage.login('user_with_overlimit_card', 'password');
    await analyticsPage.navigateToDashboard();
    const availableCredit = await analyticsPage.getAvailableCreditValue();
    expect(availableCredit).toMatch(/-\$500|Over Limit/);
    await expect(analyticsPage.warningAlert).toBeVisible();
    const warningText = await analyticsPage.getWarningAlertText();
    expect(warningText).toContain('Credit limit exceeded');
    expect(warningText).toContain('$10,500');
    const outstandingAmount = await analyticsPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$10,500');
  });

  test('QE-8922 TS-001 TC-001: Verify category-wise spending visualization displays all nine categories with spending data', async ({ page }) => {
    await loginPage.login('user_with_multi_category_transactions', 'password');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForVisualizationLoad();
    const categories = await analyticsPage.getAllCategoryNames();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    const foodDiningAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(parseFloat(foodDiningAmount.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
  });

  test('QE-8922 TS-002 TC-001: Verify visualization correctly displays only categories with spending data when user has limited category transactions', async ({ page }) => {
    await loginPage.login('user_with_limited_categories', 'password');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForVisualizationLoad();
    const visibleCategories = await analyticsPage.getVisibleCategoryNames();
    expect(visibleCategories).toContain('Food & Dining');
    expect(visibleCategories).toContain('Fuel');
    expect(visibleCategories.length).toBe(2);
    const foodDiningAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    expect(parseFloat(foodDiningAmount.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    const shoppingExists = await analyticsPage.isCategoryVisible('Shopping');
    if (shoppingExists) {
      const shoppingAmount = await analyticsPage.getCategoryAmount('Shopping');
      expect(shoppingAmount).toBe('$0');
    }
  });

  test('QE-8922 TS-003 TC-001: Verify error message when transaction categorization service fails', async ({ page }) => {
    await page.route('**/api/categorization', route => route.abort());
    await loginPage.login('valid_user', 'password');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.getErrorMessageText();
    expect(errorText).toContain('Category breakdown cannot be computed');
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(parseFloat(miscellaneousAmount.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    await expect(analyticsPage.retryButton).toBeVisible();
  });

  test('QE-8923 TS-001 TC-001: Verify monthly trend analysis with at least 3 months of transaction history displays interactive chart with drill-down', async ({ page }) => {
    await loginPage.login('user_with_3_months_history', 'password');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.clickMonthlyTrendAnalysisTab();
    await analyticsPage.waitForTrendChartLoad();
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBeGreaterThanOrEqual(3);
    expect(monthLabels).toContain('Jan 2024');
    expect(monthLabels).toContain('Feb 2024');
    expect(monthLabels).toContain('Mar 2024');
    await analyticsPage.clickMonthDataPoint('Feb 2024');
    await analyticsPage.waitForDrillDownViewLoad();
    await expect(analyticsPage.transactionList).toBeVisible();
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThan(0);
    const firstTransaction = await analyticsPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeDefined();
    expect(firstTransaction.merchant).toBeDefined();
    expect(firstTransaction.category).toBeDefined();
    expect(firstTransaction.amount).toBeDefined();
  });

  test('QE-8923 TS-002 TC-001: Verify user with less than 3 months of transaction history receives insufficient data message', async ({ page }) => {
    await loginPage.login('user_with_1_month_history', 'password');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.clickMonthlyTrendAnalysisTab();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient data to generate meaningful trends');
    expect(messageText).toContain('Minimum 3 months of transaction history required');
    const chartVisible = await analyticsPage.isTrendChartVisible();
    expect(chartVisible).toBe(false);
  });

  test('QE-8923 TS-003 TC-001: Verify error message when drill-down data is missing or unavailable for a specific month', async ({ page }) => {
    await loginPage.login('user_with_3_months_history', 'password');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.clickMonthlyTrendAnalysisTab();
    await analyticsPage.waitForTrendChartLoad();
    await page.route('**/api/transactions/monthly/2024-01', route => route.abort());
    await analyticsPage.clickMonthDataPoint('Jan 2024');
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.getErrorMessageText();
    expect(errorText).toContain('Drill-down data cannot be retrieved');
    expect(errorText).toContain('Detailed transaction records are unavailable for this month');
    await expect(analyticsPage.closeErrorButton).toBeVisible();
    await analyticsPage.clickCloseErrorButton();
    await expect(analyticsPage.trendChart).toBeVisible();
  });
});
