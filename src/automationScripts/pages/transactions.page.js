const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

/**
 * Page Object: TransactionsPage
 * Handles all interactions with the Transaction History and Filtering
 * Used by test cases: QE-8986 TS-001/002/003 TC-001, QE-8987 TS-001/002/003 TC-001
 */
exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionListContainer = page.locator('[data-testid="transaction-list"]');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    
    // Filter Locators
    this.dateRangeStartInput = page.locator('[data-testid="filter-date-start"]');
    this.dateRangeEndInput = page.locator('[data-testid="filter-date-end"]');
    this.merchantSearchInput = page.locator('[data-testid="filter-merchant-search"]');
    this.cardFilterSelect = page.locator('[data-testid="filter-card-select"]');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters-button"]');
    
    // Transaction Detail Locators
    this.transactionDetailContainer = page.locator('[data-testid="transaction-detail"]');
    this.detailTransactionId = page.locator('[data-testid="detail-transaction-id"]');
    this.detailDate = page.locator('[data-testid="detail-date"]');
    this.detailMerchant = page.locator('[data-testid="detail-merchant"]');
    this.detailCategory = page.locator('[data-testid="detail-category"]');
    this.detailAmount = page.locator('[data-testid="detail-amount"]');
    
    // Navigation Locators
    this.dashboardLink = page.locator('[data-testid="nav-dashboard"]');
    this.analyticsLink = page.locator('[data-testid="nav-analytics"]');
    this.errorContainer = page.locator('[data-testid="error-container"]');
  }

  async navigate() {
    logger.info('Navigating to transactions page');
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionsLoad() {
    logger.info('Waiting for transactions to load');
    await this.page.waitForSelector('[data-testid="transactions-container"]', { state: 'visible' });
    // Wait for either transaction list or no transactions message
    await Promise.race([
      this.transactionListContainer.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      this.noTransactionsMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    ]);
  }

  async getTransactionCount() {
    const count = await this.transactionRows.count();
    logger.info(`Transaction count: ${count}`);
    return count;
  }

  async getTransactionAtIndex(index) {
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    
    const date = await row.locator('[data-testid="transaction-date"]').textContent();
    const merchant = await row.locator('[data-testid="transaction-merchant"]').textContent();
    const amount = await row.locator('[data-testid="transaction-amount"]').textContent();
    const cardName = await row.locator('[data-testid="transaction-card-name"]').textContent();
    const lastFourDigits = await row.locator('[data-testid="transaction-card-digits"]').textContent();
    
    return { date, merchant, amount, cardName, lastFourDigits };
  }

  async clickTransactionAtIndex(index) {
    logger.info(`Clicking transaction at index ${index}`);
    const row = this.transactionRows.nth(index);
    await row.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getDetailTransactionId() {
    await expect(this.detailTransactionId).toBeVisible();
    const text = await this.detailTransactionId.textContent();
    return text.trim();
  }

  async getDetailDate() {
    await expect(this.detailDate).toBeVisible();
    const text = await this.detailDate.textContent();
    return text.trim();
  }

  async getDetailMerchant() {
    await expect(this.detailMerchant).toBeVisible();
    const text = await this.detailMerchant.textContent();
    return text.trim();
  }

  async getDetailCategory() {
    await expect(this.detailCategory).toBeVisible();
    const text = await this.detailCategory.textContent();
    return text.trim();
  }

  async getDetailAmount() {
    await expect(this.detailAmount).toBeVisible();
    const text = await this.detailAmount.textContent();
    return text.trim();
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    const text = await this.noTransactionsMessage.textContent();
    logger.info(`No transactions message: ${text}`);
    return text.trim();
  }

  async hasErrors() {
    const errorVisible = await this.errorContainer.isVisible().catch(() => false);
    return errorVisible;
  }

  async isNavigationFunctional() {
    const dashboardVisible = await this.dashboardLink.isVisible().catch(() => false);
    const analyticsVisible = await this.analyticsLink.isVisible().catch(() => false);
    return dashboardVisible && analyticsVisible;
  }

  async setDateRangeFilter(startDate, endDate) {
    logger.info(`Setting date range filter: ${startDate} to ${endDate}`);
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    // Wait for filter to apply
    await this.page.waitForTimeout(500);
  }

  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const txn = await this.getTransactionAtIndex(i);
      transactions.push(txn);
    }
    
    return transactions;
  }

  async setMerchantSearch(searchTerm) {
    logger.info(`Setting merchant search: ${searchTerm}`);
    await this.merchantSearchInput.fill(searchTerm);
    // Wait for filter to apply
    await this.page.waitForTimeout(500);
  }

  async setCardFilter(cardId) {
    logger.info(`Setting card filter: ${cardId}`);
    await this.cardFilterSelect.selectOption(cardId);
    // Wait for filter to apply
    await this.page.waitForTimeout(500);
  }

  async hasClearFiltersButton() {
    const isVisible = await this.clearFiltersButton.isVisible().catch(() => false);
    return isVisible;
  }

  async clickClearFilters() {
    logger.info('Clicking clear filters button');
    await this.clearFiltersButton.click();
    await this.page.waitForTimeout(500);
  }
};
