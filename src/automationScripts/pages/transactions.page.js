const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionsPage = class TransactionsPage {

  constructor(page) {
    this.page = page;
    
    // Login page locators (reused)
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    
    // Navigation
    this.transactionsNavLink = page.locator('a[href*="transactions"], nav a:has-text("Transactions")').first();
    
    // Transaction list locators
    this.transactionTable = page.locator('[data-testid="transaction-table"], .transaction-table, table').first();
    this.transactionRows = page.locator('[data-testid="transaction-row"], .transaction-row, tbody tr');
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"], .loading, .spinner').first();
    
    // Pagination locators
    this.paginationInfo = page.locator('[data-testid="pagination-info"], .pagination-info, span:has-text("Page")').first();
    this.nextPageButton = page.locator('[data-testid="next-page"], button:has-text("Next")').first();
    this.prevPageButton = page.locator('[data-testid="prev-page"], button:has-text("Previous")').first();
    
    // Filter locators
    this.searchInput = page.locator('[data-testid="search-input"], input[type="search"], input[placeholder*="Search"]').first();
    this.cardFilterDropdown = page.locator('[data-testid="card-filter"], select[name="card"], select[id*="card"]').first();
    this.dateFromInput = page.locator('[data-testid="date-from"], input[name="dateFrom"], input[id*="from"]').first();
    this.dateToInput = page.locator('[data-testid="date-to"], input[name="dateTo"], input[id*="to"]').first();
    this.applyFilterButton = page.locator('[data-testid="apply-filter"], button:has-text("Apply"), button:has-text("Filter")').first();
    
    // Message locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error, .alert-danger').first();
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions"], div:has-text("No transactions available")').first();
    this.noMatchingResultsMessage = page.locator('[data-testid="no-results"], div:has-text("No transactions match")').first();
  }

  async navigate() {
    logger.info('Navigating to Credit Card Dashboard');
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTransactions() {
    logger.info('Navigating to Transactions section');
    await expect(this.transactionsNavLink).toBeVisible({ timeout: 5000 });
    await this.transactionsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionListToLoad() {
    logger.info('Waiting for transaction list to load');
    await expect(this.transactionTable).toBeVisible({ timeout: 10000 });
    // Wait for loading indicator to disappear if present
    try {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // Loading indicator may not be present
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionList() {
    logger.info('Retrieving transaction list');
    try {
      await expect(this.transactionRows.first()).toBeVisible({ timeout: 5000 });
    } catch {
      // No transactions available
      return [];
    }
    
    const count = await this.transactionRows.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const rowText = await row.textContent();
      
      // Parse transaction details from row text
      const idMatch = rowText.match(/(?:txn-|ID:?\s*)([A-Za-z0-9-]+)/i);
      const merchantMatch = rowText.match(/(?:Merchant:?\s*)?([A-Za-z0-9\s&]+?)(?:\s*\$|\s*Category)/i);
      const amountMatch = rowText.match(/\$?([0-9,]+\.?[0-9]*)/i);
      const dateMatch = rowText.match(/(\d{4}-\d{2}-\d{2})/i);
      const cardMatch = rowText.match(/(?:\*{4}|card-)([0-9A-Za-z-]+)/i);
      
      transactions.push({
        transactionId: idMatch ? idMatch[1] : null,
        merchantName: merchantMatch ? merchantMatch[1].trim() : null,
        amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
        date: dateMatch ? dateMatch[1] : null,
        cardNumber: cardMatch ? cardMatch[0] : null,
        cardId: cardMatch ? cardMatch[1] : null
      });
    }
    
    return transactions;
  }

  async hasNextPage() {
    logger.info('Checking if next page is available');
    try {
      await expect(this.nextPageButton).toBeVisible({ timeout: 3000 });
      const isDisabled = await this.nextPageButton.isDisabled();
      return !isDisabled;
    } catch {
      return false;
    }
  }

  async clickNextPage() {
    logger.info('Clicking next page button');
    await expect(this.nextPageButton).toBeEnabled({ timeout: 5000 });
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getPaginationInfo() {
    logger.info('Retrieving pagination information');
    await expect(this.paginationInfo).toBeVisible({ timeout: 5000 });
    const paginationText = await this.paginationInfo.textContent();
    
    // Parse pagination text (e.g., "Page 1 of 5")
    const match = paginationText.match(/Page\s+(\d+)\s+of\s+(\d+)/i);
    
    return {
      currentPage: match ? parseInt(match[1]) : 1,
      totalPages: match ? parseInt(match[2]) : 1
    };
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async getNoTransactionsMessage() {
    logger.info('Retrieving no transactions message');
    await expect(this.noTransactionsMessage).toBeVisible({ timeout: 5000 });
    return await this.noTransactionsMessage.textContent();
  }

  async enterSearchText(searchText) {
    logger.info(`Entering search text: ${searchText}`);
    await expect(this.searchInput).toBeVisible({ timeout: 5000 });
    await this.searchInput.fill(searchText);
  }

  async selectCardFilter(cardId) {
    logger.info(`Selecting card filter: ${cardId}`);
    await expect(this.cardFilterDropdown).toBeVisible({ timeout: 5000 });
    await this.cardFilterDropdown.selectOption({ value: cardId });
  }

  async setDateRangeFilter(fromDate, toDate) {
    logger.info(`Setting date range filter: ${fromDate} to ${toDate}`);
    await expect(this.dateFromInput).toBeVisible({ timeout: 5000 });
    await this.dateFromInput.fill(fromDate);
    await this.dateToInput.fill(toDate);
  }

  async applyFilters() {
    logger.info('Applying filters');
    // Check if apply button exists, otherwise filters may auto-apply
    try {
      await expect(this.applyFilterButton).toBeVisible({ timeout: 2000 });
      await this.applyFilterButton.click();
    } catch {
      logger.info('No apply button found, filters may auto-apply');
    }
  }

  async waitForFilterResults() {
    logger.info('Waiting for filter results');
    await this.page.waitForTimeout(500); // Brief wait for filter operation
    await this.page.waitForLoadState('networkidle');
  }

  async getNoMatchingResultsMessage() {
    logger.info('Retrieving no matching results message');
    await expect(this.noMatchingResultsMessage).toBeVisible({ timeout: 5000 });
    return await this.noMatchingResultsMessage.textContent();
  }

};