const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsNavLink = page.locator('a[href="/analytics"]');
    this.monthlyTrendsLink = page.locator('a[href="/analytics/trends"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.categoryElements = page.locator('.category-segment');
    this.trendDataPoints = page.locator('.trend-data-point');
    this.tooltip = page.locator('.chart-tooltip');
    this.totalSpendElement = page.locator('[data-testid="total-spend"]');
    this.topCategoryElement = page.locator('[data-testid="top-category"]');
    this.errorMessage = page.locator('.error-message');
    this.notificationMessage = page.locator('.notification-message');
    this.loadingSpinner = page.locator('.loading-spinner');
    this.retryButton = page.locator('button[data-testid="retry-button"]');
    this.monthLabels = page.locator('.month-label');
  }

  async navigateToAnalytics() {
    await this.analyticsNavLink.click();
    await this.page.waitForURL('**/analytics');
  }

  async navigateToMonthlyTrends() {
    await this.monthlyTrendsLink.click();
    await this.page.waitForURL('**/analytics/trends');
  }

  async waitForCategoryChartToLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 3000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendChartToLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 3000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryElement(categoryName) {
    return this.page.locator(`.category-segment[data-category="${categoryName}"]`);
  }

  async getCategoryAmount(categoryName) {
    const category = await this.getCategoryElement(categoryName);
    await expect(category).toBeVisible();
    const amount = await category.getAttribute('data-amount');
    return parseFloat(amount);
  }

  async getVisibleCategories() {
    const categories = await this.categoryElements.all();
    const visibleCategories = [];
    for (const category of categories) {
      const categoryName = await category.getAttribute('data-category');
      visibleCategories.push(categoryName);
    }
    return visibleCategories;
  }

  async hoverOverCategory(categoryName) {
    const category = await this.getCategoryElement(categoryName);
    await category.hover();
  }

  async hoverOverDataPoint(index) {
    const dataPoint = this.trendDataPoints.nth(index);
    await expect(dataPoint).toBeVisible();
    await dataPoint.hover();
  }

  async getTooltip() {
    return this.tooltip;
  }

  async getTotalSpend() {
    await expect(this.totalSpendElement).toBeVisible();
    const text = await this.totalSpendElement.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTopSpendingCategory() {
    await expect(this.topCategoryElement).toBeVisible();
    return await this.topCategoryElement.textContent();
  }

  async isCategoryChartVisible() {
    return await this.categoryChart.isVisible();
  }

  async isTrendChartVisible() {
    return await this.trendChart.isVisible();
  }

  async getTrendChartDataPoints() {
    await this.waitForTrendChartToLoad();
    return await this.trendDataPoints.all();
  }

  async getMonthLabels() {
    await this.waitForTrendChartToLoad();
    const labels = await this.monthLabels.all();
    const monthNames = [];
    for (const label of labels) {
      monthNames.push(await label.textContent());
    }
    return monthNames;
  }

  async getErrorMessage() {
    return this.errorMessage;
  }

  async getNotificationMessage() {
    await expect(this.notificationMessage).toBeVisible();
    return await this.notificationMessage.textContent();
  }

  async getLoadingSpinner() {
    return this.loadingSpinner;
  }

  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};