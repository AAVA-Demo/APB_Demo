const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const config = require('../data/config.json');
const logger = require('../utils/logger');

test.describe('Dashboard and KPI Management Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
    logger.info('Starting test setup');
  });

  // Test Case ID: 7264 - QE-9978 TS-001 TC-001
  test('TC-7264: Verify authenticated user can view all four KPIs with 2 decimal precision', async ({ page }) => {
    logger.info('Test Case 7264: Starting KPI display verification');
    
    // Step 1: Launch application
    await loginPage.navigate(config.baseUrl);
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Application login page loaded successfully');
    
    // Step 2: Enter valid credentials
    await loginPage.enterUsername(config.users.testUser.username);
    await loginPage.enterPassword(config.users.testUser.password);
    logger.info('Step 2: Credentials entered');
    
    // Step 3: Click login button
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Step 3: User authenticated and redirected to dashboard');
    
    // Step 4: Verify Monthly Spend KPI
    await dashboardPage.waitForKPIsToLoad();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    logger.info(`Step 4: Monthly Spend KPI verified: ${monthlySpend}`);
    
    // Step 5: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    logger.info(`Step 5: Total Credit Limit KPI verified: ${totalCreditLimit}`);
    
    // Step 6: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    logger.info(`Step 6: Available Credit KPI verified: ${availableCredit}`);
    
    // Step 7: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toMatch(/^\$[0-9,]+\.[0-9]{2}$/);
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info(`Step 7: Outstanding Amount KPI verified: ${outstandingAmount}`);
    
    // Step 8: Verify KPI calculation accuracy
    const calculatedAvailable = dashboardPage.calculateAvailableCredit(totalCreditLimit, outstandingAmount);
    expect(calculatedAvailable).toBe(availableCredit);
    logger.info('Step 8: KPI calculation accuracy verified');
  });

  // Test Case ID: 7265 - QE-9978 TS-002 TC-001
  test('TC-7265: Verify unauthenticated user receives authentication error', async ({ page }) => {
    logger.info('Test Case 7265: Starting unauthenticated access test');
    
    // Step 1: Launch application
    await loginPage.navigate(config.baseUrl);
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Application login page loaded successfully');
    
    // Step 2: Attempt to navigate directly to dashboard without login
    await page.goto(`${config.baseUrl}/dashboard`);
    logger.info('Step 2: Attempted direct navigation to dashboard');
    
    // Step 3: Verify no KPI data is displayed
    const isRedirected = await page.url().includes('login');
    expect(isRedirected).toBeTruthy();
    logger.info('Step 3: Verified redirection to login page (no KPI data displayed)');
    
    // Step 4: Verify authentication error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Authentication failed');
    logger.info(`Step 4: Authentication error message verified: ${errorMessage}`);
    
    // Step 5: Verify application stability
    await expect(page).not.toHaveTitle(/Error/);
    logger.info('Step 5: Application remains stable, no crash detected');
  });

  // Test Case ID: 7266 - QE-9978 TS-003 TC-001
  test('TC-7266: Verify appropriate error message when backend KPI service unavailable', async ({ page }) => {
    logger.info('Test Case 7266: Starting backend service unavailability test');
    
    // Step 1: Launch application
    await loginPage.navigate(config.baseUrl);
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Application login page loaded successfully');
    
    // Step 2: Enter valid credentials
    await loginPage.enterUsername(config.users.testUser.username);
    await loginPage.enterPassword(config.users.testUser.password);
    logger.info('Step 2: Credentials entered');
    
    // Step 3: Click login button
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Step 3: User authenticated and redirected to dashboard');
    
    // Step 4: Simulate backend service unavailability (mock API failure)
    await page.route('**/api/dashboard/kpis**', route => route.abort('failed'));
    await page.reload();
    logger.info('Step 4: Backend KPI service unavailability simulated');
    
    // Step 5: Verify appropriate error message
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toMatch(/Failed to load dashboard data|Server error/);
    logger.info(`Step 5: Error message verified: ${errorMessage}`);
    
    // Step 6: Verify loading indicators or placeholders
    const hasLoadingState = await dashboardPage.hasLoadingState();
    expect(hasLoadingState).toBeTruthy();
    logger.info('Step 6: Loading state or placeholders verified');
    
    // Step 7: Verify application does not crash
    await expect(page).not.toHaveTitle(/Error/);
    const canNavigate = await dashboardPage.canNavigateToOtherSections();
    expect(canNavigate).toBeTruthy();
    logger.info('Step 7: Application remains responsive, no crash detected');
  });
});
