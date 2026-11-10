const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend") .value');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit") .value');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit") .value');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount") .value');
    
    // Credit Card Locators
    this.cardTiles = page.locator('.card-tile, [data-testid="credit-card-tile"]');
    this.cardGridContainer = page.locator('.card-grid, .credit-cards-container, [data-testid="cards-grid"]');
    
    // Message Locators
    this.noCardsMessage = page.locator('.no-cards-message, .empty-state:has-text("No credit cards")').first();
    this.errorMessage = page.locator('.error-message, .alert-danger').first();
    this.serviceErrorMessage = page.locator('.service-error, .error-message:has-text("Unable to retrieve")').first();
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.monthlySpendKPI.or(this.noCardsMessage)).toBeVisible({ timeout: 10000 });
  }

  async getMonthlySpendKPI() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitKPI() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditKPI() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountKPI() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getServiceErrorMessageText() {
    await expect(this.serviceErrorMessage).toBeVisible();
    return await this.serviceErrorMessage.textContent();
  }

  async getCardTilesCount() {
    return await this.cardTiles.count();
  }

  async getAllCardDetails() {
    const count = await this.cardTiles.count();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const card = this.cardTiles.nth(i);
      const name = await card.locator('h4, .card-name').textContent();
      const last4Digits = await card.locator('.last4, [data-testid="last4-digits"]').textContent();
      const outstanding = await card.locator('.outstanding, [data-testid="outstanding-amount"]').textContent();
      const creditLimit = await card.locator('.credit-limit, [data-testid="credit-limit"]').textContent();
      const utilization = await card.locator('.utilization, [data-testid="utilization-percentage"]').textContent();
      
      cards.push({
        name: name.trim(),
        last4Digits: last4Digits.replace(/[^0-9]/g, ''),
        outstanding: outstanding.trim(),
        creditLimit: creditLimit.trim(),
        utilization: utilization.trim()
      });
    }
    
    return cards;
  }

  async getCardDetailsByIndex(index) {
    const card = this.cardTiles.nth(index);
    await expect(card).toBeVisible();
    
    const name = await card.locator('h4, .card-name').textContent();
    const last4Digits = await card.locator('.last4, [data-testid="last4-digits"]').textContent();
    const outstanding = await card.locator('.outstanding, [data-testid="outstanding-amount"]').textContent();
    const creditLimit = await card.locator('.credit-limit, [data-testid="credit-limit"]').textContent();
    const utilization = await card.locator('.utilization, [data-testid="utilization-percentage"]').textContent();
    
    return {
      name: name.trim(),
      last4Digits: last4Digits.replace(/[^0-9]/g, ''),
      outstanding: outstanding.trim(),
      creditLimit: creditLimit.trim(),
      utilization: utilization.trim()
    };
  }
};