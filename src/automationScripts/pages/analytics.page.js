const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');
const config = require('../../../data/config.json');

const logger = new Logger('AnalyticsPage');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics container
    this.analyticsContainer = page.locator('#analytics');
    
    // Chart locators
    this.monthlyTrendsChart = page.locator('#monthly-trends, canvas[id*="monthly"]').first();
    this.cardWiseChart = page.locator('#card-wise, canvas[id*="card"]').first();
    this.categoryWiseChart = page.locator('#category-wise, canvas[id*="category"]').first();
    
    // Chart containers
    this.monthlyTrendsContainer = page.locator('.chart-container:has-text("Monthly Spending Trends")');
    this.cardWiseContainer = page.locator('.chart-container:has-text("Card-wise Spending")');
    this.categoryWiseContainer = page.locator('.chart-container:has-text("Category-wise Spending")');
    
    // Messages and errors
    this.insufficientDataMessage = page.locator('text=/Insufficient data for trend analysis/i');
    this.analyticsError = page.locator('.alert-danger, text=/Analytics data cannot be generated/i');
    this.categoryWarning = page.locator('.alert-warning, text=/invalid categories/i');
    this.inactiveCategoriesSummary = page.locator('text=/No spending in the following categories/i');
    
    // Action buttons
    this.retryButton = page.locator('button:has-text("Retry")');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=/Loading analytics/i');
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto(config.baseUrl + '/analytics');
    await this.page.waitForLoadState('networkidle');
    logger.info('Analytics page loaded');
  }

  async waitForChartsToLoad() {
    logger.info('Waiting for charts to load');
    // Wait for at least one chart to be visible
    await this.page.waitForSelector('canvas', { state: 'visible', timeout: 10000 }).catch(() => {
      logger.warn('No charts found or timeout waiting for charts');
    });
    // Additional wait for chart rendering
    await this.page.waitForTimeout(1000);
    logger.info('Charts loaded');
  }

  async verifyMonthlyTrendsChartVisible() {
    logger.info('Verifying monthly trends chart is visible');
    await expect(this.monthlyTrendsChart).toBeVisible();
  }

  async verifyCardWiseChartVisible() {
    logger.info('Verifying card-wise chart is visible');
    await expect(this.cardWiseChart).toBeVisible();
  }

  async verifyCategoryWiseChartVisible() {
    logger.info('Verifying category-wise chart is visible');
    await expect(this.categoryWiseChart).toBeVisible();
  }

  async clickRetryButton() {
    logger.info('Clicking retry button');
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
  }

  async getChartDataPoints(chartLocator) {
    logger.info('Getting chart data points');
    // Note: Extracting actual data from Chart.js canvas requires more complex logic
    // This is a placeholder for chart data verification
    const chartExists = await chartLocator.isVisible();
    return chartExists;
  }
};