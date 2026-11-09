const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');
const config = require('../../../data/config.json');

const logger = new Logger('TransactionsPage');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction list locators
    this.transactionItems = page.locator('.transaction-item');
    this.transactionDate = (index) => page.locator('.transaction-item').nth(index).locator('small').first();
    this.transactionMerchant = (index) => page.locator('.transaction-item').nth(index).locator('strong');
    this.transactionAmount = (index) => page.locator('.transaction-item').nth(index).locator('.amount-negative, h4');
    this.transactionCard = (index) => page.locator('.transaction-item').nth(index).locator('small').nth(1);
    this.transactionCategory = (index) => page.locator('.transaction-item').nth(index).locator('.label');
    this.transactionStatus = (index) => page.locator('.transaction-item').nth(index).locator('.status-posted, .status-pending');
    
    // Filter controls
    this.cardFilter = page.locator('select[ng-model="filterCard"]');
    this.merchantSearchInput = page.locator('input[ng-model="searchText"]');
    this.statusFilter = page.locator('select[ng-model="filterStatus"]');
    this.applyFiltersButton = page.locator('button:has-text("Filter")');
    
    // Date range filters
    this.startDateInput = page.locator('input[name="startDate"]');
    this.endDateInput = page.locator('input[name="endDate"]');
    this.dateRangeError = page.locator('.date-range-error, text=/Invalid date range/i');
    
    // Pagination controls
    this.paginationControls = page.locator('.pagination, [class*="pagination"]');
    this.nextPageButton = page.locator('button:has-text("Next"), .pagination .next');
    this.previousPageButton = page.locator('button:has-text("Previous"), .pagination .previous');
    this.pageSizeSelector = page.locator('select[name="pageSize"], select[ng-model*="limit"]');
    
    // Messages
    this.warningMessage = page.locator('.alert-warning, text=/Unable to retrieve transactions/i');
    this.emptyMessage = page.locator('text=/No transactions found/i');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=/Loading transactions/i');
  }

  async navigate() {
    logger.info('Navigating to transactions page');
    await this.page.goto(config.baseUrl + '/transactions');
    await this.page.waitForLoadState('networkidle');
    logger.info('Transactions page loaded');
  }

  async waitForTransactionsToLoad() {
    logger.info('Waiting for transactions to load');
    await this.page.waitForSelector('.transaction-item', { state: 'visible', timeout: 10000 }).catch(() => {
      logger.warn('No transactions found or timeout waiting for transactions');
    });
  }

  async waitForFilteredResults() {
    logger.info('Waiting for filtered results');
    // Wait for network to settle after filter application
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500); // Small wait for UI to update
  }

  async getTransactionCount() {
    logger.info('Getting transaction count');
    const count = await this.transactionItems.count();
    logger.info(`Transaction count: ${count}`);
    return count;
  }

  async getAllTransactionDates() {
    logger.info('Getting all transaction dates');
    const count = await this.transactionItems.count();
    const dates = [];
    
    for (let i = 0; i < count; i++) {
      const dateText = await this.transactionDate(i).textContent();
      dates.push(dateText.trim());
    }
    
    logger.info(`Retrieved ${dates.length} transaction dates`);
    return dates;
  }

  async getTransactionDetails(index) {
    logger.info(`Getting transaction details at index ${index}`);
    await expect(this.transactionItems.nth(index)).toBeVisible();
    
    const date = await this.transactionDate(index).textContent();
    const merchant = await this.transactionMerchant(index).textContent();
    const amount = await this.transactionAmount(index).textContent();
    const cardInfo = await this.transactionCard(index).textContent();
    const category = await this.transactionCategory(index).textContent();
    const status = await this.transactionStatus(index).textContent();
    
    // Parse card name and number from card info
    const cardParts = cardInfo.split(' ');
    const cardNumber = cardParts[cardParts.length - 1];
    const cardName = cardParts.slice(0, -1).join(' ');
    
    const details = {
      date: date.trim(),
      merchant: merchant.trim(),
      amount: amount.trim(),
      cardName: cardName.trim(),
      cardNumber: cardNumber.trim(),
      category: category.trim(),
      status: status.trim()
    };
    
    logger.info(`Transaction details: ${JSON.stringify(details)}`);
    return details;
  }

  async filterByCard(cardId) {
    logger.info(`Filtering by card: ${cardId}`);
    await expect(this.cardFilter).toBeVisible();
    await this.cardFilter.selectOption(cardId);
  }

  async searchMerchant(merchantName) {
    logger.info(`Searching for merchant: ${merchantName}`);
    await expect(this.merchantSearchInput).toBeVisible();
    await this.merchantSearchInput.fill(merchantName);
  }

  async filterByStatus(status) {
    logger.info(`Filtering by status: ${status}`);
    await expect(this.statusFilter).toBeVisible();
    await this.statusFilter.selectOption(status);
  }

  async clickApplyFilters() {
    logger.info('Clicking apply filters button');
    await expect(this.applyFiltersButton).toBeVisible();
    await this.applyFiltersButton.click();
  }

  async clearAllFilters() {
    logger.info('Clearing all filters');
    await this.cardFilter.selectOption('');
    await this.merchantSearchInput.fill('');
    await this.statusFilter.selectOption('');
  }

  async setDateRange(startDate, endDate) {
    logger.info(`Setting date range: ${startDate} to ${endDate}`);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async clickNextPage() {
    logger.info('Clicking next page button');
    await expect(this.nextPageButton).toBeEnabled();
    await this.nextPageButton.click();
  }

  async clickPreviousPage() {
    logger.info('Clicking previous page button');
    await expect(this.previousPageButton).toBeEnabled();
    await this.previousPageButton.click();
  }

  async setPageSize(size) {
    logger.info(`Setting page size to: ${size}`);
    await expect(this.pageSizeSelector).toBeVisible();
    await this.pageSizeSelector.selectOption(size.toString());
  }
};