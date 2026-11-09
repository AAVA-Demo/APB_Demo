const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Tests - QE-9013', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Starting Dashboard KPI test');
  });

  test('QE-9013 TS-001 TC-001 - Verify all dashboard KPIs load within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-9013 TS-001 TC-001');
    
    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Credit Card Dashboard/);
    logger.info('Application launched successfully');

    // Step 2-3: Login with valid credentials
    await loginPage.login('testuser@example.com', 'Test@1234');
    logger.info('User logged in successfully');

    // Step 4-9: Verify all KPIs load within 2 seconds
    const startTime = Date.now();
    
    await dashboardPage.waitForDashboardLoad();
    
    // Verify Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    expect(monthlySpend).toBe('$5,234.56');
    logger.info(`Monthly Spend KPI verified: ${monthlySpend}`);

    // Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    expect(totalCreditLimit).toBe('$50,000.00');
    logger.info(`Total Credit Limit KPI verified: ${totalCreditLimit}`);

    // Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    expect(availableCredit).toBe('$30,765.44');
    logger.info(`Available Credit KPI verified: ${availableCredit}`);

    // Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    expect(outstandingAmount).toBe('$19,234.56');
    logger.info(`Outstanding Amount KPI verified: ${outstandingAmount}`);

    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    
    expect(loadTime).toBeLessThanOrEqual(2);
    logger.info(`All KPIs loaded in ${loadTime} seconds`);
  });

  test('QE-9013 TS-002 TC-001 - Verify error indicators for unavailable KPI data sources', async ({ page }) => {
    logger.info('Test Case: QE-9013 TS-002 TC-001');
    
    // Step 1-3: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    logger.info('User logged in successfully');

    // Step 4: Simulate Monthly Spend data unavailability via API mock
    await page.route('**/dashboard/kpis/monthly-spend', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    logger.info('Simulated Monthly Spend API unavailability');

    // Step 5: Observe dashboard KPI display
    await dashboardPage.waitForDashboardLoad();

    // Step 6: Verify Monthly Spend KPI shows error indicator
    await expect(dashboardPage.monthlySpendErrorIndicator).toBeVisible();
    const errorMessage = await dashboardPage.getMonthlySpendErrorMessage();
    expect(errorMessage).toContain('Data temporarily unavailable');
    await expect(dashboardPage.monthlySpendRetryButton).toBeVisible();
    logger.info('Monthly Spend error indicator verified');

    // Step 7-9: Verify other KPIs display successfully
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$50,000.00');
    logger.info('Total Credit Limit KPI displays correctly');

    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$30,765.44');
    logger.info('Available Credit KPI displays correctly');

    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$19,234.56');
    logger.info('Outstanding Amount KPI displays correctly');
  });

  test('QE-9013 TS-003 TC-001 - Verify KPI performance with large dataset (10 cards, 500 transactions)', async ({ page }) => {
    logger.info('Test Case: QE-9013 TS-003 TC-001');
    
    // Step 1-3: Launch and login with large dataset user
    await loginPage.navigate();
    await loginPage.login('largedatauser@example.com', 'Test@1234');
    logger.info('Large dataset user logged in successfully');

    // Step 4-9: Verify all KPIs load within 2 seconds despite large dataset
    const startTime = Date.now();
    
    await dashboardPage.waitForDashboardLoad();
    
    // Verify aggregated Monthly Spend from 500 transactions
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    expect(monthlySpend).toBe('$25,678.90');
    logger.info(`Aggregated Monthly Spend verified: ${monthlySpend}`);

    // Verify aggregated Total Credit Limit from 10 cards
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    expect(totalCreditLimit).toBe('$150,000.00');
    logger.info(`Aggregated Total Credit Limit verified: ${totalCreditLimit}`);

    // Verify calculated Available Credit
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    expect(availableCredit).toBe('$95,321.10');
    logger.info(`Calculated Available Credit verified: ${availableCredit}`);

    // Verify aggregated Outstanding Amount from 10 cards
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    expect(outstandingAmount).toBe('$54,678.90');
    logger.info(`Aggregated Outstanding Amount verified: ${outstandingAmount}`);

    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    
    expect(loadTime).toBeLessThanOrEqual(2);
    logger.info(`All KPIs loaded in ${loadTime} seconds with large dataset`);
  });
});
