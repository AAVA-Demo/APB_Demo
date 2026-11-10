const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction Table Locators
    this.transactionTable = page.locator('[data-testid="transaction-table"], table:has-text("Date")');
    this.transactionRows = page.locator('[data-testid="transaction-row"], tbody tr');
    this.dateCell = (row) => row.locator('td:nth-child(1)');
    this.merchantCell = (row) => row.locator('td:nth-child(2)');
    this.categoryCell = (row) => row.locator('td:nth-child(3)');
    this.amountCell = (row) => row.locator('td:nth-child(4)');
    this.statusCell = (row) => row.locator('td:nth-child(5)');
    
    // Filter Locators
    this.dateFromInput = page.locator('[data-testid="date-from-input"], input[name="dateFrom"], #dateFrom');
    this.dateToInput = page.locator('[data-testid="date-to-input"], input[name="dateTo"], #dateTo');
    this.merchantInput = page.locator('[data-testid="merchant-input"], input[name="merchant"], input[placeholder*="merchant" i]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-btn"], button:has-text("Apply"), button:has-text("Search")');
    
    // Message Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger, .error-message');
    this.validationError = page.locator('[data-testid="validation-error"], .validation-error, .field-error');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"], .empty-state:has-text("No transactions")');
    this.noResultsMessage = page.locator('[data-testid="no-results-message"], .no-results:has-text("No transactions match")');
    this.retryButton = page.locator('[data-testid="retry-btn"], button:has-text("Retry")');
    
    // Container
    this.transactionContainer = page.locator('[data-testid="transaction-container"], .transaction-list-container');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await this.waitForTransactionListLoad();
  }

  async waitForTransactionListLoad() {
    await expect(this.transactionContainer).toBeVisible({ timeout: 5000 });
  }

  async waitForFilterResults() {
    // Wait for loading indicator to disappear or table to update
    await this.page.waitForTimeout(100); // Small wait for filter to apply
    await expect(this.transactionTable).toBeVisible();
  }

  async getTransactionCount() {
    try {
      await expect(this.transactionTable).toBeVisible({ timeout: 2000 });
      return await this.transactionRows.count();
    } catch {
      return 0;
    }
  }

  async verifyTransactionDetails(rowIndex) {
    const row = this.transactionRows.nth(rowIndex);
    await expect(row).toBeVisible();
    
    // Verify date is displayed
    const date = await this.dateCell(row).textContent();
    expect(date).toBeTruthy();
    
    // Verify merchant is displayed
    const merchant = await this.merchantCell(row).textContent();
    expect(merchant).toBeTruthy();
    
    // Verify category is displayed
    const category = await this.categoryCell(row).textContent();
    expect(category).toBeTruthy();
    
    // Verify amount is in currency format
    const amount = await this.amountCell(row).textContent();
    expect(amount).toMatch(/\$[\d,]+/);
    
    // Verify status is displayed (posted/pending)
    const status = await this.statusCell(row).textContent();
    expect(status).toMatch(/posted|pending/i);
  }

  async verifyTransactionsSortedByDate() {
    const count = await this.getTransactionCount();
    if (count < 2) return; // Need at least 2 transactions to verify sorting
    
    const firstDate = await this.dateCell(this.transactionRows.nth(0)).textContent();
    const secondDate = await this.dateCell(this.transactionRows.nth(1)).textContent();
    
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    
    // First date should be more recent than second date
    expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
  }

  async setDateRangeFilter(fromDate, toDate) {
    await expect(this.dateFromInput).toBeVisible();
    await this.dateFromInput.fill(fromDate);
    await expect(this.dateToInput).toBeVisible();
    await this.dateToInput.fill(toDate);
  }

  async setMerchantFilter(merchantName) {
    await expect(this.merchantInput).toBeVisible();
    await this.merchantInput.fill(merchantName);
  }

  async applyFilters() {
    await expect(this.applyFilterButton).toBeVisible();
    await this.applyFilterButton.click();
  }

  async verifyFilteredResults(fromDate, toDate, merchantName) {
    const count = await this.getTransactionCount();
    expect(count).toBeGreaterThan(0);
    
    // Verify first transaction matches filter criteria
    const row = this.transactionRows.nth(0);
    const date = await this.dateCell(row).textContent();
    const merchant = await this.merchantCell(row).textContent();
    
    // Verify date is within range
    const transactionDate = new Date(date);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    expect(transactionDate.getTime()).toBeGreaterThanOrEqual(from.getTime());
    expect(transactionDate.getTime()).toBeLessThanOrEqual(to.getTime());
    
    // Verify merchant matches
    expect(merchant.toLowerCase()).toContain(merchantName.toLowerCase());
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getValidationErrorText() {
    await expect(this.validationError).toBeVisible();
    return await this.validationError.textContent();
  }

  async getNoTransactionsMessageText() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async getNoResultsMessageText() {
    await expect(this.noResultsMessage).toBeVisible();
    return await this.noResultsMessage.textContent();
  }
};