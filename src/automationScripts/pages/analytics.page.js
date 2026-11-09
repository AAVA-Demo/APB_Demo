const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

/**
 * Analytics Page Object
 * Handles all interactions with the Spending Analytics section
 * Contains locators and methods for category-wise spending and monthly trends
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Authentication locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.userProfile = page.locator('.user-profile');
    
    // Navigation locators
    this.analyticsLink = page.locator('a[href="#!/analytics"]');
    
    // Chart locators
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.drillDownView = page.locator('[data-testid="drill-down-view"]');
    
    // View selection locators
    this.monthlyTrendViewButton = page.locator('[data-testid="monthly-trend-view-button"]');
    
    // Message locators
    this.warningMessage = page.locator('.alert-warning');
    
    // Category table locators
    this.categoryTable = page.locator('[data-testid="category-table"]');
    
    // Filter locators
    this.interactiveFilter = page.locator('[data-testid="interactive-filter"]');
  }

  /**
   * Navigate to the application base URL
   */
  async navigate() {
    await this.page.goto('/');
    Logger.info('Navigated to application base URL');
  }

  /**
   * Perform user login
   * @param {string} username - Username for authentication
   * @param {string} password - Password for authentication
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info(`User logged in with username: ${username}`);
  }

  /**
   * Navigate to analytics page
   */
  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info('Navigated to analytics page');
  }

  /**
   * Get user profile element
   * @returns {Locator} User profile locator
   */
  getUserProfile() {
    return this.userProfile;
  }

  /**
   * Get category pie chart element
   * @returns {Locator} Category pie chart locator
   */
  getCategoryPieChart() {
    return this.categoryPieChart;
  }

  /**
   * Get all categories displayed in the pie chart
   * @returns {Promise<Array<string>>} Array of category names
   */
  async getAllCategories() {
    await expect(this.categoryTable).toBeVisible();
    const categoryRows = this.categoryTable.locator('tbody tr');
    const count = await categoryRows.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const categoryName = await categoryRows.nth(i).locator('td').first().textContent();
      categories.push(categoryName.trim());
    }
    
    return categories;
  }

  /**
   * Get amount for a specific category
   * @param {string} categoryName - Name of the category
   * @returns {Promise<string>} Category amount
   */
  async getCategoryAmount(categoryName) {
    const categoryRow = this.categoryTable.locator(`tbody tr:has-text("${categoryName}")`);
    await expect(categoryRow).toBeVisible();
    const amountCell = categoryRow.locator('td').nth(1);
    return await amountCell.textContent();
  }

  /**
   * Get warning message element
   * @returns {Locator} Warning message locator
   */
  getWarningMessage() {
    return this.warningMessage;
  }

  /**
   * Get warning message text
   * @returns {Promise<string>} Warning message text
   */
  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  /**
   * Check if a category is visible in the chart
   * @param {string} categoryName - Name of the category
   * @returns {Promise<boolean>} True if category is visible
   */
  async isCategoryVisible(categoryName) {
    const categoryRow = this.categoryTable.locator(`tbody tr:has-text("${categoryName}")`);
    return await categoryRow.isVisible();
  }

  /**
   * Get percentage for a specific category
   * @param {string} categoryName - Name of the category
   * @returns {Promise<string>} Category percentage
   */
  async getCategoryPercentage(categoryName) {
    const categoryRow = this.categoryTable.locator(`tbody tr:has-text("${categoryName}")`);
    await expect(categoryRow).toBeVisible();
    const percentageCell = categoryRow.locator('td').nth(3);
    return await percentageCell.textContent();
  }

  /**
   * Select monthly trend analysis view
   */
  async selectMonthlyTrendView() {
    await this.monthlyTrendViewButton.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info('Monthly trend analysis view selected');
  }

  /**
   * Get monthly trend chart element
   * @returns {Locator} Monthly trend chart locator
   */
  getMonthlyTrendChart() {
    return this.monthlyTrendChart;
  }

  /**
   * Get chart data points from monthly trend chart
   * @returns {Promise<Array>} Array of data points
   */
  async getChartDataPoints() {
    await expect(this.monthlyTrendChart).toBeVisible();
    // This would interact with the Chart.js canvas element
    const dataPoints = await this.page.evaluate(() => {
      const chart = window.Chart.instances[0];
      return chart ? chart.data.datasets[0].data : [];
    });
    return dataPoints;
  }

  /**
   * Get month labels from monthly trend chart
   * @returns {Promise<Array<string>>} Array of month labels
   */
  async getChartMonthLabels() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const labels = await this.page.evaluate(() => {
      const chart = window.Chart.instances[0];
      return chart ? chart.data.labels : [];
    });
    return labels;
  }

  /**
   * Check if drill-down capability is enabled
   * @returns {Promise<boolean>} True if drill-down is enabled
   */
  async isDrillDownEnabled() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const isEnabled = await this.page.evaluate(() => {
      const chart = window.Chart.instances[0];
      return chart && chart.options.onClick !== undefined;
    });
    return isEnabled;
  }

  /**
   * Click on a specific month in the trend chart
   * @param {string} monthName - Name of the month (e.g., 'June 2025')
   */
  async clickOnMonth(monthName) {
    await expect(this.monthlyTrendChart).toBeVisible();
    // Simulate click on chart data point
    await this.page.evaluate((month) => {
      const chart = window.Chart.instances[0];
      const monthIndex = chart.data.labels.indexOf(month);
      if (monthIndex !== -1 && chart.options.onClick) {
        chart.options.onClick(null, [{ index: monthIndex }]);
      }
    }, monthName);
    await this.page.waitForLoadState('networkidle');
    Logger.info(`Clicked on month: ${monthName}`);
  }

  /**
   * Get drill-down view element
   * @returns {Locator} Drill-down view locator
   */
  getDrillDownView() {
    return this.drillDownView;
  }

  /**
   * Get categories displayed in drill-down view
   * @returns {Promise<Array<string>>} Array of category names
   */
  async getDrillDownCategories() {
    await expect(this.drillDownView).toBeVisible();
    const categoryRows = this.drillDownView.locator('[data-testid="drill-down-category"]');
    const count = await categoryRows.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const categoryName = await categoryRows.nth(i).textContent();
      categories.push(categoryName.trim());
    }
    
    return categories;
  }

  /**
   * Get amount for a specific category in drill-down view
   * @param {string} categoryName - Name of the category
   * @returns {Promise<string>} Category amount
   */
  async getDrillDownCategoryAmount(categoryName) {
    const categoryElement = this.drillDownView.locator(`[data-category="${categoryName}"]`);
    await expect(categoryElement).toBeVisible();
    const amountElement = categoryElement.locator('[data-testid="category-amount"]');
    return await amountElement.textContent();
  }

  /**
   * Check if interactive filter is available
   * @returns {Promise<boolean>} True if interactive filter is available
   */
  async isInteractiveFilterAvailable() {
    return await this.interactiveFilter.isVisible();
  }
};
