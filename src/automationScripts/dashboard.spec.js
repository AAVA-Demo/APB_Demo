const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Credit Card Dashboard - KPI Display and Real-Time Refresh', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_3cards', 'Test@123');
  });

  test('QE-8927 TS-001 TC-001 - Verify consolidated dashboard displays all 4 KPI metrics for multiple cards on desktop within 2 seconds', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('$');
    const gridLayout = await dashboardPage.verifyDesktopGridLayout();
    expect(gridLayout).toBe(true);
  });

  test('QE-8927 TS-002 TC-001 - Verify consolidated dashboard renders in single-column responsive layout on mobile within 2 seconds', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    const isSingleColumn = await dashboardPage.verifySingleColumnLayout();
    expect(isSingleColumn).toBe(true);
    const fontSize = await dashboardPage.verifyMobileFontSize();
    expect(fontSize.titleSize).toBeGreaterThanOrEqual(14);
    expect(fontSize.valueSize).toBeGreaterThanOrEqual(24);
    const spacing = await dashboardPage.verifyWidgetSpacing();
    expect(spacing).toBeGreaterThanOrEqual(16);
  });

  test('QE-8927 TS-003 TC-001 - Verify user-friendly error message when card summary API fails', async ({ page }) => {
    await page.route('**/api/cards/summary', route => route.abort('failed'));
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_error', 'Test@123');
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('temporarily unavailable');
    expect(errorMessage).not.toContain('500');
    expect(errorMessage).not.toContain('Internal Server Error');
    const isNavigationAccessible = await dashboardPage.isNavigationAccessible();
    expect(isNavigationAccessible).toBe(true);
  });

  test('QE-8927 TS-003 TC-002 - Verify user-friendly error message when monthly spend API returns 404', async ({ page }) => {
    await page.route('**/api/transactions/monthly-spend', route => {
      route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not Found' }) });
    });
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_404', 'Test@123');
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load');
    expect(errorMessage).not.toContain('404');
    const isAppStable = await dashboardPage.isApplicationStable();
    expect(isAppStable).toBe(true);
  });

  test('QE-8925 TS-001 TC-001 - Verify dashboard KPI metrics automatically refresh within 30 seconds after new transaction', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    await page.route('**/api/cards/summary', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          totalCreditLimit: 50000,
          availableCredit: 34500,
          outstandingAmount: 15500
        })
      });
    });
    await page.route('**/api/transactions/monthly-spend', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ amount: 9000 })
      });
    });
    await page.waitForTimeout(30000);
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(updatedMonthlySpend).not.toBe(initialMonthlySpend);
    expect(updatedAvailableCredit).not.toBe(initialAvailableCredit);
    expect(updatedOutstanding).not.toBe(initialOutstanding);
  });

  test('QE-8925 TS-002 TC-001 - Verify dashboard displays stale data indicator when real-time refresh encounters network failure', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    await page.route('**/api/cards/summary', route => route.abort('failed'));
    await page.route('**/api/transactions/monthly-spend', route => route.abort('failed'));
    await page.waitForTimeout(30000);
    const staleIndicator = await dashboardPage.getStaleDataIndicator();
    expect(staleIndicator).toBeVisible();
    const currentTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(currentTimestamp).toBe(initialTimestamp);
  });

  test('QE-8925 TS-003 TC-001 - Verify dashboard maintains previous valid state when real-time polling receives malformed data', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    const validMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const validTotalLimit = await dashboardPage.getTotalCreditLimitValue();
    await page.route('**/api/cards/summary', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          monthlySpend: null,
          totalCreditLimit: 'invalid'
        })
      });
    });
    await page.waitForTimeout(30000);
    const currentMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const currentTotalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(currentMonthlySpend).toBe(validMonthlySpend);
    expect(currentTotalLimit).toBe(validTotalLimit);
    expect(currentMonthlySpend).not.toContain('null');
    expect(currentMonthlySpend).not.toContain('undefined');
    expect(currentMonthlySpend).not.toContain('NaN');
  });
});