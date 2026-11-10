const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Transaction Table Locators
    this.transactionTable = page.locator('.transaction-table, table');
    this.transactionRows = page.locator('tbody tr');
    
    // Filter Locators
    this.startDateInput = page.locator('input[type="date"][name="startDate"], input[placeholder*="Start"]');
    this.endDateInput = page.locator('input[type="date"][name="endDate"], input[placeholder*="End"]');
    this.merchantInput = page.locator('input[placeholder*="merchant"], input[name="merchant"]');
    this.minAmountInput = page.locator('input[name="minAmount"], input[placeholder*="Min"]');
    this.maxAmountInput = page.locator('input[name="maxAmount"], input[placeholder*="Max"]');
    this.cardSelect = page.locator('select[name="card"], select:has-text("All Cards")');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    this.clearFiltersButton = page.locator('button:has-text("Clear All Filters"), button:has-text("Reset Filters")');
    
    // Pagination Locators
    this.paginationControls = page.locator('.pagination, ul.pagination');
    this.nextPageButton = page.locator('.pagination a:has-text("Next"), .pagination a:has-text("»")');
    this.prevPageButton = page.locator('.pagination a:has-text("Previous"), .pagination a:has-text("«")');
    
    // State Locators
    this.emptyStateMessage = page.locator('text=/No transactions are available/i, td[colspan]:has-text("No transactions")');
    this.noResultsMessage = page.locator('text=/No transactions match/i');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.validationError = page.locator('.alert-danger, .validation-error, .error');
    this.filterIndicator = page.locator('.filter-indicator, .applied-filters, div:has-text("Showing transactions from")');
  }

  async navigate() {
    await this.page.click('a[href*="transactions"], a:has-text("Transactions")');
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    try {
      await this.transactionRows.first().waitFor({ state: 'visible', timeout: 3000 });
      return await this.transactionRows.count();
    } catch {
      return 0;
    }
  }

  async verifyTransactionFromCard(cardName) {
    const cardCell = this.transactionRows.locator(`td:has-text("${cardName}")`);
    await expect(cardCell.first()).toBeVisible();
  }

  async verifyDateSortDescending() {
    const dates = await this.transactionRows.locator('td:nth-child(1)').allTextContents();
    if (dates.length < 2) return true;
    
    for (let i = 0; i < dates.length - 1; i++) {
      const date1 = new Date(dates[i]);
      const date2 = new Date(dates[i + 1]);
      if (date1 < date2) return false;
    }
    return true;
  }

  async goToPage(pageNumber) {
    const pageLink = this.paginationControls.locator(`a:has-text("${pageNumber}")`);
    await pageLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async setStartDate(date) {
    await this.startDateInput.fill(date);
  }

  async setEndDate(date) {
    await this.endDateInput.fill(date);
  }

  async setMerchantFilter(merchant) {
    await this.merchantInput.fill(merchant);
  }

  async setAmountRange(minAmount, maxAmount) {
    if (minAmount) await this.minAmountInput.fill(minAmount);
    if (maxAmount) await this.maxAmountInput.fill(maxAmount);
  }

  async applyFilter() {
    // Check if there's an explicit apply button, otherwise filter applies automatically
    const hasApplyButton = await this.applyFilterButton.count() > 0;
    if (hasApplyButton) {
      await this.applyFilterButton.click();
    }
    // Wait for filter to apply (debounce delay)
    await this.page.waitForTimeout(300);
  }

  async clearAllFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAllTransactionDatesInRange(startDate, endDate) {
    const dates = await this.transactionRows.locator('td:nth-child(1)').allTextContents();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (const dateStr of dates) {
      const date = new Date(dateStr.trim());
      if (date < start || date > end) return false;
    }
    return true;
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};
