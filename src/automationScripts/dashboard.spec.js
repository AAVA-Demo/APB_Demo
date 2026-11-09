const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

// Test Suite: Dashboard KPIs and Financial Overview
test.describe('Dashboard KPIs and Financial Overview', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login(testData.users.activeUser.username, testData.users.activeUser.password);
  });

  // Test Case: QE-9053 TS-001 TC-001
  test('TC-001: Verify authenticated user with active credit cards views consolidated KPIs loaded within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;

    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    
    expect(loadTime).toBeLessThan(2000);
  });

  // Test Case: QE-9053 TS-002 TC-001
  test('TC-002: Verify KPI values are calculated correctly by aggregating data across all active credit cards', async ({ page }) => {
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();

    const kpiData = await dashboardPage.getKPIValues();
    
    expect(kpiData.totalCreditLimit).toBe(testData.expectedKPIs.totalCreditLimit);
    expect(kpiData.availableCredit).toBe(testData.expectedKPIs.availableCredit);
    expect(kpiData.outstandingAmount).toBe(testData.expectedKPIs.outstandingAmount);
    expect(kpiData.creditUtilization).toBeCloseTo(testData.expectedKPIs.creditUtilization, 1);
  });

  // Test Case: QE-9053 TS-003 TC-001
  test('TC-003: Verify authenticated user with no active credit cards receives appropriate message on dashboard', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login(testData.users.noCardUser.username, testData.users.noCardUser.password);
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();

    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText('No active credit cards found');
    await expect(dashboardPage.addCardButton).toBeVisible();
  });

  // Test Case: QE-9055 TS-001 TC-001
  test('TC-004: Verify financial overview dashboard displays in multi-column grid layout on desktop browser', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();

    const layout = await dashboardPage.getKPIWidgetLayout();
    expect(layout.columns).toBeGreaterThan(1);
    expect(layout.hasHorizontalScroll).toBe(false);
    
    await expect(dashboardPage.kpiWidgetContainer).toBeVisible();
  });

  // Test Case: QE-9055 TS-002 TC-001
  test('TC-005: Verify financial overview dashboard adjusts to single-column stacked view on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();

    const layout = await dashboardPage.getKPIWidgetLayout();
    expect(layout.columns).toBe(1);
    expect(layout.hasHorizontalScroll).toBe(false);
    
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
  });

  // Test Case: QE-9055 TS-003 TC-001
  test('TC-006: Verify dashboard maintains minimum usability on extremely narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 667 });
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();

    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    
    const layout = await dashboardPage.getKPIWidgetLayout();
    expect(layout.hasHorizontalScroll).toBe(false);
  });
});
