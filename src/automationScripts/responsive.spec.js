const { test, expect, devices } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const config = require('../data/config.json');
const logger = require('../utils/logger');

test.describe('Responsive Multi-Device Dashboard Tests', () => {
  let dashboardPage;
  let loginPage;

  // Test Case ID: 7270 - QE-9980 TS-001 TC-001
  test('TC-7270: Verify mobile responsive dashboard (375px viewport)', async ({ browser }) => {
    logger.info('Test Case 7270: Starting mobile responsive test');
    
    // Step 1: Launch application with mobile viewport
    const context = await browser.newContext({
      ...devices['iPhone SE'],
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
    
    await loginPage.navigate(config.baseUrl);
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Mobile login page loaded (375px viewport)');
    
    // Step 2-3: Login
    await loginPage.login(config.users.testUser.username, config.users.testUser.password);
    logger.info('Steps 2-3: User authenticated');
    
    // Step 4: Verify dashboard loads within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForKPIsToLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Step 4: Dashboard loaded in ${loadTime}ms`);
    
    // Step 5: Verify vertical stacked layout
    const layout = await dashboardPage.getKPILayout();
    expect(layout).toBe('vertical');
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info('Step 5: Vertical stacked layout verified');
    
    // Step 6: Verify font sizes
    const fontSize = await dashboardPage.getKPIFontSize();
    expect(fontSize).toBeGreaterThanOrEqual(14);
    logger.info(`Step 6: Font size verified: ${fontSize}px`);
    
    // Step 7: Verify spacing
    const spacing = await dashboardPage.getKPISpacing();
    expect(spacing).toBeGreaterThanOrEqual(10);
    logger.info(`Step 7: Spacing verified: ${spacing}px`);
    
    // Step 8: Verify no horizontal scroll
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBeFalsy();
    logger.info('Step 8: No horizontal scroll verified');
    
    await context.close();
  });

  // Test Case ID: 7272 - QE-9980 TS-002 TC-001
  test('TC-7272: Verify tablet responsive dashboard (768px viewport)', async ({ browser }) => {
    logger.info('Test Case 7272: Starting tablet responsive test');
    
    // Step 1: Launch application with tablet viewport
    const context = await browser.newContext({
      ...devices['iPad'],
      viewport: { width: 768, height: 1024 }
    });
    const page = await context.newPage();
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
    
    await loginPage.navigate(config.baseUrl);
    await expect(page).toHaveURL(/login/);
    logger.info('Step 1: Tablet login page loaded (768px viewport)');
    
    // Step 2-3: Login
    await loginPage.login(config.users.testUser.username, config.users.testUser.password);
    logger.info('Steps 2-3: User authenticated');
    
    // Step 4: Verify dashboard loads within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForKPIsToLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Step 4: Dashboard loaded in ${loadTime}ms`);
    
    // Step 5: Verify 2x2 grid layout
    const layout = await dashboardPage.getKPILayout();
    expect(layout).toBe('grid-2x2');
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info('Step 5: 2x2 grid layout verified');
    
    // Step 6: Verify responsive breakpoint
    const breakpoint = await dashboardPage.getCurrentBreakpoint();
    expect(breakpoint).toBe(768);
    logger.info(`Step 6: Responsive breakpoint verified: ${breakpoint}px`);
    
    // Step 7: Verify data loads within 2 seconds
    const allKPIsLoaded = await dashboardPage.areAllKPIsLoaded();
    expect(allKPIsLoaded).toBeTruthy();
    logger.info('Step 7: All KPI data loaded within performance requirement');
    
    // Step 8: Verify no horizontal scroll
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBeFalsy();
    logger.info('Step 8: No horizontal scroll verified');
    
    await context.close();
  });

  // Test Case ID: 7274 - QE-9980 TS-003 TC-001
  test('TC-7274: Verify slow network timeout handling', async ({ browser }) => {
    logger.info('Test Case 7274: Starting slow network test');
    
    // Step 1: Launch application with network throttling
    const context = await browser.newContext();
    const page = await context.newPage();
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
    
    // Simulate 2G network (50 Kbps)
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 3000); // Delay all requests by 3 seconds
    });
    
    await loginPage.navigate(config.baseUrl);
    logger.info('Step 1: Application login page loading with 2G throttling');
    
    // Step 2-3: Login
    await loginPage.enterUsername(config.users.testUser.username);
    await loginPage.enterPassword(config.users.testUser.password);
    await loginPage.clickLoginButton();
    logger.info('Steps 2-3: Credentials submitted');
    
    // Step 4: Observe loading indicator
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    logger.info('Step 4: Loading indicator displayed');
    
    // Step 5: Wait for load time to exceed 2 seconds
    // Using page.waitForTimeout here is necessary to simulate slow network behavior
    await page.waitForTimeout(2100); // Wait slightly more than 2 seconds to exceed target
    logger.info('Step 5: Page load time exceeded 2 seconds due to slow network');
    
    // Step 6: Verify timeout handling
    const timeoutMessage = await dashboardPage.getTimeoutMessage();
    expect(timeoutMessage).toMatch(/Loading is taking longer than expected|check your connection/);
    logger.info(`Step 6: Timeout message verified: ${timeoutMessage}`);
    
    // Step 7: Verify user-friendly error message
    expect(timeoutMessage).toContain('Loading is taking longer than expected');
    logger.info('Step 7: User-friendly error message verified');
    
    // Step 8: Verify application stability
    await expect(page).not.toHaveTitle(/Error/);
    const canRetry = await dashboardPage.hasRetryButton();
    expect(canRetry).toBeTruthy();
    logger.info('Step 8: Application remains responsive with retry option');
    
    await context.close();
  });
});
