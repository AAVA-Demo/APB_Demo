const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Locators for portfolio elements
    this.portfolioContainer = page.locator('.portfolio-container, #portfolio');
    this.cardList = page.locator('.card-list, .credit-cards-list');
    this.cardItem = page.locator('.card-item, .credit-card-item');
    
    // Locators for aggregated metrics
    this.totalCreditLimitDisplay = page.locator('[data-testid="total-credit-limit"]');
    this.totalAvailableCreditDisplay = page.locator('[data-testid="total-available-credit"]');
    this.totalOutstandingDisplay = page.locator('[data-testid="total-outstanding"]');
    
    // Locators for messages
    this.infoMessage = page.locator('.info-message, .alert-info');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.warningMessage = page.locator('.warning-message, .alert-warning');
    
    // Locators for loading
    this.loadingIndicator = page.locator('.loading-spinner, .loading-indicator');
  }

  async navigate() {
    logger.info('Navigating to portfolio page');
    await this.page.goto('/portfolio');
  }

  async waitForPortfolioLoad() {
    logger.info('Waiting for portfolio to load');
    await this.portfolioContainer.waitFor({ state: 'visible', timeout: 5000 });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      logger.info('No loading indicator found or already hidden');
    });
  }

  async getCardCount() {
    logger.info('Getting card count');
    const count = await this.cardItem.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async getAllCardDetails() {
    logger.info('Getting all card details');
    const cards = [];
    const count = await this.cardItem.count();
    
    for (let i = 0; i < count; i++) {
      const card = this.cardItem.nth(i);
      const cardNumber = await card.locator('[data-testid="card-number"]').textContent();
      const cardType = await card.locator('[data-testid="card-type"]').textContent();
      const issuer = await card.locator('[data-testid="card-issuer"]').textContent();
      const creditLimit = await card.locator('[data-testid="credit-limit"]').textContent();
      const outstandingBalance = await card.locator('[data-testid="outstanding-balance"]').textContent();
      
      cards.push({
        cardNumber: cardNumber.trim(),
        cardType: cardType.trim(),
        issuer: issuer.trim(),
        creditLimit: creditLimit.trim(),
        outstandingBalance: outstandingBalance.trim(),
        cardName: `${cardType.trim()} ${cardNumber.trim()}`
      });
    }
    
    logger.info(`Retrieved ${cards.length} card details`);
    return cards;
  }

  async getAggregatedMetrics() {
    logger.info('Getting aggregated metrics');
    const totalCreditLimit = await this.totalCreditLimitDisplay.textContent();
    const totalAvailableCredit = await this.totalAvailableCreditDisplay.textContent();
    const totalOutstandingAmount = await this.totalOutstandingDisplay.textContent();
    
    return {
      totalCreditLimit: totalCreditLimit.trim(),
      totalAvailableCredit: totalAvailableCredit.trim(),
      totalOutstandingAmount: totalOutstandingAmount.trim()
    };
  }

  async getTotalCreditLimit() {
    logger.info('Getting total credit limit');
    const text = await this.totalCreditLimitDisplay.textContent();
    return text.trim();
  }

  async getInfoMessage() {
    logger.info('Getting info message');
    await expect(this.infoMessage).toBeVisible();
    return this.infoMessage;
  }

  async getErrorMessage() {
    logger.info('Getting error message');
    await expect(this.errorMessage).toBeVisible();
    return this.errorMessage;
  }

  async getWarningMessage() {
    logger.info('Getting warning message');
    await expect(this.warningMessage).toBeVisible();
    return this.warningMessage;
  }

  async setupUserWithCards(cardCount) {
    logger.info(`Setting up user with ${cardCount} cards`);
    await this.page.evaluate((count) => {
      window.mockUserCards = Array.from({ length: count }, (_, i) => ({
        id: `card-${i + 1}`,
        cardNumber: `****${1000 + i}`,
        cardType: ['Visa', 'Mastercard', 'Amex'][i % 3],
        issuer: ['Bank A', 'Bank B', 'Bank C'][i % 3],
        creditLimit: 5000 + (i * 1000),
        outstandingBalance: 1000 + (i * 500)
      }));
    }, cardCount);
  }

  async setupCreditCards(cards) {
    logger.info(`Setting up credit cards: ${JSON.stringify(cards)}`);
    await this.page.evaluate((cards) => {
      window.mockCreditCards = cards.map((card, index) => ({
        id: `card-${index + 1}`,
        cardNumber: `****${1000 + index}`,
        cardType: card.type || 'Visa',
        issuer: 'Bank A',
        creditLimit: card.limit || 0,
        outstandingBalance: card.outstanding || 0,
        status: card.status || 'ACTIVE'
      }));
    }, cards);
  }
};