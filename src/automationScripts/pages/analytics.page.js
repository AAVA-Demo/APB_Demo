const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    // Category pie chart locators
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"], .category-chart, canvas.chart-pie, .pie-chart').first();
    this.transactionBreakdown = page.locator('[data-testid="transaction-breakdown"], .transaction-breakdown, table, .transaction-list').first();
    this.backButton = page.locator('[data-testid="back-button"], button:has-text("Back"), a:has-text("Back")').first();
    this.noDataMessage = page.locator('[data-testid="no-data-message"], .no-data-message, div:has-text("insufficient data"), div:has-text("no transactions")').first();
    this.noDataCTA = page.locator('[data-testid="no-data-cta"], .cta-message, div:has-text("Start using")').first();
    // Monthly trend chart locators
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"], .trend-chart, canvas.chart-line, .line-chart').first();
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"], .chart-tooltip, .tooltip').first();
    this.limitedDataNotification = page.locator('[data-testid="limited-data-notification"], .notification, div:has-text("limited"), div:has-text("12 months")').first();
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategories() {
    const categories = [];
    const categoryElements = this.page.locator('[data-testid="category-item"], .category-item, td:first-child, .category-label');
    const count = await categoryElements.count();
    for (let i = 0; i < count; i++) {
      const category = await categoryElements.nth(i).textContent();
      categories.push(category.trim());
    }
    return categories;
  }

  async getCategoryAmount(category) {
    const amountElement = this.page.locator(`[data-category="${category}"] .amount, td:has-text("${category}") + td`).first();
    const text = await amountElement.textContent();
    const numericValue = text.replace(/[^0-9.]/g, '');
    return parseFloat(numericValue) || 0;
  }

  async clickCategorySegment(category) {
    const segment = this.page.locator(`[data-category="${category}"], .category-segment:has-text("${category}")`).first();
    await segment.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionDetails() {
    const transactions = [];
    const rows = this.page.locator('[data-testid="transaction-row"], .transaction-row, tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const date = await row.locator('td').nth(0).textContent();
      const merchant = await row.locator('td').nth(1).textContent();
      const amountText = await row.locator('td').nth(2).textContent();
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, '')) || 0;
      transactions.push({ date: date.trim(), merchant: merchant.trim(), amount });
    }
    return transactions;
  }

  async getMonthLabels() {
    const labels = [];
    const labelElements = this.page.locator('[data-testid="month-label"], .month-label, .chart-label');
    const count = await labelElements.count();
    for (let i = 0; i < count; i++) {
      const label = await labelElements.nth(i).textContent();
      labels.push(label.trim());
    }
    return labels;
  }

  async getMonthSpendAmount(month) {
    const amountElement = this.page.locator(`[data-month="${month}"] .amount, .month-amount:has-text("${month}")`).first();
    const text = await amountElement.textContent();
    const numericValue = text.replace(/[^0-9.]/g, '');
    return parseFloat(numericValue) || 0;
  }

  async hoverOverMonthDataPoint(month) {
    const dataPoint = this.page.locator(`[data-month="${month}"], .data-point:has-text("${month}")`).first();
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
  }
};