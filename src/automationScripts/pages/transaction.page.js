const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Navigation and authentication locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.transactionsLink = page.locator('a[href*="transaction"], a:has-text("Transactions")');
    
    // Transaction table locators
    this.transactionTable = page.locator('.transaction-table, table[data-testid="transaction-table"]');
    this.transactionRow = page.locator('.transaction-row, tbody tr');
    
    // Filter section locators
    this.dateRangeFilter = page.locator('select[data-testid="date-range-filter"], #dateRangeFilter');
    this.cardFilter = page.locator('select[data-testid="card-filter"], #cardFilter');
    this.merchantFilter = page.locator('input[data-testid="merchant-filter"], #merchantFilter');
    this.minAmountInput = page.locator('input[data-testid="min-amount"], #minAmount');
    this.maxAmountInput = page.locator('input[data-testid="max-amount"], #maxAmount');
    this.startDateInput = page.locator('input[data-testid="start-date"], #startDate');
    this.endDateInput = page.locator('input[data-testid="end-date"], #endDate');
    this.applyFilterButton = page.locator('button[data-testid="apply-filter"], button:has-text("Apply Filter")');
    this.clearFilterButton = page.locator('button[data-testid="clear-filter"], button:has-text("Clear")');
    
    // Message locators
    this.noCardsMessage = page.locator('.no-cards-message, [data-testid="no-cards-message"]');
    this.noTransactionsMessage = page.locator('.no-transactions-message, [data-testid="no-transactions-message"]');
    this.noMatchingTransactionsMessage = page.locator('.no-matching-transactions, [data-testid="no-matching-transactions"]');
    this.transactionCount = page.locator('.transaction-count, [data-testid="transaction-count"]');
    this.validationError = page.locator('.validation-error, [data-testid="validation-error"]');
  }

  async navigate() {
    logger.info('Navigating to application home page');
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/.*/);
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTransactions() {
    logger.info('Navigating to Transactions page');
    await this.transactionsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactions() {
    const rows = await this.transactionRow.all();
    const transactions = [];
    
    for (const row of rows) {
      const date = await row.locator('td:nth-child(1), [data-testid="txn-date"]').textContent();
      const merchant = await row.locator('td:nth-child(2), [data-testid="txn-merchant"]').textContent();
      const amount = await row.locator('td:nth-child(3), [data-testid="txn-amount"]').textContent();
      const cardNumber = await row.locator('td:nth-child(4), [data-testid="txn-card"]').textContent();
      const cardType = await row.locator('td:nth-child(5), [data-testid="txn-card-type"]').textContent();
      
      transactions.push({
        date: date.trim(),
        merchant: merchant.trim(),
        amount: amount.trim(),
        cardNumber: cardNumber.trim(),
        cardType: cardType.trim()
      });
    }
    
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async getTransactionByIndex(index) {
    const row = this.transactionRow.nth(index);
    await expect(row).toBeVisible();
    
    const date = await row.locator('td:nth-child(1), [data-testid="txn-date"]').textContent();
    const merchant = await row.locator('td:nth-child(2), [data-testid="txn-merchant"]').textContent();
    const amount = await row.locator('td:nth-child(3), [data-testid="txn-amount"]').textContent();
    const cardNumber = await row.locator('td:nth-child(4), [data-testid="txn-card"]').textContent();
    
    return {
      date: date.trim(),
      merchant: merchant.trim(),
      amount: amount.trim(),
      cardNumber: cardNumber.trim()
    };
  }

  async getTransactionsByCard(cardNumber) {
    const allTransactions = await this.getAllTransactions();
    return allTransactions.filter(txn => txn.cardNumber === cardNumber);
  }

  async openCardFilter() {
    logger.info('Opening card filter dropdown');
    await this.cardFilter.click();
  }

  async getCardFilterOptions() {
    await this.openCardFilter();
    const options = await this.cardFilter.locator('option').allTextContents();
    return options.map(opt => opt.trim());
  }

  async selectCardFilter(cardNumber) {
    logger.info(`Selecting card filter: ${cardNumber}`);
    await this.cardFilter.selectOption({ label: cardNumber });
  }

  async selectDateRangeFilter(range) {
    logger.info(`Selecting date range filter: ${range}`);
    await this.dateRangeFilter.selectOption({ label: range });
  }

  async setMerchantFilter(merchant) {
    logger.info(`Setting merchant filter: ${merchant}`);
    await this.merchantFilter.fill(merchant);
  }

  async setAmountRange(min, max) {
    logger.info(`Setting amount range: ${min} - ${max}`);
    await this.minAmountInput.fill(min.toString());
    await this.maxAmountInput.fill(max.toString());
  }

  async setStartDate(date) {
    logger.info(`Setting start date: ${date}`);
    await this.startDateInput.fill(date);
  }

  async setEndDate(date) {
    logger.info(`Setting end date: ${date}`);
    await this.endDateInput.fill(date);
  }

  async applyFilters() {
    logger.info('Applying filters');
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters() {
    logger.info('Clearing filters');
    await this.clearFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    await expect(this.transactionCount).toBeVisible();
    const text = await this.transactionCount.textContent();
    return text.trim();
  }

};