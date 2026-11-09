const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Dashboard - KPI Validation', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC-001: Verify Monthly Spend KPI is displayed correctly', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();
    expect(await dashboardPage.isMonthlySpendLabelVisible()).toBe(true);
    console.log(`Monthly Spend displayed: ${monthlySpend}`);
  });

  test('TC-002: Verify Total Credit Limit KPI is displayed correctly', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBeTruthy();
    expect(await dashboardPage.isTotalCreditLimitLabelVisible()).toBe(true);
    console.log(`Total Credit Limit displayed: ${totalCreditLimit}`);
  });

  test('TC-003: Verify Available Credit KPI is displayed correctly', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeTruthy();
    expect(await dashboardPage.isAvailableCreditLabelVisible()).toBe(true);
    console.log(`Available Credit displayed: ${availableCredit}`);
  });

  test('TC-004: Verify Outstanding Amount KPI is displayed correctly', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBeTruthy();
    expect(await dashboardPage.isOutstandingAmountLabelVisible()).toBe(true);
    console.log(`Outstanding Amount displayed: ${outstandingAmount}`);
  });

  test('TC-005: Verify all four KPI metrics are displayed prominently', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    expect(await dashboardPage.isMonthlySpendVisible()).toBe(true);
    expect(await dashboardPage.isTotalCreditLimitVisible()).toBe(true);
    expect(await dashboardPage.isAvailableCreditVisible()).toBe(true);
    expect(await dashboardPage.isOutstandingAmountVisible()).toBe(true);
  });

  test('TC-006: Verify dashboard loads within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    console.log(`Dashboard load time: ${loadTime}ms`);
  });

  test('TC-007: Verify KPI refresh functionality', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    await dashboardPage.clickRefreshButton();
    await dashboardPage.waitForDashboardLoad();
    const refreshedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(refreshedMonthlySpend).toBeTruthy();
  });
});

test.describe('Credit Card Dashboard - Responsive Design', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC-008: Verify responsive layout on mobile device (375px width)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await dashboardPage.waitForDashboardLoad();
    expect(await dashboardPage.areKPICardsStackedVertically()).toBe(true);
  });

  test('TC-009: Verify responsive layout on tablet device (768px width)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await dashboardPage.waitForDashboardLoad();
    expect(await dashboardPage.isResponsiveLayoutApplied()).toBe(true);
  });

  test('TC-010: Verify responsive layout on desktop (1920px width)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginPage.navigate();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await dashboardPage.waitForDashboardLoad();
    expect(await dashboardPage.isDesktopLayoutApplied()).toBe(true);
  });
});
