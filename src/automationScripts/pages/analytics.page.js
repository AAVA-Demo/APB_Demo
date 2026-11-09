const { expect } = require('@playwright/test');
const BasePage = require('./base.page');
const config = require('../../data/config.json');

exports.AnalyticsPage = class AnalyticsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Locators
    this.spendingChart = page.locator('[data-testid="spending-chart"]');
    this.categoryItem = page.locator('.category-item');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionListHeader = page.locator('[data-testid="transaction-list-header"]');
    this.transactionRow = page.locator('.transaction-row');
    this.backToSummaryButton = page.locator('[data-testid="back-to-summary"]');
    this.emptyCategoryMessage = page.locator('.empty-category-message');
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.dateRangeFilter = page.locator('[data-testid="date-range-filter"]');
    this.categoryFilter = page.locator('[data-testid="category-filter"]');
    this.insufficientDataNotification = page.locator('[data-testid="insufficient-data-notification"]');
    this.availableMonthsDisplay = page.locator('[data-testid="available-months"]');
    this.chartMonthLabel = page.locator('.chart-month-label');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/analytics');
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async getDisplayedCategories() {
    await this.waitForAnalyticsLoad();
    const categories = await this.categoryItem.all();
    const categoryNames = [];

    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      categoryNames.push(name.trim());
    }

    return categoryNames;
  }

  async getCategoryBreakdown() {
    await this.waitForAnalyticsLoad();
    const categories = await this.categoryItem.all();
    const breakdown = [];

    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      const percentage = await category.locator('[data-testid="category-percentage"]').textContent();
      const amount = await category.locator('[data-testid="category-amount"]').textContent();

      breakdown.push({
        name: name.trim(),
        percentage: parseFloat(percentage.replace('%', '')),
        amount: this.parseAmount(amount)
      });
    }

    return breakdown;
  }

  parseAmount(text) {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async clickCategory(categoryName) {
    const categories = await this.categoryItem.all();
    
    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      if (name.trim() === categoryName) {
        await category.click();
        break;
      }
    }
  }

  async waitForTransactionListLoad() {
    await expect(this.transactionList).toBeVisible({ timeout: 5000 });
  }

  async getTransactionDetails() {
    await this.waitForTransactionListLoad();
    const transactions = await this.transactionRow.all();
    const details = [];

    for (const transaction of transactions) {
      const date = await transaction.locator('[data-testid="transaction-date"]').textContent();
      const merchant = await transaction.locator('[data-testid="transaction-merchant"]').textContent();
      const amount = await transaction.locator('[data-testid="transaction-amount"]').textContent();

      details.push({
        date: date.trim(),
        merchant: merchant.trim(),
        amount: this.parseAmount(amount)
      });
    }

    return details;
  }

  async getEmptyCategoryMessages() {
    const messages = await this.emptyCategoryMessage.all();
    const texts = [];

    for (const message of messages) {
      const text = await message.textContent();
      texts.push(text.trim());
    }

    return texts;
  }

  async getMonthsDisplayed() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    return await this.chartMonthLabel.count();
  }

  async applyDateRangeFilter(range) {
    await this.dateRangeFilter.click();
    await this.page.locator(`[data-value="${range}"]`).click();
  }

  async waitForChartUpdate() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async getAvailableMonthsCount() {
    const text = await this.availableMonthsDisplay.textContent();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
};
