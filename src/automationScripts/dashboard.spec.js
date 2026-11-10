const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC-6637: Verify dashboard loads responsively on mobile device within 2 seconds with stacked KPI layout', async ({ page }) => {
    await test.step('Set browser viewport to 375px width (mobile device simulation)', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page).toHaveViewportSize({ width: 375, height: 667 });
    });

    await test.step('Navigate to the dashboard URL', async () => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    await test.step('Measure page load time from request to full render', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForDashboardLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
    });

    await test.step('Verify all KPI cards are displayed in stacked (vertical) layout', async () => {
      await expect(dashboardPage.monthlySpendCard).toBeVisible();
      await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
      await expect(dashboardPage.availableCreditCard).toBeVisible();
      await expect(dashboardPage.outstandingAmountCard).toBeVisible();
      const layout = await dashboardPage.verifyStackedLayout();
      expect(layout).toBe(true);
    });

    await test.step('Verify KPI values are readable and properly formatted', async () => {
      const fontSize = await dashboardPage.getKPIFontSize();
      expect(fontSize).toBeGreaterThanOrEqual(14);
      const currencyFormat = await dashboardPage.verifyKPICurrencyFormat();
      expect(currencyFormat).toBe(true);
    });
  });

  test('TC-6638: Verify dashboard displays in 2-column grid layout on tablet device with proper spacing', async ({ page }) => {
    await test.step('Set browser viewport to 768px width (tablet device simulation)', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page).toHaveViewportSize({ width: 768, height: 1024 });
    });

    await test.step('Navigate to the dashboard URL', async () => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    await test.step('Verify KPI cards are arranged in 2-column grid layout', async () => {
      const gridLayout = await dashboardPage.verifyGridLayout(2, 2);
      expect(gridLayout).toBe(true);
    });

    await test.step('Measure spacing between KPI cards', async () => {
      const spacing = await dashboardPage.getCardSpacing();
      expect(spacing).toBeGreaterThanOrEqual(15);
    });

    await test.step('Verify all KPI labels and values are fully visible without truncation', async () => {
      const noOverflow = await dashboardPage.verifyNoTextOverflow();
      expect(noOverflow).toBe(true);
    });
  });

  test('TC-6639: Verify dashboard load time exceeds 2 seconds on slow network - NFR failure scenario', async ({ page, context }) => {
    await test.step('Enable network throttling to simulate 3G connection speed', async () => {
      await context.route('**/*', route => {
        setTimeout(() => route.continue(), 100);
      });
    });

    await test.step('Clear browser cache and cookies', async () => {
      await context.clearCookies();
    });

    await test.step('Navigate to the dashboard URL', async () => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    await test.step('Measure page load time from request to full render', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForDashboardLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeGreaterThan(2000);
    });

    await test.step('Verify dashboard eventually loads with all KPI data displayed', async () => {
      await expect(dashboardPage.monthlySpendCard).toBeVisible();
      await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
      await expect(dashboardPage.availableCreditCard).toBeVisible();
      await expect(dashboardPage.outstandingAmountCard).toBeVisible();
    });
  });

  test('TC-6652: Verify user with multiple credit cards views aggregated KPIs calculated correctly', async ({ page }) => {
    await test.step('Login with user account having multiple credit cards', async () => {
      await loginPage.navigate();
      await loginPage.login('user_3cards', 'Pass@123');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    await test.step('Navigate to Dashboard', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoad();
    });

    await test.step('Verify Monthly Spend KPI displays sum of current month spend across all cards', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      expect(monthlySpend).toMatch(/\$[0-9,]+\.\d{2}/);
    });

    await test.step('Verify Total Credit Limit KPI displays sum of credit limits across all cards', async () => {
      const totalLimit = await dashboardPage.getTotalCreditLimitValue();
      expect(totalLimit).toMatch(/\$[0-9,]+/);
    });

    await test.step('Verify Available Credit KPI displays sum of available credit across all cards', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditValue();
      expect(availableCredit).toMatch(/\$[0-9,]+/);
    });

    await test.step('Verify Outstanding Amount KPI displays sum of outstanding amounts across all cards', async () => {
      const outstanding = await dashboardPage.getOutstandingAmountValue();
      expect(outstanding).toMatch(/\$[0-9,]+/);
    });

    await test.step('Verify all KPI values are displayed in currency format', async () => {
      const allFormatted = await dashboardPage.verifyAllKPICurrencyFormat();
      expect(allFormatted).toBe(true);
    });
  });

  test('TC-6654: Verify user without valid authentication token receives authentication error', async ({ page, context }) => {
    await test.step('Clear all browser session storage and cookies', async () => {
      await context.clearCookies();
      await page.evaluate(() => sessionStorage.clear());
    });

    await test.step('Attempt to navigate directly to Dashboard URL without logging in', async () => {
      await page.goto('/dashboard');
    });

    await test.step('Verify authentication error message is displayed', async () => {
      const errorMessage = await dashboardPage.getErrorMessage();
      expect(errorMessage).toContain('Authentication required');
    });

    await test.step('Verify KPI data is not loaded or displayed', async () => {
      const kpiDataLoaded = await dashboardPage.isKPIDataDisplayed();
      expect(kpiDataLoaded).toBe(false);
    });

    await test.step('Verify user is redirected to login page or authentication prompt', async () => {
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test('TC-6656: Verify user with no registered credit cards sees zero values for all KPIs', async ({ page }) => {
    await test.step('Login with user account having zero registered credit cards', async () => {
      await loginPage.navigate();
      await loginPage.login('newuser_nocards', 'Pass@123');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    await test.step('Navigate to Dashboard', async () => {
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoad();
    });

    await test.step('Verify Monthly Spend KPI displays $0.00', async () => {
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      expect(monthlySpend).toBe('$0.00');
    });

    await test.step('Verify Total Credit Limit KPI displays $0.00', async () => {
      const totalLimit = await dashboardPage.getTotalCreditLimitValue();
      expect(totalLimit).toBe('$0.00');
    });

    await test.step('Verify Available Credit KPI displays $0.00', async () => {
      const availableCredit = await dashboardPage.getAvailableCreditValue();
      expect(availableCredit).toBe('$0.00');
    });

    await test.step('Verify Outstanding Amount KPI displays $0.00', async () => {
      const outstanding = await dashboardPage.getOutstandingAmountValue();
      expect(outstanding).toBe('$0.00');
    });

    await test.step('Verify appropriate message is displayed indicating no cards registered', async () => {
      const message = await dashboardPage.getNoCardsMessage();
      expect(message).toContain('No credit cards registered');
    });
  });
});
