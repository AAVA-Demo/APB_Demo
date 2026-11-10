const { expect } = require('@playwright/test');

exports.CardWiseAnalysisPage = class CardWiseAnalysisPage {
  constructor(page) {
    this.page = page;
    this.portfolioContainer = page.locator('.portfolio-container');
    this.spendingAnalysisContainer = page.locator('.spending-analysis-container');
    this.utilizationMetricDisplay = page.locator('[data-testid="utilization-metric"]');
    this.outstandingBalanceDisplay = page.locator('[data-testid="outstanding-balance"]');
    this.selectedCardDisplay = page.locator('.selected-card-number');
  }

  async navigateToPortfolio() {
    await this.page.click('a[href="/multi-card-management"]');
    await expect(this.portfolioContainer).toBeVisible({ timeout: 3000 });
  }

  async selectCard(lastFourDigits) {
    await this.page.click(`[data-card-last-four="${lastFourDigits}"]`);
    await expect(this.spendingAnalysisContainer).toBeVisible();
  }

  async getCategoryBreakdown() {
    const categories = {};
    const categoryNames = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    for (const category of categoryNames) {
      const categoryLocator = this.page.locator(`[data-category="${category}"] .category-amount`);
      await expect(categoryLocator).toBeVisible();
      categories[category] = await categoryLocator.textContent();
    }
    return categories;
  }

  async getUtilizationMetric() {
    await expect(this.utilizationMetricDisplay).toBeVisible();
    return await this.utilizationMetricDisplay.textContent();
  }

  async getOutstandingBalance() {
    await expect(this.outstandingBalanceDisplay).toBeVisible();
    return await this.outstandingBalanceDisplay.textContent();
  }

  async getSelectedCardNumber() {
    await expect(this.selectedCardDisplay).toBeVisible();
    return await this.selectedCardDisplay.textContent();
  }
};