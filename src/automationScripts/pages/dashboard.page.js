const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.totalMonthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-credit-limit"]');
    this.totalAvailableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.totalOutstandingKPI = page.locator('[data-testid="kpi-outstanding"]');
    
    // Card Details Locators
    this.cardList = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    
    // No Cards State
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.addCardButton = page.locator('[data-testid="add-card-button"]');
    
    // Real-time Update Indicators
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    this.warningIndicator = page.locator('[data-testid="warning-indicator"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
    this.liveIndicator = page.locator('[data-testid="live-indicator"]');
    
    // Data Integrity
    this.cardErrorIndicator = page.locator('.card-error-indicator');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.totalMonthlySpendKPI.or(this.noCardsMessage)).toBeVisible({ timeout: 10000 });
  }

  getCardCreditLimit(cardName) {
    return this.page.locator(`[data-card="${cardName}"] [data-field="credit-limit"]`);
  }

  getCardAvailableCredit(cardName) {
    return this.page.locator(`[data-card="${cardName}"] [data-field="available-credit"]`);
  }

  getCardOutstanding(cardName) {
    return this.page.locator(`[data-card="${cardName}"] [data-field="outstanding"]`);
  }

  getCardMonthlySpend(cardName) {
    return this.page.locator(`[data-card="${cardName}"] [data-field="monthly-spend"]`);
  }

  async getCardBalances(cardName) {
    const available = await this.getCardAvailableCredit(cardName).textContent();
    const outstanding = await this.getCardOutstanding(cardName).textContent();
    return { available, outstanding };
  }

  async validateCardDataIntegrity(cardName) {
    const creditLimit = await this.getCardCreditLimit(cardName).textContent();
    const available = await this.getCardAvailableCredit(cardName).textContent();
    const outstanding = await this.getCardOutstanding(cardName).textContent();
    
    // Parse currency values
    const parseAmount = (text) => parseFloat(text.replace(/[₹,]/g, ''));
    
    const limit = parseAmount(creditLimit);
    const avail = parseAmount(available);
    const outst = parseAmount(outstanding);
    
    // Validate: Available + Outstanding = Credit Limit
    return Math.abs((avail + outst) - limit) < 1;
  }
};