const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Real-Time Credit Utilization Tracking (QE-9366)
 * User Story: Real-Time Credit Utilization Tracking
 * Epic: CreditCardNew20261110203156-Dashboard KPIs and Credit Overview
 */

test.describe('Real-Time Credit Utilization Tracking - QE-9366', () => {

  test('QE-9366 TS-001 TC-001: Verify dashboard KPIs update in real-time within 3 seconds after a new transaction', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the Credit Card Dashboard application
    await loginPage.navigate('https://creditcard-dashboard.example.com');

    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser_realtime', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Note the current KPI values
    const initialOutstanding = await dashboardPage.getOutstandingBalance();
    const initialAvailable = await dashboardPage.getAvailableCredit();
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(initialOutstanding).toBe('$2,000');
    expect(initialAvailable).toBe('$8,000');
    expect(initialMonthlySpend).toBe('$1,500');

    // Step 4: Simulate a new transaction of $300 being processed
    await dashboardPage.simulateTransaction(300, 'Visa Platinum');

    // Step 5: Wait and observe the dashboard for automatic updates (within 3 seconds)
    await page.waitForTimeout(3000);

    // Step 6: Verify updated KPI values
    const updatedOutstanding = await dashboardPage.getOutstandingBalance();
    const updatedAvailable = await dashboardPage.getAvailableCredit();
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(updatedOutstanding).toBe('$2,300');
    expect(updatedAvailable).toBe('$7,700');
    expect(updatedMonthlySpend).toBe('$1,800');
  });

  test('QE-9366 TS-001 TC-002: Verify KPI update accuracy for multiple concurrent transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate('https://creditcard-dashboard.example.com');
    await loginPage.login('testuser_realtime', 'Pass@123');

    expect(await dashboardPage.getOutstandingBalance()).toBe('$2,000');
    expect(await dashboardPage.getAvailableCredit()).toBe('$8,000');
    expect(await dashboardPage.getMonthlySpend()).toBe('$1,500');

    await dashboardPage.simulateTransaction(300, 'Visa Platinum');
    await dashboardPage.simulateTransaction(200, 'MasterCard Gold');

    await page.waitForTimeout(3000);

    expect(await dashboardPage.getOutstandingBalance()).toBe('$2,500');
    expect(await dashboardPage.getAvailableCredit()).toBe('$7,500');
    expect(await dashboardPage.getMonthlySpend()).toBe('$2,000');
  });
});
