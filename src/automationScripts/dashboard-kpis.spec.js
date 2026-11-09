const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { ApiHelper } = require('./helpers/api.helper');

/**
 * Test Suite: Dashboard KPIs Display
 * Epic: QE-8357 - Dashboard KPIs and Credit Card Overview
 * Test Cases: QE-8456 TS-001 TC-001, QE-8456 TS-002 TC-001, QE-8456 TS-003 TC-001
 */

test.describe('Dashboard KPIs Display', () => {
  let dashboardPage;
  let apiHelper;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    apiHelper = new ApiHelper(page);
    await dashboardPage.navigate();
  });

  /**
   * Test Case ID: QE-8456 TS-001 TC-001
   * Description: Verify that user with multiple credit cards sees all KPIs with accurate aggregated values loaded within 2 seconds
   */
  test('TC-001: Verify dashboard KPIs display with multiple credit cards within 2 seconds', async ({ page }) => {
    // Step 1: Setup test data - user with multiple credit cards
    const testUserId = 'testuser_kpi';
    const expectedData = {
      totalCreditLimit: 15000,
      totalOutstanding: 5000,
      totalAvailableCredit: 10000,
      totalMonthlySpend: 4000
    };

    // Step 2 & 3: Send API request and measure response time
    const startTime = Date.now();
    const response = await apiHelper.getDashboardKPIs(testUserId);
    const responseTime = Date.now() - startTime;

    // Verify response time is under 2 seconds
    expect(responseTime).toBeLessThan(2000);
    expect(response.status).toBe(200);

    // Step 4-7: Verify all KPI values are correctly aggregated
    const kpiData = await response.json();
    expect(kpiData.totalCreditLimit).toBe(expectedData.totalCreditLimit);
    expect(kpiData.totalOutstanding).toBe(expectedData.totalOutstanding);
    expect(kpiData.totalAvailableCredit).toBe(expectedData.totalAvailableCredit);
    expect(kpiData.totalMonthlySpend).toBe(expectedData.totalMonthlySpend);

    // Verify KPIs are displayed on dashboard
    await expect(dashboardPage.totalCreditLimitValue).toHaveText('$15,000.00');
    await expect(dashboardPage.totalOutstandingValue).toHaveText('$5,000.00');
    await expect(dashboardPage.availableCreditValue).toHaveText('$10,000.00');
    await expect(dashboardPage.monthlySpendValue).toHaveText('$4,000.00');
  });

  /**
   * Test Case ID: QE-8456 TS-002 TC-001
   * Description: Verify error handling when backend service is unavailable
   */
  test('TC-002: Verify error message with retry option when backend is unavailable', async ({ page }) => {
    // Step 1: Simulate backend unavailability
    await page.route('**/api/dashboard/kpis**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { message: 'Failed to load dashboard data. Please try again.' },
          retryAvailable: true
        })
      });
    });

    // Step 2: Attempt to load dashboard
    await dashboardPage.navigate();

    // Step 3-6: Verify error handling
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Failed to load dashboard data');
    await expect(dashboardPage.retryButton).toBeVisible();
    
    // Verify no KPI data is displayed
    await expect(dashboardPage.totalCreditLimitValue).not.toBeVisible();
    await expect(dashboardPage.kpiContainer).not.toContainText('$');
  });

  /**
   * Test Case ID: QE-8456 TS-003 TC-001
   * Description: Verify credit utilization percentage calculation with color-coding
   */
  test('TC-003: Verify credit utilization percentage with color-coding thresholds', async ({ page }) => {
    // Test Scenario 1: Low utilization (20%) - Green
    const userAData = { userId: 'userA', creditLimit: 10000, outstanding: 2000, utilization: 20.00 };
    await apiHelper.mockDashboardKPIs(userAData);
    await dashboardPage.navigate();
    
    await expect(dashboardPage.creditUtilizationValue).toHaveText('20.00%');
    await expect(dashboardPage.creditUtilizationIndicator).toHaveClass(/green|low/);

    // Test Scenario 2: Medium utilization (50%) - Yellow
    const userBData = { userId: 'userB', creditLimit: 10000, outstanding: 5000, utilization: 50.00 };
    await apiHelper.mockDashboardKPIs(userBData);
    await dashboardPage.refresh();
    
    await expect(dashboardPage.creditUtilizationValue).toHaveText('50.00%');
    await expect(dashboardPage.creditUtilizationIndicator).toHaveClass(/yellow|medium/);

    // Test Scenario 3: High utilization (80%) - Red
    const userCData = { userId: 'userC', creditLimit: 10000, outstanding: 8000, utilization: 80.00 };
    await apiHelper.mockDashboardKPIs(userCData);
    await dashboardPage.refresh();
    
    await expect(dashboardPage.creditUtilizationValue).toHaveText('80.00%');
    await expect(dashboardPage.creditUtilizationIndicator).toHaveClass(/red|high/);
  });
});