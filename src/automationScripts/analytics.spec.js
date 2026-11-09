const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

// Test Cases for QE-8295 (Interactive Category Spending Visualization)
test.describe('QE-8295: Interactive Category Spending Visualization', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('QE-8295 TS-001 TC-001: Verify interactive pie chart displays spending amounts and percentages for all populated categories from 9 predefined categories', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*analytics/);
    
    // Step 2: Simulate transactions across 7 categories
    await analyticsPage.setupTransactionsByCategory([
      { category: 'Food & Dining', amount: 3500 },
      { category: 'Fuel', amount: 2000 },
      { category: 'Shopping', amount: 4200 },
      { category: 'Entertainment', amount: 800 },
      { category: 'Healthcare', amount: 1200 },
      { category: 'Utilities', amount: 1500 },
      { category: 'Travel', amount: 350 }
    ]);
    
    // Step 3: Navigate to Spending Analytics Dashboard
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 4: Verify interactive pie chart is rendered
    await expect(analyticsPage.pieChart).toBeVisible();
    const chartSegments = await analyticsPage.getChartSegmentCount();
    expect(chartSegments).toBe(7);
    
    // Step 5: Verify spending amounts are displayed
    const categoryAmounts = await analyticsPage.getCategoryAmounts();
    expect(categoryAmounts['Food & Dining']).toBe('3,500');
    expect(categoryAmounts['Fuel']).toBe('2,000');
    expect(categoryAmounts['Shopping']).toBe('4,200');
    expect(categoryAmounts['Entertainment']).toBe('800');
    expect(categoryAmounts['Healthcare']).toBe('1,200');
    expect(categoryAmounts['Utilities']).toBe('1,500');
    expect(categoryAmounts['Travel']).toBe('350');
    
    // Step 6: Verify percentages are calculated and displayed
    const categoryPercentages = await analyticsPage.getCategoryPercentages();
    expect(categoryPercentages['Food & Dining']).toBe('25.8%');
    expect(categoryPercentages['Fuel']).toBe('14.8%');
    expect(categoryPercentages['Shopping']).toBe('31.0%');
    expect(categoryPercentages['Entertainment']).toBe('5.9%');
    expect(categoryPercentages['Healthcare']).toBe('8.9%');
    expect(categoryPercentages['Utilities']).toBe('11.1%');
    expect(categoryPercentages['Travel']).toBe('2.6%');
  });

  test('QE-8295 TS-002 TC-001: Verify empty state visualization displays when user has zero transactions in current month', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*analytics/);
    
    // Step 2: Simulate user with zero transactions
    await analyticsPage.setupTransactionsByCategory([]);
    
    // Step 3: Navigate to Spending Analytics Dashboard
    await analyticsPage.waitForAnalyticsLoad();
    
    // Step 4: Verify empty state visualization is displayed
    const emptyStateMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('No spending data available for the current month');
    expect(emptyStateMessage).toContain('Start using your cards to see analytics');
    
    // Step 5: Verify all 9 categories show zero spend
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(categoryBreakdown['Food & Dining']).toBe('0');
    expect(categoryBreakdown['Fuel']).toBe('0');
    expect(categoryBreakdown['Shopping']).toBe('0');
    expect(categoryBreakdown['Travel']).toBe('0');
    expect(categoryBreakdown['Entertainment']).toBe('0');
    expect(categoryBreakdown['Utilities']).toBe('0');
    expect(categoryBreakdown['Healthcare']).toBe('0');
    expect(categoryBreakdown['Education']).toBe('0');
    expect(categoryBreakdown['Miscellaneous']).toBe('0');
    
    // Step 6: Verify total spend shows zero
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBe('0');
  });

  test('QE-8295 TS-003 TC-001: Verify clicking category segment in chart filters and displays all transactions belonging to that category', async ({ page }) => {
    // Step 1: Application loads successfully
    await expect(page).toHaveURL(/.*analytics/);
    
    // Step 2: Simulate transactions in Food & Dining category
    await analyticsPage.setupTransactions([
      { merchant: 'Swiggy', amount: 450, date: 'Jan 10, 2024', category: 'Food & Dining' },
      { merchant: 'Dominos', amount: 650, date: 'Jan 20, 2024', category: 'Food & Dining' },
      { merchant: 'Zomato', amount: 400, date: 'Jan 25, 2024', category: 'Food & Dining' }
    ]);
    
    // Step 3: Navigate to Spending Analytics Dashboard
    await analyticsPage.waitForAnalyticsLoad();
    await expect(analyticsPage.pieChart).toBeVisible();
    
    // Step 4: Click on Food & Dining segment
    await analyticsPage.clickCategorySegment('Food & Dining');
    
    // Step 5: Verify system filters and displays all Food & Dining transactions
    const filteredTransactions = await analyticsPage.getFilteredTransactions();
    expect(filteredTransactions.length).toBe(3);
    expect(filteredTransactions[0].merchant).toBe('Swiggy');
    expect(filteredTransactions[0].amount).toBe('450');
    expect(filteredTransactions[0].date).toContain('Jan 10');
    expect(filteredTransactions[1].merchant).toBe('Dominos');
    expect(filteredTransactions[1].amount).toBe('650');
    expect(filteredTransactions[2].merchant).toBe('Zomato');
    expect(filteredTransactions[2].amount).toBe('400');
    
    // Step 6: Verify transaction details include merchant, amount, date
    for (const txn of filteredTransactions) {
      expect(txn.merchant).toBeDefined();
      expect(txn.amount).toBeDefined();
      expect(txn.date).toBeDefined();
    }
  });
});