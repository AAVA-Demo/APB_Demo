const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardListContainer = page.locator('[data-testid="card-list"]');
    this.cardItems = page.locator('.card-item');
    this.errorMessage = page.locator('.alert-danger');
    this.emptyStateMessage = page.locator('.alert-warning');
    this.loadingSpinner = page.locator('.loading-spinner');
    this.cardDetailContainer = page.locator('[data-testid="card-detail"]');
    this.totalSpendLabel = page.locator('[data-testid="total-spend"]');
    this.categoryBreakdownList = page.locator('.list-group');
    this.contributionPercentageLabel = page.locator('[data-testid="contribution-percentage"]');
    this.noDataMessage = page.locator('.alert-info');
    this.validationError = page.locator('.alert-danger');
  }

  async navigateToCardManagement() {
    await this.page.click('a[href="#/cards"]');
    await this.page.waitForURL('**/cards');
  }

  async waitForCardListLoad() {
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    await expect(this.cardListContainer).toBeVisible();
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getAllCards() {
    const count = await this.getCardCount();
    const cards = [];
    for (let i = 0; i < count; i++) {
      const card = this.cardItems.nth(i);
      cards.push({
        cardName: card.locator('.card-title'),
        lastFourDigits: card.locator('h4'),
        currentBalance: card.locator('.text-danger'),
        creditLimit: card.locator('.col-6:first-child strong'),
        status: card.locator('.badge')
      });
    }
    return cards;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async selectCard(cardId) {
    await this.page.click(`[data-card-id="${cardId}"]`);
    await this.page.waitForURL(`**/cards/${cardId}`);
  }

  async waitForCardDetailLoad() {
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    await expect(this.cardDetailContainer).toBeVisible();
  }

  async getTotalSpend() {
    await expect(this.totalSpendLabel).toBeVisible();
    return await this.totalSpendLabel.textContent();
  }

  async getCategoryBreakdown() {
    const items = await this.categoryBreakdownList.locator('.list-group-item').all();
    const breakdown = {};
    for (const item of items) {
      const text = await item.textContent();
      const [category, amount] = text.split('₹');
      breakdown[category.trim()] = '₹' + amount.trim();
    }
    return breakdown;
  }

  async getContributionPercentage() {
    await expect(this.contributionPercentageLabel).toBeVisible();
    return await this.contributionPercentageLabel.textContent();
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async getValidationError() {
    await expect(this.validationError).toBeVisible();
    return await this.validationError.textContent();
  }
};