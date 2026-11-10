const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Dashboard and KPI Management Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9955 TS-001 TC-001: Verify all four KPIs are displayed with correct aggregated values', async ({ page }) => {
    await loginPage.login(testData.users.activeUser.username, testData.users.activeUser.password);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const outstandingAmount = await dashboardPage.getKPIValue('outstandingAmount');
    
    expect(monthlySpend).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    expect(totalCreditLimit).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    expect(availableCredit).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    expect(outstandingAmount).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await dashboardPage.lastUpdatedTimestamp.textContent();
    expect(timestamp).toContain('Last updated:');
  });

  test('QE-9955 TS-002 TC-001: Verify error message when services are unavailable', async ({ page }) => {
    await page.route('**/api/cards', route => route.abort());
    await page.route('**/api/transactions/monthly*', route => route.abort());
    
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load dashboard data');
    
    await expect(dashboardPage.monthlySpendKPI).not.toContainText(/\$[0-9]/);
  });

  test('QE-9955 TS-003 TC-001: Verify all KPIs display $0.00 for zero balance accounts', async ({ page }) => {
    await loginPage.login(testData.users.zeroBalance.username, testData.users.zeroBalance.password);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    expect(await dashboardPage.getKPIValue('monthlySpend')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('totalCreditLimit')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('availableCredit')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('outstandingAmount')).toBe('$0.00');
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(2000);
    expect(consoleErrors).toHaveLength(0);
  });

  test('QE-9958 TS-001 TC-001: Verify real-time KPI updates after new transaction', async ({ page }) => {
    await loginPage.login(testData.users.testUser.username, testData.users.testUser.password);
    
    const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const initialOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    await page.request.post(`${testData.apiBaseUrl}/transactions`, {
      data: {
        cardId: 'card123',
        amount: 200,
        category: 'Shopping'
      }
    });
    
    await page.waitForTimeout(5000);
    await page.reload();
    
    const updatedAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const updatedOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    expect(parseFloat(updatedAvailableCredit.replace(/[$,]/g, ''))).toBeLessThan(
      parseFloat(initialAvailableCredit.replace(/[$,]/g, ''))
    );
    expect(parseFloat(updatedOutstanding.replace(/[$,]/g, ''))).toBeGreaterThan(
      parseFloat(initialOutstanding.replace(/[$,]/g, ''))
    );
  });

  test('QE-9958 TS-002 TC-001: Verify system handles null credit limit gracefully', async ({ page }) => {
    await loginPage.login(testData.users.nullUser.username, testData.users.nullUser.password);
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    expect(await dashboardPage.getKPIValue('totalCreditLimit')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('outstandingAmount')).toBe('$0.00');
    expect(await dashboardPage.getKPIValue('availableCredit')).toBe('$0.00');
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.waitForTimeout(2000);
    expect(consoleErrors.filter(e => e.includes('null') || e.includes('undefined'))).toHaveLength(0);
  });

  test('QE-9958 TS-003 TC-001: Verify total available credit calculation across multiple cards', async ({ page }) => {
    await loginPage.login(testData.users.multiCard.username, testData.users.multiCard.password);
    
    await dashboardPage.navigateToMyCards();
    await page.waitForTimeout(2000);
    
    const totalCreditExpected = 5000 + 10000 + 3000;
    const availableCreditExpected = 3500 + 8000 + 2500;
    const outstandingExpected = 1500 + 2000 + 500;
    
    await dashboardPage.navigateToDashboard();
    
    const totalCredit = parseFloat((await dashboardPage.getKPIValue('totalCreditLimit')).replace(/[$,]/g, ''));
    const availableCredit = parseFloat((await dashboardPage.getKPIValue('availableCredit')).replace(/[$,]/g, ''));
    const outstanding = parseFloat((await dashboardPage.getKPIValue('outstandingAmount')).replace(/[$,]/g, ''));
    
    expect(totalCredit).toBe(totalCreditExpected);
    expect(availableCredit).toBe(availableCreditExpected);
    expect(outstanding).toBe(outstandingExpected);
    
    const utilizationRate = (outstanding / totalCredit) * 100;
    expect(utilizationRate).toBeCloseTo(22.22, 1);
  });
});