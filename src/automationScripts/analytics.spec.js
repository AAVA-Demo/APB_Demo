const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Credit Card Analytics - Spending Visualization and Trends', () => {
  let analyticsPage;

  test.beforeEach(async ({ page }) => {
    analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.login('testuser_12months', 'Test@123');
  });

  test('QE-8929 TS-001 TC-001 - Verify interactive pie chart displays spending breakdown across all 9 predefined categories', async ({ page }) => {
    await analyticsPage.navigateToSpendingAnalytics();
    await expect(analyticsPage.categoryPieChart).toBeVisible();
    const categories = await analyticsPage.getCategoryList();
    expect(categories).toHaveLength(9);
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    const percentageSum = await analyticsPage.calculateTotalPercentage();
    expect(percentageSum).toBeCloseTo(100, 1);
  });

  test('QE-8929 TS-002 TC-001 - Verify category detail tooltip displays comprehensive information on hover', async ({ page }) => {
    await analyticsPage.navigateToSpendingAnalytics();
    await analyticsPage.hoverOverCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    const tooltipData = await analyticsPage.getTooltipData();
    expect(tooltipData.categoryName).toBe('Food & Dining');
    expect(tooltipData.totalSpend).toContain('$');
    expect(tooltipData.transactionCount).toMatch(/\d+/);
    expect(tooltipData.percentage).toContain('%');
  });

  test('QE-8929 TS-002 TC-002 - Verify category detail panel displays information on click interaction', async ({ page }) => {
    await analyticsPage.navigateToSpendingAnalytics();
    await analyticsPage.clickCategory('Shopping');
    await expect(analyticsPage.categoryDetailPanel).toBeVisible();
    const detailData = await analyticsPage.getDetailPanelData();
    expect(detailData.categoryName).toBe('Shopping');
    expect(detailData.totalSpend).toContain('$');
    expect(detailData.transactionCount).toMatch(/\d+/);
    expect(detailData.percentage).toContain('%');
    await analyticsPage.closeDetailPanel();
    await analyticsPage.clickCategory('Fuel');
    const newDetailData = await analyticsPage.getDetailPanelData();
    expect(newDetailData.categoryName).toBe('Fuel');
    expect(newDetailData.categoryName).not.toBe('Shopping');
  });

  test('QE-8929 TS-003 TC-001 - Verify appropriate message when user has insufficient transaction data', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('newuser_2txns', 'Test@123');
    await analyticsPage.navigateToSpendingAnalytics();
    const emptyStateMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('Insufficient data');
    expect(emptyStateMessage).toContain('category breakdown');
    await expect(analyticsPage.categoryPieChart).not.toBeVisible();
    const hasGuidance = await analyticsPage.hasUserGuidance();
    expect(hasGuidance).toBe(true);
  });

  test('QE-8929 TS-003 TC-002 - Verify system behavior when user has no transaction history in selected date range', async ({ page }) => {
    await analyticsPage.navigateToSpendingAnalytics();
    await analyticsPage.selectDateRange('2025-01-01', '2025-01-31');
    const emptyStateMessage = await analyticsPage.getEmptyStateMessage();
    expect(emptyStateMessage).toContain('No transaction history');
    expect(emptyStateMessage).toContain('selected date range');
    await expect(analyticsPage.categoryPieChart).not.toBeVisible();
    const isDateSelectorFunctional = await analyticsPage.isDateSelectorVisible();
    expect(isDateSelectorFunctional).toBe(true);
  });

  test('QE-8926 TS-001 TC-001 - Verify 12-month trend line graph displays with accurate data points and renders under 1 second', async ({ page }) => {
    await analyticsPage.navigateToSpendingTrends();
    const startTime = Date.now();
    await expect(analyticsPage.trendLineGraph).toBeVisible();
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1000);
    const dataPoints = await analyticsPage.getTrendDataPoints();
    expect(dataPoints).toHaveLength(12);
    const labels = await analyticsPage.getTrendLabels();
    expect(labels).toContain('Jan 2023');
    expect(labels).toContain('Dec 2023');
    const yAxisScale = await analyticsPage.verifyYAxisScale();
    expect(yAxisScale).toBe(true);
  });

  test('QE-8926 TS-002 TC-001 - Verify month detail tooltip displays on hover with spend amount and comparison', async ({ page }) => {
    await analyticsPage.navigateToSpendingTrends();
    await analyticsPage.hoverOverTrendDataPoint('March 2023');
    await expect(analyticsPage.trendTooltip).toBeVisible();
    const tooltipData = await analyticsPage.getTrendTooltipData();
    expect(tooltipData.month).toContain('March 2023');
    expect(tooltipData.totalSpend).toContain('$');
    expect(tooltipData.comparison).toMatch(/[+-]?\d+\.?\d*%/);
    await analyticsPage.hoverOverTrendDataPoint('June 2023');
    const newTooltipData = await analyticsPage.getTrendTooltipData();
    expect(newTooltipData.month).toContain('June 2023');
  });

  test('QE-8926 TS-002 TC-002 - Verify month detail displays on click with comprehensive spending information', async ({ page }) => {
    await analyticsPage.navigateToSpendingTrends();
    await analyticsPage.clickTrendDataPoint('September 2023');
    await expect(analyticsPage.trendDetailPanel).toBeVisible();
    const detailData = await analyticsPage.getTrendDetailData();
    expect(detailData.month).toContain('September 2023');
    expect(detailData.totalSpend).toContain('$');
    expect(detailData.percentageChange).toMatch(/[↑↓]\s*\d+\.?\d*%/);
    await analyticsPage.closeTrendDetailPanel();
    await analyticsPage.clickTrendDataPoint('November 2023');
    const newDetailData = await analyticsPage.getTrendDetailData();
    expect(newDetailData.month).toContain('November 2023');
  });

  test('QE-8926 TS-003 TC-001 - Verify appropriate message when user has fewer than 3 months of transaction history', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('newuser_2months', 'Test@123');
    await analyticsPage.navigateToSpendingTrends();
    const emptyStateMessage = await analyticsPage.getTrendEmptyStateMessage();
    expect(emptyStateMessage).toContain('At least 3 months');
    expect(emptyStateMessage).toContain('trend analysis');
    await expect(analyticsPage.trendLineGraph).not.toBeVisible();
  });

  test('QE-8926 TS-003 TC-002 - Verify system behavior when user has zero transaction history', async ({ page }) => {
    await analyticsPage.navigate();
    await analyticsPage.login('newuser_notxns', 'Test@123');
    await analyticsPage.navigateToSpendingTrends();
    const emptyStateMessage = await analyticsPage.getTrendEmptyStateMessage();
    expect(emptyStateMessage).toContain('No transaction history');
    await expect(analyticsPage.trendLineGraph).not.toBeVisible();
    const hasEmptyChartElements = await analyticsPage.hasEmptyChartElements();
    expect(hasEmptyChartElements).toBe(false);
  });
});