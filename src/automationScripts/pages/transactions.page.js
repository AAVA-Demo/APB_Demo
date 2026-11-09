const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.transactionsLink = page.locator('a:has-text("Transactions")');
    this.transactionList = page.locator('.transaction-row');
    this.transactionDetailView = page.locator('.transaction-detail-container');
    this.errorMessage = page.locator('.alert-danger, .alert-warning');
    this.validationError = page.locator('.alert-danger');
    this.startDateInput = page.locator('input[type="date"][ng-model*="startDate"]');
    this.endDateInput = page.locator('input[type="date"][ng-model*="endDate"]');
    this.categoryDropdown = page.locator('select[ng-model*="category"]');
    this.searchInput = page.locator('input[ng-model*="searchTerm"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
  }

  async navigateToTransactions() {
    logger.info('Navigating to transaction management page');
    await this.transactionsLink.click();
    await expect(this.transactionList.first()).toBeVisible({ timeout: 10000 });
  }

  async getTransactionCount() {
    await this.page.waitForTimeout(1000);
    return await this.transactionList.count();
  }

  async getTransactionByIndex(index) {
    const txn = this.transactionList.nth(index);
    const merchantName = await txn.locator('strong').first().textContent();
    const date = await txn.locator('small').first().textContent();
    const amount = await txn.locator('strong').nth(1).textContent();
    const category = await txn.locator('.label-primary').textContent();
    const cardId = await txn.evaluate(el => el.textContent.match(/CC\d+/)?.[0] || '');
    const status = 'Completed';
    return { merchantName: merchantName.trim(), date: date.trim(), amount: amount.trim(), category: category.trim(), cardId, status };
  }

  async verifyDateSortingDescending() {
    const dates = await this.transactionList.locator('small').allTextContents();
    for (let i = 0; i < dates.length - 1; i++) {
      const date1 = new Date(dates[i]);
      const date2 = new Date(dates[i + 1]);
      if (date1 < date2) return false;
    }
    return true;
  }

  async clickTransactionByMerchant(merchantName) {
    logger.info(`Clicking on transaction: ${merchantName}`);
    await this.transactionList.filter({ hasText: merchantName }).first().locator('a:has-text("View Details")').click();
    await expect(this.transactionDetailView).toBeVisible({ timeout: 5000 });
  }

  async getTransactionId() {
    const text = await this.transactionDetailView.locator('p:has-text("Transaction ID")').textContent();
    return text.split(':')[1].trim();
  }

  async getCardUsed() {
    const text = await this.transactionDetailView.locator('p:has-text("Card ID")').textContent();
    return text.split(':')[1].trim();
  }

  async getMerchantName() {
    return await this.transactionDetailView.locator('.panel-title').textContent();
  }

  async getTransactionDate() {
    const text = await this.transactionDetailView.locator('p:has-text("Date:")').textContent();
    return text.split(':')[1].trim();
  }

  async getTransactionAmount() {
    const text = await this.transactionDetailView.locator('p:has-text("Amount:")').textContent();
    return text.split(':')[1].trim();
  }

  async getTransactionCategory() {
    return await this.transactionDetailView.locator('.label-primary').textContent();
  }

  async getTransactionStatus() {
    return await this.transactionDetailView.locator('.label-success').textContent();
  }

  async getTransactionDescription() {
    const text = await this.transactionDetailView.locator('p:has-text("Description:")').textContent();
    return text.split(':')[1].trim();
  }

  async verifyInteractivity() {
    try {
      await this.transactionList.first().click({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async applyDateRangeFilter(startDate, endDate) {
    logger.info(`Applying date range filter: ${startDate} to ${endDate}`);
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async applyCategoryFilter(category) {
    logger.info(`Applying category filter: ${category}`);
    await this.categoryDropdown.selectOption(category);
  }

  async applySearchFilter(searchTerm) {
    logger.info(`Applying search filter: ${searchTerm}`);
    await this.searchInput.fill(searchTerm);
  }

  async clickApplyFilters() {
    logger.info('Clicking Apply Filter button');
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(500);
  }

  async verifyAllDatesInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = await this.transactionList.locator('small').allTextContents();
    for (const dateStr of dates) {
      const date = new Date(dateStr);
      if (date < start || date > end) return false;
    }
    return true;
  }

  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];
    for (let i = 0; i < count; i++) {
      transactions.push(await this.getTransactionByIndex(i));
    }
    return transactions;
  }

  async isDateInRange(dateStr, startDate, endDate) {
    const date = new Date(dateStr);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  }

  async areDateFieldsEditable() {
    const startDisabled = await this.startDateInput.isDisabled();
    const endDisabled = await this.endDateInput.isDisabled();
    return !startDisabled && !endDisabled;
  }
};
