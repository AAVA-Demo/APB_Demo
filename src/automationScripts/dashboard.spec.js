const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

/**
 * Test Suite: Dashboard KPI Display and Multi-Card Portfolio Overview
 * Test Cases: QE-7956 TS-001 TC-001, QE-7956 TS-002 TC-001, QE-7956 TS-003 TC-001,
 *             QE-7954 TS-001 TC-001, QE-7954 TS-002 TC-001, QE-7954 TS-003 TC-001
 */

test.describe('Dashboard KPI Display Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  /**
   * Test Case ID: QE-7956 TS-001 TC-001
   * Description: Verify that a user with multiple active credit cards can view aggregated KPIs
   *              (monthly spend, total credit limit, available credit, outstanding amounts) on the dashboard within 2 seconds
   */
  test('TC-001: Dashboard displays aggregated KPIs for multiple credit cards within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    // Step 1-2: Launch application and login
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 3: Verify user has multiple active credit cards
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Step 4-5: Measure dashboard load time and verify KPI cards are displayed
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    
    // Step 6: Verify Monthly Spend KPI displays correct aggregated amount
    const monthlySpendText = await dashboardPage.getKPIValue('monthlySpend');
    expect(monthlySpendText).toMatch(/\$1,500\.00/);
    
    // Step 7: Verify Total Credit Limit KPI displays correct aggregated limit
    const totalCreditLimitText = await dashboardPage.getKPIValue('totalCreditLimit');
    expect(totalCreditLimitText).toMatch(/\$23,000\.00/);
    
    // Step 8: Verify Available Credit KPI displays correct aggregated available credit
    const availableCreditText = await dashboardPage.getKPIValue('availableCredit');
    expect(availableCreditText).toMatch(/\$15,000\.00/);
    
    // Step 9: Verify Outstanding Amount KPI displays correct aggregated outstanding balance
    const outstandingAmountText = await dashboardPage.getKPIValue('outstandingAmount');
    expect(outstandingAmountText).toMatch(/\$8,000\.00/);
    
    // Step 10: Verify all KPI values are formatted with 2 decimal places
    expect(monthlySpendText).toMatch(/\$\d{1,3}(,\d{3})*\.\d{2}/);
    expect(totalCreditLimitText).toMatch(/\$\d{1,3}(,\d{3})*\.\d{2}/);
    expect(availableCreditText).toMatch(/\$\d{1,3}(,\d{3})*\.\d{2}/);
    expect(outstandingAmountText).toMatch(/\$\d{1,3}(,\d{3})*\.\d{2}/);
  });

  /**
   * Test Case ID: QE-7956 TS-002 TC-001
   * Description: Verify that a user with no credit card data in the system sees an appropriate message
   *              on the dashboard without null or undefined values in KPI fields
   */
  test('TC-002: Dashboard displays appropriate message for user with no credit cards', async ({ page }) => {
    // Step 1-2: Launch application and login with user having no credit cards
    await dashboardPage.navigate();
    await dashboardPage.login('nocards@example.com', 'Test@123');
    
    // Step 3-4: Verify user account has zero credit cards and observe dashboard KPI section
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const noDataMessage = await dashboardPage.getNoDataMessage();
    expect(noDataMessage).toContain('No credit card information available');
    expect(noDataMessage).toContain('Please add a credit card to view your financial overview');
    
    // Step 5: Verify KPI cards do NOT display null or undefined values
    const kpiCardsVisible = await dashboardPage.areKPICardsVisible();
    if (kpiCardsVisible) {
      const monthlySpendValue = await dashboardPage.getKPIValue('monthlySpend');
      const totalCreditLimitValue = await dashboardPage.getKPIValue('totalCreditLimit');
      const availableCreditValue = await dashboardPage.getKPIValue('availableCredit');
      const outstandingAmountValue = await dashboardPage.getKPIValue('outstandingAmount');
      
      expect(monthlySpendValue).not.toContain('null');
      expect(monthlySpendValue).not.toContain('undefined');
      expect(totalCreditLimitValue).not.toContain('null');
      expect(totalCreditLimitValue).not.toContain('undefined');
      expect(availableCreditValue).not.toContain('null');
      expect(availableCreditValue).not.toContain('undefined');
      expect(outstandingAmountValue).not.toContain('null');
      expect(outstandingAmountValue).not.toContain('undefined');
    }
    
    // Step 6: Verify dashboard does not display any error messages or broken UI elements
    const hasErrors = await dashboardPage.hasErrorMessages();
    expect(hasErrors).toBe(false);
    
    // Step 7: Verify user can navigate to other sections
    await expect(dashboardPage.transactionsNavLink).toBeVisible();
    await expect(dashboardPage.analyticsNavLink).toBeVisible();
  });

  /**
   * Test Case ID: QE-7956 TS-003 TC-001
   * Description: Verify that when the Credit Card Data Service is unavailable, the dashboard displays
   *              a user-friendly error message with a retry option without crashing
   */
  test('TC-003: Dashboard displays error message when service is unavailable with retry option', async ({ page, context }) => {
    // Step 1: Simulate unavailability of Credit Card Data Service (503 error)
    await context.route('**/api/cards**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
    
    // Step 2-3: Launch application and login
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    // Step 4: Observe dashboard behavior when attempting to load KPI data
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load dashboard data');
    expect(errorMessage).toContain('service is temporarily unavailable');
    expect(errorMessage).toContain('Please try again later');
    
    // Step 5: Verify Retry button is displayed
    await expect(dashboardPage.retryButton).toBeVisible();
    const retryButtonText = await dashboardPage.retryButton.textContent();
    expect(retryButtonText).toContain('Retry');
    
    // Step 6: Verify application does not crash or freeze
    await expect(dashboardPage.transactionsNavLink).toBeEnabled();
    await expect(dashboardPage.analyticsNavLink).toBeEnabled();
    
    // Step 7-8: Click Retry button and verify error persists if service still unavailable
    await dashboardPage.clickRetryButton();
    await page.waitForTimeout(1000);
    const errorMessageAfterRetry = await dashboardPage.getErrorMessage();
    expect(errorMessageAfterRetry).toContain('Unable to load dashboard data');
    
    // Step 9: Restore service and verify dashboard loads successfully
    await context.unroute('**/api/cards**');
    await dashboardPage.clickRetryButton();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible({ timeout: 5000 });
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
  });

  /**
   * Test Case ID: QE-7954 TS-001 TC-001
   * Description: Verify that a user with 5 active credit cards can view aggregated total credit limit
   *              and available credit with accurate real-time values on the dashboard
   */
  test('TC-004: Dashboard displays aggregated credit data for 5 active credit cards', async ({ page }) => {
    // Step 1-2: Launch application and login with user having 5 credit cards
    await dashboardPage.navigate();
    await dashboardPage.login('fivecards@example.com', 'Test@123');
    
    // Step 3: Verify user has exactly 5 active credit cards
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(5);
    
    // Step 4: Observe dashboard KPI section
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    
    // Step 5: Verify Total Credit Limit KPI displays correct aggregated sum
    const totalCreditLimitText = await dashboardPage.getKPIValue('totalCreditLimit');
    expect(totalCreditLimitText).toMatch(/\$50,000\.00/);
    
    // Step 6: Verify Available Credit KPI displays correct aggregated sum
    const availableCreditText = await dashboardPage.getKPIValue('availableCredit');
    expect(availableCreditText).toMatch(/\$34,000\.00/);
    
    // Step 7: Verify values reflect real-time data
    const isRealTimeData = await dashboardPage.verifyRealTimeData();
    expect(isRealTimeData).toBe(true);
    
    // Step 8: Verify KPI values are formatted correctly
    expect(totalCreditLimitText).toMatch(/\$\d{1,3}(,\d{3})*\.\d{2}/);
    expect(availableCreditText).toMatch(/\$\d{1,3}(,\d{3})*\.\d{2}/);
  });

  /**
   * Test Case ID: QE-7954 TS-002 TC-001
   * Description: Verify that a user with one or more credit cards having negative available credit
   *              (over-limit scenario) sees the negative value correctly displayed in the aggregated total
   */
  test('TC-005: Dashboard correctly displays negative available credit in over-limit scenario', async ({ page }) => {
    // Step 1-2: Launch application and login with user having over-limit card
    await dashboardPage.navigate();
    await dashboardPage.login('overlimit@example.com', 'Test@123');
    
    // Step 3: Verify user has credit cards including one with negative available credit
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const cardSummaries = await dashboardPage.getCardSummaries();
    const hasNegativeCredit = cardSummaries.some(card => card.availableCredit < 0);
    expect(hasNegativeCredit).toBe(true);
    
    // Step 4-5: Observe dashboard KPI section and verify Total Credit Limit
    const totalCreditLimitText = await dashboardPage.getKPIValue('totalCreditLimit');
    expect(totalCreditLimitText).toMatch(/\$23,000\.00/);
    
    // Step 6: Verify Available Credit KPI correctly includes negative available credit
    const availableCreditText = await dashboardPage.getKPIValue('availableCredit');
    expect(availableCreditText).toMatch(/\$7,500\.00/);
    
    // Step 7: Verify negative available credit value is displayed correctly without calculation errors
    const calculationCorrect = await dashboardPage.verifyAvailableCreditCalculation(3000, -500, 5000, 7500);
    expect(calculationCorrect).toBe(true);
    
    // Step 8: Verify individual card with negative available credit displays with visual indicator
    const negativeCard = await dashboardPage.getCardWithNegativeCredit();
    expect(negativeCard.availableCredit).toMatch(/-\$500\.00/);
    const hasWarningIndicator = await dashboardPage.hasWarningIndicator(negativeCard.cardId);
    expect(hasWarningIndicator).toBe(true);
  });

  /**
   * Test Case ID: QE-7954 TS-003 TC-001
   * Description: Verify that adding a new credit card and refreshing the dashboard immediately includes
   *              the new card's credit limit and available credit in the aggregated totals
   */
  test('TC-006: Dashboard immediately updates aggregated totals after adding new credit card', async ({ page }) => {
    // Step 1-2: Launch application, login, and note current KPI values
    await dashboardPage.navigate();
    await dashboardPage.login('testuser@example.com', 'Test@123');
    
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const initialTotalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    const initialAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    
    expect(initialTotalCreditLimit).toMatch(/\$23,000\.00/);
    expect(initialAvailableCredit).toMatch(/\$15,000\.00/);
    
    // Step 3-4: Navigate to Add Credit Card section and add new card
    await dashboardPage.navigateToSettings();
    await dashboardPage.addNewCreditCard('Discover *7890', 7000, 7000);
    
    // Step 5: Navigate back to dashboard
    await dashboardPage.navigateToDashboard();
    await page.reload();
    
    // Step 6: Verify Total Credit Limit KPI immediately includes new card's limit
    const updatedTotalCreditLimit = await dashboardPage.getKPIValue('totalCreditLimit');
    expect(updatedTotalCreditLimit).toMatch(/\$30,000\.00/);
    
    // Step 7: Verify Available Credit KPI immediately includes new card's available credit
    const updatedAvailableCredit = await dashboardPage.getKPIValue('availableCredit');
    expect(updatedAvailableCredit).toMatch(/\$22,000\.00/);
    
    // Step 8: Verify new card appears in card summary section
    const newCard = await dashboardPage.getCardByNumber('*7890');
    expect(newCard.cardName).toContain('Discover');
    expect(newCard.creditLimit).toMatch(/\$7,000\.00/);
    expect(newCard.availableCredit).toMatch(/\$7,000\.00/);
    
    // Step 9: Verify update occurs without requiring logout or cache clear
    const sessionActive = await dashboardPage.isSessionActive();
    expect(sessionActive).toBe(true);
  });
});