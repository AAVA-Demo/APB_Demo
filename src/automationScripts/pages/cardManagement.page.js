const { expect } = require('@playwright/test');

/**
 * CardManagementPage - Page Object for Multiple Credit Cards Display
 * Handles card list display and card selection
 */
exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.cardListContainer = page.locator('.card-list-container');
    this.cardItems = page.locator('.card-item');
    this.loadingSpinner = page.locator('.spinner');
    this.errorMessage = page.locator('.alert-danger');
    this.noCardsMessage = page.locator('.alert-info');
    
    // Card detail locators (within card item)
    this.cardNumberLocator = '.card-number';
    this.cardBrandLocator = '.card-brand';
    this.cardTypeLocator = '.card-type';
    this.availableCreditLocator = '.card-balance .amount';
    this.outstandingBalanceLocator = '.card-outstanding';
  }

  /**
   * Navigate to card management page
   */
  async navigate() {
    await this.page.goto('https://creditcard.example.com/cards');
  }

  /**
   * Wait for cards to load
   */
  async waitForCardsLoad() {
    await expect(this.cardListContainer).toBeVisible({ timeout: 10000 });
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
  }

  /**
   * Get total count of cards displayed
   * @returns {Promise<number>} Number of cards
   */
  async getCardCount() {
    await this.waitForCardsLoad();
    return await this.cardItems.count();
  }

  /**
   * Get card details at specific index
   * @param {number} index - Card index (0-based)
   * @returns {Promise<Object>} Card details object
   */
  async getCardAtIndex(index) {
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    
    return {
      cardNumber: await card.locator(this.cardNumberLocator).textContent(),
      cardBrand: await card.locator(this.cardBrandLocator).textContent(),
      cardType: await card.locator(this.cardTypeLocator).textContent(),
      availableCredit: await card.locator(this.availableCreditLocator).textContent(),
      outstandingBalance: await card.locator(this.outstandingBalanceLocator).textContent()
    };
  }

  /**
   * Select card by card number
   * @param {string} cardNumber - Masked card number (e.g., '**** 1234')
   */
  async selectCardByNumber(cardNumber) {
    const card = this.cardItems.filter({ hasText: cardNumber });
    await expect(card).toBeVisible();
    await card.click();
    
    // Wait for navigation to card detail page
    await this.page.waitForURL(/\/cards\/\d+/, { timeout: 5000 });
  }

  /**
   * Get error message
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Get no cards message
   * @returns {Promise<string>} No cards message text
   */
  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }
};
