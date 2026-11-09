const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    
    // Container Locators
    this.transactionContainer = page.locator('[data-testid="transaction-container"], .transaction-list-view');
    this.filterPanel = page.locator('[data-testid="filter-panel"], .filter-panel');
    
    // Filter Locators
    this.startDateInput = page.locator('[data-testid="start-date"], input[name="startDate"], #startDate');
    this.endDateInput = page.locator('[data-testid="end-date"], input[name="endDate"], #endDate');
    this.cardFilterDropdown = page.locator('[data-testid="card-filter"], select[name="cardId"], #cardFilter');
    this.categoryFilterDropdown = page.locator('[data-testid="category-filter"], select[name="category"], #categoryFilter');
    this.applyFilterButton = page.locator('[data-testid="apply-filter"], button:has-text("Apply Filter")');
    this.resetFilterButton = page.locator('[data-testid="reset-filter"], button:has-text("Reset")');
    
    // Transaction List Locators
    this.transactionTable = page.locator('[data-testid="transaction-table"], .transaction-table table');
    this.transactionRows = page.locator('[data-testid="transaction-row"], .transaction-table tbody tr');
    
    // Pagination Locators
    this.paginationControls = page.locator('[data-testid="pagination"], .pagination-controls');
    this.previousButton = page.locator('[data-testid="previous-page"], .pagination a:has-text("‹"), .pagination button:has-text("Previous")');
    this.nextButton = page.locator('[data-testid="next-page"], .pagination a:has-text("›"), .pagination button:has-text("Next")');
    this.paginationInfo = page.locator('[data-testid="pagination-info"], .pagination-controls p');
    
    // Message Locators
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions"], .no-data-message:has-text("No transactions")');
    this.validationErrorMessage = page.locator('[data-testid="validation-error"], .error-message, .alert-danger');
    
    // Total Locator
    this.transactionTotal = page.locator('[data-testid="transaction-total"], .transaction-total');
  }

  async navigate() {
    logger.info('Navigating to transaction management page');
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageLoad() {
    logger.info('Waiting for transaction page to load');
    await expect(this.transactionContainer).toBeVisible({ timeout: 5000 });
    await expect(this.filterPanel).toBeVisible({ timeout: 3000 });
  }

  async waitForTransactionListLoad() {
    logger.info('Waiting for transaction list to load');
    // Wait for either transaction rows or no transactions message
    await Promise.race([
      this.transactionRows.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {}),
      this.noTransactionsMessage.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {})
    ]);
    // Wait for any loading spinners to disappear
    await this.page.locator('.loading-spinner, [data-testid="loading"]').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async getTransactionCount() {
    logger.info('Getting transaction count');
    await this.transactionRows.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    return await this.transactionRows.count();
  }

  async getTransactionByIndex(index) {
    logger.info(`Getting transaction at index ${index}`);
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    
    const cells = row.locator('td');
    const cellCount = await cells.count();
    
    return {
      date: await cells.nth(0).textContent(),
      merchantName: await cells.nth(1).textContent(),
      category: await cells.nth(2).textContent(),
      cardLastFour: await cells.nth(3).textContent().then(text => text.replace(/[^0-9]/g, '').slice(-4)),
      amount: parseFloat((await cells.nth(4).textContent()).replace(/[^0-9.]/g, ''))
    };
  }

  async getAllTransactions() {
    logger.info('Getting all transactions on current page');
    const count = await this.getTransactionCount();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      transactions.push(await this.getTransactionByIndex(i));
    }
    
    return transactions;
  }

  async getPaginationText() {
    logger.info('Getting pagination text');
    return await this.paginationInfo.textContent();
  }

  async clickNextPage() {
    logger.info('Clicking next page button');
    await this.nextButton.click();
  }

  async clickPreviousPage() {
    logger.info('Clicking previous page button');
    await this.previousButton.click();
  }

  async isPreviousButtonDisabled() {
    logger.info('Checking if previous button is disabled');
    const disabledClass = await this.previousButton.locator('..').getAttribute('class');
    return disabledClass?.includes('disabled') || false;
  }

  async isNextButtonDisabled() {
    logger.info('Checking if next button is disabled');
    const disabledClass = await this.nextButton.locator('..').getAttribute('class');
    return disabledClass?.includes('disabled') || false;
  }

  async getNoTransactionsMessageText() {
    logger.info('Getting no transactions message text');
    return await this.noTransactionsMessage.textContent();
  }

  async getErrorMessages() {
    logger.info('Getting error messages');
    const errorElements = await this.page.locator('.error-message, .alert-danger').all();
    const messages = [];
    for (const element of errorElements) {
      if (await element.isVisible()) {
        messages.push(await element.textContent());
      }
    }
    return messages;
  }

  async enterStartDate(date) {
    logger.info(`Entering start date: ${date}`);
    await this.startDateInput.fill(date);
    await expect(this.startDateInput).toHaveValue(date);
  }

  async enterEndDate(date) {
    logger.info(`Entering end date: ${date}`);
    await this.endDateInput.fill(date);
    await expect(this.endDateInput).toHaveValue(date);
  }

  async selectCreditCard(lastFourDigits) {
    logger.info(`Selecting credit card ending in ${lastFourDigits}`);
    await this.cardFilterDropdown.selectOption({ label: new RegExp(lastFourDigits) });
  }

  async selectCategory(category) {
    logger.info(`Selecting category: ${category}`);
    await this.categoryFilterDropdown.selectOption({ label: category });
  }

  async clickApplyFilter() {
    logger.info('Clicking apply filter button');
    await this.applyFilterButton.click();
  }

  async clickResetFilter() {
    logger.info('Clicking reset filter button');
    await this.resetFilterButton.click();
  }

  async getValidationErrorText() {
    logger.info('Getting validation error text');
    return await this.validationErrorMessage.textContent();
  }

  async getTransactionTotal() {
    logger.info('Getting transaction total');
    const totalVisible = await this.transactionTotal.isVisible().catch(() => false);
    if (!totalVisible) {
      return null;
    }
    const text = await this.transactionTotal.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }
};
