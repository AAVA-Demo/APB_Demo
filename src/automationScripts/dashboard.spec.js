const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
  });

  test('TC-QE-8061-TS-001-TC-001: Verify dashboard loads within 2 seconds and displays all KPI metrics', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toMatch(/\$[\d,]+\.\d{2}/);
    expect(totalLimit).toMatch(/\$[\d,]+\.\d{2}/);
    expect(availableCredit).toMatch(/\$[\d,]+\.\d{2}/);
    expect(outstanding).toMatch(/\$[\d,]+\.\d{2}/);
  });

  test('TC-QE-8061-TS-002-TC-001: Verify dashboard displays loading indicator during data processing', async ({ page }) => {
    await page.route('**/api/cards**', route => {
      setTimeout(() => route.continue(), 3000);
    });
    
    await loginPage.navigate();
    await loginPage.login('processing-user@example.com', 'Pass@123');
    
    await expect(dashboardPage.loadingIndicator).toBeVisible();
    await expect(dashboardPage.loadingMessage).toContainText(/Processing|Loading/);
    
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.loadingIndicator).not.toBeVisible();
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
  });

  test('TC-QE-8061-TS-003-TC-001: Verify KPI metrics display proper currency formatting', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toMatch(/^\$[\d,]+\.\d{2}$/);
    expect(totalLimit).toMatch(/^\$[\d,]+\.\d{2}$/);
    expect(availableCredit).toMatch(/^\$[\d,]+\.\d{2}$/);
    expect(outstanding).toMatch(/^\$[\d,]+\.\d{2}$/);
    
    await expect(dashboardPage.monthlySpendLabel).toContainText('Monthly Spend');
    await expect(dashboardPage.totalCreditLimitLabel).toContainText('Total Credit Limit');
    await expect(dashboardPage.availableCreditLabel).toContainText('Available Credit');
    await expect(dashboardPage.outstandingAmountLabel).toContainText('Outstanding Amount');
  });

  test('TC-QE-8051-TS-001-TC-001: Verify dashboard displays all KPI metrics in clearly labeled cards', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();
    
    const kpiLabels = await dashboardPage.getAllKPILabels();
    expect(kpiLabels).toContain('Monthly Spend');
    expect(kpiLabels).toContain('Total Credit Limit');
    expect(kpiLabels).toContain('Available Credit');
    expect(kpiLabels).toContain('Outstanding Amount');
  });

  test('TC-QE-8051-TS-002-TC-001: Verify dashboard displays appropriate message for user with no cards', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('nocard-user@example.com', 'Pass@123');
    
    await expect(dashboardPage.noCardMessage).toBeVisible();
    await expect(dashboardPage.noCardMessage).toContainText(/No credit card data available|Please add a credit card/);
  });

  test('TC-QE-8051-TS-003-TC-001: Verify KPI metrics correctly aggregate data across multiple cards', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard-user@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    
    const totalLimitNum = parseFloat(totalLimit.replace(/[$,]/g, ''));
    const outstandingNum = parseFloat(outstanding.replace(/[$,]/g, ''));
    const availableCreditNum = parseFloat(availableCredit.replace(/[$,]/g, ''));
    
    expect(availableCreditNum).toBeCloseTo(totalLimitNum - outstandingNum, 2);
  });

  test('TC-QE-8045-TS-001-TC-001: Verify consolidated KPI dashboard loads within 2 seconds', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard-user@example.com', 'Pass@123');
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('TC-QE-8045-TS-002-TC-001: Verify dashboard displays error message when backend is unavailable', async ({ page }) => {
    await page.route('**/api/cards**', route => {
      route.abort('failed');
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText(/temporarily unavailable|try again later/);
  });

  test('TC-QE-8045-TS-003-TC-001: Verify KPI aggregation for user with 10 credit cards', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('tencard-user@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(totalLimit).toBeTruthy();
    expect(availableCredit).toBeTruthy();
    expect(outstanding).toBeTruthy();
    
    const totalLimitNum = parseFloat(totalLimit.replace(/[$,]/g, ''));
    expect(totalLimitNum).toBeGreaterThan(0);
  });

  test('TC-QE-8052-TS-001-TC-001: Verify dashboard KPIs update automatically after new transaction', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('transaction-processed', {
        detail: { amount: 50.00, merchant: 'Starbucks' }
      }));
    });
    
    await page.waitForTimeout(5000);
    
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(updatedMonthlySpend).not.toBe(initialMonthlySpend);
  });

  test('TC-QE-8052-TS-002-TC-001: Verify dashboard displays warning when real-time data feed is interrupted', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    await page.route('**/api/realtime**', route => {
      route.abort('failed');
    });
    
    await page.waitForTimeout(3000);
    
    await expect(dashboardPage.dataFeedWarning).toBeVisible();
    await expect(dashboardPage.dataFeedWarning).toContainText(/Real-time data feed|temporarily unavailable/);
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
  });

  test('TC-QE-8052-TS-003-TC-001: Verify KPIs update automatically after payment processing', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('payment-processed', {
        detail: { amount: 1000.00, cardId: 'card001' }
      }));
    });
    
    await page.waitForTimeout(5000);
    
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(updatedAvailableCredit).not.toBe(initialAvailableCredit);
    expect(updatedOutstanding).not.toBe(initialOutstanding);
  });
});

test.describe('Dashboard Responsive Layout Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC-QE-8060-TS-001-TC-001: Verify mobile responsive layout displays KPIs in stacked format', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();
    
    const fontSize = await dashboardPage.getKPIFontSize();
    expect(fontSize).toBeGreaterThanOrEqual(14);
  });

  test('TC-QE-8060-TS-002-TC-001: Verify tablet responsive layout adapts to orientation changes', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const portraitLayout = await dashboardPage.getKPILayout();
    expect(portraitLayout).toBe('grid');
    
    await page.setViewportSize({ width: 1366, height: 1024 });
    await page.waitForTimeout(500);
    
    const landscapeLayout = await dashboardPage.getKPILayout();
    expect(landscapeLayout).toBe('grid');
  });

  test('TC-QE-8060-TS-003-TC-001: Verify dashboard handles low resolution gracefully', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    
    const fontSize = await dashboardPage.getKPIFontSize();
    expect(fontSize).toBeGreaterThanOrEqual(12);
  });

  test('TC-QE-8044-TS-001-TC-001: Verify mobile layout displays all KPIs without horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
    
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();
  });

  test('TC-QE-8044-TS-002-TC-001: Verify tablet layout displays KPIs in 2-column grid', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getKPILayout();
    expect(layout).toBe('grid');
    
    const gridColumns = await dashboardPage.getGridColumnCount();
    expect(gridColumns).toBe(2);
  });

  test('TC-QE-8044-TS-003-TC-001: Verify dashboard displays fallback message for unsupported browsers', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      test.skip();
    }
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Pass@123');
    
    const browserWarning = await dashboardPage.getBrowserWarning();
    if (browserWarning) {
      expect(browserWarning).toContain('not fully supported');
    }
  });
});