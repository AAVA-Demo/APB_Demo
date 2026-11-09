const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h1:has-text("Dashboard")');
    this.cardListContainer = page.locator('.card-list-container');
    this.cardItems = page.locator('.card-item');
    this.errorMessage = page.locator('.error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.noCardsMessage = page.locator('.no-cards-message');
    this.addCardButton = page.locator('button:has-text("Add Card")');
    
    // KPI locators
    this.monthlySpendKPI = page.locator('[data-kpi="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-kpi="total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-kpi="available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-kpi="outstanding-amount"]');
    this.utilizationRateKPI = page.locator('[data-kpi="utilization-rate"]');
  }

  async navigateToCardManagement() {
    await expect(this.cardListContainer).toBeVisible();
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getCardByName(cardName) {
    return this.page.locator(`.card-item:has-text("${cardName}")`);
  }

  async getCardCreditLimit(cardName) {
    const card = await this.getCardByName(cardName);
    const limitText = await card.locator('[data-field="credit-limit"]').textContent();
    return parseFloat(limitText.replace(/[^0-9.]/g, ''));
  }

  async getCardAvailableCredit(cardName) {
    const card = await this.getCardByName(cardName);
    const availableText = await card.locator('[data-field="available-credit"]').textContent();
    return parseFloat(availableText.replace(/[^0-9.]/g, ''));
  }

  async getCardOutstandingBalance(cardName) {
    const card = await this.getCardByName(cardName);
    const outstandingText = await card.locator('[data-field="outstanding-balance"]').textContent();
    return parseFloat(outstandingText.replace(/[^0-9.]/g, ''));
  }

  async isLayoutResponsive() {
    const containerWidth = await this.cardListContainer.evaluate(el => el.offsetWidth);
    return containerWidth > 0 && containerWidth <= 768;
  }

  async isMobileLayout() {
    const firstCard = this.cardItems.first();
    const cardWidth = await firstCard.evaluate(el => el.offsetWidth);
    const containerWidth = await this.cardListContainer.evaluate(el => el.offsetWidth);
    return cardWidth >= containerWidth * 0.9;
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardHeader).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendKPI() {
    const text = await this.monthlySpendKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalCreditLimitKPI() {
    const text = await this.totalCreditLimitKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getAvailableCreditKPI() {
    const text = await this.availableCreditKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getOutstandingAmountKPI() {
    const text = await this.outstandingAmountKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getUtilizationRate() {
    const text = await this.utilizationRateKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getNoCardsMessage() {
    return await this.noCardsMessage.textContent();
  }
};
