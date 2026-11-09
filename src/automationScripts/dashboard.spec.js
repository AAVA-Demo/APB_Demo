const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to Dashboard page');
    await dashboardPage.navigate();
  });

  test('QE-8872 TS-001 TC-001: Verify multi-card portfolio dashboard displays all cards with accurate KPIs within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-8872 TS-001 TC-001 - Multi-card portfolio dashboard validation');
    
    // Wait for dashboard to load and verify load time
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
    
    // Verify all three credit cards are displayed
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(3);
    logger.info(`Verified ${cardCount} credit cards are displayed`);
    
    // Verify specific cards are visible
    await expect(dashboardPage.getCreditCardByLastDigits('1234')).toBeVisible();
    await expect(dashboardPage.getCreditCardByLastDigits('5678')).toBeVisible();
    await expect(dashboardPage.getCreditCardByLastDigits('9012')).toBeVisible();
    
    // Verify KPIs are displayed and have values
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Verify KPI values are numeric and greater than 0
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toBeGreaterThanOrEqual(0);
    expect(totalCreditLimit).toBeGreaterThan(0);
    expect(availableCredit).toBeGreaterThanOrEqual(0);
    expect(outstandingAmount).toBeGreaterThanOrEqual(0);
    
    logger.info('All KPIs validated successfully');
  });

  test('QE-8872 TS-002 TC-001: Verify single-card portfolio dashboard displays card with accurate KPIs', async ({ page }) => {
    logger.info('Test Case: QE-8872 TS-002 TC-001 - Single-card portfolio dashboard validation');
    
    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    
    // Verify single credit card is displayed
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(1);
    logger.info('Verified single credit card is displayed');
    
    // Verify the specific card is visible
    await expect(dashboardPage.getCreditCardByLastDigits('1234')).toBeVisible();
    
    // Verify all KPIs are displayed
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Verify KPI values match single card data
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toBeGreaterThanOrEqual(0);
    expect(totalCreditLimit).toBeGreaterThan(0);
    expect(availableCredit).toBeGreaterThanOrEqual(0);
    expect(outstandingAmount).toBeGreaterThanOrEqual(0);
    
    logger.info('Single card KPIs validated successfully');
  });

  test('QE-8872 TS-003 TC-001: Verify appropriate message displays when no credit cards are registered', async ({ page }) => {
    logger.info('Test Case: QE-8872 TS-003 TC-001 - No credit cards scenario validation');
    
    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    
    // Verify no credit cards message is displayed
    await expect(dashboardPage.noCreditCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCreditCardsMessageText();
    expect(messageText).toContain('No credit cards found');
    logger.info('No credit cards message displayed correctly');
    
    // Verify no broken KPI widgets are displayed
    const kpiWidgetsVisible = await dashboardPage.areKPIWidgetsVisible();
    if (kpiWidgetsVisible) {
      // If KPIs are visible, verify they show zero or appropriate values
      const monthlySpend = await dashboardPage.getMonthlySpendValue();
      expect(monthlySpend).toBe(0);
    }
    
    // Verify page remains functional without errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    expect(consoleErrors.length).toBe(0);
    logger.info('Page functional without errors');
  });

  test('QE-8873 TS-001 TC-001: Verify dashboard layout adjusts correctly for mobile device viewport (375px width)', async ({ page }) => {
    logger.info('Test Case: QE-8873 TS-001 TC-001 - Mobile viewport layout validation');
    
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    logger.info('Viewport set to 375px x 667px');
    
    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    
    // Verify KPIs are displayed in stacked format
    const kpiLayout = await dashboardPage.getKPILayout();
    expect(kpiLayout).toBe('stacked');
    logger.info('KPIs displayed in stacked mobile layout');
    
    // Verify no horizontal scrolling is required
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBe(false);
    logger.info('No horizontal scrolling required');
    
    // Verify all KPI labels and values are visible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Verify credit card list displays correctly
    const creditCardListVisible = await dashboardPage.isCreditCardListVisible();
    expect(creditCardListVisible).toBe(true);
    
    logger.info('Mobile layout validated successfully');
  });

  test('QE-8873 TS-002 TC-001: Verify dashboard layout optimizes for desktop device viewport (1920px width)', async ({ page }) => {
    logger.info('Test Case: QE-8873 TS-002 TC-001 - Desktop viewport layout validation');
    
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    logger.info('Viewport set to 1920px x 1080px');
    
    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    
    // Verify KPIs are displayed in multi-column layout
    const kpiLayout = await dashboardPage.getKPILayout();
    expect(kpiLayout).toBe('multi-column');
    logger.info('KPIs displayed in multi-column desktop layout');
    
    // Verify all KPIs are visible without truncation
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Verify credit card information displays in optimized layout
    const creditCardLayout = await dashboardPage.getCreditCardLayout();
    expect(['grid', 'multi-column']).toContain(creditCardLayout);
    logger.info('Credit cards displayed in optimized desktop layout');
    
    // Verify no excessive white space
    const hasExcessiveWhiteSpace = await dashboardPage.hasExcessiveWhiteSpace();
    expect(hasExcessiveWhiteSpace).toBe(false);
    
    logger.info('Desktop layout validated successfully');
  });

  test('QE-8873 TS-003 TC-001: Verify dashboard maintains functional accessibility on extremely narrow viewport (320px width)', async ({ page }) => {
    logger.info('Test Case: QE-8873 TS-003 TC-001 - Extremely narrow viewport validation');
    
    // Set viewport to extremely narrow size
    await page.setViewportSize({ width: 320, height: 568 });
    logger.info('Viewport set to 320px x 568px');
    
    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    
    // Verify KPIs are displayed without breaking layout
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Verify vertical scrolling is available
    const hasVerticalScroll = await dashboardPage.hasVerticalScroll();
    expect(hasVerticalScroll).toBe(true);
    logger.info('Vertical scrolling available for content');
    
    // Verify no horizontal scrolling is required
    const hasHorizontalScroll = await dashboardPage.hasHorizontalScroll();
    expect(hasHorizontalScroll).toBe(false);
    logger.info('No horizontal scrolling required');
    
    // Verify all text is readable without truncation
    const allTextVisible = await dashboardPage.isAllTextVisible();
    expect(allTextVisible).toBe(true);
    
    logger.info('Extremely narrow viewport validated successfully');
  });
});
