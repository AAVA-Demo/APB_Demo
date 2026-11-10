const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CardWiseAnalysisPage } = require('./pages/cardWiseAnalysis.page');

test.describe('Card-wise Spending Analysis Tests', () => {

  test('QE-9712 TS-001 TC-001 - Verify user can select a specific card from portfolio view and see detailed spending patterns with accurate category breakdowns and utilization metrics specific to that card only', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardWiseAnalysisPage = new CardWiseAnalysisPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_cardanalysis', 'Test@123');

    // Step 3: Navigate to multi-card portfolio view
    await cardWiseAnalysisPage.navigateToPortfolio();
    await expect(cardWiseAnalysisPage.portfolioContainer).toBeVisible();

    // Step 4: Select card ending in 1234
    await cardWiseAnalysisPage.selectCard('1234');

    // Step 5: Observe detailed spending patterns
    await expect(cardWiseAnalysisPage.spendingAnalysisContainer).toBeVisible();

    // Step 6: Verify category breakdown
    const expectedCategories = {
      'Food & Dining': '$500', 'Fuel': '$200', 'Shopping': '$800',
      'Travel': '$300', 'Entertainment': '$150', 'Utilities': '$100',
      'Healthcare': '$50', 'Education': '$0', 'Miscellaneous': '$100'
    };
    const actualCategories = await cardWiseAnalysisPage.getCategoryBreakdown();
    expect(actualCategories).toEqual(expectedCategories);

    // Step 7: Verify utilization metric
    const utilization = await cardWiseAnalysisPage.getUtilizationMetric();
    expect(utilization).toBe('22%');

    // Step 8: Verify data is specific to selected card
    const selectedCard = await cardWiseAnalysisPage.getSelectedCardNumber();
    expect(selectedCard).toContain('1234');
  });

  test('QE-9712 TS-002 TC-001 - Verify card-wise spending analysis displays zero spending across all categories and 0% utilization metric for credit card with zero transactions in current billing cycle', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardWiseAnalysisPage = new CardWiseAnalysisPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_notransactions', 'Test@123');

    // Step 3: Navigate to multi-card portfolio view
    await cardWiseAnalysisPage.navigateToPortfolio();

    // Step 4: Select card ending in 5678 with zero transactions
    await cardWiseAnalysisPage.selectCard('5678');

    // Step 5: Observe card details
    await expect(cardWiseAnalysisPage.spendingAnalysisContainer).toBeVisible();

    // Step 6: Verify all categories show $0
    const categories = await cardWiseAnalysisPage.getCategoryBreakdown();
    const allZero = Object.values(categories).every(value => value === '$0');
    expect(allZero).toBe(true);

    // Step 7: Verify utilization metric shows 0%
    const utilization = await cardWiseAnalysisPage.getUtilizationMetric();
    expect(utilization).toMatch(/0%|No transactions/);

    // Step 8: Verify outstanding balance is $0
    const outstanding = await cardWiseAnalysisPage.getOutstandingBalance();
    expect(outstanding).toBe('$0');
  });

  test('QE-9712 TS-003 TC-001 - Verify card-wise spending analysis correctly calculates and displays 90% utilization metric along with accurate category-wise spending breakdown that sums to total outstanding amount for card at 90% credit utilization', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardWiseAnalysisPage = new CardWiseAnalysisPage(page);

    // Step 1 & 2: Launch and authenticate
    await loginPage.navigate();
    await loginPage.login('testuser_highutilization', 'Test@123');

    // Step 3: Navigate to multi-card portfolio view
    await cardWiseAnalysisPage.navigateToPortfolio();

    // Step 4: Select card ending in 9012 with 90% utilization
    await cardWiseAnalysisPage.selectCard('9012');

    // Step 5: Verify utilization metric is 90%
    const utilization = await cardWiseAnalysisPage.getUtilizationMetric();
    expect(utilization).toBe('90%');

    // Step 6: Verify category-wise spending breakdown
    const expectedCategories = {
      'Food & Dining': '$2,000', 'Fuel': '$1,500', 'Shopping': '$2,500',
      'Travel': '$1,000', 'Entertainment': '$800', 'Utilities': '$500',
      'Healthcare': '$300', 'Education': '$200', 'Miscellaneous': '$200'
    };
    const actualCategories = await cardWiseAnalysisPage.getCategoryBreakdown();
    expect(actualCategories).toEqual(expectedCategories);

    // Step 7: Calculate sum of all categories
    const categorySum = Object.values(actualCategories)
      .map(val => parseInt(val.replace(/[$,]/g, '')))
      .reduce((sum, val) => sum + val, 0);
    expect(categorySum).toBe(9000);

    // Step 8: Verify sum matches outstanding amount
    const outstanding = await cardWiseAnalysisPage.getOutstandingBalance();
    expect(outstanding).toBe('$9,000');
  });

});