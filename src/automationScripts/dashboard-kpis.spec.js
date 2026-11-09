const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPIs - QE-8971', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Starting Dashboard KPIs test');
  });

  test('QE-8971 TS-001 TC-001: Verify dashboard loads within 2 seconds with aggregated KPIs for multiple active credit cards', async ({ page }) => {
    logger.info('Test Case: QE-8971 TS-001 TC-001 - Dashboard loads with aggregated KPIs');
    
    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    logger.info('Application login page loaded successfully');

    // Step 2-3: Enter credentials for user with multiple cards
    await loginPage.login('testuser_multicard', 'Pass@123');
    logger.info('Entered credentials for multi-card user');

    // Step 4: Click login and verify dashboard loads within 2 seconds
    const startTime = Date.now();
    await loginPage.clickLogin();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);

    // Step 5: Verify aggregated monthly spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    logger.info(`Monthly spend KPI displayed: ${monthlySpend}`);

    // Step 6: Verify combined total credit limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    logger.info(`Total credit limit KPI displayed: ${totalCreditLimit}`);

    // Step 7: Verify aggregate available credit KPI
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    logger.info(`Available credit KPI displayed: ${availableCredit}`);

    // Step 8: Verify total outstanding amounts KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info(`Outstanding amount KPI displayed: ${outstandingAmount}`);

    logger.info('Test Case QE-8971 TS-001 TC-001 completed successfully');
  });

  test('QE-8971 TS-002 TC-001: Verify dashboard displays zero/N/A KPI values with appropriate message when user has no registered credit cards', async ({ page }) => {
    logger.info('Test Case: QE-8971 TS-002 TC-001 - No credit cards scenario');
    
    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    logger.info('Application login page loaded successfully');

    // Step 2-3: Enter credentials for user with no cards
    await loginPage.login('testuser_nocard', 'Pass@123');
    logger.info('Entered credentials for no-card user');

    // Step 4: Click login
    await loginPage.clickLogin();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded successfully');

    // Step 5: Verify monthly spend shows $0.00 or N/A
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toMatch(/^(\$0\.00|N\/A)$/);
    logger.info(`Monthly spend shows: ${monthlySpend}`);

    // Step 6: Verify total credit limit shows $0.00 or N/A
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toMatch(/^(\$0\.00|N\/A)$/);
    logger.info(`Total credit limit shows: ${totalCreditLimit}`);

    // Step 7: Verify available credit shows $0.00 or N/A
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toMatch(/^(\$0\.00|N\/A)$/);
    logger.info(`Available credit shows: ${availableCredit}`);

    // Step 8: Verify outstanding amount shows $0.00 or N/A
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toMatch(/^(\$0\.00|N\/A)$/);
    logger.info(`Outstanding amount shows: ${outstandingAmount}`);

    // Step 9: Verify informational message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards are currently registered');
    logger.info('No cards message displayed correctly');

    logger.info('Test Case QE-8971 TS-002 TC-001 completed successfully');
  });

  test('QE-8971 TS-003 TC-001: Verify dashboard displays error message with retry option when backend credit card data service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-8971 TS-003 TC-001 - Backend service unavailable scenario');
    
    // Step 1: Simulate backend service unavailability (mock API failure)
    await page.route('**/api/cards**', route => {
      route.abort('failed');
    });
    logger.info('Simulated backend service unavailability');

    // Step 2: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);
    logger.info('Application login page loaded successfully');

    // Step 3-4: Enter credentials
    await loginPage.login('testuser', 'Pass@123');
    logger.info('Entered valid credentials');

    // Step 5: Click login
    await loginPage.clickLogin();
    logger.info('Clicked login button');

    // Step 6: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('KPI data cannot be loaded');
    expect(errorText).toContain('credit card service is currently unavailable');
    logger.info('Error message displayed correctly');

    // Step 7: Verify retry option is available
    await expect(dashboardPage.retryButton).toBeVisible();
    logger.info('Retry button is visible');

    // Step 8: Restore backend service availability
    await page.unroute('**/api/cards**');
    logger.info('Restored backend service availability');

    // Step 9: Click retry button
    await dashboardPage.clickRetry();
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    logger.info('Dashboard reloaded successfully after retry');

    logger.info('Test Case QE-8971 TS-003 TC-001 completed successfully');
  });
});