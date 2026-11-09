const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// Test cases for QE-8013: Category-Wise Spending Visualization
test.describe('Category-Wise Spending Visualization', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-8013 TS-001 TC-001: Verify category-wise spending visualization displays all nine categories', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to Transaction Analytics section
    await dashboardPage.navigateToAnalytics();
    
    // Step 3: Verify visualization is displayed
    await expect(dashboardPage.categoryVisualization).toBeVisible();
    const categories = await dashboardPage.getAllCategories();
    expect(categories).toHaveLength(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    // Step 4: Validate accurate total amounts
    const categoryAmounts = await dashboardPage.getCategoryAmounts();
    expect(categoryAmounts['Food & Dining']).toBe('$450');
    expect(categoryAmounts['Fuel']).toBe('$200');
    expect(categoryAmounts['Shopping']).toBe('$350');
    expect(categoryAmounts['Travel']).toBe('$500');
    
    // Step 5: Validate accurate percentages
    const categoryPercentages = await dashboardPage.getCategoryPercentages();
    expect(categoryPercentages['Food & Dining']).toBe('25%');
    expect(categoryPercentages['Travel']).toBe('27.78%');
  });

  test('QE-8013 TS-002 TC-001: Verify single-category dominance when all transactions are Miscellaneous', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to Transaction Analytics
    await dashboardPage.navigateToAnalytics();
    
    // Step 3: Verify visualization for Miscellaneous dominance
    await expect(dashboardPage.categoryVisualization).toBeVisible();
    const miscellaneousAmount = await dashboardPage.getCategoryAmount('Miscellaneous');
    expect(miscellaneousAmount).toBe('$1200');
    const miscellaneousPercentage = await dashboardPage.getCategoryPercentage('Miscellaneous');
    expect(miscellaneousPercentage).toBe('100%');
    
    // Step 4: Validate other categories show 0%
    const otherCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education'];
    for (const category of otherCategories) {
      const amount = await dashboardPage.getCategoryAmount(category);
      const percentage = await dashboardPage.getCategoryPercentage(category);
      expect(amount).toBe('$0.00');
      expect(percentage).toBe('0%');
    }
    
    // Step 5: Verify visual representation
    const visualRepresentation = await dashboardPage.getChartType();
    expect(visualRepresentation).toBeTruthy();
  });

  test('QE-8013 TS-003 TC-001: Verify appropriate message when user has no transaction history', async () => {
    // Step 1: Application loads
    await expect(dashboardPage.page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to Transaction Analytics
    await dashboardPage.navigateToAnalytics();
    
    // Step 3: Verify system detects zero transactions
    const transactionCount = await dashboardPage.getTransactionCount();
    expect(transactionCount).toBe(0);
    
    // Step 4: Validate appropriate message
    const emptyMessage = await dashboardPage.getEmptyAnalyticsMessage();
    expect(emptyMessage).toContain('No transactions available for analysis');
    
    // Step 5: Verify no chart rendered
    const isChartVisible = await dashboardPage.categoryVisualization.isVisible().catch(() => false);
    expect(isChartVisible).toBeFalsy();
  });
});

// Test cases for QE-8012: Interactive Analytics Charts
test.describe('Interactive Analytics Charts', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.navigateToAnalytics();
  });

  test('QE-8012 TS-001 TC-001: Verify interactive chart allows drill-down into Food & Dining category', async () => {
    // Step 1-2: Already handled in beforeEach
    
    // Step 3: Click on Food & Dining category
    await dashboardPage.clickCategorySegment('Food & Dining');
    await expect(dashboardPage.detailView).toBeVisible();
    
    // Step 4: Verify detailed spending trends
    const monthlyTrends = await dashboardPage.getCategoryMonthlyTrends();
    expect(monthlyTrends).toHaveLength(6);
    expect(monthlyTrends[0].month).toBe('Jan');
    expect(monthlyTrends[0].amount).toBe('$80');
    expect(monthlyTrends[5].month).toBe('Jun');
    expect(monthlyTrends[5].amount).toBe('$50');
    
    // Step 5: Verify drill-down shows individual transactions
    const transactions = await dashboardPage.getCategoryTransactions();
    expect(transactions).toHaveLength(12);
    expect(transactions[0]).toHaveProperty('date');
    expect(transactions[0]).toHaveProperty('merchant');
    expect(transactions[0]).toHaveProperty('amount');
    expect(transactions[0]).toHaveProperty('description');
  });

  test('QE-8012 TS-002 TC-001: Verify drill-down into zero-transaction category shows empty state', async () => {
    // Step 1-2: Already handled in beforeEach
    
    // Step 3: Click on Healthcare category
    await dashboardPage.clickCategorySegment('Healthcare');
    
    // Step 4: Verify empty state message
    const emptyMessage = await dashboardPage.getCategoryEmptyMessage();
    expect(emptyMessage).toContain('No transactions in this category');
    
    // Step 5: Verify empty detail view
    const hasTransactionList = await dashboardPage.transactionList.isVisible().catch(() => false);
    expect(hasTransactionList).toBeFalsy();
  });

  test('QE-8012 TS-003 TC-001: Verify error state when transaction data fails to load', async () => {
    // Step 1-2: Already handled in beforeEach
    
    // Step 3: Simulate data service failure (handled by test setup)
    await expect(dashboardPage.chartErrorState).toBeVisible();
    
    // Step 4: Verify error state message
    const errorMessage = await dashboardPage.getChartErrorMessage();
    expect(errorMessage).toContain('Chart interaction unavailable due to data loading error');
    
    // Step 5: Verify interactivity is disabled
    const isInteractive = await dashboardPage.isChartInteractive();
    expect(isInteractive).toBeFalsy();
  });
});