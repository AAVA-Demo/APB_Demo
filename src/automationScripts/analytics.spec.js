const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

// Test cases for QE-9654 - Category-Wise Spending Visualization
test.describe('Category-Wise Spending Visualization', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9799 TS-001 TC-001 - Verify user can view interactive category-wise spending chart within 3 seconds', async ({ page }) => {
    await loginPage.login('user_multicategory@test.com', 'SecurePass123!');
    await analyticsPage.navigateToAnalytics();
    
    const startTime = Date.now();
    await analyticsPage.waitForCategoryChartToLoad();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    for (const category of categories) {
      const categoryElement = await analyticsPage.getCategoryElement(category);
      await expect(categoryElement).toBeVisible();
    }
    
    // Verify chart is interactive
    await analyticsPage.hoverOverCategory('Food & Dining');
    const tooltip = await analyticsPage.getTooltip();
    await expect(tooltip).toBeVisible();
  });

  test('QE-9799 TS-001 TC-002 - Verify category-wise spending chart displays correct amounts for each category', async ({ page }) => {
    await loginPage.login('user_known_amounts@test.com', 'SecurePass123!');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartToLoad();
    
    const expectedAmounts = {
      'Food & Dining': 450,
      'Fuel': 200,
      'Shopping': 800,
      'Travel': 1200,
      'Entertainment': 150,
      'Utilities': 300,
      'Healthcare': 250,
      'Education': 500,
      'Miscellaneous': 100
    };
    
    for (const [category, expectedAmount] of Object.entries(expectedAmounts)) {
      const actualAmount = await analyticsPage.getCategoryAmount(category);
      expect(actualAmount).toBe(expectedAmount);
    }
    
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBe(3950);
  });

  test('QE-9799 TS-001 TC-003 - Verify category-wise spending chart excludes categories with zero spending', async ({ page }) => {
    await loginPage.login('user_partial_categories@test.com', 'SecurePass123!');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartToLoad();
    
    const visibleCategories = await analyticsPage.getVisibleCategories();
    expect(visibleCategories.length).toBe(5);
    
    const expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Entertainment', 'Utilities'];
    for (const category of expectedCategories) {
      expect(visibleCategories).toContain(category);
    }
  });

  test('QE-9799 TS-002 TC-001 - Verify timeout error is displayed when category-wise chart fails to render within 3 seconds', async ({ page }) => {
    await page.route('**/api/analytics/categories', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await analyticsPage.navigateToAnalytics();
    
    await page.waitForTimeout(3000);
    
    const errorMessage = await analyticsPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load spending analytics chart');
  });

  test('QE-9799 TS-002 TC-002 - Verify incomplete visualization is not displayed when chart rendering times out', async ({ page }) => {
    await page.route('**/api/analytics/categories', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await analyticsPage.navigateToAnalytics();
    
    await page.waitForTimeout(3000);
    
    const chartVisible = await analyticsPage.isCategoryChartVisible();
    expect(chartVisible).toBe(false);
    
    const errorMessage = await analyticsPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
  });

  test('QE-9799 TS-002 TC-003 - Verify user can retry loading the category-wise chart after timeout error', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/analytics/categories', route => {
      requestCount++;
      if (requestCount === 1) {
        setTimeout(() => route.continue(), 5000);
      } else {
        route.continue();
      }
    });
    
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await analyticsPage.navigateToAnalytics();
    
    await page.waitForTimeout(3000);
    await analyticsPage.clickRetryButton();
    
    await analyticsPage.waitForCategoryChartToLoad();
    const chartVisible = await analyticsPage.isCategoryChartVisible();
    expect(chartVisible).toBe(true);
  });

  test('QE-9799 TS-003 TC-001 - Verify error is detected when a fuel transaction is incorrectly categorized', async ({ page }) => {
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    
    // Create test transaction
    await page.evaluate(() => {
      window.createTransaction({
        merchant: 'Shell Gas Station',
        amount: 50,
        category: 'Fuel'
      });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartToLoad();
    
    const fuelAmount = await analyticsPage.getCategoryAmount('Fuel');
    const foodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    
    expect(fuelAmount).toBe(50);
    expect(foodAmount).not.toContain(50);
  });

  test('QE-9799 TS-003 TC-002 - Verify category totals are accurate when multiple transactions are correctly categorized', async ({ page }) => {
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    
    await page.evaluate(() => {
      window.createTransaction({ merchant: 'Shell', amount: 50, category: 'Fuel' });
      window.createTransaction({ merchant: 'Restaurant', amount: 30, category: 'Food & Dining' });
      window.createTransaction({ merchant: 'Mall', amount: 100, category: 'Shopping' });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartToLoad();
    
    const fuelAmount = await analyticsPage.getCategoryAmount('Fuel');
    const foodAmount = await analyticsPage.getCategoryAmount('Food & Dining');
    const shoppingAmount = await analyticsPage.getCategoryAmount('Shopping');
    
    expect(fuelAmount).toBe(50);
    expect(foodAmount).toBe(30);
    expect(shoppingAmount).toBe(100);
    
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBe(180);
  });

  test('QE-9799 TS-003 TC-003 - Verify misleading spending insights are prevented when transactions are correctly categorized', async ({ page }) => {
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    
    await page.evaluate(() => {
      window.createTransaction({ merchant: 'Shell Gas Station', amount: 50, category: 'Fuel' });
    });
    
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.waitForCategoryChartToLoad();
    
    const fuelAmount = await analyticsPage.getCategoryAmount('Fuel');
    expect(fuelAmount).toBe(50);
    
    const topCategory = await analyticsPage.getTopSpendingCategory();
    expect(topCategory).toBe('Fuel');
  });
});

// Test cases for QE-9656 - Monthly Spending Trend Analysis
test.describe('Monthly Spending Trend Analysis', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
    await loginPage.navigate();
  });

  test('QE-9800 TS-001 TC-001 - Verify user with 12+ months of transaction history can view interactive monthly trend graph on desktop', async ({ page }) => {
    await loginPage.login('user_12months@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartToLoad();
    
    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBe(12);
    
    // Verify x-axis shows month labels
    const monthLabels = await analyticsPage.getMonthLabels();
    expect(monthLabels.length).toBe(12);
    
    // Verify chart is interactive
    await analyticsPage.hoverOverDataPoint(0);
    const tooltip = await analyticsPage.getTooltip();
    await expect(tooltip).toBeVisible();
  });

  test('QE-9800 TS-001 TC-002 - Verify monthly spending trend graph is responsive on tablet device', async ({ page, context }) => {
    await context.setViewportSize({ width: 1024, height: 768 });
    
    await loginPage.login('user_12months@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartToLoad();
    
    const chartVisible = await analyticsPage.isTrendChartVisible();
    expect(chartVisible).toBe(true);
    
    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBe(12);
  });

  test('QE-9800 TS-001 TC-003 - Verify monthly spending trend graph is responsive on mobile device', async ({ page, context }) => {
    await context.setViewportSize({ width: 375, height: 667 });
    
    await loginPage.login('user_12months@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    await analyticsPage.waitForTrendChartToLoad();
    
    const chartVisible = await analyticsPage.isTrendChartVisible();
    expect(chartVisible).toBe(true);
    
    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBe(12);
  });

  test('QE-9800 TS-002 TC-001 - Verify user with less than 12 months receives appropriate notification', async ({ page }) => {
    await loginPage.login('newuser_6months@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    
    const notificationMessage = await analyticsPage.getNotificationMessage();
    expect(notificationMessage).toContain('Insufficient historical data available');
    
    const chartVisible = await analyticsPage.isTrendChartVisible();
    expect(chartVisible).toBe(false);
  });

  test('QE-9800 TS-002 TC-002 - Verify user with exactly 11 months cannot generate 12-month trend graph', async ({ page }) => {
    await loginPage.login('user_11months@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    
    const notificationMessage = await analyticsPage.getNotificationMessage();
    expect(notificationMessage).toContain('at least 12 months required');
    
    const chartVisible = await analyticsPage.isTrendChartVisible();
    expect(chartVisible).toBe(false);
  });

  test('QE-9800 TS-002 TC-003 - Verify new user with zero transaction history receives appropriate notification', async ({ page }) => {
    await loginPage.login('newuser_notxn@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    
    const notificationMessage = await analyticsPage.getNotificationMessage();
    expect(notificationMessage).toContain('No transaction history available');
  });

  test('QE-9800 TS-003 TC-001 - Verify timeout error when monthly trend graph fails to render within 3 seconds', async ({ page }) => {
    await page.route('**/api/analytics/trends', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    await loginPage.login('poweruser_largedata@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    
    await page.waitForTimeout(3000);
    
    const errorMessage = await analyticsPage.getErrorMessage();
    expect(errorMessage).toContain('Unable to load monthly trend graph');
  });

  test('QE-9800 TS-003 TC-002 - Verify loading spinner does not resolve indefinitely when analytics processing is slow', async ({ page }) => {
    await page.route('**/api/analytics/trends', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    
    const loadingSpinner = await analyticsPage.getLoadingSpinner();
    await expect(loadingSpinner).toBeVisible();
    
    await page.waitForTimeout(3000);
    
    await expect(loadingSpinner).not.toBeVisible();
    const errorMessage = await analyticsPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
  });

  test('QE-9800 TS-003 TC-003 - Verify user can retry loading the monthly trend graph after timeout error', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/analytics/trends', route => {
      requestCount++;
      if (requestCount === 1) {
        setTimeout(() => route.continue(), 5000);
      } else {
        route.continue();
      }
    });
    
    await loginPage.login('testuser@test.com', 'SecurePass123!');
    await analyticsPage.navigateToMonthlyTrends();
    
    await page.waitForTimeout(3000);
    await analyticsPage.clickRetryButton();
    
    await analyticsPage.waitForTrendChartToLoad();
    const dataPoints = await analyticsPage.getTrendChartDataPoints();
    expect(dataPoints.length).toBe(12);
  });
});