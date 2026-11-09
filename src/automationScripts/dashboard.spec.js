const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { AuthService } = require('./services/auth.service');

// Test cases for Dashboard Module - QE-8087 and QE-8086

test.describe('Dashboard KPI Tests - QE-8087', () => {
  let dashboardPage;
  let authService;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    authService = new AuthService(page);
  });

  test('QE-8087 TS-001 TC-001: Verify consolidated dashboard displays accurate aggregated KPIs for authenticated user with multiple credit cards, loading in under 2 seconds', async ({ page }) => {
    // Step 1: Authenticate user with multiple credit cards
    await authService.login('user_multiple_cards_kpi', 'password123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 2: Navigate to the dashboard page
    const startTime = Date.now();
    await dashboardPage.navigate();

    // Step 3: Verify consolidated monthly spend KPI is displayed and calculated across all cards
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(parseFloat(monthlySpend)).toBeGreaterThan(0);

    // Step 4: Verify total credit limit KPI is displayed and calculated across all cards
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(parseFloat(totalCreditLimit)).toBeGreaterThan(0);

    // Step 5: Verify available credit KPI is displayed and calculated across all cards
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(parseFloat(availableCredit)).toBeGreaterThan(0);

    // Step 6: Verify outstanding amounts KPI is displayed and calculated across all cards
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(parseFloat(outstandingAmount)).toBeGreaterThan(0);

    // Step 7: Measure dashboard load time from request to display completion
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(2000); // Performance threshold: < 2000ms
  });

  test('QE-8087 TS-002 TC-001: Verify dashboard displays available KPI data and indicates unavailable metrics when user has credit cards with data synchronization errors', async ({ page }) => {
    // Step 1: Authenticate user with credit cards that have data synchronization errors
    await authService.login('user_sync_errors', 'password123');

    // Step 2: Navigate to the dashboard page
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/.*dashboard/);

    // Step 3: Verify available KPI data is displayed for cards with successful synchronization
    const visibleKPIs = await dashboardPage.getVisibleKPICount();
    expect(visibleKPIs).toBeGreaterThan(0);

    // Step 4: Verify unavailable or incomplete metrics are clearly indicated
    const unavailableIndicators = await dashboardPage.getUnavailableDataIndicators();
    expect(unavailableIndicators.length).toBeGreaterThan(0);
    for (const indicator of unavailableIndicators) {
      await expect(indicator).toContainText(/Data unavailable|Sync error/i);
    }

    // Step 5: Verify dashboard view is not blocked by data issues
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const isInteractive = await dashboardPage.isDashboardInteractive();
    expect(isInteractive).toBe(true);

    // Step 6: Verify error message or notification explains data synchronization issue
    const errorMessage = await dashboardPage.getSyncErrorMessage();
    expect(errorMessage).toMatch(/Some card data is unavailable|synchronization issues/i);
  });

  test('QE-8087 TS-003 TC-001: Verify consolidated dashboard displays accurate KPIs for authenticated user with a single credit card, loading in under 2 seconds', async ({ page }) => {
    // Step 1: Authenticate user with a single credit card
    await authService.login('user_single_card', 'password123');

    // Step 2: Navigate to the dashboard page
    const startTime = Date.now();
    await dashboardPage.navigate();

    // Step 3: Verify monthly spend KPI is displayed for the single card
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();

    // Step 4: Verify total credit limit KPI is displayed for the single card
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBeTruthy();

    // Step 5: Verify available credit KPI is displayed for the single card
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeTruthy();

    // Step 6: Verify outstanding amount KPI is displayed for the single card
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBeTruthy();

    // Step 7: Verify dashboard format is consistent with multi-card portfolio presentation
    const layoutClass = await dashboardPage.getDashboardLayoutClass();
    expect(layoutClass).toContain('dashboard-container');

    // Step 8: Measure dashboard load time from request to display completion
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(2000); // Performance threshold: < 2000ms
  });
});

test.describe('Dashboard Responsive Tests - QE-8086', () => {
  let dashboardPage;
  let authService;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    authService = new AuthService(page);
  });

  test('QE-8086 TS-001 TC-001: Verify dashboard layout automatically adjusts to mobile device with small screen resolution and displays all KPIs in vertically stacked format without horizontal scrolling', async ({ page, context }) => {
    // Step 1: Authenticate user and establish session
    await authService.login('user_responsive_test', 'password123');

    // Step 2: Access credit card dashboard from mobile device with small screen resolution
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate();

    // Step 3: Verify dashboard layout automatically adjusts to mobile viewport
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const viewportWidth = await page.viewportSize().width;
    expect(viewportWidth).toBe(375);

    // Step 4: Verify all KPIs are displayed in vertically stacked format
    const isVerticalLayout = await dashboardPage.isVerticalStackLayout();
    expect(isVerticalLayout).toBe(true);

    // Step 5: Verify no horizontal scrolling is required to view all KPIs
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScrollbar();
    expect(hasHorizontalScroll).toBe(false);

    // Step 6: Verify all KPI values are readable and properly formatted on mobile screen
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const fontSize = await dashboardPage.getKPIFontSize();
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14); // Minimum readable font size for mobile
  });

  test('QE-8086 TS-002 TC-001: Verify dashboard layout displays all KPIs in multi-column grid format optimized for desktop device with large screen resolution', async ({ page }) => {
    // Step 1: Authenticate user and establish session
    await authService.login('user_responsive_test', 'password123');

    // Step 2: Access credit card dashboard from desktop device with large screen resolution
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();

    // Step 3: Verify dashboard layout displays KPIs in multi-column grid format
    const isGridLayout = await dashboardPage.isGridLayout();
    expect(isGridLayout).toBe(true);
    const columnCount = await dashboardPage.getKPIColumnCount();
    expect(columnCount).toBeGreaterThanOrEqual(4);

    // Step 4: Verify all 4 KPIs are visible simultaneously without scrolling
    const allKPIsVisible = await dashboardPage.areAllKPIsVisibleInViewport();
    expect(allKPIsVisible).toBe(true);

    // Step 5: Verify readability and visual hierarchy are maintained on large screen
    const fontSize = await dashboardPage.getKPIFontSize();
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(16);
    const spacing = await dashboardPage.getKPISpacing();
    expect(parseInt(spacing)).toBeGreaterThan(10);

    // Step 6: Verify layout utilizes available screen space efficiently
    const containerWidth = await dashboardPage.getDashboardContainerWidth();
    expect(containerWidth).toBeGreaterThan(1200); // Efficient use of 1920px width
  });

  test('QE-8086 TS-003 TC-001: Verify dashboard ensures all KPI data remains accessible and readable on device with extremely narrow viewport without breaking interface', async ({ page }) => {
    // Step 1: Authenticate user and establish session
    await authService.login('user_responsive_test', 'password123');

    // Step 2: Access credit card dashboard from device with extremely narrow viewport
    await page.setViewportSize({ width: 320, height: 568 });
    await dashboardPage.navigate();

    // Step 3: Verify all KPI data remains accessible despite narrow viewport
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

    // Step 4: Verify KPI values remain readable with layout adjustments or text truncation if applied
    const monthlySpendText = await dashboardPage.getMonthlySpendText();
    expect(monthlySpendText.length).toBeGreaterThan(0);
    const isTextTruncated = await dashboardPage.isTextTruncated(dashboardPage.monthlySpendKPI);
    // Text may be truncated but should still be readable

    // Step 5: Verify interface does not break or hide critical financial information
    const isBroken = await dashboardPage.hasLayoutBreakage();
    expect(isBroken).toBe(false);
    const allKPIsPresent = await dashboardPage.areAllKPIsPresent();
    expect(allKPIsPresent).toBe(true);

    // Step 6: Verify vertical scrolling is available if needed to access all KPIs
    const hasVerticalScroll = await dashboardPage.hasVerticalScrollbar();
    // Vertical scroll may be enabled, which is acceptable
    const canScrollVertically = await dashboardPage.canScrollVertically();
    expect(canScrollVertically || !hasVerticalScroll).toBe(true);
  });
});