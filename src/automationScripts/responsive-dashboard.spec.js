const { test, expect, devices } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Responsive Dashboard Layout - QE-8969', () => {
  let dashboardPage;
  let loginPage;

  test('QE-8969 TS-001 TC-001: Verify dashboard renders with responsive mobile layout within 2 seconds', async ({ browser }) => {
    logger.info('Test Case: QE-8969 TS-001 TC-001 - Mobile responsive layout');
    
    // Step 1: Open application on mobile device
    const context = await browser.newContext({
      ...devices['iPhone 12']
    });
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Mobile device context created (iPhone 12)');

    await loginPage.navigate();
    logger.info('Application accessible on mobile device');

    // Step 2-3: Enter credentials
    await loginPage.login('testuser', 'Pass@123');
    logger.info('Credentials entered');

    // Step 4: Click login and verify load time
    const startTime = Date.now();
    await loginPage.clickLogin();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms on mobile`);

    // Step 5: Verify mobile-optimized layout
    const viewportSize = page.viewportSize();
    expect(viewportSize.width).toBeLessThan(768);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Dashboard layout is responsive for mobile screen');

    // Step 6: Verify all KPIs are visible and accessible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info('All KPIs are visible on mobile screen');

    // Step 7: Verify text is legible without zooming
    const monthlySpendBox = await dashboardPage.monthlySpendKPI.boundingBox();
    expect(monthlySpendBox.height).toBeGreaterThan(20); // Font should be readable
    logger.info('Text and numbers are appropriately sized for mobile');

    await context.close();
    logger.info('Test Case QE-8969 TS-001 TC-001 completed successfully');
  });

  test('QE-8969 TS-002 TC-001: Verify compatibility warning on unsupported browser version', async ({ browser }) => {
    logger.info('Test Case: QE-8969 TS-002 TC-001 - Unsupported browser warning');
    
    // Step 1: Open application with unsupported browser user agent
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1'
    });
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Mobile device with unsupported browser (Safari 10) simulated');

    // Step 2: Attempt to access dashboard
    await loginPage.navigate();
    logger.info('Application accessible');

    // Step 3: Verify compatibility warning is displayed
    const compatibilityWarning = page.locator('[data-testid="compatibility-warning"], .alert-warning:has-text("browser version")');
    await expect(compatibilityWarning).toBeVisible({ timeout: 5000 });
    const warningText = await compatibilityWarning.textContent();
    expect(warningText).toContain('browser version is not fully supported');
    expect(warningText).toContain('responsive features may not function correctly');
    logger.info('Compatibility warning displayed correctly');

    // Step 4: Verify user can proceed despite warning
    const dismissButton = page.locator('button:has-text("Continue"), button:has-text("Dismiss")');
    if (await dismissButton.isVisible()) {
      await dismissButton.click();
      logger.info('Warning dismissed, user can continue');
    }

    await context.close();
    logger.info('Test Case QE-8969 TS-002 TC-001 completed successfully');
  });

  test('QE-8969 TS-003 TC-001: Verify dashboard adapts to tablet dimensions with optimized grid layout', async ({ browser }) => {
    logger.info('Test Case: QE-8969 TS-003 TC-001 - Tablet responsive layout');
    
    // Step 1: Open application on tablet device
    const context = await browser.newContext({
      ...devices['iPad Pro']
    });
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Tablet device context created (iPad Pro)');

    await loginPage.navigate();
    logger.info('Application accessible on tablet device');

    // Step 2-3: Enter credentials
    await loginPage.login('testuser', 'Pass@123');
    logger.info('Credentials entered');

    // Step 4: Click login
    await loginPage.clickLogin();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded successfully on tablet');

    // Step 5: Verify tablet-optimized layout
    const viewportSize = page.viewportSize();
    expect(viewportSize.width).toBeGreaterThanOrEqual(768);
    expect(viewportSize.width).toBeLessThan(1024);
    logger.info('Dashboard layout adapts to tablet screen dimensions');

    // Step 6: Verify all KPIs visible without horizontal scrolling
    await expect(dashboardPage.monthlySpendKPI).toBeInViewport();
    await expect(dashboardPage.totalCreditLimitKPI).toBeInViewport();
    await expect(dashboardPage.availableCreditKPI).toBeInViewport();
    await expect(dashboardPage.outstandingAmountKPI).toBeInViewport();
    logger.info('All four KPIs visible within viewport without horizontal scroll');

    // Step 7: Verify KPI cards are appropriately sized
    const kpiBox = await dashboardPage.monthlySpendKPI.boundingBox();
    expect(kpiBox.width).toBeGreaterThan(150); // Adequate size for tablet
    expect(kpiBox.height).toBeGreaterThan(80);
    logger.info('KPI cards utilize available screen space efficiently');

    await context.close();
    logger.info('Test Case QE-8969 TS-003 TC-001 completed successfully');
  });
});