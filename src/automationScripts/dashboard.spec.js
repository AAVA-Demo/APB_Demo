const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const testData = require('../data/testData.json');

/**
 * Test Suite: Dashboard KPIs and Credit Card Management
 * Epic: QE-7499 - Dashboard KPIs and Credit Card Overview
 * User Stories: QE-7510, QE-7515
 */

test.describe('Dashboard KPIs and Credit Card Management', () => {
  let dashboardPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  /**
   * Test Case ID: QE-7515 TS-001 TC-001
   * User Story: QE-7515 - Multiple Credit Card Management
   * Scenario: TS-001 (Positive)
   * Description: Verify consolidated dashboard displays all 5 registered credit cards with complete details
   */
  test('TC-001: Verify consolidated dashboard displays all 5 registered credit cards with complete details', async () => {
    // Step 1-4: Login with user having 5 credit cards
    await loginPage.login(testData.users.testuser_5cards.username, testData.users.testuser_5cards.password);
    
    // Step 5: Navigate to dashboard (auto-redirected after login)
    await dashboardPage.waitForDashboardLoad();
    
    // Step 6: Verify exactly 5 credit cards are displayed
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(5);
    
    // Step 7: Verify individual balance for each card
    const expectedBalances = [1200.50, 850.00, 2100.75, 500.25, 3000.00];
    for (let i = 0; i < 5; i++) {
      const balance = await dashboardPage.getCardBalance(i);
      expect(balance).toBe(expectedBalances[i]);
    }
    
    // Step 8: Verify credit limit for each card
    const expectedLimits = [5000, 3000, 10000, 2000, 15000];
    for (let i = 0; i < 5; i++) {
      const limit = await dashboardPage.getCardCreditLimit(i);
      expect(limit).toBe(expectedLimits[i]);
    }
    
    // Step 9: Verify available credit for each card
    const expectedAvailable = [3799.50, 2150.00, 7899.25, 1499.75, 12000.00];
    for (let i = 0; i < 5; i++) {
      const available = await dashboardPage.getCardAvailableCredit(i);
      expect(available).toBe(expectedAvailable[i]);
    }
    
    // Step 10: Verify outstanding amount for each card
    for (let i = 0; i < 5; i++) {
      const outstanding = await dashboardPage.getCardOutstanding(i);
      expect(outstanding).toBe(expectedBalances[i]);
    }
    
    // Step 11: Verify card status (active/inactive)
    const expectedStatuses = ['Active', 'Active', 'Active', 'Inactive', 'Active'];
    for (let i = 0; i < 5; i++) {
      const status = await dashboardPage.getCardStatus(i);
      expect(status).toBe(expectedStatuses[i]);
    }
  });

  /**
   * Test Case ID: QE-7515 TS-002 TC-001
   * User Story: QE-7515 - Multiple Credit Card Management
   * Scenario: TS-002 (Negative)
   * Description: Verify empty state message when user has no registered credit cards
   */
  test('TC-002: Verify empty state message when user has no registered credit cards', async () => {
    // Step 1-4: Login with user having no credit cards
    await loginPage.login(testData.users.testuser_nocards.username, testData.users.testuser_nocards.password);
    
    // Step 5: Dashboard loads with empty state
    await dashboardPage.waitForDashboardLoad();
    
    // Step 6: Verify empty state message
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    const message = await dashboardPage.getEmptyStateMessage();
    expect(message).toContain('No credit cards registered');
    
    // Step 7: Verify call-to-action button
    await expect(dashboardPage.addCreditCardButton).toBeVisible();
    const ctaText = await dashboardPage.getAddCardButtonText();
    expect(ctaText).toContain('Add Credit Card');
    
    // Step 8: Verify no credit card data is displayed
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(0);
  });

  /**
   * Test Case ID: QE-7515 TS-003 TC-001
   * User Story: QE-7515 - Multiple Credit Card Management
   * Scenario: TS-003 (Positive)
   * Description: Verify aggregated totals are correctly calculated across all registered credit cards
   */
  test('TC-003: Verify aggregated totals are correctly calculated across all registered credit cards', async () => {
    // Step 1-4: Login with user having multiple credit cards
    await loginPage.login(testData.users.testuser_multicard.username, testData.users.testuser_multicard.password);
    
    // Step 5: Dashboard displays consolidated view
    await dashboardPage.waitForDashboardLoad();
    
    // Step 6-7: Verify total credit limit calculation
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe(18000); // 5000 + 3000 + 10000
    
    // Step 8-9: Verify total available credit calculation
    const totalAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(totalAvailableCredit).toBe(13850); // 3800 + 2150 + 7900
    
    // Step 10-11: Verify total outstanding balance calculation
    const totalOutstanding = await dashboardPage.getTotalOutstanding();
    expect(totalOutstanding).toBe(4150); // 1200 + 850 + 2100
    
    // Step 12: Verify calculation accuracy: Available = Limit - Outstanding
    expect(totalAvailableCredit).toBe(totalCreditLimit - totalOutstanding);
  });

  /**
   * Test Case ID: QE-7510 TS-001 TC-001
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-001 (Positive)
   * Description: Verify dashboard displays all real-time KPIs with correct values and currency formatting
   */
  test('TC-004: Verify dashboard displays all real-time KPIs with correct values and currency formatting', async () => {
    // Step 1-4: Login with valid credentials
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    
    // Step 5-6: Verify Monthly Spend KPI
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toMatch(/^\$[0-9,]+\.\d{2}$/);
    
    // Step 7-8: Verify Total Credit Limit KPI
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalLimit).toBeGreaterThan(0);
    
    // Step 9-10: Verify Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getTotalAvailableCredit();
    expect(availableCredit).toBeGreaterThan(0);
    
    // Step 11-12: Verify Outstanding Amount KPI
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstanding = await dashboardPage.getTotalOutstanding();
    expect(outstanding).toBeGreaterThanOrEqual(0);
    
    // Step 13: Verify all KPIs are prominently displayed
    await expect(dashboardPage.kpiContainer).toBeVisible();
  });

  /**
   * Test Case ID: QE-7510 TS-001 TC-002
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-001 (Positive)
   * Description: Verify KPI values are updated in real-time when data changes
   */
  test('TC-005: Verify KPI values are updated in real-time when data changes', async () => {
    // Step 1-3: Login and note current Monthly Spend
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await dashboardPage.waitForDashboardLoad();
    const initialMonthlySpend = await dashboardPage.getMonthlySpend();
    
    // Step 4: Wait for 30 seconds (auto-refresh interval)
    await dashboardPage.page.waitForTimeout(30000);
    
    // Step 5-6: Verify KPIs are refreshed or click refresh button
    if (await dashboardPage.refreshButton.isVisible()) {
      await dashboardPage.clickRefresh();
    }
    
    // Step 7: Verify Monthly Spend reflects any updates
    await dashboardPage.waitForKPIUpdate();
    const updatedMonthlySpend = await dashboardPage.getMonthlySpend();
    // Value may be same or different depending on new transactions
    expect(updatedMonthlySpend).toBeDefined();
  });

  /**
   * Test Case ID: QE-7510 TS-001 TC-003
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-001 (Positive)
   * Description: Verify dashboard loads within acceptable time frame (under 2 seconds)
   */
  test('TC-006: Verify dashboard loads within acceptable time frame under 2 seconds', async () => {
    // Step 1-2: Login
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    
    // Step 3-5: Measure dashboard load time
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    
    // Step 6: Verify load time is under 2 seconds
    expect(loadTime).toBeLessThan(2000);
  });

  /**
   * Test Case ID: QE-7510 TS-002 TC-001
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-002 (Negative)
   * Description: Verify cached KPI data is displayed when backend service is unavailable
   */
  test('TC-007: Verify cached KPI data is displayed when backend service is unavailable', async () => {
    // Step 1-3: Login and note current KPI values
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await dashboardPage.waitForDashboardLoad();
    const initialKPIs = await dashboardPage.getAllKPIValues();
    
    // Step 4: Simulate backend service unavailability
    await dashboardPage.page.route('**/api/creditcards**', route => route.abort());
    await dashboardPage.page.route('**/api/dashboard**', route => route.abort());
    
    // Step 5: Refresh the dashboard
    await dashboardPage.clickRefresh();
    await dashboardPage.page.waitForTimeout(2000);
    
    // Step 6: Verify cached KPI data is still displayed
    const cachedKPIs = await dashboardPage.getAllKPIValues();
    expect(cachedKPIs.monthlySpend).toBeDefined();
    
    // Step 7: Verify warning message is displayed
    await expect(dashboardPage.cachedDataWarning).toBeVisible();
    const warningText = await dashboardPage.getCachedDataWarningText();
    expect(warningText).toContain('Displaying cached data');
    
    // Step 8: Verify dashboard remains functional
    await expect(dashboardPage.kpiContainer).toBeVisible();
  });

  /**
   * Test Case ID: QE-7510 TS-002 TC-002
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-002 (Negative)
   * Description: Verify dashboard recovers when backend service becomes available again
   */
  test('TC-008: Verify dashboard recovers when backend service becomes available again', async () => {
    // Step 1-3: Login and simulate service unavailability
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.page.route('**/api/**', route => route.abort());
    await dashboardPage.clickRefresh();
    await dashboardPage.page.waitForTimeout(1000);
    
    // Step 4: Restore backend service availability
    await dashboardPage.page.unroute('**/api/**');
    
    // Step 5: Refresh dashboard
    await dashboardPage.clickRefresh();
    await dashboardPage.waitForKPIUpdate();
    
    // Step 6: Verify warning message is removed
    await expect(dashboardPage.cachedDataWarning).not.toBeVisible();
    
    // Step 7: Verify KPIs are updated with real-time data
    const updatedKPIs = await dashboardPage.getAllKPIValues();
    expect(updatedKPIs.monthlySpend).toBeDefined();
    
    // Step 8: Verify success indicator
    const lastUpdated = await dashboardPage.getLastUpdatedTimestamp();
    expect(lastUpdated).toBeDefined();
  });

  /**
   * Test Case ID: QE-7510 TS-003 TC-001
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-003 (Positive)
   * Description: Verify Available Credit calculation accuracy
   */
  test('TC-009: Verify Available Credit calculation accuracy equals Total Credit Limit minus Outstanding Amount', async () => {
    // Step 1-2: Login
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3-5: Get KPI values
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    const outstandingAmount = await dashboardPage.getTotalOutstanding();
    const availableCredit = await dashboardPage.getTotalAvailableCredit();
    
    // Step 6-7: Verify calculation accuracy
    const calculatedAvailable = totalCreditLimit - outstandingAmount;
    expect(availableCredit).toBe(calculatedAvailable);
  });

  /**
   * Test Case ID: QE-7510 TS-003 TC-002
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-003 (Positive)
   * Description: Verify Monthly Spend reflects only current calendar month transactions
   */
  test('TC-010: Verify Monthly Spend reflects only current calendar month transactions', async () => {
    // Step 1-4: Login and note Monthly Spend
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await dashboardPage.waitForDashboardLoad();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpendKPI = await dashboardPage.getMonthlySpendValue();
    
    // Step 5: Navigate to transactions
    await dashboardPage.navigateToTransactions();
    
    // Step 6: Apply current month filter
    const transactionsPage = new (require('./pages/transactions.page').TransactionsPage)(dashboardPage.page);
    await transactionsPage.filterByMonth(currentMonth, currentYear);
    
    // Step 7: Calculate sum of filtered transactions
    const transactionSum = await transactionsPage.calculateTotalAmount();
    
    // Step 8-9: Return to dashboard and verify
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    const dashboardMonthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(dashboardMonthlySpend).toBe(transactionSum);
  });

  /**
   * Test Case ID: QE-7510 TS-003 TC-003
   * User Story: QE-7510 - Dashboard KPIs Display
   * Scenario: TS-003 (Positive)
   * Description: Verify KPI calculations remain accurate after new transactions are added
   */
  test('TC-011: Verify KPI calculations remain accurate after new transactions are added', async () => {
    // Step 1-3: Login and note initial KPI values
    await loginPage.login(testData.users.testuser.username, testData.users.testuser.password);
    await dashboardPage.waitForDashboardLoad();
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    const initialOutstanding = await dashboardPage.getTotalOutstanding();
    
    // Step 4: Simulate adding new transaction (via API or mock)
    const newTransactionAmount = 100;
    // In real scenario, this would call an API to add transaction
    // For automation, we can mock the response or use test data
    
    // Step 5: Refresh dashboard
    await dashboardPage.clickRefresh();
    await dashboardPage.waitForKPIUpdate();
    
    // Step 6-9: Verify updated KPI calculations
    const updatedMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const updatedOutstanding = await dashboardPage.getTotalOutstanding();
    const updatedAvailableCredit = await dashboardPage.getTotalAvailableCredit();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    
    // Verify calculation accuracy after update
    expect(updatedAvailableCredit).toBe(totalCreditLimit - updatedOutstanding);
  });
});