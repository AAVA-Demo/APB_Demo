const { test, expect } = require('@playwright/test');
const { CategoryAnalyticsPage } = require('./pages/categoryAnalytics.page');

test.describe('Category-wise Spending Analytics and Transaction Filtering', () => {

  test('TC-8046: Verify user can successfully view category-wise spending breakdown with valid transaction data across all nine categories', async ({ page }) => {
    const analyticsPage = new CategoryAnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.authenticate('testuser', 'Test@123');
    
    await analyticsPage.navigateToCategoryAnalytics();
    
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categoryCount = await analyticsPage.getCategoryCount();
    expect(categoryCount).toBe(9);
    
    const categories = await analyticsPage.getAllCategoryNames();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toMatch(/₹[0-9,]+\.[0-9]{2}/);
    
    const renderTime = await analyticsPage.measureChartRenderTime();
    expect(renderTime).toBeLessThan(2000);
  });

  test('TC-8047: Verify system displays appropriate message when no transaction data exists for the selected period', async ({ page }) => {
    const analyticsPage = new CategoryAnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.authenticate('testuser_nodata', 'Test@123');
    
    await analyticsPage.navigateToCategoryAnalytics();
    
    await analyticsPage.selectFutureDateRange();
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const message = await analyticsPage.getNoDataMessage();
    expect(message).toContain('No spending data available');
    
    const chartVisible = await analyticsPage.isChartVisible();
    expect(chartVisible).toBe(false);
    
    const brokenElements = await analyticsPage.hasBrokenUIElements();
    expect(brokenElements).toBe(false);
  });

  test('TC-8048: Verify system rejects request with 401 unauthorized error when user navigates with expired authentication token', async ({ page }) => {
    const analyticsPage = new CategoryAnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.authenticate('testuser', 'Test@123');
    
    await analyticsPage.expireAuthToken();
    
    await analyticsPage.navigateToCategoryAnalytics();
    
    await expect(page).toHaveURL(/.*login/);
  });

  test('TC-8058: Verify category filter correctly displays only Food & Dining transactions while maintaining pagination and sort order', async ({ page }) => {
    const analyticsPage = new CategoryAnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.authenticate('testuser', 'Test@123');
    
    await analyticsPage.navigateToCategoryAnalytics();
    
    const initialCount = await analyticsPage.getTransactionCount();
    expect(initialCount).toBe(50);
    
    await analyticsPage.selectCategoryFilter('Food & Dining');
    
    const filteredCount = await analyticsPage.getTransactionCount();
    expect(filteredCount).toBeLessThan(initialCount);
    
    const allCategories = await analyticsPage.getAllTransactionCategories();
    allCategories.forEach(category => {
      expect(category).toBe('Food & Dining');
    });
    
    const paginationVisible = await analyticsPage.isPaginationVisible();
    expect(paginationVisible).toBe(true);
    
    const sortOrder = await analyticsPage.getSortOrder();
    expect(sortOrder).toBe('date-desc');
  });

  test('TC-8059: Verify system sanitizes malicious search queries and prevents SQL injection', async ({ page }) => {
    const analyticsPage = new CategoryAnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.authenticate('testuser', 'Test@123');
    
    await analyticsPage.navigateToCategoryAnalytics();
    
    await analyticsPage.enterSearchQuery("'; DROP TABLE transactions;--");
    await analyticsPage.submitSearch();
    
    const resultCount = await analyticsPage.getTransactionCount();
    expect(resultCount).toBe(0);
    
    const errorMessage = await analyticsPage.getSearchErrorMessage();
    expect(errorMessage).toMatch(/Invalid search query|No transactions found/);
    
    // Verify application remains functional
    await analyticsPage.clearSearch();
    await analyticsPage.refreshPage();
    
    const transactionsVisible = await analyticsPage.areTransactionsVisible();
    expect(transactionsVisible).toBe(true);
  });

  test('TC-8060: Verify multiple simultaneous filters combine using AND logic to display only transactions matching all conditions', async ({ page }) => {
    const analyticsPage = new CategoryAnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.authenticate('testuser', 'Test@123');
    
    await analyticsPage.navigateToCategoryAnalytics();
    
    await analyticsPage.selectCategoryFilter('Travel');
    await analyticsPage.selectDateRangeFilter('Last 3 months');
    await analyticsPage.selectCardFilter('CC001');
    
    await analyticsPage.applyFilters();
    
    const transactions = await analyticsPage.getFilteredTransactions();
    
    transactions.forEach(transaction => {
      expect(transaction.category).toBe('Travel');
      expect(transaction.cardId).toBe('CC001');
      
      const transactionDate = new Date(transaction.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      expect(transactionDate >= threeMonthsAgo).toBe(true);
    });
  });

});
