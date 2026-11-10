const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Analytics Tests - QE-10337, QE-10340', () => {
  let loginPage;
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-10337 TS-001 TC-001: Verify category-wise spending visualization with 9 categories and 2 decimal precision', async ({ page }) => {
    await loginPage.login('testuser_allcategories', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickCategoryWiseSpending();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const categories = await analyticsPage.getAllCategories();
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    expect(categories.length).toBe(9);
    expectedCategories.forEach(cat => {
      expect(categories).toContain(cat);
    });
    
    const categoryAmounts = await analyticsPage.getCategoryAmounts();
    categoryAmounts.forEach(amount => {
      expect(amount).toMatch(/₹[\d,]+\.\d{2}/);
    });
    
    const percentages = await analyticsPage.getCategoryPercentages();
    percentages.forEach(pct => {
      expect(pct).toMatch(/\d+\.\d{2}%/);
    });
    
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBe(true);
  });

  test('QE-10337 TS-002 TC-001: Verify invalid categories mapped to Miscellaneous with logging', async ({ page }) => {
    await loginPage.login('testuser_invalidcategories', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickCategoryWiseSpending();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    expect(miscellaneousAmount).toMatch(/₹[\d,]+\.\d{2}/);
    
    const miscValue = parseFloat(miscellaneousAmount.replace(/[₹,]/g, ''));
    expect(miscValue).toBeGreaterThan(0);
  });

  test('QE-10337 TS-003 TC-001: Verify empty state message for zero transactions in selected period', async ({ page }) => {
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.setDateRange('2020-01-01', '2020-01-31');
    await analyticsPage.clickApplyFilters();
    
    await analyticsPage.clickCategoryWiseSpending();
    
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    const messageText = await analyticsPage.getEmptyStateMessageText();
    expect(messageText).toContain('No spending data available for the selected period');
    expect(messageText).toContain('Please adjust date range or check back after transactions are recorded');
    
    await expect(analyticsPage.dateRangeSelector).toBeVisible();
  });

  test('QE-10340 TS-001 TC-001: Verify monthly spend trend analysis for 12 months within 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    await loginPage.login('testuser_12months', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickViewTrends();
    await analyticsPage.waitForTrendsLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
    
    await expect(analyticsPage.trendsGraph).toBeVisible();
    
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBe(12);
    
    const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      const monthName = month.split(' ')[0];
      expect(expectedMonths).toContain(monthName);
    });
    
    const spendAmounts = await analyticsPage.getMonthlySpendAmounts();
    spendAmounts.forEach(amount => {
      expect(amount).toMatch(/₹[\d,]+\.\d{2}/);
    });
    
    const trendIndicators = await analyticsPage.getTrendIndicators();
    expect(trendIndicators.length).toBeGreaterThan(0);
  });

  test('QE-10340 TS-002 TC-001: Verify system limits display to 12 months for 24 months data', async ({ page }) => {
    await loginPage.login('testuser_24months', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickViewTrends();
    await analyticsPage.waitForTrendsLoad();
    
    const months = await analyticsPage.getTrendMonths();
    expect(months.length).toBe(12);
    
    const firstMonth = months[0];
    expect(firstMonth).toContain('2024');
    
    await expect(analyticsPage.viewOlderDataOption).toBeVisible();
    
    const processingTime = await analyticsPage.getProcessingTime();
    expect(processingTime).toBeLessThan(5000);
  });

  test('QE-10340 TS-003 TC-001: Verify graceful error handling for analytics engine failure', async ({ page }) => {
    await page.route('**/api/transactions', route => route.abort());
    
    await loginPage.login('testuser', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForAnalyticsLoad();
    
    await analyticsPage.clickViewTrends();
    
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.getErrorMessageText();
    expect(errorText).toContain('Monthly spend trend analysis could not be completed');
    expect(errorText).toContain('Please try again or contact support');
    
    await expect(analyticsPage.retryButton).toBeVisible();
    await expect(analyticsPage.contactSupportButton).toBeVisible();
  });
});