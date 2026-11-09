const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.analyticsContainer = page.locator('[data-testid="analytics-container"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.trendsChart = page.locator('[data-testid="trends-chart"]');
    
    this.categoryItem = page.locator('.category-item');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionItem = page.locator('.transaction-item');
    
    this.categoryFilter = page.locator('[data-testid="category-filter"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    
    this.monthDetailPanel = page.locator('[data-testid="month-detail-panel"]');
    this.transactionBreakdown = page.locator('[data-testid="transaction-breakdown"]');
    this.limitedDataNotification = page.locator('[data-testid="limited-data-notification"]');
    
    this.tooltip = page.locator('[data-testid="chart-tooltip"]');
    this.categoryTotal = page.locator('[data-testid="category-total"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
  }

  async navigateToTrends() {
    await this.page.goto('/analytics/trends');
  }

  async waitForAnalyticsLoad() {
    await expect(this.analyticsContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendsLoad() {
    await expect(this.trendsChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategories() {
    await this.waitForAnalyticsLoad();
    const categories = [];
    const categoryElements = await this.categoryItem.all();
    
    for (const element of categoryElements) {
      const categoryName = await element.locator('[data-testid="category-name"]').textContent();
      categories.push(categoryName.trim());
    }
    
    return categories;
  }

  async getCategoryAmount(categoryName) {
    const categoryElement = this.page.locator(`[data-category="${categoryName}"]`);
    const amountElement = categoryElement.locator('[data-testid="category-amount"]');
    return await amountElement.textContent();
  }

  async getAllCategoryData() {
    await this.waitForAnalyticsLoad();
    const categoryData = [];
    const categoryElements = await this.categoryItem.all();
    
    for (const element of categoryElements) {
      const name = await element.locator('[data-testid="category-name"]').textContent();
      const amount = await element.locator('[data-testid="category-amount"]').textContent();
      const percentage = await element.locator('[data-testid="category-percentage"]').textContent();
      
      categoryData.push({ name: name.trim(), amount: amount.trim(), percentage: percentage.trim() });
    }
    
    return categoryData;
  }

  async getCategoriesWithSpending() {
    const allCategories = await this.getAllCategoryData();
    return allCategories.filter(cat => {
      const amount = parseFloat(cat.amount.replace(/[$,]/g, ''));
      return amount > 0;
    });
  }

  async clickCategory(categoryName) {
    const categoryElement = this.page.locator(`[data-category="${categoryName}"]`);
    await categoryElement.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionDetails() {
    await expect(this.transactionList).toBeVisible();
    const transactions = [];
    const transactionElements = await this.transactionItem.all();
    
    for (const element of transactionElements) {
      const merchantName = await element.locator('[data-testid="transaction-merchant"]').textContent();
      const date = await element.locator('[data-testid="transaction-date"]').textContent();
      const amount = await element.locator('[data-testid="transaction-amount"]').textContent();
      const category = await element.locator('[data-testid="transaction-category"]').textContent();
      
      transactions.push({ merchantName, date, amount, merchant: merchantName, category });
    }
    
    return transactions;
  }

  async getNoDataMessage() {
    if (await this.noDataMessage.isVisible()) {
      return await this.noDataMessage.textContent();
    }
    return null;
  }

  async getCategoryTotal() {
    await expect(this.categoryTotal).toBeVisible();
    return await this.categoryTotal.textContent();
  }

  async selectMultipleCategories(categories) {
    for (const category of categories) {
      const checkbox = this.page.locator(`[data-category-filter="${category}"]`);
      await checkbox.check();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async deselectCategory(categoryName) {
    const checkbox = this.page.locator(`[data-category-filter="${categoryName}"]`);
    await checkbox.uncheck();
    await this.page.waitForLoadState('networkidle');
  }

  async getVisibleCategories() {
    const visibleCategories = [];
    const categoryElements = await this.categoryItem.all();
    
    for (const element of categoryElements) {
      if (await element.isVisible()) {
        const name = await element.locator('[data-testid="category-name"]').textContent();
        visibleCategories.push(name.trim());
      }
    }
    
    return visibleCategories;
  }

  async getTrendMonths() {
    await this.waitForTrendsLoad();
    const months = [];
    const monthElements = await this.page.locator('[data-testid="trend-month"]').all();
    
    for (const element of monthElements) {
      const monthText = await element.textContent();
      months.push(monthText.trim());
    }
    
    return months;
  }

  async clickMonth(monthName) {
    const monthElement = this.page.locator(`[data-month="${monthName}"]`);
    await monthElement.click();
    await this.page.waitForLoadState('networkidle');
  }

  async hoverOverMonth(monthName) {
    const monthElement = this.page.locator(`[data-month="${monthName}"]`);
    await monthElement.hover();
    await this.page.waitForTimeout(500);
  }

  async getMonthTransactions() {
    await expect(this.transactionBreakdown).toBeVisible();
    const transactions = [];
    const transactionElements = await this.transactionItem.all();
    
    for (const element of transactionElements) {
      const merchant = await element.locator('[data-testid="transaction-merchant"]').textContent();
      const date = await element.locator('[data-testid="transaction-date"]').textContent();
      const amount = await element.locator('[data-testid="transaction-amount"]').textContent();
      const category = await element.locator('[data-testid="transaction-category"]').textContent();
      
      transactions.push({ merchant, date, amount, category });
    }
    
    return transactions;
  }
};