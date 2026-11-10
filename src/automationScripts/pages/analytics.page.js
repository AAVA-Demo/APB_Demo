const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.trendsMenuItem = page.locator('a:has-text("Trends")');
    this.spendingInsightsMenuItem = page.locator('a:has-text("Spending Insights")');
    
    // Monthly Trends
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.trendDataPoints = page.locator('[data-testid="trend-data-point"]');
    this.transactionDetailView = page.locator('[data-testid="transaction-detail-view"]');
    this.insufficientDataNotification = page.locator('[data-testid="insufficient-data-notification"]');
    
    // Category Spending
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.categorySegments = page.locator('[data-testid="category-segment"]');
    this.categoryDetailView = page.locator('[data-testid="category-detail-view"]');
    
    // Error Messages
    this.serviceUnavailableError = page.locator('[data-testid="service-unavailable-error"]');
    this.categoryServiceError = page.locator('[data-testid="category-service-error"]');
    
    // Buttons
    this.retryButton = page.locator('button:has-text("Retry")');
    this.contactSupportButton = page.locator('button:has-text("Contact Support")');
  }

  async navigateToTrends() {
    logger.info('Navigating to Monthly Spend Trends');
    await this.page.goto('/analytics/trends');
    await this.page.waitForLoadState('networkidle');
    await expect(this.trendChart).toBeVisible({ timeout: 3000 });
    logger.info('Trend analysis view loaded');
  }

  async navigateToSpendingInsights() {
    logger.info('Navigating to Spending Insights');
    await this.page.goto('/analytics/insights');
    await this.page.waitForLoadState('networkidle');
    await expect(this.categoryChart).toBeVisible({ timeout: 3000 });
    logger.info('Spending insights dashboard loaded');
  }

  async getMonthlyTrendDataPoints() {
    await expect(this.trendDataPoints.first()).toBeVisible();
    const count = await this.trendDataPoints.count();
    logger.info(`Monthly trend data points: ${count}`);
    return count;
  }

  async verifyMonthlyAggregation() {
    logger.info('Verifying monthly spending aggregation');
    const dataPoints = await this.trendDataPoints.all();
    for (const point of dataPoints) {
      await expect(point).toBeVisible();
      const value = await point.getAttribute('data-value');
      await expect(parseFloat(value)).toBeGreaterThan(0);
    }
    logger.info('Monthly aggregation verified');
  }

  async clickMonthDataPoint(index) {
    logger.info(`Clicking month data point at index ${index}`);
    const dataPoint = this.trendDataPoints.nth(index);
    await dataPoint.click();
    logger.info('Month data point clicked');
  }

  async verifyTransactionDetails() {
    logger.info('Verifying transaction details');
    await expect(this.transactionDetailView).toBeVisible();
    const details = this.transactionDetailView.locator('[data-testid="transaction-item"]');
    await expect(details.first()).toBeVisible();
    
    const firstTransaction = details.first();
    await expect(firstTransaction.locator('[data-testid="transaction-date"]')).toBeVisible();
    await expect(firstTransaction.locator('[data-testid="transaction-amount"]')).toBeVisible();
    await expect(firstTransaction.locator('[data-testid="transaction-category"]')).toBeVisible();
    await expect(firstTransaction.locator('[data-testid="transaction-merchant"]')).toBeVisible();
    logger.info('Transaction details verified');
  }

  async verifyXAxisLabels(expectedCount) {
    logger.info(`Verifying X-axis labels for ${expectedCount} months`);
    const labels = this.page.locator('[data-testid="x-axis-label"]');
    const count = await labels.count();
    await expect(count).toBe(expectedCount);
    logger.info(`X-axis displays ${expectedCount} month labels`);
  }

  async getCategoryCount() {
    await expect(this.categorySegments.first()).toBeVisible();
    const count = await this.categorySegments.count();
    logger.info(`Category count: ${count}`);
    return count;
  }

  async verifyCategorySpendingAmounts() {
    logger.info('Verifying category spending amounts');
    const segments = await this.categorySegments.all();
    for (const segment of segments) {
      const amount = await segment.getAttribute('data-amount');
      await expect(parseFloat(amount)).toBeGreaterThan(0);
    }
    logger.info('Category spending amounts verified');
  }

  async getTotalCategoryPercentage() {
    logger.info('Calculating total category percentage');
    const segments = await this.categorySegments.all();
    let total = 0;
    for (const segment of segments) {
      const percentage = await segment.getAttribute('data-percentage');
      total += parseFloat(percentage);
    }
    logger.info(`Total category percentage: ${total}%`);
    return total;
  }

  async clickCategorySegment(categoryName) {
    logger.info(`Clicking category segment: ${categoryName}`);
    const segment = this.page.locator(`[data-testid="category-segment-${categoryName.replace(/\s+/g, '-').toLowerCase()}"]`);
    await segment.click();
    logger.info('Category segment clicked');
  }

  async getDisplayedCategories() {
    logger.info('Getting displayed categories');
    const segments = await this.categorySegments.all();
    const categories = [];
    for (const segment of segments) {
      const category = await segment.getAttribute('data-category');
      categories.push(category);
    }
    logger.info(`Displayed categories: ${categories.join(', ')}`);
    return categories;
  }
};