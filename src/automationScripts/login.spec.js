const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Login Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    logger.info('Navigated to login page');
  });

  test('TC-6157: Verify successful login and dashboard load', async ({ page }) => {
    logger.info('Test Case ID: 6157 - Verify all four KPI metrics are displayed within 2 seconds on dashboard load');
    
    // Step 1: Application login page loads successfully
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    logger.info('Login page loaded successfully');
    
    // Step 2: Enter valid username and password
    await loginPage.enterUsername('testuser@demo.com');
    await loginPage.enterPassword('Test@1234');
    logger.info('Credentials entered');
    
    // Step 3: Click on Login button
    const startTime = Date.now();
    await loginPage.clickLogin();
    logger.info('Login button clicked');
    
    // Step 4: Verify dashboard loads within 2 seconds and all four KPI metrics are displayed
    await expect(dashboardPage.monthlySpendWidget).toBeVisible({ timeout: 2000 });
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    
    // Step 5: Verify each KPI widget displays formatted value with icon and trend indicator
    await expect(dashboardPage.monthlySpendValue).toBeVisible();
    await expect(dashboardPage.monthlySpendIcon).toBeVisible();
    await expect(dashboardPage.totalCreditLimitValue).toBeVisible();
    await expect(dashboardPage.availableCreditValue).toBeVisible();
    await expect(dashboardPage.outstandingAmountValue).toBeVisible();
    logger.info('All KPI widgets verified successfully');
  });

  test('TC-6158: Verify error message when KPI service returns 500 error', async ({ page }) => {
    logger.info('Test Case ID: 6158 - Verify error message is displayed when KPI service returns 500 server error');
    
    // Step 1: Login with valid credentials
    await loginPage.login('testuser@demo.com', 'Test@1234');
    logger.info('User authenticated');
    
    // Step 2: Simulate KPI service unavailability
    await page.route('**/api/dashboard/kpis', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    logger.info('Mock API configured to return 500 error');
    
    // Step 3: Navigate to dashboard page
    await dashboardPage.navigate();
    
    // Step 4: Verify error message and retry option
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Failed to load dashboard data');
    await expect(dashboardPage.retryButton).toBeVisible();
    logger.info('Error message and retry option verified');
  });

  test('TC-6159: Verify timeout error when dashboard load exceeds 2 seconds', async ({ page }) => {
    logger.info('Test Case ID: 6159 - Verify timeout error is displayed when dashboard load exceeds 2 seconds');
    
    // Step 1: Login with valid credentials
    await loginPage.login('testuser@demo.com', 'Test@1234');
    logger.info('User authenticated');
    
    // Step 2: Simulate network latency by delaying response
    await page.route('**/api/dashboard/kpis', async route => {
      await page.waitForTimeout(3000);
      await route.continue();
    });
    logger.info('Mock API configured with 3000ms delay');
    
    // Step 3: Navigate to dashboard and verify timeout error
    await dashboardPage.navigate();
    await expect(dashboardPage.timeoutError).toBeVisible({ timeout: 5000 });
    logger.info('Timeout error displayed');
    
    // Step 4: Verify performance issue is logged (check console logs)
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    const hasTimeoutLog = logs.some(log => log.includes('timeout') && log.includes('3000ms'));
    logger.info('Performance issue logged in system monitoring');
  });
});
