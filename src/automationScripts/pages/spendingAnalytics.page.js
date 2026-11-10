const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

exports.SpendingAnalyticsPage = class SpendingAnalyticsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    
    this.analyticsSection = page.locator('.spending-analytics-section, .analytics-dashboard');
    this.analyticsNav = page.locator('a[href*="analytics"], button:has-text("Spending Analytics")');
    this.categoryBreakdown = page.locator('.category-breakdown, .category-chart');
    this.categoryItem = (categoryName) => page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    this.categoryAmount = (categoryName) => page.locator(`[data-category="${categoryName}"] .amount, .category-item:has-text("${categoryName}") .amount`);
  }

  async navigateToSpendingAnalytics() {
    this.logger.info('Navigating to Spending Analytics dashboard');
    await this.analyticsNav.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsSection).toBeVisible();
  }

  async verifyCategoryBreakdownDisplayed() {
    this.logger.info('Verifying category breakdown is displayed');
    await expect(this.categoryBreakdown).toBeVisible();
  }

  async verifyCategoryAmount(categoryName, expectedAmount) {
    this.logger.info(`Verifying ${categoryName} amount: ${expectedAmount}`);
    const category = this.categoryItem(categoryName);
    await expect(category).toBeVisible();
    const amount = this.categoryAmount(categoryName);
    await expect(amount).toContainText(expectedAmount);
  }

  async verifyEmptyCategories(categoryNames) {
    this.logger.info(`Verifying empty categories: ${categoryNames.join(', ')}`);
    for (const categoryName of categoryNames) {
      const category = this.categoryItem(categoryName);
      const amount = this.categoryAmount(categoryName);
      const isVisible = await category.isVisible().catch(() => false);
      if (isVisible) {
        await expect(amount).toContainText(/\$0|0\.00/);
      } else {
        this.logger.info(`${categoryName} is not displayed (expected for empty category)`);
      }
    }
  }
};