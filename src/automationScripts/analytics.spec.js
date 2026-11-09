const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Analytics Dashboard Tests', () => {

  test('QE-8863 TS-001 TC-001 - Verify user with 12 months of transaction history can view accurate monthly spending trends', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Launch application
    await analyticsPage.navigate();
    
    // Step 2: Login with 12 months history user
    await analyticsPage.login('testuser_12months', 'Test@123');
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Verify monthly spending trends chart
    await analyticsPage.verifyMonthlyTrendsChartVisible();
    await analyticsPage.verifyChartMonthCount(12);
    
    // Step 5: Verify spending amounts
    await analyticsPage.verifyMonthlySpending('Jan', 1250);
    await analyticsPage.verifyMonthlySpending('Feb', 980.50);
    await analyticsPage.verifyMonthlySpending('Mar', 1100);
    
    // Step 6: Click on specific month to drill down
    await analyticsPage.drillDownToMonth('March 2024');
    
    // Step 7: Verify transaction details
    await analyticsPage.verifyTransactionDetailsVisible();
    const transactionCount = await analyticsPage.getTransactionCount();
    expect(transactionCount).toBeGreaterThanOrEqual(15);
    expect(transactionCount).toBeLessThanOrEqual(20);
    
    // Step 8: Close drill-down and return to main chart
    await analyticsPage.closeDrillDown();
    await analyticsPage.verifyMonthlyTrendsChartVisible();
  });

  test('QE-8863 TS-002 TC-001 - Verify system handles user with only 2 months of transaction history', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Launch application
    await analyticsPage.navigate();
    
    // Step 2: Login with 2 months history user
    await analyticsPage.login('testuser_2months', 'Test@123');
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Verify chart displays available data
    await analyticsPage.verifyChartMonthCount(2);
    
    // Step 5: Verify informational message
    await analyticsPage.verifyInfoMessage('Insufficient data for full 12-month trend analysis. Showing available data for 2 months.');
    
    // Step 6: Verify chart renders correctly
    await analyticsPage.verifyMonthlySpending('Nov 2024', 500);
    await analyticsPage.verifyMonthlySpending('Dec 2024', 750);
    
    // Step 7: Verify drill-down works for available months
    await analyticsPage.drillDownToMonth('Dec 2024');
    await analyticsPage.verifyTransactionDetailsVisible();
  });

  test('QE-8863 TS-003 TC-001 - Verify system handles drill-down when historical data service is unavailable', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Launch application
    await analyticsPage.navigate();
    
    // Step 2: Login
    await analyticsPage.login('testuser', 'Test@123');
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Simulate service unavailability
    await page.route('**/api/transactions/history**', route => route.abort());
    
    // Step 5: Attempt drill-down
    await analyticsPage.drillDownToMonth('June 2024');
    
    // Step 6: Verify error message
    await analyticsPage.verifyErrorMessage('Unable to retrieve detailed transaction data. Service temporarily unavailable. Please try again later.');
    
    // Step 7: Verify main chart remains visible
    await analyticsPage.verifyMonthlyTrendsChartVisible();
    
    // Step 8: Verify dashboard remains responsive
    await expect(page).not.toHaveTitle(/Error/);
  });

  test('QE-8859 TS-001 TC-001 - Verify user can view accurate category-wise spending breakdown', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Launch application
    await analyticsPage.navigate();
    
    // Step 2: Login with all categories user
    await analyticsPage.login('testuser_allcategories', 'Test@123');
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Select category-wise spending view
    await analyticsPage.selectCategoryWiseView();
    
    // Step 5: Verify all nine categories displayed
    await analyticsPage.verifyCategoryCount(9);
    
    // Step 6: Verify spending amounts for each category
    await analyticsPage.verifyCategorySpending('Food & Dining', 1200);
    await analyticsPage.verifyCategorySpending('Fuel', 300);
    await analyticsPage.verifyCategorySpending('Shopping', 800);
    await analyticsPage.verifyCategorySpending('Travel', 1500);
    await analyticsPage.verifyCategorySpending('Entertainment', 400);
    await analyticsPage.verifyCategorySpending('Utilities', 250);
    await analyticsPage.verifyCategorySpending('Healthcare', 600);
    await analyticsPage.verifyCategorySpending('Education', 500);
    await analyticsPage.verifyCategorySpending('Miscellaneous', 200);
    
    // Step 7: Verify interactive visualization
    await analyticsPage.verifyChartInteractive();
    
    // Step 8: Verify filtering options
    await analyticsPage.verifyFilterOptionsVisible();
    
    // Step 9: Verify percentage breakdown
    await analyticsPage.verifyCategoryPercentage('Travel', 26.1);
    await analyticsPage.verifyCategoryPercentage('Food & Dining', 20.9);
  });

  test('QE-8859 TS-002 TC-001 - Verify system handles transactions with missing or invalid categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Launch application
    await analyticsPage.navigate();
    
    // Step 2: Login with uncategorized user
    await analyticsPage.login('testuser_uncategorized', 'Test@123');
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Select category-wise spending view
    await analyticsPage.selectCategoryWiseView();
    
    // Step 5: Verify Miscellaneous includes uncategorized
    await analyticsPage.verifyCategorySpending('Miscellaneous', 800);
    
    // Step 6: Verify categorization note
    await analyticsPage.verifyCategorizationNote('Some transactions were uncategorized and have been included in Miscellaneous.');
    
    // Step 7: Verify no data loss
    await analyticsPage.verifyTotalSpendingMatches();
    
    // Step 8: Drill down into Miscellaneous
    await analyticsPage.drillDownToCategory('Miscellaneous');
    await analyticsPage.verifyMixedTransactions();
  });

  test('QE-8859 TS-003 TC-001 - Verify user can apply category filter', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Launch application
    await analyticsPage.navigate();
    
    // Step 2: Login
    await analyticsPage.login('testuser', 'Test@123');
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToAnalytics();
    
    // Step 4: Select category-wise spending view
    await analyticsPage.selectCategoryWiseView();
    
    // Step 5: Note total spending before filter
    const totalBefore = await analyticsPage.getTotalSpending();
    expect(totalBefore).toBe(5750);
    
    // Step 6: Apply filter for specific categories
    await analyticsPage.applyFilter(['Food & Dining', 'Travel', 'Entertainment']);
    
    // Step 7: Verify filter applied
    await analyticsPage.verifyCategoryCount(3);
    
    // Step 8: Verify only selected categories displayed
    await analyticsPage.verifyCategorySpending('Food & Dining', 1200);
    await analyticsPage.verifyCategorySpending('Travel', 1500);
    await analyticsPage.verifyCategorySpending('Entertainment', 400);
    
    // Step 9: Verify total updated
    const totalAfter = await analyticsPage.getTotalSpending();
    expect(totalAfter).toBe(3100);
    
    // Step 10: Verify percentages recalculated
    await analyticsPage.verifyCategoryPercentage('Food & Dining', 38.7);
    await analyticsPage.verifyCategoryPercentage('Travel', 48.4);
    await analyticsPage.verifyCategoryPercentage('Entertainment', 12.9);
    
    // Step 11: Clear filter
    await analyticsPage.clearFilter();
    await analyticsPage.verifyCategoryCount(9);
    const totalRestored = await analyticsPage.getTotalSpending();
    expect(totalRestored).toBe(5750);
  });

});
