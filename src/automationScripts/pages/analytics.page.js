const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // View Selection Locators
    this.categoryViewButton = page.locator('[data-testid="category-view-button"]');
    this.trendViewButton = page.locator('[data-testid="trend-view-button"]');
    this.timePeriodSelector = page.locator('[data-testid="time-period-selector"]');
    
    // Chart Locators
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.tooltip = page.locator('[data-testid="chart-tooltip"]');
    
    // Category Locators
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.transactionDetailView = page.locator('[data-testid="transaction-detail-view"]');
    this.backButton = page.locator('[data-testid="back-button"]');
    
    // Message Locators
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.insufficientDataNotification = page.locator('[data-testid="insufficient-data-notification"]');
    this.warningMessage = page.locator('[data-testid="warning-message"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async selectCategoryView() {
    await this.categoryViewButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectMonthlyTrendView() {
    await this.trendViewButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectTimePeriod(period) {
    await this.timePeriodSelector.selectOption(period);
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategories() {
    await expect(this.categoryChart).toBeVisible();
    const categories = [];
    const count = await this.categoryItem.count();
    
    for (let i = 0; i < count; i++) {
      const category = await this.categoryItem.nth(i).textContent();
      categories.push(category.trim());
    }
    
    return categories;
  }

  async isChartInteractive() {
    await expect(this.categoryChart).toBeVisible();
    const hasHoverEvents = await this.page.evaluate(() => {
      const chart = document.querySelector('[data-testid="category-chart"]');
      return chart && chart.hasAttribute('data-interactive');
    });
    return hasHoverEvents;
  }

  async getCategorySpendingData() {
    await expect(this.categoryChart).toBeVisible();
    const data = {};
    const count = await this.categoryItem.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.categoryItem.nth(i);
      const category = await item.locator('[data-testid="category-name"]').textContent();
      const amount = parseFloat(await item.locator('[data-testid="category-amount"]').textContent().replace(/[^0-9.]/g, ''));
      data[category.trim()] = amount;
    }
    
    return data;
  }

  async clickCategory(categoryName) {
    const category = this.page.locator(`[data-category="${categoryName}"]`);
    await category.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryTransactions() {
    await expect(this.transactionDetailView).toBeVisible();
    const transactions = [];
    const rows = this.page.locator('[data-testid="detail-transaction-row"]');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const merchant = await row.locator('[data-testid="txn-merchant"]').textContent();
      const amount = parseFloat(await row.locator('[data-testid="txn-amount"]').textContent().replace(/[^0-9.]/g, ''));
      const date = await row.locator('[data-testid="txn-date"]').textContent();
      const card = await row.locator('[data-testid="txn-card"]').textContent();
      
      transactions.push({ merchant, amount, date, card });
    }
    
    return transactions;
  }

  async clickBackButton() {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async hasAnyTransactions() {
    const hasData = await this.page.evaluate(() => {
      return window.testData && window.testData.transactions && window.testData.transactions.length > 0;
    });
    return hasData;
  }

  async getTrendMonths() {
    await expect(this.trendChart).toBeVisible();
    const months = [];
    const labels = this.page.locator('[data-testid="trend-month-label"]');
    const count = await labels.count();
    
    for (let i = 0; i < count; i++) {
      const month = await labels.nth(i).textContent();
      months.push(month.trim());
    }
    
    return months;
  }

  async getMonthlyTrendData() {
    await expect(this.trendChart).toBeVisible();
    const data = {};
    const dataPoints = this.page.locator('[data-testid="trend-data-point"]');
    const count = await dataPoints.count();
    
    for (let i = 0; i < count; i++) {
      const point = dataPoints.nth(i);
      const month = await point.getAttribute('data-month');
      const amount = parseFloat(await point.getAttribute('data-amount'));
      data[month] = amount;
    }
    
    return data;
  }

  async hoverOverDataPoint(month) {
    const dataPoint = this.page.locator(`[data-month="${month}"]`);
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
  }

  async getAvailableMonthsCount() {
    const months = await this.getTrendMonths();
    return months.length;
  }
};