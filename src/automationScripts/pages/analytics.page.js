const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.analyticsTab = page.locator('[data-testid="analytics-tab"]');
    this.monthlySpendTrendsTab = page.locator('[data-testid="monthly-spend-trends-tab"]');
    this.categoryAnalyticsTab = page.locator('[data-testid="category-analytics-tab"]');
    
    // Chart Locators
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.pieChart = page.locator('[data-testid="pie-chart"]');
    this.trendLine = page.locator('[data-testid="trend-line"]');
    
    // Date and Filter Locators
    this.dateRangePicker = page.locator('[data-testid="date-range-picker"]');
    this.monthPicker = page.locator('[data-testid="month-picker"]');
    this.zoomControls = page.locator('[data-testid="zoom-controls"]');
    
    // Data Display Locators
    this.monthlyDataPoints = page.locator('[data-testid="month-data-point"]');
    this.categoryList = page.locator('[data-testid="category-list"]');
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.pieSegment = page.locator('[data-testid="pie-segment"]');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    
    // Detail View Locators
    this.detailView = page.locator('[data-testid="detail-view"]');
    this.categoryBreakdown = page.locator('[data-testid="category-breakdown"]');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.flaggedTransaction = page.locator('[data-testid="flagged-transaction"]');
    this.transactionDetailPopup = page.locator('[data-testid="transaction-detail-popup"]');
    
    // Indicator Locators
    this.increaseIndicator = page.locator('[data-testid="increase-indicator"]');
    this.decreaseIndicator = page.locator('[data-testid="decrease-indicator"]');
    this.highestMonthHighlight = page.locator('[data-testid="highest-month-highlight"]');
    this.lowestMonthHighlight = page.locator('[data-testid="lowest-month-highlight"]');
    this.varianceSummary = page.locator('[data-testid="variance-summary"]');
    
    // Comparison Locators
    this.comparisonSection = page.locator('[data-testid="comparison-section"]');
    this.chartLegend = page.locator('[data-testid="chart-legend"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    logger.info('Navigated to analytics page');
  }

  async navigateWithUser(userId) {
    await this.page.goto(`/analytics?userId=${userId}`);
    logger.info(`Navigated to analytics with user: ${userId}`);
  }

  async navigateToTrends() {
    await this.page.goto('/analytics/trends');
    logger.info('Navigated to trends section');
  }

  async waitForAnalyticsLoad() {
    await expect(this.analyticsTab).toBeVisible({ timeout: 10000 });
    logger.info('Analytics page loaded');
  }

  async clickMonthlySpendTrendsTab() {
    await expect(this.monthlySpendTrendsTab).toBeVisible();
    await this.monthlySpendTrendsTab.click();
    logger.info('Clicked Monthly Spend Trends tab');
  }

  async waitForTrendChartLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 10000 });
    logger.info('Trend chart loaded');
  }

  async selectDateRange(range) {
    await expect(this.dateRangePicker).toBeVisible();
    await this.dateRangePicker.click();
    await this.page.locator(`text=${range}`).click();
    logger.info(`Selected date range: ${range}`);
  }

  async waitForChartUpdate() {
    await this.page.waitForTimeout(1000);
    logger.info('Chart updated');
  }

  async getMonthlySpendData() {
    await expect(this.monthlyDataPoints.first()).toBeVisible();
    const dataPoints = await this.monthlyDataPoints.all();
    const monthlyData = {};
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const amount = await point.getAttribute('data-amount');
      monthlyData[month] = amount;
    }
    return monthlyData;
  }

  async isTrendLineVisible() {
    return await this.trendLine.isVisible();
  }

  async hoverOverMonth(month) {
    const dataPoint = this.page.locator(`[data-testid="month-data-point"][data-month="${month}"]`);
    await dataPoint.hover();
    const tooltip = this.page.locator('[data-testid="chart-tooltip"]');
    await expect(tooltip).toBeVisible();
    const monthText = await tooltip.locator('[data-testid="tooltip-month"]').textContent();
    const amountText = await tooltip.locator('[data-testid="tooltip-amount"]').textContent();
    return { month: monthText.trim(), amount: amountText.trim() };
  }

  async clickMonthDataPoint(month) {
    const dataPoint = this.page.locator(`[data-testid="month-data-point"][data-month="${month}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    logger.info(`Clicked on ${month} data point`);
  }

  async waitForDetailView() {
    await expect(this.detailView).toBeVisible({ timeout: 5000 });
    logger.info('Detail view loaded');
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdown).toBeVisible();
    const categories = await this.categoryItem.all();
    return categories;
  }

  async returnToChartView() {
    const backButton = this.page.locator('[data-testid="back-to-chart-button"]');
    await backButton.click();
    logger.info('Returned to chart view');
  }

  async isTrendChartVisible() {
    return await this.trendChart.isVisible();
  }

  async zoomToRange(range) {
    await expect(this.zoomControls).toBeVisible();
    await this.zoomControls.click();
    await this.page.locator(`[data-testid="zoom-option"][data-range="${range}"]`).click();
    logger.info(`Zoomed to range: ${range}`);
  }

  async getVisibleMonths() {
    const visiblePoints = await this.monthlyDataPoints.filter({ hasText: /.+/ }).all();
    return visiblePoints;
  }

  async getDataPointCount() {
    return await this.monthlyDataPoints.count();
  }

  async getMonthAmount(month) {
    const dataPoint = this.page.locator(`[data-testid="month-data-point"][data-month="${month}"]`);
    return await dataPoint.getAttribute('data-amount');
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async isComparisonSectionDisabled() {
    const isDisabled = await this.comparisonSection.getAttribute('disabled');
    return isDisabled !== null;
  }

  async getHighlightedHighestMonth() {
    await expect(this.highestMonthHighlight).toBeVisible();
    const month = await this.highestMonthHighlight.getAttribute('data-month');
    const amount = await this.highestMonthHighlight.getAttribute('data-amount');
    return { month, amount };
  }

  async getHighlightedLowestMonth() {
    await expect(this.lowestMonthHighlight).toBeVisible();
    const month = await this.lowestMonthHighlight.getAttribute('data-month');
    const amount = await this.lowestMonthHighlight.getAttribute('data-amount');
    return { month, amount };
  }

  async getMonthOverMonthChanges() {
    const changeElements = await this.page.locator('[data-testid="month-change"]').all();
    const changes = {};
    for (const elem of changeElements) {
      const period = await elem.getAttribute('data-period');
      const percentage = await elem.textContent();
      changes[period] = percentage.trim();
    }
    return changes;
  }

  async getVarianceSummary() {
    await expect(this.varianceSummary).toBeVisible();
    const highest = await this.varianceSummary.locator('[data-testid="highest-value"]').textContent();
    const lowest = await this.varianceSummary.locator('[data-testid="lowest-value"]').textContent();
    const variance = await this.varianceSummary.locator('[data-testid="variance-value"]').textContent();
    return { highest: highest.trim(), lowest: lowest.trim(), variance: variance.trim() };
  }

  async getMonthsWithIncreaseIndicator() {
    const indicators = await this.increaseIndicator.all();
    const months = [];
    for (const indicator of indicators) {
      const month = await indicator.getAttribute('data-month');
      months.push(month);
    }
    return months;
  }

  async getMonthsWithDecreaseIndicator() {
    const indicators = await this.decreaseIndicator.all();
    const months = [];
    for (const indicator of indicators) {
      const month = await indicator.getAttribute('data-month');
      months.push(month);
    }
    return months;
  }

  async clickIncreaseIndicator(month) {
    const indicator = this.page.locator(`[data-testid="increase-indicator"][data-month="${month}"]`);
    await indicator.click();
    const popup = this.page.locator('[data-testid="change-detail-popup"]');
    await expect(popup).toBeVisible();
    return await popup.textContent();
  }

  async clickDecreaseIndicator(month) {
    const indicator = this.page.locator(`[data-testid="decrease-indicator"][data-month="${month}"]`);
    await indicator.click();
    const popup = this.page.locator('[data-testid="change-detail-popup"]');
    await expect(popup).toBeVisible();
    return await popup.textContent();
  }

  async hasComparisonIndicator(month) {
    const increase = this.page.locator(`[data-testid="increase-indicator"][data-month="${month}"]`);
    const decrease = this.page.locator(`[data-testid="decrease-indicator"][data-month="${month}"]`);
    return (await increase.isVisible()) || (await decrease.isVisible());
  }

  async selectMonth(month) {
    await expect(this.monthPicker).toBeVisible();
    await this.monthPicker.selectOption({ label: month });
    logger.info(`Selected month: ${month}`);
  }

  async waitForDataUpdate() {
    await this.page.waitForTimeout(1000);
    logger.info('Data updated');
  }

  async getAllCategories() {
    const categories = await this.categoryItem.all();
    const categoryNames = [];
    for (const cat of categories) {
      const name = await cat.locator('[data-testid="category-name"]').textContent();
      categoryNames.push(name.trim());
    }
    return categoryNames;
  }

  async getCategoryData(categoryName) {
    const category = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await expect(category).toBeVisible();
    const amount = await category.locator('[data-testid="category-amount"]').textContent();
    const percentage = await category.locator('[data-testid="category-percentage"]').textContent();
    return { amount: amount.trim(), percentage: percentage.trim() };
  }

  async getAllCategoryData() {
    const categories = ['Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    const allData = {};
    for (const cat of categories) {
      allData[cat] = await this.getCategoryData(cat);
    }
    return allData;
  }

  async getTotalPercentage() {
    const totalElem = this.page.locator('[data-testid="total-percentage"]');
    await expect(totalElem).toBeVisible();
    return await totalElem.textContent();
  }

  async getTotalCategoryAmount() {
    const totalElem = this.page.locator('[data-testid="total-amount"]');
    await expect(totalElem).toBeVisible();
    return await totalElem.textContent();
  }

  async getPieChartSegmentCount() {
    return await this.pieSegment.count();
  }

  async getLargestPieSegment() {
    const segments = await this.pieSegment.all();
    let largest = null;
    let maxPercentage = 0;
    for (const segment of segments) {
      const percentage = parseFloat(await segment.getAttribute('data-percentage'));
      if (percentage > maxPercentage) {
        maxPercentage = percentage;
        largest = {
          category: await segment.getAttribute('data-category'),
          percentage: `${percentage}%`
        };
      }
    }
    return largest;
  }

  async hoverOverAllSegments() {
    const segments = await this.pieSegment.all();
    const tooltips = [];
    for (const segment of segments) {
      await segment.hover();
      const tooltip = this.page.locator('[data-testid="pie-tooltip"]');
      await expect(tooltip).toBeVisible();
      tooltips.push(await tooltip.textContent());
    }
    return tooltips;
  }

  async clickPieSegment(category) {
    const segment = this.page.locator(`[data-testid="pie-segment"][data-category="${category}"]`);
    await segment.click();
    logger.info(`Clicked on ${category} pie segment`);
  }

  async getTransactionList() {
    await expect(this.transactionList).toBeVisible();
    const count = await this.transactionList.locator('[data-testid="transaction-item"]').count();
    const total = await this.transactionList.locator('[data-testid="transaction-total"]').textContent();
    return { count, total: total.trim() };
  }

  async verifyLegendColors() {
    const legend = await this.chartLegend.isVisible();
    return legend;
  }

  async clickCategory(categoryName) {
    const category = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await category.click();
    logger.info(`Clicked on ${categoryName} category`);
  }

  async getFlaggedTransactionCount() {
    return await this.flaggedTransaction.count();
  }

  async hoverOverFlag() {
    await this.flaggedTransaction.first().hover();
    const tooltip = this.page.locator('[data-testid="flag-tooltip"]');
    await expect(tooltip).toBeVisible();
    return await tooltip.textContent();
  }

  async getFlaggedSummaryMessage() {
    const message = this.page.locator('[data-testid="flagged-summary-message"]');
    await expect(message).toBeVisible();
    return await message.textContent();
  }

  async clickFlaggedTransaction(transactionId) {
    const transaction = this.page.locator(`[data-testid="flagged-transaction"][data-transaction-id="${transactionId}"]`);
    await transaction.click();
    logger.info(`Clicked on flagged transaction: ${transactionId}`);
  }

  async getTransactionDetailPopup() {
    await expect(this.transactionDetailPopup).toBeVisible();
    const amount = await this.transactionDetailPopup.locator('[data-testid="transaction-amount"]').textContent();
    const merchant = await this.transactionDetailPopup.locator('[data-testid="transaction-merchant"]').textContent();
    return { amount: amount.trim(), merchant: merchant.trim() };
  }

  async areAllCategoriesZero() {
    const categories = await this.categoryItem.all();
    for (const cat of categories) {
      const amount = await cat.locator('[data-testid="category-amount"]').textContent();
      if (amount.trim() !== '$0.00') return false;
    }
    return true;
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async getPieChartEmptyState() {
    const emptyState = this.page.locator('[data-testid="pie-chart-empty-state"]');
    await expect(emptyState).toBeVisible();
    return await emptyState.textContent();
  }
};