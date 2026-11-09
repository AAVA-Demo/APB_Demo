const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    this.transactionList = page.locator('.transaction-row');
    this.paginationControls = page.locator('.pagination');
    this.emptyStateMessage = page.locator('text=No transactions');
    this.dateFromInput = page.locator('input[ng-model="filters.startDate"]');
    this.dateToInput = page.locator('input[ng-model="filters.endDate"]');
    this.merchantFilterInput = page.locator('input[ng-model="filters.merchantName"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filters")');
    this.validationErrorMessage = page.locator('.alert-danger');
  }

  async navigateToTransactions() {
    await this.page.click('a[href="#/transactions"]');
    await this.page.waitForURL('**/transactions');
  }

  async waitForTransactionListLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    return await this.transactionList.count();
  }

  async applyDateRangeFilter(startDate, endDate) {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    await this.dateFromInput.fill(formatDate(startDate));
    await this.dateToInput.fill(formatDate(endDate));
    await this.applyFilterButton.click();
  }

  async applyMerchantFilter(merchantName) {
    await this.merchantFilterInput.fill(merchantName);
    await this.applyFilterButton.click();
  }

  async getAllTransactionMerchants() {
    const merchants = [];
    const count = await this.transactionList.count();
    for (let i = 0; i < count; i++) {
      const merchant = await this.transactionList.nth(i).locator('strong').first().textContent();
      merchants.push(merchant);
    }
    return merchants;
  }

  async getAllTransactionDates() {
    const dates = [];
    const count = await this.transactionList.count();
    for (let i = 0; i < count; i++) {
      const dateText = await this.transactionList.nth(i).locator('small').textContent();
      dates.push(dateText);
    }
    return dates;
  }
};
