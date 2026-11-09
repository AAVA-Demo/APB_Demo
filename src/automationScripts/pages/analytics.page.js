const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.trendChartContainer = page.locator('[data-testid="trend-chart-container"]');
    this.trendChartDataPoints = page.locator('[data-testid="trend-data-point"]');
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    this.tooltipAmount = page.locator('[data-testid="tooltip-amount"]');
    this.tooltipMonth = page.locator('[data-testid="tooltip-month"]');
    this.tooltipPercentageChange = page.locator('[data-testid="tooltip-percentage-change"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.categoryAnalysisSection = page.locator('[data-testid="category-analysis-section"]');
    this.categoryItems = page.locator('[data-testid="category-item"]');
    this.totalSpendingDisplay = page.locator('[data-testid="total-spending"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendChart() {
    await expect(this.trendChartContainer).toBeVisible({ timeout: 10000 });
  }

  async waitForCategoryAnalysis() {
    await expect(this.categoryAnalysisSection).toBeVisible({ timeout: 10000 });
  }

  async waitForTooltip() {
    await expect(this.chartTooltip).toBeVisible({ timeout: 5000 });
  }

  async getTrendChartDataPointCount() {
    return await this.trendChartDataPoints.count();
  }

  async getTrendChartMonthLabel(index) {
    const dataPoint = this.trendChartDataPoints.nth(index);
    const labelElement = dataPoint.locator('[data-testid="month-label"]');
    await expect(labelElement).toBeVisible();
    return await labelElement.textContent();
  }

  async getTrendChartAmount(index) {
    const dataPoint = this.trendChartDataPoints.nth(index);
    const amountElement = dataPoint.locator('[data-testid="amount-value"]');
    await expect(amountElement).toBeVisible();
    const amountText = await amountElement.textContent();
    return parseFloat(amountText.replace(/[$,]/g, ''));
  }

  async hoverOverDataPoint(index) {
    const dataPoint = this.trendChartDataPoints.nth(index);
    await dataPoint.hover();
  }

  async getTooltipAmount() {
    await expect(this.tooltipAmount).toBeVisible();
    return await this.tooltipAmount.textContent();
  }

  async getTooltipMonth() {
    await expect(this.tooltipMonth).toBeVisible();
    return await this.tooltipMonth.textContent();
  }

  async getTooltipPercentageChange() {
    await expect(this.tooltipPercentageChange).toBeVisible();
    return await this.tooltipPercentageChange.textContent();
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getCategoryCount() {
    return await this.categoryItems.count();
  }

  async getCategoryName(index) {
    const category = this.categoryItems.nth(index);
    const nameElement = category.locator('[data-testid="category-name"]');
    await expect(nameElement).toBeVisible();
    return await nameElement.textContent();
  }

  async getCategoryAmount(index) {
    const category = this.categoryItems.nth(index);
    const amountElement = category.locator('[data-testid="category-amount"]');
    await expect(amountElement).toBeVisible();
    return await amountElement.textContent();
  }

  async getCategoryPercentage(index) {
    const category = this.categoryItems.nth(index);
    const percentageElement = category.locator('[data-testid="category-percentage"]');
    await expect(percentageElement).toBeVisible();
    return await percentageElement.textContent();
  }

  async getCategoryAmountByName(categoryName) {
    const category = this.page.locator(`[data-category-name="${categoryName}"]`);
    const amountElement = category.locator('[data-testid="category-amount"]');
    await expect(amountElement).toBeVisible();
    return await amountElement.textContent();
  }

  async getCategoryPercentageByName(categoryName) {
    const category = this.page.locator(`[data-category-name="${categoryName}"]`);
    const percentageElement = category.locator('[data-testid="category-percentage"]');
    await expect(percentageElement).toBeVisible();
    return await percentageElement.textContent();
  }

  async getTotalSpending() {
    await expect(this.totalSpendingDisplay).toBeVisible();
    return await this.totalSpendingDisplay.textContent();
  }

  async calculateCategorySum() {
    const count = await this.getCategoryCount();
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const amountText = await this.getCategoryAmount(i);
      const amount = parseFloat(amountText.replace(/[$,]/g, ''));
      sum += amount;
    }
    return sum;
  }

  async calculatePercentageSum() {
    const count = await this.getCategoryCount();
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const percentageText = await this.getCategoryPercentage(i);
      const percentage = parseFloat(percentageText.replace('%', ''));
      sum += percentage;
    }
    return sum;
  }
};
