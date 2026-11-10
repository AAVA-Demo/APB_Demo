const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TrendAnalysisPage = class TrendAnalysisPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.analyticsMenu = page.locator('a[href*="analytics"]');
    this.trendAnalysisLink = page.locator('text=Monthly Trend');
    this.lineChart = page.locator('canvas#trendChart, [data-testid="trend-chart"]');
    this.dataPoints = page.locator('.data-point, [data-month]');
    this.monthLabels = page.locator('.month-label, [data-month-name]');
    this.periodFilter = page.locator('select#period-filter, [data-testid="period-filter"]');
    this.informationalMessage = page.locator('[data-testid="info-message"], .info-message');
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list');
    this.transactionItems = page.locator('.transaction-item, [data-testid="transaction-item"]');
    this.navigationLinks = page.locator('nav a');
    this.chartLegend = page.locator('.chart-legend, [data-testid="chart-legend"]');
  }

  async navigate() {
    logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAuthenticationComplete() {
    logger.info('Waiting for authentication to complete');
    await this.page.waitForSelector('[data-testid="authenticated"], .user-authenticated', { timeout: 5000 }).catch(() => {
      logger.warn('Authentication indicator not found, proceeding');
    });
  }

  async navigateToTrendAnalysis() {
    logger.info('Navigating to Trend Analysis');
    await this.analyticsMenu.click();
    await this.trendAnalysisLink.click();
  }

  async waitForPageLoad(timeout = 3000) {
    logger.info(`Waiting for page load with timeout: ${timeout}ms`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(timeout);
  }

  async waitForChartRender() {
    logger.info('Waiting for chart to render');
    await this.lineChart.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getDataPointCount() {
    logger.info('Getting data point count');
    const count = await this.dataPoints.count();
    if (count === 0) {
      // Fallback to month labels
      return await this.monthLabels.count();
    }
    return count;
  }

  async getMonthLabels() {
    logger.info('Getting month labels');
    const labels = await this.monthLabels.allTextContents();
    return labels.map(label => label.trim());
  }

  async getMonthlySpendData() {
    logger.info('Getting monthly spend data');
    const data = {};
    const labels = await this.getMonthLabels();
    
    for (const label of labels) {
      const valueLocator = this.page.locator(`[data-month="${label}"] .spend-value, [data-month-name="${label}"] + .spend-amount`);
      const valueText = await valueLocator.textContent();
      const value = parseFloat(valueText.replace(/[^0-9.]/g, ''));
      data[label] = value;
    }
    
    return data;
  }

  async clickDataPoint(monthName) {
    logger.info(`Clicking data point for month: ${monthName}`);
    const dataPoint = this.page.locator(`[data-month="${monthName}"], [aria-label*="${monthName}"]`);
    await dataPoint.click();
  }

  async waitForTransactionListLoad() {
    logger.info('Waiting for transaction list to load');
    await this.transactionList.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getTransactionCount() {
    logger.info('Getting transaction count');
    return await this.transactionItems.count();
  }

  async getTransactionListTotal() {
    logger.info('Getting transaction list total');
    const totalElement = this.page.locator('[data-testid="transaction-total"], .transaction-total');
    const text = await totalElement.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getInformationalMessage() {
    logger.info('Getting informational message');
    await this.informationalMessage.waitFor({ state: 'visible', timeout: 3000 });
    return await this.informationalMessage.textContent();
  }

  async isGraphVisible() {
    logger.info('Checking if graph is visible');
    try {
      await this.lineChart.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async isNavigationActive() {
    logger.info('Checking if navigation is active');
    const count = await this.navigationLinks.count();
    if (count === 0) return false;
    
    const firstLink = this.navigationLinks.first();
    const isEnabled = await firstLink.isEnabled();
    const isVisible = await firstLink.isVisible();
    return isEnabled && isVisible;
  }

  async getSelectedPeriod() {
    logger.info('Getting selected period');
    const selectedOption = await this.periodFilter.locator('option[selected]').textContent();
    return selectedOption.trim();
  }

  async selectPeriodFilter(period) {
    logger.info(`Selecting period filter: ${period}`);
    await this.periodFilter.selectOption({ label: period });
  }

  async waitForChartUpdate(timeout = 3000) {
    logger.info(`Waiting for chart update with timeout: ${timeout}ms`);
    await this.page.waitForTimeout(timeout);
    await this.waitForChartRender();
  }

  async isDrillDownActive() {
    logger.info('Checking if drill-down is active');
    const months = await this.getMonthLabels();
    if (months.length === 0) return false;
    
    const firstMonth = months[0];
    const dataPoint = this.page.locator(`[data-month="${firstMonth}"], [aria-label*="${firstMonth}"]`);
    const isClickable = await dataPoint.isEnabled();
    return isClickable;
  }
};
