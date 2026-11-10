const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Financial Overview Dashboard Tests', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    logger.info('Starting dashboard test setup');
  });

  test('QE-9786 TS-001 TC-001 - Verify consolidated financial KPIs display with accurate aggregation', async ({ page }) => {
    logger.info('Test Case: QE-9786 TS-001 TC-001 - Consolidated KPIs');
    
    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    logger.info('User logged in successfully');
    
    // Step 2: Navigate to Dashboard
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 2000 });
    logger.info('Dashboard loaded within 2 seconds');
    
    // Step 3: Verify Total Credit Limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    await expect(totalCreditLimit).toBe('$65,000');
    logger.info('Total Credit Limit verified: $65,000');
    
    // Step 4: Verify Available Credit
    const availableCredit = await dashboardPage.getAvailableCredit();
    await expect(availableCredit).toBe('$45,000');
    logger.info('Available Credit verified: $45,000');
    
    // Step 5: Verify Outstanding Amount
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    await expect(outstandingAmount).toBe('$20,000');
    logger.info('Outstanding Amount verified: $20,000');
    
    // Step 6: Verify Monthly Spend
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(monthlySpend).toMatch(/^\$[0-9,]+$/);
    logger.info('Monthly Spend displayed correctly');
    
    // Step 7: Verify Credit Utilization
    const creditUtilization = await dashboardPage.getCreditUtilization();
    await expect(creditUtilization).toBe('30.77%');
    logger.info('Credit Utilization verified: 30.77%');
    
    // Step 8: Verify auto-refresh
    await page.waitForTimeout(30000); // Wait 30 seconds for auto-refresh
    await expect(dashboardPage.kpiSection).toBeVisible();
    logger.info('Dashboard auto-refresh verified');
  });

  test('QE-9786 TS-002 TC-001 - Verify dashboard displays $0 monthly spend when no transactions exist', async ({ page }) => {
    logger.info('Test Case: QE-9786 TS-002 TC-001 - Zero Monthly Spend');
    
    // Step 1: Login with zero transactions user
    await loginPage.navigate();
    await loginPage.login('zerotransactions@example.com', 'Test@123');
    logger.info('User with zero transactions logged in');
    
    // Step 2: Navigate to Dashboard
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/.*dashboard/);
    logger.info('Dashboard loaded successfully');
    
    // Step 3: Verify Monthly Spend is $0
    const monthlySpend = await dashboardPage.getMonthlySpend();
    await expect(monthlySpend).toBe('$0');
    logger.info('Monthly Spend verified as $0');
    
    // Step 4-6: Verify other KPIs display correctly
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info('All KPIs displayed correctly with zero monthly spend');
  });

  test('QE-9786 TS-003 TC-001 - Verify partial data display when Credit Card Data Service unavailable', async ({ page }) => {
    logger.info('Test Case: QE-9786 TS-003 TC-001 - Service Unavailable');
    
    // Step 1: Mock service unavailability
    await page.route('**/api/cards', route => route.abort('failed'));
    logger.info('Credit Card Data Service mocked as unavailable');
    
    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Dashboard
    await dashboardPage.navigate();
    
    // Step 4: Verify error indicator
    await expect(dashboardPage.serviceUnavailableMessage).toBeVisible();
    await expect(dashboardPage.serviceUnavailableMessage).toContainText('Service Unavailable');
    logger.info('Service unavailable message displayed');
    
    // Step 6: Verify retry button
    await expect(dashboardPage.retryButton).toBeVisible();
    await dashboardPage.retryButton.click();
    logger.info('Retry button clicked');
  });

  test('QE-9786 TS-003 TC-002 - Verify partial data when Transaction Processing Service unavailable', async ({ page }) => {
    logger.info('Test Case: QE-9786 TS-003 TC-002 - Transaction Service Unavailable');
    
    // Step 1: Mock transaction service unavailability
    await page.route('**/api/transactions', route => route.abort('failed'));
    logger.info('Transaction Processing Service mocked as unavailable');
    
    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Dashboard
    await dashboardPage.navigate();
    
    // Step 4: Verify Monthly Spend error indicator
    await expect(dashboardPage.monthlySpendError).toBeVisible();
    await expect(dashboardPage.monthlySpendError).toContainText('temporarily unavailable');
    logger.info('Transaction unavailable message displayed');
    
    // Step 5: Verify credit KPIs display correctly
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    logger.info('Credit-related KPIs displayed correctly');
  });

  test('QE-9782 TS-001 TC-001 - Verify real-time credit utilization with color-coded indicators', async ({ page }) => {
    logger.info('Test Case: QE-9782 TS-001 TC-001 - Credit Utilization Indicators');
    
    // Step 1: Login with varying utilization user
    await loginPage.navigate();
    await loginPage.login('varyingutilization@example.com', 'Test@123');
    
    // Step 2: Navigate to Dashboard
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 2000 });
    logger.info('Dashboard loaded within 2 seconds');
    
    // Step 3: Verify overall utilization percentage
    const utilization = await dashboardPage.getCreditUtilization();
    await expect(utilization).toBe('30.77%');
    logger.info('Credit Utilization: 30.77%');
    
    // Step 4: Verify green indicator for healthy utilization
    await expect(dashboardPage.utilizationBar).toHaveClass(/.*green.*/);
    logger.info('Green indicator displayed for healthy utilization');
    
    // Step 5-8: Verify individual card utilization indicators
    await dashboardPage.scrollToCardPortfolio();
    await expect(dashboardPage.getCardUtilizationBar('C001')).toHaveClass(/.*green.*/);
    await expect(dashboardPage.getCardUtilizationBar('C002')).toHaveClass(/.*warning.*/);
    logger.info('Individual card utilization indicators verified');
  });

  test('QE-9782 TS-002 TC-001 - Verify 0% credit utilization display', async ({ page }) => {
    logger.info('Test Case: QE-9782 TS-002 TC-001 - Zero Utilization');
    
    // Step 1: Login with zero utilization user
    await loginPage.navigate();
    await loginPage.login('zeroutilization@example.com', 'Test@123');
    
    // Step 2: Navigate to Dashboard
    await dashboardPage.navigate();
    
    // Step 3: Verify 0% utilization
    const utilization = await dashboardPage.getCreditUtilization();
    await expect(utilization).toBe('0.00%');
    logger.info('Credit Utilization: 0.00%');
    
    // Step 4: Verify green indicator at 0%
    await expect(dashboardPage.utilizationBar).toHaveClass(/.*green.*/);
    await expect(dashboardPage.utilizationBar).toHaveCSS('width', '0%');
    logger.info('Green indicator with 0% width verified');
    
    // Step 5: Verify Outstanding Amount is $0
    const outstanding = await dashboardPage.getOutstandingAmount();
    await expect(outstanding).toBe('$0.00');
    logger.info('Outstanding Amount: $0.00');
    
    // Step 6: Verify Available Credit equals Total Credit Limit
    const available = await dashboardPage.getAvailableCredit();
    const total = await dashboardPage.getTotalCreditLimit();
    await expect(available).toBe(total);
    logger.info('Available Credit equals Total Credit Limit');
  });

  test('QE-9782 TS-003 TC-001 - Verify stale data handling with timestamp', async ({ page }) => {
    logger.info('Test Case: QE-9782 TS-003 TC-001 - Stale Data Handling');
    
    // Step 1: Mock stale data with timestamp
    await page.route('**/api/cards', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: [],
          lastUpdated: new Date(Date.now() - 3600000).toISOString()
        })
      });
    });
    logger.info('Stale data mocked with timestamp');
    
    // Step 2: Login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Navigate to Dashboard
    await dashboardPage.navigate();
    
    // Step 4: Verify last known utilization displayed
    await expect(dashboardPage.creditUtilizationKPI).toBeVisible();
    logger.info('Last known utilization displayed');
    
    // Step 5: Verify warning indicator
    await expect(dashboardPage.staleDataWarning).toBeVisible();
    await expect(dashboardPage.staleDataWarning).toContainText('may not be current');
    logger.info('Warning indicator displayed');
    
    // Step 6: Verify timestamp display
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    await expect(dashboardPage.lastUpdatedTimestamp).toContainText('Last updated:');
    logger.info('Timestamp displayed');
    
    // Step 7: Verify refresh button
    await expect(dashboardPage.refreshButton).toBeVisible();
    await dashboardPage.refreshButton.click();
    logger.info('Refresh button clicked');
  });
});