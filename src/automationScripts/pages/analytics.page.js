const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.categoryBreakdownChart = page.locator('.category-breakdown-chart, [data-testid="category-chart"]');
    this.monthlyTrendChart = page.locator('.monthly-trend-chart, [data-testid="trend-chart"]');
    
    // Category Locators
    this.categoryElements = page.locator('.category-item, .chart-segment');
    this.categoryTooltip = page.locator('.chart-tooltip, .category-tooltip');
    this.trendTooltip = page.locator('.trend-tooltip, .chart-tooltip');
    
    // Filter Locators
    this.categoryFilterButtons = page.locator('.category-filter, button[data-category]');
    this.dateRangeStartInput = page.locator('input[name="startDate"], #startDate');
    this.dateRangeEndInput = page.locator('input[name="endDate"], #endDate');
    this.applyFilterButton = page.locator('button:has-text("Apply"), button:has-text("Filter")');
    
    // Message Locators
    this.noDataMessage = page.locator('.no-data-message, .empty-state');
    this.insufficientDataMessage = page.locator('.insufficient-data, .warning-message');
    this.errorNotification = page.locator('.error-notification, .alert-danger');
    
    // Chart Elements
    this.chartTitle = page.locator('.chart-title, h3, h4');
    this.monthLabels = page.locator('.month-label, .x-axis-label');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await expect(this.page).toHaveURL(/.*analytics/);
    logger.info('Navigated to analytics page');
  }

  async getCategoryElement(categoryName) {
    const categoryLocator = this.page.locator(`.category-item:has-text("${categoryName}"), [data-category="${categoryName}"]`);
    return categoryLocator;
  }

  async getAllCategorySpending() {
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    const spending = {};
    
    for (const category of categories) {
      const categoryElement = await this.getCategoryElement(category);
      if (await categoryElement.isVisible()) {
        const spendElement = categoryElement.locator('.category-amount, .spend-value');
        if (await spendElement.isVisible()) {
          const spendText = await spendElement.textContent();
          spending[category] = spendText.trim();
        }
      }
    }
    
    logger.info(`Retrieved spending for ${Object.keys(spending).length} categories`);
    return spending;
  }

  async getCategorySpending(categoryName) {
    const categoryElement = await this.getCategoryElement(categoryName);
    await expect(categoryElement).toBeVisible();
    const spendElement = categoryElement.locator('.category-amount, .spend-value');
    await expect(spendElement).toBeVisible();
    const spendText = await spendElement.textContent();
    logger.info(`${categoryName} spending: ${spendText}`);
    return spendText.trim();
  }

  async hoverOverCategory(categoryName) {
    const categoryElement = await this.getCategoryElement(categoryName);
    await expect(categoryElement).toBeVisible();
    await categoryElement.hover();
    logger.info(`Hovered over category: ${categoryName}`);
  }

  async selectDateRange(startDate, endDate) {
    await expect(this.dateRangeStartInput).toBeVisible();
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyFilterButton.click();
    logger.info(`Date range selected: ${startDate} to ${endDate}`);
  }

  async clickCategoryFilter(categoryName) {
    const filterButton = this.page.locator(`button:has-text("${categoryName}"), [data-category="${categoryName}"]`);
    await expect(filterButton).toBeVisible();
    await filterButton.click();
    logger.info(`Clicked category filter: ${categoryName}`);
  }

  async getMonthLabels() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const labels = await this.monthLabels.allTextContents();
    logger.info(`Found ${labels.length} month labels`);
    return labels;
  }

  async hoverOverMonth(monthLabel) {
    const monthElement = this.page.locator(`.month-label:has-text("${monthLabel}"), [data-month="${monthLabel}"]`);
    await expect(monthElement).toBeVisible();
    await monthElement.hover();
    logger.info(`Hovered over month: ${monthLabel}`);
  }

  async getChartTitle() {
    await expect(this.chartTitle).toBeVisible();
    const title = await this.chartTitle.textContent();
    logger.info(`Chart title: ${title}`);
    return title.trim();
  }

  async getChartData() {
    // This method would extract chart data from the rendered chart
    // Implementation depends on the charting library used (Chart.js, D3, etc.)
    await expect(this.monthlyTrendChart).toBeVisible();
    const chartData = await this.page.evaluate(() => {
      // Example for Chart.js
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data;
      }
      return null;
    });
    logger.info('Chart data retrieved');
    return chartData;
  }
};
