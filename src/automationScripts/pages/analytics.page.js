const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

/**
 * Page Object: AnalyticsPage
 * Handles all interactions with the Spending Analytics and Insights
 * Used by test cases: QE-8988 TS-001/002/003 TC-001, QE-8985 TS-001/002/003 TC-001
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // View Selection Locators
    this.categoryViewButton = page.locator('[data-testid="view-category"]');
    this.monthlyTrendViewButton = page.locator('[data-testid="view-monthly-trend"]');
    this.cardWiseViewButton = page.locator('[data-testid="view-card-wise"]');
    
    // Chart Locators
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    
    // Category Locators
    this.categorySegments = page.locator('[data-testid="category-segment"]');
    this.categoryLabels = page.locator('[data-testid="category-label"]');
    
    // Drill-down Locators
    this.drillDownContainer = page.locator('[data-testid="drill-down-container"]');
    this.drillDownTransactions = page.locator('[data-testid="drill-down-transaction"]');
    this.backToCategoryButton = page.locator('[data-testid="back-to-category"]');
    
    // Notification Locators
    this.limitedDataNotification = page.locator('[data-testid="limited-data-notification"]');
    
    // Data Point Locators
    this.dataPoints = page.locator('[data-testid="data-point"]');
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsLoad() {
    logger.info('Waiting for analytics to load');
    await this.page.waitForSelector('[data-testid="analytics-container"]', { state: 'visible' });
  }

  async selectCategoryView() {
    logger.info('Selecting category view');
    await this.categoryViewButton.click();
    await this.categoryPieChart.waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectMonthlyTrendView() {
    logger.info('Selecting monthly trend view');
    await this.monthlyTrendViewButton.click();
    await this.monthlyTrendChart.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getCategoryCount() {
    const count = await this.categorySegments.count();
    logger.info(`Category count: ${count}`);
    return count;
  }

  async isPieChartInteractive() {
    // Check if chart responds to hover events
    const firstSegment = this.categorySegments.first();
    await firstSegment.hover();
    
    // Check if tooltip or highlight appears
    const tooltipVisible = await this.chartTooltip.isVisible({ timeout: 2000 }).catch(() => false);
    return tooltipVisible;
  }

  async clickCategorySegment(categoryName) {
    logger.info(`Clicking category segment: ${categoryName}`);
    const segment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    await segment.click();
  }

  async waitForDrillDownView() {
    logger.info('Waiting for drill-down view');
    await this.drillDownContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getDrillDownTransactions() {
    const count = await this.drillDownTransactions.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const txn = this.drillDownTransactions.nth(i);
      const merchant = await txn.locator('[data-testid="txn-merchant"]').textContent();
      const date = await txn.locator('[data-testid="txn-date"]').textContent();
      const amount = await txn.locator('[data-testid="txn-amount"]').textContent();
      
      transactions.push({
        merchant: merchant.trim(),
        date: date.trim(),
        amount: parseFloat(amount.replace(/[^0-9.]/g, ''))
      });
    }
    
    logger.info(`Drill-down transactions count: ${transactions.length}`);
    return transactions;
  }

  async hasBackToCategoryView() {
    const isVisible = await this.backToCategoryButton.isVisible().catch(() => false);
    return isVisible;
  }

  async getCategoryAmount(categoryName) {
    const categoryData = this.page.locator(`[data-testid="category-data"][data-category="${categoryName}"]`);
    const amountText = await categoryData.locator('[data-testid="category-amount"]').textContent();
    const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
    logger.info(`Category ${categoryName} amount: ${amount}`);
    return amount;
  }

  async getTotalSpendingDisplayed() {
    const totalElement = this.page.locator('[data-testid="total-spending"]');
    const totalText = await totalElement.textContent();
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    logger.info(`Total spending displayed: ${total}`);
    return total;
  }

  async getCategoryPercentage(categoryName) {
    const categoryData = this.page.locator(`[data-testid="category-data"][data-category="${categoryName}"]`);
    const percentageText = await categoryData.locator('[data-testid="category-percentage"]').textContent();
    const percentage = parseFloat(percentageText.replace(/[^0-9.]/g, ''));
    logger.info(`Category ${categoryName} percentage: ${percentage}%`);
    return percentage;
  }

  async getMonthlyDataPoints() {
    const count = await this.dataPoints.count();
    const points = [];
    
    for (let i = 0; i < count; i++) {
      const point = this.dataPoints.nth(i);
      const month = await point.getAttribute('data-month');
      const amount = await point.getAttribute('data-amount');
      points.push({ month, amount: parseFloat(amount) });
    }
    
    logger.info(`Monthly data points count: ${points.length}`);
    return points;
  }

  async isLineChartInteractive() {
    // Check if chart responds to hover events
    const firstPoint = this.dataPoints.first();
    await firstPoint.hover();
    
    // Check if tooltip appears
    const tooltipVisible = await this.chartTooltip.isVisible({ timeout: 2000 }).catch(() => false);
    return tooltipVisible;
  }

  async hoverOverDataPoint(month) {
    logger.info(`Hovering over data point for month: ${month}`);
    const dataPoint = this.page.locator(`[data-testid="data-point"][data-month="${month}"]`);
    await dataPoint.hover();
    await this.chartTooltip.waitFor({ state: 'visible', timeout: 3000 });
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    const text = await this.chartTooltip.textContent();
    logger.info(`Tooltip text: ${text}`);
    return text.trim();
  }

  async clickDataPoint(month) {
    logger.info(`Clicking data point for month: ${month}`);
    const dataPoint = this.page.locator(`[data-testid="data-point"][data-month="${month}"]`);
    await dataPoint.click();
  }

  async getLimitedDataNotification() {
    await expect(this.limitedDataNotification).toBeVisible();
    const text = await this.limitedDataNotification.textContent();
    logger.info(`Limited data notification: ${text}`);
    return text.trim();
  }

  async getMonthAmount(month) {
    const dataPoint = this.page.locator(`[data-testid="data-point"][data-month="${month}"]`);
    const amount = await dataPoint.getAttribute('data-amount');
    const value = parseFloat(amount);
    logger.info(`Month ${month} amount: ${value}`);
    return value;
  }
};
