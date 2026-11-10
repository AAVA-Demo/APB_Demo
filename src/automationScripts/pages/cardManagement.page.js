const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    this.cardPortfolioContainer = page.locator('[data-testid="card-portfolio-container"]');
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardDetailContainer = page.locator('[data-testid="card-detail-container"]');
    this.emptyStateContainer = page.locator('[data-testid="empty-state-container"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"]');
    this.currentBalanceValue = page.locator('[data-testid="current-balance-value"]');
    this.creditLimitValue = page.locator('[data-testid="credit-limit-value"]');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"]');
    this.recentTransactionsTable = page.locator('[data-testid="recent-transactions-table"]');
    
    this.cardItems = page.locator('[data-testid="card-item"]');
    this.cardTypeLabel = page.locator('[data-testid="card-type"]');
    this.maskedCardNumber = page.locator('[data-testid="masked-card-number"]');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async navigateToCardManagement() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCardDetailPage(cardId) {
    await this.page.goto(`/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardByNumber(lastFourDigits) {
    const cardSelector = this.page.locator(`[data-testid="card-item"]`, {
      has: this.page.locator('text', { hasText: lastFourDigits })
    });
    await expect(cardSelector).toBeVisible();
    await cardSelector.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionRows() {
    await expect(this.recentTransactionsTable).toBeVisible();
    const rows = await this.page.locator('[data-testid="transaction-row"]').all();
    
    return rows.map(row => ({
      date: row.locator('[data-testid="transaction-date"]'),
      merchant: row.locator('[data-testid="transaction-merchant"]'),
      category: row.locator('[data-testid="transaction-category"]'),
      amount: row.locator('[data-testid="transaction-amount"]')
    }));
  }

  async verifyTransactionsSortedByDateDescending() {
    const dateElements = await this.page.locator('[data-testid="transaction-date"]').all();
    const dates = [];
    
    for (const dateElement of dateElements) {
      const dateText = await dateElement.textContent();
      dates.push(new Date(dateText));
    }
    
    for (let i = 0; i < dates.length - 1; i++) {
      if (dates[i] < dates[i + 1]) {
        return false;
      }
    }
    return true;
  }

  async verifyAllTransactionsBelongToCard(cardId) {
    const transactionCardIds = await this.page.locator('[data-testid="transaction-card-id"]').all();
    
    for (const element of transactionCardIds) {
      const transactionCardId = await element.getAttribute('data-card-id');
      if (transactionCardId !== cardId) {
        return false;
      }
    }
    return true;
  }

  async waitForRedirect() {
    await this.page.waitForURL(/\/cards$/, { timeout: 5000 });
  }

  async getCardCount() {
    await expect(this.cardListContainer).toBeVisible();
    const cards = await this.cardItems.all();
    return cards.length;
  }

  async getAllCardElements() {
    const cardElements = await this.cardItems.all();
    
    return cardElements.map(card => ({
      cardType: card.locator('[data-testid="card-type"]'),
      maskedNumber: card.locator('[data-testid="masked-card-number"]'),
      currentBalance: card.locator('[data-testid="card-balance"]'),
      availableCredit: card.locator('[data-testid="card-available-credit"]'),
      creditLimit: card.locator('[data-testid="card-credit-limit"]')
    }));
  }

  async verifyResponsiveLayout(deviceType) {
    if (deviceType === 'desktop') {
      await this.page.setViewportSize({ width: 1920, height: 1080 });
    }
    await this.page.waitForTimeout(500);
    await expect(this.cardListContainer).toBeVisible();
  }

  async getFirstCardElement() {
    await expect(this.cardItems.first()).toBeVisible();
    return this.cardItems.first();
  }

  async waitForHoverEffect(element) {
    await this.page.waitForTimeout(300);
    const hasHoverClass = await element.evaluate(el => 
      el.classList.contains('card-item-hover') || 
      window.getComputedStyle(el).transform !== 'none'
    );
    expect(hasHoverClass).toBe(true);
  }

  async setUserWithNoCards() {
    await this.page.route('**/api/cards*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
  }
};
