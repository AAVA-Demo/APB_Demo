const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard KPIs and Credit Card Overview', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'ValidPass123');
  });

  test('TC-PerfTest6-001: Verify dashboard displays all KPIs for user with multiple credit cards', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.verifyKPIVisible('Monthly Spend');
    await dashboardPage.verifyKPIVisible('Total Credit Limit');
    await dashboardPage.verifyKPIVisible('Available Credit');
    await dashboardPage.verifyKPIVisible('Outstanding Amount');
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(parseFloat(monthlySpend.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalCreditLimit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(availableCredit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(outstandingAmount.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
  });

  test('TC-PerfTest6-002: Verify dashboard error handling when Credit Card Data Service is unavailable', async ({ page }) => {
    await page.route('**/api/cards', route => route.abort());
    await page.route('**/api/cards/balances', route => route.abort());
    await page.reload();
    await dashboardPage.waitForErrorMessage();
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load dashboard data');
    const isLoggedIn = await loginPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('TC-PerfTest6-003: Verify dashboard displays empty state for user with zero credit cards', async ({ page }) => {
    await page.route('**/api/cards', route => route.fulfill({ status: 200, body: JSON.stringify([]) }));
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBe(0);
    const monthlySpend = await dashboardPage.getKPIValue('Monthly Spend');
    const totalCreditLimit = await dashboardPage.getKPIValue('Total Credit Limit');
    const availableCredit = await dashboardPage.getKPIValue('Available Credit');
    const outstandingAmount = await dashboardPage.getKPIValue('Outstanding Amount');
    expect(monthlySpend).toContain('$0');
    expect(totalCreditLimit).toContain('$0');
    expect(availableCredit).toContain('$0');
    expect(outstandingAmount).toContain('$0');
  });

  test('TC-PerfTest6-004: Verify dashboard responsive layout on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await dashboardPage.waitForDashboardLoad();
    const isResponsive = await dashboardPage.verifyResponsiveLayout('mobile');
    expect(isResponsive).toBeTruthy();
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('TC-PerfTest6-005: Verify dashboard multi-column layout on desktop browser', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.waitForDashboardLoad();
    const isResponsive = await dashboardPage.verifyResponsiveLayout('desktop');
    expect(isResponsive).toBeTruthy();
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('TC-PerfTest6-006: Verify dashboard graceful degradation on extremely small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 653 });
    await dashboardPage.waitForDashboardLoad();
    const isResponsive = await dashboardPage.verifyResponsiveLayout('small');
    expect(isResponsive).toBeTruthy();
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
  });
});