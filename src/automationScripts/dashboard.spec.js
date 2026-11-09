const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Credit Card Dashboard Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('QE-8167-TS001-TC001: Verify KPI dashboard loads within 2 seconds with accurate calculations', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();
  });

  test('QE-8167-TS002-TC001: Verify progressive KPI loading when load time exceeds 2 seconds', async ({ page }) => {
    await page.route('**/api/kpi/**', route => {
      setTimeout(() => route.continue(), 3000);
    });
    
    await dashboardPage.navigate();
    await expect(dashboardPage.loadingSpinner).toBeVisible();
    await dashboardPage.waitForKPIsToLoad();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-8167-TS003-TC001: Verify partial service failure displays error placeholders for failed metrics', async ({ page }) => {
    await page.route('**/api/kpi/available-credit', route => {
      route.fulfill({ status: 500, body: 'Service Error' });
    });
    
    await dashboardPage.navigate();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditError).toBeVisible();
    await expect(dashboardPage.retryButton).toBeVisible();
    
    await dashboardPage.retryButton.click();
    await expect(dashboardPage.loadingSpinner).toBeVisible();
  });

  test('QE-8165-TS001-TC001: Verify mobile responsive dashboard adapts to mobile screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate();
    
    await expect(dashboardPage.kpiContainer).toHaveCSS('flex-direction', 'column');
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    const kpiBox = await dashboardPage.monthlySpendKPI.boundingBox();
    expect(kpiBox.width).toBeLessThanOrEqual(375);
  });

  test('QE-8165-TS002-TC001: Verify tablet landscape layout optimizes screen space', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await dashboardPage.navigate();
    
    await expect(dashboardPage.kpiContainer).toHaveCSS('display', /grid|flex/);
    const kpis = await dashboardPage.getAllKPIs();
    expect(kpis.length).toBe(4);
  });

  test('QE-8161-TS001-TC001: Verify real-time transaction update reflects in dashboard KPIs', async ({ page }) => {
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('newTransaction', { detail: { amount: 2000 } }));
    });
    
    await page.waitForTimeout(5000);
    await dashboardPage.waitForKPIUpdate();
    
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(updatedMonthlySpend).toBeGreaterThan(initialMonthlySpend);
  });

  test('QE-8161-TS002-TC001: Verify cached KPI data is displayed when refresh service unavailable', async ({ page }) => {
    await page.route('**/api/kpi/refresh', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });
    
    await dashboardPage.navigate();
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(timestamp).toBeTruthy();
  });

  test('QE-8161-TS003-TC001: Verify automatic background refresh updates KPIs', async ({ page }) => {
    await dashboardPage.navigate();
    const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    
    await page.waitForTimeout(65000);
    
    const updatedTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(updatedTimestamp).not.toBe(initialTimestamp);
  });
});
