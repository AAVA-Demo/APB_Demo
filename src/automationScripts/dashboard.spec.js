const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Tests - QE-10336', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-10336 TS-001 TC-001: Verify financial KPI dashboard displays all four KPIs clearly within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await loginPage.login('testuser_active', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    expect(loadTime).toBeLessThan(2000);
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCredit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toMatch(/₹[\d,]+\.\d{2}/);
    expect(totalCredit).toMatch(/₹[\d,]+\.\d{2}/);
    expect(availableCredit).toMatch(/₹[\d,]+\.\d{2}/);
    expect(outstanding).toMatch(/₹[\d,]+\.\d{2}/);
  });

  test('QE-10336 TS-002 TC-001: Verify KPI dashboard displays zero monthly spend for newly activated accounts', async ({ page }) => {
    await loginPage.login('testuser_newaccount', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCredit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toContain('₹0.00');
    expect(outstanding).toContain('₹0.00');
    expect(totalCredit).toMatch(/₹[\d,]+\.\d{2}/);
    expect(availableCredit).toBe(totalCredit);
  });

  test('QE-10336 TS-003 TC-001: Verify dashboard graceful degradation when credit card service unavailable', async ({ page }) => {
    await page.route('**/api/creditcards', route => route.abort());
    
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('temporarily unavailable');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-10336 TS-003 TC-002: Verify dashboard graceful degradation when transaction service unavailable', async ({ page }) => {
    await page.route('**/api/transactions/monthly', route => route.abort());
    
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Monthly spending data is temporarily unavailable');
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-10336 TS-003 TC-003: Verify dashboard graceful degradation when balance service unavailable', async ({ page }) => {
    await page.route('**/api/balances', route => route.abort());
    
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Balance information is temporarily unavailable');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  });
});