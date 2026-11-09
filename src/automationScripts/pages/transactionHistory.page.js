const { expect } = require('@playwright/test');

exports.TransactionHistoryPage = class TransactionHistoryPage {
  constructor(page) {
    this.page = page;
    
    this.transactionHistoryContainer = page.locator('[data-testid="transaction-history-container"]');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');
    
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.nextButton = page.locator('[data-testid="pagination-next"]');
    this.previousButton = page.locator('[data-testid="pagination-previous"]');
    this.lastButton = page.locator('[data-testid="pagination-last"]');
    this.paginationText = page.locator('[data-testid="pagination-text"]');
    
    this.inactiveCardMessage = page.locator('[data-testid="inactive-card-message"]');
    
    this.filterButton = page.locator('[data-testid="filter-button"]');
    this.categoryFilterDropdown = page.locator('[data-testid="category-filter-dropdown"]');
    this.dateRangeFilter = page.locator('[data-testid="date-range-filter"]');
    this.applyFiltersButton = page.locator('[data-testid="apply-filters-button"]');
    
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.returnToDashboardButton = page.locator('[data-testid="return-to-dashboard-button"]');
  }

  async waitForTransactionHistoryLoad() {
    await this.transactionHistoryContainer.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    await this.transactionRows.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    return await this.transactionRows.count();
  }

  async getTransactionDetails(index) {
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    
    const date = await row.locator('[data-testid="transaction-date"]').textContent();
    const merchant = await row.locator('[data-testid="transaction-merchant"]').textContent();
    const amount = await row.locator('[data-testid="transaction-amount"]').textContent();
    const category = await row.locator('[data-testid="transaction-category"]').textContent();
    
    return { date, merchant, amount, category };
  }

  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const transaction = await this.getTransactionDetails(i);
      transactions.push(transaction);
    }
    
    return transactions;
  }

  async getInactiveCardMessageText() {
    await expect(this.inactiveCardMessage).toBeVisible();
    return await this.inactiveCardMessage.textContent();
  }

  async getLastTransactionDate() {
    const firstTransaction = await this.getTransactionDetails(0);
    return firstTransaction.date;
  }

  async clickFilterByCategory() {
    await expect(this.categoryFilterDropdown).toBeVisible();
    await this.categoryFilterDropdown.click();
  }

  async selectCategory(category) {
    const categoryOption = this.page.locator(`[data-testid="category-option-${category.replace(/\s+/g, '-').toLowerCase()}"]`);
    await expect(categoryOption).toBeVisible();
    await categoryOption.click();
  }

  async waitForFilteredResults() {
    await this.page.waitForLoadState('networkidle');
    await this.transactionRows.first().waitFor({ state: 'visible', timeout: 3000 });
  }

  async clickFilterButton() {
    await expect(this.filterButton).toBeVisible();
    await this.filterButton.click();
  }

  async selectDateRange(range) {
    await expect(this.dateRangeFilter).toBeVisible();
    await this.dateRangeFilter.click();
    const rangeOption = this.page.locator(`[data-testid="date-range-${range.replace(/\s+/g, '-').toLowerCase()}"]`);
    await expect(rangeOption).toBeVisible();
    await rangeOption.click();
  }

  async clickApplyFilters() {
    await expect(this.applyFiltersButton).toBeVisible();
    await this.applyFiltersButton.click();
  }

  async getPaginationText() {
    await expect(this.paginationText).toBeVisible();
    return await this.paginationText.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
