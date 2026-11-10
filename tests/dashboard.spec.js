const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPI Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.login('testuser', 'Test@123');
  });

  test('QE-9932 TS001 TC-001: Verify dashboard displays all KPIs with accurate aggregated values from multiple credit cards within 3 seconds', async ({ page }) => {
    logger.info('Starting test: Dashboard KPI display with multiple cards');
    
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    logger.info(`Dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    logger.info(`Monthly Spend: ${monthlySpend}`);
    expect(monthlySpend).toBe('$4,240.75');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    logger.info(`Total Credit Limit: ${totalCreditLimit}`);
    expect(totalCreditLimit).toBe('$45,000.00');
    
    const availableCredit = await dashboardPage.getAvailableCredit();
    logger.info(`Available Credit: ${availableCredit}`);
    expect(availableCredit).toBe('$40,759.25');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    logger.info(`Outstanding Amount: ${outstandingAmount}`);
    expect(outstandingAmount).toBe('$4,240.75');
    
    logger.info('Test completed successfully');
  });

  test('QE-9932 TS002 TC-001: Verify dashboard displays user-friendly error message when credit card data service is unavailable', async ({ page }) => {
    logger.info('Starting test: Dashboard error handling when service unavailable');
    
    await page.route('**/api/dashboard/kpis*', route => {
      route.abort('failed');
    });
    
    await dashboardPage.refreshDashboard();
    
    const isErrorDisplayed = await dashboardPage.isErrorMessageVisible();
    expect(isErrorDisplayed).toBe(true);
    
    const errorMessage = await dashboardPage.getErrorMessage();
    logger.info(`Error message displayed: ${errorMessage}`);
    expect(errorMessage).toContain('Unable to load dashboard data');
    
    const isLayoutIntact = await dashboardPage.isPageStructureIntact();
    expect(isLayoutIntact).toBe(true);
    
    const hasPlaceholders = await dashboardPage.hasKPIPlaceholders();
    expect(hasPlaceholders).toBe(true);
    
    logger.info('Test completed successfully');
  });

  test('QE-9932 TS003 TC-001: Verify dashboard displays KPIs correctly for a user with a single credit card without aggregation errors', async ({ page }) => {
    logger.info('Starting test: Dashboard KPI display with single card');
    
    await dashboardPage.logout();
    await dashboardPage.login('singlecarduser', 'Test@123');
    
    await dashboardPage.waitForDashboardLoad();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    logger.info(`Monthly Spend: ${monthlySpend}`);
    expect(monthlySpend).toBe('$1,250.50');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    logger.info(`Total Credit Limit: ${totalCreditLimit}`);
    expect(totalCreditLimit).toBe('$10,000.00');
    
    const availableCredit = await dashboardPage.getAvailableCredit();
    logger.info(`Available Credit: ${availableCredit}`);
    expect(availableCredit).toBe('$8,749.50');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    logger.info(`Outstanding Amount: ${outstandingAmount}`);
    expect(outstandingAmount).toBe('$1,250.50');
    
    const hasNullValues = await dashboardPage.hasNullOrUndefinedValues();
    expect(hasNullValues).toBe(false);
    
    logger.info('Test completed successfully');
  });

  test('QE-9934 TS001 TC-001: Verify dashboard updates available credit and outstanding amount after a new transaction within 3 seconds', async ({ page }) => {
    logger.info('Starting test: Real-time transaction update on dashboard');
    
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialOutstanding = await dashboardPage.getOutstandingAmount();
    logger.info(`Initial values - Available: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    await dashboardPage.simulateTransaction(150, 'Restaurant ABC');
    
    const startTime = Date.now();
    await dashboardPage.refreshDashboard();
    const refreshTime = Date.now() - startTime;
    
    logger.info(`Dashboard refresh time: ${refreshTime}ms`);
    expect(refreshTime).toBeLessThan(3000);
    
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    const updatedOutstanding = await dashboardPage.getOutstandingAmount();
    logger.info(`Updated values - Available: ${updatedAvailableCredit}, Outstanding: ${updatedOutstanding}`);
    
    expect(updatedAvailableCredit).toBe('$7,850.00');
    expect(updatedOutstanding).toBe('$2,150.00');
    
    logger.info('Test completed successfully');
  });

  test('QE-9934 TS002 TC-001: Verify dashboard displays last known values with staleness indicator when real-time data refresh service fails', async ({ page }) => {
    logger.info('Starting test: Data refresh service failure handling');
    
    const initialValues = await dashboardPage.captureKPIValues();
    const initialTimestamp = await dashboardPage.getLastUpdatedTimestamp();
    logger.info(`Initial timestamp: ${initialTimestamp}`);
    
    await page.route('**/api/dashboard/kpis*', route => {
      route.abort('failed');
    });
    
    await dashboardPage.refreshDashboard();
    
    const currentValues = await dashboardPage.captureKPIValues();
    expect(currentValues).toEqual(initialValues);
    
    const hasStalenessIndicator = await dashboardPage.hasStalenessIndicator();
    expect(hasStalenessIndicator).toBe(true);
    
    const stalenessMessage = await dashboardPage.getStalenessMessage();
    logger.info(`Staleness message: ${stalenessMessage}`);
    expect(stalenessMessage).toMatch(/Data last updated|Unable to refresh data/i);
    
    const isDashboardFunctional = await dashboardPage.isDashboardFunctional();
    expect(isDashboardFunctional).toBe(true);
    
    logger.info('Test completed successfully');
  });

  test('QE-9934 TS003 TC-001: Verify dashboard updates all cards available credit and outstanding amounts after multiple recent transactions with correct aggregated KPIs', async ({ page }) => {
    logger.info('Starting test: Multiple cards real-time update');
    
    const initialKPIs = await dashboardPage.captureKPIValues();
    logger.info(`Initial KPIs: ${JSON.stringify(initialKPIs)}`);
    
    await dashboardPage.simulateTransactionOnCard('card-001', 200, 'Gas Station');
    await dashboardPage.simulateTransactionOnCard('card-002', 350, 'Shopping Mall');
    
    await dashboardPage.refreshDashboard();
    
    const card1Available = await dashboardPage.getCardAvailableCredit('card-001');
    const card1Outstanding = await dashboardPage.getCardOutstanding('card-001');
    logger.info(`Card 1 - Available: ${card1Available}, Outstanding: ${card1Outstanding}`);
    expect(card1Available).toBe('$7,800.00');
    expect(card1Outstanding).toBe('$2,200.00');
    
    const card2Available = await dashboardPage.getCardAvailableCredit('card-002');
    const card2Outstanding = await dashboardPage.getCardOutstanding('card-002');
    logger.info(`Card 2 - Available: ${card2Available}, Outstanding: ${card2Outstanding}`);
    expect(card2Available).toBe('$11,650.00');
    expect(card2Outstanding).toBe('$3,350.00');
    
    const totalAvailable = await dashboardPage.getAvailableCredit();
    const totalOutstanding = await dashboardPage.getOutstandingAmount();
    logger.info(`Total - Available: ${totalAvailable}, Outstanding: ${totalOutstanding}`);
    expect(totalAvailable).toBe('$19,450.00');
    expect(totalOutstanding).toBe('$5,550.00');
    
    logger.info('Test completed successfully');
  });
});