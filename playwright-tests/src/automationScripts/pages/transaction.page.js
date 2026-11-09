const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionTable = page.locator('[data-testid="transaction-table"]');
    this.transactionRow = page.locator('[data-testid="transaction-row"]');
    
    // Sorting Locators
    this.dateHeader = page.locator('[data-testid="header-date"]');
    this.amountHeader = page.locator('[data-testid="header-amount"]');
    
    // Filter Locators
    this.dateFromInput = page.locator('[data-testid="filter-date-from"]');
    this.dateToInput = page.locator('[data-testid="filter-date-to"]');
    this.merchantInput = page.locator('[data-testid="filter-merchant"]');
    this.categorySelect = page.locator('[data-testid="filter-category"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter"]');
    
    // Pagination Locators
    this.paginationControls = page.locator('[data-testid="pagination"]');
    this.nextPageButton = page.locator('[data-testid="next-page"]');
    this.prevPageButton = page.locator('[data-testid="prev-page"]');
    
    // Loading State
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/transactions');
    logger.info('Navigated to Transaction Management');
  }

  async waitForTransactionListLoad() {
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    await expect(this.transactionTable).toBeVisible({ timeout: 5000 });
    logger.info('Transaction list loaded successfully');
  }

  async getTransactionCount() {
    await expect(this.transactionTable).toBeVisible();
    const count = await this.transactionRow.count();
    logger.info(`Transaction count: ${count}`);
    return count;
  }

  async getTransactionDetails(index) {
    const row = this.transactionRow.nth(index);
    await expect(row).toBeVisible();
    
    const date = await row.locator('[data-testid="transaction-date"]').textContent();
    const amount = await row.locator('[data-testid="transaction-amount"]').textContent();
    const merchant = await row.locator('[data-testid="transaction-merchant"]').textContent();
    const cardId = await row.locator('[data-testid="transaction-card"]').textContent();
    
    return { date, amount, merchant, cardId };
  }

  async sortByDate() {
    await this.dateHeader.click();
    await this.page.waitForTimeout(300); // Allow time for sort animation
    logger.info('Sorted by date');
  }

  async sortByAmount() {
    await this.amountHeader.click();
    await this.page.waitForTimeout(300); // Allow time for sort animation
    logger.info('Sorted by amount');
  }

  async applyDateRangeFilter(dateFrom, dateTo) {
    await this.dateFromInput.fill(dateFrom);
    await this.dateToInput.fill(dateTo);
    await this.applyFilterButton.click();
    await this.waitForTransactionListLoad();
    logger.info(`Applied date range filter: ${dateFrom} to ${dateTo}`);
  }

  async applyMerchantFilter(merchant) {
    await this.merchantInput.fill(merchant);
    await this.applyFilterButton.click();
    await this.waitForTransactionListLoad();
    logger.info(`Applied merchant filter: ${merchant}`);
  }

  async applyCategoryFilter(category) {
    await this.categorySelect.selectOption(category);
    await this.applyFilterButton.click();
    await this.waitForTransactionListLoad();
    logger.info(`Applied category filter: ${category}`);
  }

  async getTransactionDate(index) {
    const row = this.transactionRow.nth(index);
    const date = await row.locator('[data-testid="transaction-date"]').textContent();
    return date;
  }

  async getTransactionAmount(index) {
    const row = this.transactionRow.nth(index);
    const amount = await row.locator('[data-testid="transaction-amount"]').textContent();
    return amount;
  }

  async getTransactionMerchant(index) {
    const row = this.transactionRow.nth(index);
    const merchant = await row.locator('[data-testid="transaction-merchant"]').textContent();
    return merchant;
  }

  async goToNextPage() {
    await expect(this.nextPageButton).toBeEnabled();
    await this.nextPageButton.click();
    await this.waitForTransactionListLoad();
    logger.info('Navigated to next page');
  }

  async goToPrevPage() {
    await expect(this.prevPageButton).toBeEnabled();
    await this.prevPageButton.click();
    await this.waitForTransactionListLoad();
    logger.info('Navigated to previous page');
  }
};