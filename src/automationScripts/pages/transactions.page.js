const { expect } = require('@playwright/test');

/**
 * Transactions Page Object
 * Handles all interactions with the Transactions page
 * Covers: Transaction Listing, Search, Filtering, Multi-Card Display
 */
exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list, .transactions');
    this.transactionItems = page.locator('[data-testid="transaction-item"], .transaction-item');
    
    // Filter Locators
    this.dateFromInput = page.locator('[data-testid="date-from"], input[name="dateFrom"], #dateFrom');
    this.dateToInput = page.locator('[data-testid="date-to"], input[name="dateTo"], #dateTo');
    this.cardFilterDropdown = page.locator('[data-testid="card-filter"], select[name="cardFilter"], #cardFilter');
    this.applyFiltersButton = page.locator('[data-testid="apply-filters"], button:has-text("Apply Filters")');
    
    // Search Locators
    this.searchInput = page.locator('[data-testid="search-input"], input[type="search"], input[placeholder*="Search"]');
    this.searchButton = page.locator('[data-testid="search-button"], button:has-text("Search")');
    
    // Message Locators
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"], .no-transactions, .empty-state');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    
    // Transaction Count
    this.transactionCount = page.locator('[data-testid="transaction-count"], .transaction-count');
  }

  /**
   * Navigate to transactions page
   */
  async navigate() {
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for transactions to load
   */
  async waitForTransactionsLoad() {
    await expect(this.transactionList).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Authenticate user (mock authentication)
   * @param {string} userId - User identifier
   */
  async authenticateUser(userId) {
    await this.page.evaluate((id) => {
      localStorage.setItem('userId', id);
      localStorage.setItem('authToken', 'mock-token-' + id);
    }, userId);
  }

  /**
   * Get transaction count
   * @returns {Promise<number>} Number of transactions
   */
  async getTransactionCount() {
    const count = await this.transactionItems.count();
    return count;
  }

  /**
   * Set date range filter
   * @param {string} dateFrom - Start date (YYYY-MM-DD)
   * @param {string} dateTo - End date (YYYY-MM-DD)
   */
  async setDateRangeFilter(dateFrom, dateTo) {
    await this.dateFromInput.fill(dateFrom);
    await this.dateToInput.fill(dateTo);
  }

  /**
   * Select card filter
   * @param {string} cardName - Name of the card to filter
   */
  async selectCardFilter(cardName) {
    await this.cardFilterDropdown.selectOption({ label: cardName });
  }

  /**
   * Apply filters
   */
  async applyFilters() {
    await this.applyFiltersButton.click();
  }

  /**
   * Wait for filter results to load
   */
  async waitForFilterResults() {
    // Wait for loading state to complete
    await this.page.waitForLoadState('networkidle');
    // Small delay to ensure UI updates
    await this.page.waitForTimeout(100);
  }

  /**
   * Get all transactions
   * @returns {Promise<Array>} Array of transaction objects
   */
  async getAllTransactions() {
    const count = await this.transactionItems.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.transactionItems.nth(i);
      
      const merchantName = await item.locator('[data-testid="merchant-name"], .merchant-name, .merchant').textContent();
      const amount = await item.locator('[data-testid="amount"], .amount').textContent();
      const date = await item.locator('[data-testid="date"], .date, .transaction-date').textContent();
      const cardName = await item.locator('[data-testid="card-name"], .card-name, .card').textContent();
      const description = await item.locator('[data-testid="description"], .description').textContent().catch(() => '');
      
      transactions.push({
        merchantName: merchantName.trim(),
        amount: amount.trim(),
        date: date.trim(),
        cardName: cardName.trim(),
        description: description.trim()
      });
    }
    
    return transactions;
  }

  /**
   * Enter search term
   * @param {string} searchTerm - Search term to enter
   */
  async enterSearchTerm(searchTerm) {
    await this.searchInput.fill(searchTerm);
  }

  /**
   * Wait for search results
   */
  async waitForSearchResults() {
    // Wait for debounce delay (500ms) plus processing time
    await this.page.waitForTimeout(600);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get error message
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error message exists
   */
  async hasErrorMessage() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if cards are visually distinguishable
   * @returns {Promise<boolean>} True if cards are distinguishable
   */
  async areCardsVisuallyDistinguishable() {
    const count = await this.transactionItems.count();
    if (count === 0) return false;
    
    // Check if card name is visible in each transaction
    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = this.transactionItems.nth(i);
      const cardNameElement = item.locator('[data-testid="card-name"], .card-name, .card');
      const isVisible = await cardNameElement.isVisible();
      if (!isVisible) return false;
    }
    
    return true;
  }

  /**
   * Get no transactions message
   * @returns {Promise<string>} No transactions message text
   */
  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  /**
   * Check if no transactions message is displayed
   * @returns {Promise<boolean>} True if message exists
   */
  async hasNoTransactionsMessage() {
    return await this.noTransactionsMessage.isVisible();
  }
};
