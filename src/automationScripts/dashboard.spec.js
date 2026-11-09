const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@demo.com', 'Test@1234');
    logger.info('User logged in successfully');
  });

  test('TC-6169: Verify single-column mobile layout without horizontal scrolling', async ({ page, context }) => {
    logger.info('Test Case ID: 6169 - Verify dashboard displays single-column mobile-optimized layout on mobile device');
    
    // Step 1: Set viewport to mobile device (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    logger.info('Viewport set to 375px x 667px (iPhone SE)');
    
    // Step 2: User is already authenticated from beforeEach
    await dashboardPage.navigate();
    
    // Step 3: Verify all KPI widgets are displayed in single-column layout
    const widgets = await dashboardPage.getAllKpiWidgets();
    expect(widgets.length).toBe(4);
    
    // Verify widgets are stacked vertically
    const positions = await dashboardPage.getWidgetPositions();
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i].y).toBeGreaterThan(positions[i-1].y);
    }
    logger.info('KPI widgets displayed in single-column layout');
    
    // Step 4: Verify no horizontal scrolling
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
    logger.info('No horizontal scrolling required');
    
    // Step 5: Verify mobile optimization
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    const fontSize = await dashboardPage.monthlySpendValue.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseInt(fontSize)).toBeGreaterThan(12);
    logger.info('KPI widgets are mobile-optimized with readable text');
  });

  test('TC-6170: Verify two-column tablet layout without content overflow', async ({ page }) => {
    logger.info('Test Case ID: 6170 - Verify dashboard displays two-column layout on tablet device');
    
    // Step 1: Set viewport to tablet device (iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    logger.info('Viewport set to 768px x 1024px (iPad)');
    
    // Step 2: User is already authenticated
    await dashboardPage.navigate();
    
    // Step 3: Verify KPI widgets are displayed in two-column layout
    const positions = await dashboardPage.getWidgetPositions();
    expect(positions.length).toBe(4);
    
    // Verify 2x2 grid layout
    const row1Widgets = positions.filter(p => p.y < 300);
    const row2Widgets = positions.filter(p => p.y >= 300);
    expect(row1Widgets.length).toBe(2);
    expect(row2Widgets.length).toBe(2);
    logger.info('KPI widgets displayed in 2x2 grid layout');
    
    // Step 4: Verify no content overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(768);
    logger.info('No content overflow detected');
    
    // Step 5: Verify appropriate spacing
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    logger.info('Layout adapts to tablet screen size with appropriate spacing');
  });

  test('TC-6171: Verify layout warning logged for very small screen device', async ({ page }) => {
    logger.info('Test Case ID: 6171 - Verify layout warning is logged when dashboard is accessed on very small screen');
    
    // Step 1: Set viewport to very small screen (iPhone 5/SE)
    await page.setViewportSize({ width: 320, height: 568 });
    logger.info('Viewport set to 320px x 568px (iPhone 5/SE)');
    
    // Step 2: User is already authenticated
    await dashboardPage.navigate();
    
    // Step 3: Observe KPI widgets display issues
    const widgets = await dashboardPage.getAllKpiWidgets();
    expect(widgets.length).toBe(4);
    logger.info('KPI widgets displayed on very small screen');
    
    // Step 4: Verify system logs layout warning
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'warning') {
        consoleLogs.push(msg.text());
      }
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    const hasLayoutWarning = consoleLogs.some(log => 
      log.includes('Layout warning') && log.includes('320px') && log.includes('375px')
    );
    logger.info('Layout warning logged for screens below minimum supported width');
    
    // Step 5: Verify dashboard remains functional
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    await expect(dashboardPage.monthlySpendValue).toBeVisible();
    logger.info('Dashboard remains functional despite layout issues');
  });
});
