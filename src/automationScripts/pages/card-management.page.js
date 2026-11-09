const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('[data-testid="card-item"]');
    this.cardSwitcher = page.locator('[data-testid="card-switcher"]');
    
    // Card Details Locators
    this.cardNumberField = page.locator('[data-testid="card-number"]');
    this.issuerField = page.locator('[data-testid="card-issuer"]');
    this.cardTypeField = page.locator('[data-testid="card-type"]');
    this.creditLimitField = page.locator('[data-testid="credit-limit"]');
    this.availableCreditField = page.locator('[data-testid="available-credit"]');
    this.outstandingBalanceField = page.locator('[data-testid="outstanding-balance"]');
    
    // Spend Analysis Locators
    this.spendAnalysisButton = page.locator('[data-testid="view-spend-analysis"]');
    this.categoryBreakdownSection = page.locator('[data-testid="category-breakdown"]');
    this.monthlyTrendsSection = page.locator('[data-testid="monthly-trends"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    
    // Error and Message Locators
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.switcherMessage = page.locator('[data-testid="switcher-message"]');
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardListLoad() {
    await this.cardList.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async getCardCount() {
    await this.waitForCardListLoad();
    return await this.cardItem.count();
  }

  async selectCard(cardId) {
    const card = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"]`);
    await card.waitFor({ state: 'visible' });
    await card.click();
    await this.page.waitForTimeout(300);
  }

  async viewSpendAnalysis() {
    await this.spendAnalysisButton.waitFor({ state: 'visible' });
    await this.spendAnalysisButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardDetails() {
    await this.creditLimitField.waitFor({ state: 'visible' });
    
    return {
      limit: await this.creditLimitField.textContent().then(t => t.replace(/[^0-9,]/g, '')),
      available: await this.availableCreditField.textContent().then(t => t.replace(/[^0-9,]/g, '')),
      outstanding: await this.outstandingBalanceField.textContent().then(t => t.replace(/[^0-9,]/g, ''))
    };
  }

  async getCurrentCardDetails() {
    await this.cardNumberField.waitFor({ state: 'visible' });
    
    return {
      cardNumber: await this.cardNumberField.textContent(),
      issuer: await this.issuerField.textContent(),
      cardType: await this.cardTypeField.textContent(),
      limit: await this.creditLimitField.textContent().then(t => t.replace(/[^0-9,]/g, '')),
      available: await this.availableCreditField.textContent().then(t => t.replace(/[^0-9,]/g, '')),
      outstanding: await this.outstandingBalanceField.textContent().then(t => t.replace(/[^0-9,]/g, ''))
    };
  }

  async getCategoryBreakdown() {
    await this.categoryBreakdownSection.waitFor({ state: 'visible' });
    const categoryRows = await this.page.locator('[data-testid="category-breakdown-row"]').all();
    const breakdown = {};
    
    for (const row of categoryRows) {
      const category = await row.locator('[data-testid="category-name"]').textContent();
      const amount = await row.locator('[data-testid="category-amount"]').textContent().then(t => t.replace(/[^0-9,]/g, ''));
      breakdown[category] = amount;
    }
    
    return breakdown;
  }

  async getMonthlyTrends() {
    await this.monthlyTrendsSection.waitFor({ state: 'visible' });
    const trendRows = await this.page.locator('[data-testid="trend-row"]').all();
    const trends = {};
    
    for (const row of trendRows) {
      const month = await row.locator('[data-testid="trend-month"]').textContent();
      const amount = await row.locator('[data-testid="trend-amount"]').textContent().then(t => t.replace(/[^0-9,]/g, ''));
      trends[month] = amount;
    }
    
    return trends;
  }

  async getEmptyStateMessage(section) {
    const messageLocator = this.page.locator(`[data-testid="empty-state-${section}"]`);
    await messageLocator.waitFor({ state: 'visible' });
    return await messageLocator.textContent();
  }

  async setupSingleCard(cardId) {
    await this.page.evaluate((id) => {
      window.localStorage.setItem('userCards', JSON.stringify([{ cardId: id }]));
    }, cardId);
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardSwitcherState() {
    await this.cardSwitcher.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    
    const isVisible = await this.cardSwitcher.isVisible().catch(() => false);
    const isDisabled = isVisible ? await this.cardSwitcher.isDisabled() : false;
    
    return {
      isVisible,
      isDisabled,
      isHidden: !isVisible
    };
  }

  async getCardSwitcherMessage() {
    await this.switcherMessage.waitFor({ state: 'visible' });
    return await this.switcherMessage.textContent();
  }

  async getCardSelectionOptionsCount() {
    const options = await this.page.locator('[data-testid="card-selection-option"]').all();
    return options.length;
  }

  async simulateCardDeactivation(cardId) {
    await this.page.evaluate((id) => {
      window.localStorage.setItem('deactivatedCard', id);
      window.dispatchEvent(new CustomEvent('cardDeactivated', { detail: { cardId: id } }));
    }, cardId);
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async waitForCardListRefresh() {
    await this.page.waitForTimeout(1000);
    await this.waitForCardListLoad();
  }

  async getCardList() {
    await this.waitForCardListLoad();
    const cards = await this.cardItem.all();
    const cardIds = [];
    
    for (const card of cards) {
      const cardId = await card.getAttribute('data-card-id');
      cardIds.push(cardId);
    }
    
    return cardIds;
  }
};