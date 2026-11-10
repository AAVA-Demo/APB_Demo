const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Transaction Table Locators
    this.transactionTable = page.locator('[data-testid="transaction-table"], .table:has-text("Merchant")');
    this.transactionRows = page.locator('[data-testid="transaction-row"], .table tbody tr');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions"], :text("No transactions available")');
    
    // Filter Locators
    this.cardFilterDropdown = page.locator('[data-testid="card-filter"], select:near(:text("Filter by Card"))');
    
    // Pagination Locators
    this.paginationInfo = page.locator('[data-testid="pagination-info"], .pagination-info');
    this.nextPageButton = page.locator('[data-testid="next-page"], button:has-text("Next")');
    this.previousPageButton = page.locator('[data-testid="prev-page"], button:has-text("Previous")');
    this.paginationContainer = page.locator('[data-testid="pagination"], .pagination-controls');
  }

  async navigate() {
    logger.info('Navigating to Transaction History page');
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    try {
      await this.transactionTable.waitFor({ state: 'visible', timeout: 5000 });
      const count = await this.transactionRows.count();
      logger.info(`Transaction count: ${count}`);
      return count;
    } catch (error) {
      logger.info('No transactions found');
      return 0;
    }
  }

  async getTransactionDetails(index) {
    await expect(this.transactionRows.nth(index)).toBeVisible();
    const row = this.transactionRows.nth(index);
    
    const cells = row.locator('td');
    const date = await cells.nth(0).textContent();
    const merchant = await cells.nth(1).textContent();
    const category = await cells.nth(2).textContent();
    const card = await cells.nth(3).textContent();
    const amount = await cells.nth(4).textContent();
    
    return {
      date: date.trim(),
      merchant: merchant.trim(),
      category: category.trim(),
      card: card.trim(),
      amount: amount.trim()
    };
  }

  async getAllTransactions() {
    const count = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      transactions.push(await this.getTransactionDetails(i));
    }
    
    return transactions;
  }

  async getAllTransactionIds() {
    const transactions = await this.getAllTransactions();
    return transactions.map((txn, index) => `T${String(index + 1).padStart(3, '0')}`);
  }

  async verifyDateSortDescending() {
    const transactions = await this.getAllTransactions();
    
    for (let i = 0; i < transactions.length - 1; i++) {
      const date1 = new Date(transactions[i].date);
      const date2 = new Date(transactions[i + 1].date);
      
      if (date1 < date2) {
        logger.error(`Dates not in descending order: ${transactions[i].date} < ${transactions[i + 1].date}`);
        return false;
      }
    }
    
    logger.info('Transactions sorted by date in descending order');
    return true;
  }

  async getPaginationText() {
    try {
      await this.paginationInfo.waitFor({ state: 'visible', timeout: 3000 });
      return await this.paginationInfo.textContent();
    } catch (error) {
      return 'Page 0 of 0';
    }
  }

  async getTotalTransactionCount() {
    const paginationText = await this.getPaginationText();
    const match = paginationText.match(/of (\d+)/);
    return match ? parseInt(match[1]) * 10 : 0;
  }

  async clickNextPage() {
    logger.info('Clicking Next page button');
    await expect(this.nextPageButton).toBeEnabled();
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPreviousPage() {
    logger.info('Clicking Previous page button');
    await expect(this.previousPageButton).toBeEnabled();
    await this.previousPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isPaginationVisible() {
    try {
      await this.paginationContainer.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async getFilterOptions() {
    await expect(this.cardFilterDropdown).toBeVisible();
    const options = await this.cardFilterDropdown.locator('option').allTextContents();
    logger.info(`Filter options: ${options.join(', ')}`);
    return options;
  }

  async selectCardFilter(cardName) {
    logger.info(`Selecting card filter: ${cardName}`);
    await this.cardFilterDropdown.selectOption({ label: cardName });
    await this.page.waitForLoadState('networkidle');
  }
};