const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.transactionsNavLink = page.locator('a[href*="/transactions"], nav a:has-text("Transactions")');
    
    // Transaction List Locators
    this.transactionRows = page.locator('table tbody tr, .transaction-row, [data-testid="transaction-row"]');
    this.transactionTable = page.locator('table.transaction-table, .transaction-list');
    
    // Filter Locators
    this.cardFilterDropdown = page.locator('select[name="cardFilter"], select#cardFilter, .card-filter-dropdown');
    
    // Pagination Locators
    this.paginationControls = page.locator('.pagination, [data-testid="pagination"]');
    this.nextPageButton = page.locator('.pagination a:has-text("Next"), button:has-text("Next")');
    this.prevPageButton = page.locator('.pagination a:has-text("Previous"), button:has-text("Previous")');
    
    // Message Locators
    this.noTransactionsMessage = page.locator('.no-transactions, .empty-state:has-text("No transactions found")').first();
    this.noTransactionsForCardMessage = page.locator('.no-transactions:has-text("for this card"), .empty-state:has-text("for this card")').first();
  }

  async navigateToTransactions() {
    await expect(this.transactionsNavLink).toBeVisible();
    await this.transactionsNavLink.click();
    await this.page.waitForURL(/\/transactions/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    return await this.transactionRows.count();
  }

  async getTransactionByIndex(index) {
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    
    const timestamp = await row.locator('td:nth-child(1), .timestamp').textContent();
    const cardName = await row.locator('td:nth-child(2), .card-name').textContent();
    const merchant = await row.locator('td:nth-child(3), .merchant-name').textContent();
    const category = await row.locator('td:nth-child(4), .category').textContent();
    const amount = await row.locator('td:nth-child(5), .amount').textContent();
    const status = await row.locator('td:nth-child(6), .status').textContent();
    
    return {
      timestamp: timestamp.trim(),
      cardName: cardName.trim(),
      merchant: merchant.trim(),
      category: category.trim(),
      amount: amount.trim(),
      status: status.trim()
    };
  }

  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const txn = await this.getTransactionByIndex(i);
      transactions.push(txn);
    }
    
    return transactions;
  }

  async getNoTransactionsMessageText() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async getNoTransactionsForCardMessageText() {
    await expect(this.noTransactionsForCardMessage).toBeVisible();
    return await this.noTransactionsForCardMessage.textContent();
  }

  async selectCardFilter(cardName) {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.selectOption({ label: cardName });
    await this.page.waitForLoadState('networkidle');
  }

  async clickNextPage() {
    await expect(this.nextPageButton).toBeVisible();
    await expect(this.nextPageButton).toBeEnabled();
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPrevPage() {
    await expect(this.prevPageButton).toBeVisible();
    await expect(this.prevPageButton).toBeEnabled();
    await this.prevPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};