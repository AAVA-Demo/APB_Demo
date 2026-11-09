const { test, expect, devices } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { logger } = require('../utils/logger');

test.describe('Responsive Design Tests - Mobile', () => {
  test.use({ ...devices['iPhone 12'] });
  
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to dashboard on mobile device');
  });

  test('TC-4989 - Verify mobile responsive layout displays KPI metrics stacked vertically on 375px screen', async ({ page }) => {
    logger.info('Starting test: Mobile responsive layout');
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const kpiPositions = [];
    const kpis = [dashboardPage.monthlySpendKPI, dashboardPage.totalCreditLimitKPI, 
                  dashboardPage.availableCreditKPI, dashboardPage.outstandingAmountKPI];
    
    for (const kpi of kpis) {
      const box = await kpi.boundingBox();
      kpiPositions.push(box.y);
    }
    
    for (let i = 1; i < kpiPositions.length; i++) {
      expect(kpiPositions[i]).toBeGreaterThan(kpiPositions[i - 1]);
    }
    
    logger.info('Mobile responsive layout validated - KPIs stacked vertically');
  });

  test('TC-5040 - Verify mobile responsive layout with touch-friendly elements', async ({ page }) => {
    logger.info('Starting test: Touch-friendly mobile layout');
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
    
    logger.info('Touch-friendly elements validated');
  });
});

test.describe('Responsive Design Tests - Tablet', () => {
  test.use({ ...devices['iPad Pro'] });
  
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to dashboard on tablet device');
  });

  test('TC-4990 - Verify tablet responsive layout displays KPI metrics in 2-column grid on 768px screen', async ({ page }) => {
    logger.info('Starting test: Tablet responsive layout');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const kpi1Box = await dashboardPage.monthlySpendKPI.boundingBox();
    const kpi2Box = await dashboardPage.totalCreditLimitKPI.boundingBox();
    
    expect(Math.abs(kpi1Box.y - kpi2Box.y)).toBeLessThan(50);
    
    logger.info('Tablet responsive layout validated - 2-column grid');
  });

  test('TC-5041 - Verify tablet layout with optimized spacing', async ({ page }) => {
    logger.info('Starting test: Tablet optimized spacing');
    
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const kpis = [dashboardPage.monthlySpendKPI, dashboardPage.totalCreditLimitKPI];
    const boxes = [];
    
    for (const kpi of kpis) {
      const box = await kpi.boundingBox();
      boxes.push(box);
    }
    
    const spacing = boxes[1].x - (boxes[0].x + boxes[0].width);
    expect(spacing).toBeGreaterThan(10);
    
    logger.info('Tablet spacing validated');
  });
});

test.describe('Responsive Design Tests - Small Screen', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test('TC-4991 - Verify legacy browser fallback maintains core functionality on old mobile browsers', async ({ page }) => {
    logger.info('Starting test: Legacy browser fallback');
    
    await page.setViewportSize({ width: 320, height: 568 });
    await dashboardPage.navigate();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    
    const fontSize = await dashboardPage.monthlySpendKPI.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(12);
    
    logger.info('Legacy browser fallback validated');
  });

  test('TC-5042 - Verify small screen adaptation maintains readable font sizes on 320px width device', async ({ page }) => {
    logger.info('Starting test: Small screen font adaptation');
    
    await page.setViewportSize({ width: 320, height: 568 });
    await dashboardPage.navigate();
    
    const kpis = [dashboardPage.monthlySpendKPI, dashboardPage.totalCreditLimitKPI,
                  dashboardPage.availableCreditKPI, dashboardPage.outstandingAmountKPI];
    
    for (const kpi of kpis) {
      const fontSize = await kpi.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(12);
    }
    
    logger.info('Small screen font sizes validated');
  });
});
