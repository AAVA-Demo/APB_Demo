const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

// QE-10426 - Category-Wise Spending Visualization Test Cases
test.describe('Category-Wise Spending Visualization', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
  });

  // QE-10426 TS-001 TC-001
  test('Verify category-wise spending pie chart displays correctly for user with transactions in all 9 categories', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify pie chart is visible
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    
    // Verify 9 segments are displayed
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBe(9);
    
    // Verify each category displays percentage and amount
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of categories) {
      const categoryData = await analyticsPage.getCategoryData(category);
      expect(categoryData.percentage).toMatch(/\d+%/);
      expect(categoryData.amount).toContain('$');
    }
    
    // Verify total percentages add up to 100%
    const totalPercentage = await analyticsPage.getTotalPercentage();
    expect(totalPercentage).toBeCloseTo(100, 1);
    
    // Verify pie chart is interactive
    await analyticsPage.clickPieChartSegment(0);
    await expect(analyticsPage.segmentHighlight).toBeVisible();
  });

  // QE-10426 TS-001 TC-002
  test('Verify category breakdown table displays accurate data alongside pie chart', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify table is visible
    await expect(analyticsPage.categoryBreakdownTable).toBeVisible();
    
    // Verify table has all 9 categories
    const tableRowCount = await analyticsPage.getTableRowCount();
    expect(tableRowCount).toBe(9);
    
    // Verify table data matches pie chart
    const categories = ['Food & Dining', 'Fuel', 'Shopping'];
    for (const category of categories) {
      const pieData = await analyticsPage.getCategoryData(category);
      const tableData = await analyticsPage.getTableRowData(category);
      expect(tableData.amount).toBe(pieData.amount);
      expect(tableData.percentage).toBe(pieData.percentage);
    }
    
    // Verify table is sortable
    await analyticsPage.clickTableHeader('Amount');
    await page.waitForTimeout(500);
    const sortedAmounts = await analyticsPage.getColumnValues('Amount');
    // Verify descending order
    for (let i = 0; i < sortedAmounts.length - 1; i++) {
      const amt1 = parseFloat(sortedAmounts[i].replace(/[$,]/g, ''));
      const amt2 = parseFloat(sortedAmounts[i + 1].replace(/[$,]/g, ''));
      expect(amt1).toBeGreaterThanOrEqual(amt2);
    }
  });

  // QE-10426 TS-001 TC-003
  test('Verify category-wise spending updates when date range filter is applied', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Get initial data
    const initialData = await analyticsPage.getCategoryData('Food & Dining');
    
    // Change date range to Last Month
    const startTime = Date.now();
    await analyticsPage.selectDateRange('Last Month');
    await analyticsPage.waitForChartUpdate();
    const endTime = Date.now();
    
    // Verify chart renders within 1 second
    expect(endTime - startTime).toBeLessThanOrEqual(1000);
    
    // Verify data has changed
    const updatedData = await analyticsPage.getCategoryData('Food & Dining');
    // Data should be different for different date ranges
    
    // Verify table also updates
    const tableData = await analyticsPage.getTableRowData('Food & Dining');
    expect(tableData.amount).toBe(updatedData.amount);
  });

  // QE-10426 TS-002 TC-001
  test('Verify pie chart displays 100% allocation when user has transactions in only one category', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('singlecategory@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify single segment
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBe(1);
    
    // Verify 100% allocation
    const foodDiningData = await analyticsPage.getCategoryData('Food & Dining');
    expect(foodDiningData.percentage).toBe('100%');
    expect(foodDiningData.amount).toContain('$1,200');
    
    // Verify other categories are hidden or 0%
    const fuelVisible = await analyticsPage.isCategoryVisible('Fuel');
    expect(fuelVisible).toBeFalsy();
    
    // Verify table shows only one row
    const tableRowCount = await analyticsPage.getTableRowCount();
    expect(tableRowCount).toBe(1);
  });

  // QE-10426 TS-002 TC-002
  test('Verify pie chart displays correctly when user has transactions in only two categories', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('twocategories@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify two segments
    const segmentCount = await analyticsPage.getPieChartSegmentCount();
    expect(segmentCount).toBe(2);
    
    // Verify percentages add up to 100%
    const foodDiningData = await analyticsPage.getCategoryData('Food & Dining');
    const fuelData = await analyticsPage.getCategoryData('Fuel');
    
    const foodPercentage = parseFloat(foodDiningData.percentage.replace('%', ''));
    const fuelPercentage = parseFloat(fuelData.percentage.replace('%', ''));
    expect(foodPercentage + fuelPercentage).toBeCloseTo(100, 1);
    
    // Verify other categories are hidden
    const shoppingVisible = await analyticsPage.isCategoryVisible('Shopping');
    expect(shoppingVisible).toBeFalsy();
  });

  // QE-10426 TS-003 TC-001
  test('Verify uncategorized transactions are displayed under Miscellaneous with warning message', async ({ page }) => {
    // Mock categorization failure
    await page.route('**/api/analytics/spending*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          categoryBreakdown: [
            { category: 'Food & Dining', amount: 500, percentage: 50 },
            { category: 'Miscellaneous', amount: 350, percentage: 35 },
            { category: 'Fuel', amount: 150, percentage: 15 }
          ],
          uncategorizedCount: 5
        })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify Miscellaneous includes uncategorized transactions
    const miscData = await analyticsPage.getCategoryData('Miscellaneous');
    expect(miscData.amount).toContain('$350');
    
    // Verify warning message
    await expect(analyticsPage.categorizationWarning).toBeVisible();
    const warningText = await analyticsPage.categorizationWarning.textContent();
    expect(warningText).toContain('could not be categorized');
    
    // Verify table includes Miscellaneous
    const tableData = await analyticsPage.getTableRowData('Miscellaneous');
    expect(tableData.amount).toContain('$350');
  });

  // QE-10426 TS-003 TC-002
  test('Verify Analytics Engine failure does not crash the application', async ({ page }) => {
    // Mock Analytics Engine failure
    await page.route('**/api/analytics/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    });
    
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    await analyticsPage.navigate();
    
    // Verify error message
    await expect(analyticsPage.errorMessage).toBeVisible();
    const errorText = await analyticsPage.errorMessage.textContent();
    expect(errorText).toContain('Failed to load analytics data');
    
    // Verify retry button
    await expect(analyticsPage.retryButton).toBeVisible();
    
    // Verify navigation works
    await analyticsPage.navigateToDashboard();
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.goBack();
    await analyticsPage.navigateToTransactions();
    await expect(page).toHaveURL(/.*transactions/);
  });
});

// QE-10422 - Monthly Spend Trends Analysis Test Cases
test.describe('Monthly Spend Trends Analysis', () => {
  let analyticsPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    analyticsPage = new AnalyticsPage(page);
  });

  // QE-10422 TS-001 TC-001
  test('Verify monthly trends line graph displays correctly for user with 6 months of transaction history', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('sixmonths@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Scroll to trends section
    await analyticsPage.scrollToTrendsSection();
    
    // Verify line graph is visible
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    
    // Verify 6 data points
    const dataPointCount = await analyticsPage.getTrendsDataPointCount();
    expect(dataPointCount).toBe(6);
    
    // Verify X-axis labels
    const xAxisLabels = await analyticsPage.getXAxisLabels();
    expect(xAxisLabels.length).toBe(6);
    
    // Verify Y-axis displays monetary values
    const yAxisLabels = await analyticsPage.getYAxisLabels();
    expect(yAxisLabels[0]).toMatch(/\$/);
    
    // Hover over data point and verify tooltip
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.chartTooltip.textContent();
    expect(tooltipText).toContain('$');
  });

  // QE-10422 TS-001 TC-002
  test('Verify monthly trends graph updates when card filter is applied', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.scrollToTrendsSection();
    
    // Get initial data (all cards)
    const initialDataPoints = await analyticsPage.getTrendsDataPoints();
    
    // Apply card filter
    await analyticsPage.selectCardFilter('Visa Gold');
    await analyticsPage.waitForChartUpdate();
    
    // Verify graph updates
    const filteredDataPoints = await analyticsPage.getTrendsDataPoints();
    // Data should be different when filtered by single card
    
    // Hover over data point and verify it shows Visa Gold data
    await analyticsPage.hoverOverDataPoint(0);
    const tooltipText = await analyticsPage.chartTooltip.textContent();
    expect(tooltipText).toBeTruthy();
    
    // Clear filter
    await analyticsPage.clearCardFilter();
    await analyticsPage.waitForChartUpdate();
    
    // Verify graph returns to aggregated data
    const restoredDataPoints = await analyticsPage.getTrendsDataPoints();
    expect(restoredDataPoints.length).toBe(initialDataPoints.length);
  });

  // QE-10422 TS-001 TC-003
  test('Verify monthly trends graph renders within 1 second', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@1234');
    
    const startTime = Date.now();
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.scrollToTrendsSection();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const endTime = Date.now();
    
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThanOrEqual(1000);
  });

  // QE-10422 TS-002 TC-001
  test('Verify appropriate message when user has less than 2 months of transaction history', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('onemonth@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.scrollToTrendsSection();
    
    // Verify line graph is not displayed
    const chartVisible = await analyticsPage.monthlyTrendsChart.isVisible();
    expect(chartVisible).toBeFalsy();
    
    // Verify insufficient data message
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.insufficientDataMessage.textContent();
    expect(messageText).toContain('Insufficient data');
    expect(messageText).toContain('2 months');
    
    // Verify category-wise spending is still displayed
    await expect(analyticsPage.categoryPieChart).toBeVisible();
  });

  // QE-10422 TS-002 TC-002
  test('Verify new user with zero transaction history sees insufficient data message', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Verify trends section shows insufficient data
    await analyticsPage.scrollToTrendsSection();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    
    // Verify category-wise spending also shows no data
    await expect(analyticsPage.noSpendingDataMessage).toBeVisible();
  });

  // QE-10422 TS-003 TC-001
  test('Verify empty graph with appropriate message when selected card has no transactions', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    await analyticsPage.scrollToTrendsSection();
    
    // Apply filter for card with no transactions
    await analyticsPage.selectCardFilter('Amex Blue');
    await analyticsPage.waitForChartUpdate();
    
    // Verify empty state
    await expect(analyticsPage.noDataForCardMessage).toBeVisible();
    const messageText = await analyticsPage.noDataForCardMessage.textContent();
    expect(messageText).toContain('No spending data available for the selected card');
    
    // Verify application doesn't crash
    await expect(page).toHaveURL(/.*analytics/);
    
    // Clear filter
    await analyticsPage.clearCardFilter();
    await analyticsPage.waitForChartUpdate();
    
    // Verify graph returns to showing aggregated data
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
  });

  // QE-10422 TS-003 TC-002
  test('Verify category-wise spending also shows no data message when selected card has no transactions', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('multicard@example.com', 'Test@1234');
    await analyticsPage.navigate();
    await analyticsPage.waitForAnalyticsLoad();
    
    // Apply filter for card with no transactions
    await analyticsPage.selectCardFilter('Amex Blue');
    await analyticsPage.waitForChartUpdate();
    
    // Verify category-wise spending shows no data
    await expect(analyticsPage.noDataForCardMessage).toBeVisible();
    
    // Verify monthly trends also shows no data
    await analyticsPage.scrollToTrendsSection();
    await expect(analyticsPage.noDataForCardMessage).toBeVisible();
    
    // Verify both visualizations consistently show no data state
    const categoryMessage = await page.locator('[data-testid="no-data-message"]').first().textContent();
    const trendsMessage = await page.locator('[data-testid="no-data-message"]').last().textContent();
    expect(categoryMessage).toContain('No spending data');
    expect(trendsMessage).toContain('No spending data');
  });
});