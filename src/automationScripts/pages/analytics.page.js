const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.spendingAnalyticsLink = page.locator('[data-testid="spending-analytics-link"]');
    this.analyticsContainer = page.locator('[data-testid="analytics-container"]');
    
    this.monthlySpendTrendChart = page.locator('[data-testid="monthly-spend-trend-chart"]');
    this.chartXAxis = page.locator('[data-testid="chart-x-axis"]');
    this.chartDataPoints = page.locator('[data-testid="chart-data-point"]');
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    
    this.limitedDataMessage = page.locator('[data-testid="limited-data-message"]');
    
    this.categoryBreakdownSection = page.locator('[data-testid="category-breakdown-section"]');
    this.categoryItems = page.locator('[data-testid="category-item"]');
  }

  async navigateToSpendingAnalytics() {
    await expect(this.spendingAnalyticsLink).toBeVisible();
    await this.spendingAnalyticsLink.click();
    await this.analyticsContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getChartMonths() {
    await this.chartXAxis.waitFor({ state: 'visible', timeout: 3000 });
    const monthLabels = await this.chartXAxis.locator('[data-testid="month-label"]').allTextContents();
    return monthLabels;
  }

  async hoverOverDataPoint(month) {
    const dataPoint = this.page.locator(`[data-testid="data-point-${month.toLowerCase()}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.hover();
    await this.chartTooltip.waitFor({ state: 'visible', timeout: 2000 });
  }

  async getTooltipValue() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async getLimitedDataMessageText() {
    await expect(this.limitedDataMessage).toBeVisible();
    return await this.limitedDataMessage.textContent();
  }

  async clickDataPoint(month) {
    const dataPoint = this.page.locator(`[data-testid="data-point-${month.toLowerCase()}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
  }

  async getCategoryBreakdownCategories() {
    await this.categoryBreakdownSection.waitFor({ state: 'visible', timeout: 3000 });
    const categories = await this.categoryItems.locator('[data-testid="category-name"]').allTextContents();
    return categories;
  }
};
