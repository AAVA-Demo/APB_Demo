const { expect } = require('@playwright/test');

exports.CategorySpendingPage = class CategorySpendingPage {
  constructor(page) {
    this.page = page;
    this.categoryBreakdownContainer = page.locator('.category-breakdown-container');
    this.totalSpendingDisplay = page.locator('[data-testid="total-spending"]');
  }

  async navigate() {
    await this.page.click('a[href="/analytics/category-spending"]');
    await expect(this.categoryBreakdownContainer).toBeVisible({ timeout: 3000 });
  }

  async getCategoryAmount(categoryName) {
    const categoryLocator = this.page.locator(`[data-category="${categoryName}"] .category-amount`);
    await expect(categoryLocator).toBeVisible();
    return await categoryLocator.textContent();
  }

  async getAllCategoryNames() {
    const categoryNames = [];
    const categoryLocators = this.page.locator('.category-name');
    const count = await categoryLocators.count();
    for (let i = 0; i < count; i++) {
      categoryNames.push(await categoryLocators.nth(i).textContent());
    }
    return categoryNames;
  }

  async getTotalSpending() {
    await expect(this.totalSpendingDisplay).toBeVisible();
    return await this.totalSpendingDisplay.textContent();
  }
};