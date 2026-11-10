const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

/**
 * Test Suite: Dashboard KPIs and Real-time Refresh
 * Test Cases: TC-7001, TC-7002, TC-7003, TC-7004, TC-7005, TC-7006, TC-7007
 * User Stories: QE-9899 (Consolidated Credit Portfolio Dashboard), QE-9895 (Real-time KPI Data Refresh)
 */

test.describe('Dashboard KPIs - Consolidated Credit Portfolio', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: TC-7001
   * Scenario: QE-9899 TS-001 TC-001
   * Description: Verify dashboard displays aggregated KPIs for user with multiple credit cards within 2 seconds
   */
  test('TC-7001: Verify dashboard displays aggregated KPIs for multiple credit cards within 2 seconds', async ({ page }) => {
    // Step 1: Launch application - handled in beforeEach
    await expect(page).toHaveURL(/login/);

    // Step 2: Log in with valid user credentials who has multiple credit cards
    await loginPage.login('testuser_multicard', 'Test@123');

    // Step 3: Observe dashboard loading time and KPI display
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    // Verify load time is within 2 seconds
    expect(loadTime).toBeLessThan(2000);

    // Verify all KPIs are displayed
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.totalOutstandingKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();

    // Step 4: Verify accuracy of each KPI value
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const totalOutstanding = await dashboardPage.getTotalOutstanding();
    const monthlySpend = await dashboardPage.getMonthlySpend();

    // Expected values based on test data
    expect(totalCreditLimit).toBe('$25,000');
    expect(availableCredit).toBe('$19,000');
    expect(totalOutstanding).toBe('$6,000');
    expect(monthlySpend).toBe('$2,500');

    // Step 5: Verify credit utilization rate is displayed correctly
    const utilizationRate = await dashboardPage.getUtilizationRate();
    expect(utilizationRate).toBe('24%');
  });

  /**
   * Test Case ID: TC-7002
   * Scenario: QE-9899 TS-001 TC-002
   * Description: Verify dashboard KPIs are responsive across desktop, tablet, and mobile devices
   */
  test('TC-7002: Verify dashboard KPIs are responsive across desktop, tablet, and mobile devices', async ({ page }) => {
    // Login
    await loginPage.login('testuser_multicard', 'Test@123');
    await dashboardPage.waitForDashboardLoad();

    // Step 1: Verify desktop layout (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500); // Allow layout to adjust
    
    const desktopLayout = await dashboardPage.getKPILayoutColumns();
    expect(desktopLayout).toBeGreaterThanOrEqual(4); // 4-column layout expected

    // Step 2: Verify tablet layout (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    const tabletLayout = await dashboardPage.getKPILayoutColumns();
    expect(tabletLayout).toBe(2); // 2-column layout expected
    
    // Verify all KPIs are still visible
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();

    // Step 3: Verify mobile layout (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileLayout = await dashboardPage.getKPILayoutColumns();
    expect(mobileLayout).toBe(1); // Single-column layout expected

    // Step 4: Verify KPI values remain accurate across all device sizes
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$25,000');
  });

  /**
   * Test Case ID: TC-7003
   * Scenario: QE-9899 TS-002 TC-001
   * Description: Verify dashboard displays appropriate message when user has no credit cards
   */
  test('TC-7003: Verify dashboard displays appropriate message when user has no credit cards', async ({ page }) => {
    // Step 2: Log in with user who has no credit cards
    await loginPage.login('testuser_nocards', 'Test@123');
    await dashboardPage.waitForDashboardLoad();

    // Step 3: Observe dashboard content
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    expect(noCardsMessage).toContain('No credit cards found');

    // Step 4: Verify KPI panels show zero values or are hidden
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$0');
  });

  /**
   * Test Case ID: TC-7004
   * Scenario: QE-9899 TS-003 TC-001
   * Description: Verify dashboard displays error message when Credit Card Data Service is unavailable
   */
  test('TC-7004: Verify dashboard displays error message when backend service is unavailable', async ({ page }) => {
    // Step 1: Simulate backend service unavailability (handled via mock/intercept)
    await page.route('**/api/cards', route => route.abort('failed'));

    // Step 2: Log in with valid credentials
    await loginPage.login('testuser', 'Test@123');

    // Step 3: Observe dashboard error handling
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load dashboard data');

    // Step 4: Click Refresh button
    await dashboardPage.clickRefreshButton();
    // Verify retry attempt (would need to check network activity or loading state)
  });

  /**
   * Test Case ID: TC-7005
   * Scenario: QE-9895 TS-001 TC-001
   * Description: Verify dashboard automatically refreshes KPIs after new transaction is processed
   */
  test('TC-7005: Verify dashboard automatically refreshes KPIs after new transaction', async ({ page }) => {
    // Step 1: Log in and note initial Monthly Spend
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();

    // Step 2: Note current Monthly Spend KPI value
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(initialMonthlySpend).toBe('$2,500');

    // Step 3: Simulate new transaction processed (mock API to return updated value)
    await page.route('**/api/transactions/monthly', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ totalSpend: 2600 })
      });
    });

    // Step 4: Wait for automatic refresh interval (5 minutes simulated by triggering refresh)
    await dashboardPage.waitForAutoRefresh(5000); // Wait 5 seconds for test purposes

    // Step 5: Verify Monthly Spend updates to $2,600
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(updatedMonthlySpend).toBe('$2,600');
  });

  /**
   * Test Case ID: TC-7006
   * Scenario: QE-9895 TS-002 TC-001
   * Description: Verify dashboard retains last loaded KPI data when Transaction Service fails during refresh
   */
  test('TC-7006: Verify dashboard retains last KPI data when service fails during refresh', async ({ page }) => {
    // Step 1: Log in and load dashboard
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();

    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(initialMonthlySpend).toBe('$2,500');

    // Step 2: Simulate Transaction Service failure
    await page.route('**/api/transactions/monthly', route => route.abort('failed'));

    // Step 3: Wait for scheduled refresh to trigger
    await dashboardPage.waitForAutoRefresh(5000);

    // Step 4: Verify dashboard retains last loaded data and displays warning
    const retainedMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(retainedMonthlySpend).toBe('$2,500');

    const warningMessage = await dashboardPage.getWarningMessage();
    expect(warningMessage).toContain('Data may not be current');
  });

  /**
   * Test Case ID: TC-7007
   * Scenario: QE-9895 TS-003 TC-001
   * Description: Verify manual refresh button updates KPIs within 2 seconds
   */
  test('TC-7007: Verify manual refresh button updates KPIs within 2 seconds', async ({ page }) => {
    // Step 1: Log in and load dashboard
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();

    // Step 2: Note current KPI values
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(initialMonthlySpend).toBe('$2,500');

    // Step 3: Click Refresh button
    const startTime = Date.now();
    await dashboardPage.clickRefreshButton();

    // Step 4: Measure time taken for KPIs to update
    await dashboardPage.waitForDashboardLoad();
    const refreshTime = Date.now() - startTime;
    expect(refreshTime).toBeLessThan(2000);

    // Step 5: Verify all KPIs reflect latest data
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  });
});
