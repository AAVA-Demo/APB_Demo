const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsLink = page.locator('a[href="#/analytics"]');
    this.analyticsContainer = page.locator('.chart-container');
    this.categoryChart = page.locator('#categoryChart');
    this.trendsGraph = page.locator('#trendsGraph');
    this.categoryWiseSpendingButton = page.locator('button:has-text("Category-Wise Spending")');
    this.viewTrendsButton = page.locator('button:has-text("View Trends")');
    this.dateRangeSelector = page.locator('.date-range-selector');
    this.startDateInput = page.locator('input[name="startDate"]');
    this.endDateInput = page.locator('input[name="endDate"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply")');
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.errorMessage = page.locator('.alert-danger');
    this.chartTooltip = page.locator('.chart-tooltip');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.contactSupportButton = page.locator('a:has-text("contact support")');
    this.viewOlderDataOption = page.locator('button:has-text("View Older Data")');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsContainer).toBeVisible();
  }

  async clickCategoryWiseSpending() {
    await expect(this.categoryWiseSpendingButton).toBeVisible();
    await this.categoryWiseSpendingButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewTrends() {
    await expect(this.viewTrendsButton).toBeVisible();
    await this.viewTrendsButton.click();
  }

  async waitForTrendsLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.trendsGraph).toBeVisible();
  }

  async getAllCategories() {
    await expect(this.categoryChart).toBeVisible();
    const categories = await this.categoryChart.locator('.category-label').allTextContents();
    return categories;
  }

  async getCategoryAmounts() {
    await expect(this.categoryChart).toBeVisible();
    const amounts = await this.categoryChart.locator('.category-amount').allTextContents();
    return amounts;
  }

  async getCategoryPercentages() {
    await expect(this.categoryChart).toBeVisible();
    const percentages = await this.categoryChart.locator('.category-percentage').allTextContents();
    return percentages;
  }

  async getCategoryAmount(categoryName) {
    await expect(this.categoryChart).toBeVisible();
    const row = this.categoryChart.locator(`tr:has-text("${categoryName}")`);
    await expect(row).toBeVisible();
    const amount = await row.locator('td.text-right').first().textContent();
    return amount.trim();
  }

  async hoverOverCategory(categoryName) {
    const categoryElement = this.categoryChart.locator(`[data-category="${categoryName}"]`);
    await expect(categoryElement).toBeVisible();
    await categoryElement.hover();
  }

  async isChartInteractive() {
    await expect(this.categoryChart).toBeVisible();
    const isInteractive = await this.categoryChart.evaluate(el => {
      return el.classList.contains('interactive') || el.hasAttribute('data-interactive');
    });
    return isInteractive;
  }

  async setDateRange(startDate, endDate) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    await expect(this.endDateInput).toBeVisible();
    await this.endDateInput.fill(endDate);
  }

  async clickApplyFilters() {
    await expect(this.applyFiltersButton).toBeVisible();
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getTrendMonths() {
    await expect(this.trendsGraph).toBeVisible();
    const months = await this.trendsGraph.locator('.month-label').allTextContents();
    return months;
  }

  async getMonthlySpendAmounts() {
    await expect(this.trendsGraph).toBeVisible();
    const amounts = await this.trendsGraph.locator('.spend-amount').allTextContents();
    return amounts;
  }

  async getTrendIndicators() {
    await expect(this.trendsGraph).toBeVisible();
    const indicators = await this.trendsGraph.locator('.trend-indicator').all();
    return indicators;
  }

  async getProcessingTime() {
    const startTime = Date.now();
    await this.waitForTrendsLoad();
    return Date.now() - startTime;
  }
};