const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test.describe('Credit Card Analytics - Spending Trends and Category Analysis Tests', () => {

  test('QE-7929 TS-001 TC-001 - Verify month-over-month spending trends display with accurate totals', async ({ page }) => {
    logger.info('Starting test: QE-7929 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Launch application and navigate to Analytics', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics page loaded');
    });

    await test.step('Click on Monthly Spend Trends tab', async () => {
      await analyticsPage.clickMonthlySpendTrendsTab();
      await analyticsPage.waitForTrendChartLoad();
      logger.info('Trend analysis section loaded');
    });

    await test.step('Select 6-month time range', async () => {
      await analyticsPage.selectDateRange('Last 6 months');
      await analyticsPage.waitForChartUpdate();
      logger.info('6-month range selected');
    });

    await test.step('Verify monthly totals are accurate', async () => {
      const monthlyData = await analyticsPage.getMonthlySpendData();
      await expect(monthlyData['Nov']).toBe('$3250.75');
      await expect(monthlyData['Oct']).toBe('$2980.50');
      await expect(monthlyData['Sep']).toBe('$3100.00');
      await expect(monthlyData['Aug']).toBe('$2750.25');
      await expect(monthlyData['Jul']).toBe('$2900.00');
      await expect(monthlyData['Jun']).toBe('$3050.00');
      logger.info('All monthly totals verified');
    });

    await test.step('Verify trend line is displayed', async () => {
      const trendLineVisible = await analyticsPage.isTrendLineVisible();
      await expect(trendLineVisible).toBeTruthy();
      logger.info('Trend line connects all data points');
    });

    await test.step('Verify tooltip on hover', async () => {
      const tooltipData = await analyticsPage.hoverOverMonth('Nov');
      await expect(tooltipData.month).toBe('November');
      await expect(tooltipData.amount).toBe('$3250.75');
      logger.info('Tooltip displays correct data');
    });
  });

  test('QE-7929 TS-001 TC-002 - Verify interactive chart drill-down features', async ({ page }) => {
    logger.info('Starting test: QE-7929 TS-001 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Navigate to Monthly Spend Trends', async () => {
      await analyticsPage.navigateToTrends();
      await analyticsPage.waitForTrendChartLoad();
      logger.info('Trend chart displayed');
    });

    await test.step('Click on October data point', async () => {
      await analyticsPage.clickMonthDataPoint('October 2026');
      await analyticsPage.waitForDetailView();
      logger.info('October detail view opened');
    });

    await test.step('Verify category breakdown for October', async () => {
      const categories = await analyticsPage.getCategoryBreakdown();
      await expect(categories.length).toBe(9);
      logger.info('All 9 categories displayed for October');
    });

    await test.step('Return to trend chart view', async () => {
      await analyticsPage.returnToChartView();
      const chartVisible = await analyticsPage.isTrendChartVisible();
      await expect(chartVisible).toBeTruthy();
      logger.info('Returned to chart view');
    });

    await test.step('Use zoom controls', async () => {
      await analyticsPage.zoomToRange('Sep-Nov 2026');
      const visibleMonths = await analyticsPage.getVisibleMonths();
      await expect(visibleMonths.length).toBe(3);
      logger.info('Zoomed to 3-month range');
    });
  });

  test('QE-7929 TS-002 TC-001 - Verify insufficient historical data message for new user', async ({ page }) => {
    logger.info('Starting test: QE-7929 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Launch with new user account', async () => {
      await analyticsPage.navigateWithUser('newuser-001');
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics loaded for new user');
    });

    await test.step('Navigate to Monthly Spend Trends', async () => {
      await analyticsPage.clickMonthlySpendTrendsTab();
      await analyticsPage.waitForTrendChartLoad();
      logger.info('Trend section loaded');
    });

    await test.step('Verify only one month data is displayed', async () => {
      const dataPoints = await analyticsPage.getDataPointCount();
      await expect(dataPoints).toBe(1);
      const amount = await analyticsPage.getMonthAmount('November 2026');
      await expect(amount).toBe('$1250.00');
      logger.info('Single data point verified');
    });

    await test.step('Verify informational message', async () => {
      const message = await analyticsPage.getInsufficientDataMessage();
      await expect(message).toContain('Insufficient historical data');
      await expect(message).toContain('At least 2 months');
      logger.info('Insufficient data message verified');
    });

    await test.step('Verify trend line is not displayed', async () => {
      const trendLineVisible = await analyticsPage.isTrendLineVisible();
      await expect(trendLineVisible).toBeFalsy();
      logger.info('No trend line displayed');
    });

    await test.step('Verify comparison section is disabled', async () => {
      const comparisonDisabled = await analyticsPage.isComparisonSectionDisabled();
      await expect(comparisonDisabled).toBeTruthy();
      logger.info('Comparison section disabled');
    });
  });

  test('QE-7929 TS-003 TC-001 - Verify highest and lowest spending months are highlighted', async ({ page }) => {
    logger.info('Starting test: QE-7929 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Navigate to Monthly Spend Trends', async () => {
      await analyticsPage.navigateToTrends();
      await analyticsPage.waitForTrendChartLoad();
      logger.info('Trend chart loaded');
    });

    await test.step('Verify highest spending month is highlighted', async () => {
      const highestMonth = await analyticsPage.getHighlightedHighestMonth();
      await expect(highestMonth.month).toBe('November 2026');
      await expect(highestMonth.amount).toBe('$3250.75');
      logger.info('Highest month highlighted: November');
    });

    await test.step('Verify lowest spending month is highlighted', async () => {
      const lowestMonth = await analyticsPage.getHighlightedLowestMonth();
      await expect(lowestMonth.month).toBe('August 2026');
      await expect(lowestMonth.amount).toBe('$2750.25');
      logger.info('Lowest month highlighted: August');
    });

    await test.step('Verify month-over-month percentage changes', async () => {
      const changes = await analyticsPage.getMonthOverMonthChanges();
      await expect(changes['Oct to Nov']).toBe('+9.06%');
      await expect(changes['Sep to Oct']).toBe('-3.86%');
      await expect(changes['Aug to Sep']).toBe('+12.71%');
      logger.info('Percentage changes verified');
    });

    await test.step('Verify spending variance summary', async () => {
      const summary = await analyticsPage.getVarianceSummary();
      await expect(summary.highest).toBe('Nov $3250.75');
      await expect(summary.lowest).toBe('Aug $2750.25');
      await expect(summary.variance).toContain('$500.50');
      logger.info('Variance summary verified');
    });
  });

  test('QE-7929 TS-003 TC-002 - Verify spending increase and decrease indicators', async ({ page }) => {
    logger.info('Starting test: QE-7929 TS-003 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Navigate to Monthly Spend Trends', async () => {
      await analyticsPage.navigateToTrends();
      await analyticsPage.waitForTrendChartLoad();
      logger.info('Trend chart displayed');
    });

    await test.step('Verify upward arrow indicators', async () => {
      const increaseMonths = await analyticsPage.getMonthsWithIncreaseIndicator();
      await expect(increaseMonths).toContain('Sep');
      await expect(increaseMonths).toContain('Nov');
      logger.info('Upward arrows verified');
    });

    await test.step('Verify downward arrow indicators', async () => {
      const decreaseMonths = await analyticsPage.getMonthsWithDecreaseIndicator();
      await expect(decreaseMonths).toContain('Aug');
      await expect(decreaseMonths).toContain('Oct');
      logger.info('Downward arrows verified');
    });

    await test.step('Click on increase indicator', async () => {
      const popup = await analyticsPage.clickIncreaseIndicator('Nov');
      await expect(popup).toContain('+$270.25');
      await expect(popup).toContain('+9.06%');
      logger.info('Increase detail popup verified');
    });

    await test.step('Click on decrease indicator', async () => {
      const popup = await analyticsPage.clickDecreaseIndicator('Oct');
      await expect(popup).toContain('-$119.50');
      await expect(popup).toContain('-3.86%');
      logger.info('Decrease detail popup verified');
    });

    await test.step('Verify first month has no indicator', async () => {
      const hasIndicator = await analyticsPage.hasComparisonIndicator('Jun');
      await expect(hasIndicator).toBeFalsy();
      logger.info('June has no comparison indicator');
    });
  });

  test('QE-7928 TS-001 TC-001 - Verify category-wise spending breakdown for all 9 categories', async ({ page }) => {
    logger.info('Starting test: QE-7928 TS-001 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Navigate to Spending Analytics', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics dashboard loaded');
    });

    await test.step('Select November 2026', async () => {
      await analyticsPage.selectMonth('November 2026');
      await analyticsPage.waitForDataUpdate();
      logger.info('November 2026 selected');
    });

    await test.step('Verify all 9 categories are displayed', async () => {
      const categories = await analyticsPage.getAllCategories();
      await expect(categories).toContain('Food & Dining');
      await expect(categories).toContain('Fuel');
      await expect(categories).toContain('Shopping');
      await expect(categories).toContain('Travel');
      await expect(categories).toContain('Entertainment');
      await expect(categories).toContain('Utilities');
      await expect(categories).toContain('Healthcare');
      await expect(categories).toContain('Education');
      await expect(categories).toContain('Miscellaneous');
      logger.info('All 9 categories verified');
    });

    await test.step('Verify Food & Dining amount and percentage', async () => {
      const data = await analyticsPage.getCategoryData('Food & Dining');
      await expect(data.amount).toBe('$850.00');
      await expect(data.percentage).toBe('26.15%');
      logger.info('Food & Dining verified');
    });

    await test.step('Verify all category amounts and percentages', async () => {
      const allData = await analyticsPage.getAllCategoryData();
      await expect(allData['Fuel']).toEqual({ amount: '$450.00', percentage: '13.85%' });
      await expect(allData['Shopping']).toEqual({ amount: '$920.50', percentage: '28.31%' });
      await expect(allData['Travel']).toEqual({ amount: '$300.00', percentage: '9.23%' });
      await expect(allData['Entertainment']).toEqual({ amount: '$280.25', percentage: '8.62%' });
      await expect(allData['Utilities']).toEqual({ amount: '$200.00', percentage: '6.15%' });
      await expect(allData['Healthcare']).toEqual({ amount: '$150.00', percentage: '4.62%' });
      await expect(allData['Education']).toEqual({ amount: '$50.00', percentage: '1.54%' });
      await expect(allData['Miscellaneous']).toEqual({ amount: '$50.00', percentage: '1.54%' });
      logger.info('All category data verified');
    });

    await test.step('Verify total percentages equal 100%', async () => {
      const totalPercentage = await analyticsPage.getTotalPercentage();
      await expect(totalPercentage).toBe('100.00%');
      logger.info('Total percentage verified: 100%');
    });

    await test.step('Verify total amounts equal monthly spend', async () => {
      const totalAmount = await analyticsPage.getTotalCategoryAmount();
      await expect(totalAmount).toBe('$3250.75');
      logger.info('Total amount verified: $3250.75');
    });
  });

  test('QE-7928 TS-001 TC-002 - Verify interactive pie chart visualization', async ({ page }) => {
    logger.info('Starting test: QE-7928 TS-001 TC-002');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Navigate to Spending Analytics', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics page loaded');
    });

    await test.step('Verify pie chart displays 9 segments', async () => {
      const segmentCount = await analyticsPage.getPieChartSegmentCount();
      await expect(segmentCount).toBe(9);
      logger.info('Pie chart has 9 segments');
    });

    await test.step('Verify largest segment is Shopping', async () => {
      const largestSegment = await analyticsPage.getLargestPieSegment();
      await expect(largestSegment.category).toBe('Shopping');
      await expect(largestSegment.percentage).toBe('28.31%');
      logger.info('Shopping is largest segment');
    });

    await test.step('Hover over each segment', async () => {
      const tooltips = await analyticsPage.hoverOverAllSegments();
      await expect(tooltips.length).toBe(9);
      logger.info('All segment tooltips verified');
    });

    await test.step('Click on Shopping segment', async () => {
      await analyticsPage.clickPieSegment('Shopping');
      const transactionList = await analyticsPage.getTransactionList();
      await expect(transactionList.count).toBe(12);
      await expect(transactionList.total).toBe('$920.50');
      logger.info('Shopping transactions displayed');
    });

    await test.step('Verify legend matches pie chart colors', async () => {
      const legendMatches = await analyticsPage.verifyLegendColors();
      await expect(legendMatches).toBeTruthy();
      logger.info('Legend colors match pie chart');
    });
  });

  test('QE-7928 TS-002 TC-001 - Verify uncategorized transactions handling', async ({ page }) => {
    logger.info('Starting test: QE-7928 TS-002 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Launch with user having uncategorized transactions', async () => {
      await analyticsPage.navigateWithUser('user-002');
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics loaded for user-002');
    });

    await test.step('Verify Miscellaneous includes uncategorized', async () => {
      const miscData = await analyticsPage.getCategoryData('Miscellaneous');
      await expect(miscData.amount).toBe('$175.00');
      logger.info('Miscellaneous amount includes uncategorized');
    });

    await test.step('Click on Miscellaneous category', async () => {
      await analyticsPage.clickCategory('Miscellaneous');
      await analyticsPage.waitForDetailView();
      logger.info('Miscellaneous detail view opened');
    });

    await test.step('Verify flagged transactions', async () => {
      const flaggedCount = await analyticsPage.getFlaggedTransactionCount();
      await expect(flaggedCount).toBe(3);
      logger.info('3 flagged transactions found');
    });

    await test.step('Verify flag tooltip', async () => {
      const tooltip = await analyticsPage.hoverOverFlag();
      await expect(tooltip).toContain('Auto-categorized');
      await expect(tooltip).toContain('Manual review recommended');
      logger.info('Flag tooltip verified');
    });

    await test.step('Verify summary message', async () => {
      const message = await analyticsPage.getFlaggedSummaryMessage();
      await expect(message).toContain('3 transactions');
      await expect(message).toContain('could not be automatically categorized');
      logger.info('Summary message verified');
    });

    await test.step('Click on flagged transaction', async () => {
      await analyticsPage.clickFlaggedTransaction('txn-unc-001');
      const popup = await analyticsPage.getTransactionDetailPopup();
      await expect(popup.amount).toBe('$45.00');
      await expect(popup.merchant).toBe('[Unknown]');
      logger.info('Transaction detail popup verified');
    });
  });

  test('QE-7928 TS-003 TC-001 - Verify zero transactions display', async ({ page }) => {
    logger.info('Starting test: QE-7928 TS-003 TC-001');
    const analyticsPage = new AnalyticsPage(page);
    
    await test.step('Launch with user having no transactions', async () => {
      await analyticsPage.navigateWithUser('user-003');
      await analyticsPage.waitForAnalyticsLoad();
      logger.info('Analytics loaded for user-003');
    });

    await test.step('Select December 2026', async () => {
      await analyticsPage.selectMonth('December 2026');
      await analyticsPage.waitForDataUpdate();
      logger.info('December 2026 selected');
    });

    await test.step('Verify all 9 categories are displayed', async () => {
      const categories = await analyticsPage.getAllCategories();
      await expect(categories.length).toBe(9);
      logger.info('All 9 categories displayed');
    });

    await test.step('Verify all categories show $0.00', async () => {
      const allZero = await analyticsPage.areAllCategoriesZero();
      await expect(allZero).toBeTruthy();
      logger.info('All categories show $0.00 (0.00%)');
    });

    await test.step('Verify total monthly spend is $0.00', async () => {
      const total = await analyticsPage.getTotalCategoryAmount();
      await expect(total).toBe('$0.00');
      logger.info('Total spend: $0.00');
    });

    await test.step('Verify informational message', async () => {
      const message = await analyticsPage.getNoDataMessage();
      await expect(message).toContain('No spending data available');
      await expect(message).toContain('December 2026');
      logger.info('No data message verified');
    });

    await test.step('Verify pie chart empty state', async () => {
      const emptyState = await analyticsPage.getPieChartEmptyState();
      await expect(emptyState).toContain('No data to display');
      logger.info('Pie chart shows empty state');
    });
  });

});