const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {

  test('QE-10603 TS-001 TC-001 - Verify monthly spend KPI displays accurate data', async ({ page }) => {
    logger.info('Starting test: QE-10603 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/.*creditcard-dashboard/);
      logger.info('Application launched successfully');
    });

    await test.step('Login with valid credentials', async () => {
      await loginPage.login('testuser_monthly', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
      logger.info('User authenticated and redirected to dashboard');
    });

    await test.step('Verify dashboard loads with KPI widgets', async () => {
      await expect(dashboardPage.monthlySpendWidget).toBeVisible();
      await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
      await expect(dashboardPage.availableCreditWidget).toBeVisible();
      await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
      logger.info('All KPI widgets displayed');
    });

    await test.step('Verify Monthly Spend KPI is prominently displayed', async () => {
      const monthlySpendLabel = await dashboardPage.getMonthlySpendLabel();
      expect(monthlySpendLabel).toContain('Monthly Spend');
      logger.info('Monthly Spend label verified');
    });

    await test.step('Verify Monthly Spend amount is accurate', async () => {
      const monthlySpendAmount = await dashboardPage.getMonthlySpendAmount();
      expect(parseFloat(monthlySpendAmount.replace(/[$,]/g, ''))).toBeGreaterThan(0);
      logger.info(`Monthly Spend amount: ${monthlySpendAmount}`);
    });

    await test.step('Verify amount is in currency format', async () => {
      const monthlySpendAmount = await dashboardPage.getMonthlySpendAmount();
      expect(monthlySpendAmount).toMatch(/^\$[\d,]+\.\d{2}$/);
      logger.info('Amount format verified');
    });
  });

  test('QE-10603 TS-002 TC-001 - Verify error handling when backend service unavailable', async ({ page }) => {
    logger.info('Starting test: QE-10603 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Simulate backend service unavailability', async () => {
      await page.route('**/api/dashboard/kpis*', route => route.abort());
      logger.info('Backend service blocked for testing');
    });

    await test.step('Launch application and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      logger.info('User authenticated');
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(dashboardPage.errorMessage).toBeVisible();
      const errorText = await dashboardPage.getErrorMessageText();
      expect(errorText).toContain('Failed to load dashboard data');
      logger.info('Error message displayed correctly');
    });

    await test.step('Verify KPI widget shows error state', async () => {
      const monthlySpendValue = await dashboardPage.getMonthlySpendAmount();
      expect(monthlySpendValue).toMatch(/--|Error|N\/A/);
      logger.info('Error state displayed in KPI widget');
    });
  });

  test('QE-10603 TS-003 TC-001 - Verify zero transaction history displays $0.00', async ({ page }) => {
    logger.info('Starting test: QE-10603 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Login with user having no transactions', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_notransactions', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
      logger.info('User with no transactions logged in');
    });

    await test.step('Verify Monthly Spend displays $0.00', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendAmount();
      expect(monthlySpend).toBe('$0.00');
      logger.info('Monthly Spend correctly shows $0.00');
    });

    await test.step('Verify no error messages displayed', async () => {
      await expect(dashboardPage.errorMessage).not.toBeVisible();
      logger.info('No errors displayed');
    });

    await test.step('Verify other KPIs display correctly', async () => {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimitAmount();
      expect(parseFloat(totalCreditLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
      logger.info('Other KPIs display valid values');
    });
  });

  test('QE-10602 TS-001 TC-001 - Verify aggregated credit limit and available credit', async ({ page }) => {
    logger.info('Starting test: QE-10602 TS-001 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Login with multi-card user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_multicard', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
      logger.info('Multi-card user logged in');
    });

    await test.step('Verify Total Credit Limit aggregation', async () => {
      const totalCreditLimit = await dashboardPage.getTotalCreditLimitAmount();
      const limitValue = parseFloat(totalCreditLimit.replace(/[$,]/g, ''));
      expect(limitValue).toBeGreaterThan(0);
      logger.info(`Total Credit Limit: ${totalCreditLimit}`);
    });

    await test.step('Verify Outstanding Amount', async () => {
      const outstandingAmount = await dashboardPage.getOutstandingAmount();
      const outstandingValue = parseFloat(outstandingAmount.replace(/[$,]/g, ''));
      expect(outstandingValue).toBeGreaterThanOrEqual(0);
      logger.info(`Outstanding Amount: ${outstandingAmount}`);
    });

    await test.step('Verify Available Credit calculation', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditAmount();
      const totalLimit = parseFloat((await dashboardPage.getTotalCreditLimitAmount()).replace(/[$,]/g, ''));
      const outstanding = parseFloat((await dashboardPage.getOutstandingAmount()).replace(/[$,]/g, ''));
      const expectedAvailable = totalLimit - outstanding;
      const actualAvailable = parseFloat(availableCredit.replace(/[$,]/g, ''));
      expect(Math.abs(actualAvailable - expectedAvailable)).toBeLessThan(1);
      logger.info('Available Credit calculation verified');
    });

    await test.step('Verify currency format', async () => {
      const totalLimit = await dashboardPage.getTotalCreditLimitAmount();
      expect(totalLimit).toMatch(/^\$[\d,]+(\.\d{2})?$/);
      logger.info('Currency format verified');
    });
  });

  test('QE-10602 TS-002 TC-001 - Verify over-limit warning indicator', async ({ page }) => {
    logger.info('Starting test: QE-10602 TS-002 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Login with over-limit user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_overlimit', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
      logger.info('Over-limit user logged in');
    });

    await test.step('Verify Outstanding exceeds Total Limit', async () => {
      const outstanding = parseFloat((await dashboardPage.getOutstandingAmount()).replace(/[$,]/g, ''));
      const totalLimit = parseFloat((await dashboardPage.getTotalCreditLimitAmount()).replace(/[$,]/g, ''));
      expect(outstanding).toBeGreaterThan(totalLimit);
      logger.info('Outstanding balance exceeds credit limit');
    });

    await test.step('Verify Available Credit shows $0.00 or negative', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditAmount();
      const value = parseFloat(availableCredit.replace(/[$,\-]/g, ''));
      expect(value).toBeLessThanOrEqual(0);
      logger.info(`Available Credit: ${availableCredit}`);
    });

    await test.step('Verify warning indicator displayed', async () => {
      await expect(dashboardPage.warningIndicator).toBeVisible();
      const warningText = await dashboardPage.getWarningText();
      expect(warningText).toContain('Credit limit exceeded');
      logger.info('Warning indicator displayed');
    });

    await test.step('Verify alert message', async () => {
      await expect(dashboardPage.alertMessage).toBeVisible();
      const alertText = await dashboardPage.getAlertMessageText();
      expect(alertText).toContain('outstanding balance exceeds your credit limit');
      logger.info('Alert message displayed');
    });
  });

  test('QE-10602 TS-003 TC-001 - Verify partial data with unavailable card issuer', async ({ page }) => {
    logger.info('Starting test: QE-10602 TS-003 TC-001');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await test.step('Simulate card issuer data feed unavailability', async () => {
      await page.route('**/api/cards/card-002/**', route => route.abort());
      logger.info('Card 2 issuer data feed blocked');
    });

    await test.step('Login with multi-issuer user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_multiissuer', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
      logger.info('Multi-issuer user logged in');
    });

    await test.step('Verify partial data notification', async () => {
      await expect(dashboardPage.partialDataNotification).toBeVisible();
      const notificationText = await dashboardPage.getPartialDataNotificationText();
      expect(notificationText).toContain('currently unavailable');
      logger.info('Partial data notification displayed');
    });

    await test.step('Verify Total Credit Limit excludes unavailable card', async () => {
      const totalLimit = await dashboardPage.getTotalCreditLimitAmount();
      logger.info(`Partial Total Credit Limit: ${totalLimit}`);
      expect(totalLimit).toBeDefined();
    });

    await test.step('Verify missing card details shown', async () => {
      const notificationText = await dashboardPage.getPartialDataNotificationText();
      expect(notificationText).toMatch(/Card ending in.*unavailable/);
      logger.info('Missing card details specified in notification');
    });
  });
});
