const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardDetailsPage = class CardDetailsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.cardTile = (maskedNumber) => page.locator(`[data-card-number="${maskedNumber}"], .card-tile:has-text("${maskedNumber}")`);
    this.creditLimitField = page.locator('[data-testid="credit-limit"], .credit-limit-value');
    this.outstandingBalanceField = page.locator('[data-testid="outstanding-balance"], .outstanding-value');
    this.availableCreditField = page.locator('[data-testid="available-credit"], .available-credit-value');
    this.cardStatusField = page.locator('[data-testid="card-status"], .card-status');
    this.statusBadge = page.locator('[data-testid="status-badge"], .status-badge');
    this.expiryDateField = page.locator('[data-testid="expiry-date"], .expiry-date');
    this.cardholderNameField = page.locator('[data-testid="cardholder-name"], .cardholder-name');
    this.maskedCardNumberField = page.locator('[data-testid="masked-number"], .masked-card-number');
    this.authErrorMessage = page.locator('[data-testid="auth-error"], .authorization-error');
    this.cardDetailsContainer = page.locator('[data-testid="card-details"], .card-details-container');
  }

  async clickCardByMaskedNumber(maskedNumber) {
    logger.info(`Clicking card with masked number: ${maskedNumber}`);
    await this.cardTile(maskedNumber).click();
  }

  async waitForDetailsPageLoad() {
    logger.info('Waiting for card details page to load');
    await this.cardDetailsContainer.waitFor({ state: 'visible', timeout: 1000 });
  }

  async getCreditLimit() {
    logger.info('Getting credit limit');
    const text = await this.creditLimitField.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getOutstandingBalance() {
    logger.info('Getting outstanding balance');
    const text = await this.outstandingBalanceField.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getAvailableCredit() {
    logger.info('Getting available credit');
    const text = await this.availableCreditField.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getCardStatus() {
    logger.info('Getting card status');
    const text = await this.cardStatusField.textContent();
    return text.trim();
  }

  async getStatusBadgeColor() {
    logger.info('Getting status badge color');
    const classList = await this.statusBadge.getAttribute('class');
    return classList;
  }

  async getExpiryDate() {
    logger.info('Getting expiry date');
    const text = await this.expiryDateField.textContent();
    return text.trim();
  }

  async getCardholderName() {
    logger.info('Getting cardholder name');
    const text = await this.cardholderNameField.textContent();
    return text.trim();
  }

  async getMaskedCardNumber() {
    logger.info('Getting masked card number');
    const text = await this.maskedCardNumberField.textContent();
    return text.trim();
  }

  async getAuthorizationErrorMessage() {
    logger.info('Getting authorization error message');
    await this.authErrorMessage.waitFor({ state: 'visible', timeout: 3000 });
    return await this.authErrorMessage.textContent();
  }

  async isCardDetailsVisible() {
    logger.info('Checking if card details are visible');
    try {
      await this.cardDetailsContainer.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
};
