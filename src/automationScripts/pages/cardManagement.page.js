const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

/**
 * CardManagementPage - Page Object for Multiple Credit Card Management
 * Epic: QE-9828 - CreditCardNew20261110205228-Multiple Credit Card Management
 */
exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Card List
    this.cardList = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.cardDetailsPanel = page.locator('.card-details-panel');
    
    // Locators for Card Details
    this.selectedCardType = page.locator('[data-testid="selected-card-type"]');
    this.selectedCardNumber = page.locator('[data-testid="selected-card-number"]');
    this.selectedCardCreditLimitValue = page.locator('[data-testid="selected-card-credit-limit"]');
    this.selectedCardAvailableCreditValue = page.locator('[data-testid="selected-card-available-credit"]');
    this.selectedCardOutstandingBalanceValue = page.locator('[data-testid="selected-card-outstanding-balance"]');
    this.selectedCardMonthlySpendValue = page.locator('[data-testid="selected-card-monthly-spend"]');
    
    // Warning and Error Messages
    this.maxCardWarning = page.locator('.max-card-warning');
    this.errorMessage = page.locator('.error-message');
  }

  /**
   * Navigate to card management page
   */
  async navigate() {
    Logger.info('Navigating to card management page');
    await this.page.goto('/cards');
    await this.waitForCardListLoad();
    Logger.info('Card management page loaded');
  }

  /**
   * Wait for card list to load
   */
  async waitForCardListLoad() {
    Logger.info('Waiting for card list to load');
    await expect(this.cardList).toBeVisible({ timeout: 10000 });
    Logger.info('Card list loaded successfully');
  }

  /**
   * Get total number of cards displayed
   * @returns {Promise<number>} Card count
   */
  async getCardCount() {
    const count = await this.cardItems.count();
    Logger.info(`Total cards displayed: ${count}`);
    return count;
  }

  /**
   * Get all card types
   * @returns {Promise<string[]>} Array of card types
   */
  async getAllCardTypes() {
    const types = await this.cardItems.locator('.card-type').allTextContents();
    Logger.info(`Card types retrieved: ${types.join(', ')}`);
    return types;
  }

  /**
   * Get all card numbers
   * @returns {Promise<string[]>} Array of masked card numbers
   */
  async getAllCardNumbers() {
    const numbers = await this.cardItems.locator('.card-number').allTextContents();
    Logger.info(`Card numbers retrieved: ${numbers.length} cards`);
    return numbers;
  }

  /**
   * Get all credit limits
   * @returns {Promise<string[]>} Array of credit limits
   */
  async getAllCreditLimits() {
    const limits = await this.cardItems.locator('.credit-limit').allTextContents();
    Logger.info(`Credit limits retrieved: ${limits.length} values`);
    return limits;
  }

  /**
   * Get all available credits
   * @returns {Promise<string[]>} Array of available credits
   */
  async getAllAvailableCredits() {
    const credits = await this.cardItems.locator('.available-credit').allTextContents();
    Logger.info(`Available credits retrieved: ${credits.length} values`);
    return credits;
  }

  /**
   * Get all outstanding balances
   * @returns {Promise<string[]>} Array of outstanding balances
   */
  async getAllOutstandingBalances() {
    const balances = await this.cardItems.locator('.outstanding-balance').allTextContents();
    Logger.info(`Outstanding balances retrieved: ${balances.length} values`);
    return balances;
  }

  /**
   * Get all monthly spends
   * @returns {Promise<string[]>} Array of monthly spends
   */
  async getAllMonthlySpends() {
    const spends = await this.cardItems.locator('.monthly-spend').allTextContents();
    Logger.info(`Monthly spends retrieved: ${spends.length} values`);
    return spends;
  }

  /**
   * Get all card statuses
   * @returns {Promise<string[]>} Array of card statuses
   */
  async getAllCardStatuses() {
    const statuses = await this.cardItems.locator('.card-status').allTextContents();
    Logger.info(`Card statuses retrieved: ${statuses.join(', ')}`);
    return statuses;
  }

  /**
   * Select a card by its last 4 digits
   * @param {string} lastFourDigits - Last 4 digits of card number
   */
  async selectCardByNumber(lastFourDigits) {
    Logger.info(`Selecting card ending in ${lastFourDigits}`);
    const cardItem = this.cardItems.filter({ hasText: lastFourDigits });
    await expect(cardItem).toBeVisible();
    await cardItem.click();
    Logger.info(`Card ending in ${lastFourDigits} selected`);
  }

  /**
   * Get selected card credit limit
   * @returns {Promise<string>} Credit limit value
   */
  async getSelectedCardCreditLimit() {
    await expect(this.selectedCardCreditLimitValue).toBeVisible();
    const value = await this.selectedCardCreditLimitValue.textContent();
    Logger.info(`Selected card credit limit: ${value}`);
    return value.trim();
  }

  /**
   * Get selected card available credit
   * @returns {Promise<string>} Available credit value
   */
  async getSelectedCardAvailableCredit() {
    await expect(this.selectedCardAvailableCreditValue).toBeVisible();
    const value = await this.selectedCardAvailableCreditValue.textContent();
    Logger.info(`Selected card available credit: ${value}`);
    return value.trim();
  }

  /**
   * Get selected card outstanding balance
   * @returns {Promise<string>} Outstanding balance value
   */
  async getSelectedCardOutstandingBalance() {
    await expect(this.selectedCardOutstandingBalanceValue).toBeVisible();
    const value = await this.selectedCardOutstandingBalanceValue.textContent();
    Logger.info(`Selected card outstanding balance: ${value}`);
    return value.trim();
  }

  /**
   * Get selected card monthly spend
   * @returns {Promise<string>} Monthly spend value
   */
  async getSelectedCardMonthlySpend() {
    await expect(this.selectedCardMonthlySpendValue).toBeVisible();
    const value = await this.selectedCardMonthlySpendValue.textContent();
    Logger.info(`Selected card monthly spend: ${value}`);
    return value.trim();
  }

  /**
   * Get max card warning message
   * @returns {Promise<string>} Warning message text
   */
  async getMaxCardWarningMessage() {
    await expect(this.maxCardWarning).toBeVisible();
    const message = await this.maxCardWarning.textContent();
    Logger.info(`Max card warning: ${message}`);
    return message.trim();
  }

  /**
   * Check if a specific card is visible
   * @param {string} cardId - Card identifier
   * @returns {Promise<boolean>} True if card is visible
   */
  async isCardVisible(cardId) {
    const card = this.cardItems.filter({ has: this.page.locator(`[data-card-id="${cardId}"]`) });
    const visible = await card.isVisible().catch(() => false);
    Logger.info(`Card ${cardId} visible: ${visible}`);
    return visible;
  }

  /**
   * Get first card ID
   * @returns {Promise<string>} First card ID
   */
  async getFirstCardId() {
    const firstCard = this.cardItems.first();
    const cardId = await firstCard.getAttribute('data-card-id');
    Logger.info(`First card ID: ${cardId}`);
    return cardId;
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    Logger.info(`Error message: ${message}`);
    return message.trim();
  }
};