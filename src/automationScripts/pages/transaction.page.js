const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.transactionsMenu = page.locator('[data-testid="nav-transactions"]');
    
    // Transaction List
    this.transactionTable = page.locator('[data-testid="transaction-table"]');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.noResultsMessage = page.locator('[data-testid="no-results-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    
    // Pagination
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.paginationInfo = page.locator('[data-testid="pagination-info"]');
    this.previousButton = page.locator('[data-testid="pagination-previous"]');
    this.nextButton = page.locator('[data-testid="pagination-next"]');
    
    // Filters
    this.searchField = page.locator('[data-testid="search-field"]');
    this.fromDateFilter = page.locator('[data-testid="filter-from-date"]');
    this.toDateFilter = page.locator('[data-testid="filter-to-date"]');
    this.categoryFilter = page.locator('[data-testid="filter-category"]');
    this.cardFilter = page.locator('[data-testid="filter-card"]');
    
    // Transaction Fields
    this.transactionDate = page.locator('[data-testid="transaction-date"]');
    this.transactionCard = page.locator('[data-testid="transaction-card"]');
    this.transactionMerchant = page.locator('[data-testid="transaction-merchant"]');
    this.transactionCategory = page.locator('[data-testid="transaction-category"]');
    this.transactionAmount = page.locator('[data-testid="transaction-amount"]');
    this.transactionStatus = page.locator('[data-testid="transaction-status"]');
  }
  
  async navigate() {
    await this.page.goto('https://creditcard.example.com');
  }
  
  async clickTransactionsMenu() {
    await this.transactionsMenu.click();
  }
  
  async waitForTransactionListToLoad() {
    await this.transactionTable.waitFor({ state: 'visible', timeout: 5000 });
  }
  
  async getTransactionCount() {
    return await this.transactionRows.count();
  }
  
  async getAllTransactionDates() {
    const count = await this.getTransactionCount();
    const dates = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const dateText = await row.locator('[data-testid="transaction-date"]').textContent();
      dates.push(dateText);
    }
    
    return dates;
  }
  
  verifyDatesSortedDescending(dates) {
    for (let i = 0; i < dates.length - 1; i++) {
      const date1 = new Date(dates[i]);
      const date2 = new Date(dates[i + 1]);
      if (date1 < date2) {
        return false;
      }
    }
    return true;
  }
  
  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      transactions.push({
        date: await row.locator('[data-testid="transaction-date"]').textContent(),
        cardName: await row.locator('[data-testid="transaction-card"]').textContent(),
        merchant: await row.locator('[data-testid="transaction-merchant"]').textContent(),
        category: await row.locator('[data-testid="transaction-category"]').textContent(),
        amount: await row.locator('[data-testid="transaction-amount"]').textContent(),
        status: await row.locator('[data-testid="transaction-status"]').textContent()
      });
    }
    
    return transactions;
  }
  
  async clickNextPage() {
    await this.nextButton.click();
  }
  
  async clickPreviousPage() {
    await this.previousButton.click();
  }
  
  async setDateRange(fromDate, toDate) {
    await this.fromDateFilter.fill(fromDate);
    await this.toDateFilter.fill(toDate);
    // Wait for debounce
    await this.page.waitForTimeout(500);
  }
  
  async searchByMerchant(merchantName) {
    await this.searchField.fill(merchantName);
    // Wait for debounce
    await this.page.waitForTimeout(500);
  }
  
  async selectCategory(category) {
    await this.categoryFilter.selectOption(category);
  }
  
  async selectCard(cardName) {
    await this.cardFilter.selectOption(cardName);
  }
};
