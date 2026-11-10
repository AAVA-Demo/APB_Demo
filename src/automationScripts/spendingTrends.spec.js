const { test, expect } = require('@playwright/test');
const { SpendingTrendsPage } = require('./pages/spendingTrends.page');

test.describe('Spending Trends and Card-wise Analysis', () => {

  test('TC-8055: Verify interactive trend chart displays monthly spending trends with accurate data points for 12 months', async ({ page }) => {
    const trendsPage = new SpendingTrendsPage(page);
    await trendsPage.navigate();
    await trendsPage.authenticate('testuser_12months', 'Test@123');
    
    await trendsPage.navigateToTrends();
    
    await expect(trendsPage.trendChart).toBeVisible();
    
    const dataPointCount = await trendsPage.getTrendDataPointCount();
    expect(dataPointCount).toBe(12);
    
    await trendsPage.hoverOverDataPoint(5);
    await expect(trendsPage.chartTooltip).toBeVisible();
    
    const tooltipText = await trendsPage.getTooltipText();
    expect(tooltipText).toMatch(/₹[0-9,]+/);
    
    const renderTime = await trendsPage.measureChartRenderTime();
    expect(renderTime).toBeLessThan(2000);
  });

  test('TC-8056: Verify system displays insufficient historical data message when user has less than 3 months transaction history', async ({ page }) => {
    const trendsPage = new SpendingTrendsPage(page);
    await trendsPage.navigate();
    await trendsPage.authenticate('testuser_2months', 'Test@123');
    
    await trendsPage.navigateToTrends();
    
    await expect(trendsPage.insufficientDataMessage).toBeVisible();
    const message = await trendsPage.getInsufficientDataMessage();
    expect(message).toContain('Insufficient historical data');
    expect(message).toContain('At least 3 months');
    
    const chartVisible = await trendsPage.isChartVisible();
    expect(chartVisible).toBe(false);
  });

  test('TC-8057: Verify system displays timeout error with retry option when analytics engine exceeds 3-second threshold', async ({ page }) => {
    const trendsPage = new SpendingTrendsPage(page);
    await trendsPage.navigate();
    await trendsPage.authenticate('testuser', 'Test@123');
    
    await page.route('**/api/analytics/trends', route => {
      setTimeout(() => route.abort('timedout'), 4000);
    });
    
    await trendsPage.navigateToTrends();
    
    await expect(trendsPage.timeoutErrorMessage).toBeVisible({ timeout: 10000 });
    const errorText = await trendsPage.getTimeoutErrorMessage();
    expect(errorText).toContain('Request timed out');
    
    await expect(trendsPage.retryButton).toBeVisible();
    
    await trendsPage.clickRetry();
  });

  test('TC-8043: Verify card-wise spending breakdown displays accurate totals and percentage distribution for 6 months', async ({ page }) => {
    const trendsPage = new SpendingTrendsPage(page);
    await trendsPage.navigate();
    await trendsPage.authenticate('testuser_multicard', 'Test@123');
    
    await trendsPage.navigateToCardwiseAnalysis();
    
    await expect(trendsPage.cardwiseChart).toBeVisible();
    
    const cardCount = await trendsPage.getCardCount();
    expect(cardCount).toBe(3);
    
    const percentages = await trendsPage.getCardPercentages();
    const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
    expect(totalPercentage).toBe(100);
    
    const dateRange = await trendsPage.getDateRange();
    expect(dateRange).toContain('Last 6 months');
  });

  test('TC-8044: Verify system behavior when user selects a date range exceeding 12-month historical data retention policy', async ({ page }) => {
    const trendsPage = new SpendingTrendsPage(page);
    await trendsPage.navigate();
    await trendsPage.authenticate('testuser', 'Test@123');
    
    await trendsPage.navigateToCardwiseAnalysis();
    
    await trendsPage.openDateRangePicker();
    await trendsPage.selectCustomDateRange('2 years ago', 'Current date');
    await trendsPage.applyDateFilter();
    
    await expect(trendsPage.dataRetentionNotification).toBeVisible();
    const notification = await trendsPage.getDataRetentionNotification();
    expect(notification).toContain('Data retention policy limits historical data to 12 months');
    
    const displayedData = await trendsPage.getDisplayedDataPeriod();
    expect(displayedData).toBeLessThanOrEqual(12);
  });

  test('TC-8045: Verify time-based filter correctly displays card-wise spending for a specific month with comparison capability', async ({ page }) => {
    const trendsPage = new SpendingTrendsPage(page);
    await trendsPage.navigate();
    await trendsPage.authenticate('testuser', 'Test@123');
    
    await trendsPage.navigateToCardwiseAnalysis();
    
    await trendsPage.selectMonth('January 2024');
    
    await expect(trendsPage.cardwiseChart).toBeVisible();
    
    const displayedMonth = await trendsPage.getDisplayedMonth();
    expect(displayedMonth).toBe('January 2024');
    
    await expect(trendsPage.comparisonDropdown).toBeVisible();
    
    await trendsPage.selectComparisonMonth('February 2024');
    
    await expect(trendsPage.comparisonChart).toBeVisible();
  });

});
