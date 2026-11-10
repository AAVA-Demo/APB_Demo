const { expect } = require('@playwright/test');

/**
 * Page Object: AnalyticsDashboardPage
 * Handles all analytics dashboard interactions, category-wise spending, and visualizations
 */
exports.AnalyticsDashboardPage = class AnalyticsDashboardPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('.analytics-dashboard, #analytics, [data-page="analytics"]');
    this.pieChart = page.locator('.pie-chart, canvas[id*="chart"], svg[class*="chart"]');
    this.categorySegments = page.locator('.chart-segment, .category-segment, path[class*="segment"]');
    this.tooltip = page.locator('.tooltip, .chart-tooltip, [role="tooltip"]');
    this.drillDownView = page.locator('.drill-down, .category-details, .detail-view');
    this.categoryDetails = page.locator('.category-detail, .segment-detail');
    this.emptyStateMessage = page.locator('.empty-state, .no-data-message, text="No transactions found"').locator('..');
    this.emptyStateGraphic = page.locator('.empty-state-graphic, .no-data-illustration, img[alt*="empty" i]');
    this.dateRangeFilter = page.locator('select[name="dateRange"], .date-range-selector');
    this.totalSpendDisplay = page.locator('.total-spend, [data-metric="total-spend"]');
    this.analyticsLink = page.locator('a:has-text("Analytics"), a:has-text("Spending Analytics")');
    this.dashboardLink = page.locator('a:has-text("Dashboard"), a:has-text("Home")');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsContainer).toBeVisible();
  }

  async getCategorySegments() {
    await expect(this.pieChart).toBeVisible();
    return await this.categorySegments.all();
  }

  async verifyCategoryData(categoryName, amount, percentage) {
    const categoryLocator = this.page.locator(`text="${categoryName}"`);
    await expect(categoryLocator).toBeVisible();
    const parentContainer = categoryLocator.locator('..');
    await expect(parentContainer).toContainText(amount);
    await expect(parentContainer).toContainText(percentage);
  }

  async hoverOverCategory(categoryName) {
    const categorySegment = this.page.locator(`[data-category="${categoryName}"], [aria-label*="${categoryName}" i]`).first();
    await expect(categorySegment).toBeVisible();
    await categorySegment.hover();
    await this.page.waitForTimeout(500);
  }

  async clickCategory(categoryName) {
    const categorySegment = this.page.locator(`[data-category="${categoryName}"], [aria-label*="${categoryName}" i], text="${categoryName}"`).first();
    await expect(categorySegment).toBeVisible();
    await categorySegment.click();
    await this.page.waitForTimeout(1000);
  }

  async getAllCategories() {
    const categories = [];
    const predefinedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of predefinedCategories) {
      const locator = this.page.locator(`text="${category}"`).first();
      if (await locator.isVisible()) {
        categories.push(category);
      }
    }
    return categories;
  }

  async getAllCategoryAmounts() {
    const amounts = [];
    const categories = await this.getAllCategories();
    for (const category of categories) {
      const amountText = await this.page.locator(`text="${category}"`).locator('..').locator('.amount, .value').textContent();
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
      amounts.push(amount);
    }
    return amounts;
  }

  async getAllCategoryPercentages() {
    const percentages = [];
    const categories = await this.getAllCategories();
    for (const category of categories) {
      const percentageText = await this.page.locator(`text="${category}"`).locator('..').locator('.percentage, text="%"').textContent();
      const percentage = parseFloat(percentageText.replace(/[^0-9.]/g, ''));
      percentages.push(percentage);
    }
    return percentages;
  }

  async getTotalSpend() {
    await expect(this.totalSpendDisplay).toBeVisible();
    const text = await this.totalSpendDisplay.textContent();
    return text.trim();
  }

  async getCategoryPercentage(categoryName) {
    const categoryLocator = this.page.locator(`text="${categoryName}"`).first();
    if (!(await categoryLocator.isVisible())) return null;
    const percentageText = await categoryLocator.locator('..').locator('.percentage, text="%"').textContent();
    return percentageText.trim();
  }

  async getMiscellaneousTransactionCount() {
    await this.clickCategory('Miscellaneous');
    await expect(this.drillDownView).toBeVisible();
    const transactionRows = await this.drillDownView.locator('.transaction-row, tr').all();
    return transactionRows.length;
  }

  async getTotalTransactionCount() {
    const countDisplay = this.page.locator('.transaction-count, text="transactions"').first();
    const text = await countDisplay.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  async verifyChartInteractivity() {
    await expect(this.pieChart).toBeVisible();
    const segments = await this.getCategorySegments();
    expect(segments.length).toBeGreaterThan(0);
    await segments[0].hover();
    await this.page.waitForTimeout(300);
    await segments[0].click();
    await this.page.waitForTimeout(300);
  }

  async verifyNoUIOverlap() {
    await expect(this.categoryDetails).toBeVisible();
    const boundingBox = await this.categoryDetails.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
  }

  async verifyNoUIErrors() {
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await this.page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
  }

  async selectDateRange(range) {
    await expect(this.dateRangeFilter).toBeVisible();
    await this.dateRangeFilter.selectOption(range);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLayoutIntegrity() {
    await expect(this.analyticsContainer).toBeVisible();
    const boundingBox = await this.analyticsContainer.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox.width).toBeGreaterThan(0);
  }

  async navigateToDashboard() {
    await expect(this.dashboardLink).toBeVisible();
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }
};
