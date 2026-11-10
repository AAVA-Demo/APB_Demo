const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsNavLink = page.locator('a[href*="analytics"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.categoryList = page.locator('[data-testid="category-list"]');
    this.totalSpendingDisplay = page.locator('[data-testid="total-spending"]');
    this.monthlyTrendTab = page.locator('[data-testid="monthly-trend-tab"]');
    this.insufficientDataNotification = page.locator('[data-testid="insufficient-data-notification"]');
    this.insufficientDataIndicator = page.locator('[data-testid="insufficient-data-indicator"]');
    this.highTransactionWarning = page.locator('[data-testid="high-transaction-warning"]');
  }

  async navigateToAnalytics() {
    await this.analyticsNavLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/analytics/);
  }

  async waitForChartLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000); // Wait for chart animation
  }

  async getAllCategories() {
    await this.waitForChartLoad();
    const categoryElements = await this.categoryList.locator('.category-item').all();
    const categories = [];
    
    for (const element of categoryElements) {
      const text = await element.textContent();
      categories.push(text.trim());
    }
    
    return categories;
  }

  async getTotalSpending() {
    await expect(this.totalSpendingDisplay).toBeVisible();
    const text = await this.totalSpendingDisplay.textContent();
    return text.trim();
  }

  async getCategoriesWithSpending() {
    await this.waitForChartLoad();
    const categoryElements = await this.categoryList.locator('.category-item[data-has-spending="true"]').all();
    const categories = [];
    
    for (const element of categoryElements) {
      const text = await element.locator('.category-name').textContent();
      categories.push(text.trim());
    }
    
    return categories;
  }

  async getCategoryPercentage(categoryName) {
    const categoryElement = this.categoryList.locator(`.category-item:has-text("${categoryName}")`);
    await expect(categoryElement).toBeVisible();
    const percentageText = await categoryElement.locator('.category-percentage').textContent();
    return percentageText.replace('%', '').trim();
  }

  async selectMonthlyTrendView() {
    await this.monthlyTrendTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendChartLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async getMonthsDisplayed() {
    await this.waitForTrendChartLoad();
    const monthElements = await this.trendChart.locator('.month-label').all();
    const months = [];
    
    for (const element of monthElements) {
      const text = await element.textContent();
      months.push(text.trim());
    }
    
    return months;
  }

  async getChartRenderTime() {
    const startTime = Date.now();
    await this.waitForTrendChartLoad();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async isChartInteractive() {
    await this.waitForTrendChartLoad();
    const firstDataPoint = this.trendChart.locator('.data-point').first();
    await firstDataPoint.hover();
    
    // Check if tooltip appears on hover
    const tooltip = this.page.locator('.chart-tooltip');
    const isVisible = await tooltip.isVisible();
    return isVisible;
  }

  async getMonthTotal(monthName) {
    const monthElement = this.trendChart.locator(`.month-data:has-text("${monthName}")`);
    await expect(monthElement).toBeVisible();
    const totalText = await monthElement.locator('.month-total').textContent();
    return totalText.trim();
  }

  async isMonthDataVisible(monthName) {
    const monthElement = this.trendChart.locator(`.month-data:has-text("${monthName}")`);
    return await monthElement.isVisible();
  }
};