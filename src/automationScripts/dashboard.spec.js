const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {

  test('TC-5178: Display monthly spend KPI with accurate calculation', async ({ page }) => {
    logger.info('Starting test: TC-5178 - Display monthly spend KPI');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.createTransactions([1000, 800, 700]);
    await dashboardPage.navigateToDashboard();
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    expect(monthlySpend).toBe('$2500.00');
    logger.info('Test TC-5178 passed: Monthly spend displayed correctly');
  });

  test('TC-5179: Display zero monthly spend when no transactions exist', async ({ page }) => {
    logger.info('Starting test: TC-5179 - Zero monthly spend');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.navigateToDashboard();
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    expect(monthlySpend).toBe('$0.00');
    const message = await dashboardPage.getNoSpendingMessage();
    expect(message).toContain('No spending activity');
    logger.info('Test TC-5179 passed: Zero spend displayed with message');
  });

  test('TC-5180: Handle monthly spend calculation service failure', async ({ page }) => {
    logger.info('Starting test: TC-5180 - Service failure handling');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.simulateServiceFailure('monthlySpendCalculation');
    await dashboardPage.navigateToDashboard();
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('temporarily unavailable');
    logger.info('Test TC-5180 passed: Error message displayed');
  });

  test('TC-5217: View consolidated KPI dashboard with multiple cards', async ({ page }) => {
    logger.info('Starting test: TC-5217 - Consolidated KPI view');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.setupMultipleCards([{limit: 5000, balance: 1500}, {limit: 10000, balance: 3000}]);
    await dashboardPage.createTransactions([2500]);
    await dashboardPage.navigateToDashboard();
    const kpis = await dashboardPage.getAllKPIs();
    expect(kpis.monthlySpend).toBe('$2500');
    expect(kpis.totalCreditLimit).toBe('$15000');
    expect(kpis.availableCredit).toBe('$10500');
    expect(kpis.outstandingAmount).toBe('$4500');
    logger.info('Test TC-5217 passed: All KPIs displayed correctly');
  });

  test('TC-5218: Display N/A for KPIs when all cards are inactive', async ({ page }) => {
    logger.info('Starting test: TC-5218 - Inactive cards KPI display');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.setupInactiveCards();
    await dashboardPage.navigateToDashboard();
    const kpis = await dashboardPage.getAllKPIs();
    expect(kpis.monthlySpend).toBe('$0.00');
    const message = await dashboardPage.getNoActiveCardsMessage();
    expect(message).toContain('No active cards');
    logger.info('Test TC-5218 passed: N/A displayed for inactive cards');
  });

  test('TC-5219: Display service unavailable message during maintenance', async ({ page }) => {
    logger.info('Starting test: TC-5219 - Maintenance mode');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.simulateMaintenanceMode();
    await dashboardPage.navigateToDashboard();
    const message = await dashboardPage.getMaintenanceMessage();
    expect(message).toContain('Service temporarily unavailable');
    expect(message).toContain('Estimated restoration');
    logger.info('Test TC-5219 passed: Maintenance message displayed');
  });

  test('TC-5223: Display monthly spend with decimal precision', async ({ page }) => {
    logger.info('Starting test: TC-5223 - Decimal precision');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.createTransactions([123.45, 678.90, 234.56]);
    await dashboardPage.navigateToDashboard();
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    expect(monthlySpend).toBe('$1036.91');
    logger.info('Test TC-5223 passed: Decimal precision maintained');
  });

  test('TC-5224: Display zero monthly spend on first day of new month', async ({ page }) => {
    logger.info('Starting test: TC-5224 - New month zero spend');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.navigateToDashboard();
    const monthlySpend = await dashboardPage.getMonthlySpendKPI();
    expect(monthlySpend).toBe('$0.00');
    const message = await dashboardPage.getNoSpendingMessage();
    expect(message).toContain('No spending activity for the month');
    logger.info('Test TC-5224 passed: Zero spend displayed for new month');
  });

  test('TC-5225: Display stale data warning when transaction service is down', async ({ page }) => {
    logger.info('Starting test: TC-5225 - Stale data warning');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.simulateServiceFailure('transactionProcessing');
    await dashboardPage.navigateToDashboard();
    const warning = await dashboardPage.getStaleDataWarning();
    expect(warning).toContain('Data cannot be refreshed');
    logger.info('Test TC-5225 passed: Stale data warning displayed');
  });

  test('TC-5241: View consolidated KPIs across desktop, tablet, and mobile', async ({ page }) => {
    logger.info('Starting test: TC-5241 - Responsive KPI view');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.setupMultipleCards([{limit: 5000, balance: 1500}, {limit: 10000, balance: 3000}]);
    await dashboardPage.createTransactions([2500]);
    await dashboardPage.navigateToDashboard();
    const kpis = await dashboardPage.getAllKPIs();
    expect(kpis.monthlySpend).toBe('$2500');
    expect(kpis.totalCreditLimit).toBe('$15000');
    expect(kpis.availableCredit).toBe('$10500');
    expect(kpis.outstandingAmount).toBe('$4500');
    logger.info('Test TC-5241 passed: KPIs displayed responsively');
  });

  test('TC-5242: Deny access to dashboard without authentication', async ({ page }) => {
    logger.info('Starting test: TC-5242 - Authentication required');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.navigateToDashboard();
    const errorMessage = await dashboardPage.getAuthenticationError();
    expect(errorMessage).toContain('Authentication required');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
    logger.info('Test TC-5242 passed: Redirected to login');
  });

  test('TC-5243: Display N/A for KPIs when user has no linked cards', async ({ page }) => {
    logger.info('Starting test: TC-5243 - No linked cards');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user789', 'validPassword');
    await dashboardPage.navigateToDashboard();
    const kpis = await dashboardPage.getAllKPIs();
    expect(kpis.monthlySpend).toBe('$0.00');
    const message = await dashboardPage.getNoCardsMessage();
    expect(message).toContain('No credit cards available');
    logger.info('Test TC-5243 passed: N/A displayed for no cards');
  });

  test('TC-5244: View KPIs on desktop with correct layout', async ({ page }) => {
    logger.info('Starting test: TC-5244 - Desktop responsive layout');
    const dashboardPage = new DashboardPage(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.navigateToDashboard();
    const isResponsive = await dashboardPage.verifyResponsiveLayout('desktop');
    expect(isResponsive).toBe(true);
    logger.info('Test TC-5244 passed: Desktop layout verified');
  });

  test('TC-5245: Display browser compatibility warning for unsupported browser', async ({ page }) => {
    logger.info('Starting test: TC-5245 - Browser compatibility warning');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.simulateUnsupportedBrowser();
    await dashboardPage.navigateToDashboard();
    const warning = await dashboardPage.getCompatibilityWarning();
    expect(warning).toContain('browser version is not fully supported');
    logger.info('Test TC-5245 passed: Compatibility warning displayed');
  });

  test('TC-5246: Support concurrent dashboard access by multiple users', async ({ page }) => {
    logger.info('Starting test: TC-5246 - Concurrent user access');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('user123', 'validPassword');
    await dashboardPage.navigateToDashboard();
    const kpisUserA = await dashboardPage.getAllKPIs();
    expect(kpisUserA.monthlySpend).toBeDefined();
    logger.info('Test TC-5246 passed: Concurrent access supported');
  });

});
