const { test, expect, devices } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Responsive Dashboard Layout Tests', () => {
  let dashboardPage;
  let loginPage;

  test('QE-8165-TS001-TC001: Verify responsive dashboard adapts to mobile device screen size', async ({ browser }) => {
    logger.info('Starting test: QE-8165-TS001-TC001');
    const context = await browser.newContext({
      ...devices['iPhone 12']
    });
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const viewport = page.viewportSize();
    logger.info(`Viewport: ${viewport.width}x${viewport.height}`);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const layout = await page.locator('[data-layout="mobile"]').count();
    expect(layout).toBeGreaterThan(0);
    logger.info('Dashboard adapted to mobile layout');
    await context.close();
  });

  test('QE-8165-TS002-TC001: Verify tablet landscape orientation displays hybrid grid layout', async ({ browser }) => {
    logger.info('Starting test: QE-8165-TS002-TC001');
    const context = await browser.newContext({
      ...devices['iPad Pro landscape']
    });
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const viewport = page.viewportSize();
    logger.info(`Viewport: ${viewport.width}x${viewport.height}`);
    const gridLayout = await page.locator('[data-layout="grid"]').count();
    expect(gridLayout).toBeGreaterThan(0);
    logger.info('Tablet landscape displays hybrid grid layout');
    await context.close();
  });

  test('QE-8165-TS003-TC001: Verify minimum font sizes and touch targets on small screen devices', async ({ browser }) => {
    logger.info('Starting test: QE-8165-TS003-TC001');
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@123');
    await dashboardPage.waitForDashboardLoad();
    const fontSize = await dashboardPage.monthlySpendKPI.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    const fontSizeValue = parseFloat(fontSize);
    logger.info(`Font size: ${fontSizeValue}px`);
    expect(fontSizeValue).toBeGreaterThanOrEqual(14);
    const buttonSize = await page.locator('button').first().boundingBox();
    logger.info(`Button size: ${buttonSize.width}x${buttonSize.height}`);
    expect(buttonSize.width).toBeGreaterThanOrEqual(44);
    expect(buttonSize.height).toBeGreaterThanOrEqual(44);
    logger.info('Minimum font sizes and touch targets maintained');
    await context.close();
  });
});
