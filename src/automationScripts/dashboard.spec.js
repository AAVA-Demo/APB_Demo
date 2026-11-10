const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

// Test Case ID: QE-9545 TS-001 TC-001
test.describe('Dashboard KPI Display - QE-9545', () => {
  test('TC-001: Verify authenticated user can view consolidated KPIs within 2 seconds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2-3: Authenticate and verify dashboard loads within 2 seconds
    const startTime = Date.now();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);

    // Step 4: Verify Monthly Spend KPI
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();

    // Step 5: Verify Total Credit Limit KPI
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalLimit).toBeTruthy();

    // Step 6: Verify Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeTruthy();

    // Step 7: Verify Total Outstanding KPI
    await expect(dashboardPage.totalOutstandingKPI).toBeVisible();
    const totalOutstanding = await dashboardPage.getTotalOutstandingValue();
    expect(totalOutstanding).toBeTruthy();

    // Step 8: Verify all KPIs are calculated correctly
    await dashboardPage.verifyKPICalculations();
  });

  // Test Case ID: QE-9545 TS-002 TC-001
  test('TC-002: Verify system denies dashboard access without authentication', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Step 2: Attempt direct dashboard access
    await dashboardPage.navigateDirectly();

    // Step 3-4: Verify redirect to login and authentication error
    await expect(page).toHaveURL(/login/);
    await dashboardPage.verifyAuthenticationError();
  });

  // Test Case ID: QE-9545 TS-003 TC-001
  test('TC-003: Verify error message when backend service unavailable', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Mock backend service failure
    await context.route('**/api/cards', route => route.abort());
    await context.route('**/api/transactions/monthly', route => route.abort());

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 4-6: Verify error message displayed
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('could not be loaded');
  });
});

// Test Case ID: QE-9375 - Multiple Credit Card View
test.describe('Multiple Credit Card View - QE-9375', () => {
  // Test Case ID: QE-9542 TS-001 TC-001
  test('TC-001: Verify user can view consolidated table with multiple cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 3: Verify credit card table is displayed
    await expect(dashboardPage.creditCardTable).toBeVisible();

    // Step 4-9: Verify card details
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < cardCount; i++) {
      await dashboardPage.verifyCardRowData(i);
    }

    // Step 10: Verify responsive layout
    await dashboardPage.verifyResponsiveLayout(page);
  });

  // Test Case ID: QE-9542 TS-002 TC-001
  test('TC-002: Verify message when user has zero credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1-2: Launch and authenticate with no-cards user
    await loginPage.navigate();
    await loginPage.login('nocards@example.com', 'Test@1234');

    // Step 3-4: Verify empty state message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toContain('No credit cards');
  });

  // Test Case ID: QE-9542 TS-003 TC-001
  test('TC-003: Verify partial data display with warning on service failure', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Mock partial service failure
    let callCount = 0;
    await context.route('**/api/cards', route => {
      callCount++;
      if (callCount === 1) {
        route.fulfill({
          status: 200,
          body: JSON.stringify([{cardId: 'c1', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 50000, outstandingAmount: 12000}])
        });
      }
    });

    // Step 1-2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');

    // Step 5-6: Verify partial data and warning
    await expect(dashboardPage.creditCardTable).toBeVisible();
    await expect(dashboardPage.warningMessage).toBeVisible();
    const warningText = await dashboardPage.getWarningMessageText();
    expect(warningText).toMatch(/partial|incomplete/i);
  });
});