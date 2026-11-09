const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    
    this.cardsContainer = page.locator('[data-testid="cards-container"]');
    this.cardsList = page.locator('[data-testid="cards-list"]');
    this.cardItem = page.locator('.card-item');
    
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.warningBanner = page.locator('[data-testid="warning-banner"]');
    
    this.cardDetailsPanel = page.locator('[data-testid="card-details-panel"]');
    this.nextPageButton = page.locator('[data-testid="next-page-button"]');
    this.prevPageButton = page.locator('[data-testid="prev-page-button"]');
  }

  async navigate() {
    await this.page.goto('/cards');
  }

  async waitForCardsLoad() {
    await expect(this.cardsContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.waitForCardsLoad();
    return await this.cardItem.count();
  }

  async getAllCards() {
    await this.waitForCardsLoad();
    const cards = [];
    const cardElements = await this.cardItem.all();
    
    for (const element of cardElements) {
      const cardId = await element.getAttribute('data-card-id');
      const cardType = await element.locator('[data-testid="card-type"]').textContent();
      const lastFourDigits = await element.locator('[data-testid="card-last-four"]').textContent();
      const creditLimit = await element.locator('[data-testid="card-limit"]').textContent();
      const currentBalance = await element.locator('[data-testid="card-balance"]').textContent();
      const availableBalance = await element.locator('[data-testid="card-available"]').textContent();
      const cardName = await element.locator('[data-testid="card-name"]').textContent();
      
      cards.push({
        cardId,
        cardType,
        lastFourDigits,
        creditLimit,
        currentBalance,
        availableBalance,
        availableCredit: availableBalance,
        cardName
      });
    }
    
    return cards;
  }

  async getCardDetails(cardId) {
    const cardElement = this.page.locator(`[data-card-id="${cardId}"]`);
    await expect(cardElement).toBeVisible();
    
    return {
      cardType: await cardElement.locator('[data-testid="card-type"]').textContent(),
      lastFourDigits: await cardElement.locator('[data-testid="card-last-four"]').textContent(),
      creditLimit: await cardElement.locator('[data-testid="card-limit"]').textContent(),
      currentBalance: await cardElement.locator('[data-testid="card-balance"]').textContent(),
      availableCredit: await cardElement.locator('[data-testid="card-available"]').textContent()
    };
  }

  async selectCard(cardId) {
    const cardElement = this.page.locator(`[data-card-id="${cardId}"]`);
    await cardElement.click();
    await expect(this.cardDetailsPanel).toBeVisible();
  }

  async getCardStatus(cardId) {
    const cardElement = this.page.locator(`[data-card-id="${cardId}"]`);
    const statusElement = cardElement.locator('[data-testid="card-status"]');
    return await statusElement.textContent();
  }

  async hasPagination() {
    return await this.nextPageButton.isVisible();
  }

  async hasScrolling() {
    const hasScroll = await this.cardsContainer.evaluate(el => {
      return el.scrollHeight > el.clientHeight;
    });
    return hasScroll;
  }

  async navigateToNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToPrevPage() {
    await this.prevPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};