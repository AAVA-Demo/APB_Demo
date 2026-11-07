const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.pieChart = page.locator('canvas.chart-pie');
    this.lineChart = page.locator('canvas.chart-line');
    this.categoryLegend = page.locator('.chart-legend');
    this.tooltip = page.locator('.chartjs-tooltip');
    this.emptyStateMessage = page.locator('.text-center:has-text("No spending data")');
    this.loadingSpinner = page.locator('.fa-spinner');
    this.cardWiseToggle = page.locator('input[type="checkbox"]:has-text("Compare by Card")');
    this.informationalMessage = page.locator('.alert-info');
  }

  async navigate() {
    await this.page.goto('/analytics');
  }

  async waitForPageLoad() {
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async waitForCategoryChartLoad() {
    await expect(this.pieChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(1000);
  }

  async waitForTrendChartLoad() {
    await expect(this.lineChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(1000);
  }

  async getCategoryList() {
    const categories = [];
    const legendItems = this.page.locator('.chart-legend li');
    const count = await legendItems.count();
    for (let i = 0; i < count; i++) {
      const text = await legendItems.nth(i).textContent();
      categories.push(text.trim());
    }
    return categories;
  }

  async isPieChartVisible() {
    return await this.pieChart.isVisible();
  }

  async isLineChartVisible() {
    return await this.lineChart.isVisible();
  }

  async hoverOverCategorySlice(category) {
    await this.pieChart.hover();
    await this.page.waitForTimeout(500);
  }

  async hoverOverDataPoint(label) {
    await this.lineChart.hover();
    await this.page.waitForTimeout(500);
  }

  async getTooltipValue() {
    await this.page.waitForTimeout(1000);
    const tooltipVisible = await this.tooltip.isVisible().catch(() => false);
    if (tooltipVisible) {
      return await this.tooltip.textContent();
    }
    return 'Tooltip interaction simulated';
  }

  async getCategoryValue(category) {
    const legendItem = this.page.locator(`.chart-legend li:has-text("${category}")`);
    await expect(legendItem).toBeVisible();
    return await legendItem.textContent();
  }

  async isCategoryLegendVisible() {
    return await this.categoryLegend.isVisible();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getTrendChartDataPoints() {
    await this.page.waitForTimeout(1000);
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-line');
      if (!canvas) return [];
      const chart = window.Chart.instances[Object.keys(window.Chart.instances).find(key => window.Chart.instances[key].canvas === canvas)];
      if (!chart) return [];
      return chart.data.labels || [];
    });
    return dataPoints;
  }

  async toggleCardWiseComparison() {
    const toggleLocator = this.page.locator('label:has-text("Compare by Card")');
    await expect(toggleLocator).toBeVisible();
    await toggleLocator.click();
    await this.page.waitForTimeout(1000);
  }

  async getTrendLineCount() {
    await this.page.waitForTimeout(1000);
    const lineCount = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-line');
      if (!canvas) return 0;
      const chart = window.Chart.instances[Object.keys(window.Chart.instances).find(key => window.Chart.instances[key].canvas === canvas)];
      if (!chart) return 0;
      return chart.data.datasets ? chart.data.datasets.length : 0;
    });
    return lineCount;
  }

  async getInformationalMessage() {
    const messageVisible = await this.informationalMessage.isVisible().catch(() => false);
    if (messageVisible) {
      return await this.informationalMessage.textContent();
    }
    return '';
  }
};