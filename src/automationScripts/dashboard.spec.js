const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

// Test Case - QE-8342 TS001 TC-001
test('TC-5178: Verify user with transactions totaling $2500 in current month views monthly spending KPI displayed as $2500.00', async ({ page }) => {
  logger.info('Starting test: TC-5178');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Authenticate user
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  await expect(page).toHaveURL(/.*dashboard/);
  logger.info('User authenticated successfully');
  
  // Step 2: Create transactions totaling $2500
  await dashboardPage.setupTransactions([1000, 800, 700]);
  
  // Step 3: Navigate to KPI dashboard
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  // Step 4: View monthly spend KPI
  const monthlySpend = await dashboardPage.getMonthlySpendKPI();
  await expect(monthlySpend).toContainText('$2500.00');
  logger.info('Monthly spend KPI verified: $2500.00');
});

// Test Case - QE-8342 TS002 TC-001
test('TC-5179: Verify user with no transactions in current month sees monthly spend displayed as $0.00', async ({ page }) => {
  logger.info('Starting test: TC-5179');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const monthlySpend = await dashboardPage.getMonthlySpendKPI();
  await expect(monthlySpend).toContainText('$0.00');
  
  const message = await dashboardPage.getInfoMessage();
  await expect(message).toContainText('No spending activity for the current month');
  logger.info('Zero spending scenario verified');
});

// Test Case - QE-8342 TS003 TC-001
test('TC-5180: Verify user receives error message when monthly spend calculation service returns error', async ({ page }) => {
  logger.info('Starting test: TC-5180');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate service failure
  await page.route('**/api/transactions/monthly', route => route.abort());
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const errorMessage = await dashboardPage.getErrorMessage();
  await expect(errorMessage).toContainText('monthly spend data is temporarily unavailable');
  logger.info('Service error scenario verified');
});

// Test Case - QE-8321 TS001 TC-001
test('TC-5241: Verify authenticated user views consolidated KPIs in real-time on responsive dashboard', async ({ page }) => {
  logger.info('Starting test: TC-5241');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  // Verify all KPIs are displayed
  await expect(dashboardPage.monthlySpendKPI).toBeVisible();
  await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  await expect(dashboardPage.availableCreditKPI).toBeVisible();
  await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  
  // Verify responsive layout
  const isResponsive = await dashboardPage.verifyResponsiveLayout();
  expect(isResponsive).toBeTruthy();
  logger.info('Consolidated KPIs and responsive layout verified');
});

// Test Case - QE-8321 TS002 TC-001
test('TC-5242: Verify unauthenticated user receives authentication error when accessing dashboard', async ({ page }) => {
  logger.info('Starting test: TC-5242');
  const dashboardPage = new DashboardPage(page);
  
  // Attempt to access dashboard without authentication
  await dashboardPage.navigate();
  
  // Should be redirected to login
  await expect(page).toHaveURL(/.*login/);
  const errorMessage = await page.locator('.auth-error-message');
  await expect(errorMessage).toContainText('Authentication required');
  logger.info('Authentication error scenario verified');
});

// Test Case - QE-8321 TS003 TC-001
test('TC-5243: Verify user with no linked credit cards sees KPI values as zero or unavailable', async ({ page }) => {
  logger.info('Starting test: TC-5243');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user789', 'validPassword');
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const kpiValues = await dashboardPage.getAllKPIValues();
  expect(kpiValues.monthlySpend).toBe('$0.00');
  expect(kpiValues.totalCreditLimit).toBe('$0.00');
  expect(kpiValues.availableCredit).toBe('$0.00');
  expect(kpiValues.outstandingAmount).toBe('$0.00');
  
  const message = await dashboardPage.getInfoMessage();
  await expect(message).toContainText('No credit cards available');
  logger.info('No cards scenario verified');
});

// Test Case - QE-8339 TS001 TC-001
test('TC-5187: Verify available credit KPI displays correctly with $20000 limit and $5000 outstanding', async ({ page }) => {
  logger.info('Starting test: TC-5187');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Setup credit card data
  await dashboardPage.setupCreditCards([
    { limit: 20000, outstanding: 5000 }
  ]);
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const availableCredit = await dashboardPage.getAvailableCreditKPI();
  await expect(availableCredit).toContainText('$15000.00');
  logger.info('Available credit calculation verified: $15000.00');
});

// Test Case - QE-8339 TS002 TC-001
test('TC-5188: Verify over-limit warning when outstanding exceeds credit limit', async ({ page }) => {
  logger.info('Starting test: TC-5188');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await dashboardPage.setupCreditCards([
    { limit: 10000, outstanding: 11000 }
  ]);
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const availableCredit = await dashboardPage.getAvailableCreditKPI();
  const creditText = await availableCredit.textContent();
  expect(creditText).toMatch(/\$0\.00|\-\$1000/);
  
  const warningMessage = await dashboardPage.getWarningMessage();
  await expect(warningMessage).toContainText('Account is over credit limit');
  logger.info('Over-limit scenario verified');
});

// Test Case - QE-8339 TS003 TC-001
test('TC-5189: Verify warning when credit limit data is unavailable or stale', async ({ page }) => {
  logger.info('Starting test: TC-5189');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate stale data
  await page.route('**/api/cards/limits', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ dataStatus: 'STALE', lastUpdated: '2024-01-08T10:00:00Z' })
    });
  });
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const warningMessage = await dashboardPage.getWarningMessage();
  await expect(warningMessage).toContainText('KPI accuracy cannot be guaranteed due to stale data');
  logger.info('Stale data warning verified');
});

// Test Case - QE-8329 TS001 TC-001
test('TC-5217: Verify consolidated KPI dashboard displays all metrics in unified view', async ({ page }) => {
  logger.info('Starting test: TC-5217');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await dashboardPage.setupCreditCards([
    { limit: 5000, outstanding: 1500 },
    { limit: 10000, outstanding: 3000 }
  ]);
  await dashboardPage.setupTransactions([2500]);
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const kpiValues = await dashboardPage.getAllKPIValues();
  expect(kpiValues.monthlySpend).toBe('$2500.00');
  expect(kpiValues.totalCreditLimit).toBe('$15000.00');
  expect(kpiValues.availableCredit).toBe('$10500.00');
  expect(kpiValues.outstandingAmount).toBe('$4500.00');
  logger.info('Consolidated KPI dashboard verified');
});

// Test Case - QE-8329 TS002 TC-001
test('TC-5218: Verify KPI values display as $0.00 or N/A when all cards are inactive', async ({ page }) => {
  logger.info('Starting test: TC-5218');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await dashboardPage.setupCreditCards([
    { status: 'CLOSED' },
    { status: 'INACTIVE' }
  ]);
  
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  
  const kpiValues = await dashboardPage.getAllKPIValues();
  expect(kpiValues.monthlySpend).toMatch(/\$0\.00|N\/A/);
  expect(kpiValues.totalCreditLimit).toMatch(/\$0\.00|N\/A/);
  
  const message = await dashboardPage.getInfoMessage();
  await expect(message).toContainText('No active cards');
  logger.info('Inactive cards scenario verified');
});

// Test Case - QE-8329 TS003 TC-001
test('TC-5219: Verify service unavailable message during system maintenance', async ({ page }) => {
  logger.info('Starting test: TC-5219');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Simulate maintenance mode
  await page.route('**/api/**', route => {
    route.fulfill({
      status: 503,
      body: JSON.stringify({ 
        maintenanceStatus: 'ACTIVE', 
        estimatedRestoration: '2024-01-20T14:00:00Z' 
      })
    });
  });
  
  await dashboardPage.navigate();
  
  const errorMessage = await dashboardPage.getErrorMessage();
  await expect(errorMessage).toContainText('Service temporarily unavailable due to maintenance');
  await expect(errorMessage).toContainText('Estimated restoration');
  logger.info('Maintenance mode scenario verified');
});

// Test Case - QE-8320 TS001 TC-001
test('TC-5244: Verify responsive dashboard layout across desktop, tablet, and mobile devices', async ({ page }) => {
  logger.info('Starting test: TC-5244');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  // Test desktop layout
  await page.setViewportSize({ width: 1920, height: 1080 });
  await dashboardPage.navigate();
  await dashboardPage.waitForDashboardLoad();
  let isResponsive = await dashboardPage.verifyResponsiveLayout();
  expect(isResponsive).toBeTruthy();
  logger.info('Desktop layout verified');
  
  // Test tablet layout
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.reload();
  await dashboardPage.waitForDashboardLoad();
  isResponsive = await dashboardPage.verifyResponsiveLayout();
  expect(isResponsive).toBeTruthy();
  logger.info('Tablet layout verified');
  
  // Test mobile layout
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
  await dashboardPage.waitForDashboardLoad();
  isResponsive = await dashboardPage.verifyResponsiveLayout();
  expect(isResponsive).toBeTruthy();
  logger.info('Mobile layout verified');
});

// Test Case - QE-8320 TS002 TC-001
test('TC-5245: Verify compatibility warning on unsupported browser version', async ({ page }) => {
  logger.info('Starting test: TC-5245');
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Simulate old browser user agent
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'
  });
  
  await loginPage.navigate();
  await loginPage.login('user123', 'validPassword');
  
  await dashboardPage.navigate();
  
  const warningMessage = await page.locator('.browser-compatibility-warning');
  await expect(warningMessage).toBeVisible();
  await expect(warningMessage).toContainText('browser version is not fully supported');
  logger.info('Browser compatibility warning verified');
});

// Test Case - QE-8320 TS003 TC-001
test('TC-5246: Verify concurrent multi-user access without performance degradation', async ({ browser }) => {
  logger.info('Starting test: TC-5246');
  
  // Create multiple browser contexts for concurrent users
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  const context3 = await browser.newContext();
  
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  const page3 = await context3.newPage();
  
  const loginPage1 = new LoginPage(page1);
  const loginPage2 = new LoginPage(page2);
  const loginPage3 = new LoginPage(page3);
  
  const dashboardPage1 = new DashboardPage(page1);
  const dashboardPage2 = new DashboardPage(page2);
  const dashboardPage3 = new DashboardPage(page3);
  
  // Login all users concurrently
  await Promise.all([
    loginPage1.navigate().then(() => loginPage1.login('user123', 'validPassword')),
    loginPage2.navigate().then(() => loginPage2.login('user456', 'validPassword')),
    loginPage3.navigate().then(() => loginPage3.login('user789', 'validPassword'))
  ]);
  
  // Access dashboards concurrently and measure load time
  const startTime = Date.now();
  await Promise.all([
    dashboardPage1.navigate().then(() => dashboardPage1.waitForDashboardLoad()),
    dashboardPage2.navigate().then(() => dashboardPage2.waitForDashboardLoad()),
    dashboardPage3.navigate().then(() => dashboardPage3.waitForDashboardLoad())
  ]);
  const loadTime = Date.now() - startTime;
  
  // Verify load time is within acceptable threshold (< 3 seconds)
  expect(loadTime).toBeLessThan(3000);
  
  // Verify each user sees their own KPIs
  const kpi1 = await dashboardPage1.getAllKPIValues();
  const kpi2 = await dashboardPage2.getAllKPIValues();
  const kpi3 = await dashboardPage3.getAllKPIValues();
  
  // KPIs should be different for different users
  expect(kpi1).not.toEqual(kpi2);
  expect(kpi2).not.toEqual(kpi3);
  
  await context1.close();
  await context2.close();
  await context3.close();
  
  logger.info('Concurrent access verified without performance degradation');
});