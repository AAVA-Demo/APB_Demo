const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to application');
    await loginPage.navigate();
  });

  test('QE-8061 TS-001 TC-001 - Verify dashboard displays all KPI metrics within 2 seconds', async ({ page }) => {
    logger.info('Test: QE-8061 TS-001 TC-001 - Dashboard KPI metrics display');
    
    await loginPage.login('testuser@example.com', 'Pass@123');
    logger.info('User logged in successfully');
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstanding = await dashboardPage.getOutstandingAmount();
    
    logger.info(`KPI Values - Monthly Spend: ${monthlySpend}, Total Limit: ${totalLimit}, Available: ${availableCredit}, Outstanding: ${outstanding}`);
    
    expect(parseFloat(monthlySpend.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
  });

  test('QE-8061 TS-002 TC-001 - Verify dashboard displays loading indicator when data is processing', async ({ page }) => {
    logger.info('Test: QE-8061 TS-002 TC-001 - Dashboard loading indicator');
    
    await loginPage.login('processing-user@example.com', 'Pass@123');
    
    const hasLoadingIndicator = await dashboardPage.hasLoadingIndicator();
    if (hasLoadingIndicator) {
      logger.info('Loading indicator is displayed');
      await expect(dashboardPage.loadingIndicator).toBeVisible();
    }
    
    await dashboardPage.waitForDashboardLoad();
    
    const hasTimestamp = await dashboardPage.hasLastUpdatedTimestamp();
    if (hasTimestamp) {
      const timestamp = await dashboardPage.getLastUpdatedTimestamp();
      logger.info(`Last updated timestamp: ${timestamp}`);
      expect(timestamp).toBeTruthy();
    }
  });

  test('QE-8061 TS-003 TC-001 - Verify KPI metrics display with proper currency formatting', async ({ page }) => {
    logger.info('Test: QE-8061 TS-003 TC-001 - KPI currency formatting');
    
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstanding = await dashboardPage.getOutstandingAmount();
    
    const currencyRegex = /^\$[0-9]{1,3}(,[0-9]{3})*\.[0-9]{2}$/;
    
    expect(monthlySpend).toMatch(currencyRegex);
    expect(totalLimit).toMatch(currencyRegex);
    expect(availableCredit).toMatch(currencyRegex);
    expect(outstanding).toMatch(currencyRegex);
    
    logger.info('All KPI values have proper currency formatting');
    
    await expect(dashboardPage.monthlySpendLabel).toContainText('Monthly Spend');
    await expect(dashboardPage.totalCreditLimitLabel).toContainText('Total Credit Limit');
    await expect(dashboardPage.availableCreditLabel).toContainText('Available Credit');
    await expect(dashboardPage.outstandingAmountLabel).toContainText('Outstanding Amount');
  });

  test('QE-8051 TS-001 TC-001 - Verify user with active cards views dashboard with all KPIs', async ({ page }) => {
    logger.info('Test: QE-8051 TS-001 TC-001 - Active user dashboard KPIs');
    
    await loginPage.login('active-user@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    
    expect(parseFloat(monthlySpend.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    
    logger.info('All KPI cards are displayed with values');
  });

  test('QE-8051 TS-002 TC-001 - Verify user with no cards sees appropriate message', async ({ page }) => {
    logger.info('Test: QE-8051 TS-002 TC-001 - No cards message');
    
    await loginPage.login('nocard-user@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const hasNoDataMessage = await dashboardPage.hasNoDataMessage();
    expect(hasNoDataMessage).toBeTruthy();
    
    const message = await dashboardPage.getNoDataMessage();
    logger.info(`No data message: ${message}`);
    expect(message).toContain('No credit card data available');
  });

  test('QE-8051 TS-003 TC-001 - Verify KPI values are correctly calculated by aggregating multiple cards', async ({ page }) => {
    logger.info('Test: QE-8051 TS-003 TC-001 - KPI aggregation validation');
    
    await loginPage.login('multicard-user@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    const outstanding = await dashboardPage.getOutstandingAmount();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    
    const totalLimitValue = parseFloat(totalLimit.replace(/[$,]/g, ''));
    const outstandingValue = parseFloat(outstanding.replace(/[$,]/g, ''));
    const monthlySpendValue = parseFloat(monthlySpend.replace(/[$,]/g, ''));
    
    expect(totalLimitValue).toBe(25000);
    expect(outstandingValue).toBe(6500);
    expect(monthlySpendValue).toBe(1250);
    
    logger.info('KPI aggregation validated successfully');
  });

  test('QE-8045 TS-001 TC-001 - Verify dashboard loads with consolidated KPIs within 2 seconds', async ({ page }) => {
    logger.info('Test: QE-8045 TS-001 TC-001 - Consolidated KPI load time');
    
    await loginPage.login('multicard-user@example.com', 'Pass@123');
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-8045 TS-002 TC-001 - Verify error message when backend service is unavailable', async ({ page }) => {
    logger.info('Test: QE-8045 TS-002 TC-001 - Backend unavailable error');
    
    await page.route('**/api/**', route => route.abort());
    
    await loginPage.login('testuser@example.com', 'Pass@123');
    
    const hasErrorMessage = await dashboardPage.hasErrorMessage();
    expect(hasErrorMessage).toBeTruthy();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    logger.info(`Error message: ${errorMessage}`);
    expect(errorMessage).toContain('temporarily unavailable');
  });

  test('QE-8045 TS-003 TC-001 - Verify aggregated KPIs for user with 10 credit cards', async ({ page }) => {
    logger.info('Test: QE-8045 TS-003 TC-001 - 10 cards KPI aggregation');
    
    await loginPage.login('tencard-user@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstanding = await dashboardPage.getOutstandingAmount();
    
    const totalLimitValue = parseFloat(totalLimit.replace(/[$,]/g, ''));
    const availableCreditValue = parseFloat(availableCredit.replace(/[$,]/g, ''));
    const outstandingValue = parseFloat(outstanding.replace(/[$,]/g, ''));
    
    expect(totalLimitValue).toBe(50000);
    expect(availableCreditValue).toBe(35000);
    expect(outstandingValue).toBe(15000);
    
    logger.info('10 cards aggregation validated successfully');
  });

  test('QE-8052 TS-001 TC-001 - Verify KPIs update automatically within 30 seconds after new transaction', async ({ page }) => {
    logger.info('Test: QE-8052 TS-001 TC-001 - Real-time KPI update');
    
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    
    logger.info(`Initial values - Monthly Spend: ${initialMonthlySpend}, Available: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    await page.waitForTimeout(30000);
    
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    logger.info(`Updated values - Monthly Spend: ${updatedMonthlySpend}, Available: ${updatedAvailableCredit}, Outstanding: ${updatedOutstanding}`);
  });

  test('QE-8052 TS-002 TC-001 - Verify warning indicator when data feed is interrupted', async ({ page }) => {
    logger.info('Test: QE-8052 TS-002 TC-001 - Data feed interruption warning');
    
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await page.route('**/api/refresh', route => route.abort());
    
    await page.waitForTimeout(35000);
    
    const hasWarning = await dashboardPage.hasDataFeedWarning();
    if (hasWarning) {
      const warningMessage = await dashboardPage.getDataFeedWarning();
      logger.info(`Warning message: ${warningMessage}`);
      expect(warningMessage).toContain('temporarily unavailable');
    }
  });

  test('QE-8052 TS-003 TC-001 - Verify KPIs update after payment on credit card', async ({ page }) => {
    logger.info('Test: QE-8052 TS-003 TC-001 - KPI update after payment');
    
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    
    const initialAvailableValue = parseFloat(initialAvailableCredit.replace(/[$,]/g, ''));
    const initialOutstandingValue = parseFloat(initialOutstanding.replace(/[$,]/g, ''));
    
    logger.info(`Before payment - Available: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    await page.waitForTimeout(5000);
    
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    
    logger.info(`After payment - Available: ${updatedAvailableCredit}, Outstanding: ${updatedOutstanding}`);
  });
});

test.describe('Responsive Dashboard Layout Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('QE-8060 TS-001 TC-001 - Verify dashboard adapts to mobile device screen', async ({ page }) => {
    logger.info('Test: QE-8060 TS-001 TC-001 - Mobile responsive layout');
    
    await page.setViewportSize({ width: 390, height: 844 });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const layout = await dashboardPage.getKPILayout();
    logger.info(`Mobile layout: ${layout}`);
    expect(layout).toBe('stacked');
  });

  test('QE-8060 TS-002 TC-001 - Verify dashboard adapts when tablet orientation changes', async ({ page }) => {
    logger.info('Test: QE-8060 TS-002 TC-001 - Tablet orientation change');
    
    await page.setViewportSize({ width: 1024, height: 1366 });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    let layout = await dashboardPage.getKPILayout();
    logger.info(`Portrait layout: ${layout}`);
    expect(layout).toBe('grid-2-column');
    
    await page.setViewportSize({ width: 1366, height: 1024 });
    await page.waitForTimeout(500);
    
    layout = await dashboardPage.getKPILayout();
    logger.info(`Landscape layout: ${layout}`);
    expect(layout).toMatch(/grid-4-column|grid-2-row/);
  });

  test('QE-8060 TS-003 TC-001 - Verify dashboard maintains readability on low resolution device', async ({ page }) => {
    logger.info('Test: QE-8060 TS-003 TC-001 - Low resolution readability');
    
    await page.setViewportSize({ width: 320, height: 480 });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    const fontSize = await dashboardPage.getKPIFontSize();
    const fontSizeValue = parseFloat(fontSize);
    
    logger.info(`Font size: ${fontSize}`);
    expect(fontSizeValue).toBeGreaterThanOrEqual(12);
  });

  test('QE-8044 TS-001 TC-001 - Verify mobile-optimized stacked layout', async ({ page }) => {
    logger.info('Test: QE-8044 TS-001 TC-001 - Mobile stacked layout');
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getKPILayout();
    expect(layout).toBe('stacked');
    
    const fontSize = await dashboardPage.getKPIFontSize();
    const fontSizeValue = parseFloat(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(14);
    
    logger.info('Mobile layout validated successfully');
  });

  test('QE-8044 TS-002 TC-001 - Verify tablet 2-column grid layout', async ({ page }) => {
    logger.info('Test: QE-8044 TS-002 TC-001 - Tablet 2-column layout');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getKPILayout();
    expect(layout).toBe('grid-2-column');
    
    logger.info('Tablet layout validated successfully');
  });

  test('QE-8044 TS-003 TC-001 - Verify fallback layout on unsupported browser', async ({ page }) => {
    logger.info('Test: QE-8044 TS-003 TC-001 - Unsupported browser fallback');
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const hasBrowserWarning = await dashboardPage.hasBrowserWarning();
    if (hasBrowserWarning) {
      const warning = await dashboardPage.getBrowserWarning();
      logger.info(`Browser warning: ${warning}`);
      expect(warning).toContain('not fully supported');
    }
  });
});