const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsContainer = page.locator('.card-list-container');
    this.cardTiles = page.locator('.card-tile');
    this.warningMessage = page.locator('.warning-message');
    this.paginationControls = page.locator('.pagination');
    this.myCardsMenuItem = page.locator('a[href="#!/cards"]');
  }

  async navigateToMyCards() {
    logger.info('Navigating to My Cards page');
    await this.myCardsMenuItem.click();
    await expect(this.cardsContainer).toBeVisible();
  }

  async getCardCount() {
    logger.info('Getting card count');
    await expect(this.cardTiles.first()).toBeVisible();
    return await this.cardTiles.count();
  }

  async verifyCardDetails(index, cardType, maskedNumber) {
    logger.info(`Verifying card ${index}: ${cardType} ${maskedNumber}`);
    const card = this.cardTiles.nth(index);
    await expect(card).toBeVisible();
    const cardTypeText = await card.locator('h4').textContent();
    const cardNumberText = await card.locator('.card-number').textContent();
    expect(cardTypeText).toBe(cardType);
    expect(cardNumberText).toBe(maskedNumber);
  }

  async clickCardByIndex(index) {
    logger.info('Clicking card at index: ' + index);
    const card = this.cardTiles.nth(index);
    await expect(card).toBeVisible();
    await card.click();
  }

  async clickCardByCardNumber(maskedNumber) {
    logger.info('Clicking card with number: ' + maskedNumber);
    const card = this.page.locator(`.card-tile:has-text("${maskedNumber}")`);
    await expect(card).toBeVisible();
    await card.click();
  }
};
