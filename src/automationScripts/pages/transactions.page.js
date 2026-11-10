const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.TransactionsPage = class TransactionsPage extends BasePage {
  constructor(page) {
    super(page);
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-row');
    this.transactionDetailsPanel = page.locator('[data-testid="transaction-details"], .panel-primary');
    this.categoryBadge = page.locator('[data-testid="category-badge"], .category-badge');
    this.errorMessage = page.locator('text=/Transaction not found or no longer available/i');
    this.sessionExpiredMessage = page.locator('text=/Session expired/i');
    this.noCardsMessage = page.locator('text=/No credit cards found/i');
    this.addCardButton = page.locator('button:has-text("Add Credit Card"), button:has-text("Manage Cards"), [data-testid="add-card-button"]');
    this.warningMessage = page.locator('text=/Some transactions may not be displayed/i');
    this.refreshButton = page.locator('button:has-text("Refresh"), [data-testid="refresh-button"]');
  }

  async navigate() {
    await super.navigate('/transactions');
    await this.waitForTransactionsLoad();
  }

  async waitForTransactionsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async selectTransaction(transactionId) {
    const transaction = this.page.locator(`[data-transaction-id="${transactionId}"], .transaction-row:has-text("${transactionId}")`);
    await this.clickElement(transaction);
    await this.page.waitForTimeout(500);
  }

  async getDetailField(fieldName) {
    let locator;
    switch (fieldName) {
      case 'transactionId':
        locator = this.transactionDetailsPanel.locator('td:has-text("Transaction ID:") + td');
        break;
      case 'merchantName':
        locator = this.transactionDetailsPanel.locator('td:has-text("Merchant:") + td');
        break;
      case 'amount':
        locator = this.transactionDetailsPanel.locator('td:has-text("Amount:") + td');
        break;
      case 'dateTime':
        locator = this.transactionDetailsPanel.locator('td:has-text("Date:") + td');
        break;
      case 'cardInfo':
        locator = this.transactionDetailsPanel.locator('td:has-text("Card:") + td');
        break;
      case 'status':
        locator = this.transactionDetailsPanel.locator('td:has-text("Status:") + td');
        break;
      case 'description':
        locator = this.transactionDetailsPanel.locator('td:has-text("Description:") + td');
        break;
      default:
        throw new Error(`Unknown field: ${fieldName}`);
    }
    return await this.getText(locator);
  }

  async getCategoryBadgeColor() {
    return await this.categoryBadge.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
  }

  async getTransactionCount() {
    return await this.getElementCount(this.transactionList);
  }

  async getAllTransactions() {
    const transactions = await this.transactionList.all();
    return await Promise.all(transactions.map(async (txn, index) => {
      const id = await txn.getAttribute('data-transaction-id') || `TXN${String(index + 1).padStart(3, '0')}`;
      return { id, element: txn };
    }));
  }

  async getTransactionDates() {
    const dateElements = await this.page.locator('.transaction-row small, [data-testid="transaction-date"]').all();
    return await Promise.all(dateElements.map(async el => await el.textContent()));
  }

  getTransactionCardLabel(transactionId) {
    return this.page.locator(`[data-transaction-id="${transactionId}"] [data-testid="card-label"], [data-transaction-id="${transactionId}"] small`);
  }

  getTransactionMerchant(transactionId) {
    return this.page.locator(`[data-transaction-id="${transactionId}"] strong, [data-transaction-id="${transactionId}"] [data-testid="merchant-name"]`);
  }

  getTransactionAmount(transactionId) {
    return this.page.locator(`[data-transaction-id="${transactionId}"] h4, [data-transaction-id="${transactionId}"] [data-testid="amount"]`);
  }

  getTransactionCategoryBadge(transactionId) {
    return this.page.locator(`[data-transaction-id="${transactionId}"] .category-badge, [data-transaction-id="${transactionId}"] [data-testid="category-badge"]`);
  }

  getTransactionDate(transactionId) {
    return this.page.locator(`[data-transaction-id="${transactionId}"] small, [data-transaction-id="${transactionId}"] [data-testid="transaction-date"]`);
  }

  async clickAddCardButton() {
    await this.clickElement(this.addCardButton);
  }

  async clickRefreshButton() {
    await this.clickElement(this.refreshButton);
  }
};