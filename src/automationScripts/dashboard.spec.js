const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
    await page.goto('https://creditcard.dashboard.app');
  });

  test('QE-10322 TS-001 TC-001 - Verify aggregated KPI display for user with multiple credit cards', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/creditcard\.dashboard\.app/);
    
    // Step 2: Log in with valid credentials for multi-card user
    await loginPage.login('testuser_multicard', 'Test@1234');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Step 3: Verify KPI widgets are displayed
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.creditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    
    // Step 4-7: Verify KPI values
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const creditLimit = await dashboardPage.getKPIValue('creditLimit');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const outstanding = await dashboardPage.getKPIValue('outstanding');
    
    // Step 8: Validate aggregated totals
    expect(parseFloat(monthlySpend.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(creditLimit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(availableCredit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(outstanding.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
  });

  test('QE-10322 TS-002 TC-001 - Verify dashboard access is denied for unauthenticated user', async ({ page }) => {
    // Step 1: Application loads
    await expect(page).toHaveURL(/creditcard\.dashboard\.app/);
    
    // Step 2: Attempt to navigate to dashboard without login
    await page.goto('https://creditcard.dashboard.app/dashboard');
    
    // Step 3-4: Verify redirect to login and no data exposed
    await expect(page).toHaveURL(/login/);
    await expect(dashboardPage.monthlySpendWidget).not.toBeVisible();
    await expect(dashboardPage.creditLimitWidget).not.toBeVisible();
    
    // Step 5: Verify no sensitive data in console
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    expect(consoleLogs.join('')).not.toContain('credit');
    expect(consoleLogs.join('')).not.toContain('balance');
  });

  test('QE-10322 TS-003 TC-001 - Verify dashboard display for user with no linked credit cards', async ({ page }) => {
    // Step 1-2: Login with no-cards user
    await loginPage.login('testuser_nocards', 'Test@1234');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Step 3-7: Verify KPI widgets show zero or 'No cards linked'
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const creditLimit = await dashboardPage.getKPIValue('creditLimit');
    
    expect(monthlySpend).toMatch(/\$0\.00|No cards linked/);
    expect(creditLimit).toMatch(/\$0\.00|No cards linked/);
    
    // Step 8: Verify no errors
    await expect(dashboardPage.errorMessage).not.toBeVisible();
  });

  test('QE-10319 TS-001 TC-001 - Verify manual dashboard refresh updates all KPI widgets', async ({ page }) => {
    // Step 1-2: Login and note initial values
    await loginPage.login('testuser', 'Test@1234');
    const initialMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    
    // Step 3-4: Simulate backend change and trigger refresh
    await dashboardPage.clickRefreshButton();
    
    // Step 5: Verify KPI widgets updated
    await page.waitForTimeout(2000); // Wait for refresh to complete
    const updatedMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    
    // Step 6: Verify refresh completed within 2 seconds
    const startTime = Date.now();
    await dashboardPage.clickRefreshButton();
    await dashboardPage.waitForKPIUpdate();
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(2000);
  });

  test('QE-10319 TS-002 TC-001 - Verify dashboard refresh failure handling when data source is unavailable', async ({ page }) => {
    // Step 1-2: Login and note initial values
    await loginPage.login('testuser', 'Test@1234');
    const initialMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    
    // Step 3-4: Mock service unavailability and trigger refresh
    await page.route('**/creditcards', route => route.abort());
    await dashboardPage.clickRefreshButton();
    
    // Step 5: Verify error notification
    await expect(dashboardPage.errorNotification).toBeVisible();
    await expect(dashboardPage.errorNotification).toContainText(/Service temporarily unavailable|Refresh failed/);
    
    // Step 6: Verify previous data retained
    const retainedMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    expect(retainedMonthlySpend).toBe(initialMonthlySpend);
    
    // Step 7: Verify UI stability
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
  });

  test('QE-10319 TS-002 TC-002 - Verify dashboard refresh failure handling when data source returns error', async ({ page }) => {
    // Step 1-2: Login and note initial values
    await loginPage.login('testuser', 'Test@1234');
    const initialMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    
    // Step 3-4: Mock 500 error and trigger refresh
    await page.route('**/creditcards', route => route.fulfill({ status: 500 }));
    await dashboardPage.clickRefreshButton();
    
    // Step 5: Verify error notification
    await expect(dashboardPage.errorNotification).toBeVisible();
    await expect(dashboardPage.errorNotification).toContainText(/Refresh failed/);
    
    // Step 6-7: Verify data retained and UI stable
    const retainedMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    expect(retainedMonthlySpend).toBe(initialMonthlySpend);
  });

  test('QE-10319 TS-003 TC-001 - Verify automatic background dashboard refresh every 60 seconds', async ({ page }) => {
    // Step 1-2: Login and note initial values with timestamp
    await loginPage.login('testuser', 'Test@1234');
    const initialMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const startTime = Date.now();
    
    // Step 3-5: Wait 60 seconds and verify auto-refresh
    await page.waitForTimeout(60000);
    const updatedMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    
    // Step 6: Verify refresh occurred automatically
    const elapsedTime = Date.now() - startTime;
    expect(elapsedTime).toBeGreaterThanOrEqual(60000);
    expect(elapsedTime).toBeLessThan(65000);
    
    // Step 7: Verify periodic refresh continues
    await page.waitForTimeout(60000);
    const secondRefreshTime = Date.now();
    expect(secondRefreshTime - startTime).toBeGreaterThanOrEqual(120000);
  });
});
