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
    logger.info('Navigating to application login page');
    await loginPage.navigate();
  });

  test('QE-7526 TS-001 TC-001: Verify dashboard KPIs are calculated correctly and displayed within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-7526 TS-001 TC-001 - Dashboard KPI Real-Time Display');
    
    await test.step('Login with valid credentials for user with active credit cards', async () => {
      await loginPage.login('activeuser@example.com', 'SecurePass456');
      logger.info('User authenticated successfully');
    });

    await test.step('Verify dashboard loads within 2 seconds', async () => {
      const startTime = Date.now();
      await dashboardPage.waitForDashboardLoad();
      const loadTime = Date.now() - startTime;
      logger.info(`Dashboard load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThanOrEqual(2000);
    });

    await test.step('Verify KPI values are displayed correctly', async () => {
      await expect(dashboardPage.monthlySpendKPI).toBeVisible();
      await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
      await expect(dashboardPage.availableCreditKPI).toBeVisible();
      await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
      
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
      const availableCredit = await dashboardPage.getAvailableCreditValue();
      const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
      
      logger.info(`KPI Values - Monthly Spend: ${monthlySpend}, Total Credit Limit: ${totalCreditLimit}, Available Credit: ${availableCredit}, Outstanding: ${outstandingAmount}`);
      
      expect(monthlySpend).toBeTruthy();
      expect(totalCreditLimit).toBeTruthy();
      expect(availableCredit).toBeTruthy();
      expect(outstandingAmount).toBeTruthy();
    });
  });

  test('QE-7526 TS-002 TC-001: Verify dashboard displays zero KPI values for user with no linked credit cards', async ({ page }) => {
    logger.info('Test Case: QE-7526 TS-002 TC-001 - No Credit Cards Scenario');
    
    await test.step('Login with user having no credit cards', async () => {
      await loginPage.login('nocards@example.com', 'TestPass789');
      logger.info('User with no cards authenticated successfully');
    });

    await test.step('Verify zero KPI values are displayed', async () => {
      await dashboardPage.waitForDashboardLoad();
      
      const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
      const availableCredit = await dashboardPage.getAvailableCreditValue();
      const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
      
      logger.info(`KPI Values for no cards user - Total Credit Limit: ${totalCreditLimit}, Available Credit: ${availableCredit}, Outstanding: ${outstandingAmount}`);
      
      expect(totalCreditLimit).toContain('0');
      expect(availableCredit).toContain('0');
      expect(outstandingAmount).toContain('0');
    });

    await test.step('Verify appropriate message is displayed', async () => {
      const noCardsMessage = await dashboardPage.getNoCardsMessage();
      logger.info(`No cards message: ${noCardsMessage}`);
      expect(noCardsMessage).toContain('No credit cards linked');
    });
  });

  test('QE-7526 TS-003 TC-001: Verify error message when backend service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-7526 TS-003 TC-001 - Backend Service Unavailable');
    
    await test.step('Simulate backend service unavailability', async () => {
      await page.route('**/api/cards/**', route => route.abort());
      await page.route('**/api/transactions/**', route => route.abort());
      logger.info('Backend service routes blocked to simulate unavailability');
    });

    await test.step('Login with valid credentials', async () => {
      await loginPage.login('testuser@example.com', 'ValidPass123');
      logger.info('User authenticated successfully');
    });

    await test.step('Verify error message is displayed', async () => {
      await dashboardPage.waitForErrorMessage();
      const errorMessage = await dashboardPage.getErrorMessage();
      logger.info(`Error message displayed: ${errorMessage}`);
      expect(errorMessage).toContain('Failed to load dashboard data');
    });

    await test.step('Verify no stale KPI values are displayed', async () => {
      const kpisVisible = await dashboardPage.areKPIsVisible();
      expect(kpisVisible).toBe(false);
      logger.info('Confirmed no stale KPI values are displayed');
    });
  });
});

test.describe('Responsive Dashboard Layout Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('QE-7527 TS-001 TC-001: Verify dashboard displays responsively on mobile device with 375px width', async ({ page }) => {
    logger.info('Test Case: QE-7527 TS-001 TC-001 - Mobile Responsive Layout (375px)');
    
    await test.step('Set viewport to 375px width', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      logger.info('Viewport set to 375px width');
    });

    await test.step('Navigate and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'ValidPass123');
      logger.info('User authenticated on mobile viewport');
    });

    await test.step('Verify responsive layout', async () => {
      await dashboardPage.waitForDashboardLoad();
      
      const kpisVisible = await dashboardPage.areAllKPIsVisible();
      expect(kpisVisible).toBe(true);
      logger.info('All KPI metrics are visible in responsive layout');
    });

    await test.step('Verify no horizontal scrolling required', async () => {
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
      logger.info('No horizontal scrolling required');
    });

    await test.step('Verify text readability', async () => {
      const fontSize = await dashboardPage.getKPIFontSize();
      logger.info(`KPI font size: ${fontSize}`);
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14);
    });
  });

  test('QE-7527 TS-002 TC-001: Verify dashboard maintains data integrity on extremely small viewport (320px)', async ({ page }) => {
    logger.info('Test Case: QE-7527 TS-002 TC-001 - Extremely Small Viewport (320px)');
    
    await test.step('Set viewport to 320px width', async () => {
      await page.setViewportSize({ width: 320, height: 568 });
      logger.info('Viewport set to 320px width');
    });

    await test.step('Navigate and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'ValidPass123');
      logger.info('User authenticated on 320px viewport');
    });

    await test.step('Verify all KPI values are visible and not truncated', async () => {
      await dashboardPage.waitForDashboardLoad();
      
      const allKPIsVisible = await dashboardPage.areAllKPIsVisible();
      expect(allKPIsVisible).toBe(true);
      
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
      const availableCredit = await dashboardPage.getAvailableCreditValue();
      const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
      
      expect(monthlySpend).toBeTruthy();
      expect(totalCreditLimit).toBeTruthy();
      expect(availableCredit).toBeTruthy();
      expect(outstandingAmount).toBeTruthy();
      
      logger.info('All KPI values are visible and complete on 320px viewport');
    });

    await test.step('Verify layout adjusts appropriately', async () => {
      const isStackedLayout = await dashboardPage.isKPILayoutStacked();
      expect(isStackedLayout).toBe(true);
      logger.info('Layout is stacked vertically for small viewport');
    });
  });

  test('QE-7527 TS-003 TC-001: Verify dashboard layout dynamically adjusts when browser window is resized', async ({ page }) => {
    logger.info('Test Case: QE-7527 TS-003 TC-001 - Dynamic Layout Adjustment');
    
    await test.step('Set initial desktop viewport', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      logger.info('Initial viewport set to 1920px width (desktop)');
    });

    await test.step('Navigate and login', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser@example.com', 'ValidPass123');
      logger.info('User authenticated on desktop viewport');
    });

    await test.step('Verify desktop layout', async () => {
      await dashboardPage.waitForDashboardLoad();
      const isDesktopLayout = await dashboardPage.isDesktopLayout();
      expect(isDesktopLayout).toBe(true);
      logger.info('Desktop layout confirmed');
    });

    await test.step('Resize to mobile dimensions without page reload', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      logger.info('Viewport resized to 375px width (mobile)');
    });

    await test.step('Verify layout dynamically adjusted to mobile', async () => {
      const isMobileLayout = await dashboardPage.isMobileLayout();
      expect(isMobileLayout).toBe(true);
      
      const allKPIsVisible = await dashboardPage.areAllKPIsVisible();
      expect(allKPIsVisible).toBe(true);
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
      
      logger.info('Layout dynamically adjusted to mobile without page reload');
    });
  });
});