const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Spending Analytics and Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('TC-7136: Verify monthly spending trends chart displays correctly for user with 3+ months of transaction history', async ({ page }) => {
    // Step 1-2: Login with valid credentials and navigate to Analytics
    await loginPage.login('testuser_history', 'Test@123');
    await analyticsPage.navigate();
    
    // Step 3: Click on 'Monthly Trends' tab
    await analyticsPage.clickMonthlyTrendsTab();
    
    // Step 4: Record chart rendering time and verify it renders within 1 second
    const startTime = Date.now();
    await analyticsPage.waitForMonthlyTrendsChartLoad();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1000);
    
    // Verify interactive line chart is displayed
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    // Step 5: Verify chart displays data points for last 12 months
    const dataPointsCount = await analyticsPage.getMonthlyTrendsDataPointsCount();
    expect(dataPointsCount).toBe(12);
    
    const monthLabels = await analyticsPage.getMonthlyTrendsLabels();
    expect(monthLabels.length).toBe(12);
    
    // Step 6: Verify chart is interactive
    const isInteractive = await analyticsPage.verifyChartInteractivity();
    expect(isInteractive).toBeTruthy();
    
    // Step 7: Verify axes are properly labeled
    const xAxisLabel = await analyticsPage.getChartXAxisLabel();
    const yAxisLabel = await analyticsPage.getChartYAxisLabel();
    expect(xAxisLabel).toMatch(/Month/i);
    expect(yAxisLabel).toMatch(/Total Spend|\$/i);
  });

  test('TC-7138: Verify appropriate message is displayed when user has less than 3 months of transaction history', async ({ page }) => {
    // Mock API to return only 2 months of data
    await page.route('**/api/analytics/trends*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { month: 'Jan 2024', totalSpend: 1500 },
          { month: 'Feb 2024', totalSpend: 1800 }
        ])
      });
    });
    
    // Step 1-2: Login and navigate to Analytics
    await loginPage.login('newuser_2months', 'Test@123');
    await analyticsPage.navigate();
    await analyticsPage.clickMonthlyTrendsTab();
    
    // Step 3: Verify informational message is displayed
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toMatch(/Insufficient data|At least 3 months/i);
    
    // Step 4-5: Verify available months are still displayed in chart
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const dataPointsCount = await analyticsPage.getMonthlyTrendsDataPointsCount();
    expect(dataPointsCount).toBe(2);
  });

  test('TC-7140: Verify error message is displayed when Analytics Engine service is unavailable', async ({ page }) => {
    // Mock API to return 503 error
    await page.route('**/api/analytics/trends*', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Service Unavailable' })
      });
    });
    
    // Step 1-2: Login and navigate to Analytics
    await loginPage.login('testuser', 'Test@123');
    await analyticsPage.navigate();
    
    // Step 3: Access Monthly Spend Trends section
    await analyticsPage.clickMonthlyTrendsTab();
    
    // Step 4: Verify error message is displayed
    await analyticsPage.waitForErrorMessage();
    await expect(analyticsPage.errorMessage).toBeVisible();
    
    const errorText = await analyticsPage.getErrorMessageText();
    expect(errorText).toMatch(/Failed to load monthly trends|Analytics service unavailable/i);
    
    // Step 5: Verify chart area is empty or shows error state
    const chartVisible = await analyticsPage.monthlyTrendsChart.isVisible();
    expect(chartVisible).toBeFalsy();
  });

  test('TC-7142: Verify category-wise spending breakdown displays correctly for user with transactions across multiple categories', async ({ page }) => {
    // Step 1-2: Login and navigate to Analytics
    await loginPage.login('testuser_categories', 'Test@123');
    await analyticsPage.navigate();
    
    // Step 3: Click on 'Category Breakdown' tab
    await analyticsPage.clickCategoryBreakdownTab();
    
    // Step 4: Record chart rendering time and verify it renders within 1 second
    const startTime = Date.now();
    await analyticsPage.waitForCategoryBreakdownChartLoad();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1000);
    
    // Verify visual breakdown is displayed
    await expect(analyticsPage.categoryBreakdownChart).toBeVisible();
    
    // Step 5: Verify all nine predefined categories are displayed
    const categories = await analyticsPage.getCategoryLabels();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });
    
    // Step 6: Verify spending amounts and percentages are displayed
    const categoryData = await analyticsPage.getCategoryBreakdownData();
    expect(categoryData.length).toBeGreaterThan(0);
    
    categoryData.forEach(item => {
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('amount');
      expect(item).toHaveProperty('percentage');
    });
    
    // Step 7: Verify categories with zero spending display $0.00 or 0%
    const zeroCategoriesExist = categoryData.some(item => item.amount === 0);
    if (zeroCategoriesExist) {
      const zeroCategory = categoryData.find(item => item.amount === 0);
      expect(zeroCategory.percentage).toBe(0);
    }
    
    // Step 8: Verify chart is interactive
    const isInteractive = await analyticsPage.verifyCategoryChartInteractivity();
    expect(isInteractive).toBeTruthy();
  });

  test('TC-7144: Verify category breakdown displays correctly when user has transactions in only 3 out of 9 categories', async ({ page }) => {
    // Mock API to return data for only 3 categories
    await page.route('**/api/analytics/categories*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { category: 'Food & Dining', amount: 1500, percentage: 50 },
          { category: 'Fuel', amount: 900, percentage: 30 },
          { category: 'Shopping', amount: 600, percentage: 20 },
          { category: 'Travel', amount: 0, percentage: 0 },
          { category: 'Entertainment', amount: 0, percentage: 0 },
          { category: 'Utilities', amount: 0, percentage: 0 },
          { category: 'Healthcare', amount: 0, percentage: 0 },
          { category: 'Education', amount: 0, percentage: 0 },
          { category: 'Miscellaneous', amount: 0, percentage: 0 }
        ])
      });
    });
    
    // Step 1-2: Login and navigate to Analytics
    await loginPage.login('testuser_limitedcategories', 'Test@123');
    await analyticsPage.navigate();
    await analyticsPage.clickCategoryBreakdownTab();
    await analyticsPage.waitForCategoryBreakdownChartLoad();
    
    // Step 3: Verify visual breakdown displays spending for 3 active categories
    const categoryData = await analyticsPage.getCategoryBreakdownData();
    const activeCategories = categoryData.filter(item => item.amount > 0);
    expect(activeCategories.length).toBe(3);
    
    expect(activeCategories.some(item => item.category === 'Food & Dining')).toBeTruthy();
    expect(activeCategories.some(item => item.category === 'Fuel')).toBeTruthy();
    expect(activeCategories.some(item => item.category === 'Shopping')).toBeTruthy();
    
    // Step 4: Verify remaining 6 categories display zero values
    const inactiveCategories = categoryData.filter(item => item.amount === 0);
    expect(inactiveCategories.length).toBe(6);
    
    // Step 5: Verify chart renders correctly with partial data
    await expect(analyticsPage.categoryBreakdownChart).toBeVisible();
    
    // Step 6: Verify percentages sum to 100%
    const totalPercentage = activeCategories.reduce((sum, item) => sum + item.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 0);
  });

  test('TC-7146: Verify error message is displayed when transaction categorization data is missing or corrupted', async ({ page }) => {
    // Mock API to return corrupted data
    await page.route('**/api/analytics/categories*', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Bad Request - Corrupted Data' })
      });
    });
    
    // Step 1-2: Login and navigate to Analytics
    await loginPage.login('testuser', 'Test@123');
    await analyticsPage.navigate();
    
    // Step 3: Access Category-wise Spending section
    await analyticsPage.clickCategoryBreakdownTab();
    
    // Step 4: Verify error message is displayed
    await analyticsPage.waitForErrorMessage();
    await expect(analyticsPage.errorMessage).toBeVisible();
    
    const errorText = await analyticsPage.getErrorMessageText();
    expect(errorText).toMatch(/Failed to load category breakdown|Category data cannot be processed/i);
    
    // Step 5: Verify chart area is empty or shows error state
    const chartVisible = await analyticsPage.categoryBreakdownChart.isVisible();
    expect(chartVisible).toBeFalsy();
  });
});