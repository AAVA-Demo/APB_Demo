const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Monitoring - QE-8920', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-8920 TS-001 TC-001: Verify consolidated KPI dashboard view loads within 2 seconds with all KPIs displayed', async ({ page }) => {
    await loginPage.login('user_with_2_cards', 'password');
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$4,500');
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$23,000');
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$18,500');
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$4,500');
  });

  test('QE-8920 TS-002 TC-001: Verify appropriate message is displayed when user has no active credit cards', async ({ page }) => {
    await loginPage.login('user_with_no_cards', 'password');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.noCardMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardMessageText();
    expect(messageText).toContain('No credit card data available');
    await expect(dashboardPage.monthlySpendKPI).not.toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).not.toBeVisible();
  });

  test('QE-8920 TS-003 TC-001: Verify user-friendly error message when backend service is unavailable or times out', async ({ page }) => {
    await page.route('**/api/creditcards', route => route.abort());
    await loginPage.login('valid_user', 'password');
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Dashboard data could not be loaded');
    await expect(dashboardPage.retryButton).toBeVisible();
    await dashboardPage.clickRetryButton();
  });
});
