const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { Logger } = require('../utils/logger');

test.describe('Credit Card Dashboard - KPI Display and Real-Time Tracking', () => {
  let dashboardPage;
  let logger;

  test.beforeEach(async ({ page }) => {
    logger = new Logger('DashboardSpec');
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to dashboard');
    await dashboardPage.navigate();
  });

  test('QE-10027 TS-001 TC-001 - Verify consolidated dashboard displays KPI cards within 2 seconds for user with active credit cards', async ({ page }) => {
    logger.info('Test Case: QE-10027 TS-001 TC-001 - KPI cards display validation');
    
    // Step 1-3: Login is handled in beforeEach via navigate()
    logger.info('Step 1-3: User authentication completed');
    
    // Step 4: Verify dashboard loads within 2 seconds
    logger.info('Step 4: Verifying dashboard load time');
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms`);
    
    // Step 5: Verify KPI cards are displayed
    logger.info('Step 5: Verifying KPI cards display');
    await expect(dashboardPage.monthlySpendCard).toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).toBeVisible();
    await expect(dashboardPage.availableCreditCard).toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const availableCredit = await dashboardPage.getAvailableCredit();
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    
    logger.info(`KPI Values - Monthly Spend: ${monthlySpend}, Total Credit Limit: ${totalCreditLimit}, Available Credit: ${availableCredit}, Outstanding: ${outstandingAmount}`);
    
    expect(monthlySpend).toBeTruthy();
    expect(totalCreditLimit).toBeTruthy();
    expect(availableCredit).toBeTruthy();
    expect(outstandingAmount).toBeTruthy();
    
    logger.info('Test completed successfully');
  });

  test('QE-10027 TS-002 TC-001 - Verify dashboard displays appropriate message when user has no active credit cards', async ({ page }) => {
    logger.info('Test Case: QE-10027 TS-002 TC-001 - No active cards message validation');
    
    // Step 1-3: Login with user having no active cards
    logger.info('Step 1-3: Logging in with user having no active cards');
    await dashboardPage.loginWithCredentials('newuser@example.com', 'SecurePass123');
    
    // Step 4: Verify appropriate message is displayed
    logger.info('Step 4: Verifying no active cards message');
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.noCardsMessage.textContent();
    expect(messageText).toContain('No active credit cards found');
    logger.info(`Message displayed: ${messageText}`);
    
    // Step 5: Verify KPI cards are not displayed
    logger.info('Step 5: Verifying KPI cards are not displayed');
    await expect(dashboardPage.monthlySpendCard).not.toBeVisible();
    await expect(dashboardPage.totalCreditLimitCard).not.toBeVisible();
    await expect(dashboardPage.availableCreditCard).not.toBeVisible();
    await expect(dashboardPage.outstandingAmountCard).not.toBeVisible();
    
    logger.info('Test completed successfully');
  });

  test('QE-10027 TS-003 TC-001 - Verify dashboard displays error message when backend service is unavailable without crashing', async ({ page }) => {
    logger.info('Test Case: QE-10027 TS-003 TC-001 - Backend service unavailability handling');
    
    // Step 2: Simulate backend service unavailability
    logger.info('Step 2: Simulating backend service unavailability');
    await page.route('**/api/**', route => route.abort());
    
    // Step 3-4: Login and navigate
    logger.info('Step 3-4: Attempting login with backend unavailable');
    await dashboardPage.loginWithCredentials('testuser@example.com', 'SecurePass123');
    
    // Step 5: Verify error message is displayed
    logger.info('Step 5: Verifying error message display');
    await expect(dashboardPage.errorMessage).toBeVisible();
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Unable to load dashboard data');
    logger.info(`Error message displayed: ${errorText}`);
    
    // Step 6: Verify application does not crash
    logger.info('Step 6: Verifying application stability');
    await expect(dashboardPage.navigationMenu).toBeVisible();
    const isNavigationAccessible = await dashboardPage.isNavigationAccessible();
    expect(isNavigationAccessible).toBeTruthy();
    
    logger.info('Test completed successfully - Application remained stable');
  });

  test('QE-10031 TS-001 TC-001 - Verify real-time credit update after purchase transaction', async ({ page }) => {
    logger.info('Test Case: QE-10031 TS-001 TC-001 - Real-time credit update validation');
    
    // Step 1: Login completed in beforeEach
    logger.info('Step 1: User authentication completed');
    
    // Step 2: Note current available credit
    logger.info('Step 2: Capturing initial available credit');
    const initialCredit = await dashboardPage.getAvailableCredit();
    logger.info(`Initial Available Credit: ${initialCredit}`);
    expect(initialCredit).toBeTruthy();
    
    // Step 3: Simulate purchase transaction
    logger.info('Step 3: Simulating purchase transaction of $500');
    await dashboardPage.simulateTransaction(500, 'Amazon');
    
    // Step 4: Refresh dashboard
    logger.info('Step 4: Refreshing dashboard');
    const refreshStartTime = Date.now();
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    const refreshTime = Date.now() - refreshStartTime;
    expect(refreshTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard refreshed in ${refreshTime}ms`);
    
    // Step 5: Verify updated available credit
    logger.info('Step 5: Verifying updated available credit');
    const updatedCredit = await dashboardPage.getAvailableCredit();
    logger.info(`Updated Available Credit: ${updatedCredit}`);
    
    // Parse currency values and verify deduction
    const initialValue = parseFloat(initialCredit.replace(/[$,]/g, ''));
    const updatedValue = parseFloat(updatedCredit.replace(/[$,]/g, ''));
    const expectedValue = initialValue - 500;
    
    expect(Math.abs(updatedValue - expectedValue)).toBeLessThanOrEqual(1);
    logger.info(`Credit correctly updated: ${initialValue} - 500 = ${updatedValue}`);
    
    logger.info('Test completed successfully');
  });

  test('QE-10031 TS-002 TC-001 - Verify dashboard displays last known credit value when transaction service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-10031 TS-002 TC-001 - Service unavailability handling');
    
    // Step 1: Login completed in beforeEach
    logger.info('Step 1: User authentication completed');
    
    // Step 2: Note current available credit
    logger.info('Step 2: Capturing current available credit');
    const lastKnownCredit = await dashboardPage.getAvailableCredit();
    logger.info(`Last Known Available Credit: ${lastKnownCredit}`);
    
    // Step 3: Simulate transaction service unavailability
    logger.info('Step 3: Simulating transaction service unavailability');
    await page.route('**/api/transactions/**', route => route.abort());
    
    // Step 4: Refresh dashboard
    logger.info('Step 4: Refreshing dashboard');
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    
    // Step 5: Verify last known credit is displayed
    logger.info('Step 5: Verifying last known credit value is displayed');
    const displayedCredit = await dashboardPage.getAvailableCredit();
    expect(displayedCredit).toBe(lastKnownCredit);
    logger.info(`Credit value maintained: ${displayedCredit}`);
    
    // Step 6: Verify warning message
    logger.info('Step 6: Verifying warning message display');
    await expect(dashboardPage.serviceWarningMessage).toBeVisible();
    const warningText = await dashboardPage.serviceWarningMessage.textContent();
    expect(warningText).toContain('Credit data may not be current');
    logger.info(`Warning message displayed: ${warningText}`);
    
    logger.info('Test completed successfully');
  });

  test('QE-10031 TS-003 TC-001 - Verify dashboard displays negative available credit and over-limit warning after exceeding credit limit', async ({ page }) => {
    logger.info('Test Case: QE-10031 TS-003 TC-001 - Over-limit scenario validation');
    
    // Step 1: Login completed in beforeEach
    logger.info('Step 1: User authentication completed');
    
    // Step 2: Note current available credit and credit limit
    logger.info('Step 2: Capturing current credit values');
    const availableCredit = await dashboardPage.getAvailableCredit();
    const creditLimit = await dashboardPage.getTotalCreditLimit();
    logger.info(`Available Credit: ${availableCredit}, Credit Limit: ${creditLimit}`);
    
    // Step 3: Simulate over-limit transaction
    logger.info('Step 3: Simulating over-limit transaction of $1,000');
    await dashboardPage.simulateTransaction(1000, 'Best Buy');
    
    // Step 4: Refresh dashboard
    logger.info('Step 4: Refreshing dashboard');
    const refreshStartTime = Date.now();
    await page.reload();
    await dashboardPage.waitForDashboardLoad();
    const refreshTime = Date.now() - refreshStartTime;
    expect(refreshTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard refreshed in ${refreshTime}ms`);
    
    // Step 5: Verify negative available credit
    logger.info('Step 5: Verifying negative available credit display');
    const updatedCredit = await dashboardPage.getAvailableCredit();
    logger.info(`Updated Available Credit: ${updatedCredit}`);
    expect(updatedCredit).toContain('-');
    
    // Step 6: Verify over-limit warning
    logger.info('Step 6: Verifying over-limit warning indicator');
    await expect(dashboardPage.overLimitWarning).toBeVisible();
    const warningText = await dashboardPage.overLimitWarning.textContent();
    expect(warningText).toContain('exceeded your credit limit');
    logger.info(`Over-limit warning displayed: ${warningText}`);
    
    logger.info('Test completed successfully');
  });
});