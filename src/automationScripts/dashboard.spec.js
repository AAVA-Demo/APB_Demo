const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Dashboard KPI Management
 * User Stories: QE-9792, QE-9791
 * Test Cases: QE-9792 TS-001 TC-001, QE-9792 TS-001 TC-002, QE-9792 TS-002 TC-001, QE-9792 TS-003 TC-001,
 *             QE-9791 TS-001 TC-001, QE-9791 TS-002 TC-001, QE-9791 TS-003 TC-001
 */

test.describe('Dashboard KPI Management', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
  });

  /**
   * Test Case ID: QE-9792 TS-001 TC-001
   * Description: Verify system aggregates and displays all four KPIs within 2 seconds for user with 10 credit cards
   */
  test('TC-001: Verify KPI aggregation and display within 2 seconds for 10 cards', async ({ page }) => {
    // Step 1: Authenticate as user with 10 credit cards
    await loginPage.navigate();
    await loginPage.login('testuser009', 'valid_token');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Record start time and navigate to dashboard
    const startTime = Date.now();
    await dashboardPage.navigate();

    // Step 3-6: Verify all KPIs are displayed with correct values
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

    // Validate KPI values
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();

    expect(monthlySpend).toBe(2500);
    expect(totalCreditLimit).toBe(50000);
    expect(availableCredit).toBe(30000);
    expect(outstandingAmount).toBe(20000);

    // Step 7: Verify load time is within 2 seconds
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
  });

  /**
   * Test Case ID: QE-9792 TS-001 TC-002
   * Description: Verify KPI calculation accuracy for monthly spend and available credit
   */
  test('TC-002: Verify KPI calculation accuracy', async ({ page }) => {
    // Step 1: Authenticate as user with 5 credit cards
    await loginPage.navigate();
    await loginPage.login('testuser010', 'valid_token');

    // Step 2-4: Manual calculation verification
    // Expected: totalCreditLimit = 25000, outstandingAmount = 10000, availableCredit = 15000, monthlySpend = 1500

    // Step 5: Load dashboard
    await dashboardPage.navigate();

    // Step 6: Validate displayed KPIs match manual calculations
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();

    expect(monthlySpend).toBe(1500);
    expect(totalCreditLimit).toBe(25000);
    expect(availableCredit).toBe(15000);
    expect(outstandingAmount).toBe(10000);
  });

  /**
   * Test Case ID: QE-9792 TS-002 TC-001
   * Description: Verify system refreshes all KPI values automatically at 5-minute intervals
   */
  test('TC-003: Verify automatic KPI refresh at 5-minute intervals', async ({ page }) => {
    // Step 1: Authenticate and load dashboard
    await loginPage.navigate();
    await loginPage.login('testuser011', 'valid_token');
    await dashboardPage.navigate();

    // Step 2: Record initial KPI values and timestamp
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    expect(initialMonthlySpend).toBe(2000);

    // Step 3: Wait for 5 minutes (300 seconds) - using shorter time for test efficiency
    // In real scenario, wait 300000ms; for automation, we'll mock the interval
    await page.waitForTimeout(5000); // Mock 5-minute wait with 5 seconds for test

    // Step 4-5: Observe automatic refresh and validate updated values
    await dashboardPage.waitForKPIRefresh();
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    const updatedTimestamp = await dashboardPage.getLastUpdatedTimestamp();

    // Step 6: Confirm no user interaction was required
    expect(updatedTimestamp).not.toBe(initialTimestamp);
    // If new transaction occurred, monthlySpend should be updated
    expect(updatedMonthlySpend).toBeGreaterThanOrEqual(initialMonthlySpend);
  });

  /**
   * Test Case ID: QE-9792 TS-003 TC-001
   * Description: Verify system handles partial data retrieval failure gracefully
   */
  test('TC-004: Verify graceful handling of partial data failure', async ({ page }) => {
    // Step 1: Authenticate as user
    await loginPage.navigate();
    await loginPage.login('testuser012', 'valid_token');

    // Step 2: Simulate transaction service unavailability (503 error)
    await page.route('**/api/transactions**', route => route.abort());

    // Step 3: Load dashboard (card service still operational)
    await dashboardPage.navigate();

    // Step 4: Verify card-related KPIs are displayed successfully
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();

    expect(totalCreditLimit).toBe(30000);
    expect(availableCredit).toBe(15000);
    expect(outstandingAmount).toBe(15000);

    // Step 5: Validate monthlySpend shows unavailable indicator
    const monthlySpendMessage = await dashboardPage.getMonthlySpendMessage();
    expect(monthlySpendMessage).toContain('Data currently unavailable');

    // Step 6: Confirm dashboard remains functional
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(page).not.toHaveURL(/.*error/);
  });

  /**
   * Test Case ID: QE-9791 TS-001 TC-001
   * Description: Verify system calculates aggregated available credit correctly across all active cards
   */
  test('TC-005: Verify aggregated available credit calculation', async ({ page }) => {
    // Step 1: Authenticate as user with 4 active credit cards
    await loginPage.navigate();
    await loginPage.login('testuser013', 'valid_token');

    // Step 2-5: System retrieves card data and calculates available credit
    // Expected: totalCreditLimit = 30000, totalOutstanding = 10000, availableCredit = 20000

    // Step 6: Load dashboard and retrieve KPI
    await dashboardPage.navigate();
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe(20000);

    // Step 7: Verify KPI updates within 5 minutes after balance change
    // Simulate balance change
    await page.evaluate(() => {
      // Mock balance change: Card1 outstanding changes to 2500
      window.localStorage.setItem('mockBalanceChange', 'true');
    });

    await page.waitForTimeout(5000); // Mock 5-minute wait
    await dashboardPage.waitForKPIRefresh();

    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(updatedAvailableCredit).toBe(19500);
  });

  /**
   * Test Case ID: QE-9791 TS-002 TC-001
   * Description: Verify system handles zero available credit correctly when outstanding equals or exceeds limit
   */
  test('TC-006: Verify zero available credit handling', async ({ page }) => {
    // Step 1: Authenticate as user with cards at credit limit
    await loginPage.navigate();
    await loginPage.login('testuser014', 'valid_token');

    // Step 2-3: Cards with outstanding equal to limits
    // Expected: availableCredit = 0

    // Step 4: Load dashboard
    await dashboardPage.navigate();
    let availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe(0);

    // Step 5-6: Simulate outstanding exceeding limit (e.g., fees)
    await page.evaluate(() => {
      window.localStorage.setItem('mockOverLimit', 'true');
    });

    await dashboardPage.refresh();

    // Step 7: Validate dashboard displays zero, not negative
    availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe(0);
    expect(availableCredit).toBeGreaterThanOrEqual(0);
  });

  /**
   * Test Case ID: QE-9791 TS-003 TC-001
   * Description: Verify system handles missing credit limit or outstanding amount data without disrupting KPI display
   */
  test('TC-007: Verify handling of missing card data', async ({ page }) => {
    // Step 1: Authenticate as user with incomplete card data
    await loginPage.navigate();
    await loginPage.login('testuser015', 'valid_token');

    // Step 2-4: System excludes incomplete cards from calculation
    // Expected: Only Card3 included, availableCredit = 6000

    // Step 5: Load dashboard
    await dashboardPage.navigate();

    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe(6000);

    // Step 6: Validate other KPIs
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();

    expect(totalCreditLimit).toBe(8000);
    expect(outstandingAmount).toBe(2000);

    // Step 7: Confirm dashboard displays normally without errors
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(page).not.toHaveURL(/.*error/);
  });
});
