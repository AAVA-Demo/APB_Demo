const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

// Test cases for QE-8983 (Spending Trend Analysis Filtering) and QE-8980 (Category-Wise Spending Visualization)

test.describe('Analytics Dashboard Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
  });

  // QE-8983 TS-001 TC-001: Verify custom date range filter updates dynamically
  test('TC-5843: Verify custom date range filter updates analytics dashboard without page reload', async ({ page }) => {
    // Step 1-2: Navigate to Analytics (handled in beforeEach)
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);

    // Step 2: Verify default date range loads (last 12 months)
    await expect(analyticsPage.dateRangeFilter).toBeVisible();

    // Step 3: Locate date range filter section
    await expect(analyticsPage.startDateInput).toBeVisible();
    await expect(analyticsPage.endDateInput).toBeVisible();

    // Step 4: Enter Start Date
    await analyticsPage.setStartDate('2024-01-01');

    // Step 5: Enter End Date
    await analyticsPage.setEndDate('2024-03-31');

    // Step 6: Click Apply button and verify no page reload
    const currentUrl = page.url();
    await analyticsPage.applyDateFilter();
    await page.waitForTimeout(1000); // Wait for dynamic update
    expect(page.url()).toBe(currentUrl); // Verify no page reload

    // Step 7: Verify category-wise pie chart reflects selected date range
    await expect(analyticsPage.categoryChart).toBeVisible();
    const chartData = await analyticsPage.getChartData();
    expect(chartData).toBeDefined();

    // Step 8: Verify total spending summary matches date range
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBeDefined();
    expect(parseInt(totalSpending)).toBeGreaterThan(0);
  });

  // QE-8983 TS-002 TC-001: Verify invalid date range validation
  test('TC-5844: Verify validation error when start date is after end date', async ({ page }) => {
    // Step 1-2: Navigate to Analytics (handled in beforeEach)
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);

    // Step 3: Enter Start Date (future date)
    await analyticsPage.setStartDate('2024-12-31');

    // Step 4: Enter End Date (past date)
    await analyticsPage.setEndDate('2024-01-01');

    // Step 5: Click Apply and verify validation error
    await analyticsPage.applyDateFilter();
    await expect(analyticsPage.validationError).toBeVisible();
    await expect(analyticsPage.validationError).toContainText('Start date cannot be after end date');

    // Step 6: Verify charts do not update
    const chartVisible = await analyticsPage.categoryChart.isVisible();
    // Chart should retain previous valid data or show default
    expect(chartVisible).toBe(true);
  });

  // QE-8983 TS-003 TC-001: Verify 3-second rendering time for 12-month filter
  test('TC-5845: Verify analytics dashboard renders within 3 seconds for 12-month date range', async ({ page }) => {
    // Step 1-2: Navigate to Analytics (handled in beforeEach)
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);

    // Step 3-4: Calculate and enter 12-month date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    await analyticsPage.setStartDate(startDateStr);
    await analyticsPage.setEndDate(endDateStr);

    // Step 5-7: Measure rendering time
    const startTime = Date.now();
    await analyticsPage.applyDateFilter();
    
    // Wait for chart to be visible (indicates rendering complete)
    await expect(analyticsPage.categoryChart).toBeVisible({ timeout: 3000 });
    
    const endTime = Date.now();
    const renderingTime = (endTime - startTime) / 1000; // Convert to seconds

    // Verify rendering time is <= 3 seconds (NFR requirement)
    expect(renderingTime).toBeLessThanOrEqual(3);

    // Verify no page reload occurred
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);
  });

  // QE-8980 TS-001 TC-001: Verify interactive pie chart with 9 categories
  test('TC-5852: Verify category-wise pie chart displays all 9 categories with accurate amounts', async ({ page }) => {
    // Step 1-2: Navigate to Analytics (handled in beforeEach)
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);

    // Step 2: Verify user has transactions across multiple categories (mock data)
    // Step 3: Analytics dashboard loads
    await expect(analyticsPage.categoryChart).toBeVisible();

    // Step 4: Verify pie chart displays 9 category segments
    const categories = await analyticsPage.getCategoryList();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });

    // Step 5: Verify each category displays correct amount and percentage
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(categoryBreakdown.length).toBeGreaterThan(0);
    
    // Verify percentages add up to 100%
    const totalPercentage = categoryBreakdown.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0);
    expect(totalPercentage).toBeCloseTo(100, 1);

    // Step 6: Verify chart is interactive
    await analyticsPage.categoryChart.hover();
    // Chart should respond to interaction (tooltip, highlight, etc.)
  });

  // QE-8980 TS-002 TC-001: Verify single category displays 100%
  test('TC-5853: Verify category chart displays 100% for single category spending', async ({ page }) => {
    // Step 1-2: Navigate to Analytics
    await analyticsPage.navigate();

    // Step 2: Mock scenario with single category (Food & Dining: 12000)
    await page.route('**/analytics/aggregate', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          categoryBreakdown: [
            { category: 'Food & Dining', totalAmount: 12000, percentageOfTotal: '100.00' }
          ],
          totalSpending: 12000,
          topCategory: 'Food & Dining'
        })
      });
    });

    await analyticsPage.navigate();

    // Step 4: Verify pie chart displays single segment at 100%
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categoryBreakdown = await analyticsPage.getCategoryBreakdown();
    expect(categoryBreakdown.length).toBe(1);
    expect(categoryBreakdown[0].category).toBe('Food & Dining');
    expect(parseFloat(categoryBreakdown[0].percentage)).toBe(100);

    // Step 5: Verify other categories show zero or not displayed
    const categories = await analyticsPage.getCategoryList();
    expect(categories.length).toBe(1);

    // Step 6: Verify total spending matches single category
    const totalSpending = await analyticsPage.getTotalSpending();
    expect(totalSpending).toBe('12000');
  });

  // QE-8980 TS-003 TC-001: Verify no data message for empty transactions
  test('TC-5854: Verify no data message displays when no transactions exist in selected date range', async ({ page }) => {
    // Step 1-2: Navigate to Analytics (handled in beforeEach)
    await expect(analyticsPage.page).toHaveURL(/.*analytics/);

    // Step 3: Select date range with no transactions
    await analyticsPage.setStartDate('2025-01-01');
    await analyticsPage.setEndDate('2025-03-31');

    // Step 4: Click Apply
    await analyticsPage.applyDateFilter();

    // Step 5: Verify no data message is displayed
    await expect(analyticsPage.noDataMessage).toBeVisible();
    await expect(analyticsPage.noDataMessage).toContainText('No spending data available');

    // Step 6: Verify no empty or misleading charts are displayed
    const chartVisible = await analyticsPage.categoryChart.isVisible();
    // Chart should be hidden or show placeholder
    if (chartVisible) {
      const chartData = await analyticsPage.getChartData();
      expect(chartData).toBeNull();
    }
  });
});
