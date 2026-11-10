const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Panel Locators
    this.categorySpendingPanel = page.locator('.panel:has-text("Category-Wise Spending")');
    this.monthlyTrendsPanel = page.locator('.panel:has-text("Monthly Spend Trends")');
    
    // Chart Locators
    this.categoryChart = page.locator('spending-chart[chart-type="pie"], canvas').first();
    this.monthlyTrendsChart = page.locator('spending-chart[chart-type="line"], canvas').nth(1);
    
    // Category Table Locators
    this.categoryTable = page.locator('table.table-striped');
    this.categoryRows = page.locator('table.table-striped tbody tr');
    
    // Error and Empty State Locators
    this.errorMessage = page.locator('.alert-danger, [class*="error"]');
    this.emptyStateMessage = page.locator('text=/No transaction data available/');
  }

  async navigate() {
    Logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsToLoad() {
    Logger.info('Waiting for analytics to load');
    await expect(this.categorySpendingPanel).toBeVisible({ timeout: 5000 });
  }

  async getAllCategories() {
    await expect(this.categoryTable).toBeVisible();
    const count = await this.categoryRows.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const categoryName = await this.categoryRows.nth(i).locator('td').first().textContent();
      categories.push(categoryName.trim());
    }
    
    Logger.info(`Found ${categories.length} categories: ${categories.join(', ')}`);
    return categories;
  }

  async verifyRequiredCategories() {
    const requiredCategories = [
      'Food & Dining',
      'Fuel',
      'Shopping',
      'Travel',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Miscellaneous'
    ];
    
    const displayedCategories = await this.getAllCategories();
    
    for (const required of requiredCategories) {
      if (!displayedCategories.includes(required)) {
        Logger.warn(`Required category missing: ${required}`);
        return false;
      }
    }
    
    Logger.info('All required categories are present');
    return true;
  }

  async getCategoryAmount(categoryName) {
    await expect(this.categoryTable).toBeVisible();
    const row = this.page.locator(`table.table-striped tbody tr:has-text("${categoryName}")`);
    await expect(row).toBeVisible();
    
    const amountCell = row.locator('td').nth(1);
    const amount = await amountCell.textContent();
    Logger.info(`${categoryName} amount: ${amount}`);
    return amount.trim();
  }

  async verifyMonthlyTrendsDisplay() {
    await expect(this.monthlyTrendsPanel).toBeVisible();
    await expect(this.monthlyTrendsChart).toBeVisible();
    Logger.info('Monthly trends chart is displayed');
    return true;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const text = await this.errorMessage.textContent();
    Logger.info(`Error Message: ${text}`);
    return text;
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    const text = await this.emptyStateMessage.textContent();
    Logger.info(`Empty State Message: ${text}`);
    return text;
  }
};
