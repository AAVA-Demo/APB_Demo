const { expect } = require('@playwright/test');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    this.cardDetailContainer = page.locator('.card-detail-view');
    this.creditLimitField = page.locator('.detail-row:has-text("Credit Limit") .value');
    this.availableCreditField = page.locator('.detail-row:has-text("Available Credit") .value');
    this.outstandingBalanceField = page.locator('.detail-row:has-text("Outstanding Balance") .value');
    this.statementBalanceField = page.locator('.detail-row:has-text("Statement Balance") .value');
    this.minimumPaymentField = page.locator('.detail-row:has-text("Minimum Payment") .value');
    this.dueDateField = page.locator('.detail-row:has-text("Due Date") .value');
    this.recentTransactionsSection = page.locator('.detail-section:has-text("Recent Transactions")');
    this.transactionRows = page.locator('.detail-section table tbody tr');
    this.errorMessage = page.locator('.error-message');
    this.backButton = page.locator('button:has-text("Back")');
    this.retryButton = page.locator('button.retry-button');
    this.navigationMenu = page.locator('nav.navbar');
  }

  async waitForCardDetailLoad() {
    await this.cardDetailContainer.waitFor({ state: 'visible', timeout: 2000 });
  }

  async getCreditLimit() {
    await expect(this.creditLimitField).toBeVisible();
    return await this.creditLimitField.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditField).toBeVisible();
    return await this.availableCreditField.textContent();
  }

  async getOutstandingBalance() {
    await expect(this.outstandingBalanceField).toBeVisible();
    return await this.outstandingBalanceField.textContent();
  }

  async getStatementBalance() {
    await expect(this.statementBalanceField).toBeVisible();
    return await this.statementBalanceField.textContent();
  }

  async getMinimumPayment() {
    await expect(this.minimumPaymentField).toBeVisible();
    return await this.minimumPaymentField.textContent();
  }

  async getDueDate() {
    await expect(this.dueDateField).toBeVisible();
    return await this.dueDateField.textContent();
  }

  async getRecentTransactionCount() {
    return await this.transactionRows.count();
  }

  async clickBackButton() {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};
