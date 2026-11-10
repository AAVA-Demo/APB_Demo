const { expect } = require('@playwright/test');

exports.SpendingAnalyticsPage = class SpendingAnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.analyticsMenu = page.locator('a[href*="spending-analytics"]');
    
    // Category Chart
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.categoryLegend = page.locator('[data-testid="category-legend"]');
    this.categoryTooltip = page.locator('.category-tooltip');
    
    // Category List
    this.categoryList = page.locator('.category-list');
    this.categoryItems = page.locator('.category-item');
    
    // Transaction Details
    this.transactionDetailPanel = page.locator('[data-testid="transaction-detail-panel"]');
    this.transactionTable = page.locator('[data-testid="transaction-table"]');
    this.transactionRows = page.locator('.transaction-row');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.closeDetailButton = page.locator('[data-testid="close-detail-panel"]');
    
    // Merchant Aggregation
    this.merchantAggregationView = page.locator('[data-testid="merchant-aggregation"]');
    this.merchantItems = page.locator('.merchant-item');
    this.merchantTransactionList = page.locator('[data-testid="merchant-transactions"]');
  }

  async navigate() {
    await this.analyticsMenu.click();
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
  }

  async getAllCategories() {
    await this.categoryItems.first().waitFor({ state: 'visible' });
    const items = await this.categoryItems.all();
    const categories = [];
    
    for (const item of items) {
      const name = await item.locator('[data-field="category-name"]').textContent();
      categories.push(name.trim());
    }
    
    return categories;
  }

  getCategoryAmount(categoryName) {
    return this.page.locator(`[data-category="${categoryName}"] [data-field="amount"]`);
  }

  getCategoryPercentage(categoryName) {
    return this.page.locator(`[data-category="${categoryName}"] [data-field="percentage"]`).textContent();
  }

  getCategoryTransactionCount(categoryName) {
    return this.page.locator(`[data-category="${categoryName}"] [data-field="transaction-count"]`);
  }

  async getTotalPercentage() {
    const items = await this.categoryItems.all();
    let total = 0;
    
    for (const item of items) {
      const percentText = await item.locator('[data-field="percentage"]').textContent();
      const percent = parseFloat(percentText.replace('%', ''));
      if (!isNaN(percent)) {
        total += percent;
      }
    }
    
    return total;
  }

  async hoverCategory(categoryName) {
    await this.page.locator(`[data-category="${categoryName}"]`).hover();
  }

  async clickCategory(categoryName) {
    await this.page.locator(`[data-category="${categoryName}"]`).click();
    await this.page.waitForTimeout(500); // Wait for animation
  }

  async getTransactionDetails() {
    await this.transactionRows.first().waitFor({ state: 'visible' });
    const rows = await this.transactionRows.all();
    const transactions = [];
    
    for (const row of rows) {
      const date = await row.locator('[data-field="date"]').textContent();
      const merchant = await row.locator('[data-field="merchant"]').textContent();
      const amount = await row.locator('[data-field="amount"]').textContent();
      
      transactions.push({ date, merchant, amount });
    }
    
    return transactions;
  }

  async closeDetailPanel() {
    await this.closeDetailButton.click();
  }

  async getMerchantSubtotals() {
    await this.merchantItems.first().waitFor({ state: 'visible' });
    const items = await this.merchantItems.all();
    const merchants = [];
    
    for (const item of items) {
      const name = await item.locator('[data-field="merchant-name"]').textContent();
      const amountText = await item.locator('[data-field="merchant-amount"]').textContent();
      const percentText = await item.locator('[data-field="merchant-percentage"]').textContent();
      
      const amount = parseFloat(amountText.replace(/[₹,]/g, ''));
      const percentage = parseFloat(percentText.replace('%', ''));
      
      merchants.push({ name, amount, percentage });
    }
    
    return merchants;
  }

  async getCategoryTotalAmount(categoryName) {
    const amountText = await this.getCategoryAmount(categoryName).textContent();
    return parseFloat(amountText.replace(/[₹,]/g, ''));
  }

  async clickMerchant(merchantName) {
    await this.page.locator(`[data-merchant="${merchantName}"]`).click();
  }
};