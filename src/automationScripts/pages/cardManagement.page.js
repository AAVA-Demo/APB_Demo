const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    
    // Card Details
    this.cardDetailView = page.locator('[data-testid="card-detail-view"]');
    this.cardSpendingBreakdown = page.locator('[data-testid="card-spending-breakdown"]');
    
    // Messages
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.noSpendingDataMessage = page.locator('[data-testid="no-spending-data"]');
    this.dataIntegrityError = page.locator('[data-testid="data-integrity-error"]');
    
    // Buttons and Links
    this.addNewCardButton = page.locator('button:has-text("Add New Card")');
    this.contactSupportLink = page.locator('a:has-text("Contact Support")');
    this.compareButton = page.locator('button:has-text("Compare")');
  }

  async navigate() {
    logger.info('Navigating to Card Management page');
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
    logger.info('Card Management page loaded');
  }

  async getCardCount() {
    await expect(this.cardItems.first()).toBeVisible();
    const count = await this.cardItems.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async verifyMaskedCardNumbers() {
    logger.info('Verifying masked card numbers');
    const cards = await this.cardItems.all();
    for (const card of cards) {
      const cardNumber = await card.locator('[data-testid="card-number"]').textContent();
      await expect(cardNumber).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}/);
    }
    logger.info('All card numbers properly masked');
  }

  async verifyCardTypes(expectedTypes) {
    logger.info('Verifying card types');
    const cards = await this.cardItems.all();
    for (const card of cards) {
      const cardType = await card.locator('[data-testid="card-type"]').textContent();
      await expect(expectedTypes).toContain(cardType.trim());
    }
    logger.info('Card types verified');
  }

  async verifyIssuers(expectedIssuers) {
    logger.info('Verifying card issuers');
    const cards = await this.cardItems.all();
    for (const card of cards) {
      const issuer = await card.locator('[data-testid="card-issuer"]').textContent();
      await expect(expectedIssuers).toContain(issuer.trim());
    }
    logger.info('Card issuers verified');
  }

  async verifyCreditLimits(expectedLimits) {
    logger.info('Verifying credit limits');
    const cards = await this.cardItems.all();
    const limits = [];
    for (const card of cards) {
      const limit = await card.locator('[data-testid="credit-limit"]').textContent();
      limits.push(limit.trim());
    }
    for (const expectedLimit of expectedLimits) {
      await expect(limits).toContain(expectedLimit);
    }
    logger.info('Credit limits verified');
  }

  async verifyAvailableCreditDisplayed() {
    logger.info('Verifying available credit displayed');
    const cards = await this.cardItems.all();
    for (const card of cards) {
      await expect(card.locator('[data-testid="available-credit"]')).toBeVisible();
    }
    logger.info('Available credit displayed for all cards');
  }

  async verifyOutstandingAmountsDisplayed() {
    logger.info('Verifying outstanding amounts displayed');
    const cards = await this.cardItems.all();
    for (const card of cards) {
      await expect(card.locator('[data-testid="outstanding-amount"]')).toBeVisible();
    }
    logger.info('Outstanding amounts displayed for all cards');
  }

  async verifyExpiryDateFormat() {
    logger.info('Verifying expiry date format');
    const cards = await this.cardItems.all();
    for (const card of cards) {
      const expiryDate = await card.locator('[data-testid="expiry-date"]').textContent();
      await expect(expiryDate).toMatch(/\d{2}\/\d{4}/);
    }
    logger.info('Expiry dates in MM/YYYY format verified');
  }

  async scrollThroughCards() {
    logger.info('Scrolling through card list');
    const lastCard = this.cardItems.last();
    await lastCard.scrollIntoViewIfNeeded();
    await expect(lastCard).toBeVisible();
    logger.info('Scrolled to last card successfully');
  }

  async expandCardDetails(index) {
    logger.info(`Expanding card details at index ${index}`);
    const card = this.cardItems.nth(index);
    await card.click();
    await expect(this.cardDetailView).toBeVisible();
    logger.info('Card details expanded');
  }

  async selectCardsForComparison(indices) {
    logger.info('Selecting cards for comparison');
    for (const index of indices) {
      const checkbox = this.cardItems.nth(index).locator('input[type="checkbox"]');
      await checkbox.check();
    }
    logger.info(`${indices.length} cards selected for comparison`);
  }

  async selectCard(cardId) {
    logger.info(`Selecting card ${cardId}`);
    const card = this.page.locator(`[data-testid="card-${cardId}"]`);
    await card.click();
    await expect(this.cardDetailView).toBeVisible();
    logger.info(`Card ${cardId} selected`);
  }

  async getCardMonthlySpend(cardId) {
    const locator = this.page.locator(`[data-testid="card-${cardId}-monthly-spend"]`);
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    logger.info(`Card ${cardId} Monthly Spend: ${text}`);
    return text.trim();
  }

  async getCardTotalSpend(cardId) {
    const locator = this.page.locator(`[data-testid="card-${cardId}-total-spend"]`);
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    logger.info(`Card ${cardId} Total Spend: ${text}`);
    return text.trim();
  }

  async getCardTransactionCount(cardId) {
    const locator = this.page.locator(`[data-testid="card-${cardId}-transaction-count"]`);
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    logger.info(`Card ${cardId} Transaction Count: ${text}`);
    return text.trim();
  }

  async getCardUtilization(cardId) {
    const locator = this.page.locator(`[data-testid="card-${cardId}-utilization"]`);
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    logger.info(`Card ${cardId} Utilization: ${text}`);
    return text.trim();
  }

  async getCardTopCategories(cardId) {
    const locator = this.page.locator(`[data-testid="card-${cardId}-top-categories"]`);
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    const categories = text.split(',').map(c => c.trim());
    logger.info(`Card ${cardId} Top Categories: ${categories.join(', ')}`);
    return categories;
  }
};