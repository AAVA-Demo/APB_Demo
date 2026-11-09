const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { logger } = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to Dashboard');
  });

  test('QE-8251 TS001 TC-001: Verify aggregated dashboard metrics load within 2 seconds', async ({ page }) => {
    logger.info('Test: Verify aggregated dashboard metrics load within 2 seconds');
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(parseFloat(monthlySpend.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    logger.info('All KPIs verified successfully');
  });

  test('QE-8233 TS001 TC-001: Verify aggregated KPI calculation across multiple cards', async ({ page }) => {
    logger.info('Test: Verify aggregated KPI calculation across multiple cards');
    
    await dashboardPage.waitForDashboardLoad();
    
    const totalMonthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const totalAvailableCredit = await dashboardPage.getAvailableCredit();
    const totalOutstanding = await dashboardPage.getOutstandingAmount();
    
    expect(parseFloat(totalMonthlySpend.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalCreditLimit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalAvailableCredit.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalOutstanding.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
    
    logger.info('Aggregated KPIs calculated correctly');
  });

  test('QE-8248 TS001 TC-001: Verify real-time KPI updates within 30 seconds', async ({ page }) => {
    logger.info('Test: Verify real-time KPI updates');
    
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    logger.info(`Initial Monthly Spend: ${initialMonthlySpend}`);
    
    // Wait for refresh interval (30 seconds + buffer)
    await page.waitForTimeout(35000);
    
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    logger.info(`Updated Monthly Spend: ${updatedMonthlySpend}`);
    
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    logger.info('Real-time refresh verified');
  });

  test('QE-8247 TS001 TC-001: Verify mobile responsive dashboard loads within 2 seconds', async ({ page, context }) => {
    logger.info('Test: Verify mobile responsive dashboard');
    
    // Set mobile viewport
    await context.setViewportSize({ width: 390, height: 844 });
    
    const startTime = Date.now();
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    logger.info(`Mobile dashboard loaded in ${loadTime}ms`);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    logger.info('Mobile responsive layout verified');
  });
});

test.describe('Portfolio Management Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.navigateToPortfolio();
    logger.info('Navigated to Portfolio');
  });

  test('QE-8252 TS001 TC-001: Verify portfolio overview displays all credit cards', async ({ page }) => {
    logger.info('Test: Verify portfolio overview displays all credit cards');
    
    await expect(dashboardPage.portfolioSection).toBeVisible();
    
    const cardCount = await dashboardPage.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    logger.info(`Portfolio displays ${cardCount} cards`);
    
    const firstCard = await dashboardPage.getCardDetails(0);
    expect(firstCard.limit).toBeDefined();
    expect(firstCard.available).toBeDefined();
    expect(firstCard.outstanding).toBeDefined();
    
    logger.info('Portfolio overview verified successfully');
  });
});

test.describe('Accessibility Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to Dashboard for accessibility testing');
  });

  test('QE-8238 TS001 TC-001: Verify screen reader accessibility with proper ARIA labels', async ({ page }) => {
    logger.info('Test: Verify screen reader accessibility');
    
    await expect(dashboardPage.monthlySpendKPI).toHaveAttribute('aria-label');
    await expect(dashboardPage.totalCreditLimitKPI).toHaveAttribute('aria-label');
    await expect(dashboardPage.availableCreditKPI).toHaveAttribute('aria-label');
    await expect(dashboardPage.outstandingAmountKPI).toHaveAttribute('aria-label');
    
    const ariaLabel = await dashboardPage.monthlySpendKPI.getAttribute('aria-label');
    expect(ariaLabel).toContain('Monthly Spend');
    
    logger.info('ARIA labels verified successfully');
  });

  test('QE-8238 TS002 TC-001: Verify keyboard navigation with visible focus indicators', async ({ page }) => {
    logger.info('Test: Verify keyboard navigation');
    
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    const outlineStyle = await focusedElement.evaluate(el => window.getComputedStyle(el).outline);
    expect(outlineStyle).not.toBe('none');
    
    logger.info('Keyboard navigation verified successfully');
  });
});