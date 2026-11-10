const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    // Card list locators
    this.cardListContainer = page.locator('[data-testid="card-list"], .card-list, .cards-container').first();
    this.cardItems = page.locator('[data-testid="card-item"], .card-item, .credit-card');
    this.firstCardType = page.locator('[data-testid="card-type"], .card-type').first();
    this.firstCardIssuer = page.locator('[data-testid="card-issuer"], .card-issuer').first();
    this.firstCardExpiry = page.locator('[data-testid="card-expiry"], .card-expiry').first();
    // No cards message
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message, div:has-text("No cards"), div:has-text("not linked")').first();
    this.addCardCTA = page.locator('[data-testid="add-card-cta"], button:has-text("Add"), a:has-text("Add a credit card")').first();
    // Error message
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger, div:has-text("unavailable"), div:has-text("try again")').first();
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry"), button:has-text("Try Again")').first();
    // Card detail locators
    this.cardDetailCreditLimit = page.locator('[data-testid="card-detail-credit-limit"], .card-detail-limit, div:has-text("Credit Limit")').first();
    this.cardDetailAvailableCredit = page.locator('[data-testid="card-detail-available"], .card-detail-available, div:has-text("Available")').first();
    this.cardDetailOutstanding = page.locator('[data-testid="card-detail-outstanding"], .card-detail-outstanding, div:has-text("Outstanding")').first();
    this.cardDetailMonthSpend = page.locator('[data-testid="card-detail-month-spend"], .card-detail-spend, div:has-text("Month Spend"), div:has-text("This Month")').first();
    this.cardDetailRecentTransactions = page.locator('[data-testid="recent-transactions"], .recent-transactions, table, .transaction-list').first();
    this.cardNotAccessibleError = page.locator('[data-testid="card-not-accessible"], .error-message, div:has-text("no longer available"), div:has-text("not accessible")').first();
    this.loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner, div:has-text("Loading")').first();
    this.performanceWarning = page.locator('[data-testid="performance-warning"], .warning-message, div:has-text("longer than expected"), div:has-text("slow")').first();
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    try {
      await this.cardItems.first().waitFor({ state: 'visible', timeout: 3000 });
      return await this.cardItems.count();
    } catch {
      return 0;
    }
  }

  async getAllMaskedCardNumbers() {
    const maskedNumbers = [];
    const count = await this.getCardCount();
    for (let i = 0; i < count; i++) {
      const cardItem = this.cardItems.nth(i);
      const maskedNumber = await cardItem.locator('[data-testid="masked-number"], .masked-number, .card-number').textContent();
      maskedNumbers.push(maskedNumber.trim());
    }
    return maskedNumbers;
  }

  async selectCard(index) {
    await expect(this.cardItems.nth(index)).toBeVisible();
    await this.cardItems.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }
};