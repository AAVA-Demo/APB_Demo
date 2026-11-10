const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.AnalyticsPage = class AnalyticsPage extends BasePage {
  constructor(page) {
    super(page);
    this.monthlyTrendChart = page.locator('canvas#monthlyTrendChart, [data-testid="monthly-trend-chart"]');
    this.categoryChart = page.locator('canvas#categoryChart, [data-testid="category-chart"]');
    this.chartTooltip = page.locator('.chartjs-tooltip, [role="tooltip"]');
    this.monthlyTrendTab = page.locator('a:has-text("Monthly Trends"), [data-testid="monthly-tab"]');
    this.categoryTab = page.locator('a:has-text("Category-wise"), [data-testid="category-tab"]');
    this.cardTab = page.locator('a:has-text("Card-wise"), [data-testid="card-tab"]');
    this.insufficientDataMessage = page.locator('text=/Insufficient data to display trends/i');
    this.partialChart = page.locator('canvas');
    this.errorNotification = page.locator('text=/Unable to load spending trends/i');
    this.retryButton = page.locator('button:has-text("Retry"), [data-testid="retry-button"]');
    this.chartLegend = page.locator('.chart-legend, [data-testid="chart-legend"]');
    this.noDataMessage = page.locator('text=/No spending data available/i');
    this.dateRangeSelector = page.locator('select[name="dateRange"], [data-testid="date-range-selector"]');
    this.historicalDataLink = page.locator('a:has-text("view past periods"), [data-testid="historical-data-link"]');
    this.warningIndicator = page.locator('text=/Some transactions could not be categorized/i');
  }

  async navigate() {
    await super.navigate('/analytics');
    await this.waitForAnalyticsLoad();
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async selectMonthlyTrendView() {
    await this.clickElement(this.monthlyTrendTab);
    await this.page.waitForTimeout(500);
  }

  async selectCategoryView() {
    await this.clickElement(this.categoryTab);
    await this.page.waitForTimeout(500);
  }

  async selectCardView() {
    await this.clickElement(this.cardTab);
    await this.page.waitForTimeout(500);
  }

  async getChartDataPoints() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.datasets[0].data;
    });
  }

  async getChartMonthLabels() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.labels;
    });
  }

  async hoverOverDataPoint(index) {
    const canvas = this.monthlyTrendChart;
    const box = await canvas.boundingBox();
    const pointX = box.x + (box.width / 12) * (index + 0.5);
    const pointY = box.y + box.height / 2;
    await this.page.mouse.move(pointX, pointY);
    await this.page.waitForTimeout(500);
  }

  async getCategoryLabels() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.labels;
    });
  }

  async getCategoryPercentages() {
    const labels = await this.page.locator('.chart-legend li, [data-testid="legend-item"]').allTextContents();
    return labels.filter(label => label.includes('%'));
  }

  async getCategoryColors() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.datasets[0].backgroundColor;
    });
  }

  async hoverOverCategory(categoryName) {
    const legendItem = this.page.locator(`.chart-legend li:has-text("${categoryName}"), [data-category="${categoryName}"]`);
    await this.hoverElement(legendItem);
    await this.page.waitForTimeout(500);
  }

  async getLegendItems() {
    return await this.page.locator('.chart-legend li, [data-testid="legend-item"]').all();
  }

  async getCategoryAmount(categoryName) {
    const tableRow = this.page.locator(`table tbody tr:has-text("${categoryName}")`);
    const amountCell = tableRow.locator('td:nth-child(2)');
    return await this.getText(amountCell);
  }

  async selectDateRange(range) {
    await this.selectDropdown(this.dateRangeSelector, range);
  }

  async clickHistoricalDataLink() {
    await this.clickElement(this.historicalDataLink);
  }

  async clickRetryButton() {
    await this.clickElement(this.retryButton);
  }
};