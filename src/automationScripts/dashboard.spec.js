const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

/**
 * Test Suite: Dashboard and KPI Management
 * Epic: QE-9529 - Dashboard and KPI Management
 * User Story: QE-9652 - Monthly Spend Dashboard Display
 * User Story: QE-9650 - Credit Limit and Availability Tracking
 */

test.describe('Dashboard and KPI Management', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  /**
   * Test Case ID: QE-9805 TS-001 TC-001
   * Scenario: User logs into dashboard and views current month's total spend within 2 seconds
   * Test Data: Username: testuser, Password: Pass@123
   */
  test('TC-6897: Verify dashboard loads and displays monthly spend within 2 seconds', async () => {
    const startTime = Date.now();
    
    await dashboardPage.login('testuser', 'Pass@123');
    await expect(dashboardPage.monthlySpendWidget).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(2000);
    
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendValue).toMatch(/\$[\d,]+/);
    
    await dashboardPage.verifyMonthlySpendCalculation();
  });

  /**
   * Test Case ID: QE-9805 TS-002 TC-001
   * Scenario: Dashboard displays graceful error when transaction service is unavailable
   * Test Data: Simulated Error: 503 Service Unavailable
   */
  test('TC-6898: Verify graceful error handling when transaction service unavailable', async ({ page }) => {
    await page.route('**/api/transactions/monthly-spend*', route => {
      route.fulfill({ status: 503, body: JSON.stringify({ error: 'Service Unavailable' }) });
    });
    
    await dashboardPage.login('testuser', 'Pass@123');
    
    await expect(dashboardPage.monthlySpendErrorMessage).toBeVisible();
    const errorText = await dashboardPage.monthlySpendErrorMessage.textContent();
    expect(errorText).toContain('Unable to retrieve monthly spend data');
    
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    
    await dashboardPage.verifyNavigationAccessible();
  });

  /**
   * Test Case ID: QE-9805 TS-003 TC-001
   * Scenario: Dashboard updates monthly spend in real-time after new transaction
   * Test Data: New Transaction: $150, Category: Shopping, Card: card1
   */
  test('TC-6899: Verify real-time update of monthly spend after new transaction', async ({ page }) => {
    await dashboardPage.login('testuser', 'Pass@123');
    
    const initialSpend = await dashboardPage.getMonthlySpendNumericValue();
    
    await page.route('**/api/transactions/monthly-spend*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ totalSpend: initialSpend + 150, transactionCount: 46 })
      });
    });
    
    const startTime = Date.now();
    await dashboardPage.clickRefreshButton();
    await dashboardPage.waitForDashboardRefresh();
    const refreshTime = Date.now() - startTime;
    
    expect(refreshTime).toBeLessThanOrEqual(2000);
    
    const updatedSpend = await dashboardPage.getMonthlySpendNumericValue();
    expect(updatedSpend).toBe(initialSpend + 150);
  });

  /**
   * Test Case ID: QE-9809 TS-001 TC-001
   * Scenario: Verify consolidated KPI view displays aggregated credit metrics
   * Test Data: Card1 Limit: $5,000, Card2 Limit: $10,000
   */
  test('TC-6885: Verify aggregated credit metrics display for multiple cards', async () => {
    await dashboardPage.login('testuser', 'Pass@123');
    
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    await expect(dashboardPage.availableCreditWidget).toBeVisible();
    await expect(dashboardPage.outstandingAmountWidget).toBeVisible();
    
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    
    expect(totalLimit).toBeGreaterThan(0);
    expect(availableCredit).toBeGreaterThan(0);
    expect(outstandingAmount).toBeGreaterThan(0);
    
    expect(totalLimit).toBe(availableCredit + outstandingAmount);
  });

  /**
   * Test Case ID: QE-9809 TS-002 TC-001
   * Scenario: System handles partial data gracefully when card service returns null data
   * Test Data: Card1: Valid data, Card2: Null/Invalid response
   */
  test('TC-6886: Verify graceful handling of partial card data retrieval', async ({ page }) => {
    await page.route('**/api/cards/balances*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          cards: [
            { cardId: 'card1', creditLimit: 5000, availableCredit: 3000, outstandingBalance: 2000 }
          ]
        })
      });
    });
    
    await dashboardPage.login('testuser', 'Pass@123');
    
    await expect(dashboardPage.warningMessage).toBeVisible();
    const warningText = await dashboardPage.warningMessage.textContent();
    expect(warningText).toContain('Unable to retrieve data for some cards');
    
    await expect(dashboardPage.totalCreditLimitWidget).toBeVisible();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalLimit).toBe(5000);
    
    await dashboardPage.verifyNavigationAccessible();
  });

  /**
   * Test Case ID: QE-9809 TS-003 TC-001
   * Scenario: KPI view updates after payment within 2-second load time
   * Test Data: Payment Amount: $500, Card: card1
   */
  test('TC-6887: Verify real-time KPI update after payment', async ({ page }) => {
    await dashboardPage.login('testuser', 'Pass@123');
    
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    const initialAvailable = await dashboardPage.getAvailableCreditValue();
    
    await page.route('**/api/cards/balances*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          cards: [
            { cardId: 'card1', creditLimit: 5000, availableCredit: initialAvailable + 500, outstandingBalance: initialOutstanding - 500 }
          ]
        })
      });
    });
    
    const startTime = Date.now();
    await dashboardPage.clickRefreshButton();
    await dashboardPage.waitForDashboardRefresh();
    const refreshTime = Date.now() - startTime;
    
    expect(refreshTime).toBeLessThanOrEqual(2000);
    
    const updatedOutstanding = await dashboardPage.getOutstandingAmountValue();
    const updatedAvailable = await dashboardPage.getAvailableCreditValue();
    
    expect(updatedOutstanding).toBe(initialOutstanding - 500);
    expect(updatedAvailable).toBe(initialAvailable + 500);
  });
});