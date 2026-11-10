const { expect } = require('@playwright/test');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('[data-testid="card-item"]');
    this.cardName = page.locator('[data-testid="card-name"]');
    this.cardNumber = page.locator('[data-testid="card-number"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardCurrentBalance = page.locator('[data-testid="card-current-balance"]');
    this.cardAvailableCredit = page.locator('[data-testid="card-available-credit"]');
    this.cardUtilization = page.locator('[data-testid="card-utilization"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.cardDetailContainer = page.locator('[data-testid="card-detail-container"]');
    this.cardTotalSpend = page.locator('[data-testid="card-total-spend"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/portfolio');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
  }

  async loadCardsForUser(userId) {
    await this.page.evaluate((id) => {
      window.localStorage.setItem('userId', id);
    }, userId);
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async getCardCount() {
    return await this.cardItem.count();
  }

  async getCardDetails(index) {
    const card = this.cardItem.nth(index);
    await expect(card).toBeVisible();
    
    return {
      cardName: await card.locator('[data-testid="card-name"]').textContent(),
      cardNumber: await card.locator('[data-testid="card-number"]').textContent(),
      creditLimit: await card.locator('[data-testid="card-credit-limit"]').textContent(),
      currentBalance: await card.locator('[data-testid="card-current-balance"]').textContent(),
      availableCredit: await card.locator('[data-testid="card-available-credit"]').textContent(),
      utilizationPercentage: await card.locator('[data-testid="card-utilization"]').textContent()
    };
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async hasStaleCardData() {
    const staleDataIndicator = this.page.locator('[data-testid="stale-data-indicator"]');
    return await staleDataIndicator.isVisible();
  }

  async selectCard(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loadCardSpendDetail(cardId, month) {
    await this.page.goto(`/portfolio/${cardId}?month=${month}`);
    await this.waitForPageLoad();
  }

  async getCardTotalSpend() {
    await expect(this.cardTotalSpend).toBeVisible();
    return await this.cardTotalSpend.textContent();
  }

  async getCardCreditLimit() {
    await expect(this.cardDetailContainer).toBeVisible();
    return await this.cardDetailContainer.locator('[data-testid="card-credit-limit"]').textContent();
  }

  async getCardCurrentBalance() {
    await expect(this.cardDetailContainer).toBeVisible();
    return await this.cardDetailContainer.locator('[data-testid="card-current-balance"]').textContent();
  }

  async getCardAvailableCredit() {
    await expect(this.cardDetailContainer).toBeVisible();
    return await this.cardDetailContainer.locator('[data-testid="card-available-credit"]').textContent();
  }

  async getCardUtilization() {
    await expect(this.cardDetailContainer).toBeVisible();
    return await this.cardDetailContainer.locator('[data-testid="card-utilization"]').textContent();
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async hasCardData() {
    return await this.cardDetailContainer.isVisible();
  }

  async hasSensitiveDataExposed() {
    const sensitiveDataElements = await this.page.locator('[data-sensitive="true"]').count();
    return sensitiveDataElements > 0;
  }
};