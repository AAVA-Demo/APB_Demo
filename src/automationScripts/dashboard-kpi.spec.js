const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

// Test Suite for Dashboard KPI Display - Story QE-10440
test.describe('Dashboard KPI Display Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await page.goto(testData.baseUrl);
  });

  // Test Case: QE-10509 TS-001 TC-001
  test('TC-001: Verify aggregated KPIs are correctly calculated and displayed for a user with multiple credit cards', async ({ page }) => {
    // Step 1-2: Launch and authenticate
    await loginPage.login(testData.users.multiCards.username, testData.users.multiCards.password);
    
    // Step 3: Navigate to Dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4: Verify Monthly Spend KPI
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    await expect(monthlySpend).toBe('$1,750.00');
    
    // Step 5: Verify Total Credit Limit KPI
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    await expect(totalCreditLimit).toBe('$45,000.00');
    
    // Step 6: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    await expect(availableCredit).toBe('$37,500.00');
    
    // Step 7: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    await expect(outstandingAmount).toBe('$7,500.00');
    
    // Step 8: Verify all KPIs are visible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  // Test Case: QE-10509 TS-002 TC-001
  test('TC-002: Verify appropriate message and zero/N/A values are displayed when user has no registered credit cards', async ({ page }) => {
    // Step 1-2: Launch and authenticate with no cards user
    await loginPage.login(testData.users.noCards.username, testData.users.noCards.password);
    
    // Step 3: Navigate to Dashboard
    await dashboardPage.waitForDashboardLoad();
    
    // Step 4: Verify no card data message
    await expect(dashboardPage.noCardMessage).toBeVisible();
    await expect(dashboardPage.noCardMessage).toContainText('No credit cards registered');
    
    // Step 5-8: Verify all KPIs show zero or N/A
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(['$0.00', 'N/A']).toContain(monthlySpend);
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(['$0.00', 'N/A']).toContain(totalCreditLimit);
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(['$0.00', 'N/A']).toContain(availableCredit);
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(['$0.00', 'N/A']).toContain(outstandingAmount);
  });

  // Test Case: QE-10509 TS-003 TC-001
  test('TC-003: Verify error message is displayed when backend KPI aggregation service is unavailable', async ({ page }) => {
    // Step 2: Mock backend service unavailability
    await page.route('**/api/kpi/aggregate', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });
    
    // Step 3: Authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 4-5: Navigate and verify error message
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Unable to load dashboard data');
    
    // Step 6: Verify application remains functional
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    // Step 7: Verify KPI values are not displayed or show loading
    const kpiLoadingState = await dashboardPage.isKPILoading();
    expect(kpiLoadingState).toBe(true);
  });
});

// Test Suite for Responsive Multi-Device Dashboard Access - Story QE-10441
test.describe('Responsive Dashboard Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  // Test Case: QE-10514 TS-001 TC-001
  test('TC-004: Verify dashboard displays in single-column responsive layout on mobile device (375px viewport)', async ({ page, context }) => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(testData.baseUrl);
    
    // Step 2: Authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 3: Wait for dashboard load within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    // Step 4: Verify single-column layout
    const layoutType = await dashboardPage.getKPILayoutType();
    expect(layoutType).toBe('single-column');
    
    // Step 5: Verify text readability
    const fontSize = await dashboardPage.getKPIFontSize();
    expect(fontSize).toBeGreaterThanOrEqual(14);
    
    // Step 6: Verify spacing
    const spacing = await dashboardPage.getKPICardSpacing();
    expect(spacing).toBeGreaterThanOrEqual(15);
    
    // Step 7: Verify all KPI values visible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  // Test Case: QE-10514 TS-002 TC-001
  test('TC-005: Verify dashboard displays in two-column responsive layout on tablet device (768px viewport)', async ({ page }) => {
    // Step 1: Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(testData.baseUrl);
    
    // Step 2: Authenticate
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 3: Wait for dashboard load
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    // Step 4: Verify two-column layout
    const layoutType = await dashboardPage.getKPILayoutType();
    expect(layoutType).toBe('two-column');
    
    // Step 5: Verify all metrics clearly visible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const isTextTruncated = await dashboardPage.isTextTruncated();
    expect(isTextTruncated).toBe(false);
    
    // Step 6: Verify spacing and alignment
    const isEvenlyDistributed = await dashboardPage.isKPIEvenlyDistributed();
    expect(isEvenlyDistributed).toBe(true);
    
    // Step 7: Verify touch targets (if interactive elements exist)
    const touchTargetSize = await dashboardPage.getTouchTargetSize();
    if (touchTargetSize) {
      expect(touchTargetSize.width).toBeGreaterThanOrEqual(44);
      expect(touchTargetSize.height).toBeGreaterThanOrEqual(44);
    }
  });

  // Test Case: QE-10514 TS-003 TC-001
  test('TC-006: Verify dashboard displays loading indicator and handles slow network gracefully', async ({ page, context }) => {
    // Step 1: Simulate 2G network
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024 / 8,
      uploadThroughput: 20 * 1024 / 8,
      latency: 300
    });
    
    // Step 2-3: Launch and authenticate
    await page.goto(testData.baseUrl);
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    // Step 4-5: Verify loading indicator
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    await expect(dashboardPage.loadingIndicator).toContainText('Loading dashboard data');
    
    // Step 6-7: Wait for data load or timeout
    const dataLoaded = await dashboardPage.waitForDataOrTimeout(30000);
    
    if (dataLoaded) {
      await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    } else {
      // Verify cached data or timeout message
      const hasCachedData = await dashboardPage.hasCachedDataMessage();
      const hasTimeoutMessage = await dashboardPage.hasTimeoutMessage();
      expect(hasCachedData || hasTimeoutMessage).toBe(true);
    }
    
    // Step 8: Verify application remains functional
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });
});
