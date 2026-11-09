const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { logger } = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to dashboard page');
  });

  test('TC-4992 - Verify four KPI metrics are prominently displayed on dashboard with correct values', async ({ page }) => {
    logger.info('Starting test: Verify four KPI metrics display');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toMatch(/\$[0-9,]+/);
    expect(totalLimit).toMatch(/\$[0-9,]+/);
    expect(availableCredit).toMatch(/\$[0-9,]+/);
    expect(outstanding).toMatch(/\$[0-9,]+/);
    
    logger.info('All four KPI metrics are displayed correctly');
  });

  test('TC-4993 - Verify dashboard displays cached data with warning when backend service is unavailable', async ({ page }) => {
    logger.info('Starting test: Backend service unavailable scenario');
    
    await page.route('**/api/kpi/**', route => route.abort());
    await page.reload();
    
    await expect(dashboardPage.warningBanner).toBeVisible();
    const warningText = await dashboardPage.warningBanner.textContent();
    expect(warningText).toContain('KPI data may not be current');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    logger.info('Cached data displayed with warning banner');
  });

  test('TC-4994 - Verify KPI metrics update to reflect multiple transactions made throughout the day', async ({ page }) => {
    logger.info('Starting test: KPI metrics update after transactions');
    
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    
    await page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ amount: 150, status: 'success' })
      });
    });
    
    await dashboardPage.refreshDashboard();
    await page.waitForTimeout(2000);
    
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    
    expect(updatedMonthlySpend).not.toBe(initialMonthlySpend);
    expect(updatedAvailableCredit).not.toBe(initialAvailableCredit);
    
    logger.info('KPI metrics updated successfully after transaction');
  });

  test('TC-5010 - Verify four KPI metrics display within 2 seconds load time for user with multiple active cards', async ({ page }) => {
    logger.info('Starting test: KPI load time performance');
    
    const startTime = Date.now();
    await dashboardPage.navigate();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    logger.info(`Dashboard loaded in ${loadTime}ms (within 2 second requirement)`);
  });

  test('TC-5011 - Verify all four KPI metrics display $0 with appropriate message when no credit cards are registered', async ({ page }) => {
    logger.info('Starting test: No credit cards scenario');
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ cards: [] })
      });
    });
    
    await page.reload();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toBe('$0');
    expect(totalLimit).toBe('$0');
    expect(availableCredit).toBe('$0');
    expect(outstanding).toBe('$0');
    
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.noCardsMessage.textContent();
    expect(messageText).toContain('No credit cards found');
    
    logger.info('No cards scenario validated successfully');
  });
});

test.describe('Real-Time KPI Refresh Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('TC-4995 - Verify real-time KPI refresh displays updated values within 2 seconds', async ({ page }) => {
    logger.info('Starting test: Real-time KPI refresh');
    
    const startTime = Date.now();
    await dashboardPage.refreshDashboard();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const refreshTime = Date.now() - startTime;
    
    expect(refreshTime).toBeLessThan(2000);
    logger.info(`KPI refresh completed in ${refreshTime}ms`);
  });

  test('TC-4996 - Verify error message displays when network connectivity issue occurs during KPI refresh', async ({ page }) => {
    logger.info('Starting test: Network connectivity error');
    
    await page.route('**/api/kpi/**', route => route.abort());
    await dashboardPage.refreshDashboard();
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Unable to refresh data');
    
    logger.info('Network error handled correctly');
  });

  test('TC-4997 - Verify automatic dashboard refresh updates KPI metrics without manual user action', async ({ page }) => {
    logger.info('Starting test: Automatic dashboard refresh');
    
    const initialValue = await dashboardPage.getMonthlySpendValue();
    
    await page.route('**/api/kpi/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          monthlySpend: 2650,
          totalCreditLimit: 35000,
          availableCredit: 24850,
          outstandingAmount: 10150
        })
      });
    });
    
    await page.waitForTimeout(5000);
    
    const updatedValue = await dashboardPage.getMonthlySpendValue();
    expect(updatedValue).not.toBe(initialValue);
    
    logger.info('Automatic refresh validated successfully');
  });
});

test.describe('Monthly Spend KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('TC-5013 - Verify monthly spend KPI displays prominently with correct total amount', async ({ page }) => {
    logger.info('Starting test: Monthly spend KPI display');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const value = await dashboardPage.getMonthlySpendValue();
    
    expect(value).toMatch(/\$[0-9,]+/);
    
    const fontSize = await dashboardPage.monthlySpendKPI.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    expect(parseInt(fontSize)).toBeGreaterThan(20);
    
    logger.info('Monthly spend KPI displayed prominently');
  });

  test('TC-5014 - Verify monthly spend KPI displays $0 with appropriate message when no transactions exist', async ({ page }) => {
    logger.info('Starting test: No transactions scenario');
    
    await page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ transactions: [] })
      });
    });
    
    await page.reload();
    
    const value = await dashboardPage.getMonthlySpendValue();
    expect(value).toBe('$0');
    
    await expect(dashboardPage.noSpendingMessage).toBeVisible();
    const messageText = await dashboardPage.noSpendingMessage.textContent();
    expect(messageText).toContain('No spending activity this month');
    
    logger.info('No transactions scenario validated');
  });
});
