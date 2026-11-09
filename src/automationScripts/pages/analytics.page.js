const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.AnalyticsPage = class AnalyticsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Analytics Page Locators
    this.analyticsContainer = page.locator('[data-testid="analytics-container"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.emptyState = page.locator('[data-testid="empty-state"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    
    // Category Chart Locators
    this.categorySegment = page.locator('[data-testid="category-segment"]');
    this.categoryLabel = page.locator('[data-testid="category-label"]');
    this.categoryAmount = page.locator('[data-testid="category-amount"]');
    this.categoryPercentage = page.locator('[data-testid="category-percentage"]');
    this.categoryDetail = page.locator('[data-testid="category-detail"]');
    
    // Trend Chart Locators
    this.trendDataPoint = page.locator('[data-testid="trend-data-point"]');
    this.trendMonthLabel = page.locator('[data-testid="trend-month-label"]');
    this.drillDownView = page.locator('[data-testid="drill-down-view"]');
    this.insufficientDataWarning = page.locator('[data-testid="insufficient-data-warning"]');
    
    // Tooltip Locators
    this.tooltip = page.locator('[data-testid="chart-tooltip"]');
    this.tooltipContent = page.locator('[data-testid="tooltip-content"]');
    
    // Navigation Locators
    this.trendAnalysisTab = page.locator('[data-testid="trend-analysis-tab"]');
    this.categoryAnalysisTab = page.locator('[data-testid="category-analysis-tab"]');
  }

  async navigateToAnalytics() {
    await this.page.goto('/analytics');
    await this.waitForAnalyticsLoad();
  }

  async waitForAnalyticsLoad() {
    await expect(this.analyticsContainer).toBeVisible({ timeout: 10000 });
    await Promise.race([
      expect(this.categoryChart).toBeVisible({ timeout: 5000 }),
      expect(this.emptyState).toBeVisible({ timeout: 5000 })
    ]).catch(() => {});
  }

  async isCategoryChartVisible() {
    return await this.categoryChart.isVisible();
  }

  async getAllCategories() {
    await expect(this.categoryLabel.first()).toBeVisible();
    return await this.categoryLabel.allTextContents();
  }

  async getCategorySpendingData() {
    const categories = await this.categoryLabel.allTextContents();
    const amounts = await this.categoryAmount.allTextContents();
    const percentages = await this.categoryPercentage.allTextContents();
    
    return categories.map((category, index) => ({
      category: category,
      amount: amounts[index],
      percentage: percentages[index]
    }));
  }

  async clickCategorySegment(categoryName) {
    const segments = await this.categorySegment.all();
    for (const segment of segments) {
      const label = await segment.locator('[data-testid="category-label"]').textContent();
      if (label.includes(categoryName)) {
        await segment.click();
        return;
      }
    }
    throw new Error(`Category ${categoryName} not found`);
  }

  async isCategoryDetailVisible() {
    return await this.categoryDetail.isVisible();
  }

  async hoverOverCategory(categoryName) {
    const segments = await this.categorySegment.all();
    for (const segment of segments) {
      const label = await segment.locator('[data-testid="category-label"]').textContent();
      if (label.includes(categoryName)) {
        await segment.hover();
        return;
      }
    }
    throw new Error(`Category ${categoryName} not found`);
  }

  async isTooltipVisible() {
    return await this.tooltip.isVisible({ timeout: 2000 });
  }

  async getTooltipContent() {
    await expect(this.tooltipContent).toBeVisible();
    return await this.tooltipContent.textContent();
  }

  async isEmptyStateVisible() {
    return await this.emptyState.isVisible();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  // Trend Analysis Methods
  async navigateToTrendAnalysis() {
    await this.trendAnalysisTab.click();
    await expect(this.trendChart).toBeVisible({ timeout: 5000 });
  }

  async isTrendChartVisible() {
    return await this.trendChart.isVisible();
  }

  async getTrendChartMonthCount() {
    const months = await this.trendMonthLabel.all();
    return months.length;
  }

  async hoverOverTrendDataPoint(index) {
    const dataPoints = await this.trendDataPoint.all();
    if (index >= dataPoints.length) {
      throw new Error(`Data point index ${index} out of bounds`);
    }
    await dataPoints[index].hover();
  }

  async clickTrendDataPoint(index) {
    const dataPoints = await this.trendDataPoint.all();
    if (index >= dataPoints.length) {
      throw new Error(`Data point index ${index} out of bounds`);
    }
    await dataPoints[index].click();
  }

  async isDrillDownViewVisible() {
    return await this.drillDownView.isVisible({ timeout: 3000 });
  }

  async isInsufficientDataWarningVisible() {
    return await this.insufficientDataWarning.isVisible();
  }
};
