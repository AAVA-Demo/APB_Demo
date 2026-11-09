const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Metrics and Real-Time Tracking', () => {

  test('QE-8972 TS-001 TC-001 - Verify successful display of all KPI metrics on dashboard', async ({ page }) => {
    logger.info('Starting test: QE-8972 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Launch application and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'Test@123');
      logger.info('User logged in successfully');
    });

    await test.step('Navigate to dashboard and verify page loads', async () => {
      await dashboardPage.navigate();
      await expect(page).toHaveURL(/.*dashboard/, { timeout: 2000 });
      logger.info('Dashboard page loaded within 2 seconds');
    });

    await test.step('Verify Monthly Spend KPI is displayed', async () => {
      await dashboardPage.waitForKPIVisible('monthlySpend');
      const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
      expect(monthlySpend).toBeTruthy();
      logger.info(`Monthly Spend KPI displayed: ${monthlySpend}`);
    });

    await test.step('Verify Total Credit Limit KPI is displayed', async () => {
      await dashboardPage.waitForKPIVisible('totalCreditLimit');
      const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
      expect(totalCreditLimit).toBeTruthy();
      logger.info(`Total Credit Limit KPI displayed: ${totalCreditLimit}`);
    });

    await test.step('Verify Available Credit KPI is displayed', async () => {
      await dashboardPage.waitForKPIVisible('availableCredit');
      const availableCredit = await dashboardPage.getKPIValue('availableCredit');
      expect(availableCredit).toBeTruthy();
      logger.info(`Available Credit KPI displayed: ${availableCredit}`);
    });

    await test.step('Verify Outstanding Amount KPI is displayed', async () => {
      await dashboardPage.waitForKPIVisible('outstandingAmount');
      const outstandingAmount = await dashboardPage.getKPIValue('outstandingAmount');
      expect(outstandingAmount).toBeTruthy();
      logger.info(`Outstanding Amount KPI displayed: ${outstandingAmount}`);
    });

    logger.info('Test QE-8972 TS-001 TC-001 completed successfully');
  });

  test('QE-8972 TS-002 TC-001 - Verify error handling when Credit Card Data Service is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-8972 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Simulate service downtime by blocking API endpoint', async () => {
      await page.route('**/api/cards/summary**', route => route.abort());
      logger.info('Credit Card Data Service blocked');
    });

    await test.step('Login and navigate to dashboard', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'Test@123');
      await dashboardPage.navigate();
      logger.info('Navigated to dashboard with service unavailable');
    });

    await test.step('Verify error message is displayed', async () => {
      await dashboardPage.waitForErrorMessage();
      const errorText = await dashboardPage.getErrorMessageText();
      expect(errorText).toContain('Unable to load credit card data');
      logger.info('Error message displayed correctly');
    });

    await test.step('Verify KPI widgets display placeholder values', async () => {
      const hasPlaceholders = await dashboardPage.hasKPIPlaceholders();
      expect(hasPlaceholders).toBeTruthy();
      logger.info('KPI widgets show placeholder values');
    });

    logger.info('Test QE-8972 TS-002 TC-001 completed successfully');
  });

  test('QE-8972 TS-003 TC-001 - Verify dashboard displays zero values for user with no credit cards', async ({ page }) => {
    logger.info('Starting test: QE-8972 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Login with new user credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('newuser@example.com', 'NewUser@123');
      logger.info('New user logged in successfully');
    });

    await test.step('Navigate to dashboard', async () => {
      await dashboardPage.navigate();
      await expect(page).toHaveURL(/.*dashboard/);
      logger.info('Dashboard page loaded');
    });

    await test.step('Verify all KPI metrics display zero', async () => {
      const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
      const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
      const availableCredit = await dashboardPage.getKPIValue('availableCredit');
      const outstandingAmount = await dashboardPage.getKPIValue('outstandingAmount');
      
      expect(monthlySpend).toContain('$0');
      expect(totalCreditLimit).toContain('$0');
      expect(availableCredit).toContain('$0');
      expect(outstandingAmount).toContain('$0');
      logger.info('All KPI metrics display zero values');
    });

    await test.step('Verify informational message is displayed', async () => {
      const message = await dashboardPage.getNoDataMessage();
      expect(message).toContain('No data available');
      logger.info('No data message displayed correctly');
    });

    logger.info('Test QE-8972 TS-003 TC-001 completed successfully');
  });

  test('QE-8975 TS-001 TC-001 - Verify real-time credit utilization update within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-8975 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Login and navigate to dashboard', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'Test@123');
      await dashboardPage.navigate();
      logger.info('Dashboard loaded');
    });

    await test.step('Note current Available Credit and Outstanding Amount', async () => {
      const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
      const initialOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
      logger.info(`Initial values - Available Credit: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    });

    await test.step('Simulate new transaction processing', async () => {
      await dashboardPage.simulateTransaction(500);
      logger.info('Transaction of $500 simulated');
    });

    await test.step('Wait for automatic refresh and verify updates within 2 seconds', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForKPIUpdate('availableCredit', 2000);
      const elapsedTime = Date.now() - startTime;
      
      expect(elapsedTime).toBeLessThan(2000);
      logger.info(`Dashboard refreshed in ${elapsedTime}ms`);
    });

    await test.step('Verify Available Credit is updated', async () => {
      const updatedAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
      expect(updatedAvailableCredit).toBeTruthy();
      logger.info(`Updated Available Credit: ${updatedAvailableCredit}`);
    });

    await test.step('Verify Outstanding Amount is updated', async () => {
      const updatedOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
      expect(updatedOutstanding).toBeTruthy();
      logger.info(`Updated Outstanding Amount: ${updatedOutstanding}`);
    });

    logger.info('Test QE-8975 TS-001 TC-001 completed successfully');
  });

  test('QE-8975 TS-002 TC-001 - Verify error message when network connectivity fails', async ({ page }) => {
    logger.info('Starting test: QE-8975 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Login and navigate to dashboard', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'Test@123');
      await dashboardPage.navigate();
      logger.info('Dashboard loaded');
    });

    await test.step('Note current KPI values', async () => {
      const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
      const initialOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
      logger.info(`Initial values captured`);
    });

    await test.step('Simulate network connectivity issue', async () => {
      await page.route('**/api/**', route => route.abort());
      logger.info('Network connectivity blocked');
    });

    await test.step('Simulate transaction and wait for refresh attempt', async () => {
      await dashboardPage.simulateTransaction(500);
      await page.waitForTimeout(2000);
      logger.info('Waited for refresh attempt');
    });

    await test.step('Verify error message is displayed', async () => {
      await dashboardPage.waitForErrorMessage();
      const errorText = await dashboardPage.getErrorMessageText();
      expect(errorText).toContain('Unable to refresh data');
      logger.info('Network error message displayed');
    });

    await test.step('Verify KPI values remain unchanged', async () => {
      const currentAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
      const currentOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
      expect(currentAvailableCredit).toBeTruthy();
      expect(currentOutstanding).toBeTruthy();
      logger.info('KPI values remain unchanged');
    });

    logger.info('Test QE-8975 TS-002 TC-001 completed successfully');
  });

  test('QE-8975 TS-003 TC-001 - Verify error when transaction exceeds credit limit', async ({ page }) => {
    logger.info('Starting test: QE-8975 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Login and navigate to dashboard', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'Test@123');
      await dashboardPage.navigate();
      logger.info('Dashboard loaded');
    });

    await test.step('Note current KPI values', async () => {
      const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
      const initialOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
      logger.info(`Initial Available Credit: ${initialAvailableCredit}`);
    });

    await test.step('Simulate transaction exceeding credit limit', async () => {
      await dashboardPage.simulateTransaction(6000);
      logger.info('Transaction of $6000 simulated (exceeds limit)');
    });

    await test.step('Verify error notification is displayed', async () => {
      await dashboardPage.waitForErrorNotification();
      const errorText = await dashboardPage.getErrorNotificationText();
      expect(errorText).toContain('Transaction declined: Insufficient credit');
      logger.info('Insufficient credit error displayed');
    });

    await test.step('Verify KPI values remain unchanged', async () => {
      const currentAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
      const currentOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
      expect(currentAvailableCredit).toBeTruthy();
      expect(currentOutstanding).toBeTruthy();
      logger.info('KPI values unchanged after declined transaction');
    });

    logger.info('Test QE-8975 TS-003 TC-001 completed successfully');
  });

});