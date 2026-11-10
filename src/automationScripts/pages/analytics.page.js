const { expect } = require('@playwright/test');

/**
 * AnalyticsPage - Page Object for Spending Analytics and Insights
 * Handles category-wise spending visualization and monthly trends analysis
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Main Container Locators
    this.analyticsContainer = page.locator('.analytics-container');
    this.loadingSpinner = page.locator('.spinner');
    
    // Category-wise Spending Locators
    this.categorySpendingSection = page.locator('[data-testid="category-spending-section"]');
    this.categorySpendingChart = page.locator('#category-chart');
    this.categoryTable = page.locator('.category-breakdown table');
    this.categoryRows = page.locator('.category-breakdown table tbody tr');
    
    // Monthly Trends Locators
    this.monthlyTrendsSection = page.locator('[data-testid="monthly-trends-section"]');
    this.monthlyTrendsChart = page.locator('#monthly-chart');
    this.monthDataPoints = page.locator('.chart-data-point');
    
    // Message Locators
    this.noSpendingDataMessage = page.locator('.no-data-message');
    this.insufficientDataMessage = page.locator('.insufficient-data-message');
    
    // Drill-down Locators
    this.drillDownView = page.locator('.drill-down-view');
    this.drillDownCategoryBreakdown = page.locator('.drill-down-categories');
    this.drillDownTotal = page.locator('[data-testid="drill-down-total"]');
  }

  /**
   * Navigate to analytics page
   */
  async navigate() {
    await this.page.goto('https://creditcard.example.com/analytics');
  }

  /**
   * Wait for analytics page to fully load
   */
  async waitForAnalyticsLoad() {
    await expect(this.analyticsContainer).toBeVisible({ timeout: 10000 });
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
  }

  /**
   * Get count of months displayed in monthly trends chart
   * @returns {Promise<number>} Number of months
   */
  async getMonthlyTrendsMonthCount() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    // Parse chart data to count months
    const chartLabels = await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthly-chart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
    return chartLabels;
  }

  /**
   * Get month labels from monthly trends chart
   * @returns {Promise<Array<string>>} Array of month labels
   */
  async getMonthlyTrendsLabels() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthly-chart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    return labels;
  }

  /**
   * Hover over month data point in chart
   * @param {number} index - Month index (0-based)
   */
  async hoverOverMonthDataPoint(index) {
    await expect(this.monthlyTrendsChart).toBeVisible();
    // Simulate hover on chart data point
    await this.monthlyTrendsChart.hover();
    await this.page.mouse.move(100 + (index * 50), 200); // Approximate chart position
  }

  /**
   * Get chart tooltip value
   * @returns {Promise<string>} Tooltip value
   */
  async getChartTooltipValue() {
    const tooltip = this.page.locator('.chart-tooltip');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    return await tooltip.textContent();
  }

  /**
   * Click on month data point to drill down
   * @param {number} index - Month index (0-based)
   */
  async clickMonthDataPoint(index) {
    await expect(this.monthlyTrendsChart).toBeVisible();
    // Simulate click on chart data point
    await this.monthlyTrendsChart.click({ position: { x: 100 + (index * 50), y: 200 } });
  }

  /**
   * Wait for drill-down view to appear
   */
  async waitForDrillDownView() {
    await expect(this.drillDownView).toBeVisible({ timeout: 5000 });
  }

  /**
   * Get category breakdown for drilled-down month
   * @returns {Promise<Object>} Category breakdown object
   */
  async getCategoryBreakdownForMonth() {
    await expect(this.drillDownCategoryBreakdown).toBeVisible();
    const rows = await this.drillDownCategoryBreakdown.locator('tr').all();
    const breakdown = {};
    
    for (const row of rows) {
      const category = await row.locator('td:nth-child(1)').textContent();
      const amount = await row.locator('td:nth-child(2)').textContent();
      breakdown[category.trim()] = amount.trim();
    }
    
    return breakdown;
  }

  /**
   * Get drill-down total spend
   * @returns {Promise<string>} Total spend value
   */
  async getDrillDownTotalSpend() {
    await expect(this.drillDownTotal).toBeVisible();
    return (await this.drillDownTotal.textContent()).trim();
  }

  /**
   * Get categories displayed in category spending chart
   * @returns {Promise<Array<string>>} Array of category names
   */
  async getCategorySpendingCategories() {
    await expect(this.categoryTable).toBeVisible();
    const rows = await this.categoryRows.all();
    const categories = [];
    
    for (const row of rows) {
      const category = await row.locator('td:nth-child(1)').textContent();
      categories.push(category.trim());
    }
    
    return categories;
  }

  /**
   * Get data for specific category
   * @param {string} categoryName - Category name
   * @returns {Promise<Object>} Category data object with amount and percentage
   */
  async getCategoryData(categoryName) {
    await expect(this.categoryTable).toBeVisible();
    const row = this.categoryRows.filter({ hasText: categoryName });
    await expect(row).toBeVisible();
    
    const amount = await row.locator('td:nth-child(2)').textContent();
    const percentage = await row.locator('td:nth-child(3)').textContent();
    
    return {
      amount: amount.trim(),
      percentage: percentage.trim()
    };
  }

  /**
   * Get total percentage from all categories
   * @returns {Promise<number>} Total percentage (should be 100)
   */
  async getTotalCategoryPercentage() {
    await expect(this.categoryTable).toBeVisible();
    const rows = await this.categoryRows.all();
    let total = 0;
    
    for (const row of rows) {
      const percentageText = await row.locator('td:nth-child(3)').textContent();
      const percentage = parseFloat(percentageText.replace('%', ''));
      total += percentage;
    }
    
    return Math.round(total);
  }

  /**
   * Check if category chart is empty
   * @returns {Promise<boolean>} True if chart is empty
   */
  async isCategoryChartEmpty() {
    await expect(this.categorySpendingChart).toBeVisible();
    const isEmpty = await this.page.evaluate(() => {
      const canvas = document.querySelector('#category-chart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data.length === 0;
      }
      return true;
    });
    return isEmpty;
  }

  /**
   * Get no spending data message
   * @returns {Promise<string>} No data message text
   */
  async getNoSpendingDataMessage() {
    await expect(this.noSpendingDataMessage).toBeVisible();
    return await this.noSpendingDataMessage.textContent();
  }

  /**
   * Get insufficient data message
   * @returns {Promise<string>} Insufficient data message text
   */
  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  /**
   * Get total spend from analytics
   * @returns {Promise<string>} Total spend value
   */
  async getTotalSpend() {
    const totalSpendDisplay = this.page.locator('[data-testid="total-spend"]');
    await expect(totalSpendDisplay).toBeVisible();
    return (await totalSpendDisplay.textContent()).trim();
  }
};
