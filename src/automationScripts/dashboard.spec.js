const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');
const logger = require('../utils/logger');

/**
 * Test Suite: Dashboard KPI Validation
 * Epic: QE-9813 - Dashboard and KPI Management
 * User Stories: QE-9890 (Real-Time Financial KPI Dashboard), QE-9891 (Responsive Dashboard Layout Design)
 */

test.describe('Dashboard KPI Tests - QE-9890', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Dashboard test suite');
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
  });

  /**
   * Test Case: QE-9990 TS001 TC-001
   * Verify authenticated user with 3 active credit cards views aggregated KPI widgets loaded within 2 seconds
   */
  test('TC-001: Verify aggregated KPI widgets display within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-9990 TS001 TC-001');
    const testUser = testData.users.user321;
    
    // Step 1: Log in as authenticated user with 3 active credit cards
    await loginPage.navigate();
    await loginPage.login(testUser.userId, testUser.password);
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
    logger.info('User logged in successfully');

    // Step 2: Navigate to the dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard page loaded');

    // Step 3-6: Verify KPI widgets display correct values
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(monthlySpend).toBe('$3,200.00');
    logger.info('Monthly Spend verified: $3,200.00');

    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe('$30,000.00');
    logger.info('Total Credit Limit verified: $30,000.00');

    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe('$23,500.00');
    logger.info('Available Credit verified: $23,500.00');

    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(outstandingAmount).toBe('$6,500.00');
    logger.info('Outstanding Amount verified: $6,500.00');

    // Step 7: Verify all KPI widgets load within 2 seconds
    const loadTime = await dashboardPage.getPageLoadTime();
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard load time: ${loadTime}ms (within 2 second requirement)`);
  });

  /**
   * Test Case: QE-9990 TS002 TC-001
   * Verify unauthenticated user is redirected to login page with error message
   */
  test('TC-002: Verify unauthenticated access redirects to login', async ({ page }) => {
    logger.info('Starting test: QE-9990 TS002 TC-001');
    
    // Step 1: Attempt to navigate to dashboard URL without logging in
    await page.goto(testData.urls.dashboard);
    logger.info('Attempted to access dashboard without authentication');

    // Step 2: Verify error message indicating authentication is required
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toContain('Authentication is required');
    logger.info('Authentication error message verified');

    // Step 3: Verify login form is displayed
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    logger.info('Login form displayed successfully');
  });

  /**
   * Test Case: QE-9990 TS003 TC-001
   * Verify dashboard KPI values update within 2 seconds after new transaction
   */
  test('TC-003: Verify real-time KPI update after new transaction', async ({ page }) => {
    logger.info('Starting test: QE-9990 TS003 TC-001');
    const testUser = testData.users.user321;
    
    // Step 1: Log in and view dashboard
    await loginPage.navigate();
    await loginPage.login(testUser.userId, testUser.password);
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded with initial KPI values');

    // Step 2: Note current monthly spend value
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    await expect(initialMonthlySpend).toBe('$3,200.00');
    logger.info('Initial monthly spend: $3,200.00');

    // Step 3: Simulate new transaction
    await dashboardPage.simulateTransaction(150, 'Chase Visa');
    logger.info('New transaction simulated: $150 on Chase Visa');

    // Step 4: Refresh the dashboard page
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard refreshed');

    // Step 5: Verify monthly spend value is updated
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    await expect(updatedMonthlySpend).toBe('$3,350.00');
    logger.info('Updated monthly spend verified: $3,350.00');

    // Step 6: Verify KPI update completes within 2 seconds
    const loadTime = await dashboardPage.getPageLoadTime();
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard refresh time: ${loadTime}ms`);
  });
});

test.describe('Responsive Dashboard Layout Tests - QE-9891', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Responsive Layout test suite');
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
  });

  /**
   * Test Case: QE-9989 TS001 TC-001
   * Verify dashboard on mobile device displays KPI widgets stacked vertically
   */
  test('TC-004: Verify mobile responsive layout (375px width)', async ({ page, context }) => {
    logger.info('Starting test: QE-9989 TS001 TC-001');
    const testUser = testData.users.user123;
    
    // Step 1: Set viewport to mobile device dimensions
    await page.setViewportSize({ width: 375, height: 667 });
    logger.info('Viewport set to mobile: 375px x 667px');

    // Step 2: Log in as authenticated user
    await loginPage.navigate();
    await loginPage.login(testUser.userId, testUser.password);
    logger.info('User logged in successfully');

    // Step 3: Navigate to the dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded in mobile view');

    // Step 4: Verify KPI widgets are stacked vertically
    const isVerticalStack = await dashboardPage.isVerticalLayout();
    expect(isVerticalStack).toBeTruthy();
    logger.info('KPI widgets verified as vertically stacked');

    // Step 5: Verify font sizes are readable (minimum 14px)
    const minFontSize = await dashboardPage.getMinimumFontSize();
    expect(minFontSize).toBeGreaterThanOrEqual(14);
    logger.info(`Minimum font size verified: ${minFontSize}px`);

    // Step 6: Verify no horizontal scrolling is required
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBeFalsy();
    logger.info('No horizontal scrolling required');
  });

  /**
   * Test Case: QE-9989 TS002 TC-001
   * Verify dashboard on tablet device displays KPI widgets in 2-column grid
   */
  test('TC-005: Verify tablet responsive layout (768px width)', async ({ page }) => {
    logger.info('Starting test: QE-9989 TS002 TC-001');
    const testUser = testData.users.user123;
    
    // Step 1: Set viewport to tablet device dimensions
    await page.setViewportSize({ width: 768, height: 1024 });
    logger.info('Viewport set to tablet: 768px x 1024px');

    // Step 2: Log in as authenticated user
    await loginPage.navigate();
    await loginPage.login(testUser.userId, testUser.password);
    logger.info('User logged in successfully');

    // Step 3: Navigate to the dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded in tablet view');

    // Step 4: Verify KPI widgets display in 2-column grid layout
    const columnCount = await dashboardPage.getLayoutColumnCount();
    expect(columnCount).toBe(2);
    logger.info('2-column grid layout verified');

    // Step 5: Verify optimized spacing between widgets
    const widgetSpacing = await dashboardPage.getWidgetSpacing();
    expect(widgetSpacing).toBeGreaterThanOrEqual(15);
    expect(widgetSpacing).toBeLessThanOrEqual(20);
    logger.info(`Widget spacing verified: ${widgetSpacing}px`);

    // Step 6: Verify all metrics are clearly visible without overlapping
    const hasOverlap = await dashboardPage.hasWidgetOverlap();
    expect(hasOverlap).toBeFalsy();
    logger.info('No widget overlap detected');
  });

  /**
   * Test Case: QE-9989 TS003 TC-001
   * Verify user on device below 320px width receives notification
   */
  test('TC-006: Verify minimum resolution notification (300px width)', async ({ page }) => {
    logger.info('Starting test: QE-9989 TS003 TC-001');
    const testUser = testData.users.user123;
    
    // Step 1: Set viewport to 300px width
    await page.setViewportSize({ width: 300, height: 500 });
    logger.info('Viewport set to: 300px x 500px');

    // Step 2: Log in as authenticated user
    await loginPage.navigate();
    await loginPage.login(testUser.userId, testUser.password);
    logger.info('User logged in successfully');

    // Step 3: Navigate to the dashboard
    await dashboardPage.navigate();
    logger.info('Dashboard navigation attempted');

    // Step 4: Verify notification message is displayed
    const notificationMessage = await dashboardPage.getMinResolutionNotification();
    await expect(notificationMessage).toContain('Minimum supported screen width is 320px');
    await expect(notificationMessage).toContain('Please rotate your device or use a larger screen');
    logger.info('Minimum resolution notification verified');

    // Step 5: Verify dashboard content is not fully rendered
    const isContentRendered = await dashboardPage.isDashboardContentVisible();
    expect(isContentRendered).toBeFalsy();
    logger.info('Dashboard content not rendered as expected');
  });
});