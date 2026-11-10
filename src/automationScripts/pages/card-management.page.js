const { expect } = require('@playwright/test');

/**
 * CardManagementPage - Page Object for Credit Card Management functionality
 * Handles multiple card display, card details, and card-wise spend breakdown
 */
exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.myCardsLink = page.locator('a:has-text("My Cards")');
    
    // Card List Locators
    this.cardListContainer = page.locator('.card-list-container');
    this.cardListItem = page.locator('.card-list-item');
    this.firstCardItem = page.locator('.card-list-item').first();
    this.cardNumber = page.locator('.card-list-item p:has-text("Card:")');
    this.creditLimit = page.locator('.card-list-item p:has-text("Credit Limit:")');
    this.currentBalance = page.locator('.card-list-item p:has-text("Current Balance:")');
    
    // Portfolio Summary
    this.portfolioSummary = page.locator('.alert-info:has-text("Portfolio Summary")');
    
    // Empty State
    this.emptyStateMessage = page.locator('.text-center:has-text("No credit cards found")');
    
    // Filtering and Sorting
    this.filterInput = page.locator('input[placeholder="Search cards..."]');
    this.sortDropdown = page.locator('select.form-control');
    
    // Card Detail Page
    this.cardDetailPage = page.locator('.card-detail-container');
    this.cardTotalSpend = page.locator('.panel-body p:has-text("Monthly Spend:")');
    this.cardAvailableCredit = page.locator('.panel-body p:has-text("Available Balance:")');
    this.cardCurrentBalance = page.locator('.panel-body p:has-text("Current Balance:")');
    this.cardCreditLimit = page.locator('.panel-body p:has-text("Credit Limit:")');
    this.transactionSummary = page.locator('.panel-body:has-text("Spending Summary")');
    this.totalTransactions = page.locator('.panel-body p:has-text("Total Transactions:")');
    this.lastTransactionDate = page.locator('.panel-body p:has-text("Last Transaction:")');
    this.utilizationBar = page.locator('.progress-bar');
    this.transactionEmptyState = page.locator('.text-center:has-text("No transactions")');
    
    // Error States
    this.errorMessage = page.locator('.alert-danger');
    this.cardErrorMessage = page.locator('.alert-danger:has-text("no longer available"), .alert-danger:has-text("not found")');
  }

  /**
   * Navigate to My Cards page
   */
  async navigateToMyCards() {
    await this.myCardsLink.click();
    await this.page.waitForURL(/.*\/cards.*/, { timeout: 5000 });
  }

  /**
   * Wait for cards to load
   */
  async waitForCardsLoad() {
    await expect(this.cardListContainer).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get total count of displayed cards
   * @returns {Promise<number>} Number of cards
   */
  async getCardCount() {
    return await this.cardListItem.count();
  }

  /**
   * Get all card numbers
   * @returns {Promise<string[]>} Array of card numbers
   */
  async getAllCardNumbers() {
    const cardElements = await this.cardNumber.all();
    const cardNumbers = [];
    for (const element of cardElements) {
      const text = await element.textContent();
      const match = text.match(/\*{4}\d{4}/);
      if (match) cardNumbers.push(match[0]);
    }
    return cardNumbers;
  }

  /**
   * Get all credit limits
   * @returns {Promise<string[]>} Array of credit limits
   */
  async getAllCreditLimits() {
    const limitElements = await this.creditLimit.all();
    const limits = [];
    for (const element of limitElements) {
      const text = await element.textContent();
      const match = text.match(/\$[\d,]+\.\d{2}/);
      if (match) limits.push(match[0]);
    }
    return limits;
  }

  /**
   * Get all current balances
   * @returns {Promise<string[]>} Array of current balances
   */
  async getAllCurrentBalances() {
    const balanceElements = await this.currentBalance.all();
    const balances = [];
    for (const element of balanceElements) {
      const text = await element.textContent();
      const match = text.match(/\$[\d,]+\.\d{2}/);
      if (match) balances.push(match[0]);
    }
    return balances;
  }

  /**
   * Get portfolio summary text
   * @returns {Promise<string>} Portfolio summary text
   */
  async getPortfolioSummaryText() {
    await expect(this.portfolioSummary).toBeVisible();
    return await this.portfolioSummary.textContent();
  }

  /**
   * Get empty state message text
   * @returns {Promise<string>} Empty state message
   */
  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  /**
   * Scroll to bottom of card list
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll to top of card list
   */
  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Sort cards by name
   */
  async sortByName() {
    await this.sortDropdown.selectOption('cardHolderName');
  }

  /**
   * Select card by last 4 digits
   * @param {string} lastFourDigits - Last 4 digits of card number
   */
  async selectCardByLastFourDigits(lastFourDigits) {
    const cardLink = this.page.locator(`a[href*="/cards/"]:has-text("****${lastFourDigits}")`);
    await cardLink.click();
    await this.page.waitForURL(/.*\/cards\/.*/, { timeout: 5000 });
  }

  /**
   * Get card total spend
   * @returns {Promise<string>} Total spend value
   */
  async getCardTotalSpend() {
    await expect(this.cardTotalSpend).toBeVisible();
    const text = await this.cardTotalSpend.textContent();
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : text;
  }

  /**
   * Get card available credit
   * @returns {Promise<string>} Available credit value
   */
  async getCardAvailableCredit() {
    await expect(this.cardAvailableCredit).toBeVisible();
    const text = await this.cardAvailableCredit.textContent();
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : text;
  }

  /**
   * Get card current balance
   * @returns {Promise<string>} Current balance value
   */
  async getCardCurrentBalance() {
    await expect(this.cardCurrentBalance).toBeVisible();
    const text = await this.cardCurrentBalance.textContent();
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : text;
  }

  /**
   * Get card credit limit
   * @returns {Promise<string>} Credit limit value
   */
  async getCardCreditLimit() {
    await expect(this.cardCreditLimit).toBeVisible();
    const text = await this.cardCreditLimit.textContent();
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : text;
  }

  /**
   * Get total transactions count
   * @returns {Promise<string>} Total transactions count
   */
  async getTotalTransactionsCount() {
    await expect(this.totalTransactions).toBeVisible();
    const text = await this.totalTransactions.textContent();
    const match = text.match(/\d+/);
    return match ? match[0] : '0';
  }

  /**
   * Get last transaction date
   * @returns {Promise<string>} Last transaction date
   */
  async getLastTransactionDate() {
    await expect(this.lastTransactionDate).toBeVisible();
    const text = await this.lastTransactionDate.textContent();
    return text.replace('Last Transaction:', '').trim();
  }

  /**
   * Get credit utilization percentage
   * @returns {Promise<string>} Utilization percentage
   */
  async getCreditUtilizationPercentage() {
    await expect(this.utilizationBar).toBeVisible();
    return await this.utilizationBar.textContent();
  }

  /**
   * Get card error message text
   * @returns {Promise<string>} Error message
   */
  async getCardErrorMessageText() {
    await expect(this.cardErrorMessage).toBeVisible();
    return await this.cardErrorMessage.textContent();
  }
};