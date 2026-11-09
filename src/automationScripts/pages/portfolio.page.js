const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

/**
 * Portfolio Page Object
 * Handles all interactions with the Credit Card Portfolio section
 * Contains locators and methods for card management and card-wise analysis
 */
exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Authentication locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.userProfile = page.locator('.user-profile');
    
    // Navigation locators
    this.portfolioLink = page.locator('a[href="#!/portfolio"]');
    
    // Portfolio section locators
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardTile = page.locator('.card-tile');
    this.emptyPortfolioMessage = page.locator('[data-testid="empty-portfolio-message"]');
    this.errorMessage = page.locator('.alert-danger');
    
    // Card details locators
    this.cardDetailsSection = page.locator('[data-testid="card-details-section"]');
    this.spendingAnalysisSection = page.locator('[data-testid="spending-analysis-section"]');
    this.transactionTable = page.locator('[data-testid="transaction-table"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.validationErrorMessage = page.locator('[data-testid="validation-error"]');
    
    // Spending metrics locators
    this.totalSpendValue = page.locator('[data-testid="total-spend-value"]');
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"]');
    this.utilizationPercentage = page.locator('[data-testid="utilization-percentage"]');
    
    // Console error tracking
    this.consoleErrors = [];
    this.setupConsoleErrorTracking();
  }

  /**
   * Setup console error tracking
   */
  setupConsoleErrorTracking() {
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

  /**
   * Navigate to the application base URL
   */
  async navigate() {
    await this.page.goto('/');
    Logger.info('Navigated to application base URL');
  }

  /**
   * Perform user login
   * @param {string} username - Username for authentication
   * @param {string} password - Password for authentication
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info(`User logged in with username: ${username}`);
  }

  /**
   * Navigate to portfolio page
   */
  async navigateToPortfolio() {
    await this.portfolioLink.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info('Navigated to portfolio page');
  }

  /**
   * Get user profile element
   * @returns {Locator} User profile locator
   */
  getUserProfile() {
    return this.userProfile;
  }

  /**
   * Get card list container element
   * @returns {Locator} Card list container locator
   */
  getCardListContainer() {
    return this.cardListContainer;
  }

  /**
   * Get count of displayed credit cards
   * @returns {Promise<number>} Number of cards displayed
   */
  async getCardCount() {
    await this.page.waitForTimeout(500); // Allow time for cards to render
    return await this.cardTile.count();
  }

  /**
   * Get all credit card elements with their details
   * @returns {Promise<Array>} Array of card objects with locators
   */
  async getAllCards() {
    const cardCount = await this.getCardCount();
    const cards = [];
    
    for (let i = 0; i < cardCount; i++) {
      const card = this.cardTile.nth(i);
      cards.push({
        cardNumber: card.locator('[data-testid="card-number"]'),
        cardType: card.locator('[data-testid="card-type"]'),
        creditLimit: card.locator('[data-testid="credit-limit"]'),
        availableCredit: card.locator('[data-testid="available-credit"]'),
        outstandingAmount: card.locator('[data-testid="outstanding-amount"]')
      });
    }
    
    return cards;
  }

  /**
   * Get error message element
   * @returns {Locator} Error message locator
   */
  getErrorMessage() {
    return this.errorMessage;
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Get empty portfolio message element
   * @returns {Locator} Empty portfolio message locator
   */
  getEmptyPortfolioMessage() {
    return this.emptyPortfolioMessage;
  }

  /**
   * Get empty portfolio message text
   * @returns {Promise<string>} Empty portfolio message text
   */
  async getEmptyPortfolioMessageText() {
    await expect(this.emptyPortfolioMessage).toBeVisible();
    return await this.emptyPortfolioMessage.textContent();
  }

  /**
   * Get console errors captured during page execution
   * @returns {Array<string>} Array of console error messages
   */
  getConsoleErrors() {
    return this.consoleErrors;
  }

  /**
   * Select a specific credit card for detailed analysis
   * @param {string} cardId - Card identifier
   */
  async selectCard(cardId) {
    const cardSelector = `[data-card-id="${cardId}"]`;
    const card = this.page.locator(cardSelector);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info(`Selected card: ${cardId}`);
  }

  /**
   * Get spending analysis section element
   * @returns {Locator} Spending analysis section locator
   */
  getSpendingAnalysisSection() {
    return this.spendingAnalysisSection;
  }

  /**
   * Get total spend value
   * @returns {Promise<string>} Total spend value
   */
  async getTotalSpendValue() {
    await expect(this.totalSpendValue).toBeVisible();
    return await this.totalSpendValue.textContent();
  }

  /**
   * Get monthly spend value
   * @returns {Promise<string>} Monthly spend value
   */
  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  /**
   * Get transaction table element
   * @returns {Locator} Transaction table locator
   */
  getTransactionTable() {
    return this.transactionTable;
  }

  /**
   * Get count of transactions in the table
   * @returns {Promise<number>} Number of transactions
   */
  async getTransactionCount() {
    await this.page.waitForTimeout(500); // Allow time for transactions to render
    const rows = this.transactionTable.locator('tbody tr');
    return await rows.count();
  }

  /**
   * Get all transaction elements with their details
   * @returns {Promise<Array>} Array of transaction objects with locators
   */
  async getAllTransactions() {
    const transactionCount = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < transactionCount; i++) {
      const row = this.transactionTable.locator('tbody tr').nth(i);
      transactions.push({
        date: row.locator('td').nth(0),
        merchant: row.locator('td').nth(1),
        category: row.locator('td').nth(2),
        amount: row.locator('td').nth(3),
        description: row.locator('td').nth(4)
      });
    }
    
    return transactions;
  }

  /**
   * Get utilization percentage
   * @returns {Promise<string>} Utilization percentage
   */
  async getUtilizationPercentage() {
    await expect(this.utilizationPercentage).toBeVisible();
    return await this.utilizationPercentage.textContent();
  }

  /**
   * Get no transactions message element
   * @returns {Locator} No transactions message locator
   */
  getNoTransactionsMessage() {
    return this.noTransactionsMessage;
  }

  /**
   * Get no transactions message text
   * @returns {Promise<string>} No transactions message text
   */
  async getNoTransactionsMessageText() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  /**
   * Get validation error message element
   * @returns {Locator} Validation error message locator
   */
  getValidationErrorMessage() {
    return this.validationErrorMessage;
  }

  /**
   * Get validation error message text
   * @returns {Promise<string>} Validation error message text
   */
  async getValidationErrorMessageText() {
    await expect(this.validationErrorMessage).toBeVisible();
    return await this.validationErrorMessage.textContent();
  }

  /**
   * Get card details section element
   * @returns {Locator} Card details section locator
   */
  getCardDetailsSection() {
    return this.cardDetailsSection;
  }
};
