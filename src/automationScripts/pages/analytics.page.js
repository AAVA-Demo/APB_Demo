const { expect } = require('@playwright/test');
const config = require('../../config/config');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.trendChart = page.locator('.trend-chart, [data-testid="trend-chart"]');
    this.categoryChart = page.locator('.category-chart, [data-testid="category-chart"]');
    this.chartMonths = page.locator('.chart-month, .x-axis-label');
    this.chartDataPoints = page.locator('.chart-data-point');
    this.notification = page.locator('.notification, .alert-info');
    this.noDataMessage = page.locator('.no-data-message');
    this.emptyChartState = page.locator('.empty-chart-state');
    this.categoryLabels = page.locator('.category-label');
    this.categoryData = page.locator('.category-data-item');
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/analytics`);
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to analytics page');
  }

  async waitForTrendChartToLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 5000 });
    logger.info('Trend chart loaded');
  }

  async getTrendChartMonthCount() {
    await this.waitForTrendChartToLoad();
    return await this.chartMonths.count();
  }

  async getMonthlyTotals() {
    await this.waitForTrendChartToLoad();
    const dataPoints = await this.chartDataPoints.allTextContents();
    return dataPoints.map(point => {
      const match = point.match(/\$([\d,]+)/);
      return match ? parseFloat(match[1].replace(',', '')) : 0;
    });
  }

  async isChartInteractive() {
    await this.waitForTrendChartToLoad();
    const firstDataPoint = this.chartDataPoints.first();
    await firstDataPoint.hover();
    // Check if tooltip or hover effect appears
    const tooltip = this.page.locator('.chart-tooltip');
    return await tooltip.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async waitForNotification() {
    await expect(this.notification).toBeVisible({ timeout: 5000 });
    logger.info('Notification displayed');
  }

  async getNotificationText() {
    await expect(this.notification).toBeVisible();
    return await this.notification.textContent();
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async hasEmptyChartState() {
    return await this.emptyChartState.isVisible();
  }

  async waitForCategoryChartToLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
    logger.info('Category chart loaded');
  }

  async isCategoryChartVisible() {
    return await this.categoryChart.isVisible();
  }

  async getCategoryNames() {
    await this.waitForCategoryChartToLoad();
    return await this.categoryLabels.allTextContents();
  }

  async getCategoryData() {
    await this.waitForCategoryChartToLoad();
    const dataItems = await this.categoryData.allTextContents();
    const categoryData = {};
    dataItems.forEach(item => {
      const match = item.match(/(.+):\s*\$([\d,]+)\s*\((\d+)%\)/);
      if (match) {
        categoryData[match[1].trim()] = {
          amount: parseFloat(match[2].replace(',', '')),
          percentage: parseFloat(match[3])
        };
      }
    });
    return categoryData;
  }
};