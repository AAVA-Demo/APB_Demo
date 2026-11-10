const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Dashboard Financial KPIs Display - QE-10300', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('TC-7445: Verify user with multiple active credit cards can view aggregated financial KPIs', async ({ page }) => {
    await loginPage.login('testusermultiplecards', 'Pass@123');
    await expect(dashboardPage.monthlySpendPanel).toBeVisible();
    await expect(dashboardPage.totalCreditLimitPanel).toBeVisible();
    await expect(dashboardPage.availableCreditPanel).toBeVisible();
    await expect(dashboardPage.outstandingAmountPanel).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(parseFloat(monthlySpend.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalCreditLimit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(availableCredit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(outstandingAmount.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
  });

  test('TC-7446: Verify dashboard KPIs are retrieved from correct data sources and calculated in real-time', async ({ page }) => {
    await loginPage.login('testusermultiplecards', 'Pass@123');
    await page.waitForResponse(response => response.url().includes('/api/kpi/summary') && response.status() === 200);
    await expect(dashboardPage.monthlySpendPanel).toBeVisible();
    const lastUpdated = await dashboardPage.getLastUpdatedTimestamp();
    expect(lastUpdated).toBeTruthy();
  });

  test('TC-7447: Verify user with no credit cards sees appropriate message and zero/null KPI values', async ({ page }) => {
    await loginPage.login('testusernocards', 'Pass@123');
    await expect(dashboardPage.noDataMessage).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(monthlySpend).toMatch(/₹0\.00|null/);
    expect(totalCreditLimit).toMatch(/₹0\.00|null/);
    expect(availableCredit).toMatch(/₹0\.00|null/);
    expect(outstandingAmount).toMatch(/₹0\.00|null/);
  });

  test('TC-7448: Verify dashboard does not display misleading or placeholder data when no credit cards registered', async ({ page }) => {
    await loginPage.login('testusernocards', 'Pass@123');
    await expect(dashboardPage.monthlySpendPanel).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).not.toContain('₹XXXX');
    expect(monthlySpend).not.toContain('N/A');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
  });

  test('TC-7449: Verify system displays error message when KPI calculation engine fails', async ({ page }) => {
    await page.route('**/api/kpi/summary', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load dashboard data');
  });

  test('TC-7450: Verify system handles KPI calculation engine failure gracefully without exposing technical errors', async ({ page }) => {
    await page.route('**/api/kpi/summary', route => route.abort());
    await loginPage.login('testuser', 'Pass@123');
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).not.toContain('stack trace');
    expect(errorText).not.toContain('500');
    await dashboardPage.navigateToCardManagement();
    await expect(page).toHaveURL(/card-management/);
  });
});

test.describe('Responsive Dashboard Layout Design - QE-10299', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('TC-7451: Verify dashboard renders correctly on mobile device with viewport 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.login('testuser', 'Pass@123');
    await expect(dashboardPage.monthlySpendPanel).toBeVisible();
    await expect(dashboardPage.totalCreditLimitPanel).toBeVisible();
    await expect(dashboardPage.availableCreditPanel).toBeVisible();
    await expect(dashboardPage.outstandingAmountPanel).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('TC-7452: Verify dashboard layout adapts responsively on mobile devices without loss of data visibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.login('testuser', 'Pass@123');
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(monthlySpend).toBeTruthy();
    expect(totalCreditLimit).toBeTruthy();
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });

  test('TC-7453: Verify dashboard adapts responsively on tablet device with viewport 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.login('testuser', 'Pass@123');
    await expect(dashboardPage.monthlySpendPanel).toBeVisible();
    await expect(dashboardPage.totalCreditLimitPanel).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768);
  });

  test('TC-7454: Verify dashboard maintains full functionality on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.navigateToCardManagement();
    await expect(page).toHaveURL(/card-management/);
    await page.goBack();
    await dashboardPage.navigateToAnalytics();
    await expect(page).toHaveURL(/analytics/);
  });

  test('TC-7455: Verify dashboard ensures critical financial data accessible on extremely narrow viewport 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await loginPage.login('testuser', 'Pass@123');
    await expect(dashboardPage.monthlySpendPanel).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(monthlySpend).toBeTruthy();
    expect(totalCreditLimit).toBeTruthy();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(320);
  });

  test('TC-7456: Verify dashboard maintains functionality on extremely narrow viewports without data loss', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await loginPage.login('testuser', 'Pass@123');
    await expect(dashboardPage.monthlySpendPanel).toBeVisible();
    await expect(dashboardPage.totalCreditLimitPanel).toBeVisible();
    await expect(dashboardPage.availableCreditPanel).toBeVisible();
    await expect(dashboardPage.outstandingAmountPanel).toBeVisible();
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });
});