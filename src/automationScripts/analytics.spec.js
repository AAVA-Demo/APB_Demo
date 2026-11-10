const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Analytics and Insights Tests', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    loginPage = new LoginPage(page);
    await page.goto('https://creditcard.dashboard.app');
  });

  test('QE-10318 TS-001 TC-001 - Verify full 12-month trend display with interactive graph', async ({ page }) => {
    // Step 1: Login as user with 12 months history
    await loginPage.login('testuser_12months', 'Test@1234');
    
    // Step 2: Navigate to Monthly Trend Analysis
    await analyticsPage.navigateToMonthlyTrends();
    
    // Step 3-4: Verify graph displays all 12 months
    await expect(analyticsPage.trendGraph).toBeVisible();
    const months = await analyticsPage.getDisplayedMonths();
    expect(months.length).toBe(12);
    expect(months).toContain('Jan');
    expect(months).toContain('Dec');
    
    // Step 5: Verify each month displays spending amount
    const monthlyAmounts = await analyticsPage.getMonthlySpendingAmounts();
    expect(monthlyAmounts.every(amt => parseFloat(amt) >= 0)).toBe(true);
    
    // Step 6-7: Verify interactivity with tooltips
    await analyticsPage.hoverOverMonth('Jan');
    await expect(analyticsPage.tooltip).toBeVisible();
    await expect(analyticsPage.tooltip).toContainText(/January 2024/);
    await expect(analyticsPage.tooltip).toMatch(/\$\d+\.\d{2}/);
    
    // Step 8: Verify responsive layout
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await expect(analyticsPage.trendGraph).toBeVisible();
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(analyticsPage.trendGraph).toBeVisible();
  });

  test('QE-10318 TS-002 TC-001 - Verify partial history display for user with limited data', async ({ page }) => {
    // Step 1: Login as user with 3 months history
    await loginPage.login('testuser_3months', 'Test@1234');
    
    // Step 2-3: Navigate and verify graph
    await analyticsPage.navigateToMonthlyTrends();
    await expect(analyticsPage.trendGraph).toBeVisible();
    
    // Step 4-5: Verify only 3 months with data
    const months = await analyticsPage.getDisplayedMonths();
    const monthsWithData = await analyticsPage.getMonthsWithNonZeroData();
    expect(monthsWithData).toContain('Oct');
    expect(monthsWithData).toContain('Nov');
    expect(monthsWithData).toContain('Dec');
    expect(monthsWithData.length).toBe(3);
    
    // Step 6: Verify no errors
    await expect(analyticsPage.errorMessage).not.toBeVisible();
    
    // Step 7: Verify tooltip interactivity for available months
    await analyticsPage.hoverOverMonth('Oct');
    await expect(analyticsPage.tooltip).toBeVisible();
    await expect(analyticsPage.tooltip).toContainText(/October 2024/);
  });

  test('QE-10318 TS-003 TC-001 - Verify card-specific trend filtering', async ({ page }) => {
    // Step 1: Login as multi-card user
    await loginPage.login('testuser_multicard', 'Test@1234');
    
    // Step 2-3: Navigate and note aggregated values
    await analyticsPage.navigateToMonthlyTrends();
    const initialJanAmount = await analyticsPage.getMonthAmount('Jan');
    
    // Step 4-5: Select specific card filter
    await expect(analyticsPage.cardFilter).toBeVisible();
    const availableCards = await analyticsPage.getAvailableCards();
    expect(availableCards).toContain('****1234');
    expect(availableCards).toContain('****5678');
    await analyticsPage.selectCardFilter('****1234');
    
    // Step 6-7: Verify graph updated for selected card
    const filteredJanAmount = await analyticsPage.getMonthAmount('Jan');
    expect(filteredJanAmount).not.toBe(initialJanAmount);
    expect(parseFloat(filteredJanAmount.replace(/[^0-9.]/g, ''))).toBeLessThanOrEqual(parseFloat(initialJanAmount.replace(/[^0-9.]/g, '')));
    
    // Step 8: Switch to another card
    await analyticsPage.selectCardFilter('****5678');
    const secondFilteredAmount = await analyticsPage.getMonthAmount('Jan');
    expect(secondFilteredAmount).not.toBe(filteredJanAmount);
  });

  test('QE-10317 TS-001 TC-001 - Verify category-wise spending visualization with all 9 categories', async ({ page }) => {
    // Step 1: Login as multi-category user
    await loginPage.login('testuser_multicategory', 'Test@1234');
    
    // Step 2: Navigate to Spending Analytics
    await analyticsPage.navigateToSpendingAnalytics();
    
    // Step 3-4: Verify chart displays all 9 categories
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    // Step 5-6: Verify amounts and percentages
    const categoryData = await analyticsPage.getCategoryData();
    categoryData.forEach(cat => {
      expect(cat.amount).toMatch(/\$\d+/);
      expect(cat.percentage).toMatch(/\d+%/);
    });
    
    // Step 7: Verify interactivity
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.tooltip).toBeVisible();
    await expect(analyticsPage.tooltip).toContainText(/Food & Dining/);
    await expect(analyticsPage.tooltip).toMatch(/\$\d+\.\d{2}/);
    await expect(analyticsPage.tooltip).toMatch(/\d+%/);
    
    // Step 8: Verify responsive layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(analyticsPage.categoryChart).toBeVisible();
  });

  test('QE-10317 TS-002 TC-001 - Verify category visualization with limited categories', async ({ page }) => {
    // Step 1: Login as limited-category user
    await loginPage.login('testuser_limitedcategories', 'Test@1234');
    
    // Step 2-3: Navigate and verify chart
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    // Step 4-5: Verify only categories with data displayed
    const categories = await analyticsPage.getDisplayedCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories.length).toBeLessThanOrEqual(3);
    
    // Step 6: Verify percentages add up to 100%
    const categoryData = await analyticsPage.getCategoryData();
    const totalPercentage = categoryData.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0);
    expect(Math.round(totalPercentage)).toBe(100);
    
    // Step 7: Verify chart integrity
    await expect(analyticsPage.errorMessage).not.toBeVisible();
    await expect(analyticsPage.categoryChart).toBeVisible();
  });

  test('QE-10317 TS-003 TC-001 - Verify error handling when service fails', async ({ page }) => {
    // Step 1: Login
    await loginPage.login('testuser', 'Test@1234');
    
    // Step 2: Mock service failure
    await page.route('**/transactions/categorized', route => route.fulfill({ status: 500 }));
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToSpendingAnalytics();
    
    // Step 4-5: Verify error message and no broken charts
    await expect(analyticsPage.errorMessage).toBeVisible();
    await expect(analyticsPage.errorMessage).toContainText(/Analytics temporarily unavailable/);
    await expect(analyticsPage.categoryChart).not.toBeVisible();
    
    // Step 6: Verify UI stability
    await expect(page).not.toHaveURL(/error/);
  });

  test('QE-10317 TS-003 TC-002 - Verify error handling for malformed data', async ({ page }) => {
    // Step 1: Login
    await loginPage.login('testuser', 'Test@1234');
    
    // Step 2: Mock malformed data
    await page.route('**/transactions/categorized', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: 'invalid_format', categories: null })
      });
    });
    
    // Step 3: Navigate to Spending Analytics
    await analyticsPage.navigateToSpendingAnalytics();
    
    // Step 4-5: Verify error handling
    await expect(analyticsPage.errorMessage).toBeVisible();
    await expect(analyticsPage.errorMessage).toContainText(/Unable to load analytics|Data format error/);
    await expect(analyticsPage.categoryChart).not.toBeVisible();
    
    // Step 6: Verify graceful handling
    await expect(page).not.toHaveURL(/error/);
  });
});
