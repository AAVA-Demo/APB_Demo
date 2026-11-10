const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    this.cardDetailContainer = page.locator('.card-detail-panel');
    this.creditLimitField = page.locator('[data-testid="credit-limit"]');
    this.currentBalanceField = page.locator('[data-testid="current-balance"]');
    this.availableCreditField = page.locator('[data-testid="available-credit"]');
    this.transactionList = page.locator('.transaction-table tbody tr');
    this.errorMessage = page.locator('.error-message');
    this.backToDashboardButton = page.locator('button:has-text("Back to Dashboard")');
    this.forbiddenError = page.locator('.forbidden-error');
    this.unauthorizedAccessMessage = page.locator('.unauthorized-message');
  }

  async getCreditLimit() {
    logger.info('Getting credit limit');
    await expect(this.creditLimitField).toBeVisible();
    return await this.creditLimitField.textContent();
  }

  async getCurrentBalance() {
    logger.info('Getting current balance');
    await expect(this.currentBalanceField).toBeVisible();
    return await this.currentBalanceField.textContent();
  }

  async getAvailableCredit() {
    logger.info('Getting available credit');
    await expect(this.availableCreditField).toBeVisible();
    return await this.availableCreditField.textContent();
  }

  async getTransactionCount() {
    logger.info('Getting transaction count');
    await expect(this.transactionList.first()).toBeVisible();
    return await this.transactionList.count();
  }

  async verifyTransactionDetails(index, amount, date, merchant) {
    logger.info(`Verifying transaction ${index}: ${amount}, ${date}, ${merchant}`);
    const transaction = this.transactionList.nth(index);
    await expect(transaction).toBeVisible();
    const transactionText = await transaction.textContent();
    expect(transactionText).toContain(amount);
    expect(transactionText).toContain(date);
    expect(transactionText).toContain(merchant);
  }
};
