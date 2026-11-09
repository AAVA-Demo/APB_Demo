const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('QE-8449 - Responsive Dashboard Layout Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test.describe('TS-001 - Mobile Device Layout (viewport < 768px)', () => {
    test('TC-001 - Verify mobile device displays dashboard in single-column layout with all 4 KPIs visible', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await dashboardPage.navigate();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard/);
      await dashboardPage.verifyAllKPIsVisible();
      await dashboardPage.verifySingleColumnLayout();
      await dashboardPage.verifyMinimumFontSize(14);
      await dashboardPage.verifyMinimumPadding(10);
    });

    test('TC-002 - Verify mobile layout adapts correctly when device orientation changes from portrait to landscape', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await dashboardPage.navigate();
      await dashboardPage.verifySingleColumnLayout();
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);
      await dashboardPage.verifySingleColumnLayout();
      await dashboardPage.verifyNoHorizontalScroll();
    });

    test('TC-003 - Verify mobile layout displays correct KPI values with proper currency formatting', async ({ page }) => {
      await page.setViewportSize({ width: 414, height: 896 });
      await dashboardPage.navigate();
      await dashboardPage.verifyKPIValue('Monthly Spend', '₹28,000');
      await dashboardPage.verifyKPIValue('Total Credit Limit', '₹155,000');
      await dashboardPage.verifyKPIValue('Available Credit', '₹115,500');
      await dashboardPage.verifyKPIValue('Outstanding Amount', '₹39,500');
    });
  });

  test.describe('TS-002 - Tablet Device Layout (viewport 768px-1024px)', () => {
    test('TC-001 - Verify tablet device displays dashboard in two-column grid layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await dashboardPage.navigate();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard/);
      await dashboardPage.verifyAllKPIsVisible();
      await dashboardPage.verifyTwoColumnLayout();
      await dashboardPage.verifyMinimumFontSize(16);
      await dashboardPage.verifyMinimumSpacing(15);
    });

    test('TC-002 - Verify tablet layout adapts correctly at minimum tablet width (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await dashboardPage.navigate();
      await dashboardPage.verifyTwoColumnLayout();
      await dashboardPage.verifyNoContentOverlap();
      await dashboardPage.verifyAllKPIValuesVisible();
    });

    test('TC-003 - Verify tablet layout adapts correctly at maximum tablet width (1024px)', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await dashboardPage.navigate();
      await dashboardPage.verifyTwoColumnLayout();
      await dashboardPage.verifyOptimalSpacing();
      await dashboardPage.verifyNoLayoutIssues();
    });
  });

  test.describe('TS-003 - Extremely Small Viewport Handling (< 320px)', () => {
    test('TC-001 - Verify extremely small viewport displays minimum-width layout without content overlap', async ({ page }) => {
      await page.setViewportSize({ width: 280, height: 400 });
      await dashboardPage.navigate();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard/);
      await dashboardPage.verifyMinimumWidthEnforced(320);
      await dashboardPage.verifyNoContentOverlap();
      await dashboardPage.verifyKPIDataIntegrity();
    });

    test('TC-002 - Verify extremely small viewport displays informational message about viewport size', async ({ page }) => {
      await page.setViewportSize({ width: 240, height: 320 });
      await dashboardPage.navigate();
      await dashboardPage.verifySmallViewportMessage();
      await dashboardPage.verifyNoContentOverlap();
      await dashboardPage.verifyKPIDataIntegrity();
    });

    test('TC-003 - Verify smartwatch viewport handles layout gracefully without breaking', async ({ page }) => {
      await page.setViewportSize({ width: 200, height: 300 });
      await dashboardPage.navigate();
      await dashboardPage.verifyNoSystemCrash();
      await dashboardPage.verifyKPIDataIntegrity();
    });
  });
});
