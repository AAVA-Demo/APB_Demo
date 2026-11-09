const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardList = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.noCardsMessage = page.locator('.alert-info');
    this.errorMessage = page.locator('.alert-danger');
    this.totalSpend = page.locator('[data-testid="total-spend"]');
    this.transactionCount = page.locator('[data-testid="transaction-count"]');
    this.spendingTrendsChart = page.locator('#spending-trends-chart');
    this.categoryBreakdown = page.locator('.category-breakdown');
    this.noTransactionMessage = page.locator('.no-transaction-message');
  }

  async navigate() {
    await this.page.goto('/cards');
    logger.info('Card management page loaded');
  }

  async waitForCardList() {
    await expect(this.cardList).toBeVisible({ timeout: 2000 });
  }

  async getAllCards() {
    const cardElements = await this.cardItems.all();
    const cards = [];
    for (const card of cardElements) {
      const name = await card.locator('.card-name').textContent();
      const creditLimit = await card.locator('.credit-limit').textContent();
      const currentBalance = await card.locator('.current-balance').textContent();
      cards.push({
        name: name.trim(),
        creditLimit: parseFloat(creditLimit.replace(/[^0-9.]/g, '')),
        currentBalance: parseFloat(currentBalance.replace(/[^0-9.]/g, ''))
      });
    }
    return cards;
  }

  async selectCard(cardName) {
    await this.page.locator(`.card-item:has-text("${cardName}")`).click();
    await expect(this.totalSpend).toBeVisible();
    logger.info(`Card selected: ${cardName}`);
  }

  async getTotalSpend() {
    const text = await this.totalSpend.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTransactionCount() {
    const text = await this.transactionCount.textContent();
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  async getCategoryBreakdownData() {
    const categoryElements = await this.categoryBreakdown.locator('.category-item').all();
    const categories = [];
    for (const elem of categoryElements) {
      const name = await elem.locator('.category-name').textContent();
      const amount = await elem.locator('.category-amount').textContent();
      categories.push({
        name: name.trim(),
        amount: parseFloat(amount.replace(/[^0-9.]/g, ''))
      });
    }
    return categories;
  }
};
