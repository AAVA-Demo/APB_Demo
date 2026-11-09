const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('QE-8446 - Category-Wise Spending Visualization Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
  });

  test.describe('TS-001 - All Categories Spending Visualization', () => {
    test('TC-001 - Verify user with transactions across all 9 categories views accurate spending distribution in interactive chart', async ({ page }) => {
      await analyticsPage.navigate();
      await expect(analyticsPage.page).toHaveURL(/\/analytics/);
      await analyticsPage.verifyInteractiveChartDisplayed();
      await analyticsPage.verifyAllCategoriesDisplayed([
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ]);
      await analyticsPage.verifyCategoryAmount('Food & Dining', '₹2,150');
      await analyticsPage.verifyCategoryAmount('Fuel', '₹800');
      await analyticsPage.verifyCategoryAmount('Shopping', '₹3,500');
      await analyticsPage.verifyCategoryAmount('Travel', '₹2,500');
      await analyticsPage.verifyCategoryAmount('Entertainment', '₹600');
      await analyticsPage.verifyCategoryAmount('Utilities', '₹1,500');
      await analyticsPage.verifyCategoryAmount('Healthcare', '₹4,500');
      await analyticsPage.verifyCategoryAmount('Education', '₹8,000');
      await analyticsPage.verifyCategoryAmount('Miscellaneous', '₹450');
      await analyticsPage.verifyChartInteractivity();
    });

    test('TC-002 - Verify category-wise spending chart displays correct percentages for each category', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyTotalSpend('₹24,000');
      await analyticsPage.verifyCategoryPercentage('Education', 33.3);
      await analyticsPage.verifyCategoryPercentage('Shopping', 14.6);
      await analyticsPage.verifyPercentagesSum(100);
      await analyticsPage.verifyChartLegendDisplayed();
    });

    test('TC-003 - Verify spending analytics page displays total spend summary alongside category-wise chart', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyTotalSpendSummary('₹24,000');
      await analyticsPage.verifyCategoryBreakdownListDisplayed();
      await analyticsPage.verifyCategoryBreakdownSum('₹24,000');
    });
  });

  test.describe('TS-002 - No Transaction History Scenario', () => {
    test('TC-001 - Verify user with no transaction history receives appropriate message on spending analytics dashboard', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyNoDataMessage('No spending data available. Start using your credit cards to see analytics.');
      await analyticsPage.verifyNoSystemErrors();
    });

    test('TC-002 - Verify empty chart is displayed when user has no transactions', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyEmptyChartDisplayed();
      await analyticsPage.verifyTotalSpendSummary('₹0');
    });

    test('TC-003 - Verify category breakdown list displays all 9 categories with ₹0 amounts when no transactions exist', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyAllCategoriesDisplayed([
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ]);
      await analyticsPage.verifyAllCategoriesShowZero();
    });
  });

  test.describe('TS-003 - Invalid/Missing Category Data Handling', () => {
    test('TC-001 - Verify transactions with invalid category data are correctly defaulted to Miscellaneous category', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyCategoryAmount('Miscellaneous', '₹1,950');
      await analyticsPage.verifyAllCategoriesDisplayed([
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ]);
    });

    test('TC-002 - Verify transactions with missing category data are correctly defaulted to Miscellaneous category', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyCategoryAmount('Miscellaneous', '₹3,950');
      await analyticsPage.verifyTotalSpendIncludesAllTransactions();
    });

    test('TC-003 - Verify all spending is accounted for in visualization when mix of valid, invalid, and missing categories exist', async ({ page }) => {
      await analyticsPage.navigate();
      await analyticsPage.verifyCategoryAmount('Food & Dining', '₹1,200');
      await analyticsPage.verifyCategoryAmount('Fuel', '₹800');
      await analyticsPage.verifyCategoryAmount('Miscellaneous', '₹1,000');
      await analyticsPage.verifyTotalSpend('₹3,000');
    });
  });
});
