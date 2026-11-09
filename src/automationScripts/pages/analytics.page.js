const { expect } = require('@playwright/test');

/**
 * Page Object: Analytics Page
 * Covers: Monthly Spend Trends and Category-Wise Spending
 * Related Test Cases: QE-8379 TS-001, TS-002, TS-003, QE-8380 TS-001, TS-002, TS-003
 */
exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Monthly Trends Chart
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.chartTitle = page.locator('[data-testid="chart-title"]');
    
    // Category Spending
    this.categorySpendingChart = page.locator('[data-testid="category-spending-chart"]');
    this.categoryLabels = page.locator('[data-testid="category-label"]');
    
    // Date Range Filter
    this.startDateInput = page.locator('[data-testid="analytics-start-date"]');
    this.endDateInput = page.locator('[data-testid="analytics-end-date"]');
    this.applyDateRangeButton = page.locator('[data-testid="apply-date-range-button"]');
    
    // Messages
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.emptySpendingMessage = page.locator('[data-testid="empty-spending-message"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async setDateRangeFilter(startDate, endDate) {
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async clickApplyDateRange() {
    await this.applyDateRangeButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  getCategoryLabel(categoryName) {
    return this.page.locator(`[data-testid="category-label"][data-category="${categoryName}"]`);
  }

  async waitForChartsToLoad() {
    await expect(this.monthlyTrendsChart).toBeVisible({ timeout: 5000 });
    await expect(this.categorySpendingChart).toBeVisible({ timeout: 5000 });
  }
};