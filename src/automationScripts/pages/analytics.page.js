const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('AnalyticsPage');
    
    this.timeRangeSelector = page.locator('[data-testid="time-range-selector"]');
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.categoryBreakdownChart = page.locator('[data-testid="category-breakdown-chart"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.categoryTable = page.locator('[data-testid="category-table"]');
  }
  
  async navigate() {
    this.logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
  }
  
  async selectTimeRange(months) {
    this.logger.info(`Selecting time range: ${months} months`);
    await this.timeRangeSelector.click();
    await this.page.locator(`[data-value="${months}"]`).click();
  }
  
  async waitForTrendsLoad() {
    this.logger.info('Waiting for trends to load');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    await expect(this.monthlyTrendsChart).toBeVisible();
  }
  
  async getMonthlyTrends() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    const trendsData = await this.page.evaluate(() => {
      return window.getMonthlyTrendsData();
    });
    return trendsData;
  }
  
  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }
  
  async waitForCategoryDataLoad() {
    this.logger.info('Waiting for category data to load');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    await expect(this.categoryBreakdownChart).toBeVisible();
  }
  
  async getCategoryBreakdown() {
    await expect(this.categoryTable).toBeVisible();
    const categoryData = await this.page.evaluate(() => {
      return window.getCategoryBreakdownData();
    });
    return categoryData;
  }
  
  async getCategoryPercentages() {
    await expect(this.categoryTable).toBeVisible();
    const percentages = await this.page.evaluate(() => {
      return window.getCategoryPercentages();
    });
    return percentages;
  }
};
