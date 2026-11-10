const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.categoryList = page.locator('[data-testid="category-list"]');
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.categoryAmount = page.locator('[data-testid="category-amount"]');
    this.categoryPercentage = page.locator('[data-testid="category-percentage"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.monthlyTrendList = page.locator('[data-testid="monthly-trend-list"]');
    this.monthlyTrendItem = page.locator('[data-testid="monthly-trend-item"]');
    this.monthlySpend = page.locator('[data-testid="monthly-spend"]');
    this.categoryFilter = page.locator('[data-testid="category-filter"]');
    this.selectedCategoryLabel = page.locator('[data-testid="selected-category-label"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
  }

  async loadSpendingInsights(userId, startMonth, endMonth) {
    await this.page.evaluate((data) => {
      window.localStorage.setItem('userId', data.userId);
      window.localStorage.setItem('startMonth', data.startMonth);
      window.localStorage.setItem('endMonth', data.endMonth);
    }, { userId, startMonth, endMonth });
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async getCategoryCount() {
    return await this.categoryItem.count();
  }

  async getCategoryAmount(categoryName) {
    const category = this.page.locator(`[data-category="${categoryName}"]`);
    await expect(category).toBeVisible();
    return await category.locator('[data-testid="category-amount"]').textContent();
  }

  async getCategoryPercentage(categoryName) {
    const category = this.page.locator(`[data-category="${categoryName}"]`);
    await expect(category).toBeVisible();
    return await category.locator('[data-testid="category-percentage"]').textContent();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getMonthlyTrendCount() {
    return await this.monthlyTrendItem.count();
  }

  async getMonthlySpend(month) {
    const trendItem = this.page.locator(`[data-month="${month}"]`);
    await expect(trendItem).toBeVisible();
    return await trendItem.locator('[data-testid="monthly-spend"]').textContent();
  }

  async isMonthlyTrendsChronological() {
    const months = await this.page.locator('[data-testid="monthly-trend-item"]').allTextContents();
    const monthValues = months.map(m => m.match(/\d{4}-\d{2}/)[0]);
    
    for (let i = 1; i < monthValues.length; i++) {
      if (monthValues[i] < monthValues[i - 1]) {
        return false;
      }
    }
    return true;
  }

  async hasPlaceholderMonthlyData() {
    const placeholders = await this.page.locator('[data-testid="placeholder-month"]').count();
    return placeholders > 0;
  }

  async selectCategoryFilter(categoryName) {
    await this.categoryFilter.selectOption({ label: categoryName });
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryMonthlySpend(month, categoryName) {
    const trendItem = this.page.locator(`[data-month="${month}"]`);
    await expect(trendItem).toBeVisible();
    return await trendItem.locator(`[data-category="${categoryName}"]`).textContent();
  }

  async getSelectedCategoryFilter() {
    await expect(this.selectedCategoryLabel).toBeVisible();
    return await this.selectedCategoryLabel.textContent();
  }
};