const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    this.portfolioContainer = page.locator('.portfolio-container');
    this.cardListContainer = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.pageHeader = page.locator('header');
    this.navigationMenu = page.locator('nav');
    this.transactionHistoryTable = page.locator('.transaction-history-table');
    this.transactionRows = page.locator('.transaction-row');
    this.emptyTransactionMessage = page.locator('.empty-transaction-message');
    this.transactionTableHeader = page.locator('.transaction-table-header');
    this.paginationControls = page.locator('.pagination-controls');
    this.nextPageButton = page.locator('button.next-page');
    this.loadingIndicator = page.locator('.loading-spinner');
  }

  async navigateToPortfolio() {
    logger.info('Navigating to portfolio page');
    await this.page.click('a[href="/portfolio"]');
    await this.page.waitForLoadState('networkidle');
    logger.info('Portfolio page loaded');
  }

  async waitForPortfolioLoad() {
    logger.info('Waiting for portfolio to load');
    await expect(this.portfolioContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    if (await this.loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.loadingIndicator).toBeHidden({ timeout: 5000 });
    }
    logger.info('Portfolio loaded');
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  getCardByIndex(index) {
    return this.cardItems.nth(index);
  }

  getCardNumber(index) {
    return this.cardItems.nth(index).locator('.card-number');
  }

  getCardType(index) {
    return this.cardItems.nth(index).locator('.card-type');
  }

  getCardBalance(index) {
    return this.cardItems.nth(index).locator('.card-balance');
  }

  async getEmptyStateText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async isCardListScrollable() {
    const scrollHeight = await this.cardListContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await this.cardListContainer.evaluate(el => el.clientHeight);
    return scrollHeight > clientHeight;
  }

  async scrollCardList() {
    logger.info('Scrolling card list');
    await this.cardListContainer.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });
    await this.page.waitForTimeout(500);
    logger.info('Card list scrolled');
  }

  async selectCard(cardNumber) {
    logger.info(`Selecting card: ${cardNumber}`);
    await this.page.click(`.card-item:has-text("${cardNumber}")`);
    await this.page.waitForLoadState('networkidle');
    logger.info('Card selected');
  }

  async getTransactionByIndex(index) {
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    return {
      date: await row.locator('.transaction-date').textContent(),
      merchant: await row.locator('.transaction-merchant').textContent(),
      amount: await row.locator('.transaction-amount').textContent(),
      category: await row.locator('.transaction-category').textContent()
    };
  }

  async getTransactionCount() {
    return await this.transactionRows.count();
  }

  async getAllTransactionDates() {
    const dates = [];
    const count = await this.transactionRows.count();
    for (let i = 0; i < count; i++) {
      const dateText = await this.transactionRows.nth(i).locator('.transaction-date').textContent();
      dates.push(dateText.trim());
    }
    return dates;
  }

  async getEmptyTransactionText() {
    await expect(this.emptyTransactionMessage).toBeVisible();
    return await this.emptyTransactionMessage.textContent();
  }

  async getVisibleTransactionCount() {
    return await this.transactionRows.count();
  }

  async clickNextPage() {
    logger.info('Clicking next page button');
    await expect(this.nextPageButton).toBeVisible();
    await this.nextPageButton.click();
    logger.info('Next page clicked');
  }

  async waitForTransactionsLoad() {
    await this.page.waitForLoadState('networkidle');
    if (await this.loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.loadingIndicator).toBeHidden({ timeout: 5000 });
    }
  }
};