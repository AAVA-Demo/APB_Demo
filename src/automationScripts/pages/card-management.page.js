const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('CardManagementPage');
    
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    this.cardDetailsContainer = page.locator('[data-testid="card-details-container"]');
    this.errorMessageContainer = page.locator('[data-testid="error-message"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    
    this.cardTypeField = page.locator('[data-testid="card-type"]');
    this.maskedCardNumberField = page.locator('[data-testid="masked-card-number"]');
    this.creditLimitField = page.locator('[data-testid="credit-limit"]');
    this.currentBalanceField = page.locator('[data-testid="current-balance"]');
    this.availableBalanceField = page.locator('[data-testid="available-balance"]');
    this.outstandingAmountField = page.locator('[data-testid="outstanding-amount"]');
    this.monthlySpendField = page.locator('[data-testid="monthly-spend"]');
    this.creditUtilizationField = page.locator('[data-testid="credit-utilization"]');
    this.utilizationStatusField = page.locator('[data-testid="utilization-status"]');
  }
  
  async navigate() {
    this.logger.info('Navigating to card management page');
    await this.page.goto('/cards');
  }
  
  async waitForCardListLoad() {
    this.logger.info('Waiting for card list to load');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    await expect(this.cardListContainer).toBeVisible();
  }
  
  async getCardCount() {
    const count = await this.cardItems.count();
    this.logger.info(`Card count: ${count}`);
    return count;
  }
  
  async getAllCards() {
    await expect(this.cardListContainer).toBeVisible();
    const cards = await this.page.evaluate(() => {
      return window.getAllCardsData();
    });
    return cards;
  }
  
  async selectCard(cardId) {
    this.logger.info(`Selecting card: ${cardId}`);
    await this.page.locator(`[data-card-id="${cardId}"]`).click();
  }
  
  async waitForCardDetailsLoad() {
    this.logger.info('Waiting for card details to load');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    await expect(this.cardDetailsContainer).toBeVisible();
  }
  
  async getCardType() {
    await expect(this.cardTypeField).toBeVisible();
    return await this.cardTypeField.textContent();
  }
  
  async getMaskedCardNumber() {
    await expect(this.maskedCardNumberField).toBeVisible();
    return await this.maskedCardNumberField.textContent();
  }
  
  async getCreditLimit() {
    await expect(this.creditLimitField).toBeVisible();
    const text = await this.creditLimitField.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getCurrentBalance() {
    await expect(this.currentBalanceField).toBeVisible();
    const text = await this.currentBalanceField.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getAvailableBalance() {
    await expect(this.availableBalanceField).toBeVisible();
    const text = await this.availableBalanceField.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getOutstandingAmount() {
    await expect(this.outstandingAmountField).toBeVisible();
    const text = await this.outstandingAmountField.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getMonthlySpend() {
    await expect(this.monthlySpendField).toBeVisible();
    const text = await this.monthlySpendField.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getCreditUtilization() {
    await expect(this.creditUtilizationField).toBeVisible();
    return await this.creditUtilizationField.textContent();
  }
  
  async getUtilizationStatus() {
    await expect(this.utilizationStatusField).toBeVisible();
    return await this.utilizationStatusField.getAttribute('data-status');
  }
  
  async getErrorMessage() {
    await expect(this.errorMessageContainer).toBeVisible();
    return await this.errorMessageContainer.textContent();
  }
  
  async isCardDataVisible() {
    return await this.cardDetailsContainer.isVisible();
  }
  
  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }
  
  async isListScrollable() {
    const isScrollable = await this.page.evaluate(() => {
      const container = document.querySelector('[data-testid="card-list-container"]');
      return container.scrollHeight > container.clientHeight;
    });
    return isScrollable;
  }
  
  async simulateTransaction(cardId, amount) {
    this.logger.info(`Simulating transaction: ${cardId} - ${amount}`);
    await this.page.evaluate(({ cardId, amount }) => {
      window.simulateTransaction(cardId, amount);
    }, { cardId, amount });
  }
  
  async refreshCardList() {
    this.logger.info('Refreshing card list');
    await this.page.reload();
    await this.waitForCardListLoad();
  }
};
