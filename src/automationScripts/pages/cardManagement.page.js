const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Container Locators
    this.cardListContainer = page.locator('.card-list, .cards-container');
    this.portfolioSummary = page.locator('.portfolio-summary');
    
    // Card Locators
    this.cardItems = page.locator('.card-item, .credit-card');
    
    // Sort and Filter Locators
    this.sortBySpendButton = page.locator('button:has-text("Sort by Spend"), button:has-text("Sort by Card Spend")');
    this.sortByTypeButton = page.locator('button:has-text("Sort by Type")');
    this.sortByLimitButton = page.locator('button:has-text("Sort by Limit")');
    
    // Error and Status Locators
    this.sessionExpiredError = page.locator('.session-expired, .alert:has-text("Session expired")');
    this.errorIndicator = page.locator('.error-indicator, .warning-icon');
    this.warningMessage = page.locator('.warning-message, .alert-warning');
    this.noSpendingDataMessage = page.locator('.no-spending-data');
  }

  async navigate() {
    await this.page.goto('/cards');
    await expect(this.page).toHaveURL(/.*cards/);
    logger.info('Navigated to card management page');
  }

  async waitForCardsLoad(timeout = 1000) {
    await expect(this.cardListContainer).toBeVisible({ timeout });
    await expect(this.cardItems.first()).toBeVisible({ timeout });
    logger.info('Cards loaded successfully');
  }

  async getAllCards() {
    await expect(this.cardItems.first()).toBeVisible();
    const cards = await this.cardItems.all();
    logger.info(`Found ${cards.length} cards`);
    return cards;
  }

  async getCardByNumber(lastFourDigits) {
    const cardLocator = this.page.locator(`.card-item:has-text("${lastFourDigits}"), .credit-card:has-text("${lastFourDigits}")`);
    return cardLocator;
  }

  async getCardSpend(lastFourDigits) {
    const card = await this.getCardByNumber(lastFourDigits);
    await expect(card).toBeVisible();
    const spendElement = card.locator('.card-spend, .card-wise-spend');
    await expect(spendElement).toBeVisible();
    const spendText = await spendElement.textContent();
    logger.info(`Card ${lastFourDigits} spend: ${spendText}`);
    return spendText.trim();
  }

  async getCardUtilization(lastFourDigits) {
    const card = await this.getCardByNumber(lastFourDigits);
    await expect(card).toBeVisible();
    const utilizationElement = card.locator('.utilization, .utilization-percentage');
    await expect(utilizationElement).toBeVisible();
    const utilizationText = await utilizationElement.textContent();
    logger.info(`Card ${lastFourDigits} utilization: ${utilizationText}`);
    return utilizationText.trim();
  }

  async getTotalOutstanding() {
    await expect(this.portfolioSummary).toBeVisible();
    const outstandingElement = this.portfolioSummary.locator('.total-outstanding, [data-testid="total-outstanding"]');
    await expect(outstandingElement).toBeVisible();
    const text = await outstandingElement.textContent();
    logger.info(`Total Outstanding: ${text}`);
    return text.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.portfolioSummary).toBeVisible();
    const limitElement = this.portfolioSummary.locator('.total-credit-limit, [data-testid="total-credit-limit"]');
    await expect(limitElement).toBeVisible();
    const text = await limitElement.textContent();
    logger.info(`Total Credit Limit: ${text}`);
    return text.trim();
  }

  async getTotalAvailable() {
    await expect(this.portfolioSummary).toBeVisible();
    const availableElement = this.portfolioSummary.locator('.total-available, [data-testid="total-available"]');
    await expect(availableElement).toBeVisible();
    const text = await availableElement.textContent();
    logger.info(`Total Available: ${text}`);
    return text.trim();
  }

  async getCardsWithZeroSpend() {
    const cards = await this.getAllCards();
    const zeroSpendCards = [];
    
    for (const card of cards) {
      const spendElement = card.locator('.card-spend, .card-wise-spend');
      const spendText = await spendElement.textContent();
      const spendValue = parseFloat(spendText.replace(/[^0-9.]/g, ''));
      
      if (spendValue === 0) {
        const cardNumberElement = card.locator('.card-number');
        const cardNumber = await cardNumberElement.textContent();
        const lastFour = cardNumber.slice(-4);
        zeroSpendCards.push(lastFour);
      }
    }
    
    logger.info(`Found ${zeroSpendCards.length} cards with zero spend`);
    return zeroSpendCards;
  }

  async getCardsWithSpend() {
    const cards = await this.getAllCards();
    const cardsWithSpend = [];
    
    for (const card of cards) {
      const spendElement = card.locator('.card-spend, .card-wise-spend');
      const spendText = await spendElement.textContent();
      const spendValue = parseFloat(spendText.replace(/[^0-9.]/g, ''));
      
      if (spendValue > 0) {
        const cardNumberElement = card.locator('.card-number');
        const cardNumber = await cardNumberElement.textContent();
        const lastFour = cardNumber.slice(-4);
        cardsWithSpend.push(lastFour);
      }
    }
    
    logger.info(`Found ${cardsWithSpend.length} cards with spending data`);
    return cardsWithSpend;
  }

  async getNoSpendingDataMessage(lastFourDigits) {
    const card = await this.getCardByNumber(lastFourDigits);
    await expect(card).toBeVisible();
    const messageElement = card.locator('.no-spending-data, .no-data-message');
    await expect(messageElement).toBeVisible();
    const message = await messageElement.textContent();
    logger.info(`No spending data message for card ${lastFourDigits}: ${message}`);
    return message.trim();
  }

  async clickSortBySpend() {
    await expect(this.sortBySpendButton).toBeVisible();
    await this.sortBySpendButton.click();
    logger.info('Clicked Sort by Spend button');
  }

  async getCardOrder() {
    const cards = await this.getAllCards();
    const order = [];
    
    for (const card of cards) {
      const cardNumberElement = card.locator('.card-number');
      const cardNumber = await cardNumberElement.textContent();
      const lastFour = cardNumber.slice(-4);
      order.push(lastFour);
    }
    
    logger.info(`Current card order: ${order.join(', ')}`);
    return order;
  }
};
