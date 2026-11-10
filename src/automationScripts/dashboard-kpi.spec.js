const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

/**
 * Test Suite: Dashboard KPI Overview Display
 * User Story: QE-9294
 * Test Cases: QE-9442 TS-001 TC-001, QE-9442 TS-002 TC-001, QE-9442 TS-003 TC-001
 */

test.describe('Dashboard KPI Overview Display', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-9442 TS-001 TC-001
   * Description: Verify dashboard KPI overview loads with responsive layout within 2 seconds on desktop viewport
   */
  test('TC-001: Dashboard loads with responsive layout within 2 seconds on desktop', async ({ page }) => {
    // Step 1: Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Step 2: Login with valid credentials
    await loginPage.login('testuser@demo.com', 'SecurePass@123');

    // Step 3: Verify dashboard loads within 2 seconds with 4 KPI cards
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);

    // Step 4: Verify all 4 KPI cards are visible
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();

    // Step 5: Verify KPI cards display currency format
    const monthlySpendText = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendText).toMatch(/\$[\d,]+\.\d{2}/);

    // Step 6: Test responsive layout - Tablet viewport (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Allow layout reflow
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();

    // Step 7: Test responsive layout - Mobile viewport (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow layout reflow
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
  });

  /**
   * Test Case ID: QE-9442 TS-002 TC-001
   * Description: Verify dashboard correctly aggregates total credit limit across multiple credit cards
   */
  test('TC-002: Dashboard aggregates total credit limit across multiple cards', async ({ page }) => {
    // Step 1: Login with multi-card user
    await loginPage.login('multicard_user@demo.com', 'Pass@123');

    // Step 2: Navigate to dashboard
    await dashboardPage.waitForDashboardLoad();

    // Step 3: Verify Total Credit Limit KPI displays $22,500.00
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toContain('22,500.00');

    // Step 4: Verify Total Outstanding Amount displays $7,000.00
    const totalOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(totalOutstanding).toContain('7,000.00');

    // Step 5: Verify Available Credit displays $15,500.00
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toContain('15,500.00');

    // Step 6: Verify Monthly Spend displays aggregated value
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toMatch(/\$[\d,]+\.\d{2}/);
  });

  /**
   * Test Case ID: QE-9442 TS-003 TC-001
   * Description: Verify dashboard displays error message when credit card data service experiences timeout
   */
  test('TC-003: Dashboard displays error message on service timeout', async ({ page, context }) => {
    // Step 1: Simulate service timeout by aborting API requests
    await context.route('**/api/cards', route => {
      setTimeout(() => route.abort(), 6000); // Simulate 6 second delay
    });

    // Step 2: Login with valid credentials
    await loginPage.login('testuser@demo.com', 'Pass@123');

    // Step 3: Verify loading state displays for more than 2 seconds
    await expect(dashboardPage.loadingSpinner).toBeVisible({ timeout: 3000 });

    // Step 4: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible({ timeout: 10000 });
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Failed to load dashboard data');

    // Step 5: Verify Retry button is present
    await expect(dashboardPage.retryButton).toBeVisible();

    // Step 6: Clear route and click Retry
    await context.unroute('**/api/cards');
    await dashboardPage.clickRetryButton();

    // Step 7: Verify dashboard loads successfully after retry
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
  });
});