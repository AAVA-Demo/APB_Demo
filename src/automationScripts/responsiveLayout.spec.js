const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

test.describe('Responsive Layout Tests', () => {

  test('QE-9076 TS-001 TC-001 - Verify dashboard adapts to mobile device with 375px width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await dashboardPage.waitForDashboardLoad();
    
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(viewportWidth).toBe(375);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const kpiPositions = await dashboardPage.getKPIPositions();
    expect(kpiPositions.monthlySpend.y).toBeLessThan(kpiPositions.totalCreditLimit.y);
    expect(kpiPositions.totalCreditLimit.y).toBeLessThan(kpiPositions.availableCredit.y);
    expect(kpiPositions.availableCredit.y).toBeLessThan(kpiPositions.outstandingAmount.y);
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
    
    const fontSize = await dashboardPage.monthlySpendValue.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    expect(parseInt(fontSize)).toBeGreaterThan(12);
  });

  test('QE-9076 TS-002 TC-001 - Verify dashboard adapts to tablet device with 768px width', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await dashboardPage.waitForDashboardLoad();
    
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(viewportWidth).toBe(768);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const kpiPositions = await dashboardPage.getKPIPositions();
    
    expect(kpiPositions.monthlySpend.y).toBe(kpiPositions.totalCreditLimit.y);
    expect(kpiPositions.availableCredit.y).toBe(kpiPositions.outstandingAmount.y);
    expect(kpiPositions.monthlySpend.y).toBeLessThan(kpiPositions.availableCredit.y);
    
    const cardTilePositions = await dashboardPage.getCardTilePositions();
    if (cardTilePositions.length >= 2) {
      expect(cardTilePositions[0].y).toBe(cardTilePositions[1].y);
    }
    
    const buttonSize = await page.locator('[data-testid="action-button"]').first().evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    expect(buttonSize.width).toBeGreaterThanOrEqual(44);
    expect(buttonSize.height).toBeGreaterThanOrEqual(44);
  });

  test('QE-9076 TS-003 TC-001 - Verify responsive layout adapts continuously from 1920px to 320px', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await loginPage.navigate();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(500);
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(true);
    
    await expect(dashboardPage.minimumWidthMessage).toBeVisible();
    const messageText = await dashboardPage.getMinimumWidthMessageText();
    expect(messageText).toContain('For optimal experience, minimum screen width of 360px is recommended');
  });
});
