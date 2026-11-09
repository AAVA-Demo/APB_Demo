const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('TransactionsPage');
    
    // Transaction Table Locators
    this.transactionTableRows = page.locator('.table-responsive table tbody tr');
    this.dateColumn = page.locator('.table-responsive table tbody tr td:nth-child(1)');
    this.merchantColumn = page.locator('.table-responsive table tbody tr td:nth-child(2)');
    this.amountColumn = page.locator('.table-responsive table tbody tr td:nth-child(3)');
    this.categoryColumn = page.locator('.table-responsive table tbody tr td:nth-child(4)');
    this.cardIdColumn = page.locator('.table-responsive table tbody tr td:nth-child(5)');
    this.statusColumn = page.locator('.table-responsive table tbody tr td:nth-child(6) .label');
    this.descriptionColumn = page.locator('.table-responsive table tbody tr td:nth-child(7)');
    
    // Filter Locators
    this.cardFilterDropdown = page.locator('select[ng-model="filter.cardId"]');
    this.categoryFilterDropdown = page.locator('select[ng-model="filter.category"]');
    this.startDateInput = page.locator('input[ng-model="filter.startDate"]');
    this.endDateInput = page.locator('input[ng-model="filter.endDate"]');
    this.applyFilterButton = page.locator('button:has-text("Apply")');
    this.clearFilterButton = page.locator('button:has-text("Clear")');
    
    // Loading and Error Locators
    this.loadingIndicator = page.locator('text=Loading transactions...');
    this.errorMessage = page.locator('.alert-danger');
    this.emptyStateMessage = page.locator('.alert-info');
    this.pageTitle = page.locator('h2:has-text("Transaction Management")');
  }

  async navigate() {
    await this.page.goto('/transactions');
    this.logger.info('Navigated to transactions page');
  }

  async waitForTransactionsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      this.logger.info('Loading indicator not found or already hidden');
    });
    this.logger.info('Transactions loaded successfully');
  }

  async getTransactionCount() {
    await this.transactionTableRows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      this.logger.info('No transactions found in table');
    });
    return await this.transactionTableRows.count();
  }

  async getTransactionDetails(index) {
    const row = this.transactionTableRows.nth(index);
    await row.waitFor({ state: 'visible' });
    
    const date = await row.locator('td:nth-child(1)').textContent();
    const merchant = await row.locator('td:nth-child(2)').textContent();
    const amount = await row.locator('td:nth-child(3)').textContent();
    const category = await row.locator('td:nth-child(4)').textContent();
    const cardId = await row.locator('td:nth-child(5)').textContent();
    const status = await row.locator('td:nth-child(6) .label').textContent();
    const description = await row.locator('td:nth-child(7)').textContent();
    
    return {
      date: date.trim(),
      merchant: merchant.trim(),
      amount: amount.trim(),
      category: category.trim(),
      cardId: cardId.trim(),
      status: status.trim(),
      description: description.trim()
    };
  }

  async getAllCardIds() {
    const count = await this.getTransactionCount();
    const cardIds = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionTableRows.nth(i);
      const cardId = await row.locator('td:nth-child(5)').textContent();
      if (!cardIds.includes(cardId.trim())) {
        cardIds.push(cardId.trim());
      }
    }
    
    return cardIds;
  }

  async getAllTransactionDates() {
    const count = await this.getTransactionCount();
    const dates = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionTableRows.nth(i);
      const date = await row.locator('td:nth-child(1)').textContent();
      dates.push(date.trim());
    }
    
    return dates;
  }

  async getAllTransactionStatuses() {
    const count = await this.getTransactionCount();
    const statuses = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionTableRows.nth(i);
      const status = await row.locator('td:nth-child(6) .label').textContent();
      statuses.push(status.trim());
    }
    
    return statuses;
  }

  async getTransactionCountByStatus(status) {
    const allStatuses = await this.getAllTransactionStatuses();
    return allStatuses.filter(s => s === status).length;
  }

  async loadEmptyTransactionData() {
    await this.page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    await this.page.reload();
    this.logger.info('Loaded empty transaction data');
  }

  async loadMixedStatusTransactionData() {
    const transactions = [
      ...Array(5).fill(null).map((_, i) => ({
        transactionId: `T${i + 1}`,
        cardId: 'CC001',
        date: '2024-01-15',
        merchant: `Merchant ${i + 1}`,
        amount: 1000 + i * 100,
        category: 'Shopping',
        status: 'Completed',
        description: 'Test transaction'
      })),
      ...Array(3).fill(null).map((_, i) => ({
        transactionId: `T${i + 6}`,
        cardId: 'CC002',
        date: '2024-01-20',
        merchant: `Merchant ${i + 6}`,
        amount: 2000 + i * 100,
        category: 'Food',
        status: 'Pending',
        description: 'Test transaction'
      })),
      ...Array(2).fill(null).map((_, i) => ({
        transactionId: `T${i + 9}`,
        cardId: 'CC003',
        date: '2024-01-25',
        merchant: `Merchant ${i + 9}`,
        amount: 3000 + i * 100,
        category: 'Travel',
        status: 'Failed',
        description: 'Test transaction'
      }))
    ];
    
    await this.page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactions)
      });
    });
    await this.page.reload();
    this.logger.info('Loaded mixed status transaction data');
  }

  async hasErrorMessage() {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  async isLoadingIndicatorVisible() {
    return await this.loadingIndicator.isVisible().catch(() => false);
  }

  async getEmptyStateMessage() {
    await this.emptyStateMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      this.logger.info('Empty state message not found');
    });
    return await this.emptyStateMessage.textContent().catch(() => '');
  }

  async selectCardFilter(cardId) {
    await this.cardFilterDropdown.waitFor({ state: 'visible' });
    await this.cardFilterDropdown.selectOption(cardId);
    this.logger.info(`Selected card filter: ${cardId}`);
  }

  async selectCategoryFilter(category) {
    await this.categoryFilterDropdown.waitFor({ state: 'visible' });
    await this.categoryFilterDropdown.selectOption(category);
    this.logger.info(`Selected category filter: ${category}`);
  }

  async setStartDate(date) {
    await this.startDateInput.waitFor({ state: 'visible' });
    await this.startDateInput.fill(date);
    this.logger.info(`Set start date: ${date}`);
  }

  async setEndDate(date) {
    await this.endDateInput.waitFor({ state: 'visible' });
    await this.endDateInput.fill(date);
    this.logger.info(`Set end date: ${date}`);
  }

  async clickApplyFilter() {
    await this.applyFilterButton.waitFor({ state: 'visible' });
    await this.applyFilterButton.click();
    this.logger.info('Clicked Apply Filter button');
  }

  async clickClearFilter() {
    await this.clearFilterButton.waitFor({ state: 'visible' });
    await this.clearFilterButton.click();
    this.logger.info('Clicked Clear Filter button');
  }

  async waitForFilteredResults() {
    await this.page.waitForTimeout(1000); // Wait for filter to apply
    this.logger.info('Waited for filtered results');
  }

  async getSelectedCardFilter() {
    return await this.cardFilterDropdown.inputValue();
  }

  async getSelectedCategoryFilter() {
    return await this.categoryFilterDropdown.inputValue();
  }

  async getStartDate() {
    return await this.startDateInput.inputValue();
  }

  async getEndDate() {
    return await this.endDateInput.inputValue();
  }
};