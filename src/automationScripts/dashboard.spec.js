const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard KPI Display and Responsive Layout Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.authenticate('user123', 'valid-token');
  });

  test('QE-9882 TS-001 TC-001: Verify dashboard displays aggregated KPIs for 3 active credit cards within 2 seconds', async () => {
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBe('24700');
    expect(totalCreditLimit).toBe('155000');
    expect(availableCredit).toBe('117000');
    expect(outstandingAmount).toBe('38000');
  });

  test('QE-9882 TS-001 TC-002: Verify dashboard calculates credit utilization percentage correctly', async () => {
    await dashboardPage.waitForDashboardLoad();
    
    const creditUtilization = await dashboardPage.getCreditUtilization();
    expect(creditUtilization).toBe('24.52');
  });

  test('QE-9882 TS-002 TC-001: Verify error message is displayed when backend service times out', async () => {
    await dashboardPage.simulateServiceTimeout();
    await dashboardPage.navigate();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('KPI data could not be loaded within the 2-second performance threshold');
  });

  test('QE-9882 TS-002 TC-002: Verify dashboard handles service unavailability gracefully', async () => {
    await dashboardPage.simulateServiceUnavailable();
    await dashboardPage.navigate();
    
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Dashboard service is temporarily unavailable');
  });

  test('QE-9882 TS-003 TC-001: Verify dashboard displays aggregated KPIs for 10 active credit cards within 2 seconds', async () => {
    await dashboardPage.authenticate('user333', 'valid-token');
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBe('85000');
    expect(totalCreditLimit).toBe('500000');
    expect(availableCredit).toBe('350000');
    expect(outstandingAmount).toBe('150000');
  });

  test('QE-9882 TS-003 TC-002: Verify accurate summation of credit limits across 10 cards with varying amounts', async () => {
    await dashboardPage.authenticate('user444', 'valid-token');
    await dashboardPage.waitForDashboardLoad();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('500000');
    
    const cardLimits = await dashboardPage.getIndividualCardLimits();
    const expectedLimits = [50000, 30000, 75000, 40000, 60000, 45000, 55000, 35000, 65000, 45000];
    const calculatedTotal = cardLimits.reduce((sum, limit) => sum + limit, 0);
    
    expect(calculatedTotal).toBe(500000);
    expect(cardLimits).toEqual(expectedLimits);
  });

  test('QE-9881 TS-001 TC-001: Verify dashboard displays mobile-optimized layout on 375px screen width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate();
    await dashboardPage.authenticate('user123', 'valid-token');
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getLayoutType();
    expect(layout).toBe('vertical-stack');
    
    const kpiCount = await dashboardPage.getVisibleKPICount();
    expect(kpiCount).toBe(4);
    
    const isResponsive = await dashboardPage.isResponsiveLayout();
    expect(isResponsive).toBe(true);
  });

  test('QE-9881 TS-001 TC-002: Verify mobile layout maintains data accuracy and completeness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate();
    await dashboardPage.authenticate('user456', 'valid-token');
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBe('24700');
    expect(totalCreditLimit).toBe('155000');
    expect(availableCredit).toBe('117000');
    expect(outstandingAmount).toBe('38000');
  });

  test('QE-9881 TS-002 TC-001: Verify dashboard displays desktop-optimized layout on 1920px screen width', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    await dashboardPage.authenticate('user123', 'valid-token');
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getLayoutType();
    expect(layout).toBe('horizontal-grid');
    
    const kpiCount = await dashboardPage.getVisibleKPICount();
    expect(kpiCount).toBe(4);
    
    const isHorizontal = await dashboardPage.isHorizontalLayout();
    expect(isHorizontal).toBe(true);
  });

  test('QE-9881 TS-002 TC-002: Verify desktop layout utilizes full screen width for visualizations', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    await dashboardPage.authenticate('user789', 'valid-token');
    await dashboardPage.waitForDashboardLoad();
    
    const chartWidth = await dashboardPage.getChartWidth();
    expect(chartWidth).toBeGreaterThanOrEqual(1880);
    expect(chartWidth).toBeLessThanOrEqual(1920);
  });

  test('QE-9881 TS-003 TC-001: Verify dashboard displays degraded but functional layout on 320px narrow screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await dashboardPage.navigate();
    await dashboardPage.authenticate('user111', 'valid-token');
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getLayoutType();
    expect(layout).toBe('degraded-vertical');
    
    const kpiCount = await dashboardPage.getVisibleKPICount();
    expect(kpiCount).toBe(4);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    expect(monthlySpend).toBe('24700');
    expect(totalCreditLimit).toBe('155000');
    expect(availableCredit).toBe('117000');
    expect(outstandingAmount).toBe('38000');
  });

  test('QE-9881 TS-003 TC-002: Verify narrow screen layout maintains functional interactivity', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await dashboardPage.navigate();
    await dashboardPage.authenticate('user222', 'valid-token');
    await dashboardPage.waitForDashboardLoad();
    
    const manageCardsLinkVisible = await dashboardPage.isManageCardsLinkVisible();
    const viewAnalyticsLinkVisible = await dashboardPage.isViewAnalyticsLinkVisible();
    
    expect(manageCardsLinkVisible).toBe(true);
    expect(viewAnalyticsLinkVisible).toBe(true);
    
    const touchTargetSize = await dashboardPage.getTouchTargetSize('manageCardsLink');
    expect(touchTargetSize.width).toBeGreaterThanOrEqual(44);
    expect(touchTargetSize.height).toBeGreaterThanOrEqual(44);
  });
});