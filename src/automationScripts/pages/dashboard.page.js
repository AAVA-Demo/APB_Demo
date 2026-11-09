const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.totalOutstandingKPI = page.locator('[data-testid="kpi-total-outstanding"]');
    
    // Credit Cards Section
    this.creditCardsSection = page.locator('[data-testid="credit-cards-section"]');
    this.cardTiles = page.locator('[data-testid="card-tile"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    
    // Error Handling
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    // Card Details
    this.cardName = page.locator('[data-testid="card-name"]');
    this.cardNumber = page.locator('[data-testid="card-number"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardOutstanding = page.locator('[data-testid="card-outstanding"]');
    this.cardAvailable = page.locator('[data-testid="card-available"]');
    this.cardWarningIndicator = page.locator('[data-testid="card-warning"]');
  }
  
  async navigate() {
    await this.page.goto('https://creditcard.example.com');
  }
  
  async waitForKPIsToLoad() {
    await this.monthlySpendKPI.waitFor({ state: 'visible', timeout: 5000 });
    await this.totalCreditLimitKPI.waitFor({ state: 'visible' });
    await this.availableCreditKPI.waitFor({ state: 'visible' });
    await this.totalOutstandingKPI.waitFor({ state: 'visible' });
  }
  
  async getMonthlySpendValue() {
    return await this.monthlySpendKPI.textContent();
  }
  
  async getTotalCreditLimitValue() {
    return await this.totalCreditLimitKPI.textContent();
  }
  
  async getAvailableCreditValue() {
    return await this.availableCreditKPI.textContent();
  }
  
  async getTotalOutstandingValue() {
    return await this.totalOutstandingKPI.textContent();
  }
  
  async clickRetryButton() {
    await this.retryButton.click();
  }
  
  async getCardCount() {
    return await this.cardTiles.count();
  }
  
  async getAllCardDetails() {
    const count = await this.getCardCount();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const card = this.cardTiles.nth(i);
      cards.push({
        element: card,
        name: await card.locator('[data-testid="card-name"]').textContent(),
        number: await card.locator('[data-testid="card-number"]').textContent(),
        creditLimit: await card.locator('[data-testid="card-credit-limit"]').textContent(),
        outstanding: await card.locator('[data-testid="card-outstanding"]').textContent(),
        available: await card.locator('[data-testid="card-available"]').textContent()
      });
    }
    
    return cards;
  }
  
  async getGridColumnCount() {
    const gridContainer = this.creditCardsSection;
    const gridTemplateColumns = await gridContainer.evaluate(el => 
      window.getComputedStyle(el).gridTemplateColumns
    );
    return gridTemplateColumns.split(' ').length;
  }
  
  async isVerticallyScrollable() {
    return await this.page.evaluate(() => {
      return document.documentElement.scrollHeight > window.innerHeight;
    });
  }
  
  async verifyTouchTargetSize(minSize) {
    const cards = await this.cardTiles.all();
    
    for (const card of cards) {
      const box = await card.boundingBox();
      if (box.height < minSize || box.width < minSize) {
        return false;
      }
    }
    
    return true;
  }
  
  async getOverLimitCard() {
    const cards = await this.getAllCardDetails();
    
    for (const card of cards) {
      const available = card.available;
      if (available.includes('-$')) {
        return card;
      }
    }
    
    return null;
  }
  
  async getNormalCards() {
    const allCards = await this.cardTiles.all();
    const normalCards = [];
    
    for (const card of allCards) {
      const available = await card.locator('[data-testid="card-available"]').textContent();
      if (!available.includes('-$')) {
        normalCards.push(card);
      }
    }
    
    return normalCards;
  }
  
  async cardHasWarningIndicator(cardElement) {
    const warning = cardElement.locator('[data-testid="card-warning"]');
    return await warning.isVisible().catch(() => false);
  }
};
