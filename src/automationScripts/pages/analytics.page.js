const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsLink = page.locator('a[href*="analytics"]');
    this.categoryPieChart = page.locator('.spending-chart[data-type="category"]');
    this.trendLineGraph = page.locator('.spending-chart[data-type="trend"]');
    this.categoryTooltip = page.locator('.chart-tooltip');
    this.trendTooltip = page.locator('.trend-tooltip');
    this.noDataMessage = page.locator('.no-data-message');
    this.placeholderChart = page.locator('.placeholder-chart');
    this.errorMessage = page.locator('.error-message');
    this.retryButton = page.locator('button.retry-button');
    this.navigationMenu = page.locator('nav.navbar');
    this.trendAnalysisTab = page.locator('[data-tab="trend-analysis"]');
    this.limitedDataMessage = page.locator('.limited-data-message');
    this.xAxisLabel = page.locator('.chart-axis-x');
    this.yAxisLabel = page.locator('.chart-axis-y');
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForSelector('.analytics-container', { state: 'visible', timeout: 5000 });
  }

  async getAllCategorySegments() {
    const segments = await this.categoryPieChart.locator('.chart-segment').allTextContents();
    return segments;
  }

  async getCategoryAmounts() {
    const amounts = {};
    const rows = await this.page.locator('.category-breakdown tr').all();
    for (const row of rows) {
      const category = await row.locator('td:nth-child(1)').textContent();
      const amount = await row.locator('td:nth-child(2)').textContent();
      amounts[category.trim()] = amount.trim();
    }
    return amounts;
  }

  async getCategoryPercentages() {
    const percentages = {};
    const rows = await this.page.locator('.category-breakdown tr').all();
    for (const row of rows) {
      const category = await row.locator('td:nth-child(1)').textContent();
      const percentage = await row.locator('td:nth-child(4)').textContent();
      percentages[category.trim()] = percentage.trim().replace('%', '');
    }
    return percentages;
  }

  async hoverOverCategorySegment(category) {
    const segment = this.categoryPieChart.locator(`[data-category="${category}"]`);
    await segment.hover();
    await this.page.waitForTimeout(500);
  }

  async getCategorySegmentCount() {
    return await this.categoryPieChart.locator('.chart-segment').count();
  }

  async getCategoryAmount(category) {
    const row = this.page.locator(`.category-breakdown tr:has-text("${category}")`);
    const amount = await row.locator('td:nth-child(2)').textContent();
    return amount.trim();
  }

  async getTotalSpendDisplayed() {
    const total = await this.page.locator('.total-spend-value').textContent();
    return total.trim();
  }

  async navigateToTrendAnalysis() {
    await this.trendAnalysisTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendGraphLoad() {
    await this.trendLineGraph.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getTrendDataPointCount() {
    return await this.trendLineGraph.locator('.data-point').count();
  }

  async getMonthlySpendValues() {
    const values = await this.trendLineGraph.locator('.data-point').allTextContents();
    return values;
  }

  async hoverOverDataPoint(index) {
    const dataPoint = this.trendLineGraph.locator('.data-point').nth(index);
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
  }
};
