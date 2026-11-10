const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsContainer = page.locator('.cards-container');
    this.cardElements = page.locator('.credit-card');
    this.loadingSpinner = page.locator('.loading-spinner');
    this.errorMessage = page.locator('.error-message');
    this.retryButton = page.locator('button[data-testid="retry-button"]');
    this.cardsNavLink = page.locator('a[href="/cards"]');
  }

  async navigateToCards() {
    await this.cardsNavLink.click();
    await this.page.waitForURL('**/cards');
  }

  async waitForCardsToLoad() {
    await expect(this.cardsContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.waitForCardsToLoad();
    return await this.cardElements.count();
  }

  async selectCardByIndex(index) {
    await expect(this.cardElements.nth(index)).toBeVisible();
    await this.cardElements.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardByNumber(cardNumber) {
    const card = this.page.locator(`.credit-card:has-text("${cardNumber}")`);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardByType(cardType) {
    return this.page.locator(`.credit-card.${cardType.toLowerCase()}`);
  }

  async getCardLogo(cardElement) {
    const logo = cardElement.locator('.card-logo');
    await expect(logo).toBeVisible();
    return await logo.getAttribute('src');
  }

  async getLoadingSpinner() {
    return this.loadingSpinner;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};