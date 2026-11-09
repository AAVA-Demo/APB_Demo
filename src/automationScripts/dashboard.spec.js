const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Dashboard KPI Tests', () => {

  test('QE-9078 TS-001 TC-001 - Verify dashboard loads within 2 seconds and displays all four KPIs', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('$');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toContain('$');
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toContain('$');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toContain('$');
  });

  test('QE-9078 TS-002 TC-001 - Verify dashboard displays loading indicators and warning when KPI service exceeds latency', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await page.route('**/api/v1/kpis', async route => {
      await page.waitForTimeout(3500);
      await route.continue();
    });
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await expect(dashboardPage.loadingSpinner).toBeVisible();
    
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.delayWarningMessage).toBeVisible();
    const warningText = await dashboardPage.getDelayWarningText();
    expect(warningText).toContain('Dashboard loaded with delays');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-9078 TS-003 TC-001 - Verify credit utilization visual indicator displays 24% utilization in green', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.creditUtilizationIndicator).toBeVisible();
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toContain('8,500');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toContain('35,000');
    
    const utilizationPercentage = await dashboardPage.getUtilizationPercentage();
    expect(utilizationPercentage).toContain('24');
    
    const indicatorColor = await dashboardPage.getUtilizationIndicatorColor();
    expect(indicatorColor).toContain('green');
  });

  test('QE-9013 TS-001 TC-001 - Verify all four KPIs display within 2 seconds with correct values', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    const startTime = Date.now();
    await dashboardPage.waitForAllKPIsToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toMatch(/\$[0-9,]+\.[0-9]{2}/);
  });

  test('QE-9013 TS-002 TC-001 - Verify dashboard displays error indicator when Monthly Spend data is unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await page.route('**/api/v1/kpis/monthly-spend', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendErrorIndicator).toBeVisible();
    const errorMessage = await dashboardPage.getMonthlySpendErrorMessage();
    expect(errorMessage).toContain('Data temporarily unavailable');
    
    await expect(dashboardPage.retryButton).toBeVisible();
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-9013 TS-003 TC-001 - Verify dashboard handles large dataset with 10 cards and 500 transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.largeDataUser.username, testData.users.largeDataUser.password);
    
    const startTime = Date.now();
    await dashboardPage.waitForAllKPIsToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('$');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toContain('$');
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toContain('$');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toContain('$');
  });
});
