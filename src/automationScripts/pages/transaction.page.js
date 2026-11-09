const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const config = require('../../config/environment');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    // Main Elements
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list, table');
    this.transactionTable = page.locator('[data-testid="transaction-table"], table.table');
    this.transactionRows = page.locator('[data-testid="transaction-row"], tbody tr');
    
    // Filter Elements
    this.startDateInput = page.locator('[data-testid="start-date"], input[name="startDate"]');
    this.endDateInput = page.locator('[data-testid="end-date"], input[name="endDate"]');
    this.cardDropdown = page.locator('[data-testid="card-filter"], select[name="card"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter"], button:has-text("Apply Filter")');
    this.clearFilterButton = page.locator('[data-testid="clear-filter"], button:has-text("Clear")');
    
    // Empty State
    this.emptyStateContainer = page.locator('[data-testid="empty-state"], .empty-state, .no-transactions');
    
    // Validation
    this.validationError = page.locator('[data-testid="validation-error"], .error-message, .alert-danger');
    
    // Result Count
    this.resultCountLabel = page.locator('[data-testid="result-count"], .result-count');
  }

  async navigate() {
    logger.info('Navigating to transaction page');
    await this.page.goto(config.baseUrl + '/transactions');
    await expect(this.transactionList).toBeVisible({ timeout: 10000 });
    logger.info('Transaction page loaded successfully');
  }

  async setStartDate(date) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(date);
    logger.info(`Start date set to: ${date}`);
  }

  async setEndDate(date) {
    await expect(this.endDateInput).toBeVisible();
    await this.endDateInput.fill(date);
    logger.info(`End date set to: ${date}`);
  }

  async selectCard(cardName) {
    await expect(this.cardDropdown).toBeVisible();
    await this.cardDropdown.selectOption({ label: cardName });
    logger.info(`Card selected: ${cardName}`);
  }

  async clickApplyFilter() {
    await expect(this.applyFilterButton).toBeVisible();
    await this.applyFilterButton.click();
    logger.info('Apply filter button clicked');
  }

  async waitForFilterResults() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
    logger.info('Filter results loaded');
  }

  async getAllTransactions() {
    await expect(this.transactionRows.first()).toBeVisible();
    const count = await this.transactionRows.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const cells = row.locator('td');
      
      transactions.push({
        date: await cells.nth(0).textContent(),
        cardName: await cells.nth(1).textContent(),
        merchant: await cells.nth(2).textContent(),
        category: await cells.nth(3).textContent(),
        amount: await cells.nth(4).textContent(),
        status: await cells.nth(5).textContent()
      });
    }
    
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async getResultCount() {
    await expect(this.resultCountLabel).toBeVisible();
    const text = await this.resultCountLabel.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async getTransactionCount() {
    return await this.transactionRows.count();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateContainer).toBeVisible();
    return await this.emptyStateContainer.textContent();
  }

  async getValidationErrorText() {
    await expect(this.validationError).toBeVisible();
    return await this.validationError.textContent();
  }

  async isCardVisible(cardName) {
    await expect(this.cardDropdown).toBeVisible();
    const options = await this.cardDropdown.locator('option').allTextContents();
    return options.some(opt => opt.includes(cardName));
  }

  async getCardOptions() {
    await expect(this.cardDropdown).toBeVisible();
    return await this.cardDropdown.locator('option').allTextContents();
  }

  async getSelectedCard() {
    await expect(this.cardDropdown).toBeVisible();
    return await this.cardDropdown.inputValue();
  }

  async getTableRowCount() {
    return await this.transactionRows.count();
  }
};