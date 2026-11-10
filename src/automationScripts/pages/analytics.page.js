const { expect } = require('@playwright/test');

/**
 * Page Object: AnalyticsPage
 * Description: Represents the Analytics and Spending Insights page
 * Features: Category-wise spending, monthly trends, filtering
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Container locators
    this.analyticsContainer = page.locator('.analytics-container');
    
    // Filter controls
    this.categoryFilter = page.locator('select[name="category"]');
    this.periodFilter = page.locator('select[name="period"]');
    this.customDateRangeStart = page.locator('input[name="startDate"]');
    this.customDateRangeEnd = page.locator('input[name="endDate"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    
    // Chart containers
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    
    // Data table
    this.categoryTable = page.locator('.table-striped');
    
    // Messages
    this.limitedDataMessage = page.locator('.alert-info');
    this.errorMessage = page.locator('.alert-danger');
  }

  /**
   * Navigate to analytics page
   */
  async navigate() {
    await this.page.goto('/analytics');
    await expect(this.analyticsContainer).toBeVisible({ timeout: 10000 });
  }

  /**
   * Wait for category data to load
   */
  async waitForCategoryDataLoad() {
    await this.page.waitForResponse(response => 
      response.url().includes('/api/transactions') && response.status() === 200,
      { timeout: 10000 }
    );
    await expect(this.categoryChart).toBeVisible();
  }

  /**
   * Get monthly trend count
   * @returns {Promise<number>}
   */
  async getMonthlyTrendCount() {
    await this.page.waitForTimeout(1000); // Wait for chart to render
    // Extract data from chart or data attributes
    const dataPoints = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="trend-chart"]');
      if (chartElement && chartElement.dataset.trendData) {
        return JSON.parse(chartElement.dataset.trendData).length;
      }
      return 0;
    });
    return dataPoints;
  }

  /**
   * Get monthly trend data
   * @returns {Promise<Array<Object>>}
   */
  async getMonthlyTrendData() {
    await this.page.waitForTimeout(1000);
    const trendData = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="trend-chart"]');
      if (chartElement && chartElement.dataset.trendData) {
        return JSON.parse(chartElement.dataset.trendData);
      }
      return [];
    });
    return trendData;
  }

  /**
   * Apply period filter (e.g., '3months', '6months', '12months')
   * @param {string} period
   */
  async applyPeriodFilter(period) {
    await this.periodFilter.selectOption(period);
    await this.page.waitForTimeout(1000); // Wait for filter to apply
  }

  /**
   * Apply custom date range filter
   * @param {string} startDate - Format: YYYY-MM-DD
   * @param {string} endDate - Format: YYYY-MM-DD
   */
  async applyCustomDateRange(startDate, endDate) {
    await this.customDateRangeStart.fill(startDate);
    await this.customDateRangeEnd.fill(endDate);
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get limited data message
   * @returns {Promise<string>}
   */
  async getLimitedDataMessage() {
    await expect(this.limitedDataMessage).toBeVisible();
    return await this.limitedDataMessage.textContent();
  }

  /**
   * Get all categories displayed
   * @returns {Promise<Array<string>>}
   */
  async getAllCategories() {
    await expect(this.categoryTable).toBeVisible();
    const rows = this.categoryTable.locator('tbody tr');
    const count = await rows.count();
    
    const categories = [];
    for (let i = 0; i < count; i++) {
      const categoryCell = rows.nth(i).locator('td').first();
      const category = await categoryCell.textContent();
      categories.push(category.trim());
    }
    
    return categories;
  }

  /**
   * Get category breakdown (category -> amount mapping)
   * @returns {Promise<Object>}
   */
  async getCategoryBreakdown() {
    await expect(this.categoryTable).toBeVisible();
    const rows = this.categoryTable.locator('tbody tr');
    const count = await rows.count();
    
    const breakdown = {};
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const category = await row.locator('td').first().textContent();
      const amountText = await row.locator('td').nth(1).textContent();
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
      breakdown[category.trim()] = amount;
    }
    
    return breakdown;
  }

  /**
   * Apply category filter
   * @param {string} category
   */
  async applyCategoryFilter(category) {
    await this.categoryFilter.selectOption(category);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clear category filter (select 'All Categories')
   */
  async clearCategoryFilter() {
    await this.categoryFilter.selectOption('');
    await this.page.waitForTimeout(1000);
  }
};
