const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Container
    this.analyticsContainer = page.locator('.analytics-container');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=Loading analytics...');
    
    // Category-wise spending section
    this.categoryChart = page.locator('chart-directive').first();
    this.categoryListItems = page.locator('.list-group-item');
    
    // Monthly trend section
    this.trendChart = page.locator('chart-directive').nth(1);
    this.trendListItems = page.locator('.list-group-item');
    
    // Filter indicator
    this.filterIndicator = page.locator('text=/Filtered by:/');
    this.resetFilterButton = page.locator('button').filter({ hasText: 'Show All Categories' });
    
    // No data message
    this.noDataMessage = page.locator('text=/No spending data available/');
    
    // Error message
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/#!/analytics');
    await this.waitForAnalyticsToLoad();
  }

  async waitForAnalyticsToLoad() {
    await expect(this.loadingIndicator).toBeHidden({ timeout: 5000 });
    await expect(this.analyticsContainer).toBeVisible();
  }

  async getCategoryLabels() {
    const categories = [];
    const items = await this.categoryListItems.all();
    
    for (const item of items) {
      const text = await item.textContent();
      const category = text.split(':')[0].trim();
      categories.push(category);
    }
    
    return categories;
  }

  async getCategoryAmounts() {
    const amounts = [];
    const items = await this.categoryListItems.all();
    
    for (const item of items) {
      const text = await item.textContent();
      const amount = text.split(':')[1].trim();
      amounts.push(amount);
    }
    
    return amounts;
  }

  async selectCategory(categoryName) {
    const categoryItem = this.categoryListItems.filter({ hasText: categoryName });
    await categoryItem.click();
  }

  async getFilterIndicatorText() {
    return await this.filterIndicator.textContent();
  }

  async resetFilter() {
    await this.resetFilterButton.click();
  }

  async getTransactionDetails() {
    // After filtering by category, transactions are shown in category list
    const transactions = [];
    const items = await this.categoryListItems.all();
    
    for (const item of items) {
      const text = await item.textContent();
      const parts = text.split(':');
      if (parts.length >= 2) {
        transactions.push({
          category: parts[0].trim(),
          amount: parts[1].trim()
        });
      }
    }
    
    return transactions;
  }

  async getTrendLabels() {
    const labels = [];
    const items = await this.trendListItems.all();
    
    // Trend items are in second list group
    const trendSection = this.page.locator('.col-xs-12.col-md-6').nth(1);
    const trendItems = trendSection.locator('.list-group-item');
    const allTrendItems = await trendItems.all();
    
    for (const item of allTrendItems) {
      const text = await item.textContent();
      const month = text.split(':')[0].trim();
      labels.push(month);
    }
    
    return labels;
  }

  async getTrendAmounts() {
    const amounts = [];
    const trendSection = this.page.locator('.col-xs-12.col-md-6').nth(1);
    const trendItems = trendSection.locator('.list-group-item');
    const allTrendItems = await trendItems.all();
    
    for (const item of allTrendItems) {
      const text = await item.textContent();
      const amount = text.split(':')[1].trim();
      amounts.push(amount);
    }
    
    return amounts;
  }

  async getNoDataMessageText() {
    return await this.noDataMessage.textContent();
  }

  async getErrorMessageText() {
    return await this.errorMessage.textContent();
  }
};
