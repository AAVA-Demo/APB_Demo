const { expect } = require('@playwright/test');

/**
 * CardDetailPage - Page Object for Card-wise Spend Analysis
 * Handles individual card details and spending analysis display
 */
exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    
    // Card Details Locators
    this.cardDetailContainer = page.locator('.card-detail-container');
    this.cardNumberDisplay = page.locator('[data-testid="card-number"]');
    this.cardBrandDisplay = page.locator('[data-testid="card-brand"]');
    this.cardTypeDisplay = page.locator('[data-testid="card-type"]');
    this.creditLimitDisplay = page.locator('[data-testid="credit-limit"]');
    this.availableCreditDisplay = page.locator('[data-testid="available-credit"]');
    this.outstandingBalanceDisplay = page.locator('[data-testid="outstanding-balance"]');
    
    // Spending Analysis Locators
    this.spendingAnalysisSection = page.locator('.spending-analysis');
    this.currentMonthSpendDisplay = page.locator('[data-testid="current-month-spend"]');
    this.lastMonthSpendDisplay = page.locator('[data-testid="last-month-spend"]');
    this.averageMonthlySpendDisplay = page.locator('[data-testid="average-monthly-spend"]');
    this.topCategoryDisplay = page.locator('[data-testid="top-category"]');
    
    // Message Locators
    this.errorMessage = page.locator('.alert-danger');
    this.noTransactionsMessage = page.locator('.no-transactions-message');
    this.loadingSpinner = page.locator('.spinner');
    
    // Navigation Locators
    this.backButton = page.locator('button:has-text("Back")');
  }

  /**
   * Wait for card details to load
   */
  async waitForCardDetailsLoad() {
    await expect(this.cardDetailContainer).toBeVisible({ timeout: 10000 });
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
  }

  /**
   * Get card number
   * @returns {Promise<string>} Masked card number
   */
  async getCardNumber() {
    await expect(this.cardNumberDisplay).toBeVisible();
    return (await this.cardNumberDisplay.textContent()).trim();
  }

  /**
   * Get card brand
   * @returns {Promise<string>} Card brand name
   */
  async getCardBrand() {
    await expect(this.cardBrandDisplay).toBeVisible();
    return (await this.cardBrandDisplay.textContent()).trim();
  }

  /**
   * Get card type
   * @returns {Promise<string>} Card type
   */
  async getCardType() {
    await expect(this.cardTypeDisplay).toBeVisible();
    return (await this.cardTypeDisplay.textContent()).trim();
  }

  /**
   * Get credit limit
   * @returns {Promise<string>} Credit limit value
   */
  async getCreditLimit() {
    await expect(this.creditLimitDisplay).toBeVisible();
    return (await this.creditLimitDisplay.textContent()).trim();
  }

  /**
   * Get available credit
   * @returns {Promise<string>} Available credit value
   */
  async getAvailableCredit() {
    await expect(this.availableCreditDisplay).toBeVisible();
    return (await this.availableCreditDisplay.textContent()).trim();
  }

  /**
   * Get outstanding balance
   * @returns {Promise<string>} Outstanding balance value
   */
  async getOutstandingBalance() {
    await expect(this.outstandingBalanceDisplay).toBeVisible();
    return (await this.outstandingBalanceDisplay.textContent()).trim();
  }

  /**
   * Get current month spend
   * @returns {Promise<string>} Current month spend value
   */
  async getCurrentMonthSpend() {
    await expect(this.currentMonthSpendDisplay).toBeVisible();
    return (await this.currentMonthSpendDisplay.textContent()).trim();
  }

  /**
   * Get last month spend
   * @returns {Promise<string>} Last month spend value
   */
  async getLastMonthSpend() {
    await expect(this.lastMonthSpendDisplay).toBeVisible();
    return (await this.lastMonthSpendDisplay.textContent()).trim();
  }

  /**
   * Get average monthly spend
   * @returns {Promise<string>} Average monthly spend value
   */
  async getAverageMonthlySpend() {
    await expect(this.averageMonthlySpendDisplay).toBeVisible();
    return (await this.averageMonthlySpendDisplay.textContent()).trim();
  }

  /**
   * Get top spending category
   * @returns {Promise<string>} Top category name
   */
  async getTopCategory() {
    await expect(this.topCategoryDisplay).toBeVisible();
    return (await this.topCategoryDisplay.textContent()).trim();
  }

  /**
   * Get no transactions message
   * @returns {Promise<string>} No transactions message text
   */
  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
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
   * Click back button to return to card list
   */
  async clickBackButton() {
    await expect(this.backButton).toBeVisible();
    await this.backButton.click();
    await this.page.waitForURL(/\/cards$/, { timeout: 5000 });
  }
};
