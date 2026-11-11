const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { logger } = require('../utils/logger');

test.describe('Dashboard - Monthly Spend and KPI Tests', () => {

  test('QE-10704 TS-001 TC-001 - Verify monthly spend display with real-time data refresh across all registered cards', async ({ page }) => {
    logger.info('Starting test: QE-10704 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Register 3 credit cards (simulated via API or test data setup)
    logger.info('Step 1: Registering 3 credit cards');
    // Assuming cards are pre-registered via test data setup
    
    // Step 2: Create transactions for current month
    logger.info('Step 2: Creating transactions for current month');
    // Transactions created via test data: Card1: $500, Card2: $750, Card3: $600
    
    // Step 3: Navigate to dashboard
    logger.info('Step 3: Navigating to dashboard');
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    // Step 4: Verify Monthly Spend KPI displays aggregated value
    logger.info('Step 4: Verifying Monthly Spend KPI');
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$1,850');
    
    // Step 5: Verify KPI is displayed prominently
    logger.info('Step 5: Verifying KPI prominence');
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    
    // Step 6: Wait 30 seconds and verify auto-refresh
    logger.info('Step 6: Verifying auto-refresh after 30 seconds');
    await page.waitForTimeout(30000);
    await dashboardPage.verifyDataRefresh();
    
    logger.info('Test QE-10704 TS-001 TC-001 completed successfully');
  });

  test('QE-10704 TS-002 TC-001 - Verify monthly spend displays $0.00 when no credit cards are registered', async ({ page }) => {
    logger.info('Starting test: QE-10704 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Ensure no cards registered (test user with zero cards)
    logger.info('Step 1: Using test user with no cards');
    // Test data: User ID test_user_003
    
    // Step 2: Navigate to dashboard
    logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    // Step 3: Verify Monthly Spend displays $0.00
    logger.info('Step 3: Verifying Monthly Spend is $0.00');
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$0.00');
    
    // Step 4: Verify no cards available message
    logger.info('Step 4: Verifying no cards message');
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    
    // Step 5: Verify no application errors
    logger.info('Step 5: Checking for console errors');
    const consoleErrors = await dashboardPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
    
    logger.info('Test QE-10704 TS-002 TC-001 completed successfully');
  });

  test('QE-10704 TS-003 TC-001 - Verify monthly spend KPI updates within 2 seconds after new transaction', async ({ page }) => {
    logger.info('Starting test: QE-10704 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Register 2 cards with existing transactions
    logger.info('Step 1: Cards registered with initial transactions');
    // Test data: Card1: $400, Card2: $600 (Total: $1000)
    
    // Step 2: Navigate to dashboard and note initial value
    logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    const initialSpend = await dashboardPage.getMonthlySpendValue();
    expect(initialSpend).toBe('$1,000');
    
    // Step 3: Create new transaction (simulated via API)
    logger.info('Step 3: Creating new transaction of $250');
    // Transaction created via API: Card1, $250
    
    // Step 4: Start performance timer and trigger refresh
    logger.info('Step 4: Triggering dashboard refresh');
    const startTime = Date.now();
    await dashboardPage.triggerRefresh();
    
    // Step 5: Measure load time
    logger.info('Step 5: Measuring KPI update time');
    await dashboardPage.waitForMonthlySpendUpdate('$1,250');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 6: Verify updated value
    logger.info('Step 6: Verifying updated Monthly Spend');
    const updatedSpend = await dashboardPage.getMonthlySpendValue();
    expect(updatedSpend).toBe('$1,250');
    
    // Step 7: Verify no full page reload
    logger.info('Step 7: Verifying no full page reload');
    const pageReloaded = await dashboardPage.checkPageReload();
    expect(pageReloaded).toBe(false);
    
    logger.info('Test QE-10704 TS-003 TC-001 completed successfully');
  });

  test('QE-10705 TS-001 TC-001 - Verify aggregated credit limit, outstanding amount, and available credit display', async ({ page }) => {
    logger.info('Starting test: QE-10705 TS-001 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Register 3 cards with different limits
    logger.info('Step 1: Cards registered with limits and outstanding amounts');
    // Test data: Card1: Limit $5000, Outstanding $1500; Card2: Limit $8000, Outstanding $3000; Card3: Limit $7000, Outstanding $2000
    
    // Step 2: Navigate to dashboard
    logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    // Step 3: Verify Total Credit Limit KPI
    logger.info('Step 3: Verifying Total Credit Limit');
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalLimit).toBe('$20,000');
    
    // Step 4: Verify Total Outstanding Amount KPI
    logger.info('Step 4: Verifying Total Outstanding Amount');
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    expect(outstanding).toBe('$6,500');
    
    // Step 5: Verify Available Credit KPI
    logger.info('Step 5: Verifying Available Credit');
    const available = await dashboardPage.getAvailableCreditValue();
    expect(available).toBe('$13,500');
    
    // Step 6: Verify currency formatting
    logger.info('Step 6: Verifying currency formatting');
    await dashboardPage.verifyCurrencyFormatting();
    
    logger.info('Test QE-10705 TS-001 TC-001 completed successfully');
  });

  test('QE-10705 TS-002 TC-001 - Verify low available credit warning when outstanding exceeds 80%', async ({ page }) => {
    logger.info('Starting test: QE-10705 TS-002 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Register 2 cards with high utilization
    logger.info('Step 1: Cards registered with >80% utilization');
    // Test data: Card1: Limit $5000, Outstanding $4200 (84%); Card2: Limit $10000, Outstanding $8500 (85%)
    
    // Step 2: Navigate to dashboard
    logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    // Step 3: Verify Available Credit value
    logger.info('Step 3: Verifying Available Credit');
    const available = await dashboardPage.getAvailableCreditValue();
    expect(available).toBe('$2,300');
    
    // Step 4: Verify visual warning indicator
    logger.info('Step 4: Verifying danger/warning indicator');
    await expect(dashboardPage.availableCreditWidget).toHaveClass(/danger|warning/);
    
    // Step 5: Verify utilization percentage
    logger.info('Step 5: Verifying utilization percentage');
    const utilization = await dashboardPage.getUtilizationPercentage();
    expect(utilization).toBe('84.67%');
    
    logger.info('Test QE-10705 TS-002 TC-001 completed successfully');
  });

  test('QE-10705 TS-003 TC-001 - Verify available credit updates after payment within 2-second load time', async ({ page }) => {
    logger.info('Starting test: QE-10705 TS-003 TC-001');
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Register 1 card with outstanding amount
    logger.info('Step 1: Card registered with outstanding amount');
    // Test data: Card1: Limit $10000, Outstanding $6000, Available $4000
    
    // Step 2: Navigate to dashboard and note initial value
    logger.info('Step 2: Navigating to dashboard');
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    const initialAvailable = await dashboardPage.getAvailableCreditValue();
    expect(initialAvailable).toBe('$4,000');
    
    // Step 3: Simulate payment of $2000
    logger.info('Step 3: Processing payment of $2000');
    // Payment processed via API
    
    // Step 4: Start performance timer and refresh
    logger.info('Step 4: Triggering dashboard refresh');
    const startTime = Date.now();
    await dashboardPage.triggerRefresh();
    
    // Step 5: Measure load time
    logger.info('Step 5: Measuring dashboard load time');
    await dashboardPage.waitForPageLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    // Step 6: Verify updated Available Credit
    logger.info('Step 6: Verifying updated Available Credit');
    const updatedAvailable = await dashboardPage.getAvailableCreditValue();
    expect(updatedAvailable).toBe('$6,000');
    
    // Step 7: Verify updated Outstanding Amount
    logger.info('Step 7: Verifying updated Outstanding Amount');
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    expect(updatedOutstanding).toBe('$4,000');
    
    logger.info('Test QE-10705 TS-003 TC-001 completed successfully');
  });

});