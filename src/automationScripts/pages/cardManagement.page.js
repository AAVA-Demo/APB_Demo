const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    this.cardManagementLink = page.locator('[data-testid="card-management-link"]');
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    
    this.viewTransactionHistoryButton = page.locator('[data-testid="view-transaction-history-button"]');
  }

  async navigateToCardManagement() {
    await expect(this.cardManagementLink).toBeVisible();
    await this.cardManagementLink.click();
    await this.cardList.waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectCard(cardIdentifier) {
    const cardItem = this.page.locator(`[data-testid="card-item-${cardIdentifier}"]`);
    await expect(cardItem).toBeVisible();
    await cardItem.click();
  }

  async clickViewTransactionHistory() {
    await expect(this.viewTransactionHistoryButton).toBeVisible();
    await this.viewTransactionHistoryButton.click();
  }
};
