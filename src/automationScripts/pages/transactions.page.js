const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.transactionHistoryLink = page.locator('[data-testid="nav-transactions"], a:has-text("Transactions")');
    
    // Transaction List Locators
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list, .transaction-item');
    this.transactionItems = page.locator('[data-testid="transaction-item"], .transaction-item');
    
    // Transaction Detail Locators
    this.transactionId = page.locator('[data-testid="transaction-id"], .transaction-detail .transaction-id, p:has-text("Transaction ID")');
    this.transactionDate = page.locator('[data-testid="transaction-date"], .transaction-detail .date, p:has-text("Date")');
    this.merchantName = page.locator('[data-testid="merchant-name"], .transaction-detail .merchant, p:has-text("Merchant")');
    this.transactionAmount = page.locator('[data-testid="transaction-amount"], .transaction-detail .amount, p:has-text("Amount")');
    this.currency = page.locator('[data-testid="currency"], .transaction-detail .currency, p:has-text("Currency")');
    this.category = page.locator('[data-testid="category"], .transaction-detail .category, p:has-text("Category")');
    this.cardIdentifier = page.locator('[data-testid="card-identifier"], .transaction-detail .card, p:has-text("Card")');
    this.transactionStatus = page.locator('[data-testid="transaction-status"], .transaction-detail .status, p:has-text("Status")');
    this.transactionDescription = page.locator('[data-testid="transaction-description"], .transaction-detail .description, p:has-text("Description")');
    
    // Error Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
  }

  async navigateToTransactionHistory() {
    await this.transactionHistoryLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectTransaction(transactionId) {
    const transaction = this.page.locator(`[data-transaction-id="${transactionId}"], .transaction-item:has-text("${transactionId}")`);
    await expect(transaction).toBeVisible();
    await transaction.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionDetails() {
    await expect(this.transactionId).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionList() {
    await expect(this.transactionList).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCardIdentifiers() {
    await expect(this.transactionItems.first()).toBeVisible();
    const items = await this.transactionItems.all();
    const identifiers = [];
    for (const item of items) {
      const cardText = await item.locator('.card-last4, [data-testid="card-last4"]').textContent();
      if (cardText) {
        identifiers.push(cardText.trim());
      }
    }
    return [...new Set(identifiers)]; // Return unique identifiers
  }

  async getAllTransactions() {
    await expect(this.transactionItems.first()).toBeVisible();
    const items = await this.transactionItems.all();
    const transactions = [];
    for (const item of items) {
      const dateText = await item.locator('.date, [data-testid="date"]').textContent();
      const amountText = await item.locator('.amount, [data-testid="amount"]').textContent();
      transactions.push({
        date: dateText ? dateText.trim() : '',
        amount: amountText ? amountText.trim() : ''
      });
    }
    return transactions;
  }
};
