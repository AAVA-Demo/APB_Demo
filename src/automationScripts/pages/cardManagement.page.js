const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardManagementLink = page.locator('a[href="/card-management"]');
    this.cardListContainer = page.locator('.card-list-container');
    this.cardItems = page.locator('.card-item');
    this.viewTransactionHistoryButton = page.locator('button[data-action="view-transactions"]');
  }

  async navigateToCardManagement() {
    await expect(this.cardManagementLink).toBeVisible();
    await this.cardManagementLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.cardListContainer).toBeVisible();
    logger.info('Navigated to Card Management page');
  }

  async selectCardByLastFourDigits(lastFour) {
    const cardSelector = `[data-card-last-four="${lastFour}"]`;
    const card = this.page.locator(cardSelector);
    await expect(card).toBeVisible();
    await card.click();
    logger.info(`Selected card ending in ${lastFour}`);
  }

  async clickViewTransactionHistory() {
    await expect(this.viewTransactionHistoryButton).toBeVisible();
    await expect(this.viewTransactionHistoryButton).toBeEnabled();
    await this.viewTransactionHistoryButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Clicked View Transaction History button');
  }

  async getCardCount() {
    await expect(this.cardListContainer).toBeVisible();
    return await this.cardItems.count();
  }

  async isCardDisplayed(lastFour) {
    const cardSelector = `[data-card-last-four="${lastFour}"]`;
    const card = this.page.locator(cardSelector);
    return await card.isVisible();
  }
};
