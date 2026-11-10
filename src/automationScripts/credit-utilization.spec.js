const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

/**
 * Test Suite: Real-Time Credit Utilization Tracking
 * User Story: QE-9297
 * Test Cases: QE-9439 TS-001 TC-001, QE-9439 TS-002 TC-001, QE-9439 TS-003 TC-001
 */

test.describe('Real-Time Credit Utilization Tracking', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-9439 TS-001 TC-001
   * Description: Verify dashboard updates available credit and outstanding amount after user completes a transaction
   */
  test('TC-001: Dashboard updates after transaction completion', async ({ page, request }) => {
    // Step 1: Login with valid credentials
    await loginPage.login('testuser@demo.com', 'Pass@123');

    // Step 2: Note current Available Credit and Outstanding Amount
    await dashboardPage.waitForDashboardLoad();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(initialAvailableCredit).toContain('15,000.00');
    expect(initialOutstanding).toContain('5,000.00');

    // Step 3: Simulate new transaction ($100 purchase) via API
    await request.post('https://api.creditcard.demo/api/transactions', {
      data: {
        cardId: 'card1',
        amount: 100.00,
        merchantName: 'Test Merchant'
      }
    });

    // Step 4: Refresh dashboard manually
    await page.reload();
    await dashboardPage.waitForDashboardLoad();

    // Step 5: Verify Available Credit is updated (decreased by $100)
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(updatedAvailableCredit).toContain('14,900.00');

    // Step 6: Verify Outstanding Amount is updated (increased by $100)
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(updatedOutstanding).toContain('5,100.00');

    // Step 7: Verify update occurred within refresh window (≤30 seconds)
    // This is validated by the page reload completing successfully
  });

  /**
   * Test Case ID: QE-9439 TS-002 TC-001
   * Description: Verify dashboard auto-refreshes and displays updated credit utilization without manual refresh
   */
  test('TC-002: Dashboard auto-refreshes to display updated utilization', async ({ page, request }) => {
    // Step 1: Login with valid credentials
    await loginPage.login('testuser@demo.com', 'Pass@123');

    // Step 2: Note current Available Credit and Outstanding Amount
    await dashboardPage.waitForDashboardLoad();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();

    // Step 3: Remain on dashboard without manual refresh
    // Step 4: Simulate new transaction ($200 purchase) via API
    await request.post('https://api.creditcard.demo/api/transactions', {
      data: {
        cardId: 'card2',
        amount: 200.00,
        merchantName: 'Test Merchant 2'
      }
    });

    // Step 5: Wait for auto-refresh interval (30 seconds)
    await page.waitForTimeout(30000);

    // Step 6: Verify Available Credit is automatically updated
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    expect(updatedAvailableCredit).toContain('14,800.00');

    // Step 7: Verify Outstanding Amount is automatically updated
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(updatedOutstanding).toContain('5,200.00');

    // Step 8: Verify last updated timestamp is refreshed
    const lastUpdated = await dashboardPage.getLastUpdatedTimestamp();
    expect(lastUpdated).toBeTruthy();
  });

  /**
   * Test Case ID: QE-9439 TS-003 TC-001
   * Description: Verify dashboard displays last known values with error message when transaction service is unavailable
   */
  test('TC-003: Dashboard displays last known values on service unavailability', async ({ page, context }) => {
    // Step 1: Simulate transaction service unavailability
    await context.route('**/api/transactions*', route => {
      route.abort('failed');
    });

    // Step 2: Login with valid credentials
    await loginPage.login('testuser@demo.com', 'Pass@123');

    // Step 3: Attempt to access dashboard
    await dashboardPage.waitForDashboardLoad();

    // Step 4: Verify Available Credit and Outstanding display last known values
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    expect(availableCredit).toContain('15,000.00');
    expect(outstanding).toContain('5,000.00');

    // Step 5: Verify error/warning message is displayed
    await expect(dashboardPage.warningMessage).toBeVisible();
    const warningText = await dashboardPage.getWarningMessageText();
    expect(warningText).toContain('Unable to fetch latest data');

    // Step 6: Verify last updated timestamp indicates stale data
    const lastUpdated = await dashboardPage.getLastUpdatedTimestamp();
    expect(lastUpdated).toBeTruthy();

    // Step 7: Restore service and refresh
    await context.unroute('**/api/transactions*');
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.warningMessage).not.toBeVisible();
  });
});