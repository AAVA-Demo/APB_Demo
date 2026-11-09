const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics Page Locators
    this.analyticsContainer = page.locator('[data-testid="analytics-container"], .analytics, #analytics');
    this.categoryChart = page.locator('[data-testid="category-chart"], canvas.chart-pie, canvas.chart-bar, #categoryChart');
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"], canvas.chart-line, #monthlyChart');
    this.noDataMessage = page.locator('[data-testid="no-data-message"], .alert:has-text("No spending data")');
    this.timePeriodFilter = page.locator('[data-testid="time-period-filter"], select[name="timePeriod"]');
    this.categoryTable = page.locator('[data-testid="category-table"], table');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"], .alert:has-text("Insufficient data")');
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.click('[href="#/analytics"], a:has-text("Analytics")');
    await this.page.waitForLoadState('networkidle');
    logger.info('Analytics page navigation completed');
  }

  async waitForAnalyticsLoad() {
    logger.info('Waiting for analytics page to load');
    await expect(this.analyticsContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Analytics page loaded successfully');
  }

  async getCategoryElement(categoryName) {
    logger.info(`Getting element for category: ${categoryName}`);
    return this.page.locator(`tr:has-text("${categoryName}"), .category-item:has-text("${categoryName}")`);
  }

  async getCategoryAmount(categoryName) {
    logger.info(`Getting amount for category: ${categoryName}`);
    const categoryRow = await this.getCategoryElement(categoryName);
    await expect(categoryRow).toBeVisible();
    const amountCell = categoryRow.locator('td:nth-child(2), .amount');
    const amount = await amountCell.textContent();
    return amount.trim();
  }

  async getAllCategoryAmounts() {
    logger.info('Getting all category amounts');
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    const amounts = {};
    for (const category of categories) {
      amounts[category] = await this.getCategoryAmount(category);
    }
    return amounts;
  }

  async getAllCategoryPercentages() {
    logger.info('Getting all category percentages');
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 
      'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    const percentages = {};
    for (const category of categories) {
      const categoryRow = await this.getCategoryElement(category);
      const percentCell = categoryRow.locator('.percentage, [data-percentage]');
      if (await percentCell.count() > 0) {
        percentages[category] = await percentCell.textContent();
      } else {
        // Calculate from amounts if percentage not directly displayed
        percentages[category] = '0%';
      }
    }
    return percentages;
  }

  async getNoDataMessageText() {
    await expect(this.noDataMessage).toBeVisible();
    const text = await this.noDataMessage.textContent();
    logger.info(`No data message: ${text}`);
    return text.trim();
  }

  async selectTimePeriod(period) {
    logger.info(`Selecting time period: ${period}`);
    await expect(this.timePeriodFilter).toBeVisible();
    await this.timePeriodFilter.selectOption({ label: period });
    logger.info('Time period selected');
  }

  async waitForChartUpdate() {
    logger.info('Waiting for chart to update');
    await this.page.waitForTimeout(1000); // Wait for chart animation/update
    await this.page.waitForLoadState('networkidle');
    logger.info('Chart update completed');
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    const text = await this.insufficientDataMessage.textContent();
    logger.info(`Insufficient data message: ${text}`);
    return text.trim();
  }

  async hoverOverChartDataPoint(index = 0) {
    logger.info(`Hovering over chart data point at index: ${index}`);
    await expect(this.monthlyTrendChart).toBeVisible();
    const chartBox = await this.monthlyTrendChart.boundingBox();
    if (chartBox) {
      const x = chartBox.x + (chartBox.width / 12) * (index + 1);
      const y = chartBox.y + chartBox.height / 2;
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(500); // Wait for tooltip to appear
      logger.info('Hovered over chart data point');
    }
  }

  async getTooltipText() {
    logger.info('Getting tooltip text');
    const tooltip = this.page.locator('.chart-tooltip, [role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    const text = await tooltip.textContent();
    logger.info(`Tooltip text: ${text}`);
    return text.trim();
  }
};