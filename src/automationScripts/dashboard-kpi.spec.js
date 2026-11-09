const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Management', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('QE-9019 TS-001 TC-001 - Verify consolidated KPIs display correctly for user with multiple active credit cards', async ({ page }) => {
    // Step 2: Log in with user credentials who has 3 active credit cards
    await loginPage.login('testuser_multicard', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Verify Total Credit Limit KPI is displayed
    await dashboardPage.waitForKpiToLoad();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toContain('35,000');

    // Step 4: Verify Total Available Credit KPI is displayed
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toContain('27,500');

    // Step 5: Verify Total Outstanding Amount KPI is displayed
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toContain('7,500');

    // Step 6: Verify Monthly Spend Aggregate KPI is displayed
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toContain('3,200');

    // Step 7: Verify Credit Utilization Percentage KPI is displayed
    const utilization = await dashboardPage.getCreditUtilization();
    expect(utilization).toContain('21.43');
  });

  test('QE-9019 TS-002 TC-001 - Verify dashboard displays zero KPI values with informational message when user has no registered cards', async ({ page }) => {
    // Step 2: Log in with user credentials who has no registered credit cards
    await loginPage.login('testuser_nocards', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3-6: Verify all KPIs display zero
    await dashboardPage.waitForKpiToLoad();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toContain('0.00');

    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toContain('0.00');

    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toContain('0.00');

    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toContain('0.00');

    // Step 7: Verify informational message is displayed
    const message = await dashboardPage.getNoCardsMessage();
    expect(message).toContain('No credit cards registered');
  });

  test('QE-9019 TS-003 TC-001 - Verify error message and retry button are displayed when credit card data service is unavailable', async ({ page }) => {
    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Simulate credit card data service unavailability
    await page.route('**/api/cards', route => route.abort());

    // Step 4: Verify error message is displayed to the user
    await dashboardPage.waitForErrorMessage();
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load KPI data');

    // Step 5: Verify retry button is displayed
    await expect(dashboardPage.retryButton).toBeVisible();
    await expect(dashboardPage.retryButton).toBeEnabled();

    // Step 6: Click the retry button
    await page.unroute('**/api/cards');
    await dashboardPage.clickRetry();
    await dashboardPage.waitForKpiToLoad();
  });

  test('QE-9018 TS-001 TC-001 - Verify monthly spend is correctly aggregated and displayed with visual indicator', async ({ page }) => {
    // Step 2: Log in with user credentials who has transactions on multiple cards
    await loginPage.login('testuser_active', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Verify Monthly Spend KPI displays aggregated total
    await dashboardPage.waitForKpiToLoad();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toContain('3,200.00');

    // Step 4: Verify Monthly Spend is displayed in formatted currency
    expect(monthlySpend).toMatch(/\$[0-9,]+\.\d{2}/);

    // Step 5: Verify visual progress indicator is displayed
    await expect(dashboardPage.progressIndicator).toBeVisible();
  });

  test('QE-9018 TS-002 TC-001 - Verify monthly spend displays $0.00 with informational message when no transactions', async ({ page }) => {
    // Step 2: Log in with user credentials who has no transactions in current month
    await loginPage.login('testuser_notransactions', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Verify Monthly Spend KPI displays zero
    await dashboardPage.waitForKpiToLoad();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toContain('0.00');

    // Step 4: Verify informational message is displayed
    const message = await dashboardPage.getNoSpendingMessage();
    expect(message).toContain('No spending activity this month');
  });

  test('QE-9018 TS-003 TC-001 - Verify error state and retry option when transaction service fails', async ({ page }) => {
    // Step 2: Log in with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Simulate transaction service failure
    await page.route('**/api/transactions/monthly', route => route.abort());

    // Step 4: Verify error state is displayed for Monthly Spend KPI
    await dashboardPage.waitForMonthlySpendError();
    const errorMessage = await dashboardPage.getMonthlySpendErrorMessage();
    expect(errorMessage).toContain('Failed to load monthly spend data');

    // Step 5: Verify retry option is available
    await expect(dashboardPage.monthlySpendRetryButton).toBeVisible();

    // Step 6: Click the retry option
    await page.unroute('**/api/transactions/monthly');
    await dashboardPage.clickMonthlySpendRetry();
  });
});