const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {

  test('QE-7994 TS-001 TC-001 - Verify Monthly Spend KPI with multiple transactions', async ({ page }) => {
    logger.info('Starting test: QE-7994 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application', async () => {
      await dashboardPage.navigate();
      logger.info('Application loaded');
    });

    await test.step('Authenticate user', async () => {
      await dashboardPage.login('testuser_monthly', 'Pass@123');
      logger.info('User authenticated');
    });

    await test.step('Access dashboard', async () => {
      await dashboardPage.waitForDashboardLoad();
      await dashboardPage.waitForKPICards();
      logger.info('Dashboard loaded');
    });

    await test.step('Verify Monthly Spend KPI', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendKPI();
      expect(monthlySpend).toBe('$1,250.75');
      logger.info('Monthly Spend KPI verified: $1,250.75');
    });

    await test.step('Verify calculation includes all 10 transactions', async () => {
      const transactionCount = await dashboardPage.getTransactionCount();
      expect(transactionCount).toBe(10);
      logger.info('All 10 transactions included in calculation');
    });
  });

  test('QE-7994 TS-002 TC-001 - Verify Monthly Spend KPI shows $0.00 for no transactions', async ({ page }) => {
    logger.info('Starting test: QE-7994 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_notransactions', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.waitForKPICards();

    await test.step('Verify Monthly Spend KPI is $0.00', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendKPI();
      expect(monthlySpend).toBe('$0.00');
      logger.info('Monthly Spend KPI correctly shows $0.00');
    });
  });

  test('QE-7994 TS-003 TC-001 - Verify Monthly Spend KPI defaults to $0.00 for missing data', async ({ page }) => {
    logger.info('Starting test: QE-7994 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_missingdata', 'Pass@123');

    await test.step('Trigger KPI calculation with missing amounts', async () => {
      await dashboardPage.triggerKPICalculation();
      logger.info('KPI calculation triggered');
    });

    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.waitForKPICards();

    await test.step('Verify Monthly Spend KPI defaults to $0.00', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendKPI();
      expect(monthlySpend).toBe('$0.00');
      logger.info('Monthly Spend KPI defaulted to $0.00');
    });

    await test.step('Verify error logged', async () => {
      const errorLogged = await dashboardPage.checkErrorLog();
      expect(errorLogged).toBe(true);
      logger.info('Error logged for data integrity review');
    });
  });

  test('QE-7991 TS-001 TC-001 - Verify Available Credit KPI calculation', async ({ page }) => {
    logger.info('Starting test: QE-7991 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_availcredit', 'Pass@123');

    await test.step('Verify card data loaded', async () => {
      await dashboardPage.waitForCardDataLoad();
      const cardALimit = await dashboardPage.getCardLimit('Card A');
      const cardAOutstanding = await dashboardPage.getCardOutstanding('Card A');
      expect(cardALimit).toBe(10000);
      expect(cardAOutstanding).toBe(2500);
      
      const cardBLimit = await dashboardPage.getCardLimit('Card B');
      const cardBOutstanding = await dashboardPage.getCardOutstanding('Card B');
      expect(cardBLimit).toBe(15000);
      expect(cardBOutstanding).toBe(3000);
      logger.info('Card data verified');
    });

    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.waitForKPICards();

    await test.step('Verify Available Credit KPI', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditKPI();
      expect(availableCredit).toBe('$19,500');
      logger.info('Available Credit KPI verified: $19,500');
    });
  });

  test('QE-7991 TS-002 TC-001 - Verify Available Credit KPI shows $0 at max utilization', async ({ page }) => {
    logger.info('Starting test: QE-7991 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_maxed', 'Pass@123');

    await test.step('Verify card at maximum utilization', async () => {
      await dashboardPage.waitForCardDataLoad();
      const cardLimit = await dashboardPage.getCardLimit('Card');
      const cardOutstanding = await dashboardPage.getCardOutstanding('Card');
      expect(cardLimit).toBe(10000);
      expect(cardOutstanding).toBe(10000);
      logger.info('Card at max utilization verified');
    });

    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.waitForKPICards();

    await test.step('Verify Available Credit KPI is $0', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditKPI();
      expect(availableCredit).toBe('$0');
      logger.info('Available Credit KPI correctly shows $0');
    });
  });

  test('QE-7991 TS-003 TC-001 - Verify Available Credit KPI shows N/A for incomplete data', async ({ page }) => {
    logger.info('Starting test: QE-7991 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_incomplete', 'Pass@123');

    await test.step('Verify incomplete card data', async () => {
      await dashboardPage.waitForCardDataLoad();
      const cardLimit = await dashboardPage.getCardLimit('Card');
      expect(cardLimit).toBeNull();
      const cardOutstanding = await dashboardPage.getCardOutstanding('Card');
      expect(cardOutstanding).toBe(2500);
      logger.info('Incomplete card data verified');
    });

    await test.step('Trigger KPI calculation', async () => {
      await dashboardPage.triggerKPICalculation();
      logger.info('KPI calculation triggered');
    });

    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.waitForKPICards();

    await test.step('Verify Available Credit KPI shows N/A or error', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditKPI();
      expect(['N/A', 'Error', 'Data Unavailable']).toContain(availableCredit);
      logger.info(`Available Credit KPI shows: ${availableCredit}`);
    });
  });
});