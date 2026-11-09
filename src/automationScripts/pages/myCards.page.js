const { expect } = require('@playwright/test');

exports.MyCardsPage = class MyCardsPage {
  constructor(page) {
    this.page = page;
    
    // Card list and tile locators
    this.cardList = page.locator('[data-testid="card-list"], .row:has(.card-tile)');
    this.cardTiles = page.locator('.card-tile, [data-testid="card-tile"]');
    this.searchInput = page.locator('input[placeholder*="Search"], [data-testid="card-search"]');
    
    // Authentication error locator
    this.authErrorMessage = page.locator('[data-testid="auth-error"], .error-message:has-text("Authentication")');
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await expect(this.cardList).toBeVisible();
    const cards = await this.cardTiles.all();
    return cards.length;
  }

  async getAllCards() {
    const cardElements = await this.cardTiles.all();
    const cards = [];
    
    for (const cardElement of cardElements) {
      cards.push(new CardTile(cardElement));
    }
    
    return cards;
  }

  async selectCard(cardId) {
    const cardTile = this.page.locator(`[data-card-id="${cardId}"], .card-tile:has-text("${cardId}")`);
    await cardTile.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchCards(searchText) {
    await this.searchInput.fill(searchText);
    await this.page.waitForTimeout(500); // Wait for filter to apply
  }
};

// Helper class for card tile interactions
class CardTile {
  constructor(element) {
    this.element = element;
  }

  async getCardNumber() {
    const cardNumberElement = this.element.locator('.card-number, [data-testid="card-number"]');
    return await cardNumberElement.textContent();
  }

  async getCardType() {
    const cardTypeElement = this.element.locator('.card-type, [data-testid="card-type"]');
    const text = await cardTypeElement.textContent();
    // Extract card type (Visa, MasterCard, Amex)
    if (text.includes('Visa')) return 'Visa';
    if (text.includes('MasterCard')) return 'MasterCard';
    if (text.includes('Amex')) return 'Amex';
    return text.trim();
  }

  async getCreditLimit() {
    const limitElement = this.element.locator('strong:has-text("Credit Limit") + text(), [data-testid="credit-limit"]');
    const text = await limitElement.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getAvailableCredit() {
    const availableElement = this.element.locator('strong:has-text("Available") + text(), [data-testid="available-credit"]');
    const text = await availableElement.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getOutstandingAmount() {
    const outstandingElement = this.element.locator('strong:has-text("Outstanding") + text(), [data-testid="outstanding-amount"]');
    const text = await outstandingElement.textContent();
    return text.replace(/[^0-9]/g, '');
  }
}
