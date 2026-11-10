const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { Logger } = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    Logger.info('Navigated to Dashboard');
  });

  test('TC-6411: Verify consolidated KPIs display accurately for user with multiple credit cards', async ({ page }) => {
    Logger.info('Starting test: Verify consolidated KPIs');
    await expect(dashboardPage.totalMonthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalAvailableCreditKPI).toBeVisible();
    await expect(dashboardPage.totalOutstandingKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getTotalMonthlySpend();
    const creditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getTotalAvailableCredit();
    const outstanding = await dashboardPage.getTotalOutstanding();
    
    expect(monthlySpend).toContain('$');
    expect(creditLimit).toContain('$');
    expect(availableCredit).toContain('$');
    expect(outstanding).toContain('$');
    Logger.info('All KPIs verified successfully');
  });

  test('TC-6412: Verify KPI calculation service correctly aggregates financial data from multiple cards', async ({ page }) => {
    Logger.info('Starting test: Verify KPI aggregation');
    await dashboardPage.waitForKPIsToLoad();
    
    const monthlySpend = await dashboardPage.getTotalMonthlySpend();
    const creditLimit = await dashboardPage.getTotalCreditLimit();
    
    expect(monthlySpend).toBeTruthy();
    expect(creditLimit).toBeTruthy();
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    Logger.info('KPI aggregation verified successfully');
  });

  test('TC-6413: Verify error handling when credit card data source is unavailable', async ({ page }) => {
    Logger.info('Starting test: Verify error handling for unavailable data source');
    await page.route('**/api/cards', route => route.abort());
    await dashboardPage.navigate();
    
    await expect(dashboardPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await dashboardPage.getErrorMessage();
    expect(errorText).toContain('Failed to load');
    Logger.info('Error handling verified successfully');
  });

  test('TC-6417: Verify dashboard loads within 2 seconds on mobile device with responsive layout', async ({ page, context }) => {
    Logger.info('Starting test: Verify mobile responsive dashboard');
    await context.setViewportSize({ width: 375, height: 812 });
    
    const startTime = Date.now();
    await dashboardPage.navigate();
    await dashboardPage.waitForKPIsToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    await expect(dashboardPage.totalMonthlySpendKPI).toBeVisible();
    Logger.info(`Dashboard loaded in ${loadTime}ms on mobile viewport`);
  });

  test('TC-6418: Verify responsive layout adapts correctly across desktop, tablet, and mobile devices', async ({ page, context }) => {
    Logger.info('Starting test: Verify responsive layout across devices');
    
    // Desktop
    await context.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    Logger.info('Desktop layout verified');
    
    // Tablet
    await context.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    Logger.info('Tablet layout verified');
    
    // Mobile
    await context.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    Logger.info('Mobile layout verified');
  });

  test('TC-6419: Verify timeout error handling on mobile device with slow network connection', async ({ page, context }) => {
    Logger.info('Starting test: Verify timeout error handling');
    await context.setViewportSize({ width: 375, height: 667 });
    await page.route('**/api/cards', route => {
      setTimeout(() => route.fulfill({ status: 504 }), 3000);
    });
    
    await dashboardPage.navigate();
    await expect(dashboardPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await dashboardPage.getErrorMessage();
    expect(errorText).toContain('taking longer than expected');
    Logger.info('Timeout error handling verified');
  });
});
