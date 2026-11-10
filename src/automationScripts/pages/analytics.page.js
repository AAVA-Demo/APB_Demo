const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendChartDataPoints = page.locator('.trend-chart-point');
    this.tooltip = page.locator('.chart-tooltip');
    this.selectedMonthIndicator = page.locator('[data-testid="selected-month-filter"]');
    this.categoryItems = page.locator('.category-item');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.categoryEmptyMessage = page.locator('[data-testid="category-empty-message"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendChartRender() {
    await expect(this.trendChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async waitForCategoryChartRender() {
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async getTrendChartDataPointCount() {
    return await this.trendChartDataPoints.count();
  }

  async getTrendChartValues() {
    return await this.trendChartDataPoints.allTextContents();
  }

  async hoverOverDataPoint(index) {
    await this.trendChartDataPoints.nth(index).hover();
    await this.page.waitForTimeout(300);
  }

  async isTooltipVisible() {
    return await this.tooltip.isVisible();
  }

  async clickDataPoint(index) {
    await this.trendChartDataPoints.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async isMonthFilterApplied() {
    return await this.selectedMonthIndicator.isVisible();
  }

  async getCategoryTotal() {
    const categoryAmounts = await this.categoryItems.locator('[data-testid="category-amount"]').allTextContents();
    const total = categoryAmounts.reduce((sum, amt) => {
      return sum + parseFloat(amt.replace(/[$,]/g, ''));
    }, 0);
    return total.toFixed(2);
  }

  async getSelectedMonthTrendValue() {
    const selectedPoint = await this.page.locator('.trend-chart-point.selected').textContent();
    return parseFloat(selectedPoint.replace(/[$,]/g, '')).toFixed(2);
  }

  async getFilterIndicatorText() {
    await expect(this.selectedMonthIndicator).toBeVisible();
    return await this.selectedMonthIndicator.textContent();
  }

  async getTrendChartEmptyMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async isTrendChartRendered() {
    const chartCanvas = await this.page.locator('canvas#trendChart').count();
    return chartCanvas > 0;
  }

  async getCategoryEmptyMessage() {
    await expect(this.categoryEmptyMessage).toBeVisible();
    return await this.categoryEmptyMessage.textContent();
  }

  async getCategoryChartType() {
    return await this.categoryChart.getAttribute('data-chart-type');
  }

  async getAllCategories() {
    return await this.categoryItems.locator('[data-testid="category-name"]').allTextContents();
  }

  async getAllCategoryAmounts() {
    return await this.categoryItems.locator('[data-testid="category-amount"]').allTextContents();
  }

  async getAllCategoryPercentages() {
    return await this.categoryItems.locator('[data-testid="category-percentage"]').allTextContents();
  }

  async getTotalPercentage() {
    const percentages = await this.getAllCategoryPercentages();
    return percentages.reduce((sum, pct) => {
      return sum + parseFloat(pct.replace('%', ''));
    }, 0);
  }

  async getCategoryAmount(categoryName) {
    const categoryItem = this.page.locator('.category-item', { hasText: categoryName });
    await expect(categoryItem).toBeVisible();
    return await categoryItem.locator('[data-testid="category-amount"]').textContent();
  }

  async getCategoryPercentage(categoryName) {
    const categoryItem = this.page.locator('.category-item', { hasText: categoryName });
    await expect(categoryItem).toBeVisible();
    return await categoryItem.locator('[data-testid="category-percentage"]').textContent();
  }

  async getTotalSpend() {
    const totalElement = this.page.locator('[data-testid="total-spend"]');
    await expect(totalElement).toBeVisible();
    return await totalElement.textContent();
  }
};
