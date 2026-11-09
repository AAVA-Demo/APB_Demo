const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.emptyChartMessage = page.locator('[data-testid="empty-chart-message"]');
    this.categoryDetailModal = page.locator('[data-testid="category-detail-modal"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.categoryTooltip = page.locator('[data-testid="category-tooltip"]');
    
    this.comparisonTable = page.locator('[data-testid="comparison-table"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    
    this.trendLineChart = page.locator('[data-testid="trend-line-chart"]');
    this.monthDetailModal = page.locator('[data-testid="month-detail-modal"]');
    
    this.categoryItems = page.locator('[data-testid="category-item"]');
    this.transactionItems = page.locator('[data-testid="transaction-item"]');
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryBreakdown() {
    await this.categoryItems.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.categoryItems.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.categoryItems.nth(i);
      const name = await item.locator('[data-testid="category-name"]').textContent();
      const amount = await item.locator('[data-testid="category-amount"]').textContent();
      const percentage = await item.locator('[data-testid="category-percentage"]').textContent();
      
      categories.push({
        name: name.trim(),
        amount: amount.trim(),
        percentage: percentage.trim()
      });
    }
    
    return categories;
  }

  async clickCategory(categoryName) {
    logger.info(`Clicking category: ${categoryName}`);
    const category = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await category.click();
    await this.page.waitForTimeout(500);
  }

  async getCategoryTransactions() {
    await this.transactionItems.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.transactionItems.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.transactionItems.nth(i);
      const merchantName = await item.locator('[data-testid="merchant-name"]').textContent();
      const date = await item.locator('[data-testid="transaction-date"]').textContent();
      const amount = await item.locator('[data-testid="transaction-amount"]').textContent();
      
      transactions.push({
        merchantName: merchantName.trim(),
        date: date.trim(),
        amount: amount.trim()
      });
    }
    
    return transactions;
  }

  async hoverOverCategory(categoryName) {
    logger.info(`Hovering over category: ${categoryName}`);
    const category = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await category.hover();
    await this.page.waitForTimeout(500);
  }

  async navigateToHistoricalComparison() {
    logger.info('Navigating to historical comparison view');
    await this.page.locator('[data-testid="historical-comparison-tab"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async getComparisonData() {
    await this.comparisonTable.waitFor({ state: 'visible', timeout: 10000 });
    const rows = this.comparisonTable.locator('tbody tr');
    const count = await rows.count();
    const data = [];
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const category = await row.locator('td').nth(0).textContent();
      const currentMonth = await row.locator('td').nth(1).textContent();
      const previousMonth = await row.locator('td').nth(2).textContent();
      const percentageChange = await row.locator('td').nth(3).textContent();
      
      data.push({
        category: category.trim(),
        currentMonth: currentMonth.trim(),
        previousMonth: previousMonth.trim(),
        percentageChange: percentageChange.trim()
      });
    }
    
    return data;
  }

  async navigateToTrendAnalysis() {
    logger.info('Navigating to trend analysis view');
    await this.page.locator('[data-testid="trend-analysis-tab"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTrendDataPoints() {
    await this.trendLineChart.waitFor({ state: 'visible', timeout: 10000 });
    const dataPoints = this.page.locator('[data-testid="trend-data-point"]');
    const count = await dataPoints.count();
    const points = [];
    
    for (let i = 0; i < count; i++) {
      const point = dataPoints.nth(i);
      const month = await point.getAttribute('data-month');
      const amount = await point.getAttribute('data-amount');
      
      points.push({
        month: month,
        amount: amount
      });
    }
    
    return points;
  }

  async clickTrendDataPoint(month) {
    logger.info(`Clicking trend data point for month: ${month}`);
    const dataPoint = this.page.locator(`[data-testid="trend-data-point"][data-month="${month}"]`);
    await dataPoint.click();
    await this.page.waitForTimeout(500);
  }

  async getMonthDetails() {
    await this.monthDetailModal.waitFor({ state: 'visible', timeout: 10000 });
    
    const categoryBreakdown = await this.monthDetailModal.locator('[data-testid="month-category-breakdown"]').textContent();
    const topMerchants = await this.monthDetailModal.locator('[data-testid="month-top-merchants"]').textContent();
    const transactionCount = await this.monthDetailModal.locator('[data-testid="month-transaction-count"]').textContent();
    
    return {
      categoryBreakdown: categoryBreakdown.trim(),
      topMerchants: topMerchants.trim(),
      transactionCount: transactionCount.trim()
    };
  }
};
