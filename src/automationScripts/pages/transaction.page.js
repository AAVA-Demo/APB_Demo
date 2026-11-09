const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    this.transactionsMenu = page.locator('a:has-text("Transactions"), [href*="transactions"]');
    this.transactionList = page.locator('.transaction-list, [data-list="transactions"]');
    this.transactionItems = page.locator('.transaction-item, [data-item="transaction"]');
    this.cardFilter = page.locator('select[name="card"], .card-filter, [data-filter="card"]');
    this.dateFilter = page.locator('input[type="date"], .date-filter, [data-filter="date"]');
    this.searchInput = page.locator('input[type="search"], .search-input, [data-input="search"]');
    this.emptyStateMessage = page.locator('.empty-state, .no-transactions-message');
    this.paginationControls = page.locator('.pagination, [data-component="pagination"]');
    this.nextPageButton = page.locator('button:has-text("Next"), .pagination-next');
    this.previousPageButton = page.locator('button:has-text("Previous"), .pagination-previous');
  }

  async navigateToTransactions() {
    await expect(this.transactionsMenu).toBeVisible();
    await this.transactionsMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    return await this.transactionItems.count();
  }

  async getAllTransactions() {
    await expect(this.transactionItems.first()).toBeVisible();
    const items = await this.transactionItems.all();
    const transactions = [];
    for (const item of items) {
      const merchantName = await item.locator('.merchant-name, [data-field="merchant"]').textContent();
      const date = await item.locator('.transaction-date, [data-field="date"]').textContent();
      const amount = await item.locator('.transaction-amount, [data-field="amount"]').textContent();
      const cardUsed = await item.locator('.card-used, [data-field="card"]').textContent();
      transactions.push({ merchantName, date, amount, cardUsed });
    }
    return transactions;
  }

  async filterByCard(cardName) {
    await expect(this.cardFilter).toBeVisible();
    await this.cardFilter.selectOption({ label: cardName });
    await this.page.waitForLoadState('networkidle');
  }

  async applyDateFilter(startDate, endDate) {
    const dateInputs = await this.dateFilter.all();
    if (dateInputs.length >= 2) {
      await dateInputs[0].fill(startDate);
      await dateInputs[1].fill(endDate);
    }
    await this.page.waitForLoadState('networkidle');
  }

  async searchTransactions(searchTerm) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(searchTerm);
    await this.page.waitForLoadState('networkidle');
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async clickNextPage() {
    await expect(this.nextPageButton).toBeVisible();
    await expect(this.nextPageButton).toBeEnabled();
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPreviousPage() {
    await expect(this.previousPageButton).toBeVisible();
    await expect(this.previousPageButton).toBeEnabled();
    await this.previousPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isPaginationVisible() {
    return await this.paginationControls.isVisible();
  }
};