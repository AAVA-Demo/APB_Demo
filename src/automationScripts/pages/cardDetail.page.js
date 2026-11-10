const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    this.creditLimitField = page.locator('[data-testid="credit-limit"]');
    this.availableCreditField = page.locator('[data-testid="available-credit"]');
    this.outstandingBalanceField = page.locator('[data-testid="outstanding-balance"]');
    this.spendingPatternsSection = page.locator('[data-testid="spending-patterns"]');
    this.recentTransactionsSection = page.locator('[data-testid="recent-transactions"]');
    this.backToPortfolioButton = page.locator('button:has-text("Back to Portfolio"), a:has-text("View All Cards")');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.spendingPatternsError = page.locator('[data-testid="spending-patterns-error"]');
    this.transactionsError = page.locator('[data-testid="transactions-error"]');
  }

  async waitForPageToLoad() {
    await expect(this.creditLimitField).toBeVisible({ timeout: 2000 });
    logger.info('Card detail page loaded');
  }

  async getCreditLimit() {
    await expect(this.creditLimitField).toBeVisible();
    const value = await this.creditLimitField.textContent();
    logger.info(`Credit limit: ${value}`);
    return value.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditField).toBeVisible();
    const value = await this.availableCreditField.textContent();
    logger.info(`Available credit: ${value}`);
    return value.trim();
  }

  async getOutstandingBalance() {
    await expect(this.outstandingBalanceField).toBeVisible();
    const value = await this.outstandingBalanceField.textContent();
    logger.info(`Outstanding balance: ${value}`);
    return value.trim();
  }

  async hasSpendingPatterns() {
    const isVisible = await this.spendingPatternsSection.isVisible();
    logger.info(`Spending patterns visible: ${isVisible}`);
    return isVisible;
  }

  async getRecentTransactionCount() {
    const transactions = this.recentTransactionsSection.locator('.transaction-item, tr');
    const count = await transactions.count();
    logger.info(`Recent transactions count: ${count}`);
    return count;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info(`Error message: ${message}`);
    return message.trim();
  }

  async clickBackToPortfolio() {
    await expect(this.backToPortfolioButton).toBeVisible();
    await this.backToPortfolioButton.click();
    logger.info('Clicked Back to Portfolio button');
  }

  async getSpendingPatternsError() {
    await expect(this.spendingPatternsError).toBeVisible();
    const message = await this.spendingPatternsError.textContent();
    logger.info(`Spending patterns error: ${message}`);
    return message.trim();
  }

  async getTransactionsError() {
    await expect(this.transactionsError).toBeVisible();
    const message = await this.transactionsError.textContent();
    logger.info(`Transactions error: ${message}`);
    return message.trim();
  }

  async canNavigateBack() {
    const isVisible = await this.backToPortfolioButton.isVisible();
    const isEnabled = await this.backToPortfolioButton.isEnabled();
    logger.info(`Can navigate back: ${isVisible && isEnabled}`);
    return isVisible && isEnabled;
  }
};
