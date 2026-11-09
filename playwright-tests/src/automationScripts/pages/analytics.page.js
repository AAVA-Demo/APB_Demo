const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.cardComparisonChart = page.locator('[data-testid="card-comparison-chart"]');
    
    // Drill-down Locators
    this.drillDownView = page.locator('[data-testid="drill-down-view"]');
    this.drillDownButton = page.locator('[data-testid="drill-down-button"]');
    
    // Trend Locators
    this.trendIndicator = page.locator('[data-testid="trend-indicator"]');
    
    // Category Locators
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.monthItem = page.locator('[data-testid="month-item"]');
    
    // Loading State
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    logger.info('Navigated to Analytics Dashboard');
  }

  async navigateToMonthlyTrends() {
    await this.page.click('[data-testid="nav-monthly-trends"]');
    await expect(this.monthlyTrendChart).toBeVisible();
    logger.info('Navigated to Monthly Trends');
  }

  async navigateToCategorySpending() {
    await this.page.click('[data-testid="nav-category-spending"]');
    await expect(this.categoryChart).toBeVisible();
    logger.info('Navigated to Category Spending');
  }

  async navigateToCardComparison() {
    await this.page.click('[data-testid="nav-card-comparison"]');
    await expect(this.cardComparisonChart).toBeVisible();
    logger.info('Navigated to Card Comparison');
  }

  async getChartData() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const months = await this.monthItem.count();
    const data = [];
    for (let i = 0; i < months; i++) {
      const month = await this.monthItem.nth(i).textContent();
      data.push(month);
    }
    logger.info(`Chart data retrieved: ${data.length} months`);
    return data;
  }

  async clickOnMonth(month) {
    await this.page.click(`[data-testid="month-${month}"]`);
    await expect(this.drillDownView).toBeVisible();
    logger.info(`Clicked on month: ${month}`);
  }

  async getDisplayedCategories() {
    await expect(this.categoryChart).toBeVisible();
    const count = await this.categoryItem.count();
    const categories = [];
    for (let i = 0; i < count; i++) {
      const category = await this.categoryItem.nth(i).textContent();
      categories.push(category.trim());
    }
    logger.info(`Categories retrieved: ${categories.join(', ')}`);
    return categories;
  }

  async clickOnCategory(category) {
    await this.page.click(`[data-testid="category-${category}"]`);
    logger.info(`Clicked on category: ${category}`);
  }

  async getDrillDownTransactionCount() {
    await expect(this.drillDownView).toBeVisible();
    const countText = await this.page.locator('[data-testid="drill-down-count"]').textContent();
    const count = parseInt(countText.match(/\d+/)[0]);
    logger.info(`Drill-down transaction count: ${count}`);
    return count;
  }

  async getTrendDirection() {
    await expect(this.trendIndicator).toBeVisible();
    const direction = await this.trendIndicator.textContent();
    logger.info(`Trend direction: ${direction}`);
    return direction;
  }

  async getCardComparisonData() {
    await expect(this.cardComparisonChart).toBeVisible();
    const cards = await this.page.locator('[data-testid="card-comparison-item"]').count();
    const data = [];
    for (let i = 0; i < cards; i++) {
      const item = this.page.locator('[data-testid="card-comparison-item"]').nth(i);
      const spending = await item.locator('[data-testid="card-spending"]').textContent();
      const categoryBreakdown = await item.locator('[data-testid="category-breakdown"]').textContent();
      data.push({ spending, categoryBreakdown });
    }
    logger.info(`Card comparison data retrieved: ${data.length} cards`);
    return data;
  }
};