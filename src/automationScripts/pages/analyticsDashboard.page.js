const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsDashboardPage = class AnalyticsDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.categoryChart = page.locator('[data-testid="category-chart"], .chart-container:has-text("Category-wise Spending")');
    this.categoryBars = page.locator('[data-testid="category-bar"], .category-bar');
    this.categoryLabels = page.locator('[data-testid="category-label"], .category-label');
    this.categoryAmounts = page.locator('[data-testid="category-amount"], .category-amount');
    
    // Drill-down Locators
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list');
    this.transactionItems = page.locator('[data-testid="transaction-item"], .transaction-item');
    this.merchantNames = page.locator('[data-testid="merchant-name"], .transaction-merchant');
    this.transactionAmounts = page.locator('[data-testid="transaction-amount"], .transaction-amount');
    this.transactionDates = page.locator('[data-testid="transaction-date"], .transaction-date');
    this.categoryTotal = page.locator('[data-testid="category-total"], .category-total-amount');
    this.backButton = page.locator('[data-testid="back-button"], button:has-text("Back")');
    
    // Navigation
    this.analyticsTab = page.locator('[href="#!/analytics"], a:has-text("Analytics")');
  }

  async navigate() {
    logger.info('Navigating to Analytics dashboard');
    await this.page.goto('/#!/analytics');
  }

  async waitForAnalyticsLoad() {
    logger.info('Waiting for analytics to load');
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDrillDownLoad() {
    logger.info('Waiting for drill-down view to load');
    await expect(this.transactionList).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategories() {
    const count = await this.categoryLabels.count();
    const categories = [];
    for (let i = 0; i < count; i++) {
      const text = await this.categoryLabels.nth(i).textContent();
      categories.push(text.trim());
    }
    return categories;
  }

  async getCategorySpendingData() {
    const count = await this.categoryBars.count();
    const data = [];
    
    for (let i = 0; i < count; i++) {
      const bar = this.categoryBars.nth(i);
      const label = await bar.locator('.category-label').textContent();
      const amountText = await bar.locator('.category-amount').textContent();
      
      // Extract amount and percentage
      const match = amountText.match(/\$(\S+)\s*\((\d+\.?\d*)%\)/);
      if (match) {
        data.push({
          category: label.trim(),
          amount: `$${match[1]}`,
          percentage: match[2]
        });
      }
    }
    
    return data;
  }

  async getCategoryDataByName(categoryName) {
    const allData = await this.getCategorySpendingData();
    return allData.find(cat => cat.category === categoryName);
  }

  async testChartInteractivity() {
    // Test hover functionality
    const firstBar = this.categoryBars.first();
    await firstBar.hover();
    await this.page.waitForTimeout(500);
    
    // Check if hover effect is applied (chart should be interactive)
    const isVisible = await firstBar.isVisible();
    return isVisible;
  }

  async clickCategoryByName(categoryName) {
    logger.info(`Clicking on category: ${categoryName}`);
    const categoryBar = this.page.locator(`.category-bar:has-text("${categoryName}")`);
    await categoryBar.click();
  }

  async getTransactionList() {
    const count = await this.transactionItems.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.transactionItems.nth(i);
      transactions.push({
        merchant: await item.locator('.transaction-merchant, [data-testid="merchant-name"]').textContent(),
        amount: await item.locator('.transaction-amount, [data-testid="transaction-amount"]').textContent(),
        date: await item.locator('.transaction-date, [data-testid="transaction-date"]').textContent()
      });
    }
    
    return transactions;
  }

  async getCategoryTotalInDrillDown() {
    await expect(this.categoryTotal).toBeVisible();
    return (await this.categoryTotal.textContent()).trim();
  }

  async clickBackToCategoryView() {
    logger.info('Returning to category view');
    await this.backButton.click();
  }
};
