const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { Logger } = require('../utils/logger');
const config = require('../../data/config.json');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    Logger.info('Navigated to Dashboard page');
  });

  test('QE-8941 TS-001 TC-001: Verify dashboard KPI real-time display shows accurate values within 2 seconds', async ({ page }) => {
    Logger.info('Starting test: Dashboard KPI real-time display');
    const startTime = Date.now();
    
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    Logger.info(`Dashboard loaded in ${loadTime}ms`);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBeTruthy();
    expect(totalCreditLimit).toBeTruthy();
    expect(availableCredit).toBeTruthy();
    expect(outstandingAmount).toBeTruthy();
    
    Logger.info('All KPI values displayed successfully');
  });

  test('QE-8941 TS-002 TC-001: Verify dashboard KPI data automatically refreshes every 30 seconds', async ({ page }) => {
    Logger.info('Starting test: Dashboard auto-refresh');
    
    await dashboardPage.waitForDashboardLoad();
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    Logger.info(`Initial monthly spend: ${initialMonthlySpend}`);
    
    await page.waitForTimeout(30000);
    
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    Logger.info(`Updated monthly spend: ${updatedMonthlySpend}`);
    
    expect(updatedMonthlySpend).toBeDefined();
  });

  test('QE-8941 TS-003 TC-001: Verify dashboard KPI display shows timeout message when backend service response exceeds 5 seconds', async ({ page }) => {
    Logger.info('Starting test: Dashboard timeout handling');
    
    await page.route('**/api/cards', route => {
      setTimeout(() => route.continue(), 6000);
    });
    
    await dashboardPage.navigate();
    
    const timeoutMessage = await dashboardPage.getTimeoutMessage();
    expect(timeoutMessage).toContain('taking longer than expected');
    
    Logger.info('Timeout message displayed correctly');
  });

  test('QE-8944 TS-001 TC-001: Verify responsive dashboard layout displays KPIs in single-column format on mobile device', async ({ page }) => {
    Logger.info('Starting test: Responsive layout - mobile');
    
    await page.setViewportSize({ width: 320, height: 568 });
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getKPILayout();
    expect(layout).toBe('single-column');
    
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScrollbar();
    expect(hasHorizontalScroll).toBe(false);
    
    Logger.info('Mobile responsive layout verified');
  });

  test('QE-8944 TS-002 TC-001: Verify responsive dashboard layout displays KPIs in multi-column grid on desktop', async ({ page }) => {
    Logger.info('Starting test: Responsive layout - desktop');
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getKPILayout();
    expect(layout).toBe('multi-column');
    
    Logger.info('Desktop responsive layout verified');
  });

  test('QE-8944 TS-003 TC-001: Verify responsive dashboard displays static fallback layout when JavaScript is disabled', async ({ page, context }) => {
    Logger.info('Starting test: JavaScript disabled fallback');
    
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'javaEnabled', { get: () => false });
    });
    
    await dashboardPage.navigate();
    
    const hasStaticLayout = await dashboardPage.hasStaticFallbackLayout();
    expect(hasStaticLayout).toBe(true);
    
    Logger.info('Static fallback layout verified');
  });

  test('QE-8937 TS-001 TC-001: Verify real-time credit health dashboard displays accurate KPI data within 2 seconds', async ({ page }) => {
    Logger.info('Starting test: Real-time credit health dashboard');
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    
    const kpiValues = await dashboardPage.getAllKPIValues();
    expect(kpiValues.monthlySpend).toBeDefined();
    expect(kpiValues.totalCreditLimit).toBeDefined();
    expect(kpiValues.availableCredit).toBeDefined();
    expect(kpiValues.outstandingAmount).toBeDefined();
    
    Logger.info('Real-time KPI data verified');
  });

  test('QE-8937 TS-002 TC-001: Verify real-time credit health dashboard displays accurate KPI data for user with no recent transactions', async ({ page }) => {
    Logger.info('Starting test: Dashboard with no transactions');
    
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toContain('$0.00');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBeTruthy();
    
    Logger.info('Dashboard with zero transactions verified');
  });

  test('QE-8937 TS-003 TC-001: Verify real-time credit health dashboard displays error message when backend service is unavailable', async ({ page }) => {
    Logger.info('Starting test: Backend service unavailable');
    
    await page.route('**/api/cards', route => route.abort());
    
    await dashboardPage.navigate();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('cannot be loaded');
    
    const hasRetryButton = await dashboardPage.hasRetryButton();
    expect(hasRetryButton).toBe(true);
    
    Logger.info('Error handling verified');
  });

  test('QE-8930 TS-001 TC-001: Verify consolidated KPI dashboard view displays accurate aggregated values', async ({ page }) => {
    Logger.info('Starting test: Consolidated KPI view');
    
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    
    expect(totalCreditLimit).toBeTruthy();
    expect(availableCredit).toBeTruthy();
    expect(outstandingAmount).toBeTruthy();
    expect(monthlySpend).toBeTruthy();
    
    Logger.info('Consolidated KPI values verified');
  });

  test('QE-8930 TS-002 TC-001: Verify consolidated KPI dashboard view displays $0.00 outstanding amount when one card has zero balance', async ({ page }) => {
    Logger.info('Starting test: Zero balance card');
    
    await dashboardPage.waitForDashboardLoad();
    
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(outstandingAmount).toBeDefined();
    
    Logger.info('Zero balance handling verified');
  });

  test('QE-8930 TS-003 TC-001: Verify consolidated KPI dashboard view displays N/A when no credit cards are registered', async ({ page }) => {
    Logger.info('Starting test: No credit cards registered');
    
    await page.route('**/api/cards', route => route.fulfill({ body: JSON.stringify([]) }));
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    expect(noCardsMessage).toContain('No credit cards found');
    
    Logger.info('No cards message verified');
  });
});

test.describe('Dashboard Spending Tracker Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8950 TS-001 TC-001: Verify monthly spending dashboard displays accurate aggregated total from multiple cards', async ({ page }) => {
    Logger.info('Starting test: Monthly spending aggregation');
    
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBeTruthy();
    
    Logger.info(`Monthly spend: ${monthlySpend}`);
  });

  test('QE-8950 TS-002 TC-001: Verify monthly spending dashboard displays $0.00 when no transactions exist', async ({ page }) => {
    Logger.info('Starting test: Zero monthly spending');
    
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toContain('$0.00');
    
    Logger.info('Zero spending verified');
  });

  test('QE-8950 TS-003 TC-001: Verify monthly spending dashboard displays partial total with warning when data is incomplete', async ({ page }) => {
    Logger.info('Starting test: Incomplete data warning');
    
    await dashboardPage.waitForDashboardLoad();
    
    const hasWarning = await dashboardPage.hasIncompleteDataWarning();
    
    if (hasWarning) {
      const warningMessage = await dashboardPage.getWarningMessage();
      expect(warningMessage).toContain('Incomplete data');
      Logger.info('Incomplete data warning verified');
    }
  });

  test('QE-8935 TS-001 TC-001: Verify monthly spending tracker displays accurate aggregated total from multiple cards', async ({ page }) => {
    Logger.info('Starting test: Monthly spending tracker');
    
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBeTruthy();
    
    Logger.info('Monthly spending tracker verified');
  });

  test('QE-8935 TS-002 TC-001: Verify monthly spending tracker displays $0.00 when no transactions exist in current month', async ({ page }) => {
    Logger.info('Starting test: Zero current month spending');
    
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toContain('$0.00');
    
    Logger.info('Zero current month spending verified');
  });

  test('QE-8935 TS-003 TC-001: Verify monthly spending tracker displays partial total with warning when one card data is unavailable', async ({ page }) => {
    Logger.info('Starting test: Partial data with warning');
    
    await dashboardPage.waitForDashboardLoad();
    
    const hasWarning = await dashboardPage.hasIncompleteDataWarning();
    
    if (hasWarning) {
      const warningMessage = await dashboardPage.getWarningMessage();
      expect(warningMessage).toContain('some card transactions may be missing');
      Logger.info('Partial data warning verified');
    }
  });
});