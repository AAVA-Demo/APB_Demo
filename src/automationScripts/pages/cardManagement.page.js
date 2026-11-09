const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Locators for card management elements
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardItem = page.locator('[data-testid="card-item"]');
    this.cardMaskedNumber = page.locator('[data-testid="card-masked-number"]');
    this.cardBalance = page.locator('[data-testid="card-balance"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    
    // Card details modal/view locators
    this.cardDetailsModal = page.locator('[data-testid="card-details-modal"]');
    this.cardDetailsCreditLimit = page.locator('[data-testid="card-details-credit-limit"]');
    this.cardDetailsCurrentBalance = page.locator('[data-testid="card-details-current-balance"]');
    this.cardDetailsAvailableCredit = page.locator('[data-testid="card-details-available-credit"]');
    
    // Error and message locators
    this.errorMessageContainer = page.locator('[data-testid="error-message"]');
    this.cardDetailsError = page.locator('[data-testid="card-details-error"]');
    this.timeoutError = page.locator('[data-testid="timeout-error"]');
    
    // Authentication elements
    this.usernameInput = page.locator('#username');
    this.authTokenInput = page.locator('#auth-token');
    this.loginButton = page.locator('[data-testid="login-button"]');
  }

  async authenticateUser(userId, authToken) {
    logger.info(`Authenticating user: ${userId}`);
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
    
    await this.usernameInput.fill(userId);
    await this.authTokenInput.fill(authToken);
    await this.loginButton.click();
    
    await this.page.waitForURL(/.*cards|dashboard/, { timeout: 5000 });
    logger.info('User authentication completed successfully');
  }

  async navigateToCardManagement() {
    logger.info('Navigating to card management page');
    await this.page.goto('/cards');
    await expect(this.cardListContainer).toBeVisible({ timeout: 10000 });
    logger.info('Card management page loaded');
  }

  async waitForCardListLoad(options = {}) {
    logger.info('Waiting for card list to load');
    const timeout = options.timeout || 5000;
    await this.cardListContainer.waitFor({ state: 'visible', timeout });
    await this.cardItem.first().waitFor({ state: 'visible', timeout });
    logger.info('Card list loaded successfully');
  }

  async getCardCount() {
    logger.info('Counting displayed cards');
    const count = await this.cardItem.count();
    logger.info(`Total cards displayed: ${count}`);
    return count;
  }

  async getAllCards() {
    logger.info('Retrieving all card data');
    const cardCount = await this.getCardCount();
    const cards = [];
    
    for (let i = 0; i < cardCount; i++) {
      const cardElement = this.cardItem.nth(i);
      const maskedNumber = await cardElement.locator('[data-testid="card-masked-number"]').textContent();
      const balanceText = await cardElement.locator('[data-testid="card-balance"]').textContent();
      const limitText = await cardElement.locator('[data-testid="card-credit-limit"]').textContent();
      
      cards.push({
        maskedNumber: maskedNumber.trim(),
        balance: parseFloat(balanceText.replace(/[^0-9.]/g, '')),
        creditLimit: parseFloat(limitText.replace(/[^0-9.]/g, ''))
      });
    }
    
    logger.info(`Retrieved data for ${cards.length} cards`);
    return cards;
  }

  async selectCard(cardId) {
    logger.info(`Selecting card: ${cardId}`);
    const cardSelector = `[data-card-id="${cardId}"]`;
    await this.page.locator(cardSelector).click();
    logger.info(`Card ${cardId} selected`);
  }

  async waitForCardDetailsLoad(options = {}) {
    logger.info('Waiting for card details to load');
    const timeout = options.timeout || 5000;
    await this.cardDetailsModal.waitFor({ state: 'visible', timeout });
    await this.cardDetailsCreditLimit.waitFor({ state: 'visible', timeout });
    logger.info('Card details loaded successfully');
  }

  async getCardDetails() {
    logger.info('Retrieving card details');
    
    const creditLimitText = await this.cardDetailsCreditLimit.textContent();
    const currentBalanceText = await this.cardDetailsCurrentBalance.textContent();
    const availableCreditText = await this.cardDetailsAvailableCredit.textContent();
    
    const cardDetails = {
      creditLimit: parseFloat(creditLimitText.replace(/[^0-9.]/g, '')),
      currentBalance: parseFloat(currentBalanceText.replace(/[^0-9.]/g, '')),
      availableCredit: parseFloat(availableCreditText.replace(/[^0-9.]/g, ''))
    };
    
    logger.info(`Card details retrieved: ${JSON.stringify(cardDetails)}`);
    return cardDetails;
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessageContainer).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessageContainer.textContent();
    logger.info(`Error message: ${errorText}`);
    return errorText;
  }

  async getCardDetailsError() {
    logger.info('Retrieving card details error');
    await expect(this.cardDetailsError).toBeVisible({ timeout: 5000 });
    const errorText = await this.cardDetailsError.textContent();
    logger.info(`Card details error: ${errorText}`);
    return errorText;
  }

  async getTimeoutError() {
    logger.info('Retrieving timeout error');
    await expect(this.timeoutError).toBeVisible({ timeout: 5000 });
    const errorText = await this.timeoutError.textContent();
    logger.info(`Timeout error: ${errorText}`);
    return errorText;
  }

  async hasUnmaskedCardNumbers() {
    logger.info('Checking for unmasked card numbers');
    
    const cardCount = await this.getCardCount();
    for (let i = 0; i < cardCount; i++) {
      const maskedNumber = await this.cardItem.nth(i).locator('[data-testid="card-masked-number"]').textContent();
      
      // Check if card number is properly masked (should contain asterisks)
      if (!maskedNumber.includes('*')) {
        logger.warn(`Unmasked card number detected: ${maskedNumber}`);
        return true;
      }
    }
    
    logger.info('All card numbers are properly masked');
    return false;
  }
};