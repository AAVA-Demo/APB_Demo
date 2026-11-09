const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryChart = page.locator('#categoryChart');
    this.trendChart = page.locator('#trendChart');
    this.categoryTooltip = page.locator('.chart-tooltip');
    this.noDataMessage = page.locator('.no-data-message');
    this.insufficientDataMessage = page.locator('.insufficient-data-message');
  }

  async navigate() {
    await this.page.goto('/analytics');
    logger.info('Analytics page loaded');
  }

  async waitForCategoryChart() {
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
  }

  async getCategoryNames() {
    // This assumes the chart library exposes category data in the DOM
    const categories = await this.page.evaluate(() => {
      const chart = document.querySelector('#categoryChart');
      if (!chart) return [];
      // Extract from Chart.js data structure
      const chartInstance = Chart.getChart(chart);
      return chartInstance ? chartInstance.data.labels : [];
    });
    return categories;
  }

  async getCategoryAmount(categoryName) {
    const amount = await this.page.evaluate((name) => {
      const chart = document.querySelector('#categoryChart');
      if (!chart) return 0;
      const chartInstance = Chart.getChart(chart);
      if (!chartInstance) return 0;
      const index = chartInstance.data.labels.indexOf(name);
      return index >= 0 ? chartInstance.data.datasets[0].data[index] : 0;
    }, categoryName);
    return amount;
  }

  async hoverOnCategory(categoryName) {
    // Hover on the chart segment corresponding to the category
    await this.categoryChart.hover();
    await this.page.waitForTimeout(500); // Wait for tooltip to appear
  }

  async getMonthlyTrendData() {
    const data = await this.page.evaluate(() => {
      const chart = document.querySelector('#trendChart');
      if (!chart) return [];
      const chartInstance = Chart.getChart(chart);
      return chartInstance ? chartInstance.data.labels : [];
    });
    return data;
  }
};
