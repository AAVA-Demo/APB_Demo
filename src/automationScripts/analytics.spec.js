const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Credit Card Dashboard - Spending Analytics and Insights', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  // QE-7636 TS-001 TC-001
  test('TC-013: Verify user with 12 months transaction history can view interactive line graph displaying monthly spending trends', async ({ page }) => {
    await analyticsPage.loginWith12MonthsHistory('user_12_months', 'Test@123');
    await expect(analyticsPage.navigationMenu).toBeVisible();
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.monthlyTrendsVisualization).toBeVisible();
    
    await expect(analyticsPage.lineGraph).toBeVisible();
    
    const dataPointCount = await analyticsPage.getDataPointCount();
    expect(dataPointCount).toBe(12);
    
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBe(12);
    expect(monthLabels[0]).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
    
    const chronologicalOrder = await analyticsPage.verifyChronologicalOrder();
    expect(chronologicalOrder).toBe(true);
    
    const accurateAmounts = await analyticsPage.verifyAccurateSpendingAmounts();
    expect(accurateAmounts).toBe(true);
  });

  // QE-7636 TS-002 TC-001
  test('TC-014: Verify user with no transaction history receives appropriate message when accessing monthly trends', async ({ page }) => {
    await analyticsPage.loginWithNoTransactions('user_no_transactions', 'Test@123');
    await expect(analyticsPage.navigationMenu).toBeVisible();
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.analyticsPage).toBeVisible();
    
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const message = await analyticsPage.insufficientDataMessage.textContent();
    expect(message).toContain('Insufficient data to generate spending trends visualization');
    
    await expect(analyticsPage.lineGraph).not.toBeVisible();
  });

  // QE-7636 TS-003 TC-001
  test('TC-015: Verify user can interact with monthly trends graph by hovering over data points to view detailed spending amounts', async ({ page }) => {
    await expect(analyticsPage.navigationMenu).toBeVisible();
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToMonthlyTrends();
    
    await expect(analyticsPage.lineGraph).toBeVisible();
    
    await analyticsPage.hoverOverDataPoint('January 2024');
    
    await expect(analyticsPage.tooltip).toBeVisible();
    
    const totalSpending = await analyticsPage.getTooltipTotalSpending();
    expect(totalSpending).toMatch(/^\$\d+\.\d{2}$/);
    
    const categoryBreakdown = await analyticsPage.getTooltipCategoryBreakdown();
    expect(categoryBreakdown).toBeTruthy();
    expect(categoryBreakdown).toContain('Food & Dining');
    
    await analyticsPage.moveAwayFromDataPoint();
    await expect(analyticsPage.tooltip).not.toBeVisible();
  });

  // QE-7633 TS-001 TC-001
  test('TC-016: Verify user with transactions across all 9 spending categories can view interactive pie chart with accurate breakdown', async ({ page }) => {
    await analyticsPage.loginWithAllCategories('user_all_categories', 'Test@123');
    await expect(analyticsPage.navigationMenu).toBeVisible();
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToCategoryWiseSpending();
    
    await expect(analyticsPage.pieChart).toBeVisible();
    
    const categories = await analyticsPage.getAllCategorySegments();
    expect(categories.length).toBe(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    const accurateAmounts = await analyticsPage.verifyCategoryAmounts();
    expect(accurateAmounts).toBe(true);
    
    const accuratePercentages = await analyticsPage.verifyCategoryPercentages();
    expect(accuratePercentages).toBe(true);
    
    const isInteractive = await analyticsPage.verifyPieChartInteractivity();
    expect(isInteractive).toBe(true);
  });

  // QE-7633 TS-002 TC-001
  test('TC-017: Verify transactions with invalid category names are automatically categorized as Miscellaneous', async ({ page }) => {
    await analyticsPage.loginWithInvalidCategories('user_invalid_categories', 'Test@123');
    await expect(analyticsPage.navigationMenu).toBeVisible();
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToCategoryWiseSpending();
    
    await expect(analyticsPage.pieChart).toBeVisible();
    
    const allTransactionsVisible = await analyticsPage.verifyAllTransactionsVisible();
    expect(allTransactionsVisible).toBe(true);
    
    const invalidCategorizedAsMisc = await analyticsPage.verifyInvalidCategoriesInMiscellaneous();
    expect(invalidCategorizedAsMisc).toBe(true);
    
    const miscAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscAmount).toBeTruthy();
    
    const miscIncludesInvalid = await analyticsPage.verifyMiscellaneousIncludesInvalidTransactions();
    expect(miscIncludesInvalid).toBe(true);
  });

  // QE-7633 TS-003 TC-001
  test('TC-018: Verify user with transactions in only 3 categories can view category-wise breakdown chart with correct totals and percentages', async ({ page }) => {
    await analyticsPage.loginWithThreeCategories('user_three_categories', 'Test@123');
    await expect(analyticsPage.navigationMenu).toBeVisible();
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.navigateToCategoryWiseSpending();
    
    await expect(analyticsPage.pieChart).toBeVisible();
    
    const categories = await analyticsPage.getAllCategorySegments();
    expect(categories.length).toBe(3);
    
    const accurateAmounts = await analyticsPage.verifyCategoryAmounts();
    expect(accurateAmounts).toBe(true);
    
    const percentageSum = await analyticsPage.sumAllPercentages();
    expect(percentageSum).toBeCloseTo(100.0, 1);
    
    const noEmptyCategories = await analyticsPage.verifyNoEmptyCategories();
    expect(noEmptyCategories).toBe(true);
  });
});