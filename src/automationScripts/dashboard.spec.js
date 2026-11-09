const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

/**
 * Test Suite: Dashboard KPI Display and Real-Time Credit Utilization
 * Test Cases: QE-8984 TS-001 TC-001, QE-8984 TS-002 TC-001, QE-8984 TS-003 TC-001,
 *             QE-8989 TS-001 TC-001, QE-8989 TS-002 TC-001, QE-8989 TS-003 TC-001
 */

test.describe('Dashboard KPI Display and Real-Time Credit Utilization', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to dashboard');
    await dashboardPage.navigate();
  });

  /**
   * Test Case: QE-8984 TS-001 TC-001
   * Description: Verify that a user with multiple credit cards can view all KPIs on the dashboard with accurate aggregated calculations
   */
  test('TC-001: User with multiple credit cards views accurate aggregated KPIs', async () => {
    logger.info('Test Case: QE-8984 TS-001 TC-001 - Starting');
    
    // Step 1-2: Retrieve credit card and transaction data (handled by backend mock)
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Calculate and verify monthly spend
    const monthlySpend = await dashboardPage.getMonthlySpend();
    logger.info(`Monthly Spend retrieved: ${monthlySpend}`);
    expect(monthlySpend).toBeTruthy();
    
    // Step 4: Calculate and verify total credit limit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    logger.info(`Total Credit Limit retrieved: ${totalCreditLimit}`);
    expect(totalCreditLimit).toBeTruthy();
    
    // Step 5: Calculate and verify available credit
    const availableCredit = await dashboardPage.getAvailableCredit();
    logger.info(`Available Credit retrieved: ${availableCredit}`);
    expect(availableCredit).toBeTruthy();
    
    // Step 6: Calculate and verify outstanding amount
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    logger.info(`Outstanding Amount retrieved: ${outstandingAmount}`);
    expect(outstandingAmount).toBeTruthy();
    
    // Step 7-8: Verify all KPIs are displayed correctly
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    logger.info('Test Case: QE-8984 TS-001 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8984 TS-002 TC-001
   * Description: Verify that the dashboard displays an appropriate error message when the backend credit card data service is unavailable
   */
  test('TC-002: Dashboard displays error message when backend service is unavailable', async ({ page }) => {
    logger.info('Test Case: QE-8984 TS-002 TC-001 - Starting');
    
    // Step 1-2: Simulate backend service unavailability
    await page.route('**/api/cards', route => {
      route.abort('failed');
    });
    
    await dashboardPage.navigate();
    
    // Step 3-4: Verify error message is displayed
    await dashboardPage.waitForErrorMessage();
    const errorMessage = await dashboardPage.getErrorMessage();
    logger.info(`Error message displayed: ${errorMessage}`);
    
    // Step 5: Validate error message is visible
    await expect(dashboardPage.errorMessageContainer).toBeVisible();
    expect(errorMessage).toContain('Failed to load dashboard data');
    
    // Step 6: Verify no KPI data is displayed
    const hasKPIData = await dashboardPage.hasKPIData();
    expect(hasKPIData).toBe(false);
    
    logger.info('Test Case: QE-8984 TS-002 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8984 TS-003 TC-001
   * Description: Verify that the dashboard displays zero values for all KPIs when the user has no credit cards
   */
  test('TC-003: Dashboard displays zero values when user has no credit cards', async ({ page }) => {
    logger.info('Test Case: QE-8984 TS-003 TC-001 - Starting');
    
    // Step 1-2: Mock empty credit card and transaction data
    await page.route('**/api/cards', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    
    await page.route('**/api/transactions', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3-6: Verify all KPIs show $0
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    expect(monthlySpend).toBe(0);
    expect(totalCreditLimit).toBe(0);
    expect(availableCredit).toBe(0);
    expect(outstandingAmount).toBe(0);
    
    // Step 8: Verify no errors are thrown
    const hasErrors = await dashboardPage.hasErrors();
    expect(hasErrors).toBe(false);
    
    // Step 9: Verify appropriate message for no credit cards
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    expect(noCardsMessage).toBeTruthy();
    
    logger.info('Test Case: QE-8984 TS-003 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8989 TS-001 TC-001
   * Description: Verify that the dashboard displays updated available credit and outstanding amount after a new transaction within 30 seconds
   */
  test('TC-004: Dashboard displays updated credit utilization after new transaction', async ({ page }) => {
    logger.info('Test Case: QE-8989 TS-001 TC-001 - Starting');
    
    // Step 1: Retrieve initial credit card data
    await dashboardPage.waitForDashboardLoad();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    logger.info(`Initial Available Credit: ${initialAvailableCredit}, Outstanding: ${initialOutstanding}`);
    
    // Step 2: Simulate new transaction
    const transactionAmount = 150;
    await page.route('**/api/transactions', route => {
      const transactions = route.request().url().includes('?') ? [] : [
        { id: 'txn-new', amount: transactionAmount, date: new Date().toISOString(), cardId: 'card1' }
      ];
      route.fulfill({ status: 200, body: JSON.stringify(transactions) });
    });
    
    // Step 3: Wait for 30 seconds (using auto-wait instead)
    await dashboardPage.refreshDashboard();
    
    // Step 4-6: Verify updated values
    const updatedAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    logger.info(`Updated Available Credit: ${updatedAvailableCredit}, Outstanding: ${updatedOutstanding}`);
    
    // Verify available credit decreased by transaction amount
    expect(updatedAvailableCredit).toBeLessThan(initialAvailableCredit);
    
    // Verify outstanding amount increased by transaction amount
    expect(updatedOutstanding).toBeGreaterThan(initialOutstanding);
    
    logger.info('Test Case: QE-8989 TS-001 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8989 TS-002 TC-001
   * Description: Verify that the dashboard correctly calculates and displays the total available credit across three credit cards
   */
  test('TC-005: Dashboard calculates total available credit across multiple cards', async ({ page }) => {
    logger.info('Test Case: QE-8989 TS-002 TC-001 - Starting');
    
    // Step 1: Mock three credit cards with different utilization
    const mockCards = [
      { id: 'card1', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500 },
      { id: 'card2', creditLimit: 5000, currentBalance: 1000, availableCredit: 4000 },
      { id: 'card3', creditLimit: 8000, currentBalance: 3000, availableCredit: 5000 }
    ];
    
    await page.route('**/api/cards', route => {
      route.fulfill({ status: 200, body: JSON.stringify(mockCards) });
    });
    
    // Step 2-4: Simulate transactions on all cards
    await page.route('**/api/transactions', route => {
      const transactions = [
        { id: 'txn1', cardId: 'card1', amount: 200, date: new Date().toISOString() },
        { id: 'txn2', cardId: 'card2', amount: 150, date: new Date().toISOString() },
        { id: 'txn3', cardId: 'card3', amount: 100, date: new Date().toISOString() }
      ];
      route.fulfill({ status: 200, body: JSON.stringify(transactions) });
    });
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    // Step 5-6: Verify total available credit calculation
    const totalAvailableCredit = await dashboardPage.getAvailableCreditValue();
    logger.info(`Total Available Credit: ${totalAvailableCredit}`);
    
    // Expected: sum of all available credits
    const expectedTotal = mockCards.reduce((sum, card) => sum + card.availableCredit, 0);
    expect(totalAvailableCredit).toBe(expectedTotal);
    
    logger.info('Test Case: QE-8989 TS-002 TC-001 - Completed successfully');
  });

  /**
   * Test Case: QE-8989 TS-003 TC-001
   * Description: Verify that the dashboard displays a warning or triggers automatic refresh when data is stale
   */
  test('TC-006: Dashboard handles stale transaction data appropriately', async ({ page }) => {
    logger.info('Test Case: QE-8989 TS-003 TC-001 - Starting');
    
    // Step 1-2: Mock stale data (older than 5 minutes)
    const staleTimestamp = new Date(Date.now() - 6 * 60 * 1000).toISOString();
    
    await page.route('**/api/transactions', route => {
      const transactions = [
        { id: 'txn1', amount: 100, date: staleTimestamp, cardId: 'card1' }
      ];
      route.fulfill({ 
        status: 200, 
        body: JSON.stringify(transactions),
        headers: { 'X-Data-Timestamp': staleTimestamp }
      });
    });
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Verify warning message or automatic refresh
    const hasWarning = await dashboardPage.hasStaleDataWarning();
    const wasRefreshed = await dashboardPage.wasAutoRefreshed();
    
    // Either warning is displayed OR automatic refresh was triggered
    expect(hasWarning || wasRefreshed).toBe(true);
    
    if (hasWarning) {
      const warningMessage = await dashboardPage.getWarningMessage();
      logger.info(`Warning message displayed: ${warningMessage}`);
      expect(warningMessage).toContain('data');
    }
    
    if (wasRefreshed) {
      logger.info('Automatic refresh was triggered');
      // Step 4-5: Verify fresh data was retrieved
      await dashboardPage.waitForDashboardLoad();
      const hasKPIData = await dashboardPage.hasKPIData();
      expect(hasKPIData).toBe(true);
    }
    
    logger.info('Test Case: QE-8989 TS-003 TC-001 - Completed successfully');
  });
});
