const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionHistoryPage = class TransactionHistoryPage {
  constructor(page) {
    this.page = page;
    this.transactionHistoryContainer = page.locator('.transaction-history-container');
    this.transactionTable = page.locator('table.transaction-table');
    this.transactionRows = page.locator('table.transaction-table tbody tr');
    this.filterButton = page.locator('button[data-action="filter"]');
    this.filterPanel = page.locator('.filter-panel');
    this.dateRangeDropdown = page.locator('select[name="dateRange"]');
    this.categoryDropdown = page.locator('select[name="category"]');
    this.applyFiltersButton = page.locator('button[data-action="apply-filters"]');
    this.paginationContainer = page.locator('.pagination-container');
    this.nextPageButton = page.locator('button[data-action="next-page"]');
    this.lastPageButton = page.locator('button[data-action="last-page"]');
    this.errorMessageContainer = page.locator('.error-message-container');
    this.returnToDashboardButton = page.locator('a[href="/dashboard"]');
    this.transactionDateCells = page.locator('td.transaction-date');
    this.transactionMerchantCells = page.locator('td.transaction-merchant');
    this.transactionAmountCells = page.locator('td.transaction-amount');
    this.transactionCategoryCells = page.locator('td.transaction-category');
  }

  async waitForTransactionHistoryLoad() {
    await expect(this.transactionHistoryContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionTable).toBeVisible();
    logger.info('Transaction History page loaded');
  }

  async getTransactionCount() {
    await expect(this.transactionTable).toBeVisible();
    return await this.transactionRows.count();
  }

  async verifyAllTransactionsHaveDate() {
    const count = await this.transactionDateCells.count();
    const transactionCount = await this.getTransactionCount();
    return count === transactionCount;
  }

  async verifyAllTransactionsHaveMerchant() {
    const count = await this.transactionMerchantCells.count();
    const transactionCount = await this.getTransactionCount();
    return count === transactionCount;
  }

  async verifyAllTransactionsHaveAmount() {
    const count = await this.transactionAmountCells.count();
    const transactionCount = await this.getTransactionCount();
    return count === transactionCount;
  }

  async verifyAllTransactionsHaveCategory(expectedCategory = null) {
    const count = await this.transactionCategoryCells.count();
    const transactionCount = await this.getTransactionCount();
    
    if (expectedCategory) {
      const categories = await this.transactionCategoryCells.allTextContents();
      return categories.every(cat => cat.trim() === expectedCategory);
    }
    
    return count === transactionCount;
  }

  async getFirstTransactionDate() {
    await expect(this.transactionDateCells.first()).toBeVisible();
    const date = await this.transactionDateCells.first().textContent();
    return date.trim();
  }

  async getFirstTransactionMerchant() {
    await expect(this.transactionMerchantCells.first()).toBeVisible();
    const merchant = await this.transactionMerchantCells.first().textContent();
    return merchant.trim();
  }

  async getFirstTransactionAmount() {
    await expect(this.transactionAmountCells.first()).toBeVisible();
    const amount = await this.transactionAmountCells.first().textContent();
    return amount.trim();
  }

  async getFirstTransactionCategory() {
    await expect(this.transactionCategoryCells.first()).toBeVisible();
    const category = await this.transactionCategoryCells.first().textContent();
    return category.trim();
  }

  async getPaginationText() {
    await expect(this.paginationContainer).toBeVisible();
    const text = await this.paginationContainer.locator('.pagination-text').textContent();
    return text.trim();
  }

  async clickFilterButton() {
    await expect(this.filterButton).toBeVisible();
    await expect(this.filterButton).toBeEnabled();
    await this.filterButton.click();
    logger.info('Clicked Filter button');
  }

  async selectDateRangeFilter(dateRange) {
    await expect(this.dateRangeDropdown).toBeVisible();
    await this.dateRangeDropdown.selectOption({ label: dateRange });
    logger.info(`Selected date range: ${dateRange}`);
  }

  async selectCategoryFilter(category) {
    await expect(this.categoryDropdown).toBeVisible();
    await this.categoryDropdown.selectOption({ label: category });
    logger.info(`Selected category: ${category}`);
  }

  async getSelectedDateRange() {
    const selectedOption = await this.dateRangeDropdown.locator('option:checked').textContent();
    return selectedOption.trim();
  }

  async getSelectedCategory() {
    const selectedOption = await this.categoryDropdown.locator('option:checked').textContent();
    return selectedOption.trim();
  }

  async clickApplyFilters() {
    await expect(this.applyFiltersButton).toBeVisible();
    await expect(this.applyFiltersButton).toBeEnabled();
    await this.applyFiltersButton.click();
    logger.info('Clicked Apply Filters button');
  }

  async waitForFilteredResults() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionTable).toBeVisible();
    logger.info('Filtered results loaded');
  }

  async verifyAllTransactionsWithinDateRange(startDate, endDate) {
    const dates = await this.transactionDateCells.allTextContents();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return dates.every(dateStr => {
      const transactionDate = new Date(dateStr.trim());
      return transactionDate >= start && transactionDate <= end;
    });
  }

  async getErrorMessage() {
    await expect(this.errorMessageContainer).toBeVisible();
    const message = await this.errorMessageContainer.textContent();
    return message.trim();
  }

  async isTransactionTableVisible() {
    return await this.transactionTable.isVisible();
  }
};
