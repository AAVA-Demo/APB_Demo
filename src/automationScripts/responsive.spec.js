const { test, expect, devices } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Responsive Dashboard Tests - QE-10335', () => {
  let loginPage;
  let dashboardPage;

  test('QE-10335 TS-001 TC-001: Verify mobile responsive layout with WCAG 2.1 compliance', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone SE'],
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    const layout = await dashboardPage.getLayoutType();
    expect(layout).toBe('single-column');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const kpis = [dashboardPage.monthlySpendKPI, dashboardPage.totalCreditLimitKPI, dashboardPage.availableCreditKPI, dashboardPage.outstandingAmountKPI];
    for (const kpi of kpis) {
      const fontSize = await kpi.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThanOrEqual(14);
    }
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
    
    const ariaLabels = await dashboardPage.getKPIAriaLabels();
    expect(ariaLabels.length).toBe(4);
    ariaLabels.forEach(label => {
      expect(label).toBeTruthy();
    });
    
    const contrastRatios = await dashboardPage.getContrastRatios();
    contrastRatios.forEach(ratio => {
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
    
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeTruthy();
    
    await context.close();
  });

  test('QE-10335 TS-002 TC-001: Verify tablet responsive layout with touch-optimized controls', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad'],
      viewport: { width: 768, height: 1024 }
    });
    const page = await context.newPage();
    
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const layout = await dashboardPage.getLayoutType();
    expect(layout).toBe('two-column');
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const interactiveElements = await dashboardPage.getAllInteractiveElements();
    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    
    const ariaLabels = await dashboardPage.getKPIAriaLabels();
    expect(ariaLabels.length).toBe(4);
    
    const contrastRatios = await dashboardPage.getContrastRatios();
    contrastRatios.forEach(ratio => {
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
    
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeTruthy();
    
    await context.close();
  });

  test('QE-10335 TS-003 TC-001: Verify extremely small viewport maintains accessibility without horizontal scrolling', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 280, height: 653 }
    });
    const page = await context.newPage();
    
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const allTextElements = await dashboardPage.getAllTextElements();
    for (const element of allTextElements) {
      const fontSize = await element.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThanOrEqual(14);
    }
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const kpiValues = await dashboardPage.getAllKPIValues();
    kpiValues.forEach(value => {
      expect(value).toBeTruthy();
      expect(value).not.toContain('...');
    });
    
    const kpiLabels = await dashboardPage.getAllKPILabels();
    kpiLabels.forEach(label => {
      expect(label).toBeTruthy();
      expect(label).not.toContain('...');
    });
    
    const layout = await dashboardPage.getLayoutType();
    expect(layout).toBe('single-column');
    
    const ariaLabels = await dashboardPage.getKPIAriaLabels();
    expect(ariaLabels.length).toBe(4);
    
    const contrastRatios = await dashboardPage.getContrastRatios();
    contrastRatios.forEach(ratio => {
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
    
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBeTruthy();
    
    await context.close();
  });
});