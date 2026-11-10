const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.SpendingTrendsPage = class SpendingTrendsPage {
  constructor(page) {
    this.page = page;
    this.trendsContainer = page.locator('.spending-trends-container');
    this.trendChart = page.locator('.trend-chart');
    this.categoryFilter = page.locator('.category-filter');
    this.tooltip = page.locator('.chart-tooltip');
    this.insufficientDataMessage = page.locator('.insufficient-data-message');
    this.chartTitle = page.locator('.chart-title');
    this.loadingIndicator = page.locator('.loading-spinner');
  }

  async navigateToSpendingTrends() {
    logger.info('Navigating to spending trends page');
    await this.page.click('a[href="/trends"]');
    await this.page.waitForLoadState('networkidle');
    logger.info('Spending trends page loaded');
  }

  async waitForTrendChartLoad() {
    logger.info('Waiting for trend chart to load');
    await expect(this.trendChart).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    if (await this.loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.loadingIndicator).toBeHidden({ timeout: 5000 });
    }
    logger.info('Trend chart loaded');
  }

  async getDataPointCount() {
    const dataPoints = await this.page.locator('.chart-data-point').count();
    return dataPoints;
  }

  async getMonthLabels() {
    const labels = [];
    const labelElements = await this.page.locator('.chart-month-label').all();
    for (const element of labelElements) {
      const text = await element.textContent();
      labels.push(text.trim());
    }
    return labels;
  }

  async hoverOverDataPoint(index) {
    logger.info(`Hovering over data point: ${index}`);
    const dataPoint = this.page.locator('.chart-data-point').nth(index);
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
    logger.info('Data point hovered');
  }

  async getTooltipText() {
    await expect(this.tooltip).toBeVisible();
    return await this.tooltip.textContent();
  }

  async getInsufficientDataText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async selectCategoryFilter(categoryName) {
    logger.info(`Selecting category filter: ${categoryName}`);
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption({ label: categoryName });
    logger.info('Category filter selected');
  }

  async waitForChartUpdate() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async getTotalSpending() {
    const totalElement = this.page.locator('.total-spending-value');
    await expect(totalElement).toBeVisible();
    const text = await totalElement.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getChartTitle() {
    await expect(this.chartTitle).toBeVisible();
    return await this.chartTitle.textContent();
  }
};