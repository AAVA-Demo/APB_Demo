const { expect } = require('@playwright/test');

/**
 * Page Object Model for Transaction Management
 * Handles all transaction-related interactions including filtering, searching, and viewing transaction details
 */
exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation locators
    this.dashboardNavLink = page.locator('a[href="#!/dashboard"]');
    this.transactionsNavLink = page.locator('a[href="#!/transactions"]');
    this.analyticsNavLink = page.locator('a[href="#!/analytics"]');
    
    // Authentication locators
    this.usernameInput = page.locator('input[type="email"], input[name="username"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
    
    // Transaction container
    this.transactionsContainer = page.locator('.transactions-container');
    this.transactionList = page.locator('transaction-list, .transaction-list');
    this.transactionRows = page.locator('transaction-list tbody tr, .transaction-list table tbody tr');
    
    // Filter locators
    this.cardFilterDropdown = page.locator('select[ng-model="filter.cardId"], select:has-text("All Cards")');
    this.categoryFilter = page.locator('select[ng-model="filter.category"]');
    this.startDateFilter = page.locator('input[ng-model="filter.startDate"], input[type="date"][name="startDate"]');
    this.endDateFilter = page.locator('input[ng-model="filter.endDate"], input[type="date"][name="endDate"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    
    // Search locators
    this.searchField = page.locator('input[ng-model="filter.searchText"], input[placeholder*="Search by merchant"]');
    this.clearSearchButton = page.locator('button:has-text("Clear"), .clear-search');
    
    // Message locators
    this.noTransactionsMessage = page.locator('div:has-text("No transactions found for this card"), .alert-info:has-text("No transactions")');
    this.noMatchingTransactionsMessage = page.locator('div:has-text("No matching transactions found"), .alert-info:has-text("No matching")');
    this.loadingIndicator = page.locator('.loading-spinner, div:has-text("Loading transactions")');
    this.timeoutErrorMessage = page.locator('.alert-danger:has-text("timed out"), div:has-text("Request timed out")');
    this.retryButton = page.locator('button:has-text("Retry")');
    
    // Transaction detail locators
    this.transactionDetailModal = page.locator('.modal, transaction-detail');
  }

  /**
   * Navigate to the application
   */
  async navigate() {
    await this.page.goto('https://app.creditcard.com');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login to the application
   * @param {string} username - User email
   * @param {string} password - User password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to Transactions page
   */
  async navigateToTransactions() {
    await this.transactionsNavLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionsContainer).toBeVisible();
  }

  /**
   * Get transaction count
   * @returns {Promise<number>} Number of transactions
   */
  async getTransactionCount() {
    const rows = await this.transactionRows.all();
    return rows.length;
  }

  /**
   * Get unique card numbers from displayed transactions
   * @returns {Promise<Array<string>>} Array of unique card numbers
   */
  async getUniqueCardNumbers() {
    const rows = await this.transactionRows.all();
    const cardNumbers = new Set();
    
    for (const row of rows) {
      const cardCell = await row.locator('td:nth-child(5)').textContent();
      cardNumbers.add(cardCell.trim());
    }
    
    return Array.from(cardNumbers);
  }

  /**
   * Click card filter dropdown
   */
  async clickCardFilterDropdown() {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.click();
  }

  /**
   * Select card from filter dropdown
   * @param {string} cardNumber - Card number to select
   */
  async selectCardFromFilter(cardNumber) {
    await this.cardFilterDropdown.selectOption({ label: cardNumber });
    await this.page.waitForTimeout(100);
  }

  /**
   * Wait for transaction list update
   */
  async waitForTransactionListUpdate() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(200);
  }

  /**
   * Get all displayed transactions
   * @returns {Promise<Array<Object>>} Array of transaction objects
   */
  async getAllDisplayedTransactions() {
    const rows = await this.transactionRows.all();
    const transactions = [];
    
    for (const row of rows) {
      const date = await row.locator('td:nth-child(1)').textContent();
      const merchantName = await row.locator('td:nth-child(2)').textContent();
      const category = await row.locator('td:nth-child(3)').textContent();
      const amount = await row.locator('td:nth-child(4)').textContent();
      const cardNumber = await row.locator('td:nth-child(5)').textContent();
      const status = await row.locator('td:nth-child(6)').textContent();
      
      transactions.push({
        date: date.trim(),
        merchantName: merchantName.trim(),
        category: category.trim(),
        amount: amount.trim(),
        cardNumber: cardNumber.trim(),
        status: status.trim()
      });
    }
    
    return transactions;
  }

  /**
   * Get no transactions message
   * @returns {Promise<string>} No transactions message
   */
  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  /**
   * Check if empty table rows exist
   * @returns {Promise<boolean>} True if empty table rows exist
   */
  async hasEmptyTableRows() {
    const emptyRows = await this.page.locator('tbody tr:has-text("")').count();
    return emptyRows > 0;
  }

  /**
   * Check if error state exists
   * @returns {Promise<boolean>} True if error state exists
   */
  async hasErrorState() {
    const errorIcon = await this.page.locator('.error-icon, .alert-danger').isVisible().catch(() => false);
    return errorIcon;
  }

  /**
   * Check if null or undefined values exist
   * @returns {Promise<boolean>} True if null or undefined values exist
   */
  async hasNullOrUndefinedValues() {
    const pageText = await this.page.textContent('body');
    return pageText.includes('null') || pageText.includes('undefined');
  }

  /**
   * Get loading message
   * @returns {Promise<string>} Loading message
   */
  async getLoadingMessage() {
    await expect(this.loadingIndicator).toBeVisible();
    return await this.loadingIndicator.textContent();
  }

  /**
   * Get timeout error message
   * @returns {Promise<string>} Timeout error message
   */
  async getTimeoutErrorMessage() {
    await expect(this.timeoutErrorMessage).toBeVisible();
    return await this.timeoutErrorMessage.textContent();
  }

  /**
   * Click retry button
   */
  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Enter search term
   * @param {string} searchTerm - Search term
   */
  async enterSearchTerm(searchTerm) {
    await expect(this.searchField).toBeVisible();
    await this.searchField.fill(searchTerm);
    await this.page.waitForTimeout(100);
  }

  /**
   * Wait for search results
   */
  async waitForSearchResults() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(200);
  }

  /**
   * Check if search term is highlighted
   * @param {string} searchTerm - Search term to check
   * @returns {Promise<boolean>} True if search term is highlighted
   */
  async isSearchTermHighlighted(searchTerm) {
    const highlightedElements = await this.page.locator(`mark:has-text("${searchTerm}"), .highlight:has-text("${searchTerm}"), strong:has-text("${searchTerm}")`).count();
    return highlightedElements > 0;
  }

  /**
   * Check if transactions from specific merchants exist
   * @param {Array<string>} merchants - Array of merchant names
   * @returns {Promise<boolean>} True if transactions from merchants exist
   */
  async hasTransactionsFromMerchants(merchants) {
    const transactions = await this.getAllDisplayedTransactions();
    return transactions.some(txn => merchants.includes(txn.merchantName));
  }

  /**
   * Get no matching transactions message
   * @returns {Promise<string>} No matching transactions message
   */
  async getNoMatchingTransactionsMessage() {
    await expect(this.noMatchingTransactionsMessage).toBeVisible();
    return await this.noMatchingTransactionsMessage.textContent();
  }

  /**
   * Click clear search button
   */
  async clickClearSearchButton() {
    await expect(this.clearSearchButton).toBeVisible();
    await this.clearSearchButton.click();
    await this.page.waitForTimeout(200);
  }

  /**
   * Clear search
   */
  async clearSearch() {
    await this.searchField.clear();
    await this.page.waitForTimeout(100);
  }
};