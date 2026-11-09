const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Spending Analytics and Category Insights', () => {

  test('QE-9057 TS-001 TC-001 - Verify user views interactive monthly spending trend graph with drill-down', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, login, and navigate to analytics
    await analyticsPage.navigate();
    await analyticsPage.login('multimonth@example.com', 'Pass@123');
    await analyticsPage.goToAnalytics();
    
    // Step 4: Verify monthly trend graph is displayed
    await expect(analyticsPage.monthlyTrendGraph).toBeVisible();
    
    // Step 5: Verify data points for each month
    const dataPoints = await analyticsPage.getMonthlyDataPoints();
    expect(dataPoints.length).toBeGreaterThanOrEqual(3);
    
    // Step 6: Hover over data point and verify tooltip
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.tooltip).toBeVisible();
    const tooltipText = await analyticsPage.tooltip.textContent();
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    
    // Step 7: Verify spending amounts are accurate
    for (const point of dataPoints) {
      const amount = await point.getAttribute('data-amount');
      expect(parseFloat(amount)).toBeGreaterThan(0);
    }
    
    // Step 8: Click data point to drill down
    await analyticsPage.clickDataPoint(0);
    await expect(analyticsPage.drillDownView).toBeVisible();
    const drillDownTransactions = await analyticsPage.getDrillDownTransactions();
    expect(drillDownTransactions.length).toBeGreaterThan(0);
  });

  test('QE-9057 TS-002 TC-001 - Verify insufficient data message when user has less than 2 months history', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, login with new user, navigate
    await analyticsPage.navigate();
    await analyticsPage.login('newuser@example.com', 'Pass@123');
    await analyticsPage.goToAnalytics();
    
    // Step 4: Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    await expect(analyticsPage.insufficientDataMessage).toContainText(/Insufficient data|At least 2 months/i);
    
    // Step 5: Verify graph is not displayed or shows placeholder
    const graphVisible = await analyticsPage.monthlyTrendGraph.isVisible();
    if (graphVisible) {
      await expect(analyticsPage.graphPlaceholder).toBeVisible();
    }
    
    // Step 6: Verify no error messages
    const errors = await page.locator('.alert-danger, .error-message').count();
    expect(errors).toBe(0);
  });

  test('QE-9057 TS-003 TC-001 - Verify filtered monthly trend analysis updates within 1 second', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-4: Launch, login, navigate, and note initial values
    await analyticsPage.navigate();
    await analyticsPage.login('multimonth@example.com', 'Pass@123');
    await analyticsPage.goToAnalytics();
    const initialDataPoints = await analyticsPage.getMonthlyDataPoints();
    
    // Step 5-6: Apply category filter and measure update time
    let startTime = Date.now();
    await analyticsPage.selectCategoryFilter('Food & Dining');
    await analyticsPage.waitForGraphUpdate();
    let updateTime = Date.now() - startTime;
    expect(updateTime).toBeLessThan(1000);
    
    // Step 7: Verify accurate amounts for filtered category
    const categoryDataPoints = await analyticsPage.getMonthlyDataPoints();
    expect(categoryDataPoints.length).toBeGreaterThan(0);
    
    // Step 8-9: Apply card filter and measure update time
    startTime = Date.now();
    await analyticsPage.selectCardFilter('Visa Gold (****1234)');
    await analyticsPage.waitForGraphUpdate();
    updateTime = Date.now() - startTime;
    expect(updateTime).toBeLessThan(1000);
    
    // Step 10: Verify totals and percentages reflect filters
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBeGreaterThan(0);
    
    const percentage = await analyticsPage.getCategoryPercentage('Food & Dining');
    expect(percentage).toBeGreaterThan(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  test('QE-9056 TS-001 TC-001 - Verify interactive chart displays accurate spending for all 9 categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, login with all categories user, navigate
    await analyticsPage.navigate();
    await analyticsPage.login('allcategories@example.com', 'Pass@123');
    await analyticsPage.goToAnalytics();
    
    // Step 4: Verify category chart is displayed
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    // Step 5: Verify all 9 categories are represented
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of categories) {
      const categoryElement = await analyticsPage.getCategoryElement(category);
      await expect(categoryElement).toBeVisible();
    }
    
    // Step 6: Hover over each category and verify tooltip
    for (const category of categories) {
      await analyticsPage.hoverOverCategory(category);
      await expect(analyticsPage.tooltip).toBeVisible();
      const tooltipText = await analyticsPage.tooltip.textContent();
      expect(tooltipText).toContain(category);
      expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
      expect(tooltipText).toMatch(/[0-9]+\.?[0-9]*%/);
    }
    
    // Step 7: Verify spending amounts are accurate
    const totalSpend = await analyticsPage.getTotalSpend();
    expect(totalSpend).toBeGreaterThan(0);
    
    // Step 8: Verify percentages sum to 100%
    let totalPercentage = 0;
    for (const category of categories) {
      const percentage = await analyticsPage.getCategoryPercentage(category);
      totalPercentage += percentage;
    }
    expect(Math.round(totalPercentage)).toBe(100);
  });

  test('QE-9056 TS-002 TC-001 - Verify chart accurately represents single category spending', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, login with single category user, navigate
    await analyticsPage.navigate();
    await analyticsPage.login('singlecategory@example.com', 'Pass@123');
    await analyticsPage.goToAnalytics();
    
    // Step 4: Verify category chart is displayed
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    // Step 5: Verify single category is highlighted
    const activeCategories = await analyticsPage.getActiveCategoryElements();
    expect(activeCategories.length).toBe(1);
    
    // Step 6: Verify spending amount is accurate
    const categoryAmount = await analyticsPage.getCategoryAmount(activeCategories[0]);
    expect(categoryAmount).toBeGreaterThan(0);
    
    // Step 7: Verify remaining categories show zero
    const allCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    let zeroCount = 0;
    for (const category of allCategories) {
      const amount = await analyticsPage.getCategoryAmount(category);
      if (amount === 0) {
        zeroCount++;
      }
    }
    expect(zeroCount).toBe(8);
    
    // Step 8: Verify percentage is 100%
    const percentage = await analyticsPage.getCategoryPercentage(activeCategories[0]);
    expect(Math.round(percentage)).toBe(100);
  });

  test('QE-9056 TS-003 TC-001 - Verify category drill-down displays detailed transaction list', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1-3: Launch, login, navigate
    await analyticsPage.navigate();
    await analyticsPage.login('testuser@example.com', 'Pass@123');
    await analyticsPage.goToAnalytics();
    
    // Step 4: Click on category segment
    await analyticsPage.clickCategorySegment('Food & Dining');
    await expect(analyticsPage.drillDownView).toBeVisible();
    
    // Step 5: Verify only selected category transactions
    const transactions = await analyticsPage.getDrillDownTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    
    for (const txn of transactions) {
      const category = await txn.getCategoryName();
      expect(category).toBe('Food & Dining');
    }
    
    // Step 6: Verify total amount matches sum
    const displayedTotal = await analyticsPage.getDrillDownTotal();
    let calculatedTotal = 0;
    for (const txn of transactions) {
      calculatedTotal += await txn.getAmount();
    }
    expect(Math.abs(displayedTotal - calculatedTotal)).toBeLessThan(0.01);
    
    // Step 7: Verify transaction count matches
    const displayedCount = await analyticsPage.getDrillDownCount();
    expect(displayedCount).toBe(transactions.length);
    
    // Step 8: Verify transaction details are complete
    for (const txn of transactions) {
      await expect(txn.dateElement).toBeVisible();
      await expect(txn.merchantElement).toBeVisible();
      await expect(txn.amountElement).toBeVisible();
      await expect(txn.cardElement).toBeVisible();
    }
  });

});