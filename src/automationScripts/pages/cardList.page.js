const { expect } = require('@playwright/test');

/**
 * Page Object: CardListPage
 * Description: Represents the Credit Card List/Portfolio page
 * Features: Display all cards, filter by type, view card details
 */
exports.CardListPage = class CardListPage {
  constructor(page) {
    this.page = page;
    
    // Container locators
    this.cardListContainer = page.locator('.card-list-container');
    this.cardPanels = page.locator('.card-panel');
    
    // Filter controls
    this.cardTypeFilter = page.locator('select[name="cardType"]');
    
    // Empty state
    this.emptyMessage = page.locator('.alert-info');
    
    // Error state
    this.errorMessage = page.locator('.alert-danger');
    
    // Loading state
    this.loadingSpinner = page.locator('.spinner');
  }

  /**
   * Navigate to card list page
   */
  async navigate() {
    await this.page.goto('/cards');
    await expect(this.cardListContainer).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get total count of displayed cards
   * @returns {Promise<number>}
   */
  async getCardCount() {
    await this.page.waitForTimeout(1000); // Wait for cards to load
    return await this.cardPanels.count();
  }

  /**
   * Get card data by index
   * @param {number} index
   * @returns {Promise<Object>}
   */
  async getCardByIndex(index) {
    const cardPanel = this.cardPanels.nth(index);
    await expect(cardPanel).toBeVisible();
    
    const cardType = await cardPanel.locator('.panel-title').textContent();
    const lastFourDigits = cardType.match(/\d{4}$/)[0];
    const issuer = await cardPanel.locator('p:has-text("Issuer:")').textContent();
    const creditLimitText = await cardPanel.locator('p:has-text("Credit Limit:")').textContent();
    const currentBalanceText = await cardPanel.locator('p:has-text("Current Balance:")').textContent();
    
    return {
      cardType: cardType.split('****')[0].trim(),
      lastFourDigits: lastFourDigits,
      issuer: issuer.replace('Issuer:', '').trim(),
      creditLimit: parseFloat(creditLimitText.replace(/[^0-9.]/g, '')),
      currentBalance: parseFloat(currentBalanceText.replace(/[^0-9.]/g, ''))
    };
  }

  /**
   * Get all card types displayed
   * @returns {Promise<Array<string>>}
   */
  async getAllCardTypes() {
    const count = await this.getCardCount();
    const types = [];
    
    for (let i = 0; i < count; i++) {
      const card = await this.getCardByIndex(i);
      types.push(card.cardType);
    }
    
    return types;
  }

  /**
   * Get all last four digits
   * @returns {Promise<Array<string>>}
   */
  async getAllLastFourDigits() {
    const count = await this.getCardCount();
    const digits = [];
    
    for (let i = 0; i < count; i++) {
      const card = await this.getCardByIndex(i);
      digits.push(card.lastFourDigits);
    }
    
    return digits;
  }

  /**
   * Select card by index (click to view details)
   * @param {number} index
   */
  async selectCardByIndex(index) {
    const cardPanel = this.cardPanels.nth(index);
    await cardPanel.click();
    await this.page.waitForURL(/.*\/cards\/.*/);
  }

  /**
   * Select card by ID
   * @param {string} cardId
   */
  async selectCardById(cardId) {
    await this.page.goto(`/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Apply card type filter
   * @param {string} cardType - 'Visa', 'MasterCard', 'Amex', or '' for all
   */
  async applyCardTypeFilter(cardType) {
    await this.cardTypeFilter.selectOption(cardType);
    await this.page.waitForTimeout(500); // Wait for filter to apply
  }

  /**
   * Get empty message text
   * @returns {Promise<string>}
   */
  async getEmptyMessage() {
    await expect(this.emptyMessage).toBeVisible();
    return await this.emptyMessage.textContent();
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Check if loading spinner is visible
   * @returns {Promise<boolean>}
   */
  async isLoading() {
    return await this.loadingSpinner.isVisible();
  }
};
