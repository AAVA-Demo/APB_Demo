const { expect } = require('@playwright/test');

/**
 * AnalyticsPage - Page Object for Analytics functionality
 * Handles monthly spend trends and category-wise spending analysis
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.analyticsLink = page.locator('a:has-text("Analytics")');
    
    // Category-Wise Spending Section
    this.categorySection = page.locator('.panel:has-text("Category-Wise Spending")');
    this.categoryChart = page.locator('#categoryPieCanvas');
    this.chartTooltip = page.locator('.chartjs-tooltip');
    this.insufficientDataMessage = page.locator('.text-center:has-text("Insufficient data for category analysis")');
    this.emptyStateChart = page.locator('.empty-state-chart');
    
    // Monthly Spend Trend Section
    this.trendSection = page.locator('.panel:has-text("Monthly Spend Trend")');
    this.trendChart = page.locator('#spendTrendCanvas');
    this.trendTooltip = page.locator('.chartjs-tooltip');
    this.noDataMessage = page.locator('.text-center:has-text("No data available for the selected period")');
    this.emptyStateTrendChart = page.locator('.empty-state-chart');
    
    // Date Range Filter
    this.dateRangeFilter = page.locator('.row:has-text("Start Date")');
    this.startDateInput = page.locator('input[ng-model="vm.dateRange.start"]');
    this.endDateInput = page.locator('input[ng-model="vm.dateRange.end"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    
    // Error States
    this.errorMessage = page.locator('.alert-danger');
  }

  /**
   * Navigate to Analytics page
   */
  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForURL(/.*\/analytics.*/, { timeout: 5000 });
  }

  /**
   * Get category labels from chart
   * @returns {Promise<string[]>} Array of category names
   */
  async getCategoryLabels() {
    await expect(this.categoryChart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryPieCanvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
  }

  /**
   * Get visible category labels (non-zero categories)
   * @returns {Promise<string[]>} Array of visible category names
   */
  async getVisibleCategoryLabels() {
    await expect(this.categoryChart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryPieCanvas');
      if (canvas && canvas.chart) {
        const data = canvas.chart.data.datasets[0].data;
        const labels = canvas.chart.data.labels;
        return labels.filter((label, index) => data[index] > 0);
      }
      return [];
    });
  }

  /**
   * Get category amounts
   * @returns {Promise<string[]>} Array of category amounts
   */
  async getCategoryAmounts() {
    await expect(this.categoryChart).toBeVisible();
    const amounts = await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryPieCanvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data.map(val => `$${val.toFixed(2)}`);
      }
      return [];
    });
    return amounts;
  }

  /**
   * Get category percentages
   * @returns {Promise<string[]>} Array of category percentages
   */
  async getCategoryPercentages() {
    await expect(this.categoryChart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryPieCanvas');
      if (canvas && canvas.chart) {
        const data = canvas.chart.data.datasets[0].data;
        const total = data.reduce((sum, val) => sum + val, 0);
        return data.map(val => `${((val / total) * 100).toFixed(1)}%`);
      }
      return [];
    });
  }

  /**
   * Hover over category chart segment
   * @param {number} segmentIndex - Index of segment to hover
   */
  async hoverOverCategorySegment(segmentIndex) {
    await expect(this.categoryChart).toBeVisible();
    await this.categoryChart.hover();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get insufficient data message text
   * @returns {Promise<string>} Message text
   */
  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  /**
   * Wait for trend chart to load
   */
  async waitForTrendChartLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get trend chart data points
   * @returns {Promise<number>} Number of data points
   */
  async getTrendDataPoints() {
    await expect(this.trendChart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#spendTrendCanvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
  }

  /**
   * Get monthly spend values from trend chart
   * @returns {Promise<string[]>} Array of monthly spend values
   */
  async getMonthlySpendValues() {
    await expect(this.trendChart).toBeVisible();
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#spendTrendCanvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data.map(val => `$${val.toFixed(2)}`);
      }
      return [];
    });
  }

  /**
   * Hover over trend chart data point
   * @param {number} pointIndex - Index of data point to hover
   */
  async hoverOverTrendDataPoint(pointIndex) {
    await expect(this.trendChart).toBeVisible();
    await this.trendChart.hover();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get trend tooltip text
   * @returns {Promise<string>} Tooltip text
   */
  async getTrendTooltipText() {
    await expect(this.trendTooltip).toBeVisible();
    return await this.trendTooltip.textContent();
  }

  /**
   * Set date range filter
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  async setDateRangeFilter(startDate, endDate) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  /**
   * Click Apply Filter button
   */
  async clickApplyFilter() {
    await this.applyFilterButton.click();
  }

  /**
   * Wait for trend chart to update after filter
   */
  async waitForTrendChartUpdate() {
    await this.page.waitForTimeout(1000); // Allow chart re-render
    await expect(this.trendChart).toBeVisible();
  }

  /**
   * Get no data message text
   * @returns {Promise<string>} Message text
   */
  async getNoDataMessageText() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }
};