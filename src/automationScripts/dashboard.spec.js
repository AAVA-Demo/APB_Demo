const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test('QE-7933 TS-001 TC-001 - Verify real-time KPI dashboard displays all 4 KPIs with values updating within 2 seconds', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_2cards', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    await dashboardPage.triggerNewTransaction(150.00, 'Coffee Shop');
    
    await page.waitForTimeout(2000);
    
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(updatedMonthlySpend).toBeGreaterThan(initialMonthlySpend);
    expect(updatedOutstanding).toBeGreaterThan(initialOutstanding);
  });

  test('QE-7933 TS-002 TC-001 - Verify unauthenticated user is blocked from accessing KPI dashboard and redirected to login', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL(/.*login/);
    await expect(dashboardPage.errorMessage).toContainText('Session invalid. Please login.');
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    const pageContent = await page.content();
    expect(pageContent).not.toContain('$');
    expect(pageContent).not.toContain('****');
  });

  test('QE-7933 TS-003 TC-001 - Verify graceful degradation when Transaction Service is down', async ({ page }) => {
    await page.route('**/api/transactions/**', route => route.abort());
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_active', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.monthlySpendKPI).toContainText('Data Unavailable');
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).not.toContainText('Data Unavailable');
    
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).not.toContainText('Data Unavailable');
    
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).not.toContainText('Data Unavailable');
  });

  test('QE-7930 TS-001 TC-001 - Verify consolidated multi-card view displays aggregated KPIs correctly for 3 active cards', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_3active', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe(45000);
    
    const totalOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(totalOutstanding).toBe(16000);
    
    const totalAvailable = await dashboardPage.getAvailableCreditValue();
    expect(totalAvailable).toBe(29000);
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe(4200);
    
    await dashboardPage.verifyAllKPIsVisibleWithoutScrolling();
  });

  test('QE-7930 TS-002 TC-001 - Verify dashboard handles user with no credit cards gracefully', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_nocards', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.noCardsMessage).toContainText('No credit cards are available');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitText();
    expect(['$0.00', 'N/A']).toContain(totalCreditLimit);
    
    const totalOutstanding = await dashboardPage.getOutstandingAmountText();
    expect(['$0.00', 'N/A']).toContain(totalOutstanding);
    
    const totalAvailable = await dashboardPage.getAvailableCreditText();
    expect(['$0.00', 'N/A']).toContain(totalAvailable);
    
    const monthlySpend = await dashboardPage.getMonthlySpendText();
    expect(['$0.00', 'N/A']).toContain(monthlySpend);
  });

  test('QE-7930 TS-003 TC-001 - Verify graceful degradation when one card data service is unavailable', async ({ page }) => {
    await page.route('**/api/cards/card3', route => route.abort());
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_multicard', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.warningMessage).toContainText('Some card data is currently unavailable');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe(25000);
    
    const totalOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(totalOutstanding).toBe(7000);
    
    const totalAvailable = await dashboardPage.getAvailableCreditValue();
    expect(totalAvailable).toBe(18000);
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe(2800);
    
    await expect(page).not.toHaveURL(/.*error/);
  });
});