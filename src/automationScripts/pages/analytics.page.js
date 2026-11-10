const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('.analytics-container');
    this.pieChart = page.locator('canvas#category-pie-chart');
    this.lineChart = page.locator('canvas#monthly-trends-chart');
    this.noDataMessage = page.locator('.no-data-message');
    this.transactionList = page.locator('.transaction-table');
    this.analyticsMenuItem = page.locator('a[href="#!/analytics"]');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to Analytics page');
    await this.analyticsMenuItem.click();
    await expect(this.analyticsContainer).toBeVisible();
  }

  async scrollToMonthlyTrends() {
    logger.info('Scrolling to Monthly Trends chart');
    await this.lineChart.scrollIntoViewIfNeeded();
  }

  async getPieChartSegmentCount() {
    logger.info('Getting pie chart segment count');
    const segments = this.page.locator('.chart-segment');
    return await segments.count();
  }

  async verifySegmentData(category, amount, color) {
    logger.info(`Verifying segment: ${category}, ${amount}, ${color}`);
    const segment = this.page.locator(`.chart-segment:has-text("${category}")`);
    await expect(segment).toBeVisible();
    const segmentText = await segment.textContent();
    expect(segmentText).toContain(amount);
    const segmentColor = await segment.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(this.rgbToHex(segmentColor)).toBe(color);
  }

  async clickPieChartSegment(category) {
    logger.info('Clicking pie chart segment: ' + category);
    const segment = this.page.locator(`.chart-segment:has-text("${category}")`);
    await segment.click();
  }

  async isSegmentVisible(category) {
    logger.info('Checking if segment is visible: ' + category);
    const segment = this.page.locator(`.chart-segment:has-text("${category}")`);
    return await segment.isVisible();
  }

  async getSegmentAmount(category) {
    logger.info('Getting segment amount for: ' + category);
    const segment = this.page.locator(`.chart-segment:has-text("${category}")`);
    const text = await segment.textContent();
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : null;
  }

  async getLineChartDataPointCount() {
    logger.info('Getting line chart data point count');
    const dataPoints = this.page.locator('.chart-data-point');
    return await dataPoints.count();
  }

  async verifyMonthDataPoint(month, amount) {
    logger.info(`Verifying month data point: ${month}, ${amount}`);
    const dataPoint = this.page.locator(`.chart-data-point[data-month="${month}"]`);
    await expect(dataPoint).toBeVisible();
    const value = await dataPoint.getAttribute('data-value');
    expect(value).toContain(amount);
  }

  async verifyAxisLabels(xAxisType, yAxisType) {
    logger.info(`Verifying axis labels: X-axis=${xAxisType}, Y-axis=${yAxisType}`);
    const xAxisLabel = this.page.locator('.x-axis-label');
    const yAxisLabel = this.page.locator('.y-axis-label');
    await expect(xAxisLabel).toBeVisible();
    await expect(yAxisLabel).toBeVisible();
    if (xAxisType === 'month') {
      const xText = await xAxisLabel.textContent();
      expect(xText).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
    }
    if (yAxisType === 'currency') {
      const yText = await yAxisLabel.textContent();
      expect(yText).toMatch(/[₹$]/);
    }
  }

  async getZeroValueMonthCount() {
    logger.info('Getting zero value month count');
    const zeroMonths = this.page.locator('.chart-data-point[data-value="0"]');
    return await zeroMonths.count();
  }

  async getMonthDataPointValue(month) {
    logger.info('Getting data point value for month: ' + month);
    const dataPoint = this.page.locator(`.chart-data-point[data-month="${month}"]`);
    await expect(dataPoint).toBeVisible();
    return await dataPoint.getAttribute('data-value');
  }

  async getTransactionListTotal(month) {
    logger.info('Getting transaction list total for month: ' + month);
    const totalElement = this.page.locator(`.transaction-total[data-month="${month}"]`);
    await expect(totalElement).toBeVisible();
    return await totalElement.textContent();
  }

  async checkConsoleErrors(page) {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result) return null;
    const r = parseInt(result[0]).toString(16).padStart(2, '0');
    const g = parseInt(result[1]).toString(16).padStart(2, '0');
    const b = parseInt(result[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }
};
