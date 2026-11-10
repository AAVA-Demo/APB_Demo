const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.analyticsContainer = page.locator('.spending-analytics-container');
    this.spendingChart = page.locator('canvas#spending-chart');
    this.trendChart = page.locator('canvas#trend-chart');
    this.categoryTable = page.locator('.category-table');
    this.transactionDetailsList = page.locator('.transaction-details-list');
    this.emptyDataMessage = page.locator('.empty-data-message');
    this.emptyTrendMessage = page.locator('.empty-trend-message');
    this.noTransactionMessage = page.locator('.no-transaction-message');
    this.analyticsLink = page.locator('a[href="#/analytics"]');
  }

  async navigateToSpendingAnalytics() {
    logger.info('Navigating to spending analytics');
    await this.analyticsLink.click();
    await expect(this.analyticsContainer).toBeVisible();
    logger.info('Spending analytics page loaded');
  }

  async getCategorySpending() {
    logger.info('Retrieving category spending data');
    await expect(this.categoryTable).toBeVisible();
    
    const categories = {};
    const rows = await this.categoryTable.locator('tbody tr').all();
    
    for (const row of rows) {
      const categoryName = await row.locator('td:nth-child(1)').textContent();
      const amountText = await row.locator('td:nth-child(2)').textContent();
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
      categories[categoryName.trim()] = amount;
    }
    
    logger.info(`Category spending retrieved: ${JSON.stringify(categories)}`);
    return categories;
  }

  async getWeeklyTrends() {
    logger.info('Retrieving weekly trend data');
    await expect(this.trendChart).toBeVisible();
    
    const trends = {};
    const dataPoints = await this.page.locator('.trend-data-point').all();
    
    for (const point of dataPoints) {
      const label = await point.getAttribute('data-label');
      const valueText = await point.getAttribute('data-value');
      const value = parseFloat(valueText);
      trends[label] = value;
    }
    
    logger.info(`Weekly trends retrieved: ${JSON.stringify(trends)}`);
    return trends;
  }

  async clickTrendDataPoint(label) {
    logger.info(`Clicking trend data point: ${label}`);
    const dataPoint = this.page.locator(`.trend-data-point[data-label="${label}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    logger.info(`Data point ${label} clicked`);
  }

  async getTransactionCount() {
    logger.info('Counting transactions in detail list');
    await expect(this.transactionDetailsList).toBeVisible();
    const count = await this.transactionDetailsList.locator('tbody tr').count();
    logger.info(`Transaction count: ${count}`);
    return count;
  }

  async isChartEmpty() {
    logger.debug('Checking if spending chart is empty');
    const isEmpty = await this.page.locator('.chart-empty-state').isVisible();
    logger.info(`Spending chart empty: ${isEmpty}`);
    return isEmpty;
  }

  async isTrendChartEmpty() {
    logger.debug('Checking if trend chart is empty');
    const isEmpty = await this.page.locator('.trend-chart-empty-state').isVisible();
    logger.info(`Trend chart empty: ${isEmpty}`);
    return isEmpty;
  }

  async getEmptyDataMessage() {
    logger.debug('Checking for empty data message');
    if (await this.emptyDataMessage.isVisible()) {
      const message = await this.emptyDataMessage.textContent();
      logger.info(`Empty data message: ${message}`);
      return message;
    }
    return '';
  }

  async getEmptyTrendMessage() {
    logger.debug('Checking for empty trend message');
    if (await this.emptyTrendMessage.isVisible()) {
      const message = await this.emptyTrendMessage.textContent();
      logger.info(`Empty trend message: ${message}`);
      return message;
    }
    return '';
  }

  async getNoTransactionMessage() {
    logger.debug('Checking for no transaction message');
    if (await this.noTransactionMessage.isVisible()) {
      const message = await this.noTransactionMessage.textContent();
      logger.info(`No transaction message: ${message}`);
      return message;
    }
    return '';
  }

  async waitForChartRender() {
    logger.info('Waiting for chart to render');
    await this.page.waitForTimeout(500);
    await expect(this.spendingChart).toBeVisible();
    logger.info('Chart rendered successfully');
  }
};