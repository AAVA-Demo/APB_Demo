const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card Selection Locators
    this.cardSelector = page.locator('[data-testid="card-selector"]');
    
    // Card Detail Locators
    this.cardDetailView = page.locator('[data-testid="card-detail-view"]');
    this.cardSpending = page.locator('[data-testid="card-spending"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardAvailableCredit = page.locator('[data-testid="card-available-credit"]');
    this.cardOutstanding = page.locator('[data-testid="card-outstanding"]');
    
    // Comparison Locators
    this.comparisonChart = page.locator('[data-testid="comparison-chart"]');
    this.highlightedCard = page.locator('[data-testid="highlighted-card"]');
    
    // Loading State
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/cards');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    logger.info('Navigated to Card Management');
  }

  async selectCard(cardId) {
    await this.page.click(`[data-testid="card-option-${cardId}"]`);
    await expect(this.cardDetailView).toBeVisible({ timeout: 2000 });
    logger.info(`Selected card: ${cardId}`);
  }

  async getCardDetails() {
    await expect(this.cardDetailView).toBeVisible();
    
    const spending = await this.cardSpending.textContent();
    const creditLimit = await this.cardCreditLimit.textContent();
    const availableCredit = await this.cardAvailableCredit.textContent();
    const outstandingAmount = await this.cardOutstanding.textContent();
    
    logger.info('Card details retrieved');
    return { spending, creditLimit, availableCredit, outstandingAmount };
  }

  async getCreditLimit() {
    await expect(this.cardCreditLimit).toBeVisible();
    const limit = await this.cardCreditLimit.textContent();
    logger.info(`Credit limit: ${limit}`);
    return limit;
  }

  async getDisplayedCardId() {
    await expect(this.cardDetailView).toBeVisible();
    const cardId = await this.page.locator('[data-testid="displayed-card-id"]').textContent();
    logger.info(`Displayed card ID: ${cardId}`);
    return cardId;
  }

  async navigateToCardComparison() {
    await this.page.click('[data-testid="nav-card-comparison"]');
    await expect(this.comparisonChart).toBeVisible();
    logger.info('Navigated to Card Comparison');
  }

  async getHighestUsageCard() {
    await expect(this.comparisonChart).toBeVisible();
    const highestCard = await this.highlightedCard.textContent();
    logger.info(`Highest usage card: ${highestCard}`);
    return highestCard;
  }
};