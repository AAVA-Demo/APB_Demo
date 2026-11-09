const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.myCardsLink = page.locator('a[href*="cards"]');
    this.cardListContainer = page.locator('[data-testid="card-list"]');
    this.cardTiles = page.locator('[data-testid="card-tile"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.cardDetailView = page.locator('[data-testid="card-detail-view"]');
    this.backToCardsButton = page.locator('[data-testid="back-to-cards"]');
    this.cardErrorMessage = page.locator('[data-testid="card-error-message"]');
    this.navigationMenu = page.locator('.navbar, nav');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.demo');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToMyCards() {
    await this.myCardsLink.click();
    await expect(this.cardListContainer).toBeVisible();
  }

  async getCardCount() {
    return await this.cardTiles.count();
  }

  async getAllCardDetails() {
    const cards = await this.cardTiles.all();
    const cardDetails = [];
    for (const card of cards) {
      const maskedNumber = await card.locator('[data-testid="card-number"]').textContent();
      const cardholderName = await card.locator('[data-testid="cardholder-name"]').textContent();
      const cardType = await card.locator('[data-testid="card-type"]').textContent();
      const expiryDate = await card.locator('[data-testid="expiry-date"]').textContent();
      const spendSummary = await card.locator('[data-testid="spend-summary"]').textContent().catch(() => null);
      cardDetails.push({ maskedNumber, cardholderName, cardType, expiryDate, spendSummary });
    }
    return cardDetails;
  }

  async isInterfaceResponsive() {
    const scrollHeight = await this.cardListContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await this.cardListContainer.evaluate(el => el.clientHeight);
    return scrollHeight >= clientHeight;
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async hasGuidanceMessage() {
    const messageText = await this.emptyStateMessage.textContent();
    return messageText.includes('Contact') || messageText.includes('register');
  }

  async hasErrorIndicators() {
    const errorElements = this.page.locator('.error, .alert-danger');
    return await errorElements.count() > 0;
  }

  async isApplicationStable() {
    const isNavigationVisible = await this.navigationMenu.isVisible();
    const pageTitle = await this.page.title();
    return isNavigationVisible && pageTitle.length > 0;
  }

  async selectCard(index) {
    const cards = await this.cardTiles.all();
    await cards[index].click();
  }

  async selectCardById(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    await card.click();
  }

  async getCardDetailData() {
    await expect(this.cardDetailView).toBeVisible();
    const maskedNumber = await this.cardDetailView.locator('[data-testid="detail-card-number"]').textContent();
    const creditLimit = await this.cardDetailView.locator('[data-testid="detail-credit-limit"]').textContent();
    const availableCredit = await this.cardDetailView.locator('[data-testid="detail-available-credit"]').textContent();
    const outstandingAmount = await this.cardDetailView.locator('[data-testid="detail-outstanding"]').textContent();
    const monthlySpend = await this.cardDetailView.locator('[data-testid="detail-monthly-spend"]').textContent();
    const status = await this.cardDetailView.locator('[data-testid="detail-status"]').textContent();
    return { maskedNumber, creditLimit, availableCredit, outstandingAmount, monthlySpend, status };
  }

  async navigateBackToCardList() {
    await this.backToCardsButton.click();
    await expect(this.cardListContainer).toBeVisible();
  }

  async getCardErrorMessage() {
    await expect(this.cardErrorMessage).toBeVisible();
    return await this.cardErrorMessage.textContent();
  }

  async hasBackToCardsButton() {
    return await this.backToCardsButton.isVisible();
  }

  async isCardVisibleById(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    return await card.isVisible().catch(() => false);
  }
};