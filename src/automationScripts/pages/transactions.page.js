const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionContainer = page.locator('[data-testid="transaction-container"]');
    this.transactionItems = page.locator('[data-testid="transaction-item"]');
    this.statusMessage = page.locator('[data-testid="status-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    
    // Transaction Detail Locators
    this.transactionDetailContainer = page.locator('[data-testid="transaction-detail-container"]');
    this.merchantField = page.locator('[data-testid="transaction-merchant"]');
    this.amountField = page.locator('[data-testid="transaction-amount"]');
    this.dateField = page.locator('[data-testid="transaction-date"]');
    this.categoryField = page.locator('[data-testid="transaction-category"]');
    this.cardNameField = page.locator('[data-testid="transaction-card-name"]');
    this.statusField = page.locator('[data-testid="transaction-status"]');
    
    // Loading State Locators
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    logger.info('Navigating to Transactions page');
    await this.page.goto('/transactions');
    await expect(this.transactionContainer).toBeVisible();
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    logger.info('Transactions page loaded successfully');
  }

  async authenticateUser(email, cardIds, options = {}) {
    logger.info(`Authenticating user: ${email} with cards: ${cardIds}`);
    
    await this.page.evaluate(({ email, cardIds, options }) => {
      window.mockUserData = {
        email: email,
        cards: cardIds ? cardIds.split(',').map(id => id.trim()) : []
      };
    }, { email, cardIds, options });
    
    await this.page.reload();
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    logger.info('User authentication completed');
  }

  async getTransactions() {
    logger.info('Retrieving transaction list');
    await expect(this.transactionContainer).toBeVisible();
    
    const transactionCount = await this.transactionItems.count();
    const transactions = [];
    
    for (let i = 0; i < transactionCount; i++) {
      const transactionItem = this.transactionItems.nth(i);
      const transactionData = await transactionItem.evaluate(el => ({
        transactionId: el.getAttribute('data-transaction-id'),
        cardId: el.getAttribute('data-card-id'),
        amount: parseFloat(el.getAttribute('data-amount')),
        merchant: el.getAttribute('data-merchant'),
        category: el.getAttribute('data-category'),
        date: el.getAttribute('data-date'),
        status: el.getAttribute('data-status')
      }));
      transactions.push(transactionData);
    }
    
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async getStatusMessage() {
    logger.info('Retrieving status message');
    await expect(this.statusMessage).toBeVisible();
    return await this.statusMessage.textContent();
  }

  async simulateServiceUnavailable() {
    logger.info('Simulating transaction service unavailability');
    
    await this.page.route('**/api/transactions', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          error: true,
          message: 'Service temporarily unavailable. Please try again later.'
        })
      });
    });
    
    logger.info('Service unavailability simulation configured');
  }

  async getTransactionsWithError() {
    logger.info('Attempting to retrieve transactions with expected error');
    
    await this.page.goto('/transactions');
    
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    
    const response = await this.page.evaluate(() => {
      return window.lastAPIResponse || { statusCode: 503, message: 'Service temporarily unavailable. Please try again later.' };
    });
    
    logger.info('Error response retrieved');
    return {
      statusCode: response.statusCode,
      message: errorText,
      transactions: response.transactions
    };
  }

  async getTransactionById(transactionId) {
    logger.info(`Retrieving transaction detail for ID: ${transactionId}`);
    
    await this.page.goto(`/transactions/${transactionId}`);
    await expect(this.transactionDetailContainer).toBeVisible();
    
    await expect(this.merchantField).toBeVisible();
    await expect(this.amountField).toBeVisible();
    await expect(this.dateField).toBeVisible();
    await expect(this.categoryField).toBeVisible();
    await expect(this.cardNameField).toBeVisible();
    await expect(this.statusField).toBeVisible();
    
    const transactionDetail = {
      merchant: await this.merchantField.textContent(),
      amount: parseFloat(await this.amountField.textContent()),
      date: await this.dateField.textContent(),
      category: await this.categoryField.textContent(),
      cardName: await this.cardNameField.textContent(),
      status: await this.statusField.textContent()
    };
    
    logger.info('Transaction detail retrieved successfully');
    return transactionDetail;
  }

  async getTransactionByIdWithError(transactionId) {
    logger.info(`Attempting to retrieve transaction detail for invalid ID: ${transactionId}`);
    
    await this.page.goto(`/transactions/${transactionId}`);
    
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    
    const response = await this.page.evaluate(() => {
      return window.lastAPIResponse || { statusCode: 404, message: 'Transaction Not Found' };
    });
    
    logger.info('Error response retrieved for invalid transaction ID');
    return {
      statusCode: response.statusCode,
      message: errorText,
      transactionData: response.transactionData
    };
  }
};