const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard - KPI Display and Real-Time Updates', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-10379 TS001 TC-001: Verify dashboard displays aggregated KPI values for three active credit cards', async ({ page }) => {
    await dashboardPage.setUserWithThreeCards();
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toHaveText('$45,000');
    
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toHaveText('$28,200');
    
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toHaveText('$16,800');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toHaveText('$2,500');
    
    const allKPIsCorrect = await dashboardPage.verifyKPIAggregationForCards(['card-1', 'card-2', 'card-3']);
    expect(allKPIsCorrect).toBe(true);
  });

  test('QE-10379 TS002 TC-001: Verify dashboard displays accurate KPI metrics for single active credit card', async ({ page }) => {
    await dashboardPage.setUserWithSingleCard();
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.totalCreditLimitKPI).toHaveText('$10,000');
    await expect(dashboardPage.availableCreditKPI).toHaveText('$6,500');
    await expect(dashboardPage.outstandingAmountKPI).toHaveText('$3,500');
    
    const monthlySpendText = await dashboardPage.monthlySpendKPI.textContent();
    expect(monthlySpendText).toMatch(/\$\d+/);
    
    const kpisMatchCard = await dashboardPage.verifyKPIsMatchSingleCard('card-1');
    expect(kpisMatchCard).toBe(true);
  });

  test('QE-10379 TS003 TC-001: Verify dashboard displays zero KPI values when user has no active credit cards', async ({ page }) => {
    await dashboardPage.setUserWithNoCards();
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.totalCreditLimitKPI).toHaveText('$0.00');
    await expect(dashboardPage.availableCreditKPI).toHaveText('$0.00');
    await expect(dashboardPage.outstandingAmountKPI).toHaveText('$0.00');
    await expect(dashboardPage.monthlySpendKPI).toHaveText('$0.00');
    
    await expect(dashboardPage.informationalMessage).toBeVisible();
    await expect(dashboardPage.informationalMessage).toHaveText('Please add a credit card to begin tracking financial metrics');
  });

  test('QE-10378 TS001 TC-001: Verify KPI metrics update in real-time when new transaction is processed', async ({ page }) => {
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.outstandingAmountKPI).toHaveText('$3,500');
    await expect(dashboardPage.availableCreditKPI).toHaveText('$6,500');
    
    const startTime = Date.now();
    await dashboardPage.simulateNewTransaction(150, 'card-1');
    
    await dashboardPage.waitForKPIUpdate();
    const updateTime = Date.now() - startTime;
    
    await expect(dashboardPage.outstandingAmountKPI).toHaveText('$3,650');
    await expect(dashboardPage.availableCreditKPI).toHaveText('$6,350');
    
    expect(updateTime).toBeLessThan(2000);
  });

  test('QE-10378 TS002 TC-001: Verify auto-refresh mechanism triggers after 30 seconds and updates KPIs', async ({ page }) => {
    await dashboardPage.navigateToDashboard();
    
    const initialLoadTime = Date.now();
    
    await dashboardPage.waitForAutoRefresh(30000);
    
    const refreshTriggered = await dashboardPage.verifyAutoRefreshTriggered();
    expect(refreshTriggered).toBe(true);
    
    const kpisUpdated = await dashboardPage.verifyKPIsRefreshed();
    expect(kpisUpdated).toBe(true);
    
    const updateDuration = await dashboardPage.getLastUpdateDuration();
    expect(updateDuration).toBeLessThan(2000);
  });

  test('QE-10378 TS003 TC-001: Verify auto-refresh fails gracefully when backend service is unavailable', async ({ page }) => {
    await dashboardPage.navigateToDashboard();
    
    const initialOutstanding = await dashboardPage.outstandingAmountKPI.textContent();
    const initialAvailable = await dashboardPage.availableCreditKPI.textContent();
    const initialMonthly = await dashboardPage.monthlySpendKPI.textContent();
    
    await dashboardPage.simulateBackendServiceUnavailable();
    
    await dashboardPage.waitForAutoRefresh(30000);
    
    const refreshFailed = await dashboardPage.verifyAutoRefreshFailed();
    expect(refreshFailed).toBe(true);
    
    await expect(dashboardPage.outstandingAmountKPI).toHaveText(initialOutstanding);
    await expect(dashboardPage.availableCreditKPI).toHaveText(initialAvailable);
    await expect(dashboardPage.monthlySpendKPI).toHaveText(initialMonthly);
    
    await expect(dashboardPage.errorNotification).toBeVisible();
    await expect(dashboardPage.errorNotification).toContainText('Data may not be current');
    
    const dashboardStable = await dashboardPage.verifyDashboardStable();
    expect(dashboardStable).toBe(true);
  });
});
