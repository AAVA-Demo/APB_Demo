const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Display System - QE-8173', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Initializing Dashboard Page for test execution');
  });

  test('QE-8173 TS-001 TC-001: Verify real-time KPI display with accurate calculations for authenticated user', async ({ page }) => {
    logger.info('Starting test: QE-8173 TS-001 TC-001');
    
    // Step 1: Authenticate user
    await dashboardPage.authenticateUser('user123', 'valid-token-xyz');
    await expect(page).toHaveURL(/.*dashboard/);
    logger.info('User authenticated successfully');
    
    // Step 2-3: Navigate to dashboard and verify KPI data retrieval
    await dashboardPage.navigateToDashboard();
    await dashboardPage.waitForKPIDataLoad();
    logger.info('Dashboard loaded and KPI data retrieved');
    
    // Step 4-7: Validate KPI calculations
    const kpiData = await dashboardPage.getKPIData();
    expect(kpiData.monthlySpend).toBe(4250.75);
    expect(kpiData.totalCreditLimit).toBe(50000);
    expect(kpiData.outstandingAmount).toBe(14250.75);
    expect(kpiData.availableCredit).toBe(35749.25);
    
    // Verify calculation: availableCredit = totalCreditLimit - outstandingAmount
    const calculatedAvailable = kpiData.totalCreditLimit - kpiData.outstandingAmount;
    expect(calculatedAvailable).toBe(35749.25);
    logger.info('All KPI calculations verified successfully');
  });

  test('QE-8173 TS-002 TC-001: Verify system returns error when credit card data service is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-8173 TS-002 TC-001');
    
    // Step 1: Authenticate user
    await dashboardPage.authenticateUser('user123', 'valid-token-xyz');
    logger.info('User authenticated successfully');
    
    // Step 2-3: Navigate to dashboard with service unavailable
    await page.route('**/api/dashboard/kpis', route => {
      route.abort('failed');
    });
    await dashboardPage.navigateToDashboard();
    
    // Step 4-6: Verify error handling
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Failed to load dashboard data');
    logger.info('Error message displayed correctly for service unavailability');
  });

  test('QE-8173 TS-002 TC-002: Verify system displays stale/cached data with appropriate error messaging', async ({ page }) => {
    logger.info('Starting test: QE-8173 TS-002 TC-002');
    
    // Step 1: Authenticate user
    await dashboardPage.authenticateUser('user123', 'valid-token-xyz');
    
    // Step 2-4: Simulate cached data scenario
    await page.route('**/api/dashboard/kpis', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          cachedData: true,
          monthlySpend: 4000.00,
          totalCreditLimit: 50000,
          availableCredit: 36000.00,
          outstandingAmount: 14000.00,
          warning: 'Displaying cached data. Real-time data unavailable.',
          lastUpdated: new Date(Date.now() - 7200000).toISOString()
        })
      });
    });
    
    await dashboardPage.navigateToDashboard();
    
    // Step 5-6: Verify cached data warning
    const warningMessage = await dashboardPage.getCachedDataWarning();
    expect(warningMessage).toContain('cached data');
    expect(warningMessage).toContain('Real-time data unavailable');
    logger.info('Cached data warning displayed correctly');
  });

  test('QE-8173 TS-003 TC-001: Verify system returns zero/null KPI values when user has no credit cards', async ({ page }) => {
    logger.info('Starting test: QE-8173 TS-003 TC-001');
    
    // Step 1: Authenticate user with no cards
    await dashboardPage.authenticateUser('user999', 'valid-token-abc');
    
    // Step 2-4: Navigate to dashboard with no card data
    await page.route('**/api/dashboard/kpis', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          monthlySpend: 0,
          totalCreditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0,
          message: 'No credit card data available. Please add a credit card to view dashboard KPIs.'
        })
      });
    });
    
    await dashboardPage.navigateToDashboard();
    
    // Step 5-7: Verify zero values and message
    const kpiData = await dashboardPage.getKPIData();
    expect(kpiData.monthlySpend).toBe(0);
    expect(kpiData.totalCreditLimit).toBe(0);
    expect(kpiData.availableCredit).toBe(0);
    expect(kpiData.outstandingAmount).toBe(0);
    
    const noDataMessage = await dashboardPage.getNoDataMessage();
    expect(noDataMessage).toContain('No credit card data available');
    logger.info('Zero KPI values and no-data message verified successfully');
  });
});

test.describe('Responsive Multi-Device Dashboard Access - QE-8171', () => {
  let dashboardPage;

  test('QE-8171 TS-001 TC-001: Verify mobile device dashboard access with responsive layout within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-8171 TS-001 TC-001');
    
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Authenticate and navigate
    await dashboardPage.authenticateUser('user123', 'valid-token-xyz');
    
    const startTime = Date.now();
    await dashboardPage.navigateToDashboard();
    await dashboardPage.waitForKPIDataLoad();
    const loadTime = (Date.now() - startTime) / 1000;
    
    // Step 5: Verify load time under 2 seconds
    expect(loadTime).toBeLessThan(2);
    logger.info(`Mobile dashboard loaded in ${loadTime} seconds`);
    
    // Step 4: Verify responsive layout
    const isMobileLayout = await dashboardPage.verifyMobileLayout();
    expect(isMobileLayout).toBe(true);
    
    // Step 6: Verify all KPIs rendered correctly
    const kpiData = await dashboardPage.getKPIData();
    expect(kpiData.monthlySpend).toBeDefined();
    expect(kpiData.totalCreditLimit).toBeDefined();
    expect(kpiData.availableCredit).toBeDefined();
    expect(kpiData.outstandingAmount).toBeDefined();
    logger.info('Mobile responsive layout verified successfully');
  });

  test('QE-8171 TS-002 TC-001: Verify tablet device dashboard access with adaptive layout within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-8171 TS-002 TC-001');
    
    // Step 1: Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    dashboardPage = new DashboardPage(page);
    
    // Step 1-2: Authenticate and navigate
    await dashboardPage.authenticateUser('user123', 'valid-token-xyz');
    
    const startTime = Date.now();
    await dashboardPage.navigateToDashboard();
    await dashboardPage.waitForKPIDataLoad();
    const loadTime = (Date.now() - startTime) / 1000;
    
    // Step 5: Verify load time under 2 seconds
    expect(loadTime).toBeLessThan(2);
    logger.info(`Tablet dashboard loaded in ${loadTime} seconds`);
    
    // Step 4: Verify tablet layout
    const isTabletLayout = await dashboardPage.verifyTabletLayout();
    expect(isTabletLayout).toBe(true);
    
    // Step 6: Verify data integrity
    const kpiData = await dashboardPage.getKPIData();
    expect(kpiData.monthlySpend).toBe(4250.75);
    expect(kpiData.totalCreditLimit).toBe(50000);
    logger.info('Tablet responsive layout and data integrity verified');
  });

  test('QE-8171 TS-003 TC-001: Verify system fails to load KPI data within 2 seconds on slow network', async ({ page }) => {
    logger.info('Starting test: QE-8171 TS-003 TC-001');
    
    dashboardPage = new DashboardPage(page);
    
    // Step 1: Authenticate with slow network simulation
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 1500);
    });
    
    await dashboardPage.authenticateUser('user123', 'valid-token-xyz');
    
    // Step 2-4: Measure load time with network delay
    const startTime = Date.now();
    await dashboardPage.navigateToDashboard();
    
    try {
      await dashboardPage.waitForKPIDataLoad({ timeout: 2000 });
      const loadTime = (Date.now() - startTime) / 1000;
      expect(loadTime).toBeGreaterThan(2);
    } catch (error) {
      logger.info('Dashboard failed to load within 2 seconds as expected');
      // Step 5: Verify timeout or partial data error
      const errorMessage = await dashboardPage.getTimeoutError();
      expect(errorMessage).toMatch(/timeout|Request timeout|partial data/i);
      logger.info('Timeout error verified for slow network scenario');
    }
  });
});