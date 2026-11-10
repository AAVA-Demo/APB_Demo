const { expect } = require('@playwright/test');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    this.spendingAnalysisLink = page.locator('a[href*="spending-analysis"]');
    this.transactionsContainer = page.locator('.transactions-container');
    this.transactionRows = page.locator('.transaction-row');
    this.totalSpendElement = page.locator('[data-testid="total-spend"]');
    this.topCategoryElement = page.locator('[data-testid="top-category"]');
    this.categoryElements = page.locator('.category-item');
    this.nextPageButton = page.locator('button[data-testid="next-page"]');
    this.backToCardsLink = page.locator('a[data-testid="back-to-cards"]');
    this.noDataMessage = page.locator('.no-data-message');
  }

  async navigateToSpendingAnalysis() {
    await this.spendingAnalysisLink.click();
    await this.page.waitForURL('**/spending-analysis');
  }

  async waitForTransactionsToLoad() {
    await expect(this.transactionsContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactions() {
    await this.waitForTransactionsToLoad();
    return await this.transactionRows.all();
  }

  async getTransactionCardNumber(transaction) {
    const cardNumberElement = transaction.locator('.card-number');
    return await cardNumberElement.textContent();
  }

  async getTotalSpend() {
    await expect(this.totalSpendElement).toBeVisible();
    const text = await this.totalSpendElement.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTopCategory() {
    await expect(this.topCategoryElement).toBeVisible();
    return await this.topCategoryElement.textContent();
  }

  async getCategoryAmount(categoryName) {
    const category = this.page.locator(`.category-item:has-text("${categoryName}")`);
    await expect(category).toBeVisible();
    const amountElement = category.locator('.amount');
    const text = await amountElement.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getAllCategoryTotals() {
    const categories = await this.categoryElements.all();
    const totals = [];
    for (const category of categories) {
      const amountElement = category.locator('.amount');
      const text = await amountElement.textContent();
      totals.push(parseFloat(text.replace(/[^0-9.]/g, '')));
    }
    return totals;
  }

  async clickNextPage() {
    await expect(this.nextPageButton).toBeVisible();
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickBackToCards() {
    await expect(this.backToCardsLink).toBeVisible();
    await this.backToCardsLink.click();
    await this.page.waitForURL('**/cards');
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }
};