const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    // Transaction List Locators
    this.transactionTable = page.locator('table.transaction-table, [data-testid="transaction-table"]');
    this.transactionRows = page.locator('table tbody tr, [data-testid="transaction-row"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions"], .no-transactions-message');
    this.noMatchesMessage = page.locator('[data-testid="no-matches"], .no-matches-message');
    
    // Pagination Locators
    this.paginationControls = page.locator('.pagination-controls, [data-testid="pagination"]');
    this.nextPageButton = page.locator('button:has-text("Next"), [data-testid="next-page"]');
    this.previousPageButton = page.locator('button:has-text("Previous"), [data-testid="previous-page"]');
    this.pageInfo = page.locator('.page-info, [data-testid="page-info"]');
    
    // Filter Locators
    this.filterPanel = page.locator('.filter-panel, [data-testid="filter-panel"]');
    this.cardIdInput = page.locator('input[name="cardId"], [data-testid="card-id-filter"]');
    this.startDateInput = page.locator('input[name="startDate"], [data-testid="start-date"]');
    this.endDateInput = page.locator('input[name="endDate"], [data-testid="end-date"]');
    this.transactionTypeSelect = page.locator('select[name="transactionType"], [data-testid="transaction-type"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply"), [data-testid="apply-filters"]');
    this.clearFiltersButton = page.locator('button:has-text("Clear"), [data-testid="clear-filters"]');
    
    // Validation and Error Locators
    this.validationError = page.locator('.validation-error, [data-testid="validation-error"]');
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"]');
    this.retryButton = page.locator('button:has-text("Retry"), [data-testid="retry-button"]');
    this.filteredCountText = page.locator('[data-testid="filtered-count"], .filtered-count');
    
    // Navigation
    this.dashboardLink = page.locator('a[href*="dashboard"], nav a:has-text("Dashboard")');
  }

  async navigate() {
    await this.page.goto('/transactions');
  }

  async waitForTransactionsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500); // Allow for data rendering
  }

  async getTransactionCount() {
    await this.page.waitForTimeout(500);
    return await this.transactionRows.count();
  }

  async getTransactionDetails(index) {
    const row = this.transactionRows.nth(index);
    await row.waitFor({ state: 'visible' });
    
    const cells = row.locator('td');
    
    return {
      date: await cells.nth(0).textContent(),
      merchant: await cells.nth(1).textContent(),
      card: await cells.nth(2).textContent(),
      amount: await cells.nth(3).textContent(),
      category: await cells.nth(4).textContent(),
      status: await cells.nth(5).textContent()
    };
  }

  async getAllTransactionDetails() {
    const count = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      transactions.push(await this.getTransactionDetails(i));
    }
    
    return transactions;
  }

  async getPaginationText() {
    await this.pageInfo.waitFor({ state: 'visible' });
    return await this.pageInfo.textContent();
  }

  async clickNextPage() {
    await this.nextPageButton.click();
  }

  async clickPreviousPage() {
    await this.previousPageButton.click();
  }

  async getUniqueCardNames() {
    const transactions = await this.getAllTransactionDetails();
    const cardNames = transactions.map(t => t.card);
    return [...new Set(cardNames)];
  }

  async getAllTransactionDates() {
    const transactions = await this.getAllTransactionDetails();
    return transactions.map(t => t.date);
  }

  async areAllColumnsVisible() {
    const headerCells = await this.page.locator('table thead th').count();
    return headerCells >= 6; // Date, Merchant, Card, Amount, Category, Status
  }

  async isCardBasedLayout() {
    // Check if transactions are displayed in card format (mobile view)
    const cardElements = await this.page.locator('.transaction-card, [data-testid="transaction-card"]').count();
    return cardElements > 0;
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Filter Methods
  async setCardIdFilter(cardId) {
    await this.cardIdInput.fill(cardId);
  }

  async setStartDate(date) {
    await this.startDateInput.fill(date);
  }

  async setEndDate(date) {
    await this.endDateInput.fill(date);
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.setStartDate(startDate);
    await this.setEndDate(endDate);
    await this.clickApplyFilters();
  }

  async setTransactionTypeFilter(type) {
    await this.transactionTypeSelect.selectOption(type);
  }

  async clickApplyFilters() {
    await this.applyFiltersButton.click();
  }

  async clickClearFilters() {
    await this.clearFiltersButton.click();
  }

  async getStartDateValue() {
    return await this.startDateInput.inputValue();
  }

  async getEndDateValue() {
    return await this.endDateInput.inputValue();
  }

  async getFilteredCountText() {
    await this.filteredCountText.waitFor({ state: 'visible' });
    return await this.filteredCountText.textContent();
  }
};