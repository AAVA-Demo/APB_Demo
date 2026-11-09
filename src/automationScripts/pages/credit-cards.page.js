const { expect } = require('@playwright/test');

/**
 * Page Object: Credit Cards Overview Page
 * Covers: Multiple Credit Cards Overview functionality
 * Related Test Cases: QE-8460 TS-001, TS-002, TS-003
 */
exports.CreditCardsPage = class CreditCardsPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardsList = page.locator('[data-testid="cards-list"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    
    // Overview Totals
    this.totalCreditLimit = page.locator('[data-testid="overview-total-credit-limit"]');
    this.totalOutstanding = page.locator('[data-testid="overview-total-outstanding"]');
    this.creditUtilization = page.locator('[data-testid="overview-credit-utilization"]');
    
    // Empty State
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
  }

  async navigate() {
    await this.page.goto('/credit-cards');
    await this.page.waitForLoadState('networkidle');
  }

  getCardByIndex(index) {
    const cardElement = this.cardItems.nth(index);
    return {
      container: cardElement,
      creditLimit: cardElement.locator('[data-testid="card-credit-limit"]'),
      outstandingAmount: cardElement.locator('[data-testid="card-outstanding"]'),
      availableCredit: cardElement.locator('[data-testid="card-available-credit"]'),
      cardNumber: cardElement.locator('[data-testid="card-number"]'),
      cardName: cardElement.locator('[data-testid="card-name"]')
    };
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getAllCardDetails() {
    const count = await this.getCardCount();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const card = this.getCardByIndex(i);
      cards.push({
        creditLimit: await card.creditLimit.textContent(),
        outstanding: await card.outstandingAmount.textContent(),
        available: await card.availableCredit.textContent()
      });
    }
    
    return cards;
  }
};