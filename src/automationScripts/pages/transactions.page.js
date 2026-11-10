const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionList = page.locator('.transaction-list, [data-testid="transaction-list"]');
    this.transactionItems = page.locator('.transaction-item, [data-testid="transaction-item"]');
    
    // Filter Locators
    this.cardFilterDropdown = page.locator('select[name="cardFilter"], #cardFilter, .filter-panel select');
    this.filterPanel = page.locator('.filter-panel, [data-testid="filter-panel"]');
    
    // Pagination Locators
    this.paginationControls = page.locator('.pagination-controls, [data-testid="pagination"]');
    this.previousButton = page.locator('button:has-text("Previous"), [data-testid="prev-button"]');
    this.nextButton = page.locator('button:has-text("Next"), [data-testid="next-button"]');
    this.paginationText = page.locator('.pagination-controls span, [data-testid="pagination-text"]');
    
    // Messages
    this.errorMessage = page.locator('.alert-danger, .error-message, [role="alert"][class*="error"]');
    this.emptyStateMessage = page.locator('.alert-info, .empty-state, [data-testid="empty-state"]');
    this.loadingSpinner = page.locator('.loading-spinner, [data-testid="loading"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard.demo.com/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionListLoad() {
    await this.page.waitForSelector('.transaction-list, [data-testid="transaction-list"]', { timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async getTransactionCount() {
    return await this.transactionItems.count();
  }

  getTransactionDate(transactionElement) {
    return transactionElement.locator('.date, [data-testid="transaction-date"]');
  }

  getTransactionMerchant(transactionElement) {
    return transactionElement.locator('.merchant, [data-testid="merchant-name"]');
  }

  getTransactionAmount(transactionElement) {
    return transactionElement.locator('.amount, [data-testid="transaction-amount"]');
  }

  getTransactionCategory(transactionElement) {
    return transactionElement.locator('.category-badge, [data-testid="transaction-category"]');
  }

  getTransactionCard(transactionElement) {
    return transactionElement.locator('[data-testid="card-name"], .card-name');
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getPaginationText() {
    await expect(this.paginationText).toBeVisible();
    return await this.paginationText.textContent();
  }

  async getSelectedCardFilter() {
    await expect(this.cardFilterDropdown).toBeVisible();
    return await this.cardFilterDropdown.inputValue();
  }

  async selectCardFilter(cardName) {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.selectOption({ label: cardName });
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAllTransactionsMatchCard(cardName) {
    const count = await this.getTransactionCount();
    if (count === 0) return true;
    
    for (let i = 0; i < count; i++) {
      const transaction = this.transactionItems.nth(i);
      const cardText = await this.getTransactionCard(transaction).textContent();
      if (!cardText.includes(cardName)) {
        return false;
      }
    }
    return true;
  }

  async verifyMultipleCardsDisplayed() {
    const count = await this.getTransactionCount();
    if (count === 0) return false;
    
    const cardNames = new Set();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const transaction = this.transactionItems.nth(i);
      const cardText = await this.getTransactionCard(transaction).textContent();
      cardNames.add(cardText.trim());
    }
    
    return cardNames.size > 1;
  }
};