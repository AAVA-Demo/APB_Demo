const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators for analytics dashboard
    this.analyticsContainer = page.locator('[data-testid="analytics-container"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.chartEmptyState = page.locator('[data-testid="chart-empty-state"]');
    
    // Locators for monthly trends
    this.monthlyTrendsSection = page.locator('[data-testid="monthly-trends-section"]');
    this.dateRangeSelector = page.locator('[data-testid="date-range-selector"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    
    // Locators for category data
    this.categoryPrefix = '[data-testid="category-';
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async authenticateUser(username, password) {
    logger.info(`Authenticating user: ${username}`);
    await this.page.fill('[data-testid="username-input"]', username);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsDataLoad() {
    logger.info('Waiting for analytics data to load');
    await expect(this.analyticsContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryAmount(categoryName) {
    const categoryLocator = this.page.locator(`${this.categoryPrefix}${categoryName.toLowerCase().replace(/\s+/g, '-')}-amount"]`);
    await expect(categoryLocator).toBeVisible();
    return await categoryLocator.textContent();
  }

  async getChartCategories() {
    await expect(this.categoryChart).toBeVisible();
    const categories = await this.categoryChart.locator('[data-testid="chart-category"]').all();
    return categories;
  }

  async measureChartRenderTime() {
    const startTime = Date.now();
    await expect(this.categoryChart).toBeVisible();
    const endTime = Date.now();
    return endTime - startTime;
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async checkForSystemErrors() {
    const errorElements = await this.page.locator('[data-testid="system-error"]').count();
    return errorElements > 0;
  }

  async getCategoryTransactionCount(categoryName) {
    const categoryLocator = this.page.locator(`${this.categoryPrefix}${categoryName.toLowerCase().replace(/\s+/g, '-')}-count"]`);
    await expect(categoryLocator).toBeVisible();
    const countText = await categoryLocator.textContent();
    return parseInt(countText);
  }

  async getValidCategoriesWithAmounts() {
    const categories = await this.page.locator('[data-testid^="category-"][data-testid$="-amount"]').all();
    const validCategories = [];
    for (const category of categories) {
      const amount = await category.textContent();
      if (amount !== '₹0') {
        validCategories.push({ element: category, amount });
      }
    }
    return validCategories;
  }

  async getChartData() {
    await expect(this.categoryChart).toBeVisible();
    const chartData = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="category-chart"]');
      return chartElement ? chartElement.getAttribute('data-chart-data') : null;
    });
    return chartData;
  }

  async navigateToMonthlyTrends() {
    logger.info('Navigating to monthly trends section');
    await this.page.click('[data-testid="monthly-trends-tab"]');
    await expect(this.monthlyTrendsSection).toBeVisible();
  }

  async waitForMonthlyTrendsLoad() {
    logger.info('Waiting for monthly trends data to load');
    await expect(this.monthlyTrendsChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpend(month) {
    const monthLocator = this.page.locator(`[data-testid="month-${month.toLowerCase()}-spend"]`);
    await expect(monthLocator).toBeVisible();
    return await monthLocator.textContent();
  }

  async getChartDataPoints() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    const dataPoints = await this.monthlyTrendsChart.locator('[data-testid="chart-data-point"]').all();
    return dataPoints;
  }

  async verifyChartInteractivity() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    const isInteractive = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="monthly-trends-chart"]');
      return chartElement ? chartElement.hasAttribute('data-interactive') : false;
    });
    return isInteractive;
  }

  async checkForTrendIndicators() {
    const trendIndicators = await this.page.locator('[data-testid="trend-indicator"]').count();
    return trendIndicators > 0;
  }

  async selectDateRange(months) {
    logger.info(`Selecting date range: ${months} months`);
    await this.dateRangeSelector.selectOption({ value: months.toString() });
    await this.page.waitForLoadState('networkidle');
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async selectCustomDateRange(startMonth, endMonth) {
    logger.info(`Selecting custom date range: ${startMonth} to ${endMonth}`);
    await this.page.fill('[data-testid="start-month-input"]', startMonth);
    await this.page.fill('[data-testid="end-month-input"]', endMonth);
    await this.page.click('[data-testid="apply-date-range-button"]');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCategoryBreakdownsPresent() {
    const breakdowns = await this.page.locator('[data-testid="category-breakdown"]').count();
    return breakdowns > 0;
  }
};