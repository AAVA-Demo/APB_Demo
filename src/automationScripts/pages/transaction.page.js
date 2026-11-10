const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionRow = page.locator('[data-testid="transaction-row"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.dashboardLink = page.locator('[data-testid="dashboard-link"]');
    
    // Pagination Locators
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.nextButton = page.locator('[data-testid="pagination-next"]');
    this.previousButton = page.locator('[data-testid="pagination-previous"]');
    this.paginationMetadata = page.locator('[data-testid="pagination-metadata"]');
    this.totalCountLabel = page.locator('[data-testid="total-count"]');
    
    // Filter Locators
    this.dateRangeFilter = page.locator('[data-testid="date-range-filter"]');
    this.cardFilter = page.locator('[data-testid="card-filter"]');
    this.minAmountInput = page.locator('[data-testid="min-amount-input"]');
    this.maxAmountInput = page.locator('[data-testid="max-amount-input"]');
    this.dateFromInput = page.locator('[data-testid="date-from-input"]');
    this.dateToInput = page.locator('[data-testid="date-to-input"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    this.validationError = page.locator('[data-testid="validation-error"]');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactions() {
    await expect(this.transactionList).toBeVisible();
    const transactions = [];
    const count = await this.transactionRow.count();
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRow.nth(i);
      const merchant = await row.locator('[data-testid="txn-merchant"]').textContent();
      const amount = parseFloat(await row.locator('[data-testid="txn-amount"]').textContent().replace(/[^0-9.]/g, ''));
      const date = await row.locator('[data-testid="txn-date"]').textContent();
      const cardName = await row.locator('[data-testid="txn-card"]').textContent();
      
      transactions.push({ merchant, amount, date, cardName });
    }
    
    return transactions;
  }

  async getTransactionCount() {
    const count = await this.transactionRow.count();
    return count;
  }

  async getTotalTransactionCount() {
    await expect(this.totalCountLabel).toBeVisible();
    const text = await this.totalCountLabel.textContent();
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  async getPaginationMetadata() {
    await expect(this.paginationMetadata).toBeVisible();
    return await this.paginationMetadata.textContent();
  }

  async goToPage(pageNumber) {
    const pageButton = this.page.locator(`[data-testid="page-${pageNumber}"]`);
    await pageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToLastPage() {
    const lastPageButton = this.page.locator('[data-testid="last-page"]');
    await lastPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectDateRangeFilter(range) {
    await this.dateRangeFilter.selectOption(range);
  }

  async selectCardFilter(cardName) {
    await this.cardFilter.selectOption(cardName);
  }

  async setMinAmount(amount) {
    await this.minAmountInput.fill(amount.toString());
  }

  async setMaxAmount(amount) {
    await this.maxAmountInput.fill(amount.toString());
  }

  async setDateFrom(date) {
    await this.dateFromInput.fill(date);
  }

  async setDateTo(date) {
    await this.dateToInput.fill(date);
  }

  async applyFilters() {
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getSampleTransactions(count) {
    const allTransactions = await this.getAllTransactions();
    return allTransactions.slice(0, count);
  }
};