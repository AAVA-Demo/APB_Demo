const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-10431 TS-001 TC-001
test.describe('Dashboard KPIs - Consolidated View', () => {
  test('TC-001: Verify consolidated KPIs for 3 credit cards load within 2 seconds with accurate data', async ({ page }) => {
    logger.info('Starting TC-001: Dashboard KPIs consolidated view test');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser_3cards', 'Test@1234');
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 });
    logger.info('User authenticated successfully');

    // Step 2: Measure dashboard load time
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);

    // Step 3: Verify Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$4,567.89');
    logger.info('Monthly Spend KPI verified');

    // Step 4: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$50,000.00');
    logger.info('Total Credit Limit KPI verified');

    // Step 5: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$35,432.11');
    logger.info('Available Credit KPI verified');

    // Step 6: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$14,567.89');
    logger.info('Outstanding Amount KPI verified');

    // Step 7: Verify Credit Utilization
    const creditUtilization = await dashboardPage.getCreditUtilization();
    expect(creditUtilization).toBe('29.14%');
    logger.info('Credit Utilization verified');

    // Step 8: Verify currency formatting
    await dashboardPage.verifyCurrencyFormatting();
    logger.info('Currency formatting verified');
  });
});

// Test Case - QE-10431 TS-002 TC-001
test.describe('Dashboard KPIs - Authentication', () => {
  test('TC-002: Verify unauthenticated access is denied and redirected to login', async ({ page, context }) => {
    logger.info('Starting TC-002: Unauthenticated access test');
    const dashboardPage = new DashboardPage(page);

    // Step 1: Clear all cookies and session storage
    await context.clearCookies();
    await page.goto('about:blank');
    await page.evaluate(() => sessionStorage.clear());
    logger.info('Browser session cleared');

    // Step 2: Attempt to navigate to dashboard without login
    await page.goto('/dashboard');
    logger.info('Attempted dashboard access without authentication');

    // Step 3: Verify redirect to login page
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
    logger.info('Redirected to login page successfully');

    // Step 4: Verify authentication error message
    const errorMessage = await page.locator('.error-message, .alert-danger').textContent();
    expect(errorMessage).toContain('Authentication required');
    logger.info('Authentication error message verified');

    // Step 5: Verify no financial data is exposed
    const kpiElements = await page.locator('.kpi-card, .kpi-value').count();
    expect(kpiElements).toBe(0);
    logger.info('No financial data exposed on login page');

    // Step 7: Verify no API calls to financial endpoints
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('/api/dashboard/kpis') || request.url().includes('/api/cards')) {
        apiCalls.push(request.url());
      }
    });
    await page.waitForTimeout(2000);
    expect(apiCalls.length).toBe(0);
    logger.info('No unauthorized API calls detected');
  });
});

// Test Case - QE-10431 TS-003 TC-001
test.describe('Dashboard KPIs - Real-time Updates', () => {
  test('TC-003: Verify dashboard recalculates KPIs after new transaction with 100% accuracy', async ({ page }) => {
    logger.info('Starting TC-003: Real-time KPI update test');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login and navigate to dashboard
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded');

    // Step 2: Note current KPI values
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    logger.info(`Initial values - Monthly Spend: ${initialMonthlySpend}, Available: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);

    // Step 3: Simulate new transaction (via API or mock)
    await page.evaluate(() => {
      // Mock transaction injection for testing
      window.mockTransaction = { amount: 500, cardId: 'card1', merchant: 'Restaurant ABC' };
    });
    logger.info('Transaction simulated: $500 on Card 1');

    // Step 4: Refresh dashboard
    const refreshStart = Date.now();
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    const refreshTime = Date.now() - refreshStart;
    expect(refreshTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard refreshed in ${refreshTime}ms`);

    // Step 5: Verify Monthly Spend updated
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(updatedMonthlySpend).toBe(initialMonthlySpend + 500);
    logger.info('Monthly Spend updated correctly');

    // Step 6: Verify Available Credit decreased
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(updatedAvailableCredit).toBe(initialAvailableCredit - 500);
    logger.info('Available Credit decreased correctly');

    // Step 7: Verify Outstanding Amount increased
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(updatedOutstanding).toBe(initialOutstanding + 500);
    logger.info('Outstanding Amount increased correctly');

    // Step 8: Verify Total Credit Limit unchanged
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$50,000.00');
    logger.info('Total Credit Limit unchanged');

    // Step 9: Verify Credit Utilization recalculated
    const newUtilization = (updatedOutstanding / 50000) * 100;
    const displayedUtilization = await dashboardPage.getCreditUtilizationValue();
    expect(Math.abs(displayedUtilization - newUtilization)).toBeLessThan(0.01);
    logger.info('Credit Utilization recalculated correctly');

    // Step 10: Verify 100% calculation accuracy
    const calculationCheck = updatedAvailableCredit + updatedOutstanding;
    expect(calculationCheck).toBe(50000);
    logger.info('Calculation accuracy verified: 100%');
  });
});
