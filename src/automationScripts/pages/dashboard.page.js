const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Card Locators
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('[data-testid="card-item"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.addCardButton = page.locator('[data-testid="add-card-button"]');
    
    // Add Card Form Locators
    this.cardNumberInput = page.locator('[data-testid="card-number-input"]');
    this.cardNameInput = page.locator('[data-testid="card-name-input"]');
    this.cardExpiryInput = page.locator('[data-testid="card-expiry-input"]');
    
    // Warning/Notification Locators
    this.warningNotification = page.locator('[data-testid="warning-notification"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await expect(this.cardList).toBeVisible();
    return await this.cardItem.count();
  }

  async getAllCardDetails() {
    const cards = [];
    const count = await this.cardItem.count();
    
    for (let i = 0; i < count; i++) {
      const card = this.cardItem.nth(i);
      const cardId = await card.getAttribute('data-card-id');
      const limit = parseFloat(await card.locator('[data-testid="card-limit"]').textContent());
      const balance = parseFloat(await card.locator('[data-testid="card-balance"]').textContent());
      const available = parseFloat(await card.locator('[data-testid="card-available"]').textContent());
      
      cards.push({ cardId, limit, balance, available });
    }
    
    return cards;
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getCardAvailableCredit(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    const text = await card.locator('[data-testid="card-available"]').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getCardCreditLimit(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    const text = await card.locator('[data-testid="card-limit"]').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getCardStatus(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    return await card.locator('[data-testid="card-status"]').textContent();
  }

  async simulatePurchase(cardId, amount, merchant) {
    // This method simulates a purchase via API or test data injection
    await this.page.evaluate(({ cardId, amount, merchant }) => {
      window.testAPI.simulatePurchase(cardId, amount, merchant);
    }, { cardId, amount, merchant });
  }

  async refreshDashboard() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};