const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardListContainer = page.locator('.card-list-container');
    this.cardItems = page.locator('.card-item');
    this.cardNumber = page.locator('[data-testid="card-number"]');
    this.cardIssuer = page.locator('[data-testid="card-issuer"]');
    this.cardBalance = page.locator('[data-testid="card-balance"]');
    this.cardAvailableCredit = page.locator('[data-testid="card-available-credit"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardDetailMonthlySpend = page.locator('[data-testid="card-detail-monthly-spend"]');
    this.categoryBreakdown = page.locator('.category-breakdown');
    this.transactionCount = page.locator('[data-testid="transaction-count"]');
    this.lastTransactionDate = page.locator('[data-testid="last-transaction-date"]');
    this.transactionList = page.locator('.transaction-list');
    this.transactionItems = page.locator('.transaction-item');
    this.errorMessage = page.locator('.error-message');
    this.warningMessage = page.locator('.warning-message');
    this.retryButton = page.locator('button.retry');
    this.spendAnalysisError = page.locator('.spend-analysis-error');
    this.noTransactionsMessage = page.locator('.no-transactions-message');
  }

  async navigateToCardManagement() {
    await this.page.goto('https://app.creditcard.com/cards');
    await expect(this.cardListContainer).toBeVisible({ timeout: 5000 });
  }

  async getCardCount() {
    await expect(this.cardItems.first()).toBeVisible();
    return await this.cardItems.count();
  }

  async getAllCardNumbers() {
    await expect(this.cardItems.first()).toBeVisible();
    const cardNumbers = await this.cardItems.locator('[data-testid="card-number"]').allTextContents();
    return cardNumbers.map(num => num.trim());
  }

  async getAllCardBalances() {
    await expect(this.cardItems.first()).toBeVisible();
    const balances = await this.cardItems.locator('[data-testid="card-balance"]').allTextContents();
    return balances.map(bal => bal.trim());
  }

  async getAllAvailableCredits() {
    await expect(this.cardItems.first()).toBeVisible();
    const credits = await this.cardItems.locator('[data-testid="card-available-credit"]').allTextContents();
    return credits.map(cred => cred.trim());
  }

  async getAllIssuers() {
    await expect(this.cardItems.first()).toBeVisible();
    const issuers = await this.cardItems.locator('[data-testid="card-issuer"]').allTextContents();
    return issuers.map(issuer => issuer.trim());
  }

  async selectCard(cardId) {
    const cardSelector = `[data-card-id="${cardId}"]`;
    await this.page.locator(cardSelector).click();
    await this.page.waitForURL(/cards\/.*/, { timeout: 5000 });
  }

  async getWarningMessage() {
    if (await this.warningMessage.isVisible()) {
      return await this.warningMessage.textContent();
    }
    return '';
  }

  async getErrorMessage() {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return '';
  }

  async getCardDetailMonthlySpend() {
    await expect(this.cardDetailMonthlySpend).toBeVisible();
    return await this.cardDetailMonthlySpend.textContent();
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdown).toBeVisible();
    const categories = await this.categoryBreakdown.locator('.category-item').allTextContents();
    return categories;
  }

  async getTransactionCount() {
    await expect(this.transactionCount).toBeVisible();
    return await this.transactionCount.textContent();
  }

  async getLastTransactionDate() {
    await expect(this.lastTransactionDate).toBeVisible();
    return await this.lastTransactionDate.textContent();
  }

  async getAllTransactionCardIds() {
    await expect(this.transactionItems.first()).toBeVisible();
    const cardIds = await this.transactionItems.locator('[data-card-id]').allTextContents();
    return cardIds;
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async getSpendAnalysisError() {
    await expect(this.spendAnalysisError).toBeVisible();
    return await this.spendAnalysisError.textContent();
  }
};
