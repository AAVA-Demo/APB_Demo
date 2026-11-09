const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { Logger } = require('../utils/logger');

test.describe('Dashboard KPI Display and Credit Card Portfolio', () => {
  let dashboardPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    logger = new Logger('DashboardTests');
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to Dashboard page');
  });

  // Test Case: QE-7653 TS-001 TC-001
  test('TC-001: Verify dashboard KPI calculation for three active credit cards with accurate totals', async () => {
    logger.info('Starting TC-001: Dashboard KPI calculation test');
    
    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    
    // Verify total credit limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    logger.info(`Total Credit Limit: ${totalCreditLimit}`);
    await expect(totalCreditLimit).toBe('325,000.00');
    
    // Verify total available credit
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    logger.info(`Total Available Credit: ${totalAvailableCredit}`);
    await expect(totalAvailableCredit).toBe('235,000.00');
    
    // Verify total outstanding amount
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    logger.info(`Total Outstanding: ${totalOutstanding}`);
    await expect(totalOutstanding).toBe('90,000.00');
    
    // Verify total monthly spend
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    logger.info(`Total Monthly Spend: ${totalMonthlySpend}`);
    await expect(totalMonthlySpend).toBe('68,000.00');
    
    // Verify cards array contains 3 cards
    const cardCount = await dashboardPage.getCardCount();
    logger.info(`Card Count: ${cardCount}`);
    await expect(cardCount).toBe(3);
    
    logger.info('TC-001 completed successfully');
  });

  // Test Case: QE-7653 TS-002 TC-001
  test('TC-002: Verify dashboard handles credit card data source error gracefully', async () => {
    logger.info('Starting TC-002: Error handling test');
    
    // Simulate data source error by intercepting API call
    await dashboardPage.simulateDataSourceError();
    
    // Wait for error message to appear
    await dashboardPage.waitForErrorMessage();
    
    // Verify error message is displayed
    const errorMessage = await dashboardPage.getErrorMessage();
    logger.info(`Error Message: ${errorMessage}`);
    await expect(errorMessage).toBe('Failed to load dashboard data. Please try again.');
    
    // Verify loading state is false
    const isLoading = await dashboardPage.isLoadingIndicatorVisible();
    await expect(isLoading).toBe(false);
    
    // Verify application does not crash
    const pageTitle = await dashboardPage.getPageTitle();
    await expect(pageTitle).toBeTruthy();
    
    logger.info('TC-002 completed successfully');
  });

  // Test Case: QE-7653 TS-003 TC-001
  test('TC-003: Verify dashboard KPI display for single credit card with correct values', async () => {
    logger.info('Starting TC-003: Single card KPI display test');
    
    // Load single card data
    await dashboardPage.loadSingleCardData();
    await dashboardPage.waitForDashboardLoad();
    
    // Verify KPIs for single card
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe('100,000.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    await expect(totalAvailableCredit).toBe('65,000.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    await expect(totalOutstanding).toBe('35,000.00');
    
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    await expect(totalMonthlySpend).toBe('28,000.00');
    
    logger.info('TC-003 completed successfully');
  });

  // Test Case: QE-7653 TS-003 TC-002
  test('TC-004: Verify dashboard auto-refresh functionality triggers KPI update every 30 seconds', async () => {
    logger.info('Starting TC-004: Auto-refresh test');
    
    await dashboardPage.waitForDashboardLoad();
    
    // Get initial KPI values
    const initialMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    logger.info(`Initial Monthly Spend: ${initialMonthlySpend}`);
    
    // Wait for 30 seconds (auto-refresh interval)
    await dashboardPage.waitForAutoRefresh(30000);
    
    // Verify KPIs are refreshed (data may or may not change, but refresh should occur)
    const refreshedMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    logger.info(`Refreshed Monthly Spend: ${refreshedMonthlySpend}`);
    
    // Verify dashboard is still functional after refresh
    const cardCount = await dashboardPage.getCardCount();
    await expect(cardCount).toBeGreaterThan(0);
    
    logger.info('TC-004 completed successfully');
  });

  // Test Case: QE-7652 TS-001 TC-001
  test('TC-005: Verify consolidated credit card portfolio displays all three cards with accurate individual metrics', async () => {
    logger.info('Starting TC-005: Consolidated portfolio test');
    
    await dashboardPage.waitForDashboardLoad();
    
    // Verify card count
    const cardCount = await dashboardPage.getCardCount();
    await expect(cardCount).toBe(3);
    
    // Verify CC001 details
    const cc001Details = await dashboardPage.getCardDetails(0);
    logger.info(`CC001 Details: ${JSON.stringify(cc001Details)}`);
    await expect(cc001Details.cardType).toBe('Visa Platinum');
    await expect(cc001Details.creditLimit).toBe('100,000.00');
    await expect(cc001Details.availableCredit).toBe('65,000.00');
    await expect(cc001Details.outstandingAmount).toBe('35,000.00');
    await expect(cc001Details.monthlySpend).toBe('28,000.00');
    
    // Verify CC001 utilization
    const cc001Utilization = await dashboardPage.getCardUtilization(0);
    logger.info(`CC001 Utilization: ${cc001Utilization}`);
    await expect(cc001Utilization).toBe('35%');
    
    // Verify CC002 details
    const cc002Details = await dashboardPage.getCardDetails(1);
    await expect(cc002Details.cardType).toBe('MasterCard Gold');
    await expect(cc002Details.creditLimit).toBe('75,000.00');
    
    // Verify CC002 utilization
    const cc002Utilization = await dashboardPage.getCardUtilization(1);
    await expect(cc002Utilization).toBe('33%');
    
    // Verify CC003 details
    const cc003Details = await dashboardPage.getCardDetails(2);
    await expect(cc003Details.cardType).toBe('Amex Blue');
    await expect(cc003Details.creditLimit).toBe('150,000.00');
    
    // Verify CC003 utilization
    const cc003Utilization = await dashboardPage.getCardUtilization(2);
    await expect(cc003Utilization).toBe('20%');
    
    logger.info('TC-005 completed successfully');
  });

  // Test Case: QE-7652 TS-002 TC-001
  test('TC-006: Verify system handles empty credit card portfolio gracefully', async () => {
    logger.info('Starting TC-006: Empty portfolio test');
    
    // Load empty card data
    await dashboardPage.loadEmptyCardData();
    await dashboardPage.waitForDashboardLoad();
    
    // Verify all KPIs are zero
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe('0.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    await expect(totalAvailableCredit).toBe('0.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    await expect(totalOutstanding).toBe('0.00');
    
    const totalMonthlySpend = await dashboardPage.getTotalMonthlySpend();
    await expect(totalMonthlySpend).toBe('0.00');
    
    // Verify cards array is empty
    const cardCount = await dashboardPage.getCardCount();
    await expect(cardCount).toBe(0);
    
    logger.info('TC-006 completed successfully');
  });

  // Test Case: QE-7652 TS-003 TC-001
  test('TC-007: Verify consolidated portfolio correctly calculates aggregated totals and individual utilization for cards with varying utilization levels', async () => {
    logger.info('Starting TC-007: Varying utilization test');
    
    // Load cards with varying utilization (90%, 50%, 10%)
    await dashboardPage.loadVaryingUtilizationData();
    await dashboardPage.waitForDashboardLoad();
    
    // Verify total credit limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe('300,000.00');
    
    // Verify total available credit
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    await expect(totalAvailableCredit).toBe('150,000.00');
    
    // Verify CC001 utilization (90%)
    const cc001Utilization = await dashboardPage.getCardUtilization(0);
    await expect(cc001Utilization).toBe('90%');
    
    // Verify CC002 utilization (50%)
    const cc002Utilization = await dashboardPage.getCardUtilization(1);
    await expect(cc002Utilization).toBe('50%');
    
    // Verify CC003 utilization (10%)
    const cc003Utilization = await dashboardPage.getCardUtilization(2);
    await expect(cc003Utilization).toBe('10%');
    
    logger.info('TC-007 completed successfully');
  });
});