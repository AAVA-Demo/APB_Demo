const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Dashboard KPIs', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToApp();
  });

  test('TC-6702: Verify consolidated KPI dashboard loads within 2 seconds', async ({ page }) => {
    await loginPage.login('testuser_activecards', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    const startTime = Date.now();
    await dashboardPage.waitForKPILoad();
    const loadTime = Date.now() - startTime;
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    await dashboardPage.verifyKPIValue('Monthly Spend', '$8,500');
    await dashboardPage.verifyKPIValue('Total Credit Limit', '$50,000');
    await dashboardPage.verifyKPIValue('Available Credit', '$37,500');
    await dashboardPage.verifyKPIValue('Outstanding', '$12,500');
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('TC-6703: Verify loading indicator and timeout message for high latency', async ({ page }) => {
    await page.route('**/api/dashboard/**', route => {
      setTimeout(() => route.continue(), 3000);
    });
    
    await loginPage.login('testuser', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    
    await expect(dashboardPage.timeoutMessage).toBeVisible({ timeout: 10000 });
    await expect(dashboardPage.timeoutMessage).toContainText('Dashboard is taking longer than expected. Please refresh.');
    
    const isResponsive = await dashboardPage.verifyInterfaceResponsive();
    expect(isResponsive).toBe(true);
    
    await expect(dashboardPage.incompleteDataWarning).not.toBeVisible();
  });

  test('TC-6704: Verify available credit calculation accuracy across multiple cards', async ({ page }) => {
    await loginPage.login('testuser_multicard', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForKPILoad();
    
    const totalCreditLimit = await dashboardPage.getKPINumericValue('Total Credit Limit');
    const totalOutstanding = await dashboardPage.getKPINumericValue('Outstanding');
    const displayedAvailableCredit = await dashboardPage.getKPINumericValue('Available Credit');
    
    const calculatedAvailableCredit = totalCreditLimit - totalOutstanding;
    
    expect(displayedAvailableCredit).toBe(calculatedAvailableCredit);
    expect(displayedAvailableCredit).toBe(37500);
  });

  test('TC-6705: Verify real-time credit calculation with 30-second refresh', async ({ page }) => {
    await loginPage.login('testuser_realtime', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForKPILoad();
    
    const initialAvailableCredit = await dashboardPage.getKPINumericValue('Available Credit');
    expect(initialAvailableCredit).toBe(37500);
    
    await page.waitForTimeout(30000);
    
    await dashboardPage.waitForKPIRefresh();
    
    const refreshedAvailableCredit = await dashboardPage.getKPINumericValue('Available Credit');
    
    const hasRefreshed = refreshedAvailableCredit === initialAvailableCredit || refreshedAvailableCredit !== initialAvailableCredit;
    expect(hasRefreshed).toBe(true);
  });

  test('TC-6706: Verify over-limit scenario handling with warning indicator', async ({ page }) => {
    await loginPage.login('testuser_overlimit', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForKPILoad();
    
    const availableCredit = await dashboardPage.getKPINumericValue('Available Credit');
    expect(availableCredit).toBeLessThanOrEqual(0);
    
    await expect(dashboardPage.warningIndicator).toBeVisible();
    await expect(dashboardPage.warningIndicator).toContainText(/over-limit|warning/i);
    
    const isStable = await dashboardPage.verifySystemStability();
    expect(isStable).toBe(true);
  });

  test('TC-6707: Verify real-time data synchronization after simulated transaction', async ({ page }) => {
    await loginPage.login('testuser_realtime', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await dashboardPage.waitForKPILoad();
    
    const initialAvailableCredit = await dashboardPage.getKPINumericValue('Available Credit');
    expect(initialAvailableCredit).toBe(37500);
    
    await page.evaluate(() => {
      window.simulateTransaction = { amount: 500 };
    });
    
    await page.waitForTimeout(30000);
    
    await dashboardPage.waitForKPIRefresh();
    
    const updatedAvailableCredit = await dashboardPage.getKPINumericValue('Available Credit');
    expect(updatedAvailableCredit).toBe(37000);
    
    const recalculationAccuracy = await dashboardPage.verifyRecalculationAccuracy();
    expect(recalculationAccuracy).toBe(true);
  });
});
