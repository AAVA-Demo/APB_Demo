const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.myCardsMenu = page.locator('a:has-text("My Cards"), [href*="cards"], [href*="my-cards"]');
    this.cardList = page.locator('.card-list, [data-list="cards"]');
    this.cardItems = page.locator('.card-item, [data-item="card"]');
    this.emptyStateMessage = page.locator('.empty-state, .no-cards-message');
    this.cardStatusIndicators = page.locator('.card-status, [data-field="status"]');
    this.spendingAnalysisLink = page.locator('a:has-text("Spending Analysis"), [href*="spending-analysis"]');
    this.totalSpendValue = page.locator('.total-spend-value, [data-metric="total-spend"]');
    this.monthlySpendValue = page.locator('.monthly-spend-value, [data-metric="monthly-spend"]');
    this.spendingTrendChart = page.locator('.spending-trend-chart, [data-chart="spending-trend"]');
    this.noSpendingDataMessage = page.locator('.no-spending-data-message, .empty-spending-state');
    this.transactionsLink = page.locator('a:has-text("Transactions"), [href*="transactions"]');
    this.transactionAmounts = page.locator('.transaction-amount, [data-field="amount"]');
  }

  async navigateToMyCards() {
    await expect(this.myCardsMenu).toBeVisible();
    await this.myCardsMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    const count = await this.cardItems.count();
    return count;
  }

  async getAllCardDetails() {
    await expect(this.cardItems.first()).toBeVisible();
    const items = await this.cardItems.all();
    const cards = [];
    for (const item of items) {
      const name = await item.locator('.card-name, [data-field="name"]').textContent();
      const maskedNumber = await item.locator('.card-number, [data-field="number"]').textContent();
      const type = await item.locator('.card-type, [data-field="type"]').textContent();
      const status = await item.locator('.card-status, [data-field="status"]').textContent();
      cards.push({ name, maskedNumber, type, status });
    }
    return cards;
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getCardStatusColors() {
    await expect(this.cardStatusIndicators.first()).toBeVisible();
    const statusElements = await this.cardStatusIndicators.all();
    const colors = [];
    for (const element of statusElements) {
      const color = await element.evaluate(el => window.getComputedStyle(el).color);
      colors.push(color);
    }
    return colors;
  }

  async selectCard(cardName) {
    const card = this.cardItems.filter({ hasText: cardName });
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSpendingAnalysis() {
    await expect(this.spendingAnalysisLink).toBeVisible();
    await this.spendingAnalysisLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpendValue() {
    await expect(this.totalSpendValue).toBeVisible();
    return await this.totalSpendValue.textContent();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  async getNoSpendingDataMessageText() {
    await expect(this.noSpendingDataMessage).toBeVisible();
    return await this.noSpendingDataMessage.textContent();
  }

  async navigateToTransactions() {
    await expect(this.transactionsLink).toBeVisible();
    await this.transactionsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactionAmounts() {
    await expect(this.transactionAmounts.first()).toBeVisible();
    return await this.transactionAmounts.allTextContents();
  }
};