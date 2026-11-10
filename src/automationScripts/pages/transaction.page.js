const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    // Navigation
    this.transactionsLink = page.locator('a[href*="transaction"], nav a:has-text("Transactions")');
    
    // Transaction table and list
    this.transactionTable = page.locator('.transaction-table, table, [data-testid="transaction-table"]');
    this.transactionRows = page.locator('.transaction-row, tbody tr, [data-testid="transaction-row"]');
    
    // Pagination controls
    this.paginationControls = page.locator('.pagination, [data-testid="pagination"]');
    this.nextButton = page.locator('button:has-text("Next"), .pagination-next, [data-testid="next-button"]');
    this.previousButton = page.locator('button:has-text("Previous"), .pagination-previous, [data-testid="previous-button"]');
    this.pageNumbers = page.locator('.pagination .page-number, [data-testid="page-number"]');
    this.totalCountElement = page.locator('.total-count, [data-testid="total-count"]');
    
    // Filters
    this.startDateInput = page.locator('input[name="startDate"], input[placeholder*="Start"], [data-testid="start-date"]');
    this.endDateInput = page.locator('input[name="endDate"], input[placeholder*="End"], [data-testid="end-date"]');
    this.cardFilterDropdown = page.locator('select[name="cardFilter"], [data-testid="card-filter"]');
    this.applyFilterButton = page.locator('button:has-text("Apply"), .apply-filter, [data-testid="apply-filter"]');
    
    // Messages
    this.noTransactionsMessage = page.locator('.no-transactions, :has-text("No transactions available")');
    this.validationErrorMessage = page.locator('.validation-error, .error-message, [role="alert"]');
    this.authErrorMessage = page.locator('.auth-error, :has-text("logged in"), :has-text("Unauthorized")');
  }

  async navigateToTransactions() {
    await this.transactionsLink.waitFor({ state: 'visible' });
    await this.transactionsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionsToLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Allow for rendering
  }

  async getTransactionCount() {
    await this.transactionRows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.transactionRows.count();
  }

  async getTotalTransactionCount() {
    await this.totalCountElement.waitFor({ state: 'visible' });
    const text = await this.totalCountElement.textContent();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async clickNext() {
    await this.nextButton.waitFor({ state: 'visible' });
    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPrevious() {
    await this.previousButton.waitFor({ state: 'visible' });
    await this.previousButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPage(pageNumber) {
    const pageButton = this.page.locator(`button:has-text("${pageNumber}"), .page-number:has-text("${pageNumber}")`);
    await pageButton.waitFor({ state: 'visible' });
    await pageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentPage() {
    const activePage = this.page.locator('.page-number.active, .pagination .active');
    await activePage.waitFor({ state: 'visible' });
    const text = await activePage.textContent();
    return parseInt(text);
  }

  async goToLastPage() {
    const lastPageButton = this.page.locator('button:has-text("Last"), .pagination-last');
    if (await lastPageButton.isVisible()) {
      await lastPageButton.click();
    } else {
      // Click Next until disabled
      while (await this.nextButton.isEnabled()) {
        await this.clickNext();
      }
    }
    await this.page.waitForLoadState('networkidle');
  }

  async setStartDate(date) {
    await this.startDateInput.waitFor({ state: 'visible' });
    await this.startDateInput.fill(date);
  }

  async setEndDate(date) {
    await this.endDateInput.waitFor({ state: 'visible' });
    await this.endDateInput.fill(date);
  }

  async clickApplyFilter() {
    await this.applyFilterButton.waitFor({ state: 'visible' });
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransactionDatesInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const count = await this.getTransactionCount();
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const dateCell = row.locator('.transaction-date, td:first-child, [data-testid="transaction-date"]');
      const dateText = await dateCell.textContent();
      const transactionDate = new Date(dateText.trim());
      
      if (transactionDate < start || transactionDate > end) {
        return false;
      }
    }
    return true;
  }

  async verifyAllTransactionsHaveDate(date) {
    const targetDate = new Date(date).toDateString();
    const count = await this.getTransactionCount();
    
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const dateCell = row.locator('.transaction-date, td:first-child');
      const dateText = await dateCell.textContent();
      const transactionDate = new Date(dateText.trim()).toDateString();
      
      if (transactionDate !== targetDate) {
        return false;
      }
    }
    return true;
  }

  async getValidationErrorText() {
    await this.validationErrorMessage.waitFor({ state: 'visible' });
    return await this.validationErrorMessage.textContent();
  }

  async hasTransactionsForCard(cardName) {
    const count = await this.getTransactionCount();
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const cardCell = row.locator('.card-name, [data-testid="card-name"]');
      const text = await cardCell.textContent();
      if (text.includes(cardName)) {
        return true;
      }
    }
    return false;
  }

  async getFirstTransaction() {
    const firstRow = this.transactionRows.first();
    await firstRow.waitFor({ state: 'visible' });
    
    const date = await firstRow.locator('.transaction-date, td:nth-child(1)').textContent();
    const merchant = await firstRow.locator('.merchant-name, td:nth-child(2)').textContent();
    const amount = await firstRow.locator('.amount, td:nth-child(3)').textContent();
    const category = await firstRow.locator('.category, td:nth-child(4)').textContent();
    const card = await firstRow.locator('.card-name, td:nth-child(5)').textContent();
    
    return {
      date: date.trim(),
      merchant: merchant.trim(),
      amount: amount.trim(),
      category: category.trim(),
      card: card.trim()
    };
  }

  async verifyDateSortingDescending() {
    const count = await this.getTransactionCount();
    if (count < 2) return true;
    
    let previousDate = null;
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const dateCell = row.locator('.transaction-date, td:first-child');
      const dateText = await dateCell.textContent();
      const currentDate = new Date(dateText.trim());
      
      if (previousDate && currentDate > previousDate) {
        return false;
      }
      previousDate = currentDate;
    }
    return true;
  }

  async selectCardFilter(cardName) {
    await this.cardFilterDropdown.waitFor({ state: 'visible' });
    await this.cardFilterDropdown.selectOption({ label: cardName });
  }

  async verifyAllTransactionsFromCard(cardName) {
    const count = await this.getTransactionCount();
    for (let i = 0; i < count; i++) {
      const row = this.transactionRows.nth(i);
      const cardCell = row.locator('.card-name, [data-testid="card-name"]');
      const text = await cardCell.textContent();
      if (!text.includes(cardName)) {
        return false;
      }
    }
    return true;
  }

  async getNoTransactionsMessageText() {
    await this.noTransactionsMessage.waitFor({ state: 'visible' });
    return await this.noTransactionsMessage.textContent();
  }

  async getAuthErrorMessageText() {
    await this.authErrorMessage.waitFor({ state: 'visible' });
    return await this.authErrorMessage.textContent();
  }
};