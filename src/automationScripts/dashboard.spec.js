const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');
const Logger = require('../utils/logger');

const logger = new Logger('DashboardSpec');

test.describe('Dashboard KPIs Display - QE-7949', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Test setup: Navigating to application');
  });

  test('QE-7949 TS-001 TC-001: Verify authenticated user with multiple credit cards views accurate KPIs within 2 seconds', async ({ page }) => {
    logger.info('Starting test: QE-7949 TS-001 TC-001');
    
    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveTitle(/Credit Card Dashboard/);
    logger.info('Application loaded successfully');

    // Step 2: Authenticate user
    await loginPage.login(testData.users.test_user_kpi.username, testData.users.test_user_kpi.password);
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    logger.info('User authenticated successfully');

    // Step 3: Navigate to dashboard and measure load time
    const startTime = Date.now();
    await dashboardPage.navigateToDashboard();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);

    // Step 4-7: Verify all KPIs
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$5,000');
    logger.info('Monthly Spend KPI verified: $5,000');

    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalLimit).toBe('$50,000');
    logger.info('Total Credit Limit KPI verified: $50,000');

    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$35,000');
    logger.info('Available Credit KPI verified: $35,000');

    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    expect(outstanding).toBe('$15,000');
    logger.info('Outstanding Amount KPI verified: $15,000');

    // Step 8: Verify all KPIs loaded within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    logger.info('All KPIs loaded within 2-second NFR requirement');
  });

  test('QE-7949 TS-002 TC-001: Verify user with no credit cards views message with zero KPI values', async ({ page }) => {
    logger.info('Starting test: QE-7949 TS-002 TC-001');
    
    // Step 1: Authenticate user with no cards
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_no_cards.username, testData.users.test_user_no_cards.password);
    logger.info('User with no cards authenticated');

    // Step 2: Navigate to dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Verify no cards message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const message = await dashboardPage.getNoCardsMessageText();
    expect(message).toContain('No credit cards linked to your account');
    logger.info('No cards message verified');

    // Step 4: Verify all KPIs show $0.00
    expect(await dashboardPage.getMonthlySpendValue()).toBe('$0.00');
    expect(await dashboardPage.getTotalCreditLimitValue()).toBe('$0.00');
    expect(await dashboardPage.getAvailableCreditValue()).toBe('$0.00');
    expect(await dashboardPage.getOutstandingAmountValue()).toBe('$0.00');
    logger.info('All KPIs verified as $0.00');

    // Step 5: Verify no card summary cards displayed
    const cardCount = await dashboardPage.getCardSummaryCount();
    expect(cardCount).toBe(0);
    logger.info('Verified no card summary cards displayed');
  });

  test('QE-7949 TS-003 TC-001: Verify error message when credit card data service is unavailable', async ({ page, context }) => {
    logger.info('Starting test: QE-7949 TS-003 TC-001');
    
    // Step 1: Simulate service unavailability
    await context.route('**/api/dashboard/kpis', route => {
      route.abort('failed');
    });
    logger.info('Simulated credit card data service unavailability');

    // Step 2: Authenticate user
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_service_down.username, testData.users.test_user_service_down.password);

    // Step 3: Navigate to dashboard
    await dashboardPage.navigateToDashboard();

    // Step 4: Verify error message
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.getErrorMessageText();
    expect(errorText).toContain('Unable to load credit card data');
    logger.info('Error message verified');

    // Step 5: Verify application remains stable
    await expect(dashboardPage.navigationMenu).toBeVisible();
    logger.info('Application remains stable - navigation menu accessible');

    // Step 6: Verify KPIs show N/A or loading indicators
    const kpiValue = await dashboardPage.getMonthlySpendValue();
    expect(['N/A', 'Loading...'].includes(kpiValue)).toBeTruthy();
    logger.info('KPI displays N/A or loading indicator as expected');
  });
});

test.describe('Multiple Credit Card Overview - QE-7945', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('QE-7945 TS-001 TC-001: Verify user with three cards views responsive mobile layout', async ({ page, context }) => {
    logger.info('Starting test: QE-7945 TS-001 TC-001');
    
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_three_cards.username, testData.users.test_user_three_cards.password);
    logger.info('User authenticated on mobile device');

    // Step 2: Navigate to dashboard
    const startTime = Date.now();
    await dashboardPage.navigateToDashboard();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info('Dashboard loaded within 2 seconds on mobile');

    // Step 3: Verify three cards displayed in vertical stack
    const cardCount = await dashboardPage.getCardSummaryCount();
    expect(cardCount).toBe(3);
    await expect(dashboardPage.cardSummaryContainer).toHaveCSS('flex-direction', 'column');
    logger.info('Three cards displayed in vertical stack');

    // Verify each card details
    const card1 = await dashboardPage.getCardDetails(0);
    expect(card1.cardNumber).toContain('****1234');
    expect(card1.creditLimit).toBe('$10,000');
    logger.info('Card 1 details verified');

    // Step 4: Verify aggregated totals
    await dashboardPage.scrollToAggregatedTotals();
    await expect(dashboardPage.aggregatedTotalsSection).toBeVisible();
    expect(await dashboardPage.getTotalCreditLimitValue()).toBe('$35,000');
    expect(await dashboardPage.getTotalAvailableCreditValue()).toBe('$22,000');
    expect(await dashboardPage.getTotalOutstandingValue()).toBe('$13,000');
    logger.info('Aggregated totals verified');

    // Step 5: Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalScroll).toBe(false);
    logger.info('Verified no horizontal scrolling on mobile');
  });

  test('QE-7945 TS-002 TC-001: Verify user with one card views single card summary without aggregated totals', async ({ page }) => {
    logger.info('Starting test: QE-7945 TS-002 TC-001');
    
    // Step 1: Authenticate user with single card
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_single_card.username, testData.users.test_user_single_card.password);

    // Step 2: Navigate to dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Verify single card details
    const cardCount = await dashboardPage.getCardSummaryCount();
    expect(cardCount).toBe(1);
    const cardDetails = await dashboardPage.getCardDetails(0);
    expect(cardDetails.cardNumber).toContain('****1234');
    expect(cardDetails.creditLimit).toBe('$15,000');
    logger.info('Single card details verified');

    // Step 4: Verify no aggregated totals section
    await expect(dashboardPage.aggregatedTotalsSection).not.toBeVisible();
    logger.info('Verified aggregated totals section not displayed');

    // Step 5: Verify single card message
    await expect(dashboardPage.singleCardMessage).toBeVisible();
    const message = await dashboardPage.getSingleCardMessageText();
    expect(message).toContain('You have 1 credit card linked');
    logger.info('Single card message verified');
  });

  test('QE-7945 TS-003 TC-001: Verify responsive layout adapts on desktop and mobile', async ({ page }) => {
    logger.info('Starting test: QE-7945 TS-003 TC-001');
    
    // Step 1: Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginPage.navigate();
    await loginPage.login(testData.users.test_user_responsive.username, testData.users.test_user_responsive.password);
    logger.info('User authenticated on desktop');

    // Step 2: Verify desktop 3-column grid layout
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.cardSummaryContainer).toHaveCSS('display', 'grid');
    const gridColumns = await dashboardPage.getGridColumnCount();
    expect(gridColumns).toBe(3);
    logger.info('Desktop 3-column grid layout verified');

    // Step 3: Verify all card details readable on desktop
    const cardCount = await dashboardPage.getCardSummaryCount();
    expect(cardCount).toBe(3);
    for (let i = 0; i < 3; i++) {
      const card = await dashboardPage.getCardDetails(i);
      expect(card.cardNumber).toBeTruthy();
      expect(card.creditLimit).toBeTruthy();
    }
    logger.info('All card details readable on desktop');

    // Step 4: Resize to mobile width
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500); // Allow layout to adapt
    logger.info('Viewport resized to mobile width');

    // Step 5: Verify 1-column vertical stack
    await expect(dashboardPage.cardSummaryContainer).toHaveCSS('flex-direction', 'column');
    const mobileColumns = await dashboardPage.getGridColumnCount();
    expect(mobileColumns).toBe(1);
    logger.info('Mobile 1-column layout verified');

    // Step 6: Verify no horizontal scrolling on mobile
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalScroll).toBe(false);
    logger.info('Verified no horizontal scrolling on mobile after resize');
  });
});