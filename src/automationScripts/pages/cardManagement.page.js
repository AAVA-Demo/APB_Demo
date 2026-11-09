const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.cardManagementLink = page.locator('a[href="/cards"]');
    this.cardListContainer = page.locator('.card-list-container');
    this.cardItem = page.locator('.card-item');
    this.cardById = (cardId) => page.locator(`[data-card-id="${cardId}"]`);
    this.cardType = (cardId) => page.locator(`[data-card-id="${cardId}"] .card-type`);
    this.cardCreditLimit = (cardId) => page.locator(`[data-card-id="${cardId}"] .credit-limit`);
    this.emptyListMessage = page.locator('.empty-list-message');
    this.errorMessage = page.locator('.error-message');
    this.spendAnalysisContainer = page.locator('.spend-analysis-container');
    this.totalSpendValue = page.locator('.total-spend-value');
    this.transactionRow = page.locator('.transaction-row');
    this.noTransactionsMessage = page.locator('.no-transactions-message');
    this.cardNotFoundError = page.locator('.card-not-found-error');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL(/login/);
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/dashboard|cards/);
    logger.info(`Logged in as ${username}`);
  }

  async navigateToCardManagement() {
    await expect(this.cardManagementLink).toBeVisible();
    await this.cardManagementLink.click();
    await this.page.waitForURL(/cards/);
    logger.info('Navigated to card management page');
  }

  async waitForCardListLoad() {
    await expect(this.cardListContainer).toBeVisible({ timeout: 10000 });
    logger.info('Card list loaded');
  }

  async getCardCount() {
    const count = await this.cardItem.count();
    return count;
  }

  async getAllCardIds() {
    await expect(this.cardItem.first()).toBeVisible();
    const items = await this.cardItem.all();
    const cardIds = [];
    for (const item of items) {
      const cardId = await item.getAttribute('data-card-id');
      cardIds.push(cardId);
    }
    return cardIds;
  }

  async getCardType(cardId) {
    await expect(this.cardType(cardId)).toBeVisible();
    const type = await this.cardType(cardId).textContent();
    return type.trim();
  }

  async getCardCreditLimit(cardId) {
    await expect(this.cardCreditLimit(cardId)).toBeVisible();
    const limit = await this.cardCreditLimit(cardId).textContent();
    return limit.trim();
  }

  async getEmptyListMessage() {
    await expect(this.emptyListMessage).toBeVisible();
    return await this.emptyListMessage.textContent();
  }

  async simulateServiceUnavailable() {
    await this.page.route('**/api/cards/**', route => {
      route.abort('failed');
    });
    logger.info('Service unavailability simulated');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async selectCard(cardId) {
    await expect(this.cardById(cardId)).toBeVisible();
    await this.cardById(cardId).click();
    logger.info(`Selected card: ${cardId}`);
  }

  async waitForSpendAnalysisLoad() {
    await expect(this.spendAnalysisContainer).toBeVisible({ timeout: 5000 });
    logger.info('Spend analysis loaded');
  }

  async getTotalSpend() {
    await expect(this.totalSpendValue).toBeVisible();
    const value = await this.totalSpendValue.textContent();
    return value.trim();
  }

  async getTransactionDetails() {
    await expect(this.transactionRow.first()).toBeVisible();
    const rows = await this.transactionRow.all();
    const transactions = [];
    for (const row of rows) {
      const id = await row.getAttribute('data-txn-id');
      const amountText = await row.locator('.txn-amount').textContent();
      transactions.push({ id, amount: amountText.trim() });
    }
    return transactions;
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async attemptAccessToCard(cardId) {
    await this.page.goto(`/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
    logger.info(`Attempted to access card: ${cardId}`);
  }

  async getCardNotFoundError() {
    await expect(this.cardNotFoundError).toBeVisible({ timeout: 5000 });
    return await this.cardNotFoundError.textContent();
  }
};