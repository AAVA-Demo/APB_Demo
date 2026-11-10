const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.drillDownView = page.locator('[data-testid="drill-down-view"]');
    this.backButton = page.locator('button:has-text("Back")');
    this.noDataMessage = page.locator('.no-data-message, .empty-state');
    this.errorMessage = page.locator('.error-message, .alert-danger');
  }

  async navigate() {
    await this.page.click('a[href*="analytics"], nav a:has-text("Analytics")');
    await expect(this.page).toHaveURL(/analytics/);
    logger.info('Navigated to Analytics page');
  }

  async waitForCategoryChart() {
    await expect(this.categoryChart).toBeVisible({ timeout: 3000 });
    logger.info('Category chart loaded');
  }

  async getAllCategories() {
    await this.waitForCategoryChart();
    const categories = await this.page.locator('[data-category]').allTextContents();
    logger.info(`Categories retrieved: ${categories.join(', ')}`);
    return categories;
  }

  async isChartInteractive() {
    const chartElement = await this.categoryChart.elementHandle();
    const hasClickHandler = await chartElement.evaluate(el => {
      return typeof el.onclick === 'function' || el.getAttribute('onclick') !== null;
    });
    logger.info(`Chart interactive: ${hasClickHandler}`);
    return hasClickHandler;
  }

  async getTotalSpending() {
    const totalElement = this.page.locator('[data-testid="total-spending"]');
    await expect(totalElement).toBeVisible();
    const value = await totalElement.textContent();
    const numericValue = parseFloat(value.replace(/[$,]/g, ''));
    logger.info(`Total spending: $${numericValue}`);
    return numericValue;
  }

  async sumCategoryAmounts() {
    const amounts = await this.page.locator('[data-category-amount]').allTextContents();
    const sum = amounts.reduce((acc, val) => acc + parseFloat(val.replace(/[$,]/g, '')), 0);
    logger.info(`Category sum: $${sum}`);
    return sum;
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    const message = await this.noDataMessage.textContent();
    logger.info(`No data message: ${message}`);
    return message.trim();
  }

  async hasZeroStateVisualization() {
    const zeroState = this.page.locator('.zero-state, .empty-chart');
    const isVisible = await zeroState.isVisible();
    logger.info(`Zero-state visualization visible: ${isVisible}`);
    return isVisible;
  }

  async canNavigateToOtherSections() {
    const navLinks = this.page.locator('nav a, .nav-link');
    const count = await navLinks.count();
    logger.info(`Navigation links available: ${count}`);
    return count > 0;
  }

  async getCategoryAmount(categoryName) {
    const categoryElement = this.page.locator(`[data-category="${categoryName}"]`);
    await expect(categoryElement).toBeVisible();
    const amount = await categoryElement.getAttribute('data-category-amount');
    logger.info(`${categoryName} amount: ${amount}`);
    return amount;
  }

  async isVisualizationComplete() {
    const chartCanvas = this.categoryChart.locator('canvas, svg');
    const isVisible = await chartCanvas.isVisible();
    logger.info(`Visualization complete: ${isVisible}`);
    return isVisible;
  }

  async navigateToSpendingTrends() {
    await this.page.click('a[href*="trends"], button:has-text("Spending Trends")');
    await expect(this.trendChart).toBeVisible();
    logger.info('Navigated to Spending Trends section');
  }

  async getChartType() {
    const chartType = await this.trendChart.getAttribute('data-chart-type');
    logger.info(`Chart type: ${chartType}`);
    return chartType;
  }

  async getMonthLabels() {
    const labels = await this.page.locator('[data-month-label]').allTextContents();
    logger.info(`Month labels: ${labels.join(', ')}`);
    return labels;
  }

  async isTrendChartInteractive() {
    const chartElement = await this.trendChart.elementHandle();
    const hasClickHandler = await chartElement.evaluate(el => {
      return typeof el.onclick === 'function' || el.getAttribute('onclick') !== null;
    });
    logger.info(`Trend chart interactive: ${hasClickHandler}`);
    return hasClickHandler;
  }

  async clickMonthDataPoint(monthName) {
    const dataPoint = this.page.locator(`[data-month="${monthName}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    logger.info(`Clicked on month data point: ${monthName}`);
  }

  async getDrillDownCategories() {
    await expect(this.drillDownView).toBeVisible();
    const categories = await this.drillDownView.locator('[data-category]').allTextContents();
    logger.info(`Drill-down categories: ${categories.join(', ')}`);
    return categories;
  }

  async clickBackButton() {
    await expect(this.backButton).toBeVisible();
    await this.backButton.click();
    logger.info('Clicked Back button');
  }

  async getDataAvailabilityMessage() {
    const message = this.page.locator('.data-availability-message, .partial-data-notice');
    await expect(message).toBeVisible();
    const text = await message.textContent();
    logger.info(`Data availability message: ${text}`);
    return text.trim();
  }

  async hasEmptyDataPoints() {
    const emptyPoints = await this.page.locator('[data-empty="true"]').count();
    logger.info(`Empty data points: ${emptyPoints}`);
    return emptyPoints > 0;
  }

  async getExpiredDataMessage() {
    const message = this.page.locator('.expired-data-message, .data-unavailable-notice');
    await expect(message).toBeVisible();
    const text = await message.textContent();
    logger.info(`Expired data message: ${text}`);
    return text.trim();
  }
};
