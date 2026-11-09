const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// Test cases for QE-8010: Monthly Spend KPI Display
test.describe('Monthly Spend KPI Display', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8010 TS-001 TC-001: Verify Monthly Spend KPI displays accurate total spending aggregated from all active credit cards', async () => {
    // Step 1: Application loads successfully
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Verify user has active credit cards with transactions
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.navigateToKPISection();
    
    // Step 4: Locate Monthly Spend KPI
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    // Step 5: Verify accurate total spending amount
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpendValue).toBe('$2,500');
  });

  test('QE-8010 TS-002 TC-001: Verify Monthly Spend KPI displays $0.00 when user has no transactions', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Verify no transactions in current month
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.navigateToKPISection();
    
    // Step 4: Locate Monthly Spend KPI
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    // Step 5: Verify $0.00 or appropriate message
    const monthlySpendValue = await dashboardPage.getMonthlySpendValue();
    const isZeroOrMessage = monthlySpendValue === '$0.00' || await dashboardPage.monthlySpendKPI.textContent().then(text => text.includes('No spending this month'));
    expect(isZeroOrMessage).toBeTruthy();
  });

  test('QE-8010 TS-003 TC-001: Verify Monthly Spend KPI displays error message when service is unavailable', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to Dashboard KPI section
    await dashboardPage.navigateToKPISection();
    
    // Step 3: Simulate service unavailability (handled by test data setup)
    // Step 4: Locate Monthly Spend KPI area
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    // Step 5: Verify error message
    const errorMessage = await dashboardPage.getKPIErrorMessage();
    expect(errorMessage).toContain('Data cannot be loaded at this time');
  });
});

// Test cases for QE-8011: Available Credit KPI Monitoring
test.describe('Available Credit KPI Monitoring', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8011 TS-001 TC-001: Verify Available Credit KPI accurately aggregates across multiple cards', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Verify multiple credit cards registered
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.navigateToKPISection();
    
    // Step 4: Locate Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    
    // Step 5: Verify correct aggregated value
    const availableCreditValue = await dashboardPage.getAvailableCreditValue();
    expect(availableCreditValue).toBe('$8,000');
  });

  test('QE-8011 TS-002 TC-001: Verify Available Credit KPI displays $0 at maximum utilization', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Verify cards at maximum utilization
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.navigateToKPISection();
    
    // Step 4: Locate Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    
    // Step 5: Verify $0 or warning message
    const availableCreditValue = await dashboardPage.getAvailableCreditValue();
    const isZeroOrWarning = availableCreditValue === '$0.00' || await dashboardPage.availableCreditKPI.textContent().then(text => text.includes('No available credit remaining'));
    expect(isZeroOrWarning).toBeTruthy();
  });

  test('QE-8011 TS-003 TC-001: Verify Available Credit KPI handles invalid credit limit data', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Verify cards with invalid credit limit data
    await dashboardPage.waitForDashboardLoad();
    
    // Step 3: Navigate to Dashboard KPI section
    await dashboardPage.navigateToKPISection();
    
    // Step 4: Locate Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    
    // Step 5: Verify exclusion with warning or error
    const kpiText = await dashboardPage.availableCreditKPI.textContent();
    const hasWarningOrError = kpiText.includes('Some cards excluded') || kpiText.includes('Incomplete data prevents');
    expect(hasWarningOrError).toBeTruthy();
  });
});