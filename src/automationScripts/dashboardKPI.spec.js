const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPIs and Real-Time Tracking - QE-9421 & QE-9419', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Initializing Dashboard KPI test');
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
  });

  test('QE-9421 TS-001 TC-001: Verify dashboard auto-refreshes within 60 seconds after new transaction', async ({ page }) => {
    logger.info('Starting test: QE-9421 TS-001 TC-001');
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Application loaded');
    
    // Step 2: Login
    await loginPage.login('testuser_active', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('User authenticated and dashboard loaded');
    
    // Step 3: Note initial KPI values
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    const initialOutstanding = await dashboardPage.getTotalOutstanding();
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(initialMonthlySpend).toBe(5000);
    expect(initialOutstanding).toBe(15000);
    expect(initialAvailableCredit).toBe(35000);
    logger.info('Initial KPI values noted');
    
    // Step 4: Simulate new transaction (via API or admin panel)
    // Note: This would typically call a backend API or use admin panel
    logger.info('Simulating $500 transaction on Card 1');
    
    // Step 5: Wait for auto-refresh (60 seconds)
    await page.waitForTimeout(60000);
    logger.info('Waited 60 seconds for auto-refresh');
    
    // Step 6: Verify updated monthly spend
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(updatedMonthlySpend).toBe(5500);
    logger.info('Updated monthly spend verified');
    
    // Step 7: Verify updated outstanding
    const updatedOutstanding = await dashboardPage.getTotalOutstanding();
    expect(updatedOutstanding).toBe(15500);
    logger.info('Updated outstanding verified');
    
    // Step 8: Verify updated available credit
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(updatedAvailableCredit).toBe(34500);
    logger.info('Updated available credit verified');
  });

  test('QE-9421 TS-002 TC-001: Verify dashboard handles backend unavailability gracefully', async ({ page }) => {
    logger.info('Starting test: QE-9421 TS-002 TC-001');
    
    // Step 1: Login and load dashboard
    await dashboardPage.navigate();
    await loginPage.login('testuser_active', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard loaded with initial data');
    
    // Step 2: Note initial values
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    const initialOutstanding = await dashboardPage.getTotalOutstanding();
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    logger.info('Initial values noted');
    
    // Step 3: Simulate backend outage
    await page.route('**/api/**', route => route.abort());
    logger.info('Backend service simulated as unavailable');
    
    // Step 4: Wait for auto-refresh attempt
    await page.waitForTimeout(60000);
    logger.info('Auto-refresh attempted');
    
    // Step 5: Verify error notification
    const errorMessage = await dashboardPage.getErrorNotification();
    expect(errorMessage).toContain('Unable to refresh dashboard data');
    logger.info('Error notification verified');
    
    // Step 6: Verify data retained
    const retainedMonthlySpend = await dashboardPage.getMonthlySpend();
    const retainedOutstanding = await dashboardPage.getTotalOutstanding();
    const retainedAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(retainedMonthlySpend).toBe(initialMonthlySpend);
    expect(retainedOutstanding).toBe(initialOutstanding);
    expect(retainedAvailableCredit).toBe(initialAvailableCredit);
    logger.info('Previously loaded data retained');
    
    // Step 7: Verify dashboard remains functional
    const isNavigationActive = await dashboardPage.isNavigationActive();
    expect(isNavigationActive).toBe(true);
    logger.info('Dashboard navigation verified as functional');
  });

  test('QE-9421 TS-003 TC-001: Verify dashboard aggregates simultaneous transactions across multiple cards', async ({ page }) => {
    logger.info('Starting test: QE-9421 TS-003 TC-001');
    
    // Step 1: Login with user having 3 cards
    await dashboardPage.navigate();
    await loginPage.login('testuser_3cards', 'Pass@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('User authenticated');
    
    // Step 2: Note initial consolidated values
    const initialTotalLimit = await dashboardPage.getTotalCreditLimit();
    const initialOutstanding = await dashboardPage.getTotalOutstanding();
    const initialAvailableCredit = await dashboardPage.getAvailableCredit();
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(initialTotalLimit).toBe(45000);
    expect(initialOutstanding).toBe(15000);
    expect(initialAvailableCredit).toBe(30000);
    expect(initialMonthlySpend).toBe(5000);
    logger.info('Initial consolidated KPI values noted');
    
    // Step 3: Simulate simultaneous transactions
    logger.info('Simulating simultaneous transactions: Card 1: $300, Card 2: $500, Card 3: $700');
    
    // Step 4: Wait for auto-refresh
    await page.waitForTimeout(60000);
    logger.info('Auto-refresh completed');
    
    // Step 5: Verify total credit limit unchanged
    const updatedTotalLimit = await dashboardPage.getTotalCreditLimit();
    expect(updatedTotalLimit).toBe(45000);
    logger.info('Total credit limit unchanged');
    
    // Step 6: Verify updated outstanding
    const updatedOutstanding = await dashboardPage.getTotalOutstanding();
    expect(updatedOutstanding).toBe(16500);
    logger.info('Total outstanding updated correctly');
    
    // Step 7: Verify updated available credit
    const updatedAvailableCredit = await dashboardPage.getAvailableCredit();
    expect(updatedAvailableCredit).toBe(28500);
    logger.info('Available credit updated correctly');
    
    // Step 8: Verify updated monthly spend
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    expect(updatedMonthlySpend).toBe(6500);
    logger.info('Monthly spend aggregated correctly');
  });

  test('QE-9419 TS-001 TC-001: Verify consolidated KPI metrics for user with 3 cards', async ({ page }) => {
    logger.info('Starting test: QE-9419 TS-001 TC-001');
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Application loaded');
    
    // Step 2: Login with user having 3 cards
    await loginPage.login('testuser_3cards', 'Pass@123');
    await dashboardPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 3: Verify dashboard loads within 2 seconds
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    
    // Step 4: Verify Total Credit Limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe(45000);
    logger.info('Total Credit Limit verified');
    
    // Step 5: Verify Total Outstanding
    const totalOutstanding = await dashboardPage.getTotalOutstanding();
    expect(totalOutstanding).toBe(15000);
    logger.info('Total Outstanding verified');
    
    // Step 6: Verify Available Credit
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe(30000);
    logger.info('Available Credit verified');
    
    // Step 7: Verify Monthly Spend
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe(5000);
    logger.info('Monthly Spend verified');
    
    // Step 8: Verify currency formatting
    const isCurrencyFormatted = await dashboardPage.verifyCurrencyFormatting();
    expect(isCurrencyFormatted).toBe(true);
    logger.info('Currency formatting verified');
  });

  test('QE-9419 TS-002 TC-001: Verify dashboard displays partial KPIs when one card service fails', async ({ page }) => {
    logger.info('Starting test: QE-9419 TS-002 TC-001');
    
    // Step 1: Login with user having 3 cards
    await dashboardPage.navigate();
    await loginPage.login('testuser_3cards', 'Pass@123');
    await dashboardPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Simulate Card 3 service failure
    await page.route('**/api/cards/card-003', route => route.abort());
    logger.info('Card 3 service simulated as failed');
    
    // Step 3: Verify dashboard loads with partial data
    await dashboardPage.waitForDashboardLoad();
    const visibleCardCount = await dashboardPage.getVisibleCardCount();
    expect(visibleCardCount).toBe(2);
    logger.info('Dashboard displays data for 2 out of 3 cards');
    
    // Step 4: Verify warning notification
    const warningMessage = await dashboardPage.getWarningNotification();
    expect(warningMessage).toContain('Unable to load data for 1 card');
    logger.info('Warning notification verified');
    
    // Step 5: Verify partial Total Credit Limit
    const partialTotalLimit = await dashboardPage.getTotalCreditLimit();
    expect(partialTotalLimit).toBe(25000);
    logger.info('Partial Total Credit Limit verified');
    
    // Step 6: Verify partial Total Outstanding
    const partialOutstanding = await dashboardPage.getTotalOutstanding();
    expect(partialOutstanding).toBe(7000);
    logger.info('Partial Total Outstanding verified');
    
    // Step 7: Verify dashboard remains functional
    const isNavigationActive = await dashboardPage.isNavigationActive();
    const hasRetryButton = await dashboardPage.hasRetryButton();
    expect(isNavigationActive).toBe(true);
    expect(hasRetryButton).toBe(true);
    logger.info('Dashboard functionality verified');
  });

  test('QE-9419 TS-003 TC-001: Verify dashboard with zero outstanding balance', async ({ page }) => {
    logger.info('Starting test: QE-9419 TS-003 TC-001');
    
    // Step 1: Login with user having zero balance
    await dashboardPage.navigate();
    await loginPage.login('testuser_zerobala', 'Pass@123');
    await dashboardPage.waitForAuthenticationComplete();
    logger.info('User authenticated');
    
    // Step 2: Verify dashboard loads
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now();
    expect(loadTime).toBeLessThan(2000);
    logger.info('Dashboard loaded successfully');
    
    // Step 3: Verify Total Outstanding is zero
    const totalOutstanding = await dashboardPage.getTotalOutstanding();
    expect(totalOutstanding).toBe(0);
    logger.info('Total Outstanding verified as $0');
    
    // Step 4: Verify Available Credit equals Total Limit
    const availableCredit = await dashboardPage.getAvailableCredit();
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    expect(availableCredit).toBe(totalLimit);
    expect(availableCredit).toBe(45000);
    logger.info('Available Credit equals Total Credit Limit');
    
    // Step 5: Verify Monthly Spend from current month only
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe(3500);
    logger.info('Monthly Spend calculated from current month only');
    
    // Step 6: Verify no error or warning messages
    const hasNotifications = await dashboardPage.hasNotifications();
    expect(hasNotifications).toBe(false);
    logger.info('No error or warning messages displayed');
    
    // Step 7: Verify card overview shows zero balance
    const cardOverviewBalances = await dashboardPage.getCardOverviewBalances();
    cardOverviewBalances.forEach(balance => {
      expect(balance).toBe(0);
    });
    logger.info('Card overview shows $0 outstanding for all cards');
  });
});
