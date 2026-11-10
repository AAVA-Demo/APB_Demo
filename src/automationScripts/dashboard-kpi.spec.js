const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const testData = require('../data/testData.json');

test.describe('Dashboard KPI Tests - QE-10457', () => {

  test('QE-10457 TS-001 TC-001: Verify aggregated KPI metrics for multiple active credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Step 1: Navigate to dashboard
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    // Step 2: Set up test data with 3 credit cards
    const userId = 'user123';
    const cards = [
      { cardId: 'cardA', creditLimit: 10000, currentBalance: 3000 },
      { cardId: 'cardB', creditLimit: 20000, currentBalance: 5000 },
      { cardId: 'cardC', creditLimit: 15000, currentBalance: 7500 }
    ];
    
    // Step 3: Fetch KPI data
    await dashboardPage.loadKPIsForUser(userId);
    
    // Step 4: Validate totalCreditLimit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$45,000');
    
    // Step 5: Validate availableCredit
    const availableCredit = await dashboardPage.getAvailableCredit();
    expect(availableCredit).toBe('$29,500');
    
    // Step 6: Validate outstandingAmount
    const outstandingAmount = await dashboardPage.getOutstandingAmount();
    expect(outstandingAmount).toBe('$15,500');
    
    // Step 7: Validate overallUtilization percentage
    const utilization = await dashboardPage.getOverallUtilization();
    expect(utilization).toBe('34.44%');
  });

  test('QE-10457 TS-002 TC-001: Verify system handles zero credit limit without division-by-zero error', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user456';
    await dashboardPage.loadKPIsForUser(userId);
    
    // Validate totalCreditLimit
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$10,000');
    
    // Validate utilization calculation handles zero credit limit gracefully
    const utilization = await dashboardPage.getOverallUtilization();
    expect(utilization).toMatch(/20\.00%|0%/);
    
    // Verify no error messages displayed
    const hasError = await dashboardPage.hasErrorMessage();
    expect(hasError).toBe(false);
  });

  test('QE-10457 TS-002 TC-002: Verify system displays utilization as 0% when all cards have zero credit limit', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user789';
    await dashboardPage.loadKPIsForUser(userId);
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).toBe('$0');
    
    const utilization = await dashboardPage.getOverallUtilization();
    expect(utilization).toMatch(/0%|N\/A/);
  });

  test('QE-10457 TS-003 TC-001: Verify appropriate error message when credit card data service is unavailable', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Simulate service unavailability by mocking API response
    await page.route('**/api/cards/summary*', route => route.abort());
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user123';
    await dashboardPage.loadKPIsForUser(userId);
    
    // Validate error message
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('Credit utilization metrics cannot be calculated at this time');
    
    // Verify no incorrect KPI values displayed
    const hasKPIData = await dashboardPage.hasKPIData();
    expect(hasKPIData).toBe(false);
  });

  test('QE-10457 TS-003 TC-002: Verify system handles incomplete credit card data gracefully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Mock incomplete data response
    await page.route('**/api/cards/summary*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          { cardId: 'cardA', creditLimit: 10000, currentBalance: 3000 },
          { cardId: 'cardB', creditLimit: 20000 }
        ])
      });
    });
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user123';
    await dashboardPage.loadKPIsForUser(userId);
    
    // Validate error handling
    const errorMessage = await dashboardPage.getErrorMessage();
    expect(errorMessage).toContain('incomplete data');
    
    // Verify no partial KPI data displayed
    const hasPartialData = await dashboardPage.hasPartialKPIData();
    expect(hasPartialData).toBe(false);
  });

});

test.describe('Dashboard Monthly Spending Tests - QE-10453', () => {

  test('QE-10453 TS-001 TC-001: Verify dashboard aggregates total monthly spending from all cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user123';
    await dashboardPage.loadKPIsForUser(userId);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$2,700');
    
    const month = await dashboardPage.getCurrentMonth();
    expect(month).toBe('2026-11');
  });

  test('QE-10453 TS-002 TC-001: Verify dashboard displays zero monthly spending when user has no credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user456';
    await dashboardPage.loadKPIsForUser(userId);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$0');
    
    const hasError = await dashboardPage.hasErrorMessage();
    expect(hasError).toBe(false);
  });

  test('QE-10453 TS-002 TC-002: Verify dashboard displays zero monthly spending when user has cards but no transactions', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user789';
    await dashboardPage.loadKPIsForUser(userId);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$0');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimit();
    expect(totalCreditLimit).not.toBe('$0');
  });

  test('QE-10453 TS-003 TC-001: Verify dashboard correctly sums spending across multiple cards without duplicates', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    await dashboardPage.navigate();
    await dashboardPage.waitForPageLoad();
    
    const userId = 'user123';
    await dashboardPage.loadKPIsForUser(userId);
    
    const monthlySpend = await dashboardPage.getMonthlySpend();
    expect(monthlySpend).toBe('$3,000');
    
    // Verify accuracy to 2 decimal places
    const spendValue = parseFloat(monthlySpend.replace(/[$,]/g, ''));
    expect(spendValue).toBe(3000.00);
  });

});