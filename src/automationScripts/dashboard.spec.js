const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Display and Credit Utilization Tests', () => {

  test('QE-10616 TS-001 TC-001: Verify consolidated KPI display with correct aggregated values across multiple active credit cards within 2 seconds', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_multicard', 'Pass@123');
    const startTime = Date.now();
    await dashboardPage.navigateToDashboard();
    await dashboardPage.waitForKPIsToLoad();
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    expect(loadTime).toBeLessThanOrEqual(2);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(monthlySpend).toBeGreaterThan(0);
    expect(totalCreditLimit).toBeGreaterThan(0);
    expect(availableCredit).toBeGreaterThan(0);
    expect(outstandingAmount).toBeGreaterThan(0);
  });

  test('QE-10616 TS-002 TC-001: Verify dashboard displays appropriate message when user has no credit cards added to profile', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_nocards', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards found');
    expect(messageText).toContain('Please add a card to get started');
    await expect(dashboardPage.addCardGuidance).toBeVisible();
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendValue).toBe(0);
  });

  test('QE-10616 TS-003 TC-001: Verify dashboard displays error message when backend credit card data service is unavailable', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.route('**/api/cards/summary*', route => route.abort('failed'));
    await dashboardPage.navigate();
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Failed to load dashboard data');
    expect(errorText).toContain('temporarily unavailable');
    await expect(dashboardPage.retryGuidance).toBeVisible();
  });

  test('QE-10617 TS-001 TC-001: Verify real-time credit utilization recalculation when user refreshes dashboard with outstanding balances on multiple cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_multicard', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    await dashboardPage.waitForKPIsToLoad();
    const initialUtilization = await dashboardPage.getCreditUtilizationValue();
    expect(initialUtilization).toBeGreaterThan(0);
    await dashboardPage.clickRefreshButton();
    await dashboardPage.waitForKPIsToLoad();
    const updatedUtilization = await dashboardPage.getCreditUtilizationValue();
    expect(updatedUtilization).toBeGreaterThan(0);
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const expectedUtilization = (outstandingAmount / totalCreditLimit) * 100;
    expect(Math.abs(updatedUtilization - expectedUtilization)).toBeLessThan(0.1);
  });

  test('QE-10617 TS-002 TC-001: Verify credit utilization displays 0% with appropriate messaging when user has zero outstanding balance', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_zerobalance', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    await dashboardPage.clickRefreshButton();
    await dashboardPage.waitForKPIsToLoad();
    const utilization = await dashboardPage.getCreditUtilizationValue();
    expect(utilization).toBe(0);
    await expect(dashboardPage.zeroBalanceMessage).toBeVisible();
    const messageText = await dashboardPage.getZeroBalanceMessageText();
    expect(messageText).toContain('no outstanding balance');
  });

  test('QE-10617 TS-003 TC-001: Verify system displays last known credit utilization with warning when transaction service is unavailable', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    await dashboardPage.waitForKPIsToLoad();
    const initialUtilization = await dashboardPage.getCreditUtilizationValue();
    await page.route('**/api/transactions/monthly-summary*', route => route.abort('failed'));
    await dashboardPage.clickRefreshButton();
    await expect(dashboardPage.warningIndicator).toBeVisible();
    const warningText = await dashboardPage.getWarningText();
    expect(warningText).toContain('Unable to refresh data');
    expect(warningText).toContain('Displaying last known values');
    const currentUtilization = await dashboardPage.getCreditUtilizationValue();
    expect(currentUtilization).toBe(initialUtilization);
  });

});