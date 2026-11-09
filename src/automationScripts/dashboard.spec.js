const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard and KPI Management', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Starting dashboard test case');
  });

  test('QE-8498 TS-001 TC-001: Verify consolidated KPIs for three active cards', async ({ page }) => {
    logger.info('Test Case: QE-8498 TS-001 TC-001');
    
    await dashboardPage.navigateWithUser('test_user_three_cards');
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('100000.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    expect(totalOutstanding).toBe('28000.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe('72000.00');
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('17700.00');
    
    logger.info('Test Case QE-8498 TS-001 TC-001 completed successfully');
  });

  test('QE-8498 TS-001 TC-002: Verify KPI calculations update correctly when card balances change', async ({ page }) => {
    logger.info('Test Case: QE-8498 TS-001 TC-002');
    
    await dashboardPage.navigateWithUser('test_user_three_cards');
    await dashboardPage.waitForDashboardLoad();
    
    const initialOutstanding = await dashboardPage.getTotalOutstandingAmount();
    const initialAvailable = await dashboardPage.getTotalAvailableCredit();
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    
    expect(initialOutstanding).toBe('28000.00');
    expect(initialAvailable).toBe('72000.00');
    
    await dashboardPage.simulateNewTransaction('1', '500');
    await dashboardPage.refreshDashboard();
    
    const updatedOutstanding = await dashboardPage.getTotalOutstandingAmount();
    const updatedAvailable = await dashboardPage.getTotalAvailableCredit();
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    
    expect(parseFloat(updatedOutstanding)).toBe(parseFloat(initialOutstanding) + 500);
    expect(parseFloat(updatedAvailable)).toBe(parseFloat(initialAvailable) - 500);
    expect(parseFloat(updatedMonthlySpend)).toBe(parseFloat(initialMonthlySpend) + 500);
    
    logger.info('Test Case QE-8498 TS-001 TC-002 completed successfully');
  });

  test('QE-8498 TS-002 TC-001: Verify KPIs for single card with zero outstanding balance', async ({ page }) => {
    logger.info('Test Case: QE-8498 TS-002 TC-001');
    
    await dashboardPage.navigateWithUser('test_user_single_card_zero_balance');
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('50000.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    expect(totalOutstanding).toBe('0.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe('50000.00');
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(['0.00', '5000.00']).toContain(monthlySpend);
    
    logger.info('Test Case QE-8498 TS-002 TC-001 completed successfully');
  });

  test('QE-8498 TS-002 TC-002: Verify Monthly Spend KPI with paid-off transactions', async ({ page }) => {
    logger.info('Test Case: QE-8498 TS-002 TC-002');
    
    await dashboardPage.navigateWithUser('test_user_paid_off_card');
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('5000.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    expect(totalOutstanding).toBe('0.00');
    
    logger.info('Test Case QE-8498 TS-002 TC-002 completed successfully');
  });

  test('QE-8498 TS-003 TC-001: Verify dashboard handles zero credit limits gracefully', async ({ page }) => {
    logger.info('Test Case: QE-8498 TS-003 TC-001');
    
    await dashboardPage.navigateWithUser('test_user_zero_limits');
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('0.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe('0.00');
    
    const hasCalculationErrors = await dashboardPage.checkForCalculationErrors();
    expect(hasCalculationErrors).toBeFalsy();
    
    const isDashboardStable = await dashboardPage.isDashboardStable();
    expect(isDashboardStable).toBeTruthy();
    
    logger.info('Test Case QE-8498 TS-003 TC-001 completed successfully');
  });

  test('QE-8498 TS-003 TC-002: Verify warnings displayed for zero credit limits', async ({ page }) => {
    logger.info('Test Case: QE-8498 TS-003 TC-002');
    
    await dashboardPage.navigateWithUser('test_user_zero_limits');
    await dashboardPage.waitForDashboardLoad();
    
    const warningMessage = await dashboardPage.getWarningMessage();
    expect(warningMessage).toContain('Credit limits not available');
    
    const kpisDisplayedCleanly = await dashboardPage.verifyKPIsDisplayedCleanly();
    expect(kpisDisplayedCleanly).toBeTruthy();
    
    logger.info('Test Case QE-8498 TS-003 TC-002 completed successfully');
  });

  test('QE-8489 TS-001 TC-001: Verify consolidated KPIs are calculated accurately', async ({ page }) => {
    logger.info('Test Case: QE-8489 TS-001 TC-001');
    
    await dashboardPage.navigateWithUser('test_user_three_cards');
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('100000.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    expect(totalOutstanding).toBe('28000.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe('72000.00');
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('17700.00');
    
    logger.info('Test Case QE-8489 TS-001 TC-001 completed successfully');
  });

  test('QE-8489 TS-001 TC-002: Verify KPI calculations update correctly', async ({ page }) => {
    logger.info('Test Case: QE-8489 TS-001 TC-002');
    
    await dashboardPage.navigateWithUser('test_user_three_cards');
    await dashboardPage.waitForDashboardLoad();
    
    const initialOutstanding = await dashboardPage.getTotalOutstandingAmount();
    const initialAvailable = await dashboardPage.getTotalAvailableCredit();
    
    await dashboardPage.simulateNewTransaction('1', '500');
    await dashboardPage.refreshDashboard();
    
    const updatedOutstanding = await dashboardPage.getTotalOutstandingAmount();
    const updatedAvailable = await dashboardPage.getTotalAvailableCredit();
    
    expect(parseFloat(updatedOutstanding)).toBe(parseFloat(initialOutstanding) + 500);
    expect(parseFloat(updatedAvailable)).toBe(parseFloat(initialAvailable) - 500);
    
    logger.info('Test Case QE-8489 TS-001 TC-002 completed successfully');
  });

  test('QE-8489 TS-002 TC-001: Verify KPIs display correctly for single card', async ({ page }) => {
    logger.info('Test Case: QE-8489 TS-002 TC-001');
    
    await dashboardPage.navigateWithUser('test_user_single_card_zero_balance');
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('50000.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    expect(totalOutstanding).toBe('0.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe('50000.00');
    
    logger.info('Test Case QE-8489 TS-002 TC-001 completed successfully');
  });

  test('QE-8489 TS-002 TC-002: Verify Monthly Spend KPI displays correctly', async ({ page }) => {
    logger.info('Test Case: QE-8489 TS-002 TC-002');
    
    await dashboardPage.navigateWithUser('test_user_paid_off_card');
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('5000.00');
    
    const totalOutstanding = await dashboardPage.getTotalOutstandingAmount();
    expect(totalOutstanding).toBe('0.00');
    
    logger.info('Test Case QE-8489 TS-002 TC-002 completed successfully');
  });

  test('QE-8489 TS-003 TC-001: Verify dashboard handles zero credit limits gracefully', async ({ page }) => {
    logger.info('Test Case: QE-8489 TS-003 TC-001');
    
    await dashboardPage.navigateWithUser('test_user_zero_limits');
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('0.00');
    
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe('0.00');
    
    const hasCalculationErrors = await dashboardPage.checkForCalculationErrors();
    expect(hasCalculationErrors).toBeFalsy();
    
    logger.info('Test Case QE-8489 TS-003 TC-001 completed successfully');
  });

  test('QE-8489 TS-003 TC-002: Verify appropriate warnings displayed', async ({ page }) => {
    logger.info('Test Case: QE-8489 TS-003 TC-002');
    
    await dashboardPage.navigateWithUser('test_user_zero_limits');
    await dashboardPage.waitForDashboardLoad();
    
    const warningMessage = await dashboardPage.getWarningMessage();
    expect(warningMessage).toContain('Credit limits not available');
    
    const kpisDisplayedCleanly = await dashboardPage.verifyKPIsDisplayedCleanly();
    expect(kpisDisplayedCleanly).toBeTruthy();
    
    logger.info('Test Case QE-8489 TS-003 TC-002 completed successfully');
  });
});
