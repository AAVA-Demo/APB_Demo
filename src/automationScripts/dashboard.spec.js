const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Credit Card Dashboard - Financial Overview KPIs', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Dashboard test suite');
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-7751 TS-001 TC-001: Verify user with multiple credit cards views aggregated KPIs within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-7751 TS-001 TC-001 - Multiple cards aggregated KPIs');
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    logger.info('Application launched successfully');
    
    // Step 2: Login with multi-card user
    await loginPage.login('testuser_multi_cards', 'Pass@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User authenticated and redirected to dashboard');
    
    // Step 3: Navigate to Financial Overview Dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.kpiSection).toBeVisible();
    logger.info('Dashboard KPI widgets loaded');
    
    // Step 4: Verify Total Credit Limit KPI
    const startTime = Date.now();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$18,000.00');
    logger.info('Total Credit Limit KPI verified: $18,000.00');
    
    // Step 5: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$12,800.00');
    logger.info('Available Credit KPI verified: $12,800.00');
    
    // Step 6: Verify Outstanding Amount KPI
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$5,200.00');
    logger.info('Outstanding Amount KPI verified: $5,200.00');
    
    // Step 7: Verify KPIs load within 2 seconds
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`KPIs loaded in ${loadTime}ms (requirement: ≤2000ms)`);
  });

  test('QE-7751 TS-002 TC-001: Verify user with single credit card views individual credit limit accurately', async ({ page }) => {
    logger.info('Test Case: QE-7751 TS-002 TC-001 - Single card credit limit');
    
    await dashboardPage.navigate();
    await loginPage.login('testuser_single_card', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$5,000.00');
    logger.info('Total Credit Limit verified for single card');
    
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$3,800.00');
    logger.info('Available Credit verified');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$1,200.00');
    logger.info('Outstanding Amount verified');
  });

  test('QE-7751 TS-003 TC-001: Verify user with no credit cards receives appropriate message', async ({ page }) => {
    logger.info('Test Case: QE-7751 TS-003 TC-001 - No cards message');
    
    await dashboardPage.navigate();
    await loginPage.login('testuser_no_cards', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessage();
    expect(messageText).toContain('No credit cards found');
    logger.info('No cards message displayed correctly');
    
    await expect(dashboardPage.totalCreditLimitKPI).not.toContainText('$0.00');
    logger.info('Verified no zero values displayed in KPI widgets');
  });

  test('QE-7750 TS-001 TC-001: Verify user with multiple cards views accurate total monthly spend within 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-7750 TS-001 TC-001 - Multiple cards monthly spend');
    
    await dashboardPage.navigate();
    await loginPage.login('testuser_multi_card_transactions', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    const startTime = Date.now();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$1,550.00');
    logger.info('Monthly Spend KPI verified: $1,550.00');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Monthly Spend KPI loaded in ${loadTime}ms`);
  });

  test('QE-7750 TS-002 TC-001: Verify user with single card views monthly spend correctly', async ({ page }) => {
    logger.info('Test Case: QE-7750 TS-002 TC-001 - Single card monthly spend');
    
    await dashboardPage.navigate();
    await loginPage.login('testuser_single_card_transactions', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$650.00');
    logger.info('Monthly Spend KPI verified for single card');
  });

  test('QE-7750 TS-003 TC-001: Verify user with no transactions views $0.00 with informational message', async ({ page }) => {
    logger.info('Test Case: QE-7750 TS-003 TC-001 - No transactions message');
    
    await dashboardPage.navigate();
    await loginPage.login('testuser_no_transactions', 'Pass@123');
    await dashboardPage.navigateToDashboard();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$0.00');
    logger.info('Monthly Spend displayed as $0.00');
    
    const message = await dashboardPage.getNoSpendingMessage();
    expect(message).toContain('No spending recorded for this month');
    logger.info('Informational message displayed correctly');
  });
});