const { expect } = require('@playwright/test');
const config = require('../../config/config');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardListContainer = page.locator('.card-list-container, [data-testid="card-list"]');
    this.cardItems = page.locator('.card-item, [data-testid="card-item"]');
    this.cardNumber = page.locator('.card-number');
    this.cardType = page.locator('.card-type');
    this.expiryDate = page.locator('.expiry-date');
    this.creditLimit = page.locator('.credit-limit');
    this.availableCredit = page.locator('.available-credit');
    this.noCardsMessage = page.locator('.no-cards-message');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.spendAnalysisSection = page.locator('.spend-analysis-section');
    this.totalSpend = page.locator('[data-testid="total-spend"]');
    this.transactionCount = page.locator('[data-testid="transaction-count"]');
    this.categoryBreakdown = page.locator('.category-breakdown');
    this.transactionHistory = page.locator('.transaction-history-item');
    this.noTransactionsMessage = page.locator('.no-transactions-message');
    this.spendAnalysisPlaceholder = page.locator('.spend-analysis-placeholder');
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/cards`);
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to card management page');
  }

  async waitForCardsToLoad() {
    await expect(this.cardListContainer).toBeVisible({ timeout: 5000 });
    logger.info('Card list loaded');
  }

  async getCardCount() {
    await this.waitForCardsToLoad();
    return await this.cardItems.count();
  }

  async getCardNumbers() {
    await this.waitForCardsToLoad();
    return await this.cardNumber.allTextContents();
  }

  async getCardTypes() {
    await this.waitForCardsToLoad();
    return await this.cardType.allTextContents();
  }

  async getExpiryDates() {
    await this.waitForCardsToLoad();
    return await this.expiryDate.allTextContents();
  }

  async getCreditLimits() {
    await this.waitForCardsToLoad();
    return await this.creditLimit.allTextContents();
  }

  async getAvailableCredits() {
    await this.waitForCardsToLoad();
    return await this.availableCredit.allTextContents();
  }

  async waitForNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible({ timeout: 5000 });
    logger.info('No cards message displayed');
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    logger.info('Error message displayed');
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async hasCardById(cardId) {
    const cardLocator = this.page.locator(`[data-card-id="${cardId}"]`);
    return await cardLocator.isVisible();
  }

  async selectCardByMaskedNumber(maskedNumber) {
    const cardLocator = this.page.locator(`.card-item:has-text("${maskedNumber}")`);
    await expect(cardLocator).toBeVisible();
    await cardLocator.click();
    logger.info(`Selected card: ${maskedNumber}`);
  }

  async waitForSpendAnalysisToLoad() {
    await expect(this.spendAnalysisSection).toBeVisible({ timeout: 5000 });
    logger.info('Spend analysis section loaded');
  }

  async getTotalSpend() {
    await expect(this.totalSpend).toBeVisible();
    return await this.totalSpend.textContent();
  }

  async getTransactionCount() {
    await expect(this.transactionCount).toBeVisible();
    const text = await this.transactionCount.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdown).toBeVisible();
    const categories = await this.categoryBreakdown.locator('.category-item').allTextContents();
    const breakdown = {};
    categories.forEach(cat => {
      const match = cat.match(/(.+):\s*\$([\d,]+)/);
      if (match) {
        breakdown[match[1].trim()] = parseFloat(match[2].replace(',', ''));
      }
    });
    return breakdown;
  }

  async getTransactionHistory() {
    return await this.transactionHistory.allTextContents();
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async hasSpendAnalysisPlaceholders() {
    const count = await this.spendAnalysisPlaceholder.count();
    return count > 0;
  }
};