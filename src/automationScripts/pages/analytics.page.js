const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.locator('h2:has-text("Analytics & Spending Insights")');
    this.categoryFilter = page.locator('category-filter');
    this.categoryButtons = page.locator('category-filter button');
    this.spendingSummary = page.locator('.kpi-widget:has-text("Spending Summary")');
    this.categoryBreakdownTable = page.locator('table.table-striped');
    this.trendChart = page.locator('spending-chart canvas');
    this.monthlyTrendView = page.locator('button:has-text("Monthly Trend")');
    this.topCategoryHighlight = page.locator('strong:has-text("Top Category")');
  }

  async navigate() {
    logger.info('Navigating to Analytics page');
    await this.page.goto('https://creditcard-dashboard.example.com/#!/analytics');
    await expect(this.pageHeader).toBeVisible();
  }

  async getAllCategories() {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const rows = this.categoryBreakdownTable.locator('tbody tr');
    const count = await rows.count();
    const categories = [];
    for (let i = 0; i < count; i++) {
      const categoryCell = rows.nth(i).locator('td').first();
      const categoryName = await categoryCell.textContent();
      categories.push(categoryName.trim());
    }
    return categories;
  }

  async getCategoryAmount(categoryName) {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const row = this.categoryBreakdownTable.locator(`tr:has-text("${categoryName}")`);
    const amountCell = row.locator('td').nth(1);
    return await amountCell.textContent();
  }

  async getCategoryPercentage(categoryName) {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const row = this.categoryBreakdownTable.locator(`tr:has-text("${categoryName}")`);
    const percentageCell = row.locator('td').nth(2);
    return await percentageCell.textContent();
  }

  async getTotalTransactionCount() {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const rows = this.categoryBreakdownTable.locator('tbody tr');
    const count = await rows.count();
    let total = 0;
    for (let i = 0; i < count; i++) {
      const transactionCell = rows.nth(i).locator('td').nth(3);
      const transactionCount = await transactionCell.textContent();
      total += parseInt(transactionCount.trim());
    }
    return total;
  }

  async getTopCategory() {
    await expect(this.spendingSummary).toBeVisible();
    const topCategoryElement = this.spendingSummary.locator('strong:has-text("Top Category:")').locator('..');
    const topCategoryText = await topCategoryElement.textContent();
    return topCategoryText.replace('Top Category:', '').trim();
  }

  async selectMonthlyTrendView() {
    logger.info('Selecting monthly trend view');
    await this.monthlyTrendView.click();
    await expect(this.trendChart).toBeVisible();
  }

  async getTrendDataPoints() {
    await expect(this.trendChart).toBeVisible();
    // Extract data points from chart (implementation depends on chart library)
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('spending-chart canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
    return Array(chartData).fill(0).map((_, i) => ({ month: i + 1 }));
  }

  async applyCategoryFilter(categoryName) {
    logger.info(`Applying category filter: ${categoryName}`);
    const filterButton = this.categoryButtons.filter({ hasText: categoryName });
    await filterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getActiveFilter() {
    const activeButton = this.categoryButtons.filter({ hasClass: 'btn-primary' });
    return await activeButton.textContent();
  }
};