const { expect } = require('@playwright/test');
const config = require('../../data/config.json');

exports.TransactionAnalyticsPage = class TransactionAnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Category Chart Locators
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.categorySegment = page.locator('[data-testid="category-segment"]');
    this.tooltip = page.locator('[data-testid="chart-tooltip"]');
    this.drillDownView = page.locator('[data-testid="drill-down-view"]');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    
    // Pagination
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.nextButton = page.locator('[data-testid="pagination-next"]');
    this.previousButton = page.locator('[data-testid="pagination-previous"]');
    
    // Visualization
    this.fallbackTable = page.locator('[data-testid="fallback-table"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    // Trend Analysis
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.monthDataPoint = page.locator('[data-testid="month-data-point"]');
    this.monthDetailView = page.locator('[data-testid="month-detail-view"]');
    this.categoryBreakdown = page.locator('[data-testid="category-breakdown"]');
    this.cardBreakdown = page.locator('[data-testid="card-breakdown"]');
    this.infoMessage = page.locator('[data-testid="info-message"]');
    
    // Pattern Analysis
    this.recurringPatterns = page.locator('[data-testid="recurring-patterns"]');
    this.anomalies = page.locator('[data-testid="anomalies"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.anomalyDetailView = page.locator('[data-testid="anomaly-detail-view"]');
    this.detailedTransactionList = page.locator('[data-testid="detailed-transaction-list"]');
    this.anomalyExplanation = page.locator('[data-testid="anomaly-explanation"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/analytics');
  }

  async navigateToTrendAnalysis() {
    await this.page.goto(config.baseUrl + '/analytics/trends');
  }

  async navigateToPatternAnalysis() {
    await this.page.goto(config.baseUrl + '/analytics/patterns');
  }

  async waitForCategoryChartLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForVisualizationLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
  }

  async waitForTrendChartLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPatternLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async waitForTransactionLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionList).toBeVisible();
  }

  async getAllCategories() {
    await expect(this.categoryChart).toBeVisible();
    const segments = await this.categorySegment.all();
    const categories = [];
    for (const segment of segments) {
      const category = await segment.getAttribute('data-category');
      if (category) categories.push(category);
    }
    return categories;
  }

  async clickCategory(categoryName) {
    const segment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.click();
  }

  async hoverOverCategory(categoryName) {
    const segment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.hover();
    await this.page.waitForTimeout(500);
  }

  async getVisibleTransactionCount() {
    await expect(this.transactionList).toBeVisible();
    return await this.transactionList.locator('[data-testid="transaction-item"]').count();
  }

  async getAllVisibleCategories() {
    const segments = await this.categorySegment.all();
    const categories = [];
    for (const segment of segments) {
      const isVisible = await segment.isVisible();
      if (isVisible) {
        const category = await segment.getAttribute('data-category');
        categories.push(category);
      }
    }
    return categories;
  }

  async getVisibleCategories() {
    return await this.getAllVisibleCategories();
  }

  async getHiddenCategories() {
    const allCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    const visibleCategories = await this.getVisibleCategories();
    return allCategories.filter(cat => !visibleCategories.includes(cat));
  }

  async getCategoryAmount(categoryName) {
    const segment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    return await segment.getAttribute('data-amount');
  }

  async getCategoryPercentage(categoryName) {
    const segment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    return await segment.getAttribute('data-percentage');
  }

  async getTableHeaders() {
    await expect(this.fallbackTable).toBeVisible();
    const headers = await this.fallbackTable.locator('th').allTextContents();
    return headers;
  }

  async getTrendMonths() {
    await expect(this.trendChart).toBeVisible();
    const dataPoints = await this.monthDataPoint.all();
    const months = [];
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      if (month) months.push(month);
    }
    return months;
  }

  async clickMonth(monthName) {
    const dataPoint = this.page.locator(`[data-testid="month-data-point"][data-month="${monthName}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
  }

  async getRecurringPatterns() {
    await expect(this.recurringPatterns).toBeVisible();
    return await this.recurringPatterns.locator('[data-testid="pattern-item"]').all();
  }

  async getAnomalies() {
    await expect(this.anomalies).toBeVisible();
    return await this.anomalies.locator('[data-testid="anomaly-item"]').all();
  }

  async clickAnomalyMonth(monthName) {
    const anomaly = this.page.locator(`[data-testid="anomaly-item"][data-month="${monthName}"]`);
    await expect(anomaly).toBeVisible();
    await anomaly.click();
  }

  async getAnomalyExplanation() {
    await expect(this.anomalyExplanation).toBeVisible();
    return await this.anomalyExplanation.textContent();
  }
};
