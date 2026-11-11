const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { logger } = require('../utils/logger');

test.describe('Analytics - Category-wise Spending and Trend Analysis Tests', () => {

  test('QE-10706 TS-001 TC-001 - Verify category-wise spending chart displays all nine categories with accurate totals', async ({ page }) => {
    logger.info('Starting test: QE-10706 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Create transactions across all nine categories
    logger.info('Step 1: Transactions created across all 9 categories');
    // Test data: Food & Dining: $450, Fuel: $200, Shopping: $600, Travel: $350, Entertainment: $150, Utilities: $120, Healthcare: $180, Education: $100, Miscellaneous: $50
    
    // Step 2: Navigate to analytics page
    logger.info('Step 2: Navigating to analytics page');
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    // Step 3: Verify category chart is displayed
    logger.info('Step 3: Verifying category chart is visible');
    await expect(analyticsPage.categoryChart).toBeVisible();
    
    // Step 4: Verify all nine categories are present
    logger.info('Step 4: Verifying all 9 categories are present');
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories).toEqual([
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ]);
    
    // Step 5: Verify spending totals are accurate
    logger.info('Step 5: Verifying spending totals');
    const categoryTotals = await analyticsPage.getCategoryTotals();
    expect(categoryTotals).toEqual({
      'Food & Dining': '$450',
      'Fuel': '$200',
      'Shopping': '$600',
      'Travel': '$350',
      'Entertainment': '$150',
      'Utilities': '$120',
      'Healthcare': '$180',
      'Education': '$100',
      'Miscellaneous': '$50'
    });
    
    // Step 6: Verify percentage calculations
    logger.info('Step 6: Verifying percentage calculations');
    const percentages = await analyticsPage.getCategoryPercentages();
    expect(percentages['Food & Dining']).toBe('20.45%');
    expect(percentages['Fuel']).toBe('9.09%');
    expect(percentages['Shopping']).toBe('27.27%');
    
    logger.info('Test QE-10706 TS-001 TC-001 completed successfully');
  });

  test('QE-10706 TS-001 TC-002 - Verify chart interactivity (hover, click, tooltip)', async ({ page }) => {
    logger.info('Starting test: QE-10706 TS-001 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Create transactions across multiple categories
    logger.info('Step 1: Transactions created');
    // Test data: Food & Dining: $300, Fuel: $150, Shopping: $400
    
    // Step 2: Navigate to analytics page
    logger.info('Step 2: Navigating to analytics page');
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    // Step 3: Hover over Food & Dining segment
    logger.info('Step 3: Hovering over Food & Dining segment');
    await analyticsPage.hoverOverCategorySegment('Food & Dining');
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toContain('$300');
    
    // Step 4: Click on Shopping segment
    logger.info('Step 4: Clicking on Shopping segment');
    await analyticsPage.clickCategorySegment('Shopping');
    await expect(analyticsPage.selectedSegment).toHaveClass(/highlighted|selected/);
    
    // Step 5: Verify chart legend is displayed
    logger.info('Step 5: Verifying chart legend');
    await expect(analyticsPage.chartLegend).toBeVisible();
    const legendItems = await analyticsPage.getLegendItems();
    expect(legendItems.length).toBeGreaterThan(0);
    
    logger.info('Test QE-10706 TS-001 TC-002 completed successfully');
  });

  test('QE-10706 TS-002 TC-001 - Verify empty state message when user has no transaction history', async ({ page }) => {
    logger.info('Starting test: QE-10706 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Ensure user has no transactions
    logger.info('Step 1: Using test user with zero transactions');
    // Test data: User ID test_user_002
    
    // Step 2: Navigate to analytics page
    logger.info('Step 2: Navigating to analytics page');
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    // Step 3: Verify empty state message
    logger.info('Step 3: Verifying empty state message');
    await expect(analyticsPage.emptyStateMessage).toBeVisible();
    const messageText = await analyticsPage.getEmptyStateMessageText();
    expect(messageText).toContain('No spending data available');
    
    // Step 4: Verify chart displays empty state
    logger.info('Step 4: Verifying chart empty state');
    const chartData = await analyticsPage.getCategoryTotals();
    const allZero = Object.values(chartData).every(val => val === '$0.00' || val === '$0');
    expect(allZero).toBe(true);
    
    // Step 5: Verify no console errors
    logger.info('Step 5: Checking for console errors');
    const consoleErrors = await analyticsPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
    
    logger.info('Test QE-10706 TS-002 TC-001 completed successfully');
  });

  test('QE-10706 TS-003 TC-001 - Verify partial category spending display', async ({ page }) => {
    logger.info('Starting test: QE-10706 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Create transactions in only three categories
    logger.info('Step 1: Transactions created in 3 categories only');
    // Test data: Food & Dining: $500, Fuel: $250, Shopping: $750
    
    // Step 2: Navigate to analytics page
    logger.info('Step 2: Navigating to analytics page');
    await analyticsPage.navigate();
    await analyticsPage.waitForPageLoad();
    
    // Step 3: Verify only three categories show non-zero values
    logger.info('Step 3: Verifying only 3 categories have non-zero values');
    const categoryTotals = await analyticsPage.getCategoryTotals();
    expect(categoryTotals['Food & Dining']).toBe('$500');
    expect(categoryTotals['Fuel']).toBe('$250');
    expect(categoryTotals['Shopping']).toBe('$750');
    
    // Step 4: Verify remaining six categories show $0 or are excluded
    logger.info('Step 4: Verifying remaining categories are $0 or excluded');
    const zeroCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of zeroCategories) {
      const value = categoryTotals[category];
      expect(value === undefined || value === '$0' || value === '$0.00').toBe(true);
    }
    
    // Step 5: Verify percentage calculation based on three active categories
    logger.info('Step 5: Verifying percentage calculations');
    const percentages = await analyticsPage.getCategoryPercentages();
    expect(percentages['Food & Dining']).toBe('33.33%');
    expect(percentages['Fuel']).toBe('16.67%');
    expect(percentages['Shopping']).toBe('50%');
    
    logger.info('Test QE-10706 TS-003 TC-001 completed successfully');
  });

  test('QE-10702 TS-001 TC-001 - Verify monthly trend chart displays accurate spend totals with date range filter', async ({ page }) => {
    logger.info('Starting test: QE-10702 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Create transactions spanning 6 months
    logger.info('Step 1: Transactions created for 6 months');
    // Test data: June: $500, July: $600, August: $550, September: $700, October: $650, November: $750
    
    // Step 2: Navigate to trend analysis section
    logger.info('Step 2: Navigating to trend analysis section');
    await analyticsPage.navigate();
    await analyticsPage.navigateToTrendSection();
    await analyticsPage.waitForPageLoad();
    
    // Step 3: Verify chart displays 6 data points
    logger.info('Step 3: Verifying chart displays 6 months');
    await expect(analyticsPage.trendChart).toBeVisible();
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(6);
    
    // Step 4: Verify spend totals are accurate
    logger.info('Step 4: Verifying monthly spend totals');
    const monthlyTotals = await analyticsPage.getMonthlyTotals();
    expect(monthlyTotals).toEqual({
      'June': '$500',
      'July': '$600',
      'August': '$550',
      'September': '$700',
      'October': '$650',
      'November': '$750'
    });
    
    // Step 5: Apply date range filter for last 3 months
    logger.info('Step 5: Applying last 3 months filter');
    await analyticsPage.applyDateRangeFilter('last3months');
    
    // Step 6: Verify chart updates to show only 3 months
    logger.info('Step 6: Verifying chart shows only 3 months');
    const filteredDataPoints = await analyticsPage.getTrendDataPoints();
    expect(filteredDataPoints.length).toBe(3);
    const filteredTotals = await analyticsPage.getMonthlyTotals();
    expect(filteredTotals).toEqual({
      'September': '$700',
      'October': '$650',
      'November': '$750'
    });
    
    // Step 7: Apply custom date range filter
    logger.info('Step 7: Applying custom date range filter');
    await analyticsPage.applyCustomDateRange('2026-06-01', '2026-08-31');
    
    // Step 8: Verify chart updates to selected period
    logger.info('Step 8: Verifying chart shows custom date range');
    const customDataPoints = await analyticsPage.getTrendDataPoints();
    expect(customDataPoints.length).toBe(3);
    const customTotals = await analyticsPage.getMonthlyTotals();
    expect(customTotals).toEqual({
      'June': '$500',
      'July': '$600',
      'August': '$550'
    });
    
    logger.info('Test QE-10702 TS-001 TC-001 completed successfully');
  });

  test('QE-10702 TS-002 TC-001 - Verify insufficient historical data message when only current month has transactions', async ({ page }) => {
    logger.info('Starting test: QE-10702 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Create transactions only for current month
    logger.info('Step 1: Transactions created for current month only');
    // Test data: November: $800 (5 transactions)
    
    // Step 2: Navigate to trend analysis section
    logger.info('Step 2: Navigating to trend analysis section');
    await analyticsPage.navigate();
    await analyticsPage.navigateToTrendSection();
    await analyticsPage.waitForPageLoad();
    
    // Step 3: Verify chart displays single data point
    logger.info('Step 3: Verifying chart shows single data point');
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints.length).toBe(1);
    const monthlyTotals = await analyticsPage.getMonthlyTotals();
    expect(monthlyTotals['November']).toBe('$800');
    
    // Step 4: Verify insufficient data message
    logger.info('Step 4: Verifying insufficient data message');
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    const messageText = await analyticsPage.getInsufficientDataMessageText();
    expect(messageText).toContain('Insufficient historical data');
    
    // Step 5: Verify no console errors
    logger.info('Step 5: Checking for console errors');
    const consoleErrors = await analyticsPage.getConsoleErrors();
    expect(consoleErrors.length).toBe(0);
    
    logger.info('Test QE-10702 TS-002 TC-001 completed successfully');
  });

  test('QE-10702 TS-003 TC-001 - Verify date range filter updates chart to display only selected period', async ({ page }) => {
    logger.info('Starting test: QE-10702 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    // Step 1: Create transactions spanning 12 months
    logger.info('Step 1: Transactions created for 12 months');
    // Test data: Jan: $400, Feb: $450, Mar: $500, Apr: $550, May: $600, Jun: $650, Jul: $700, Aug: $750, Sep: $800, Oct: $850, Nov: $900, Dec: $950
    
    // Step 2: Navigate to trend analysis section
    logger.info('Step 2: Navigating to trend analysis section');
    await analyticsPage.navigate();
    await analyticsPage.navigateToTrendSection();
    await analyticsPage.waitForPageLoad();
    const initialDataPoints = await analyticsPage.getTrendDataPoints();
    expect(initialDataPoints.length).toBe(12);
    
    // Step 3: Apply date range filter for Jan to Jun 2026
    logger.info('Step 3: Applying date range filter');
    await analyticsPage.applyCustomDateRange('2026-01-01', '2026-06-30');
    
    // Step 4: Verify chart displays only 6 months
    logger.info('Step 4: Verifying chart shows only 6 months');
    const filteredDataPoints = await analyticsPage.getTrendDataPoints();
    expect(filteredDataPoints.length).toBe(6);
    const filteredTotals = await analyticsPage.getMonthlyTotals();
    expect(filteredTotals).toEqual({
      'Jan': '$400',
      'Feb': '$450',
      'Mar': '$500',
      'Apr': '$550',
      'May': '$600',
      'Jun': '$650'
    });
    
    // Step 5: Verify excluded months are not shown
    logger.info('Step 5: Verifying excluded months are not shown');
    const excludedMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (const month of excludedMonths) {
      expect(filteredTotals[month]).toBeUndefined();
    }
    
    // Step 6: Clear date range filter
    logger.info('Step 6: Clearing date range filter');
    await analyticsPage.clearDateRangeFilter();
    
    // Step 7: Verify chart displays all 12 months again
    logger.info('Step 7: Verifying chart shows all 12 months');
    const allDataPoints = await analyticsPage.getTrendDataPoints();
    expect(allDataPoints.length).toBe(12);
    
    logger.info('Test QE-10702 TS-003 TC-001 completed successfully');
  });

});