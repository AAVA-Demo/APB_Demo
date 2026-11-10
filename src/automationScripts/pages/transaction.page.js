const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    this.transactionList = page.locator('transaction-list');
    this.transactionRows = page.locator('.transaction-row');
    this.paginationControls = page.locator('.pagination');
    this.cardFilterDropdown = page.locator('select[ng-model="vm.filters.cardId"]');
    this.startDateInput = page.locator('input[ng-model="vm.filters.startDate"]');
    this.endDateInput = page.locator('input[ng-model="vm.filters.endDate"]');
    this.searchInput = page.locator('input[ng-model="vm.filters.searchTerm"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply")');
    this.clearFiltersButton = page.locator('button:has-text("Clear")');
    this.errorMessage = page.locator('.alert-danger');
    this.emptyStateMessage = page.locator('.alert-info');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    await expect(this.transactionRows.first()).toBeVisible();
    return await this.transactionRows.count();
  }

  async getTransactionDetails(index) {
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();

    const columns = row.locator('.col-md-2, .col-md-3');
    const date = await columns.nth(0).textContent();
    const merchant = await columns.nth(1).textContent();
    const cardName = await columns.nth(2).textContent();
    const amount = await columns.nth(4).textContent();
    const status = await row.locator('.label').textContent();

    return {
      date: date.trim(),
      merchant: merchant.trim(),
      cardName: cardName.trim(),
      amount: amount.trim(),
      status: status.trim()
    };
  }

  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];

    for (let i = 0; i < count; i++) {
      const txn = await this.getTransactionDetails(i);
      transactions.push(txn);
    }

    return transactions;
  }

  async goToPage(pageNumber) {
    const pageLink = this.page.locator(`.pagination a:has-text("${pageNumber}")`);
    await expect(pageLink).toBeVisible();
    await pageLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardFilter(cardId) {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.selectOption(cardId);
  }

  async setDateRange(startDate, endDate) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async searchTransactions(searchTerm) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(searchTerm);
    await this.page.waitForTimeout(500);
  }

  async applyFilters() {
    await expect(this.applyFiltersButton).toBeVisible();
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters() {
    await expect(this.clearFiltersButton).toBeVisible();
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getPaginationInfo() {
    const paginationText = await this.paginationControls.textContent();
    const totalRecordsMatch = paginationText.match(/totalRecords: (\d+)/);
    const totalRecords = totalRecordsMatch ? parseInt(totalRecordsMatch[1]) : 0;

    return { totalRecords };
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }
};
