const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { Logger } = require('../utils/logger');

test.describe('Dashboard KPI Overview Display - QE-8453', () => {
  let dashboardPage;
  const logger = new Logger();

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to dashboard page');
  });

  test('QE-8453 TS-001 TC-001: Verify KPI calculation aggregates data from all credit cards and returns results within 2 seconds', async () => {
    logger.info('Starting test: KPI calculation validation');
    
    const startTime = Date.now();
    await dashboardPage.waitForKPIsToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`KPI load time: ${loadTime}ms`);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe(3900);
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe(33000);
    
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe(25500);
    
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe(7500);
    
    logger.info('All KPI values validated successfully');
  });

  test('QE-8453 TS-002 TC-001: Verify system displays cached KPI values when credit card data source is temporarily unavailable', async () => {
    logger.info('Starting test: Cached KPI values on data source unavailability');
    
    await dashboardPage.simulateDataSourceUnavailability();
    await dashboardPage.navigate();
    
    await dashboardPage.waitForKPIsToLoad();
    
    const cachedIndicator = await dashboardPage.getCachedDataIndicator();
    expect(cachedIndicator).toBeTruthy();
    expect(cachedIndicator.toLowerCase()).toContain('cached');
    
    const lastUpdatedTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(lastUpdatedTimestamp).toBeTruthy();
    
    logger.info(`Cached data indicator validated: ${cachedIndicator}`);
  });

  test('QE-8453 TS-002 TC-002: Verify system displays error message when credit card data source returns incomplete data and no cache is available', async () => {
    logger.info('Starting test: Error message on incomplete data');
    
    await dashboardPage.clearCache();
    await dashboardPage.simulateIncompleteDataResponse();
    await dashboardPage.navigate();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.toLowerCase()).toContain('incomplete data');
    
    logger.info(`Error message validated: ${errorMessage}`);
  });

  test('QE-8453 TS-003 TC-001: Verify KPI calculation handles zero credit limit without errors', async () => {
    logger.info('Starting test: Zero credit limit handling');
    
    await dashboardPage.addTestCard({ creditLimit: 0, availableCredit: 0, outstandingAmount: 0 });
    await dashboardPage.navigate();
    
    await dashboardPage.waitForKPIsToLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBeGreaterThanOrEqual(0);
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toBeFalsy();
    
    logger.info('Zero credit limit handled without errors');
  });

  test('QE-8453 TS-003 TC-002: Verify KPI calculation handles negative available credit (over-limit scenario) without errors', async () => {
    logger.info('Starting test: Negative available credit handling');
    
    await dashboardPage.addTestCard({ creditLimit: 5000, outstandingAmount: 5500, availableCredit: -500 });
    await dashboardPage.navigate();
    
    await dashboardPage.waitForKPIsToLoad();
    
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(typeof availableCredit).toBe('number');
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toBeFalsy();
    
    logger.info('Negative available credit handled without errors');
  });

  test('QE-8453 TS-003 TC-003: Verify KPI calculation handles missing monthly spend data without producing incorrect totals', async () => {
    logger.info('Starting test: Missing monthly spend handling');
    
    await dashboardPage.addTestCard({ creditLimit: 10000, availableCredit: 10000, outstandingAmount: 0, monthlySpend: null });
    await dashboardPage.navigate();
    
    await dashboardPage.waitForKPIsToLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(typeof monthlySpend).toBe('number');
    expect(monthlySpend).toBeGreaterThanOrEqual(0);
    
    logger.info('Missing monthly spend handled correctly');
  });
});
