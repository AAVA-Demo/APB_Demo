const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('CardManagementPage');
    
    // Card List Locators
    this.cardTiles = page.locator('[data-testid="card-tile"], .card-tile');
    this.cardNames = page.locator('[data-testid="card-name"], .card-name');
    this.cardNumbers = page.locator('[data-testid="card-number"], .card-number');
    this.cardBalances = page.locator('[data-testid="card-balance"], .card-balance');
    
    // Message Locators
    this.cardLimitWarning = page.locator('[data-testid="card-limit-warning"], .alert-warning:has-text("credit cards")');
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger, .error-message');
    this.inactiveCardMessage = page.locator('[data-testid="inactive-card-message"], .alert:has-text("no longer active")');
    this.transactionErrorMessage = page.locator('[data-testid="transaction-error"], .transaction-error:has-text("Unable to load transaction history")');
    
    // Card Details Locators
    this.totalSpendLabel = page.locator('[data-testid="total-spend-label"], .card-detail:has-text("Total Spend")');
    this.totalSpendValue = page.locator('[data-testid="total-spend-value"], .card-detail:has-text("Total Spend") .value');
    this.availableCreditLabel = page.locator('[data-testid="available-credit-label"], .card-detail:has-text("Available Credit")');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"], .card-detail:has-text("Available Credit") .value');
    
    // Transaction History Locators
    this.transactionHistorySection = page.locator('[data-testid="transaction-history"], .transaction-history, .transaction-list');
    this.transactionItems = page.locator('[data-testid="transaction-item"], .transaction-item');
    this.transactionDates = page.locator('[data-testid="transaction-date"], .transaction-date');
    this.transactionMerchants = page.locator('[data-testid="transaction-merchant"], .transaction-merchant');
    this.transactionCategories = page.locator('[data-testid="transaction-category"], .transaction-category');
    this.transactionAmounts = page.locator('[data-testid="transaction-amount"], .transaction-amount');
    
    // Login Locators
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], #password');
    this.loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), button[type="submit"]');
    
    // Loading Indicator
    this.loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner');
  }

  async navigate() {
    this.logger.info('Navigating to card management dashboard');
    await this.page.goto('/cards');
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    this.logger.info('Waiting for page to load');
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      this.logger.info('No loading indicator found or already hidden');
    });
    await Promise.race([
      this.cardTiles.first().waitFor({ state: 'visible', timeout: 3000 }),
      this.errorMessage.waitFor({ state: 'visible', timeout: 3000 }),
      this.cardLimitWarning.waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {
      this.logger.warn('Page load timeout - continuing');
    });
    this.logger.info('Page load complete');
  }

  async waitForCardDetailsLoad() {
    this.logger.info('Waiting for card details to load');
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      this.logger.info('No loading indicator found');
    });
    await Promise.race([
      this.totalSpendLabel.waitFor({ state: 'visible', timeout: 3000 }),
      this.inactiveCardMessage.waitFor({ state: 'visible', timeout: 3000 }),
      this.errorMessage.waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {
      this.logger.warn('Card details load timeout - continuing');
    });
    this.logger.info('Card details load complete');
  }

  async loginWithCredentials(username, password) {
    this.logger.info(`Logging in with username: ${username}`);
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/cards', { timeout: 5000 }).catch(() => {
      this.logger.warn('Did not navigate to cards page after login');
    });
    this.logger.info('Login completed');
  }

  async getCardCount() {
    this.logger.info('Counting visible card tiles');
    const count = await this.cardTiles.count();
    this.logger.info(`Card count: ${count}`);
    return count;
  }

  async getAllCardDetails() {
    this.logger.info('Retrieving all card details');
    const count = await this.getCardCount();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const name = await this.cardNames.nth(i).textContent();
      const lastFourDigits = await this.cardNumbers.nth(i).textContent();
      const balance = await this.cardBalances.nth(i).textContent();
      
      cards.push({
        name: name.trim(),
        lastFourDigits: lastFourDigits.trim(),
        balance: balance.trim()
      });
    }
    
    this.logger.info(`Retrieved ${cards.length} card details`);
    return cards;
  }

  async selectCardByLastFourDigits(lastFour) {
    this.logger.info(`Selecting card with last 4 digits: ${lastFour}`);
    const cardTile = this.page.locator(`[data-testid="card-tile"]:has-text("${lastFour}"), .card-tile:has-text("${lastFour}")`);
    await expect(cardTile).toBeVisible();
    await cardTile.click();
    this.logger.info('Card selected');
  }

  async getTotalSpend() {
    this.logger.info('Retrieving total spend value');
    await expect(this.totalSpendValue).toBeVisible();
    const value = await this.totalSpendValue.textContent();
    this.logger.info(`Total Spend: ${value}`);
    return value.trim();
  }

  async getAvailableCredit() {
    this.logger.info('Retrieving available credit value');
    await expect(this.availableCreditValue).toBeVisible();
    const value = await this.availableCreditValue.textContent();
    this.logger.info(`Available Credit: ${value}`);
    return value.trim();
  }

  async getTransactionHistory() {
    this.logger.info('Retrieving transaction history');
    const count = await this.transactionItems.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const date = await this.transactionDates.nth(i).textContent();
      const merchant = await this.transactionMerchants.nth(i).textContent();
      const category = await this.transactionCategories.nth(i).textContent();
      const amount = await this.transactionAmounts.nth(i).textContent();
      
      transactions.push({
        date: date.trim(),
        merchant: merchant.trim(),
        category: category.trim(),
        amount: amount.trim()
      });
    }
    
    this.logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }
};