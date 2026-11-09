const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Dashboard and KPI Management - QE-7916', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Starting dashboard test case');
  });

  test('QE-7916 TS-001 TC-001: Verify authenticated user with 4 cards can access responsive dashboard displaying all KPIs within 2 seconds', async ({ page }) => {
    logger.info('Test Case ID: QE-7916 TS-001 TC-001');
    
    await test.step('Launch application in desktop browser', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/.*creditcard-dashboard/);
      logger.info('Application launched successfully');
    });

    await test.step('Login with authenticated user having 4 active credit cards', async () => {
      await loginPage.login('testuser_4cards', 'Test@123');
      await expect(dashboardPage.dashboardTitle).toBeVisible();
      logger.info('User authenticated and redirected to dashboard');
    });

    await test.step('Verify dashboard loads within 2 seconds', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForDashboardLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
      logger.info(`Dashboard loaded in ${loadTime}ms`);
    });

    await test.step('Verify monthly spending KPI is displayed', async () => {
      await expect(dashboardPage.monthlySpendKPI).toBeVisible();
      const monthlySpend = await dashboardPage.getMonthlySpend();
      expect(monthlySpend).toBe('$3,500.00');
      logger.info('Monthly spending KPI verified');
    });

    await test.step('Verify total credit limit KPI is displayed', async () => {
      await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
      const totalLimit = await dashboardPage.getTotalCreditLimit();
      expect(totalLimit).toBe('$40,000.00');
      logger.info('Total credit limit KPI verified');
    });

    await test.step('Verify available credit KPI is displayed', async () => {
      await expect(dashboardPage.availableCreditKPI).toBeVisible();
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(availableCredit).toBe('$28,000.00');
      logger.info('Available credit KPI verified');
    });

    await test.step('Verify outstanding amounts KPI is displayed', async () => {
      await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
      const outstanding = await dashboardPage.getOutstandingAmount();
      expect(outstanding).toBe('$12,000.00');
      logger.info('Outstanding amount KPI verified');
    });

    await test.step('Resize browser to tablet dimensions and verify responsive layout', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(dashboardPage.dashboardContainer).toBeVisible();
      const isResponsive = await dashboardPage.verifyResponsiveLayout('tablet');
      expect(isResponsive).toBeTruthy();
      logger.info('Tablet responsive layout verified');
    });

    await test.step('Resize browser to mobile dimensions and verify responsive layout', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(dashboardPage.dashboardContainer).toBeVisible();
      const isResponsive = await dashboardPage.verifyResponsiveLayout('mobile');
      expect(isResponsive).toBeTruthy();
      logger.info('Mobile responsive layout verified');
    });
  });

  test('QE-7916 TS-002 TC-001: Verify user without valid authentication is redirected to login with appropriate message', async ({ page, context }) => {
    logger.info('Test Case ID: QE-7916 TS-002 TC-001');
    
    await test.step('Clear browser session storage to remove any existing auth token', async () => {
      await context.clearCookies();
      await page.evaluate(() => sessionStorage.clear());
      logger.info('Session storage cleared');
    });

    await test.step('Attempt to access dashboard URL directly without authentication', async () => {
      await page.goto('/dashboard');
      logger.info('Attempted to access dashboard without authentication');
    });

    await test.step('Verify user is redirected to login page', async () => {
      await expect(page).toHaveURL(/.*\/login/);
      logger.info('User redirected to login page');
    });

    await test.step('Verify appropriate message is displayed on login page', async () => {
      await expect(loginPage.sessionExpiredMessage).toBeVisible();
      const message = await loginPage.getSessionExpiredMessage();
      expect(message).toContain('Session expired - please login again');
      logger.info('Session expired message verified');
    });
  });

  test('QE-7916 TS-003 TC-001: Verify KPI widgets update in real-time within 2 seconds after manual refresh following new transaction', async ({ page }) => {
    logger.info('Test Case ID: QE-7916 TS-003 TC-001');
    
    await test.step('Launch application and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_refresh', 'Test@123');
      await dashboardPage.waitForDashboardLoad();
      logger.info('User authenticated and dashboard loaded');
    });

    await test.step('Note the current KPI values displayed on dashboard', async () => {
      const initialMonthlySpend = await dashboardPage.getMonthlySpend();
      const initialOutstanding = await dashboardPage.getOutstandingAmount();
      const initialAvailable = await dashboardPage.getAvailableCredit();
      expect(initialMonthlySpend).toBe('$2,000.00');
      expect(initialOutstanding).toBe('$8,000.00');
      expect(initialAvailable).toBe('$22,000.00');
      logger.info('Initial KPI values recorded');
    });

    await test.step('Simulate completion of a new transaction', async () => {
      await dashboardPage.simulateNewTransaction(500, 'Shopping');
      logger.info('New transaction of $500 simulated');
    });

    await test.step('Click the Refresh button on dashboard', async () => {
      await dashboardPage.clickRefreshButton();
      logger.info('Manual refresh triggered');
    });

    await test.step('Verify dashboard updates within 2 seconds', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForKPIUpdate();
      const updateTime = Date.now() - startTime;
      expect(updateTime).toBeLessThan(2000);
      logger.info(`Dashboard updated in ${updateTime}ms`);
    });

    await test.step('Verify monthly spending KPI is updated', async () => {
      const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
      expect(updatedMonthlySpend).toBe('$2,500.00');
      logger.info('Monthly spend updated to $2,500.00');
    });

    await test.step('Verify outstanding amount KPI is updated', async () => {
      const updatedOutstanding = await dashboardPage.getOutstandingAmount();
      expect(updatedOutstanding).toBe('$8,500.00');
      logger.info('Outstanding amount updated to $8,500.00');
    });

    await test.step('Verify available credit KPI is recalculated', async () => {
      const updatedAvailable = await dashboardPage.getAvailableCredit();
      expect(updatedAvailable).toBe('$21,500.00');
      logger.info('Available credit recalculated to $21,500.00');
    });
  });
});

test.describe('Available Credit Tracking - QE-7917', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Starting available credit tracking test case');
  });

  test('QE-7917 TS-001 TC-001: Verify accurate available credit calculation for user with 3 credit cards', async ({ page }) => {
    logger.info('Test Case ID: QE-7917 TS-001 TC-001');
    
    await test.step('Launch application and login with user having 3 credit cards', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_3cards', 'Test@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to Dashboard', async () => {
      await dashboardPage.waitForDashboardLoad();
      await expect(dashboardPage.kpiWidgets).toBeVisible();
      logger.info('Dashboard loaded with KPI widgets');
    });

    await test.step('Verify total credit limit is calculated correctly', async () => {
      const totalLimit = await dashboardPage.getTotalCreditLimit();
      expect(totalLimit).toBe('$30,000.00');
      logger.info('Total credit limit verified: $30,000.00');
    });

    await test.step('Verify total current balance is calculated correctly', async () => {
      const outstanding = await dashboardPage.getOutstandingAmount();
      expect(outstanding).toBe('$9,000.00');
      logger.info('Total outstanding verified: $9,000.00');
    });

    await test.step('Verify available credit is calculated and displayed correctly', async () => {
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(availableCredit).toBe('$21,000.00');
      logger.info('Available credit verified: $21,000.00');
    });
  });

  test('QE-7917 TS-002 TC-001: Verify negative available credit and warning indicator for over-limit credit card', async ({ page }) => {
    logger.info('Test Case ID: QE-7917 TS-002 TC-001');
    
    await test.step('Launch application and login with user having an over-limit credit card', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_overlimit', 'Test@123');
      logger.info('User authenticated');
    });

    await test.step('Navigate to Dashboard', async () => {
      await dashboardPage.waitForDashboardLoad();
      logger.info('Dashboard loaded');
    });

    await test.step('Verify available credit displays negative value', async () => {
      const availableCredit = await dashboardPage.getAvailableCredit();
      expect(availableCredit).toBe('-$500.00');
      logger.info('Negative available credit verified: -$500.00');
    });

    await test.step('Verify warning indicator is displayed for over-limit condition', async () => {
      await expect(dashboardPage.overLimitWarning).toBeVisible();
      const warningMessage = await dashboardPage.getWarningMessage();
      expect(warningMessage).toContain('Credit limit exceeded');
      logger.info('Over-limit warning indicator verified');
    });
  });

  test('QE-7917 TS-003 TC-001: Verify available credit updates in real-time after manual dashboard refresh following payment', async ({ page }) => {
    logger.info('Test Case ID: QE-7917 TS-003 TC-001');
    
    await test.step('Launch application and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_payment', 'Test@123');
      await dashboardPage.waitForDashboardLoad();
      logger.info('User authenticated and dashboard loaded');
    });

    await test.step('Note the current available credit displayed on dashboard', async () => {
      const initialAvailable = await dashboardPage.getAvailableCredit();
      expect(initialAvailable).toBe('$5,000.00');
      logger.info('Initial available credit: $5,000.00');
    });

    await test.step('Simulate payment on one credit card', async () => {
      await dashboardPage.simulatePayment(2000, 'Card 1');
      logger.info('Payment of $2,000 processed on Card 1');
    });

    await test.step('Trigger manual dashboard refresh by clicking Refresh button', async () => {
      await dashboardPage.clickRefreshButton();
      logger.info('Dashboard refresh initiated');
    });

    await test.step('Verify dashboard updates within 2 seconds', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForKPIUpdate();
      const updateTime = Date.now() - startTime;
      expect(updateTime).toBeLessThan(2000);
      logger.info(`Dashboard refresh completed in ${updateTime}ms`);
    });

    await test.step('Verify available credit is recalculated and updated', async () => {
      const updatedAvailable = await dashboardPage.getAvailableCredit();
      expect(updatedAvailable).toBe('$7,000.00');
      logger.info('Available credit updated to $7,000.00');
    });
  });
});