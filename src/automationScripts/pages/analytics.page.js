const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.paginationControls = page.locator('[data-testid="pagination"]');
    this.tooltip = page.locator('[data-testid="chart-tooltip"]');
    this.patternVisualization = page.locator('[data-testid="pattern-visualization"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.anomalyIndicator = page.locator('[data-testid="anomaly-indicator"]');
    this.detailedTransactionView = page.locator('[data-testid="detailed-transactions"]');
    this.tableView = page.locator('[data-testid="table-view"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.monthDetailView = page.locator('[data-testid="month-detail"]');
    this.infoMessage = page.locator('[data-testid="info-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    logger.info('Navigated to analytics page');
  }

  async navigateToPatternAnalysis() {
    await this.page.goto('/analytics/patterns');
    logger.info('Navigated to pattern analysis');
  }

  async navigateToTrendAnalysis() {
    await this.page.goto('/analytics/trends');
    logger.info('Navigated to trend analysis');
  }

  async waitForCategoryChartLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    logger.info('Category chart loaded');
  }

  async getAllCategories() {
    const categoryElements = await this.page.locator('[data-category]').all();
    const categories = [];
    for (const elem of categoryElements) {
      const category = await elem.getAttribute('data-category');
      categories.push(category);
    }
    return categories;
  }

  async getVisibleCategories() {
    const categoryElements = await this.page.locator('[data-category]:visible').all();
    const categories = [];
    for (const elem of categoryElements) {
      const category = await elem.getAttribute('data-category');
      categories.push(category);
    }
    return categories;
  }

  async clickCategorySegment(categoryName) {
    const segment = this.page.locator(`[data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.click();
    logger.info(`Clicked on category: ${categoryName}`);
  }

  async getTransactionDetails() {
    await expect(this.transactionList).toBeVisible();
    const transactions = await this.page.locator('[data-testid="transaction-item"]').all();
    const details = [];
    for (const txn of transactions) {
      const merchantName = await txn.locator('[data-field="merchant"]').textContent();
      const amount = await txn.locator('[data-field="amount"]').textContent();
      const date = await txn.locator('[data-field="date"]').textContent();
      const category = await txn.getAttribute('data-category');
      details.push({ merchantName, amount: parseFloat(amount.replace(/[^0-9.]/g, '')), date, category });
    }
    return details;
  }

  async getPaginationInfo() {
    await expect(this.paginationControls).toBeVisible();
    return await this.paginationControls.textContent();
  }

  async clickNextPage() {
    const nextButton = this.page.locator('[data-testid="next-page"]');
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    logger.info('Clicked next page');
  }

  async hoverOverCategory(categoryName) {
    const segment = this.page.locator(`[data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.hover();
    logger.info(`Hovered over category: ${categoryName}`);
  }

  async getTooltipData() {
    await expect(this.tooltip).toBeVisible();
    const amount = await this.tooltip.locator('[data-field="amount"]').textContent();
    const percentage = await this.tooltip.locator('[data-field="percentage"]').textContent();
    const transactionCount = await this.tooltip.locator('[data-field="count"]').textContent();
    return { amount, percentage, transactionCount };
  }

  async getRecurringPatterns() {
    const patterns = await this.page.locator('[data-pattern="recurring"]').all();
    const recurringPatterns = [];
    for (const pattern of patterns) {
      const category = await pattern.getAttribute('data-category');
      const highlighted = await pattern.getAttribute('data-highlighted') === 'true';
      recurringPatterns.push({ category, highlighted });
    }
    return recurringPatterns;
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async clickAnomalyMonth(month) {
    const anomaly = this.page.locator(`[data-month="${month}"][data-anomaly="true"]`);
    await expect(anomaly).toBeVisible();
    await anomaly.click();
    logger.info(`Clicked anomaly month: ${month}`);
  }

  async getTableData() {
    await expect(this.tableView).toBeVisible();
    const rows = await this.page.locator('[data-testid="table-row"]').all();
    const data = [];
    for (const row of rows) {
      const category = await row.locator('[data-field="category"]').textContent();
      const amount = await row.locator('[data-field="amount"]').textContent();
      data.push({ category, amount });
    }
    return data;
  }

  async getTrendMonths() {
    await expect(this.trendChart).toBeVisible();
    const months = await this.page.locator('[data-month]').all();
    const monthList = [];
    for (const month of months) {
      monthList.push(await month.getAttribute('data-month'));
    }
    return monthList;
  }

  async clickMonth(month) {
    const monthElement = this.page.locator(`[data-month="${month}"]`);
    await expect(monthElement).toBeVisible();
    await monthElement.click();
    logger.info(`Clicked month: ${month}`);
  }

  async getMonthBreakdown() {
    await expect(this.monthDetailView).toBeVisible();
    const categories = await this.page.locator('[data-testid="breakdown-category"]').all();
    const breakdown = { categories: [] };
    for (const cat of categories) {
      const name = await cat.textContent();
      breakdown.categories.push(name);
    }
    return breakdown;
  }

  async getInfoMessageText() {
    await expect(this.infoMessage).toBeVisible();
    return await this.infoMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
