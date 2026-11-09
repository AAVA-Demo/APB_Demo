const { expect } = require('@playwright/test');

/**
 * Page Object: Transactions Page
 * Covers: Transaction Listing, Search, and Filtering
 * Related Test Cases: QE-8457 TS-001, TS-002, TS-003, QE-8459 TS-001, TS-002, TS-003
 */
exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List
    this.transactionTable = page.locator('[data-testid="transactions-table"]');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');
    
    // Filter Controls
    this.startDateInput = page.locator('[data-testid="filter-start-date"]');
    this.endDateInput = page.locator('[data-testid="filter-end-date"]');
    this.cardIdInput = page.locator('[data-testid="filter-card-id"]');
    this.applyFiltersButton = page.locator('[data-testid="apply-filters-button"]');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters-button"]');
    
    // Pagination
    this.paginationInfo = page.locator('[data-testid="pagination-info"]');
    this.nextPageButton = page.locator('[data-testid="next-page-button"]');
    this.previousPageButton = page.locator('[data-testid="previous-page-button"]');
    
    // Messages
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionRows() {
    const count = await this.transactionRows.count();
    const rows = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      rows.push({
        container: row,
        merchantName: row.locator('[data-testid="tx-merchant-name"]'),
        amount: row.locator('[data-testid="tx-amount"]'),
        transactionDate: row.locator('[data-testid="tx-date"]'),
        cardInfo: row.locator('[data-testid="tx-card-info"]'),
        category: row.locator('[data-testid="tx-category"]')
      });
    }
    
    return rows;
  }

  async setDateRangeFilter(startDate, endDate) {
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async setCardIdFilter(cardId) {
    await this.cardIdInput.fill(cardId);
  }

  async clickApplyFilters() {
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickClearFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPreviousPage() {
    await this.previousPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickTransactionRow(index) {
    await this.transactionRows.nth(index).click();
  }
};