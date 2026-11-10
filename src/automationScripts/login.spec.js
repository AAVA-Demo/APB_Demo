const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Authentication Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('TC-7089: Successful login with valid credentials', async ({ page }) => {
    // Step 1: Application already loaded in beforeEach
    await expect(page).toHaveURL(/login/);

    // Step 2: Authenticate with valid user credentials
    await loginPage.login('testuser', 'Pass@123');

    // Step 3: Verify dashboard page loads within 2 seconds
    const startTime = Date.now();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible({ timeout: 2000 });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
  });

  test('TC-7091: Login with user having no linked credit cards', async ({ page }) => {
    // Step 2: Authenticate with valid user credentials (user with no linked cards)
    await loginPage.login('newuser', 'Pass@123');

    // Step 4: Navigate to dashboard
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  });
});
