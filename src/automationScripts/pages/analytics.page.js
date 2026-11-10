const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

/**
 * AnalyticsPage - Page Object for Transaction Analytics and Category-wise Spending
 * Epic: QE-9829 - CreditCardNew20261110205228-Transaction Analytics and Category-wise Spending
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Category Chart
    this.categoryChart = page.locator('.category-chart');
    this.chartTooltip = page.locator('.chart-tooltip');
    this.categorySegments = page.locator('.category-segment');
    
    // Locators for Trend Chart
    this.trendChart = page.locator('.trend-chart');
    this.trendLine = page.locator('.trend-line');
    this.monthDataPoints = page.locator('.month-data-point');
    
    // Locators for Transaction List
    this.transactionList = page.locator('.transaction-list');
    this.transactionItems = page.locator('.transaction-item');
    
    // Locators for Filters
    this.categoryFilter = page.locator('[data-testid="category-filter"]');
    
    // Locators for Messages
    this.noDataMessage = page.locator('.no-data-message');
    this.suggestionMessage = page.locator('.suggestion-message');
  }

  /**
   * Navigate to analytics page
   */
  async navigate() {
    Logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
    await this.waitForAnalyticsLoad();
    Logger.info('Analytics page loaded');
  }

  /**
   * Navigate to monthly trends view
   */
  async navigateToMonthlyTrends() {
    Logger.info('Navigating to monthly trends view');
    await this.page.click('[data-testid="monthly-trends-tab"]');
    await this.waitForTrendChartLoad();
    Logger.info('Monthly trends view loaded');
  }

  /**
   * Wait for analytics page to load
   */
  async waitForAnalyticsLoad() {
    Logger.info('Waiting for analytics to load');
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    Logger.info('Analytics loaded successfully');
  }

  /**
   * Wait for trend chart to load
   */
  async waitForTrendChartLoad() {
    Logger.info('Waiting for trend chart to load');
    await expect(this.trendChart).toBeVisible({ timeout: 10000 });
    Logger.info('Trend chart loaded successfully');
  }

  /**
   * Get all visible categories
   * @returns {Promise<string[]>} Array of category names
   */
  async getAllCategories() {
    const categories = await this.categorySegments.locator('.category-name').allTextContents();
    Logger.info(`Categories retrieved: ${categories.join(', ')}`);
    return categories;
  }

  /**
   * Get spending amounts for all categories
   * @returns {Promise<Object>} Object with category names as keys and amounts as values
   */
  async getAllCategorySpendingAmounts() {
    const categories = await this.getAllCategories();
    const amounts = {};
    for (const category of categories) {
      const amount = await this.getCategorySpendingAmount(category);
      amounts[category] = amount;
    }
    Logger.info(`Spending amounts retrieved for ${Object.keys(amounts).length} categories`);
    return amounts;
  }

  /**
   * Get spending amount for a specific category
   * @param {string} categoryName - Category name
   * @returns {Promise<string>} Spending amount
   */
  async getCategorySpendingAmount(categoryName) {
    const segment = this.categorySegments.filter({ hasText: categoryName });
    await expect(segment).toBeVisible();
    const amount = await segment.locator('.category-amount').textContent();
    Logger.info(`${categoryName} spending amount: ${amount}`);
    return amount.trim();
  }

  /**
   * Get percentage for a specific category
   * @param {string} categoryName - Category name
   * @returns {Promise<string>} Percentage value
   */
  async getCategoryPercentage(categoryName) {
    const segment = this.categorySegments.filter({ hasText: categoryName });
    await expect(segment).toBeVisible();
    const percentage = await segment.locator('.category-percentage').textContent();
    Logger.info(`${categoryName} percentage: ${percentage}`);
    return percentage.trim();
  }

  /**
   * Get all category percentages
   * @returns {Promise<Object>} Object with category names as keys and percentages as values
   */
  async getAllCategoryPercentages() {
    const categories = await this.getAllCategories();
    const percentages = {};
    for (const category of categories) {
      const percentage = await this.getCategoryPercentage(category);
      percentages[category] = percentage;
    }
    Logger.info(`Percentages retrieved for ${Object.keys(percentages).length} categories`);
    return percentages;
  }

  /**
   * Hover over a category segment
   * @param {string} categoryName - Category name
   */
  async hoverOverCategory(categoryName) {
    Logger.info(`Hovering over ${categoryName} category`);
    const segment = this.categorySegments.filter({ hasText: categoryName });
    await expect(segment).toBeVisible();
    await segment.hover();
    Logger.info(`Hovered over ${categoryName}`);
  }

  /**
   * Click on a category segment
   * @param {string} categoryName - Category name
   */
  async clickCategorySegment(categoryName) {
    Logger.info(`Clicking on ${categoryName} category segment`);
    const segment = this.categorySegments.filter({ hasText: categoryName });
    await expect(segment).toBeVisible();
    await segment.click();
    Logger.info(`Clicked on ${categoryName} segment`);
  }

  /**
   * Get visible categories (non-zero spending)
   * @returns {Promise<string[]>} Array of visible category names
   */
  async getVisibleCategories() {
    const visibleSegments = await this.categorySegments.filter({ has: this.page.locator('.category-percentage:not(:has-text("0%"))') });
    const categories = await visibleSegments.locator('.category-name').allTextContents();
    Logger.info(`Visible categories: ${categories.join(', ')}`);
    return categories;
  }

  /**
   * Get transactions for a specific category
   * @param {string} categoryName - Category name
   * @returns {Promise<Array>} Array of transaction objects
   */
  async getCategoryTransactions(categoryName) {
    await expect(this.transactionList).toBeVisible();
    const transactions = await this.transactionItems.filter({ hasText: categoryName }).all();
    Logger.info(`Retrieved ${transactions.length} transactions for ${categoryName}`);
    return transactions;
  }

  /**
   * Get merchant names from transaction list
   * @returns {Promise<string[]>} Array of merchant names
   */
  async getTransactionMerchantNames() {
    const names = await this.transactionItems.locator('.merchant-name').allTextContents();
    Logger.info(`Merchant names retrieved: ${names.length} merchants`);
    return names;
  }

  /**
   * Get transaction amounts
   * @returns {Promise<string[]>} Array of transaction amounts
   */
  async getTransactionAmounts() {
    const amounts = await this.transactionItems.locator('.transaction-amount').allTextContents();
    Logger.info(`Transaction amounts retrieved: ${amounts.length} amounts`);
    return amounts;
  }

  /**
   * Get transaction dates
   * @returns {Promise<string[]>} Array of transaction dates
   */
  async getTransactionDates() {
    const dates = await this.transactionItems.locator('.transaction-date').allTextContents();
    Logger.info(`Transaction dates retrieved: ${dates.length} dates`);
    return dates;
  }

  /**
   * Get months displayed in trend chart
   * @returns {Promise<string[]>} Array of month names
   */
  async getTrendChartMonths() {
    const months = await this.monthDataPoints.locator('.month-label').allTextContents();
    Logger.info(`Trend chart months: ${months.join(', ')}`);
    return months;
  }

  /**
   * Get monthly spending values from trend chart
   * @returns {Promise<Object>} Object with month names as keys and spending values as values
   */
  async getMonthlySpendingValues() {
    const months = await this.getTrendChartMonths();
    const values = {};
    for (const month of months) {
      const dataPoint = this.monthDataPoints.filter({ hasText: month });
      const value = await dataPoint.locator('.data-value').textContent();
      values[month] = value.trim();
    }
    Logger.info(`Monthly spending values retrieved for ${Object.keys(values).length} months`);
    return values;
  }

  /**
   * Hover over a specific month in trend chart
   * @param {string} month - Month name
   */
  async hoverOverMonth(month) {
    Logger.info(`Hovering over ${month} in trend chart`);
    const dataPoint = this.monthDataPoints.filter({ hasText: month });
    await expect(dataPoint).toBeVisible();
    await dataPoint.hover();
    Logger.info(`Hovered over ${month}`);
  }

  /**
   * Get tooltip value
   * @returns {Promise<string>} Tooltip value
   */
  async getTooltipValue() {
    await expect(this.chartTooltip).toBeVisible();
    const value = await this.chartTooltip.textContent();
    Logger.info(`Tooltip value: ${value}`);
    return value.trim();
  }

  /**
   * Get trend direction (increasing/decreasing)
   * @returns {Promise<string>} Trend direction
   */
  async getTrendDirection() {
    await expect(this.trendLine).toBeVisible();
    const direction = await this.trendLine.getAttribute('data-trend-direction');
    Logger.info(`Trend direction: ${direction}`);
    return direction;
  }

  /**
   * Get no data message
   * @returns {Promise<string>} No data message text
   */
  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    const message = await this.noDataMessage.textContent();
    Logger.info(`No data message: ${message}`);
    return message.trim();
  }

  /**
   * Get suggestion message
   * @returns {Promise<string>} Suggestion message text
   */
  async getSuggestionMessage() {
    await expect(this.suggestionMessage).toBeVisible();
    const message = await this.suggestionMessage.textContent();
    Logger.info(`Suggestion message: ${message}`);
    return message.trim();
  }

  /**
   * Select category filter
   * @param {string} categoryName - Category name to filter
   */
  async selectCategoryFilter(categoryName) {
    Logger.info(`Selecting category filter: ${categoryName}`);
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption({ label: categoryName });
    Logger.info(`Category filter ${categoryName} selected`);
  }

  /**
   * Get total spending across all categories
   * @returns {Promise<string>} Total spending amount
   */
  async getTotalSpending() {
    const totalElement = this.page.locator('[data-testid="total-spending"]');
    await expect(totalElement).toBeVisible();
    const total = await totalElement.textContent();
    Logger.info(`Total spending: ${total}`);
    return total.trim();
  }
};