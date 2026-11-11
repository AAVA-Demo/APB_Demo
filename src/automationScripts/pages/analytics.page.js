const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {

  constructor(page) {
    this.page = page;
    
    // Category Chart Locators
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    this.chartLegend = page.locator('[data-testid="chart-legend"]');
    this.selectedSegment = page.locator('[data-testid="chart-segment"].selected');
    
    // Trend Chart Locators
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.trendDataPoints = page.locator('[data-testid="trend-data-point"]');
    
    // Filter Locators
    this.dateRangeFilter = page.locator('[data-testid="date-range-filter"]');
    this.startDateInput = page.locator('[data-testid="start-date"]');
    this.endDateInput = page.locator('[data-testid="end-date"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter"]');
    this.clearFilterButton = page.locator('[data-testid="clear-filter"]');
    
    // Empty State Locators
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    
    // Navigation
    this.trendSectionTab = page.locator('[data-testid="trend-section-tab"]');
    
    // Console error tracking
    this.consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
  }

  async waitForPageLoad() {
    logger.info('Waiting for analytics page to load');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async navigateToTrendSection() {
    logger.info('Navigating to trend section');
    await this.trendSectionTab.click();
    await this.page.waitForTimeout(500);
  }

  async getCategoryLabels() {
    logger.info('Getting category labels');
    const labels = await this.page.locator('[data-testid="category-label"]').allTextContents();
    return labels.map(l => l.trim());
  }

  async getCategoryTotals() {
    logger.info('Getting category totals');
    const categories = await this.page.locator('[data-testid="category-item"]').all();
    const totals = {};
    
    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      const amount = await category.locator('[data-testid="category-amount"]').textContent();
      totals[name.trim()] = amount.trim();
    }
    
    logger.info(`Category totals: ${JSON.stringify(totals)}`);
    return totals;
  }

  async getCategoryPercentages() {
    logger.info('Getting category percentages');
    const categories = await this.page.locator('[data-testid="category-item"]').all();
    const percentages = {};
    
    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      const percentage = await category.locator('[data-testid="category-percentage"]').textContent();
      percentages[name.trim()] = percentage.trim();
    }
    
    logger.info(`Category percentages: ${JSON.stringify(percentages)}`);
    return percentages;
  }

  async hoverOverCategorySegment(categoryName) {
    logger.info(`Hovering over category segment: ${categoryName}`);
    const segment = this.page.locator(`[data-testid="chart-segment"][data-category="${categoryName}"]`);
    await segment.hover();
    await this.page.waitForTimeout(500);
  }

  async clickCategorySegment(categoryName) {
    logger.info(`Clicking category segment: ${categoryName}`);
    const segment = this.page.locator(`[data-testid="chart-segment"][data-category="${categoryName}"]`);
    await segment.click();
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    const text = await this.chartTooltip.textContent();
    logger.info(`Tooltip text: ${text}`);
    return text.trim();
  }

  async getLegendItems() {
    const items = await this.page.locator('[data-testid="legend-item"]').allTextContents();
    logger.info(`Legend items: ${JSON.stringify(items)}`);
    return items.map(i => i.trim());
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    const text = await this.emptyStateMessage.textContent();
    logger.info(`Empty state message: ${text}`);
    return text.trim();
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    const text = await this.insufficientDataMessage.textContent();
    logger.info(`Insufficient data message: ${text}`);
    return text.trim();
  }

  async getTrendDataPoints() {
    await this.page.waitForTimeout(500);
    const count = await this.trendDataPoints.count();
    logger.info(`Trend data points count: ${count}`);
    return Array.from({ length: count }, (_, i) => i);
  }

  async getMonthlyTotals() {
    logger.info('Getting monthly totals');
    const months = await this.page.locator('[data-testid="month-item"]').all();
    const totals = {};
    
    for (const month of months) {
      const name = await month.locator('[data-testid="month-name"]').textContent();
      const amount = await month.locator('[data-testid="month-amount"]').textContent();
      totals[name.trim()] = amount.trim();
    }
    
    logger.info(`Monthly totals: ${JSON.stringify(totals)}`);
    return totals;
  }

  async applyDateRangeFilter(preset) {
    logger.info(`Applying date range filter: ${preset}`);
    const presetButton = this.page.locator(`[data-testid="date-preset-${preset}"]`);
    await presetButton.click();
    await this.page.waitForTimeout(1000);
  }

  async applyCustomDateRange(startDate, endDate) {
    logger.info(`Applying custom date range: ${startDate} to ${endDate}`);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(1000);
  }

  async clearDateRangeFilter() {
    logger.info('Clearing date range filter');
    await this.clearFilterButton.click();
    await this.page.waitForTimeout(1000);
  }

  async getConsoleErrors() {
    return this.consoleErrors;
  }

};