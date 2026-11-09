const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    this.transactionListHeader = page.locator('h1:has-text("Transactions")');
    this.transactionRows = page.locator('.transaction-row');
    this.noTransactionsMessage = page.locator('.no-transactions-message');
    this.emptyStateIcon = page.locator('.empty-state-icon');
    this.dateFilterStartInput = page.locator('#date-filter-start');
    this.dateFilterEndInput = page.locator('#date-filter-end');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    this.clearFilterButton = page.locator('button:has-text("Clear Filter")');
    this.transactionDetailContainer = page.locator('.transaction-detail-container');
    this.transactionNotFoundError = page.locator('.transaction-not-found');
    this.backToTransactionsButton = page.locator('button:has-text("Back to Transactions")');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await expect(this.transactionListHeader).toBeVisible();
  }

  async navigateToTransactionDetail(transactionId) {
    await this.page.goto(`/transactions/${transactionId}`);
  }

  async getTransactionsByCard(cardName) {
    const transactions = [];
    const rows = await this.transactionRows.all();
    for (const row of rows) {
      const cardText = await row.locator('[data-field="card"]').textContent();
      if (cardText.includes(cardName)) {
        transactions.push(row);
      }
    }
    return transactions;
  }

  async getFirstTransaction() {
    const firstRow = this.transactionRows.first();
    return {
      date: await firstRow.locator('[data-field="date"]').textContent(),
      merchant: await firstRow.locator('[data-field="merchant"]').textContent(),
      amount: await firstRow.locator('[data-field="amount"]').textContent(),
      card: await firstRow.locator('[data-field="card"]').textContent()
    };
  }

  async isTransactionsSortedByDate() {
    const rows = await this.transactionRows.all();
    const dates = [];
    for (const row of rows) {
      const dateText = await row.locator('[data-field="date"]').textContent();
      dates.push(new Date(dateText));
    }
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] > dates[i - 1]) {
        return false;
      }
    }
    return true;
  }

  async getTransactionCount() {
    return await this.transactionRows.count();
  }

  async getNoTransactionsMessage() {
    return await this.noTransactionsMessage.textContent();
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.dateFilterStartInput.fill(startDate);
    await this.dateFilterEndInput.fill(endDate);
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearDateFilter() {
    await this.clearFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async areAllTransactionsInDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const rows = await this.transactionRows.all();
    
    for (const row of rows) {
      const dateText = await row.locator('[data-field="date"]').textContent();
      const transactionDate = new Date(dateText);
      if (transactionDate < start || transactionDate > end) {
        return false;
      }
    }
    return true;
  }

  async selectTransactionById(transactionId) {
    const transactionLink = this.page.locator(`[data-transaction-id="${transactionId}"]`);
    await transactionLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionDetailField(fieldName) {
    const field = this.page.locator(`[data-detail-field="${fieldName}"]`);
    await expect(field).toBeVisible();
    return await field.textContent();
  }

  async getErrorMessage() {
    return await this.transactionNotFoundError.textContent();
  }
};
