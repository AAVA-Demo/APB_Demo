const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Transaction Management
    this.transactionListContainer = page.locator('.transactions-container');
    this.transactionTable = page.locator('.transaction-table');
    this.transactionRows = page.locator('.transaction-row');
    
    // Locators for Filters
    this.cardFilterDropdown = page.locator('[data-testid="card-filter-dropdown"]');
    this.filterAppliedIndicator = page.locator('[data-testid="filter-applied"]');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters-button"]');
    
    // Locators for Messages
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    
    // Loading indicator
    this.loadingSpinner = page.locator('.loading-spinner');
  }

  async navigate() {
    await this.page.goto('/transactions');
    logger.info('Navigated to /transactions');
  }

  async authenticateUser(userId) {
    await this.page.evaluate((id) => {
      sessionStorage.setItem('userId', id);
      sessionStorage.setItem('authToken', 'mock_token_' + id);
    }, userId);
    logger.info(`User ${userId} authenticated`);
  }

  async waitForPageLoad() {
    await expect(this.transactionListContainer).toBeVisible({ timeout: 5000 });
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    logger.info('Transaction page loaded successfully');
  }

  async getLinkedCards() {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.click();
    
    const options = await this.page.locator('.card-filter-option').allTextContents();
    logger.info(`Linked cards retrieved: ${options.join(', ')}`);
    return options;
  }

  async selectCardFilter(cardId) {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.click();
    await this.page.locator(`[data-card-id="${cardId}"]`).click();
    logger.info(`Card filter selected: ${cardId}`);
  }

  async clearAllFilters() {
    await expect(this.clearFiltersButton).toBeVisible();
    await this.clearFiltersButton.click();
    logger.info('All filters cleared');
  }

  async getTransactionList() {
    await expect(this.transactionTable).toBeVisible();
    const rowCount = await this.transactionRows.count();
    
    const transactions = [];
    for (let i = 0; i < rowCount; i++) {
      const row = this.transactionRows.nth(i);
      const transaction = {
        transactionId: await row.locator('.transaction-id').textContent(),
        cardId: await row.locator('.card-id').textContent(),
        timestamp: await row.locator('.timestamp').textContent(),
        amount: await row.locator('.amount').textContent(),
        merchantName: await row.locator('.merchant-name').textContent(),
        category: await row.locator('.category').textContent()
      };
      transactions.push(transaction);
    }
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    const message = await this.noTransactionsMessage.textContent();
    logger.info('No transactions message retrieved');
    return message;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info('Error message retrieved');
    return message;
  }

  async simulateDataSourceError() {
    await this.page.route('**/api/transactions', route => {
      route.abort('failed');
    });
    logger.info('Transaction data source error simulated');
  }
};