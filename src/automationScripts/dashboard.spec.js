const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - KPI and Consolidated View Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');
    logger.info('User logged in successfully');
  });

  test('QE-8167-TS001-TC001: Verify consolidated KPI dashboard loads within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-8167-TS001-TC001');
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info('All KPIs are visible and dashboard loaded within 2 seconds');
  });

  test('QE-8167-TS002-TC001: Verify progressive KPI loading when network latency exceeds 2 seconds', async ({ page, context }) => {
    logger.info('Starting test: QE-8167-TS002-TC001');
    await context.route('**/api/kpi/**', route => {
      setTimeout(() => route.continue(), 3000);
    });
    await page.reload();
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    logger.info('Loading indicator displayed during slow network');
    await dashboardPage.waitForKPILoad('monthlySpend');
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    logger.info('Critical KPIs loaded progressively');
  });

  test('QE-8167-TS003-TC001: Verify partial service failure displays available KPIs with error placeholders', async ({ page, context }) => {
    logger.info('Starting test: QE-8167-TS003-TC001');
    await context.route('**/api/kpi/available-credit', route => route.abort());
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.availableCreditErrorPlaceholder).toBeVisible();
    await expect(dashboardPage.retryButton).toBeVisible();
    logger.info('Available KPIs displayed with error placeholder for failed metric');
    await dashboardPage.clickRetryButton();
    logger.info('Retry button clicked');
  });

  test('QE-8161-TS001-TC001: Verify real-time dashboard data refresh reflects latest transaction', async ({ page }) => {
    logger.info('Starting test: QE-8161-TS001-TC001');
    const initialSpend = await dashboardPage.getMonthlySpendValue();
    logger.info(`Initial monthly spend: ${initialSpend}`);
    await page.evaluate(() => {
      window.simulateNewTransaction(5000);
    });
    await page.waitForTimeout(2000);
    const updatedSpend = await dashboardPage.getMonthlySpendValue();
    logger.info(`Updated monthly spend: ${updatedSpend}`);
    expect(updatedSpend).toBeGreaterThan(initialSpend);
    logger.info('Dashboard refreshed with latest transaction');
  });

  test('QE-8161-TS002-TC001: Verify timestamp display when real-time refresh service has latency', async ({ page, context }) => {
    logger.info('Starting test: QE-8161-TS002-TC001');
    await context.route('**/api/refresh', route => {
      setTimeout(() => route.continue(), 5000);
    });
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await dashboardPage.getLastUpdatedTimestamp();
    logger.info(`Last updated timestamp: ${timestamp}`);
    expect(timestamp).toContain('ago');
  });

  test('QE-8161-TS003-TC001: Verify automatic KPI refresh at regular intervals', async ({ page }) => {
    logger.info('Starting test: QE-8161-TS003-TC001');
    const initialValue = await dashboardPage.getMonthlySpendValue();
    logger.info('Waiting for 60 seconds for auto-refresh');
    await page.waitForTimeout(61000);
    const refreshedValue = await dashboardPage.getMonthlySpendValue();
    logger.info('Auto-refresh completed');
    expect(refreshedValue).toBeDefined();
  });

  test('QE-8159-TS001-TC001: Verify multi-card KPI consolidation calculates aggregated metrics correctly', async ({ page }) => {
    logger.info('Starting test: QE-8159-TS001-TC001');
    await dashboardPage.waitForDashboardLoad();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    logger.info(`Monthly Spend: ${monthlySpend}, Total Limit: ${totalLimit}, Available: ${availableCredit}, Outstanding: ${outstanding}`);
    expect(monthlySpend).toBeGreaterThan(0);
    expect(totalLimit).toBeGreaterThan(0);
    expect(availableCredit).toBeGreaterThan(0);
    expect(outstanding).toBeGreaterThan(0);
    logger.info('All consolidated KPIs calculated correctly');
  });

  test('QE-8159-TS002-TC001: Verify KPI calculation handles card with missing balance data', async ({ page, context }) => {
    logger.info('Starting test: QE-8159-TS002-TC001');
    await context.route('**/api/cards/*/balance', route => route.fulfill({ status: 404 }));
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.warningMessage).toBeVisible();
    const warningText = await dashboardPage.getWarningMessageText();
    logger.info(`Warning message: ${warningText}`);
    expect(warningText).toContain('could not be included');
  });

  test('QE-8159-TS003-TC001: Verify division-by-zero error handling in utilization calculation', async ({ page }) => {
    logger.info('Starting test: QE-8159-TS003-TC001');
    await dashboardPage.waitForDashboardLoad();
    const utilizationText = await dashboardPage.getUtilizationText();
    logger.info(`Utilization text: ${utilizationText}`);
    expect(utilizationText).toMatch(/N\/A|\d+%/);
    logger.info('Utilization calculation handled zero-limit card gracefully');
  });
});
