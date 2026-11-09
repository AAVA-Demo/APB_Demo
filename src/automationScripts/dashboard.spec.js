const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard and KPI Management Tests', () => {

  test('QE-8879 TS-001 TC-001 - Verify aggregated monthly spend across multiple cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);

    await dashboardPage.waitForKPISection();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(monthlySpend).toBe('$2,670.00');

    const monthLabel = await dashboardPage.getMonthlySpendLabel();
    await expect(monthLabel).toContain('December 2024');
  });

  test('QE-8879 TS-002 TC-001 - Verify monthly spend for single credit card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('singlecarduser', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);

    await dashboardPage.waitForKPISection();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(monthlySpend).toBe('$1,850.00');

    const monthLabel = await dashboardPage.getMonthlySpendLabel();
    await expect(monthLabel).toContain('December 2024');
  });

  test('QE-8879 TS-003 TC-001 - Verify monthly spend display when no cards registered', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('nocarduser', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);

    await dashboardPage.waitForKPISection();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const isZeroOrMessage = monthlySpend === '$0.00' || monthlySpend.includes('No spending data available');
    await expect(isZeroOrMessage).toBeTruthy();
  });

  test('QE-8877 TS-001 TC-001 - Verify available credit calculation for multiple cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);

    await dashboardPage.waitForKPISection();
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe('$28,800');

    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe('$45,000');
  });

  test('QE-8877 TS-002 TC-001 - Verify available credit when cards at maximum limit', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('maxeduser', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);

    await dashboardPage.waitForKPISection();
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe('$0.00');
  });

  test('QE-8877 TS-003 TC-001 - Verify available credit with overlimit card and warning message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('overlimituser', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);

    await dashboardPage.waitForKPISection();
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe('$0');

    const warningMessage = await dashboardPage.getOverlimitWarning();
    await expect(warningMessage).toContain('One or more cards are over limit');
  });

});
