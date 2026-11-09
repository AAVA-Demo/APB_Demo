const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const { WaitUtils } = require('../../utils/wait-utils');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionsContainer = page.locator('[data-testid="transactions-container"], .transaction-history, #transactions');
    this.transactionRows = page.locator('.transaction-table tbody tr, [data-testid="transaction-row"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .no-transactions-message');
    this.noResultsMessage = page.locator('[data-testid="no-results"], .no-results-message');
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"], .loading-indicator');
    
    // Filter Locators
    this.filterPanel = page.locator('[data-testid="filter-panel"], .filter-panel');
    this.dateFromInput = page.locator('[data-testid="date-from"], input[name="dateFrom"], #dateFrom');
    this.dateToInput = page.locator('[data-testid="date-to"], input[name="dateTo"], #dateTo');
    this.cardSelect = page.locator('[data-testid="card-select"], select[name="card"]');
    this.merchantInput = page.locator('[data-testid="merchant-search"], input[name="search"], input[placeholder*="Merchant"]');
    this.applyFiltersButton = page.locator('[data-testid="apply-filters"], button:has-text("Apply")');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters"], button:has-text("Clear Filters")');
    
    // Pagination Locators
    this.paginationContainer = page.locator('[data-testid="pagination"], .pagination');
    this.nextPageButton = page.locator('[data-testid="next-page"], .pagination a:has-text("»")');
    this.prevPageButton = page.locator('[data-testid="prev-page"], .pagination a:has-text("«")');
    this.pageNumbers = page.locator('.pagination li:not(.disabled) a');
  }

  async navigate() {
    Logger.info('Navigating to Transactions page');
    await this.page.goto('/transactions');
    await WaitUtils.waitForPageLoad(this.page);
  }

  async waitForTransactionsToLoad() {
    Logger.info('Waiting for transactions to load');
    await WaitUtils.waitForElementVisible(this.page, this.transactionsContainer);
    await WaitUtils.waitForElementHidden(this.page, this.loadingIndicator);
    await this.page.waitForTimeout(500);
  }

  async getTransactionCount() {
    const count = await this.transactionRows.count();
    Logger.info(`Transaction count: ${count}`);
    return count;
  }

  async getTransactionDetails(index) {
    const row = this.transactionRows.nth(index);
    await WaitUtils.waitForElementVisible(this.page, row);
    
    const cells = row.locator('td');
    const details = {
      date: await cells.nth(0).textContent(),
      merchant: await cells.nth(1).textContent(),
      cardName: await cells.nth(2).textContent(),
      category: await cells.nth(3).textContent(),
      amount: await cells.nth(4).textContent(),
      status: await cells.nth(5).textContent()
    };
    
    Logger.info(`Transaction details retrieved for row ${index}`);
    return details;
  }

  async hasPagination() {
    const visible = await this.paginationContainer.isVisible();
    Logger.info(`Pagination visible: ${visible}`);
    return visible;
  }

  async goToNextPage() {
    Logger.info('Navigating to next page');
    await this.nextPageButton.click();
    await this.waitForTransactionsToLoad();
  }

  async goToPreviousPage() {
    Logger.info('Navigating to previous page');
    await this.prevPageButton.click();
    await this.waitForTransactionsToLoad();
  }

  async isSortedByDateDescending() {
    const count = await this.getTransactionCount();
    if (count < 2) return true;
    
    const firstDate = await this.transactionRows.nth(0).locator('td').nth(0).textContent();
    const secondDate = await this.transactionRows.nth(1).locator('td').nth(0).textContent();
    
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    
    const sorted = date1 >= date2;
    Logger.info(`Transactions sorted by date descending: ${sorted}`);
    return sorted;
  }

  async getEmptyStateMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.emptyStateMessage);
    const message = await this.emptyStateMessage.textContent();
    Logger.info(`Empty state message: ${message}`);
    return message;
  }

  async getNoResultsMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.noResultsMessage);
    const message = await this.noResultsMessage.textContent();
    Logger.info(`No results message: ${message}`);
    return message;
  }

  async hasClearFiltersButton() {
    const visible = await this.clearFiltersButton.isVisible();
    Logger.info(`Clear filters button visible: ${visible}`);
    return visible;
  }

  async setDateRange(fromDate, toDate) {
    Logger.info(`Setting date range: ${fromDate} to ${toDate}`);
    await this.dateFromInput.fill(fromDate);
    await this.dateToInput.fill(toDate);
  }

  async setDateRangeLastNDays(days) {
    Logger.info(`Setting date range: Last ${days} days`);
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    await this.setDateRange(formatDate(fromDate), formatDate(toDate));
  }

  async selectCard(cardName) {
    Logger.info(`Selecting card: ${cardName}`);
    await this.cardSelect.selectOption({ label: cardName });
  }

  async setMerchantName(merchantName) {
    Logger.info(`Setting merchant name: ${merchantName}`);
    await this.merchantInput.fill(merchantName);
  }

  async applyFilters() {
    Logger.info('Applying filters');
    await this.applyFiltersButton.click();
    await this.waitForTransactionsToLoad();
  }

  async clearFilters() {
    Logger.info('Clearing filters');
    await this.clearFiltersButton.click();
    await this.waitForTransactionsToLoad();
  }
};