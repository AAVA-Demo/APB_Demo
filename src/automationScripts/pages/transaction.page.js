const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {

  constructor(page) {
    this.page = page;
    
    // Navigation locators
    this.transactionsLink = page.locator('a[href*="transactions"]');
    
    // Filter panel locators
    this.showFiltersButton = page.locator('button:has-text("Show Filters")');
    this.hideFiltersButton = page.locator('button:has-text("Hide Filters")');
    this.filterPanel = page.locator('.transaction-filter, [transaction-filter]');
    this.startDateInput = page.locator('input[type="date"][ng-model*="startDate"], input[name="startDate"]');
    this.endDateInput = page.locator('input[type="date"][ng-model*="endDate"], input[name="endDate"]');
    this.cardDropdown = page.locator('select[ng-model*="selectedCard"], select.form-control:has-text("All Cards")');
    this.minAmountInput = page.locator('input[ng-model*="minAmount"], input[placeholder*="Min"]');
    this.maxAmountInput = page.locator('input[ng-model*="maxAmount"], input[placeholder*="Max"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters")');
    this.clearFiltersButton = page.locator('button:has-text("Clear")');
    
    // Search locators
    this.merchantSearchInput = page.locator('input[placeholder*="merchant"], input[type="search"]');
    
    // Transaction list locators
    this.transactionTable = page.locator('.transaction-table table, table');
    this.transactionRows = page.locator('.transaction-table tbody tr, table tbody tr');
    this.noTransactionsMessage = page.locator('.alert-info:has-text("No transactions"), text=/No transactions found/i');
    
    // Pagination locators
    this.paginationControls = page.locator('.pagination-controls, [transaction-pagination]');
    this.nextPageButton = page.locator('button:has-text("Next")');
    this.previousPageButton = page.locator('button:has-text("Previous")');
    this.pageInfo = page.locator('text=/Page \d+ of \d+/');
    
    // Login locators
    this.usernameInput = page.locator('input[type="email"], input[name="username"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login"), button:has-text("Sign In")');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async goToTransactions() {
    await this.transactionsLink.click();
    await this.page.waitForURL(/.*transactions/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionTable).toBeVisible({ timeout: 10000 });
  }

  async clickShowFilters() {
    await this.showFiltersButton.click();
    await expect(this.filterPanel).toBeVisible();
  }

  async setStartDate(date) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(date);
  }

  async setEndDate(date) {
    await expect(this.endDateInput).toBeVisible();
    await this.endDateInput.fill(date);
  }

  async selectCard(cardName) {
    await expect(this.cardDropdown).toBeVisible();
    await this.cardDropdown.selectOption({ label: cardName });
  }

  async setMinAmount(amount) {
    await expect(this.minAmountInput).toBeVisible();
    await this.minAmountInput.fill(amount);
  }

  async setMaxAmount(amount) {
    await expect(this.maxAmountInput).toBeVisible();
    await this.maxAmountInput.fill(amount);
  }

  async clickApplyFilters() {
    await this.applyFiltersButton.click();
  }

  async clickClearFilters() {
    await this.clearFiltersButton.click();
  }

  async searchByMerchant(merchantName) {
    await expect(this.merchantSearchInput).toBeVisible();
    await this.merchantSearchInput.fill(merchantName);
    await this.merchantSearchInput.press('Enter');
  }

  async waitForTransactionListUpdate() {
    await this.page.waitForTimeout(300);
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactions() {
    await this.page.waitForSelector('table tbody tr', { state: 'visible', timeout: 5000 }).catch(() => {});
    const rows = await this.transactionRows.all();
    
    return rows.map(row => ({
      element: row,
      dateElement: row.locator('td:nth-child(1)'),
      merchantElement: row.locator('td:nth-child(2)'),
      cardElement: row.locator('td:nth-child(3)'),
      amountElement: row.locator('td:has-text("USD"), td:has-text("$")'),
      statusElement: row.locator('td .label, td span[class*="status"]'),
      
      async getAmount() {
        const text = await this.amountElement.textContent();
        return parseFloat(text.replace(/[^0-9.-]/g, ''));
      },
      
      async getCardName() {
        return await this.cardElement.textContent();
      },
      
      async getMerchantName() {
        return await this.merchantElement.textContent();
      }
    }));
  }

  async getHighlightedMerchantNames() {
    return await this.page.locator('td mark, td .highlight, td [style*="background"]').all();
  }

  async isNextPageAvailable() {
    const isDisabled = await this.nextPageButton.isDisabled().catch(() => true);
    return !isDisabled;
  }

  async goToNextPage() {
    await this.nextPageButton.click();
    await this.waitForTransactionListUpdate();
  }

  async goToPage(pageNumber) {
    const pageButton = this.page.locator(`button:has-text("${pageNumber}")`);
    if (await pageButton.isVisible()) {
      await pageButton.click();
    } else {
      // Navigate using next button multiple times if direct page button not available
      const currentPage = await this.getCurrentPage();
      const clicks = pageNumber - currentPage;
      for (let i = 0; i < clicks; i++) {
        await this.goToNextPage();
      }
    }
    await this.waitForTransactionListUpdate();
  }

  async getCurrentPage() {
    const text = await this.pageInfo.textContent();
    const match = text.match(/Page (\d+) of/);
    return match ? parseInt(match[1]) : 1;
  }

  async getTotalPages() {
    const text = await this.pageInfo.textContent();
    const match = text.match(/of (\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  async getTotalRecordCount() {
    const totalPagesText = await this.pageInfo.textContent();
    const match = totalPagesText.match(/Showing \d+-\d+ of (\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
    // Fallback: calculate from pages
    const totalPages = await this.getTotalPages();
    return totalPages * 20;
  }

};