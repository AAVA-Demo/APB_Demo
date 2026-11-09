const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('QE-8448 - Consolidated Financial Metrics Dashboard Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test.describe('TS-001 - KPI Aggregation for Multiple Active Cards', () => {
    test('TC-001 - Verify dashboard aggregates KPIs correctly for user with 3 active credit cards', async ({ page }) => {
      await dashboardPage.navigate();
      await expect(dashboardPage.page).toHaveURL(/\/dashboard/);
      await dashboardPage.verifyKPIValue('Monthly Spend', '₹28,000');
      await dashboardPage.verifyKPIValue('Total Credit Limit', '₹155,000');
      await dashboardPage.verifyKPIValue('Available Credit', '₹115,500');
      await dashboardPage.verifyKPIValue('Outstanding Amount', '₹39,500');
    });

    test('TC-002 - Verify dashboard KPIs update correctly when user has multiple cards with varying balances', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyCardListDisplayed();
      await dashboardPage.verifyCardDetails('CC001', { limit: '₹50,000', outstanding: '₹12,500' });
      await dashboardPage.verifyCardDetails('CC002', { limit: '₹30,000', outstanding: '₹5,000' });
      await dashboardPage.verifyCardDetails('CC003', { limit: '₹75,000', outstanding: '₹22,000' });
      await dashboardPage.verifyAggregatedKPIsMatchIndividualCards();
    });

    test('TC-003 - Verify dashboard KPIs are accurate when user has cards with high credit limits and low outstanding amounts', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyKPIValue('Available Credit', '₹115,500');
      await dashboardPage.verifyKPIValue('Total Credit Limit', '₹155,000');
      await dashboardPage.verifyCreditUtilization(74.5);
      await dashboardPage.verifyKPIValue('Outstanding Amount', '₹39,500');
      await dashboardPage.verifyOutstandingPercentage(25.5);
    });
  });

  test.describe('TS-002 - Zero Balances and No Transactions Handling', () => {
    test('TC-001 - Verify dashboard displays accurate zero values for user with zero balances and no transactions', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyKPIValue('Monthly Spend', '₹0');
      await dashboardPage.verifyKPIValue('Outstanding Amount', '₹0');
      await dashboardPage.verifyKPIValue('Total Credit Limit', '₹155,000');
      await dashboardPage.verifyAvailableCreditEqualsLimit();
    });

    test('TC-002 - Verify dashboard handles user with credit cards having zero outstanding but non-zero monthly spend', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyKPIValue('Monthly Spend', '₹10,000');
      await dashboardPage.verifyKPIValue('Outstanding Amount', '₹0');
      await dashboardPage.verifyAvailableCreditEqualsLimit();
    });

    test('TC-003 - Verify dashboard correctly displays zero monthly spend for user with no transactions in current month', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyKPIValue('Monthly Spend', '₹0');
      await dashboardPage.verifyKPIValue('Total Credit Limit', '₹155,000');
      await dashboardPage.verifyKPIValue('Outstanding Amount', '₹5,000');
    });
  });

  test.describe('TS-003 - Invalid Card Data Validation', () => {
    test('TC-001 - Verify dashboard validates and excludes card with negative outstanding amount from aggregation', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyKPIValue('Outstanding Amount', '₹39,500');
      await dashboardPage.verifyInvalidCardExcluded('CC004');
    });

    test('TC-002 - Verify dashboard displays validation error message when card has credit limit exceeding system maximum', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyValidationErrorDisplayed('Card CC005 has invalid credit limit exceeding system maximum. Please contact support.');
      await dashboardPage.verifyNoSystemCrash();
      await dashboardPage.verifyValidCardsDisplayed();
    });

    test('TC-003 - Verify dashboard flags error when card has outstanding amount greater than credit limit', async ({ page }) => {
      await dashboardPage.navigate();
      await dashboardPage.verifyValidationErrorFlagged('Card CC006 outstanding amount exceeds credit limit.');
      await dashboardPage.verifyNoSystemCrash();
      await dashboardPage.verifyValidCardsDisplayed();
    });
  });
});
