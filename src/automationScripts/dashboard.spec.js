const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../../utils/logger');

test.describe('Credit Card Dashboard - Consolidated KPI Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Setting up test - navigating to application');
    dashboardPage = new DashboardPage(page);
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  test('QE-10392 TS-001 TC-001 - Verify consolidated KPIs for multiple cards with load time under 2 seconds', async ({ page }) => {
    logger.info('Test Case: QE-10392 TS-001 TC-001 - Multiple cards consolidated KPI display');
    
    // Step 1-3: Login
    await loginPage.login('user_multicard@example.com', 'SecurePass@123');
    logger.info('User logged in successfully');
    
    // Step 4-5: Measure dashboard load time
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Dashboard load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(2000);
    
    // Step 6-9: Verify all KPIs
    await dashboardPage.verifyTotalCreditLimit('$50,000.00');
    logger.info('Total Credit Limit verified');
    
    await dashboardPage.verifyAvailableCredit('$42,500.00');
    logger.info('Available Credit verified');
    
    await dashboardPage.verifyOutstandingAmount('$7,500.00');
    logger.info('Outstanding Amount verified');
    
    await dashboardPage.verifyMonthlySpend('$3,500.75');
    logger.info('Monthly Spend verified');
    
    // Step 10: Verify formatting
    await dashboardPage.verifyKPIFormatting();
    logger.info('All KPI values have proper currency formatting');
  });

  test('QE-10392 TS-002 TC-001 - Verify KPI calculations for single card scenario', async ({ page }) => {
    logger.info('Test Case: QE-10392 TS-002 TC-001 - Single card KPI display');
    
    // Step 1-2: Login with single card user
    await loginPage.login('user_singlecard@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('Single card user logged in');
    
    // Step 3-6: Verify individual KPIs
    await dashboardPage.verifyTotalCreditLimit('$10,000.00');
    await dashboardPage.verifyAvailableCredit('$7,500.00');
    await dashboardPage.verifyOutstandingAmount('$2,500.00');
    await dashboardPage.verifyMonthlySpend('$1,200.00');
    logger.info('All KPI values verified for single card');
    
    // Step 7: Verify calculation accuracy
    const isCalculationCorrect = await dashboardPage.verifyCreditCalculation();
    expect(isCalculationCorrect).toBeTruthy();
    logger.info('Credit calculation verified: Available + Outstanding = Total Limit');
    
    // Step 8: Verify card count
    await dashboardPage.verifyActiveCardCount(1);
    logger.info('Active card count verified: 1');
  });

  test('QE-10392 TS-003 TC-001 - Verify expired token redirects to login with notification', async ({ page }) => {
    logger.info('Test Case: QE-10392 TS-003 TC-001 - Expired token handling');
    
    // Step 1-2: Login and load dashboard
    await loginPage.login('user_multicard@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardLoad();
    logger.info('User logged in and dashboard loaded');
    
    // Step 3: Simulate token expiration
    await page.evaluate(() => {
      localStorage.removeItem('authToken');
    });
    logger.info('Auth token removed to simulate expiration');
    
    // Step 4-5: Attempt to refresh and verify redirect
    await page.reload();
    await page.waitForURL('**/login', { timeout: 5000 });
    logger.info('User redirected to login page');
    
    // Step 6: Verify session timeout message
    await loginPage.verifySessionTimeoutMessage();
    logger.info('Session timeout notification displayed');
    
    // Step 7: Verify no KPI data visible
    const isKPIDataVisible = await dashboardPage.isKPIDataVisible();
    expect(isKPIDataVisible).toBeFalsy();
    logger.info('Confirmed: No KPI data displayed before redirect');
    
    // Step 8-9: Re-login and verify dashboard loads
    await loginPage.login('user_multicard@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.verifyAllKPIsVisible();
    logger.info('User re-authenticated and dashboard loaded successfully');
  });

  test('QE-10393 TS-001 TC-001 - Verify real-time credit update after transaction within 5 minutes', async ({ page }) => {
    logger.info('Test Case: QE-10393 TS-001 TC-001 - Real-time credit utilization monitoring');
    
    // Step 1-3: Login and navigate to dashboard
    await loginPage.login('user_realtime@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Record initial values
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    logger.info(`Initial values - Available: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    // Step 4: Simulate transaction (using test API or mock)
    await dashboardPage.simulateTransaction(150.00, 'Merchant ABC');
    logger.info('Transaction of $150.00 simulated');
    
    // Step 5-6: Wait up to 5 minutes and refresh
    await page.waitForTimeout(5000); // Simulating wait time
    await dashboardPage.refreshDashboard();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Dashboard refreshed after transaction');
    
    // Step 7-8: Verify updated values
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(updatedAvailableCredit).toBe(initialAvailableCredit - 150);
    expect(updatedOutstanding).toBe(initialOutstanding + 150);
    logger.info('Credit values updated correctly after transaction');
    
    // Step 9: Verify last updated timestamp
    const isTimestampRecent = await dashboardPage.verifyLastUpdatedWithinMinutes(5);
    expect(isTimestampRecent).toBeTruthy();
    logger.info('Last updated timestamp is within 5 minutes');
  });

  test('QE-10393 TS-002 TC-001 - Verify auto-refresh updates credit values without manual intervention', async ({ page }) => {
    logger.info('Test Case: QE-10393 TS-002 TC-001 - Auto-refresh functionality');
    
    // Step 1-3: Login and verify auto-refresh enabled
    await loginPage.login('user_realtime@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardLoad();
    
    const isAutoRefreshEnabled = await dashboardPage.verifyAutoRefreshEnabled();
    expect(isAutoRefreshEnabled).toBeTruthy();
    logger.info('Auto-refresh is enabled (300 seconds interval)');
    
    // Step 4: Record initial values
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    // Step 5: Simulate transaction
    await dashboardPage.simulateTransaction(200.00, 'Merchant XYZ');
    logger.info('Transaction of $200.00 simulated');
    
    // Step 6: Wait for auto-refresh (simulated)
    logger.info('Waiting for auto-refresh cycle...');
    await page.waitForTimeout(6000); // Simulating auto-refresh
    
    // Step 7-8: Verify automatic updates (no manual refresh)
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(updatedAvailableCredit).toBe(initialAvailableCredit - 200);
    expect(updatedOutstanding).toBe(initialOutstanding + 200);
    logger.info('Values updated automatically without manual refresh');
    
    // Step 9: Verify auto-updated timestamp
    const isTimestampRecent = await dashboardPage.verifyLastUpdatedWithinMinutes(5);
    expect(isTimestampRecent).toBeTruthy();
    logger.info('Last updated timestamp reflects automatic refresh');
  });

  test('QE-10393 TS-003 TC-001 - Verify error message and retry option during service outage', async ({ page }) => {
    logger.info('Test Case: QE-10393 TS-003 TC-001 - Service outage handling');
    
    // Step 1: Login
    await loginPage.login('user_realtime@example.com', 'SecurePass@123');
    
    // Step 2: Simulate backend service outage
    await page.route('**/api/dashboard/kpis', route => {
      route.abort('failed');
    });
    logger.info('Backend service outage simulated (503 error)');
    
    // Step 3: Navigate to dashboard
    await page.goto('/dashboard');
    
    // Step 4-5: Verify error message
    await dashboardPage.verifyServiceUnavailableMessage();
    logger.info('Service unavailable error message displayed');
    
    const isMessageUserFriendly = await dashboardPage.verifyErrorMessageIsUserFriendly();
    expect(isMessageUserFriendly).toBeTruthy();
    logger.info('Error message is user-friendly (no technical details)');
    
    // Step 6-7: Verify retry button and click it
    await dashboardPage.verifyRetryButtonVisible();
    await dashboardPage.clickRetryButton();
    logger.info('Retry button clicked');
    
    // Step 8: Verify error persists if service still down
    await dashboardPage.verifyServiceUnavailableMessage();
    logger.info('Error message reappears (service still unavailable)');
    
    // Step 9: Restore service and retry
    await page.unroute('**/api/dashboard/kpis');
    await dashboardPage.clickRetryButton();
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.verifyAllKPIsVisible();
    logger.info('Dashboard loaded successfully after service restoration');
  });
});
