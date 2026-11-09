const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { Logger } = require('../utils/logger');
const testData = require('../data/testData.json');

test.describe('Centralized KPI Dashboard Tests', () => {
  let dashboardPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger = new Logger('DashboardSpec');
    logger.info('Navigating to dashboard');
    await dashboardPage.navigate();
  });

  test('QE-8893 TS-001 TC-001: Verify KPI dashboard loads all four KPI cards with accurate values within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-8893 TS-001 TC-001 - KPI Dashboard Load Test');
    
    const user = testData.users.testuser_kpi;
    await dashboardPage.login(user.username, user.password);
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    logger.info(`KPI Values - Monthly: ${monthlySpend}, Limit: ${totalLimit}, Available: ${availableCredit}, Outstanding: ${outstanding}`);
    
    expect(monthlySpend).toBe('$3,200.00');
    expect(totalLimit).toBe('$50,000.00');
    expect(availableCredit).toBe('$25,000.00');
    expect(outstanding).toBe('$25,000.00');
  });

  test('QE-8893 TS-002 TC-001: Verify monthly spend KPI displays $0.00 for user with zero transaction activity', async ({ page }) => {
    logger.info('Test Case: QE-8893 TS-002 TC-001 - Zero Transaction Activity Test');
    
    const user = testData.users.testuser_zerotxn;
    await dashboardPage.login(user.username, user.password);
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$0.00');
    
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(totalLimit).toBe('$30,000.00');
    expect(availableCredit).toBe('$20,000.00');
    expect(outstanding).toBe('$10,000.00');
    
    logger.info('Zero transaction scenario validated successfully');
  });

  test('QE-8893 TS-003 TC-001: Verify all KPI values are calculated correctly with accurate formulas', async ({ page }) => {
    logger.info('Test Case: QE-8893 TS-003 TC-001 - KPI Calculation Validation');
    
    const user = testData.users.testuser_kpi_validation;
    await dashboardPage.login(user.username, user.password);
    await dashboardPage.waitForDashboardLoad();
    
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    
    const totalLimitNum = parseFloat(totalLimit.replace(/[$,]/g, ''));
    const outstandingNum = parseFloat(outstanding.replace(/[$,]/g, ''));
    const availableCreditNum = parseFloat(availableCredit.replace(/[$,]/g, ''));
    
    const calculatedAvailable = totalLimitNum - outstandingNum;
    
    logger.info(`Calculation: ${totalLimitNum} - ${outstandingNum} = ${calculatedAvailable}`);
    expect(availableCreditNum).toBe(calculatedAvailable);
    expect(totalLimitNum).toBe(30000);
    expect(outstandingNum).toBe(12500);
    expect(availableCreditNum).toBe(17500);
  });

  test('QE-8894 TS-001 TC-001: Verify available credit is accurately calculated and updated in real-time after transaction', async ({ page }) => {
    logger.info('Test Case: QE-8894 TS-001 TC-001 - Real-time Credit Update Test');
    
    const user = testData.users.testuser_realtime;
    await dashboardPage.login(user.username, user.password);
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailable = await dashboardPage.getAvailableCreditValue();
    expect(initialAvailable).toBe('$25,000.00');
    
    await dashboardPage.simulateTransaction(500);
    
    await page.waitForTimeout(30000);
    
    await dashboardPage.waitForKPIRefresh();
    const updatedAvailable = await dashboardPage.getAvailableCreditValue();
    
    logger.info(`Available credit after transaction: ${updatedAvailable}`);
    expect(updatedAvailable).toBe('$24,500.00');
    
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    expect(outstanding).toBe('$25,500.00');
  });

  test('QE-8894 TS-002 TC-001: Verify available credit is correctly calculated for high utilization scenario', async ({ page }) => {
    logger.info('Test Case: QE-8894 TS-002 TC-001 - High Utilization Test');
    
    const user = testData.users.testuser_highutil;
    await dashboardPage.login(user.username, user.password);
    await dashboardPage.waitForDashboardLoad();
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$50.00');
    
    await expect(dashboardPage.highUtilizationWarning).toBeVisible();
    
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(totalLimit).toBe('$10,000.00');
    expect(outstanding).toBe('$9,950.00');
    
    logger.info('High utilization warning displayed correctly');
  });

  test('QE-8894 TS-003 TC-001: Verify available credit increases correctly after payment with real-time refresh', async ({ page }) => {
    logger.info('Test Case: QE-8894 TS-003 TC-001 - Payment Impact Test');
    
    const user = testData.users.testuser_payment;
    await dashboardPage.login(user.username, user.password);
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailable = await dashboardPage.getAvailableCreditValue();
    expect(initialAvailable).toBe('$15,000.00');
    
    await dashboardPage.makePayment(2000);
    
    await page.waitForTimeout(30000);
    
    await dashboardPage.waitForKPIRefresh();
    const updatedAvailable = await dashboardPage.getAvailableCreditValue();
    
    logger.info(`Available credit after payment: ${updatedAvailable}`);
    expect(updatedAvailable).toBe('$17,000.00');
    
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    expect(outstanding).toBe('$13,000.00');
  });
});
