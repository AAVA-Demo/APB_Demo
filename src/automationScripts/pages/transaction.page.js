const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Transaction container
    this.transactionListContainer = page.locator('.transaction-list-container');
    this.transactionCards = page.locator('.transaction-card');
    
    // Filter controls
    this.dateFromInput = page.locator('input[name="dateFrom"]');
    this.dateToInput = page.locator('input[name="dateTo"]');
    this.cardFilterDropdown = page.locator('select[name="cardFilter"]');
    this.minAmountInput = page.locator('input[name="minAmount"]');
    this.maxAmountInput = page.locator('input[name="maxAmount"]');
    this.merchantNameInput = page.locator('input[name="merchantName"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters")');
    this.clearFiltersButton = page.locator('button:has-text("Clear Filters")');
    
    // Messages
    this.noTransactionsMessage = page.locator('text=No transactions found');
    this.noResultsMessage = page.locator('text=No transactions found matching your criteria');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigateToTransactions() {
    await this.page.click('a[href="#!/transactions"]');
    await expect(this.transactionListContainer).toBeVisible();
  }

  async navigateToDashboard() {
    await this.page.click('a[href="#!/dashboard"]');
  }

  async getTransactionCount() {
    return await this.transactionCards.count();
  }

  async getTransactionDetails(index) {
    const transaction = this.transactionCards.nth(index);
    await expect(transaction).toBeVisible();
    
    const merchantName = await transaction.locator('.merchant-name').textContent();
    const amount = await transaction.locator('.transaction-amount').textContent();
    const date = await transaction.locator('.transaction-date').textContent();
    const category = await transaction.locator('.transaction-category').textContent();
    const status = await transaction.locator('.transaction-status').textContent();
    const cardUsed = await transaction.locator('.card-used').textContent();
    
    return {
      merchantName,
      amount,
      date,
      category,
      status,
      cardUsed
    };
  }

  async getAllTransactionDates() {
    const dates = [];
    const count = await this.transactionCards.count();
    
    for (let i = 0; i < count; i++) {
      const transaction = this.transactionCards.nth(i);
      const date = await transaction.locator('.transaction-date').textContent();
      dates.push(date);
    }
    
    return dates;
  }

  async filterTransactionsByCard(cardNumber) {
    const transactions = [];
    const count = await this.transactionCards.count();
    
    for (let i = 0; i < count; i++) {
      const transaction = this.transactionCards.nth(i);
      const cardUsed = await transaction.locator('.card-used').textContent();
      
      if (cardUsed.includes(cardNumber)) {
        transactions.push(await this.getTransactionDetails(i));
      }
    }
    
    return transactions;
  }

  async setDateFromFilter(date) {
    await this.dateFromInput.fill(date);
  }

  async setDateToFilter(date) {
    await this.dateToInput.fill(date);
  }

  async selectCardFilter(cardNumber) {
    await this.cardFilterDropdown.selectOption({ label: cardNumber });
  }

  async setMinAmountFilter(amount) {
    await this.minAmountInput.fill(amount);
  }

  async setMaxAmountFilter(amount) {
    await this.maxAmountInput.fill(amount);
  }

  async setMerchantNameFilter(merchantName) {
    await this.merchantNameInput.fill(merchantName);
  }

  async clickApplyFilters() {
    await this.applyFiltersButton.click();
  }

  async waitForFilterResults() {
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactions() {
    const transactions = [];
    const count = await this.transactionCards.count();
    
    for (let i = 0; i < count; i++) {
      transactions.push(await this.getTransactionDetails(i));
    }
    
    return transactions;
  }

  async getNoTransactionsMessageText() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async getNoResultsMessageText() {
    await expect(this.noResultsMessage).toBeVisible();
    return await this.noResultsMessage.textContent();
  }

  async getDateFromValue() {
    return await this.dateFromInput.inputValue();
  }

  async getSelectedCardValue() {
    return await this.cardFilterDropdown.inputValue();
  }

  async getMerchantNameValue() {
    return await this.merchantNameInput.inputValue();
  }
};