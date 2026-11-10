const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { BasePage } = require('./pages/base.page');

test.describe('Dashboard KPIs and Real-time Refresh Tests', () => {
  let dashboardPage;
  let basePage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    basePage = new BasePage(page);
    await dashboardPage.navigate();
  });

  test('QE-9946 TS-001 TC-001: Verify all KPIs are displayed correctly within 2 seconds for authenticated user with multiple credit cards', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const totalLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const available = await dashboardPage.getKPIValue('availableCredit');
    const outstanding = await dashboardPage.getKPIValue('outstanding');
    
    expect(monthlySpend).toMatch(/^₹[\d,]+$/);
    expect(totalLimit).toMatch(/^₹[\d,]+$/);
    expect(available).toMatch(/^₹[\d,]+$/);
    expect(outstanding).toMatch(/^₹[\d,]+$/);
    
    await expect(dashboardPage.monthlySpendIcon).toBeVisible();
    await expect(dashboardPage.creditLimitIcon).toBeVisible();
    await expect(dashboardPage.availableCreditIcon).toBeVisible();
    await expect(dashboardPage.outstandingIcon).toBeVisible();
    
    await basePage.verifyResponsiveLayout(page, ['desktop', 'tablet', 'mobile']);
  });

  test('QE-9946 TS-002 TC-001: Verify partial data display with warning when some credit card data sources are unavailable', async ({ page }) => {
    await page.route('**/api/cards', async route => {
      const response = await route.fetch();
      const json = await response.json();
      json[1].error = 'Service Unavailable';
      await route.fulfill({ response, json });
    });
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.warningBanner).toBeVisible();
    const warningText = await dashboardPage.warningBanner.textContent();
    expect(warningText).toContain('Some credit card data could not be loaded');
    expect(warningText).toContain('KPIs may be incomplete');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    
    await expect(dashboardPage.refreshButton).toBeVisible();
    await expect(dashboardPage.refreshButton).toBeEnabled();
  });

  test('QE-9946 TS-003 TC-001: Verify zero-state interface when user has no credit cards linked', async ({ page }) => {
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    const welcomeText = await dashboardPage.welcomeMessage.textContent();
    expect(welcomeText).toContain("Welcome! You don't have any credit cards linked yet");
    
    await expect(dashboardPage.addCardButton).toBeVisible();
    const buttonText = await dashboardPage.addCardButton.textContent();
    expect(buttonText).toContain('Add Your First Credit Card');
    
    const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const totalLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const available = await dashboardPage.getKPIValue('availableCredit');
    const outstanding = await dashboardPage.getKPIValue('outstanding');
    
    expect(monthlySpend).toBe('₹0');
    expect(totalLimit).toBe('₹0');
    expect(available).toBe('₹0');
    expect(outstanding).toBe('₹0');
  });

  test('QE-9945 TS-001 TC-001: Verify manual data refresh updates all credit card data successfully within 3 seconds', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const initialAvailable = await dashboardPage.getKPIValue('availableCredit');
    const initialOutstanding = await dashboardPage.getKPIValue('outstanding');
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { cardId: 'CC001', cardNumber: '**** 1234', cardType: 'Visa', creditLimit: 50000, outstandingAmount: 13000, availableCredit: 37000, monthlySpend: 8500 },
          { cardId: 'CC002', cardNumber: '**** 5678', cardType: 'Mastercard', creditLimit: 75000, outstandingAmount: 23000, availableCredit: 52000, monthlySpend: 16000 },
          { cardId: 'CC003', cardNumber: '**** 9012', cardType: 'Amex', creditLimit: 100000, outstandingAmount: 36000, availableCredit: 64000, monthlySpend: 22000 }
        ])
      });
    });
    
    const startTime = Date.now();
    await dashboardPage.clickRefreshButton();
    
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    await expect(dashboardPage.successNotification).toBeVisible({ timeout: 3000 });
    
    const refreshTime = Date.now() - startTime;
    expect(refreshTime).toBeLessThan(3000);
    
    const notificationText = await dashboardPage.successNotification.textContent();
    expect(notificationText).toContain('Dashboard updated successfully');
    
    const updatedMonthlySpend = await dashboardPage.getKPIValue('monthlySpend');
    const updatedAvailable = await dashboardPage.getKPIValue('availableCredit');
    const updatedOutstanding = await dashboardPage.getKPIValue('outstanding');
    
    expect(updatedMonthlySpend).not.toBe(initialMonthlySpend);
    expect(updatedAvailable).not.toBe(initialAvailable);
    expect(updatedOutstanding).not.toBe(initialOutstanding);
  });

  test('QE-9945 TS-001 TC-002: Verify manual refresh works correctly on tablet device', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await dashboardPage.waitForDashboardLoad();
    
    const startTime = Date.now();
    await dashboardPage.clickRefreshButton();
    
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    await expect(dashboardPage.successNotification).toBeVisible({ timeout: 3000 });
    
    const refreshTime = Date.now() - startTime;
    expect(refreshTime).toBeLessThan(3000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  });

  test('QE-9945 TS-001 TC-003: Verify manual refresh works correctly on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await dashboardPage.waitForDashboardLoad();
    
    const startTime = Date.now();
    await dashboardPage.clickRefreshButton();
    
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    await expect(dashboardPage.successNotification).toBeVisible({ timeout: 3000 });
    
    const refreshTime = Date.now() - startTime;
    expect(refreshTime).toBeLessThan(3000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  });

  test('QE-9945 TS-002 TC-001: Verify error handling when credit card data service is unavailable during manual refresh', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialBalance = await dashboardPage.getKPIValue('monthlySpend');
    
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    await dashboardPage.clickRefreshButton();
    
    await expect(dashboardPage.errorNotification).toBeVisible();
    const errorText = await dashboardPage.errorNotification.textContent();
    expect(errorText).toContain('Unable to refresh data at this time');
    expect(errorText).toContain('Please try again in a few moments');
    
    const currentBalance = await dashboardPage.getKPIValue('monthlySpend');
    expect(currentBalance).toBe(initialBalance);
    
    await expect(dashboardPage.refreshButton).toBeEnabled();
  });

  test('QE-9945 TS-003 TC-001: Verify background refresh failure is handled gracefully without disrupting user view', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialData = await dashboardPage.getKPIValue('monthlySpend');
    
    await page.route('**/api/cards', route => {
      route.abort('timedout');
    });
    
    await page.waitForTimeout(65000);
    
    await expect(dashboardPage.lastUpdatedIndicator).toBeVisible();
    const indicatorText = await dashboardPage.lastUpdatedIndicator.textContent();
    expect(indicatorText).toMatch(/Last updated: \d+ minutes? ago/);
    
    const currentData = await dashboardPage.getKPIValue('monthlySpend');
    expect(currentData).toBe(initialData);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  });

  test('QE-9946 TS-001 TC-001: Verify responsive layout across desktop, tablet, and mobile', async ({ page }) => {
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await dashboardPage.navigate();
      await dashboardPage.waitForDashboardLoad();
      
      await expect(dashboardPage.monthlySpendKPI).toBeVisible();
      await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
      await expect(dashboardPage.availableCreditKPI).toBeVisible();
      await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
      
      const kpiCard = await dashboardPage.monthlySpendKPI.boundingBox();
      expect(kpiCard.width).toBeGreaterThan(0);
      expect(kpiCard.height).toBeGreaterThan(0);
    }
  });
});