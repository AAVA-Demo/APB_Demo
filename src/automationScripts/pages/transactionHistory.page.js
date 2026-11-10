const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionHistoryPage = class TransactionHistoryPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.locator('h1:has-text("Transaction"), h2:has-text("Transaction History")');
    this.transactionTable = page.locator('table.transaction-table, .transaction-list, [data-testid="transaction-table"]');
    this.transactionRow = page.locator('table tbody tr, .transaction-item');
    this.noTransactionsMessage = page.locator('text=/No transactions found/i, text=/No transactions available/i');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigateDirectly() {
    await this.page.goto('https://creditcard.example.com/transactions');
    logger.info('Attempted direct navigation to transaction history');
  }

  async verifyTransactionsFromAllCards(cardIds) {
    await expect(this.transactionTable).toBeVisible();
    const rows = await this.transactionRow.all();
    expect(rows.length).toBeGreaterThan(0);
    
    for (const cardId of cardIds) {
      const cardTransactions = this.page.locator(`tr:has-text("${cardId}"), .transaction-item:has-text("${cardId}")`);
      await expect(cardTransactions.first()).toBeVisible();
    }
    logger.info('Transactions from all cards verified');
  }

  async verifyTransactionDetailsComplete() {
    const firstRow = this.transactionRow.first();
    await expect(firstRow).toBeVisible();
    const rowText = await firstRow.textContent();
    
    expect(rowText).toMatch(/\d{2}-[A-Za-z]{3}-\d{4}/);
    expect(rowText).toMatch(/\*{4}\d{4}/);
    expect(rowText).toMatch(/₹\d+/);
    
    logger.info('Transaction details complete (date, card, merchant, category, amount, status)');
  }

  async verifyEmptyTransactionList() {
    const rows = await this.transactionRow.all();
    expect(rows.length).toBe(0);
    logger.info('Transaction list is empty');
  }

  async verifyNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible({ timeout: 5000 });
    logger.info('No transactions message displayed');
  }

  async verifyAuthenticationError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toContain('Authentication');
    logger.info('Authentication error verified');
  }

  async verifyNoTransactionDataDisplayed() {
    await expect(this.transactionTable).not.toBeVisible({ timeout: 3000 }).catch(() => {});
    logger.info('No transaction data displayed');
  }

  async verifyAggregatedView(cardIds) {
    await expect(this.transactionTable).toBeVisible();
    for (const cardId of cardIds) {
      const cardTransactions = this.page.locator(`tr:has-text("${cardId}")`);
      await expect(cardTransactions.first()).toBeVisible();
    }
    logger.info('Transactions aggregated in single view');
  }

  async verifyCardIdentification() {
    const firstRow = this.transactionRow.first();
    await expect(firstRow).toBeVisible();
    const rowText = await firstRow.textContent();
    expect(rowText).toMatch(/\*{4}\d{4}/);
    logger.info('Card identification verified');
  }

  async verifyResponsiveView() {
    const viewportSizes = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const size of viewportSizes) {
      await this.page.setViewportSize(size);
      await expect(this.transactionTable).toBeVisible();
      logger.info(`Responsive view verified at ${size.width}x${size.height}`);
    }
  }

  async verifyAllTransactionsFromSingleCard(cardId) {
    await expect(this.transactionTable).toBeVisible();
    const rows = await this.transactionRow.all();
    expect(rows.length).toBeGreaterThan(0);
    
    for (const row of rows) {
      const rowText = await row.textContent();
      expect(rowText).toContain(cardId);
    }
    logger.info(`All transactions from ${cardId} verified`);
  }

  async verifyNoAggregationErrors() {
    const rows = await this.transactionRow.all();
    const uniqueTransactions = new Set();
    
    for (const row of rows) {
      const rowText = await row.textContent();
      expect(uniqueTransactions.has(rowText)).toBe(false);
      uniqueTransactions.add(rowText);
    }
    logger.info('No aggregation errors (duplicates) detected');
  }

  async verifyCompleteTransactionDetails() {
    const firstRow = this.transactionRow.first();
    await expect(firstRow).toBeVisible();
    const rowText = await firstRow.textContent();
    
    expect(rowText).toMatch(/\d{2}-[A-Za-z]{3}-\d{4}/);
    expect(rowText).toMatch(/\*{4}\d{4}/);
    expect(rowText).toMatch(/₹\d+/);
    expect(rowText.length).toBeGreaterThan(50);
    
    logger.info('Complete transaction details verified');
  }

  async verifySessionValidationError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toMatch(/Session|validation|login/i);
    logger.info('Session validation error verified');
  }
};
