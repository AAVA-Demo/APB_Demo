const { test, expect } = require('@playwright/test');
const { KPIDashboardPage } = require('./pages/kpiDashboard.page');
const { AuthHelper } = require('./helpers/auth.helper');
const { Logger } = require('./utils/logger');

test.describe('KPI Dashboard - Monthly Spend and Credit Utilization', () => {
  let kpiDashboardPage;
  let authHelper;
  let logger;

  test.beforeEach(async ({ page }) => {
    kpiDashboardPage = new KPIDashboardPage(page);
    authHelper = new AuthHelper(page);
    logger = new Logger();
    await authHelper.authenticate();
  });

  test('QE-10384 TS-001 TC-001: Verify KPI dashboard displays accurate monthly spend aggregation', async ({ page }) => {
    logger.info('Test Case ID: QE-10384 TS-001 TC-001');
    const userId = 'user-monthly-spend-001';
    
    await authHelper.authenticateAsUser(userId);
    await kpiDashboardPage.navigateToDashboard();
    
    const kpiData = await kpiDashboardPage.getKPIData();
    logger.info(`KPI Monthly Spend: $${kpiData.monthlySpend}`);
    
    const individualCardSpends = await kpiDashboardPage.getIndividualCardMonthlySpends(userId);
    const calculatedSum = individualCardSpends.reduce((sum, spend) => sum + spend, 0);
    logger.info(`Calculated sum from ${individualCardSpends.length} cards: $${calculatedSum}`);
    
    expect(Math.abs(kpiData.monthlySpend - calculatedSum)).toBeLessThanOrEqual(0.01);
    logger.info('KPI monthly spend matches calculated sum');
    
    // Verify currency format
    const displayedValue = await kpiDashboardPage.getMonthlySpendDisplayValue();
    expect(displayedValue).toMatch(/^\$[0-9,]+\.\d{2}$/);
    logger.info(`Monthly spend displayed as: ${displayedValue}`);
  });

  test('QE-10384 TS-002 TC-001: Verify $0.00 display when no transactions', async ({ page }) => {
    logger.info('Test Case ID: QE-10384 TS-002 TC-001');
    const userId = 'user-no-monthly-spend-001';
    
    await authHelper.authenticateAsUser(userId);
    await kpiDashboardPage.navigateToDashboard();
    
    const kpiData = await kpiDashboardPage.getKPIData();
    expect(kpiData.monthlySpend).toBe(0);
    expect(kpiData.monthlySpend).not.toBeNull();
    expect(kpiData.monthlySpend).not.toBeUndefined();
    logger.info('Monthly spend is 0.00 (not null or undefined)');
    
    const displayedValue = await kpiDashboardPage.getMonthlySpendDisplayValue();
    expect(displayedValue).toBe('$0.00');
    logger.info(`Displayed value: ${displayedValue}`);
    
    const errors = await page.evaluate(() => window.errors || []);
    expect(errors.length).toBe(0);
    logger.info('No errors occurred');
  });

  test('QE-10384 TS-003 TC-001: Verify dashboard loads within 2 seconds with 10 cards', async ({ page }) => {
    logger.info('Test Case ID: QE-10384 TS-003 TC-001');
    const userId = 'user-10-cards-performance-001';
    
    await authHelper.authenticateAsUser(userId);
    
    const startTime = Date.now();
    await kpiDashboardPage.navigateToDashboard();
    const kpiData = await kpiDashboardPage.getKPIData();
    const endTime = Date.now();
    
    const elapsedTime = endTime - startTime;
    expect(elapsedTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard loaded in ${elapsedTime}ms (threshold: 2000ms)`);
    
    expect(kpiData.monthlySpend).toBeGreaterThanOrEqual(0);
    logger.info(`Monthly spend aggregated across 10 cards: $${kpiData.monthlySpend}`);
  });

  test('QE-10383 TS-001 TC-001: Verify credit utilization KPIs are accurate', async ({ page }) => {
    logger.info('Test Case ID: QE-10383 TS-001 TC-001');
    const userId = 'user-credit-utilization-001';
    
    await authHelper.authenticateAsUser(userId);
    await kpiDashboardPage.navigateToDashboard();
    
    const kpiData = await kpiDashboardPage.getKPIData();
    logger.info(`KPI Data: Credit Limit=$${kpiData.totalCreditLimit}, Available=$${kpiData.availableCredit}, Outstanding=$${kpiData.outstandingAmount}`);
    
    const individualCardBalances = await kpiDashboardPage.getIndividualCardBalances(userId);
    
    const calculatedCreditLimit = individualCardBalances.reduce((sum, card) => sum + card.creditLimit, 0);
    const calculatedAvailableCredit = individualCardBalances.reduce((sum, card) => sum + card.availableCredit, 0);
    const calculatedOutstanding = individualCardBalances.reduce((sum, card) => sum + card.outstandingBalance, 0);
    
    logger.info(`Calculated: Credit Limit=$${calculatedCreditLimit}, Available=$${calculatedAvailableCredit}, Outstanding=$${calculatedOutstanding}`);
    
    expect(Math.abs(kpiData.totalCreditLimit - calculatedCreditLimit)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(kpiData.availableCredit - calculatedAvailableCredit)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(kpiData.outstandingAmount - calculatedOutstanding)).toBeLessThanOrEqual(0.01);
    logger.info('All KPI values match calculated sums');
  });

  test('QE-10383 TS-002 TC-001: Verify default values for zero credit limits', async ({ page }) => {
    logger.info('Test Case ID: QE-10383 TS-002 TC-001');
    const userId = 'user-zero-credit-limit-001';
    
    await authHelper.authenticateAsUser(userId);
    await kpiDashboardPage.navigateToDashboard();
    
    const kpiData = await kpiDashboardPage.getKPIData();
    expect(kpiData.totalCreditLimit).toBe(0);
    expect(kpiData.availableCredit).toBe(0);
    expect(kpiData.totalCreditLimit).not.toBeNull();
    expect(kpiData.availableCredit).not.toBeNull();
    logger.info('Credit limit and available credit are 0.00 (not null)');
    
    await expect(kpiDashboardPage.missingDataMessage).toBeVisible();
    const messageText = await kpiDashboardPage.missingDataMessage.textContent();
    expect(messageText).toMatch(/Missing credit limit|Credit limit information unavailable/);
    logger.info(`Message displayed: ${messageText}`);
    
    const errors = await page.evaluate(() => window.errors || []);
    expect(errors.length).toBe(0);
    logger.info('No errors occurred');
  });

  test('QE-10383 TS-003 TC-001: Verify real-time refresh of credit utilization metrics', async ({ page }) => {
    logger.info('Test Case ID: QE-10383 TS-003 TC-001');
    const userId = 'user-refresh-test-001';
    const cardId = 'card-123';
    const transactionAmount = 500;
    
    await authHelper.authenticateAsUser(userId);
    await kpiDashboardPage.navigateToDashboard();
    
    const initialKpiData = await kpiDashboardPage.getKPIData();
    logger.info(`Initial: Available=$${initialKpiData.availableCredit}, Outstanding=$${initialKpiData.outstandingAmount}`);
    
    // Simulate transaction
    await kpiDashboardPage.simulateTransaction(userId, cardId, transactionAmount);
    logger.info(`Simulated $${transactionAmount} transaction`);
    
    // Wait for refresh interval (10 seconds)
    await page.waitForTimeout(10000);
    
    const updatedKpiData = await kpiDashboardPage.getKPIData();
    logger.info(`Updated: Available=$${updatedKpiData.availableCredit}, Outstanding=$${updatedKpiData.outstandingAmount}`);
    
    const expectedAvailableCredit = initialKpiData.availableCredit - transactionAmount;
    const expectedOutstanding = initialKpiData.outstandingAmount + transactionAmount;
    
    expect(Math.abs(updatedKpiData.availableCredit - expectedAvailableCredit)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(updatedKpiData.outstandingAmount - expectedOutstanding)).toBeLessThanOrEqual(0.01);
    logger.info('KPI metrics refreshed correctly within 10 seconds');
  });
});
