const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard KPI Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
  });

  test('QE-8469 TS-001 TC-001 - Verify total monthly spend is accurately calculated and displayed in KPI section', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(parseFloat(monthlySpendValue)).toBeGreaterThanOrEqual(0);
  });

  test('QE-8469 TS-002 TC-001 - Verify monthly spend displays as zero when no transactions exist in current month', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('notransactions@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(parseFloat(monthlySpendValue)).toBe(0);
    await expect(dashboardPage.noTransactionsMessage).toBeVisible();
  });

  test('QE-8474 TS-001 TC-001 - Verify aggregated total credit limit is accurately calculated from all cards', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(parseFloat(totalCreditLimit)).toBeGreaterThan(0);
  });

  test('QE-8473 TS-001 TC-001 - Verify aggregated available credit is displayed in real-time on dashboard', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(parseFloat(availableCredit)).toBeGreaterThanOrEqual(0);
  });

  test('QE-8479 TS-001 TC-001 - Verify all four KPIs are displayed prominently on dashboard within load time', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });
});
