const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard - Consolidated KPI View', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to Credit Card Dashboard application');
    await dashboardPage.navigate();
  });

  // Test Case ID: 5883 - QE-8958 TS-001 TC-001
  test('TC-5883: Verify user with multiple credit cards can view all four KPIs on the dashboard within 2 seconds', async ({ page }) => {
    logger.info('Test Case 5883: Starting KPI dashboard load time test');
    
    await dashboardPage.login('testuser_3cards', 'Pass@123');
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const outstandingAmount = await dashboardPage.getKPIValue('outstandingAmount');
    
    logger.info(`KPI Values - Monthly Spend: ${monthlySpend}, Total Credit Limit: ${totalCreditLimit}, Available Credit: ${availableCredit}, Outstanding Amount: ${outstandingAmount}`);
    
    expect(monthlySpend).toBeTruthy();
    expect(totalCreditLimit).toBeTruthy();
    expect(availableCredit).toBeTruthy();
    expect(outstandingAmount).toBeTruthy();
  });

  // Test Case ID: 5884 - QE-8958 TS-001 TC-002
  test('TC-5884: Verify KPI values are accurately calculated for a single credit card', async ({ page }) => {
    logger.info('Test Case 5884: Verifying KPI accuracy for single card');
    
    await dashboardPage.login('testuser_1card', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const totalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const availableCredit = await dashboardPage.getKPIValue('availableCredit');
    const outstandingAmount = await dashboardPage.getKPIValue('outstandingAmount');
    
    logger.info(`Single Card KPI Values - Monthly Spend: ${monthlySpend}, Total Credit Limit: ${totalCreditLimit}, Available Credit: ${availableCredit}, Outstanding Amount: ${outstandingAmount}`);
    
    expect(monthlySpend).toMatch(/\$1,250\.00/);
    expect(totalCreditLimit).toMatch(/\$5,000\.00/);
    expect(availableCredit).toMatch(/\$3,750\.00/);
    expect(outstandingAmount).toMatch(/\$1,250\.00/);
  });

  // Test Case ID: 5885 - QE-8958 TS-002 TC-001
  test('TC-5885: Verify dashboard displays error message when credit card data service is unavailable', async ({ page }) => {
    logger.info('Test Case 5885: Testing service unavailability handling');
    
    // Simulate service unavailability by intercepting API calls
    await page.route('**/api/cards', route => route.abort());
    await page.route('**/api/transactions', route => route.abort());
    
    await dashboardPage.login('testuser', 'Pass@123');
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    logger.info(`Error message displayed: ${errorText}`);
    
    expect(errorText).toContain('Unable to load');
    
    // Verify application remains responsive
    await expect(dashboardPage.navigationMenu).toBeVisible();
    
    // Verify no incorrect placeholder values
    const kpiSections = await page.locator('.panel').all();
    for (const section of kpiSections) {
      const text = await section.textContent();
      expect(text).not.toContain('$0.00');
    }
  });

  // Test Case ID: 5886 - QE-8958 TS-003 TC-001
  test('TC-5886: Verify KPI dashboard layout is responsive on desktop, tablet, and mobile devices', async ({ page }) => {
    logger.info('Test Case 5886: Testing responsive layout across devices');
    
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    // Desktop view (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(dashboardPage.kpiContainer).toBeVisible();
    logger.info('Desktop layout verified');
    
    // Tablet view (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(dashboardPage.kpiContainer).toBeVisible();
    logger.info('Tablet layout verified');
    
    // Mobile view (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(dashboardPage.kpiContainer).toBeVisible();
    logger.info('Mobile layout verified');
    
    // Verify KPI values remain consistent
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    expect(monthlySpend).toBeTruthy();
  });
});

test.describe('Dashboard - Real-Time Credit Utilization Tracking', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  // Test Case ID: 5893 - QE-8956 TS-001 TC-001
  test('TC-5893: Verify dashboard automatically updates available credit and outstanding amount when a new transaction is processed', async ({ page }) => {
    logger.info('Test Case 5893: Testing real-time transaction update');
    
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const initialOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    logger.info(`Initial values - Available Credit: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    // Simulate new transaction by mocking API response
    await page.route('**/api/transactions', route => {
      const response = route.request().url().includes('month') ? 
        [{ amount: 100, category: 'Shopping', transactionDate: new Date().toISOString() }] : [];
      route.fulfill({ body: JSON.stringify(response) });
    });
    
    // Wait for auto-refresh (up to 30 seconds)
    await page.waitForTimeout(30000);
    
    const updatedAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const updatedOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    logger.info(`Updated values - Available Credit: ${updatedAvailableCredit}, Outstanding: ${updatedOutstanding}`);
    
    expect(updatedAvailableCredit).not.toBe(initialAvailableCredit);
    expect(updatedOutstanding).not.toBe(initialOutstanding);
  });

  // Test Case ID: 5895 - QE-8956 TS-002 TC-001
  test('TC-5895: Verify dashboard displays last known values with timestamp and warning when transaction service is unavailable', async ({ page }) => {
    logger.info('Test Case 5895: Testing service unavailability with last known values');
    
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const initialOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    logger.info(`Last known values - Available Credit: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    // Simulate service unavailability
    await page.route('**/api/transactions', route => route.abort());
    
    await page.waitForTimeout(30000);
    
    const currentAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const currentOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    expect(currentAvailableCredit).toBe(initialAvailableCredit);
    expect(currentOutstanding).toBe(initialOutstanding);
    
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    await expect(dashboardPage.warningIndicator).toBeVisible();
    
    const warningText = await dashboardPage.warningIndicator.textContent();
    logger.info(`Warning message: ${warningText}`);
    expect(warningText).toContain('Data may not be current');
  });

  // Test Case ID: 5897 - QE-8956 TS-003 TC-001
  test('TC-5897: Verify dashboard reflects updated available credit and outstanding amount after a payment is processed', async ({ page }) => {
    logger.info('Test Case 5897: Testing payment processing update');
    
    await dashboardPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const initialOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    logger.info(`Before payment - Available Credit: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    // Simulate payment processing
    await page.route('**/api/cards', route => {
      const response = [{ 
        creditLimit: 5000, 
        availableCredit: 3500, 
        currentBalance: 1500 
      }];
      route.fulfill({ body: JSON.stringify(response) });
    });
    
    await page.waitForTimeout(30000);
    
    const updatedAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    const updatedOutstanding = await dashboardPage.getKPIValue('outstandingAmount');
    
    logger.info(`After payment - Available Credit: ${updatedAvailableCredit}, Outstanding: ${updatedOutstanding}`);
    
    expect(updatedAvailableCredit).toMatch(/\$3,500/);
    expect(updatedOutstanding).toMatch(/\$1,500/);
  });
});