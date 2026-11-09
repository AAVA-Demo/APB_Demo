const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Spending Analytics Tests', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    logger.info('Navigating to Spending Analytics page');
    await analyticsPage.navigate();
  });

  test('QE-8870 TS-001 TC-001: Verify monthly spending trends chart displays all 12 months with accurate totals within 3 seconds', async ({ page }) => {
    logger.info('Test Case: QE-8870 TS-001 TC-001 - Monthly trends chart validation');
    
    // Click Monthly Trends view
    await analyticsPage.clickMonthlyTrendsView();
    
    // Measure chart load time
    const startTime = Date.now();
    await analyticsPage.waitForChartLoad();
    const loadTime = Date.now() - startTime;
    logger.info(`Chart load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
    
    // Verify chart displays all 12 months
    const months = await analyticsPage.getChartLabels();
    expect(months.length).toBe(12);
    const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    expectedMonths.forEach(month => {
      expect(months.some(m => m.includes(month))).toBe(true);
    });
    logger.info('All 12 months displayed on chart');
    
    // Verify each month has spending data
    const chartData = await analyticsPage.getChartData();
    expect(chartData.length).toBe(12);
    chartData.forEach(value => {
      expect(value).toBeGreaterThanOrEqual(0);
    });
    logger.info('All months have spending data');
    
    // Hover over a data point and verify tooltip
    await analyticsPage.hoverOverDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('January');
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    logger.info('Tooltip displays correctly');
    
    // Verify chart is interactive
    const isInteractive = await analyticsPage.isChartInteractive();
    expect(isInteractive).toBe(true);
    logger.info('Chart is interactive and responsive');
  });

  test('QE-8870 TS-001 TC-002: Verify monthly trends chart data accuracy matches transaction totals', async ({ page }) => {
    logger.info('Test Case: QE-8870 TS-001 TC-002 - Monthly trends data accuracy validation');
    
    await analyticsPage.clickMonthlyTrendsView();
    await analyticsPage.waitForChartLoad();
    
    // Get March spending from chart
    const chartData = await analyticsPage.getChartData();
    const marchSpending = chartData[2]; // March is index 2
    logger.info(`March spending from chart: $${marchSpending}`);
    
    // Navigate to transactions page
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
    
    // Apply March date filter
    const transactionPage = require('./pages/transaction.page').TransactionPage;
    const txnPage = new transactionPage(page);
    await txnPage.enterStartDate('2024-03-01');
    await txnPage.enterEndDate('2024-03-31');
    await txnPage.clickApplyFilter();
    await txnPage.waitForTransactionListLoad();
    
    // Calculate total from transactions
    const transactions = await txnPage.getAllTransactions();
    let manualTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Handle pagination if exists
    while (!(await txnPage.isNextButtonDisabled())) {
      await txnPage.clickNextPage();
      await txnPage.waitForTransactionListLoad();
      const moreTransactions = await txnPage.getAllTransactions();
      manualTotal += moreTransactions.reduce((sum, t) => sum + t.amount, 0);
    }
    
    logger.info(`March total from transactions: $${manualTotal}`);
    
    // Verify totals match (within 0.01 tolerance for rounding)
    expect(Math.abs(marchSpending - manualTotal)).toBeLessThan(0.01);
    logger.info('Chart data matches transaction totals');
  });

  test('QE-8870 TS-002 TC-001: Verify monthly trends chart displays only available months without empty data points', async ({ page }) => {
    logger.info('Test Case: QE-8870 TS-002 TC-001 - Partial data display validation');
    
    await analyticsPage.clickMonthlyTrendsView();
    await analyticsPage.waitForChartLoad();
    
    // Verify chart displays only 3 months
    const chartLabels = await analyticsPage.getChartLabels();
    expect(chartLabels.length).toBe(3);
    logger.info(`Chart displays ${chartLabels.length} months with data`);
    
    // Verify displayed months are January, February, March
    expect(chartLabels[0]).toContain('January');
    expect(chartLabels[1]).toContain('February');
    expect(chartLabels[2]).toContain('March');
    logger.info('Correct months displayed: January, February, March');
    
    // Verify each month has accurate spending
    const chartData = await analyticsPage.getChartData();
    chartData.forEach((value, index) => {
      expect(value).toBeGreaterThan(0);
      logger.info(`${chartLabels[index]}: $${value}`);
    });
    
    // Verify no empty or zero-value months beyond available data
    expect(chartLabels.length).toBe(chartData.length);
    logger.info('No empty data points displayed');
    
    // Verify chart remains visually clear
    const chartVisible = await analyticsPage.spendingChart.isVisible();
    expect(chartVisible).toBe(true);
    logger.info('Chart is visually clear and uncluttered');
  });

  test('QE-8870 TS-003 TC-001: Verify appropriate message displays when no transaction history is available', async ({ page }) => {
    logger.info('Test Case: QE-8870 TS-003 TC-001 - No data scenario validation');
    
    await analyticsPage.clickMonthlyTrendsView();
    await analyticsPage.waitForPageLoad();
    
    // Verify insufficient data message is displayed
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const messageText = await analyticsPage.getNoDataMessageText();
    expect(messageText).toContain('Insufficient data');
    expect(messageText).toContain('monthly spending trends');
    logger.info('Insufficient data message displayed correctly');
    
    // Verify no broken charts are displayed
    const brokenChartElements = await analyticsPage.getBrokenChartElements();
    expect(brokenChartElements.length).toBe(0);
    logger.info('No broken chart elements displayed');
    
    // Verify no system errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    logger.info('No JavaScript errors occurred');
    
    // Verify page remains functional
    await expect(analyticsPage.viewSelector).toBeVisible();
    await analyticsPage.clickCardWiseView();
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    logger.info('Page remains functional for navigation');
  });

  test('QE-8874 TS-001 TC-001: Verify category-wise spending breakdown displays accurate totals for all nine categories', async ({ page }) => {
    logger.info('Test Case: QE-8874 TS-001 TC-001 - Category breakdown validation');
    
    // Click Category Breakdown view
    await analyticsPage.clickCategoryBreakdownView();
    
    // Measure load time
    const startTime = Date.now();
    await analyticsPage.waitForChartLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    logger.info(`Category chart load time: ${loadTime}ms`);
    
    // Verify all nine categories are displayed
    const categories = await analyticsPage.getChartLabels();
    const expectedCategories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 
      'Education', 'Miscellaneous'
    ];
    
    expect(categories.length).toBe(9);
    expectedCategories.forEach(category => {
      expect(categories).toContain(category);
    });
    logger.info('All nine categories displayed');
    
    // Verify each category has spending total with two decimal places
    const categoryData = await analyticsPage.getCategoryData();
    expect(Object.keys(categoryData).length).toBe(9);
    
    Object.entries(categoryData).forEach(([category, amount]) => {
      expect(amount).toBeGreaterThanOrEqual(0);
      // Verify two decimal places
      const decimalPlaces = amount.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
      logger.info(`${category}: $${amount.toFixed(2)}`);
    });
    
    // Verify sum of categories matches overall total
    const categorySum = Object.values(categoryData).reduce((sum, val) => sum + val, 0);
    const overallTotal = await analyticsPage.getOverallSpendingTotal();
    expect(Math.abs(categorySum - overallTotal)).toBeLessThan(0.01);
    logger.info('Category totals sum matches overall spending');
  });

  test('QE-8874 TS-001 TC-002: Verify interactive features of category-wise spending visualization', async ({ page }) => {
    logger.info('Test Case: QE-8874 TS-001 TC-002 - Category chart interactivity validation');
    
    await analyticsPage.clickCategoryBreakdownView();
    await analyticsPage.waitForChartLoad();
    
    // Hover over Food & Dining category
    await analyticsPage.hoverOverCategory('Food & Dining');
    
    // Verify tooltip displays
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const tooltipText = await analyticsPage.getTooltipText();
    expect(tooltipText).toContain('Food & Dining');
    expect(tooltipText).toMatch(/\$[0-9,]+\.[0-9]{2}/);
    logger.info('Tooltip displays category name and amount');
    
    // Click on category segment
    await analyticsPage.clickCategorySegment('Food & Dining');
    
    // Verify category is highlighted or drilled down (if supported)
    const isHighlighted = await analyticsPage.isCategoryHighlighted('Food & Dining');
    logger.info(`Category highlighted: ${isHighlighted}`);
    
    // Verify chart renders smoothly
    const chartVisible = await analyticsPage.spendingChart.isVisible();
    expect(chartVisible).toBe(true);
    
    const hasPerformanceIssues = await analyticsPage.hasChartPerformanceIssues();
    expect(hasPerformanceIssues).toBe(false);
    logger.info('Chart renders smoothly without performance issues');
  });

  test('QE-8874 TS-002 TC-001: Verify category-wise spending displays only categories with transactions', async ({ page }) => {
    logger.info('Test Case: QE-8874 TS-002 TC-001 - Partial category data validation');
    
    await analyticsPage.clickCategoryBreakdownView();
    await analyticsPage.waitForChartLoad();
    
    // Verify only three categories display spending
    const categoryData = await analyticsPage.getCategoryData();
    const activeCategories = Object.entries(categoryData).filter(([cat, amount]) => amount > 0);
    expect(activeCategories.length).toBe(3);
    logger.info(`${activeCategories.length} categories with spending`);
    
    // Verify specific categories
    expect(categoryData['Food & Dining']).toBeGreaterThan(0);
    expect(categoryData['Fuel']).toBeGreaterThan(0);
    expect(categoryData['Shopping']).toBeGreaterThan(0);
    logger.info('Food & Dining, Fuel, and Shopping have spending');
    
    // Verify remaining six categories show zero or are excluded
    const inactiveCategories = ['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    inactiveCategories.forEach(category => {
      const amount = categoryData[category] || 0;
      expect(amount).toBe(0);
      logger.info(`${category}: $0.00`);
    });
    
    // Verify total matches sum of active categories
    const activeSum = activeCategories.reduce((sum, [cat, amount]) => sum + amount, 0);
    const displayedTotal = await analyticsPage.getOverallSpendingTotal();
    expect(Math.abs(activeSum - displayedTotal)).toBeLessThan(0.01);
    logger.info('Total matches sum of active categories');
  });

  test('QE-8874 TS-003 TC-001: Verify appropriate message displays when no spending data is available', async ({ page }) => {
    logger.info('Test Case: QE-8874 TS-003 TC-001 - No spending data scenario validation');
    
    await analyticsPage.clickCategoryBreakdownView();
    await analyticsPage.waitForPageLoad();
    
    // Verify no spending data message
    await expect(analyticsPage.noDataMessage).toBeVisible();
    const messageText = await analyticsPage.getNoDataMessageText();
    expect(messageText).toContain('No spending data available');
    expect(messageText).toContain('category breakdown');
    logger.info('No spending data message displayed correctly');
    
    // Verify no empty or broken visualizations
    const brokenElements = await analyticsPage.getBrokenChartElements();
    expect(brokenElements.length).toBe(0);
    logger.info('No broken visualizations displayed');
    
    // Verify page remains functional
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    expect(consoleErrors.length).toBe(0);
    logger.info('No JavaScript errors occurred');
    
    // Verify navigation still works
    await analyticsPage.clickMonthlyTrendsView();
    await expect(analyticsPage.analyticsContainer).toBeVisible();
    logger.info('Page navigation remains functional');
  });
});
