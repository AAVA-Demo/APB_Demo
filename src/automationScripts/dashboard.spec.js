const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9966 TS-001 TC-001 - Verify centralized KPI dashboard displays aggregated metrics for 2 active credit cards within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await loginPage.login('user2cards@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('₹45,230');
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('₹250,000');
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('₹185,670');
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('₹64,330');
  });

  test('QE-9966 TS-002 TC-001 - Verify appropriate error message is displayed during backend service outage', async ({ page }) => {
    await page.route('**/api/dashboard/kpis', route => route.abort('failed'));
    await loginPage.login('testuser@demo.com', 'Test@123');
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessage();
    expect(errorText).toContain('Failed to load KPI data');
    await expect(dashboardPage.errorMessage).not.toContainText('500');
    await expect(dashboardPage.errorMessage).not.toContainText('Internal Server Error');
  });

  test('QE-9966 TS-003 TC-001 - Verify KPI dashboard displays real-time accurate values for user with 1 active card and recent transactions', async ({ page }) => {
    const startTime = Date.now();
    await loginPage.login('user1card@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('₹28,000');
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('₹100,000');
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('₹72,000');
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('₹28,000');
  });
});

test.describe('Real-Time Credit Utilization Tracking Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9971 TS-001 TC-001 - Verify dashboard auto-refreshes with updated available credit after purchase transaction', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const initialCredit = await dashboardPage.getAvailableCredit();
    expect(initialCredit).toBe('₹50,000');
    await page.route('**/api/transactions', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, transactionId: 'txn123' })
    }));
    await dashboardPage.simulateTransaction(5000, 'c1');
    await page.waitForTimeout(60000);
    const updatedCredit = await dashboardPage.getAvailableCredit();
    expect(updatedCredit).toBe('₹45,000');
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(parseInt(outstandingAmount.replace(/[^0-9]/g, ''))).toBeGreaterThan(0);
  });

  test('QE-9971 TS-002 TC-001 - Verify dashboard auto-refreshes with increased available credit after payment', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const initialCredit = await dashboardPage.getAvailableCredit();
    expect(initialCredit).toBe('₹40,000');
    await page.route('**/api/payments', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, paymentId: 'pay123' })
    }));
    await dashboardPage.simulatePayment(10000, 'c1');
    await page.waitForTimeout(60000);
    const updatedCredit = await dashboardPage.getAvailableCredit();
    expect(updatedCredit).toBe('₹50,000');
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('₹10,000');
  });

  test('QE-9971 TS-003 TC-001 - Verify dashboard displays stale data when backend processing exceeds 60 seconds', async ({ page }) => {
    await loginPage.login('testuser@demo.com', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const initialCredit = await dashboardPage.getAvailableCredit();
    expect(initialCredit).toBe('₹50,000');
    await page.route('**/api/transactions', route => {
      setTimeout(() => route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true, transactionId: 'txn456' })
      }), 90000);
    });
    await dashboardPage.simulateTransaction(8000, 'c1');
    await page.waitForTimeout(60000);
    const creditAfter60Sec = await dashboardPage.getAvailableCredit();
    expect(creditAfter60Sec).toBe('₹50,000');
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    const creditAfterRefresh = await dashboardPage.getAvailableCredit();
    expect(creditAfterRefresh).toBe('₹42,000');
  });
});