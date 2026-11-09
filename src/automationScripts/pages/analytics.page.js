const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsHeader = page.locator('h1:has-text("Analytics")');
    this.categoryChartContainer = page.locator('.category-chart-container');
    this.monthlyTrendChart = page.locator('.monthly-trend-chart');
    this.noDataMessage = page.locator('.no-data-message');
    this.insufficientDataMessage = page.locator('.insufficient-data-message');
    this.categoryItems = page.locator('.category-item');
    this.chartTooltip = page.locator('.chart-tooltip');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await expect(this.analyticsHeader).toBeVisible();
  }

  async navigateToCategoryAnalysis() {
    const categoryTab = this.page.locator('button:has-text("Category Analysis")');
    await categoryTab.click();
    await expect(this.categoryChartContainer).toBeVisible();
  }

  async getCategoryAmount(categoryName) {
    const categoryItem = this.page.locator(`.category-item:has-text("${categoryName}")`);
    const amountText = await categoryItem.locator('[data-field="amount"]').textContent();
    return parseFloat(amountText.replace(/[^0-9.]/g, ''));
  }

  async getCategoryPercentage(categoryName) {
    const categoryItem = this.page.locator(`.category-item:has-text("${categoryName}")`);
    const percentageText = await categoryItem.locator('[data-field="percentage"]').textContent();
    return parseFloat(percentageText.replace(/[^0-9.]/g, ''));
  }

  async getTotalSpending() {
    const totalElement = this.page.locator('[data-field="total-spending"]');
    const totalText = await totalElement.textContent();
    return parseFloat(totalText.replace(/[^0-9.]/g, ''));
  }

  async getTotalPercentage() {
    const totalElement = this.page.locator('[data-field="total-percentage"]');
    const percentageText = await totalElement.textContent();
    return parseFloat(percentageText.replace(/[^0-9.]/g, ''));
  }

  async getNoDataMessage() {
    return await this.noDataMessage.textContent();
  }

  async isChartEmpty() {
    const chartData = await this.categoryChartContainer.locator('.chart-data-point').count();
    return chartData === 0;
  }

  async getMonthsOnXAxis() {
    const xAxisLabels = this.page.locator('.x-axis-label');
    const count = await xAxisLabels.count();
    const months = [];
    for (let i = 0; i < count; i++) {
      months.push(await xAxisLabels.nth(i).textContent());
    }
    return months;
  }

  async getYAxisRange() {
    const minLabel = await this.page.locator('.y-axis-min').textContent();
    const maxLabel = await this.page.locator('.y-axis-max').textContent();
    return {
      min: parseFloat(minLabel.replace(/[^0-9.]/g, '')),
      max: parseFloat(maxLabel.replace(/[^0-9.]/g, ''))
    };
  }

  async getMonthlySpendAmount(month) {
    const dataPoint = this.page.locator(`[data-month="${month}"]`);
    const amountText = await dataPoint.getAttribute('data-amount');
    return parseFloat(amountText);
  }

  async hoverOverDataPoint(month) {
    const dataPoint = this.page.locator(`[data-month="${month}"]`);
    await dataPoint.hover();
    await expect(this.chartTooltip).toBeVisible();
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async isChartInteractive() {
    const chart = this.monthlyTrendChart;
    const hasHoverEvents = await chart.evaluate(el => {
      return el.style.cursor === 'pointer' || el.hasAttribute('data-interactive');
    });
    return hasHoverEvents;
  }

  async getInsufficientDataMessage() {
    return await this.insufficientDataMessage.textContent();
  }

  async hasMinimalChartData() {
    const dataPoints = await this.page.locator('.chart-data-point').count();
    return dataPoints <= 1;
  }

  async getCurrentMonthData() {
    const currentMonthPoint = this.page.locator('[data-current-month="true"]');
    const count = await currentMonthPoint.count();
    if (count === 0) return null;
    
    const amountText = await currentMonthPoint.getAttribute('data-amount');
    return {
      amount: parseFloat(amountText)
    };
  }

  async hasContinuousTrendLine() {
    const trendLine = this.page.locator('.trend-line');
    await expect(trendLine).toBeVisible();
    const pathData = await trendLine.getAttribute('d');
    return pathData && pathData.length > 0;
  }
};
