const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Login locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Navigation
    this.transactionsNavLink = page.locator('[data-testid="nav-transactions"]');
    
    // Filter controls
    this.fromDateInput = page.locator('[data-testid="filter-from-date"]');
    this.toDateInput = page.locator('[data-testid="filter-to-date"]');
    this.merchantKeywordInput = page.locator('[data-testid="filter-merchant-keyword"]');
    this.minAmountInput = page.locator('[data-testid="filter-min-amount"]');
    this.maxAmountInput = page.locator('[data-testid="filter-max-amount"]');
    this.cardSelectDropdown = page.locator('[data-testid="filter-card-select"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    this.resetFiltersButton = page.locator('[data-testid="reset-filters-button"]');
    
    // Validation
    this.validationError = page.locator('[data-testid="validation-error"]');
    
    // Transaction list
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionItems = page.locator('[data-testid="transaction-list"] .transaction-item');
    this.transactionCountDisplay = page.locator('[data-testid="transaction-count"]');
    this.resultCountMessage = page.locator('[data-testid="result-count-message"]');
    
    // Pagination
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.nextPageButton = page.locator('[data-testid="next-page-button"]');
    this.totalPagesDisplay = page.locator('[data-testid="total-pages"]');
    
    // Sync notification
    this.syncNotification = page.locator('[data-testid="sync-notification"]');
    this.lastSyncTimestamp = page.locator('[data-testid="last-sync-timestamp"]');
    this.retrySyncButton = page.locator('[data-testid="retry-sync-button"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.page).toHaveTitle(/Credit Card Dashboard/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToTransactions() {
    await this.transactionsNavLink.click();
    await expect(this.transactionList).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    await expect(this.transactionCountDisplay).toBeVisible();
    const text = await this.transactionCountDisplay.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  async applyDateRangeFilter(fromDate, toDate) {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    await this.fromDateInput.fill(formatDate(fromDate));
    await this.toDateInput.fill(formatDate(toDate));
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactions() {
    await expect(this.transactionItems.first()).toBeVisible();
    const items = await this.transactionItems.all();
    const transactions = [];
    
    for (const item of items) {
      const date = await item.getAttribute('data-transaction-date');
      const merchant = await item.getAttribute('data-merchant');
      const amount = parseFloat(await item.getAttribute('data-amount'));
      const cardNumber = await item.getAttribute('data-card-number');
      const category = await item.getAttribute('data-category');
      
      transactions.push({ date, merchant, amount, cardNumber, category });
    }
    
    return transactions;
  }

  async setFromDate(dateString) {
    await this.fromDateInput.fill(dateString);
  }

  async setToDate(dateString) {
    await this.toDateInput.fill(dateString);
  }

  async clickApplyFilter() {
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(500);
  }

  async getValidationError() {
    await expect(this.validationError).toBeVisible();
    return await this.validationError.textContent();
  }

  async setMerchantKeyword(keyword) {
    await this.merchantKeywordInput.fill(keyword);
  }

  async setAmountRange(minAmount, maxAmount) {
    await this.minAmountInput.fill(String(minAmount));
    await this.maxAmountInput.fill(String(maxAmount));
  }

  async selectCard(cardNumber) {
    await this.cardSelectDropdown.selectOption({ label: cardNumber });
  }

  async getResultCountMessage() {
    await expect(this.resultCountMessage).toBeVisible();
    return await this.resultCountMessage.textContent();
  }

  async clickResetFilters() {
    await this.resetFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getVisibleTransactions() {
    await expect(this.transactionItems.first()).toBeVisible();
    return await this.getAllTransactions();
  }

  async hasPaginationControls() {
    return await this.paginationControls.isVisible();
  }

  async getTotalPages() {
    await expect(this.totalPagesDisplay).toBeVisible();
    const text = await this.totalPagesDisplay.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  async goToNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalTransactionCount() {
    return await this.getTransactionCount();
  }

  async loadAllTransactions() {
    // Load all pages by clicking next until disabled
    while (await this.nextPageButton.isEnabled()) {
      await this.goToNextPage();
      await this.page.waitForTimeout(500);
    }
  }

  async getSyncNotification() {
    await expect(this.syncNotification).toBeVisible();
    return await this.syncNotification.textContent();
  }

  async getLastSyncTimestamp() {
    await expect(this.lastSyncTimestamp).toBeVisible();
    return await this.lastSyncTimestamp.textContent();
  }

  async hasRetrySyncButton() {
    return await this.retrySyncButton.isVisible();
  }
};