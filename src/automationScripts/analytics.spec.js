const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Analytics - Spending Insights and Trends', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  test('QE-10381 TS001 TC-001: Verify user with 6 months transaction history views monthly spending trend chart', async ({ page }) => {
    await analyticsPage.navigateToSpendingInsights();
    
    await expect(analyticsPage.monthlyTrendChart).toBeVisible();
    
    const dataPointCount = await analyticsPage.getChartDataPointCount();
    expect(dataPointCount).toBe(6);
    
    const monthlyTotals = await analyticsPage.getMonthlySpendingTotals();
    expect(monthlyTotals.length).toBe(6);
    
    for (const total of monthlyTotals) {
      expect(total.amount).toBeGreaterThan(0);
    }
    
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    const trendVisible = await analyticsPage.verifyTrendLineVisible();
    expect(trendVisible).toBe(true);
  });

  test('QE-10381 TS002 TC-001: Verify drill-down view displays category-wise breakdown for selected month', async ({ page }) => {
    await analyticsPage.navigateToSpendingInsights();
    
    await analyticsPage.clickOnMonthDataPoint('January 2024');
    
    await expect(analyticsPage.drillDownPanel).toBeVisible();
    
    const categoryCount = await analyticsPage.getCategoryBreakdownCount();
    expect(categoryCount).toBe(9);
    
    await expect(analyticsPage.transactionDetailsList).toBeVisible();
    
    const transactions = await analyticsPage.getTransactionDetails();
    for (const txn of transactions) {
      await expect(txn.merchant).toBeVisible();
      await expect(txn.amount).toBeVisible();
      await expect(txn.category).toBeVisible();
    }
    
    const totalMatch = await analyticsPage.verifyDrillDownTotalMatchesChart('January 2024', 1200);
    expect(totalMatch).toBe(true);
  });

  test('QE-10381 TS003 TC-001: Verify empty state message when user has no transaction history', async ({ page }) => {
    await analyticsPage.setUserWithNoTransactions();
    await analyticsPage.navigateToSpendingInsights();
    
    const chartVisible = await analyticsPage.monthlyTrendChart.isVisible().catch(() => false);
    expect(chartVisible).toBe(false);
    
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    await expect(analyticsPage.emptyStateMessage).toHaveText('Insufficient data to generate monthly trends');
    
    const hasErrors = await analyticsPage.checkForRenderingErrors();
    expect(hasErrors).toBe(false);
  });

  test('QE-10377 TS001 TC-001: Verify pie chart displays spending distribution across all 9 categories', async ({ page }) => {
    await analyticsPage.navigateToAnalyticsDashboard();
    
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBe(9);
    
    const categories = await analyticsPage.getAllCategorySegments();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    for (const expectedCategory of expectedCategories) {
      const found = categories.some(cat => cat.name === expectedCategory);
      expect(found).toBe(true);
    }
    
    for (const category of categories) {
      expect(category.percentage).toBeGreaterThanOrEqual(0);
      expect(category.total).toBeGreaterThanOrEqual(0);
      expect(category.color).toBeTruthy();
    }
    
    await analyticsPage.hoverOverPieSegment('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
  });

  test('QE-10377 TS002 TC-001: Verify clicking category segment displays filtered transaction list', async ({ page }) => {
    await analyticsPage.navigateToAnalyticsDashboard();
    
    await analyticsPage.clickOnCategorySegment('Food & Dining');
    
    await expect(analyticsPage.filteredTransactionList).toBeVisible();
    
    const transactions = await analyticsPage.getFilteredTransactions();
    
    for (const txn of transactions) {
      await expect(txn.merchant).toBeVisible();
      await expect(txn.date).toBeVisible();
      await expect(txn.amount).toBeVisible();
      
      const category = await txn.category.textContent();
      expect(category).toBe('Food & Dining');
    }
    
    const allMatch = await analyticsPage.verifyAllTransactionsMatchCategory('Food & Dining');
    expect(allMatch).toBe(true);
  });

  test('QE-10377 TS003 TC-001: Verify analytics dashboard displays zero values when no transactions exist', async ({ page }) => {
    await analyticsPage.setUserWithNoTransactions();
    await analyticsPage.navigateToAnalyticsDashboard();
    
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBe(9);
    
    const categories = await analyticsPage.getAllCategorySegments();
    for (const category of categories) {
      expect(category.percentage).toBe(0);
      expect(category.total).toBe(0);
    }
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    await expect(analyticsPage.noDataMessage).toHaveText('No spending data is available for visualization');
    
    const hasErrors = await analyticsPage.checkForRenderingErrors();
    expect(hasErrors).toBe(false);
  });
});
