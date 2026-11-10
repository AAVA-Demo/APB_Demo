const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { AuthHelper } = require('./helpers/auth.helper');

test.describe('Dashboard KPIs - QE-10019', () => {
  let dashboardPage;
  
  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await AuthHelper.authenticate(page, 'user123');
    await dashboardPage.navigate();
  });
  
  test('QE-10019 TS-001 TC-001 - Verify consolidated KPI dashboard displays accurate aggregated values for user with multiple active credit cards within 2 seconds', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBe('35000.00');
    expect(totalCreditLimit).toBe('225000.00');
    expect(availableCredit).toBe('160000.00');
    expect(outstandingAmount).toBe('65000.00');
    
    const loadTime = await dashboardPage.getLoadTime();
    expect(loadTime).toBeLessThan(2000);
  });
  
  test('QE-10019 TS-001 TC-002 - Verify KPI dashboard handles edge case of user with single credit card', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user456');
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBe('20000.00');
    expect(totalCreditLimit).toBe('150000.00');
    expect(availableCredit).toBe('105000.00');
    expect(outstandingAmount).toBe('45000.00');
    
    const loadTime = await dashboardPage.getLoadTime();
    expect(loadTime).toBeLessThan(2000);
  });
  
  test('QE-10019 TS-002 TC-001 - Verify unauthenticated user cannot access KPI dashboard and receives authentication error', async ({ page }) => {
    await page.goto('/dashboard');
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Authentication required');
    
    const kpiDataVisible = await dashboardPage.isKpiDataVisible();
    expect(kpiDataVisible).toBe(false);
  });
  
  test('QE-10019 TS-002 TC-002 - Verify expired authentication token prevents dashboard access', async ({ page }) => {
    await AuthHelper.setExpiredToken(page);
    await page.goto('/dashboard');
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Token expired');
    
    const kpiDataVisible = await dashboardPage.isKpiDataVisible();
    expect(kpiDataVisible).toBe(false);
  });
  
  test('QE-10019 TS-003 TC-001 - Verify KPI dashboard correctly displays zero balances when user has no outstanding amounts', async ({ page }) => {
    await AuthHelper.authenticate(page, 'user789');
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBe('0.00');
    expect(totalCreditLimit).toBe('175000.00');
    expect(availableCredit).toBe('175000.00');
    expect(outstandingAmount).toBe('0.00');
    
    expect(availableCredit).toBe(totalCreditLimit);
  });
});
