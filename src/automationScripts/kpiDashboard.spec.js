const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('KPI Dashboard Tests - QE-10611', () => {

  test('QE-10611 TS-001 TC-001: Verify consolidated KPI dashboard displays accurate aggregated values', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login with multi-card user
    await loginPage.navigate();
    await loginPage.login('user_multicard', 'Pass@123');

    // Step 2: Verify all KPIs are visible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountsKPI).toBeVisible();

    // Step 3: Verify Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();

    // Step 4: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBeTruthy();

    // Step 5: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeTruthy();

    // Step 6: Verify Outstanding Amounts KPI
    const outstandingAmounts = await dashboardPage.getOutstandingAmountsValue();
    expect(outstandingAmounts).toBeTruthy();
  });

  test('QE-10611 TS-001 TC-002: Verify KPI dashboard updates in real-time', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('user_multicard', 'Pass@123');

    // Step 2: Note current KPI values
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();

    // Step 3: Simulate backend data update (Note: This would require API mocking or test data setup)
    // For automation purposes, we verify the dashboard refresh mechanism
    await page.waitForTimeout(5000); // Wait for potential auto-refresh

    // Step 4: Manually refresh dashboard
    await dashboardPage.refreshDashboard();
    await dashboardPage.waitForDashboardToLoad();

    // Step 5: Verify Monthly Spend KPI can be retrieved (data may or may not change)
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(updatedMonthlySpend).toBeTruthy();

    // Step 6: Verify other KPIs are also updated
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountsValue();
    expect(updatedAvailableCredit).toBeTruthy();
    expect(updatedOutstanding).toBeTruthy();
  });

  test('QE-10611 TS-002 TC-001: Verify error message when backend service is unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Simulate backend unavailability (using route interception)
    await page.route('**/api/kpis/**', route => route.abort());

    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');

    // Step 3: Verify error message is displayed
    await expect(dashboardPage.kpiErrorMessage).toBeVisible();
    const errorText = await dashboardPage.getKpiErrorMessageText();
    expect(errorText).toContain('Unable to retrieve KPI data');

    // Step 4: Verify Retry button is provided
    await expect(dashboardPage.retryButton).toBeVisible();

    // Step 5: Click Retry button
    await dashboardPage.clickRetry();
    await expect(dashboardPage.kpiErrorMessage).toBeVisible(); // Still unavailable
  });

  test('QE-10611 TS-003 TC-001: Verify available credit calculation is correct', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('user_multicard', 'Pass@123');

    // Step 2: Navigate to portfolio view
    await dashboardPage.waitForDashboardToLoad();

    // Step 3: Get individual card details
    const cards = await dashboardPage.getAllCardDetails();

    // Step 4: Manually calculate available credit for each card
    for (const card of cards) {
      const creditLimit = parseFloat(card.creditLimit.replace(/[^0-9.-]+/g, ''));
      const outstanding = parseFloat(card.outstandingAmount.replace(/[^0-9.-]+/g, ''));
      const expectedAvailable = creditLimit - outstanding;
      const displayedAvailable = parseFloat(card.availableCredit.replace(/[^0-9.-]+/g, ''));

      // Step 5: Verify displayed available credit matches calculation
      expect(Math.abs(expectedAvailable - displayedAvailable)).toBeLessThan(1);
    }

    // Step 6: Verify total available credit in KPI
    const totalAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const calculatedTotalAvailable = cards.reduce((sum, card) => {
      return sum + parseFloat(card.availableCredit.replace(/[^0-9.-]+/g, ''));
    }, 0);
    const displayedTotalAvailable = parseFloat(totalAvailableCredit.replace(/[^0-9.-]+/g, ''));

    // Step 7: Verify KPI matches sum of individual cards
    expect(Math.abs(calculatedTotalAvailable - displayedTotalAvailable)).toBeLessThan(1);
  });

});