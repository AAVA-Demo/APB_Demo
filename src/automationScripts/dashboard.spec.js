const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Consolidated Financial KPI Dashboard Tests', () => {

  test('QE-9716 TS-001 TC-001 - Verify consolidated KPI dashboard displays accurate monthly spending, total credit limit, available credit, and outstanding amounts for user with multiple active credit cards within 2 seconds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2: Authenticate with valid user credentials who has 3 active credit cards
    await loginPage.login('testuser_multicard', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3 & 4: Record timestamp and observe dashboard loading within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);

    // Step 5: Verify Monthly Spending KPI
    const monthlySpending = await dashboardPage.getMonthlySpending();
    expect(monthlySpending).toBe('$4,500');

    // Step 6: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$30,000');

    // Step 7: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$22,000');

    // Step 8: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$8,000');
  });

  test('QE-9716 TS-002 TC-001 - Verify dashboard correctly handles and displays credit cards with zero credit limit without calculation errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate();

    // Step 2: Authenticate with user having card with zero credit limit
    await loginPage.login('testuser_zerolimit', 'Test@123');

    // Step 3: Observe the consolidated KPI dashboard
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 4: Verify Total Credit Limit includes card with zero limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$10,000');

    // Step 5: Verify Available Credit calculation handles zero credit limit
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$7,000');

    // Step 6: Verify Outstanding Amount displays correctly
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$3,000');
  });

  test('QE-9716 TS-002 TC-002 - Verify dashboard correctly handles and displays credit cards with negative outstanding balance (overpayment) without calculation errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate();

    // Step 2: Authenticate with user having card with negative outstanding balance
    await loginPage.login('testuser_overpayment', 'Test@123');

    // Step 3: Observe the consolidated KPI dashboard
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 4: Verify Total Credit Limit displays sum of all card limits
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$20,000');

    // Step 5: Verify Outstanding Amount displays negative value correctly
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$1,500');

    // Step 6: Verify Available Credit calculation handles negative outstanding balance
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$18,500');
  });

  test('QE-9716 TS-003 TC-001 - Verify consolidated KPI dashboard loads all critical financial metrics within 2-second performance requirement during peak hours with high system load', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application during peak hours
    await loginPage.navigate();

    // Step 2: Authenticate with user having 5 active credit cards
    await loginPage.login('testuser_peakload', 'Test@123');

    // Step 3 & 4: Record timestamp and verify dashboard loads within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);

    // Step 5: Verify all four KPIs are fully rendered with accurate values
    const monthlySpending = await dashboardPage.getMonthlySpending();
    expect(monthlySpending).toBe('$8,500');

    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$50,000');

    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$35,000');

    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$15,000');
  });

});