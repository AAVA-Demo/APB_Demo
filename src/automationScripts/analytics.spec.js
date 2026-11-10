const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Analytics and Spending Insights', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigateToApp();
  });

  test('TC-6699: Verify category-wise spending breakdown with accurate aggregation', async ({ page }) => {
    await loginPage.login('testuser_multicategory', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseSpending();
    await analyticsPage.waitForCategoryViewLoad();
    
    await expect(analyticsPage.categoryBreakdownContainer).toBeVisible();
    
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of categories) {
      await analyticsPage.verifyCategoryDisplayed(category);
    }
    
    await analyticsPage.verifyTotalPercentageSum(100);
    await analyticsPage.verifyCategoryAmount('Food & Dining', 1200);
    await analyticsPage.verifyCategoryPercentage('Food & Dining', 30);
  });

  test('TC-6700: Verify appropriate message when no transaction data exists', async ({ page }) => {
    await loginPage.login('testuser_notransactions', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseSpending();
    await analyticsPage.waitForCategoryViewLoad();
    
    await expect(analyticsPage.noDataMessage).toBeVisible();
    await expect(analyticsPage.noDataMessage).toContainText('No spending data available for the selected period');
    
    await expect(analyticsPage.emptyChart).not.toBeVisible();
    await expect(analyticsPage.zeroValueWithoutContext).not.toBeVisible();
  });

  test('TC-6701: Verify partial category data displays correctly', async ({ page }) => {
    await loginPage.login('testuser_partialcategory', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategoryWiseSpending();
    await analyticsPage.waitForCategoryViewLoad();
    
    await expect(analyticsPage.categoryBreakdownContainer).toBeVisible();
    
    await analyticsPage.verifyCategoryDisplayed('Food & Dining');
    await analyticsPage.verifyCategoryAmount('Food & Dining', 1200);
    
    await analyticsPage.verifyCategoryDisplayed('Fuel');
    await analyticsPage.verifyCategoryAmount('Fuel', 800);
    
    await analyticsPage.verifyCategoryDisplayed('Shopping');
    await analyticsPage.verifyCategoryAmount('Shopping', 2000);
    
    const inactiveCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of inactiveCategories) {
      const isZeroOrOmitted = await analyticsPage.isCategoryZeroOrOmitted(category);
      expect(isZeroOrOmitted).toBe(true);
    }
  });

  test('TC-6711: Verify monthly spend trend visualization for 12 months', async ({ page }) => {
    await loginPage.login('testuser_12months', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlySpendTrends();
    await analyticsPage.waitForTrendsViewLoad();
    
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    const dataPointCount = await analyticsPage.getChartDataPointCount();
    expect(dataPointCount).toBe(12);
    
    await analyticsPage.verifyChartHasProperLabels();
    await analyticsPage.verifyMonthlyTotal('Jan', 5000);
    await analyticsPage.verifyMonthlyTotal('Feb', 6000);
    
    const isInteractive = await analyticsPage.verifyChartInteractivity();
    expect(isInteractive).toBe(true);
  });

  test('TC-6712: Verify appropriate message when no historical transaction data exists', async ({ page }) => {
    await loginPage.login('testuser_newuser', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlySpendTrends();
    await analyticsPage.waitForTrendsViewLoad();
    
    await expect(analyticsPage.noHistoricalDataMessage).toBeVisible();
    await expect(analyticsPage.noHistoricalDataMessage).toContainText('No spending data available for the last 12 months');
    
    await expect(analyticsPage.emptyChart).not.toBeVisible();
    await expect(analyticsPage.brokenChart).not.toBeVisible();
  });

  test('TC-6713: Verify partial historical data displays correctly in trend chart', async ({ page }) => {
    await loginPage.login('testuser_6months', 'Test@1234');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectMonthlySpendTrends();
    await analyticsPage.waitForTrendsViewLoad();
    
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    await analyticsPage.verifyMonthlyTotal('Jan', 5000);
    await analyticsPage.verifyMonthlyTotal('Mar', 6000);
    await analyticsPage.verifyMonthlyTotal('May', 5500);
    await analyticsPage.verifyMonthlyTotal('Jul', 7000);
    await analyticsPage.verifyMonthlyTotal('Sep', 6500);
    await analyticsPage.verifyMonthlyTotal('Nov', 8000);
    
    const monthsWithZero = ['Feb', 'Apr', 'Jun', 'Aug', 'Oct', 'Dec'];
    for (const month of monthsWithZero) {
      const isZeroOrOmitted = await analyticsPage.isMonthZeroOrOmitted(month);
      expect(isZeroOrOmitted).toBe(true);
    }
    
    const trendAccuracy = await analyticsPage.verifyTrendVisualizationAccuracy();
    expect(trendAccuracy).toBe(true);
  });
});
