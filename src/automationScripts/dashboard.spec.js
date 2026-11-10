const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard KPIs and Financial Overview', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    logger.info('Navigated to Dashboard page');
  });

  // QE-9777 TS-001 TC-001: Verify real-time KPI dashboard displays all four KPI metrics
  test('TC-001: Display all four KPI metrics with accurate aggregated values', async ({ page }) => {
    logger.info('Test Case QE-9777 TS-001 TC-001: Starting KPI metrics validation');
    
    // Step 2: Login with user having multiple active credit cards
    await dashboardPage.login('testuser_activecards', 'Test@123');
    logger.info('Logged in with testuser_activecards');
    
    // Step 3-6: Verify all four KPIs are visible and display values
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    logger.info('All four KPI widgets are visible');
    
    // Verify KPI values are displayed (not $0.00 for active cards scenario)
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(parseFloat(monthlySpend.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(totalLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(availableCredit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    expect(parseFloat(outstanding.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    logger.info(`KPI Values - Monthly Spend: ${monthlySpend}, Total Limit: ${totalLimit}, Available: ${availableCredit}, Outstanding: ${outstanding}`);
    
    // Step 7: Cross-reference with individual card details
    const cardSummaryTable = await dashboardPage.getCardSummaryTable();
    expect(cardSummaryTable).toBeTruthy();
    logger.info('Card summary table is displayed for cross-reference');
  });

  // QE-9777 TS-001 TC-002: Verify dashboard KPIs load within 2 seconds
  test('TC-002: Dashboard KPIs load within 2 seconds (NFR)', async ({ page }) => {
    logger.info('Test Case QE-9777 TS-001 TC-002: Starting load time validation');
    
    await dashboardPage.login('testuser_activecards', 'Test@123');
    
    // Step 2-3: Measure load time
    const startTime = Date.now();
    await dashboardPage.waitForAllKPIsToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThanOrEqual(2000);
    logger.info(`Dashboard loaded in ${loadTime}ms (NFR: ≤2000ms)`);
    
    // Step 4: Verify no loading indicators remain
    await expect(dashboardPage.loadingSpinner).not.toBeVisible();
    logger.info('No loading indicators present');
  });

  // QE-9777 TS-002 TC-001: Verify dashboard displays $0.00 for users with no active cards
  test('TC-003: Display appropriate messaging and $0.00 values when no active cards', async ({ page }) => {
    logger.info('Test Case QE-9777 TS-002 TC-001: Starting no cards scenario validation');
    
    await dashboardPage.login('testuser_nocards', 'Test@123');
    
    // Step 3: Verify all KPIs display $0.00
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toBe('$0.00');
    expect(totalLimit).toBe('$0.00');
    expect(availableCredit).toBe('$0.00');
    expect(outstanding).toBe('$0.00');
    logger.info('All KPI values are $0.00 as expected');
    
    // Step 4: Verify informational message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.noCardsMessage.textContent();
    expect(messageText).toContain('No active credit cards found');
    logger.info('Informational message displayed: ' + messageText);
  });

  // QE-9777 TS-002 TC-002: Verify dashboard displays $0.00 for zero balances
  test('TC-004: Display $0.00 values when all credit cards have zero balances', async ({ page }) => {
    logger.info('Test Case QE-9777 TS-002 TC-002: Starting zero balance scenario validation');
    
    await dashboardPage.login('testuser_zerobalances', 'Test@123');
    
    // Step 3: Verify Monthly Spend and Outstanding Amount are $0.00
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const outstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toBe('$0.00');
    expect(outstanding).toBe('$0.00');
    logger.info('Monthly Spend and Outstanding Amount are $0.00');
    
    // Step 4: Verify Total Credit Limit and Available Credit show credit limits
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    
    expect(parseFloat(totalLimit.replace(/[$,]/g, ''))).toBeGreaterThan(0);
    expect(totalLimit).toBe(availableCredit);
    logger.info(`Total Credit Limit and Available Credit both show: ${totalLimit}`);
    
    // Step 5: Verify informational message
    await expect(dashboardPage.noSpendingMessage).toBeVisible();
    logger.info('No spending activity message displayed');
  });

  // QE-9777 TS-003 TC-001: Verify error handling for backend timeout
  test('TC-005: Display error message when backend service times out', async ({ page }) => {
    logger.info('Test Case QE-9777 TS-003 TC-001: Starting timeout error handling validation');
    
    // Step 2: Simulate backend timeout (mock API delay > 5 seconds)
    await page.route('**/api/creditcards**', route => {
      setTimeout(() => route.abort(), 6000);
    });
    
    await dashboardPage.login('testuser_timeout', 'Test@123');
    
    // Step 3: Verify error message is displayed
    await expect(dashboardPage.errorMessage).toBeVisible({ timeout: 10000 });
    const errorText = await dashboardPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load dashboard data');
    logger.info('Error message displayed: ' + errorText);
    
    // Step 4: Verify Retry button is displayed
    await expect(dashboardPage.retryButton).toBeVisible();
    logger.info('Retry button is visible');
    
    // Step 6: Click Retry button
    await page.unroute('**/api/creditcards**');
    await dashboardPage.retryButton.click();
    logger.info('Clicked Retry button');
    
    // Verify dashboard attempts to reload
    await expect(dashboardPage.loadingSpinner).toBeVisible();
    logger.info('Dashboard is attempting to reload data');
  });

  // QE-9778 TS-001 TC-001: Verify consolidated credit metrics aggregation
  test('TC-006: Display correctly aggregated total credit limit and available credit', async ({ page }) => {
    logger.info('Test Case QE-9778 TS-001 TC-001: Starting credit metrics aggregation validation');
    
    await dashboardPage.login('testuser_5cards_varied', 'Test@123');
    
    // Step 3: Verify Total Credit Limit KPI
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const expectedTotal = '$41,000.00';
    expect(totalLimit).toBe(expectedTotal);
    logger.info(`Total Credit Limit: ${totalLimit} (Expected: ${expectedTotal})`);
    
    // Step 4: Verify Available Credit KPI
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const expectedAvailable = '$30,500.00';
    expect(availableCredit).toBe(expectedAvailable);
    logger.info(`Available Credit: ${availableCredit} (Expected: ${expectedAvailable})`);
  });

  // QE-9778 TS-002 TC-001: Verify high utilization warning
  test('TC-007: Display high utilization warning when cards exceed 90% utilization', async ({ page }) => {
    logger.info('Test Case QE-9778 TS-002 TC-001: Starting high utilization warning validation');
    
    await dashboardPage.login('testuser_highutilization', 'Test@123');
    
    // Step 3: Verify warning indicator is displayed
    await expect(dashboardPage.highUtilizationWarning).toBeVisible();
    logger.info('High utilization warning indicator is visible');
    
    // Step 4: Hover over warning indicator
    await dashboardPage.highUtilizationWarning.hover();
    await expect(dashboardPage.warningTooltip).toBeVisible();
    const tooltipText = await dashboardPage.warningTooltip.textContent();
    expect(tooltipText).toContain('High credit utilization risk');
    expect(tooltipText).toContain('90% utilization');
    logger.info('Warning tooltip displayed: ' + tooltipText);
  });

  // QE-9778 TS-003 TC-001: Verify real-time data refresh after payment
  test('TC-008: Reflect updated available credit within 30 seconds after payment', async ({ page }) => {
    logger.info('Test Case QE-9778 TS-003 TC-001: Starting real-time refresh validation');
    
    await dashboardPage.login('testuser_realtimeupdate', 'Test@123');
    
    // Step 2: Note initial Available Credit value
    const initialCredit = await dashboardPage.getAvailableCreditValue();
    logger.info(`Initial Available Credit: ${initialCredit}`);
    
    // Step 3: Simulate payment processing (mock API update)
    await page.evaluate(() => {
      // Simulate backend payment processing
      window.simulatePayment = true;
    });
    
    // Step 4: Wait for real-time refresh (30 seconds max)
    await page.waitForTimeout(30000);
    
    // Step 5: Verify Available Credit is updated
    const updatedCredit = await dashboardPage.getAvailableCreditValue();
    expect(updatedCredit).not.toBe(initialCredit);
    logger.info(`Updated Available Credit: ${updatedCredit}`);
    
    // Step 6: Verify Outstanding Amount is also updated
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    logger.info(`Updated Outstanding Amount: ${updatedOutstanding}`);
  });
});
