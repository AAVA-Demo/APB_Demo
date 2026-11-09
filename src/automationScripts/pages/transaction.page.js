const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    this.startDateInput = page.locator('input[name="startDate"]');
    this.endDateInput = page.locator('input[name="endDate"]');
    this.minAmountInput = page.locator('input[name="minAmount"]');
    this.maxAmountInput = page.locator('input[name="maxAmount"]');
    this.merchantInput = page.locator('input[name="merchantName"]');
    this.categorySelect = page.locator('select[name="category"]');
    this.cardSelect = page.locator('select[name="cardId"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters")');
    this.transactionList = page.locator('.transaction-list');
    this.transactionRows = page.locator('.transaction-row');
    this.errorMessage = page.locator('.error-message');
    this.warningMessage = page.locator('.warning-message');
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.paginationInfo = page.locator('.pagination-info');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.startDateInput.waitFor({ state: 'visible' });
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.applyFiltersButton.click();
  }

  async applyAmountFilter(minAmount, maxAmount) {
    await this.minAmountInput.waitFor({ state: 'visible' });
    await this.minAmountInput.fill(minAmount.toString());
    await this.maxAmountInput.fill(maxAmount.toString());
    await this.applyFiltersButton.click();
  }

  async fillAmountFilterField(fieldName, value) {
    const input = fieldName === 'minAmount' ? this.minAmountInput : this.maxAmountInput;
    await input.waitFor({ state: 'visible' });
    await input.fill(value);
  }

  async applyMerchantFilter(merchantName) {
    await this.merchantInput.waitFor({ state: 'visible' });
    await this.merchantInput.fill(merchantName);
  }

  async applyCategoryFilter(category) {
    await this.categorySelect.waitFor({ state: 'visible' });
    await this.categorySelect.selectOption(category);
  }

  async applyCardFilter(cardId) {
    await this.cardSelect.waitFor({ state: 'visible' });
    await this.cardSelect.selectOption(cardId);
  }

  async clickApplyFilters() {
    await this.applyFiltersButton.click();
  }

  async waitForTransactionsToLoad() {
    await this.transactionList.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getDisplayedTransactions() {
    await this.transactionRows.first().waitFor({ state: 'visible' });
    const rows = await this.transactionRows.all();
    const transactions = [];
    
    for (const row of rows) {
      const date = await row.locator('.transaction-date').textContent();
      const merchant = await row.locator('.transaction-merchant').textContent();
      const category = await row.locator('.transaction-category').textContent();
      const amount = await row.locator('.transaction-amount').textContent();
      const cardId = await row.locator('.transaction-card-id').textContent();
      
      transactions.push({
        date: date.trim(),
        merchant: merchant.trim(),
        category: category.trim(),
        amount: parseFloat(amount.replace(/[^0-9.-]+/g, '')),
        cardId: cardId.trim()
      });
    }
    
    return transactions;
  }

  async getErrorMessage() {
    if (await this.errorMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  async getWarningMessage() {
    if (await this.warningMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
      return await this.warningMessage.textContent();
    }
    return null;
  }

  async getEmptyStateMessage(cardId) {
    const message = this.page.locator(`.empty-state-message[data-card-id="${cardId}"]`);
    if (await message.isVisible({ timeout: 3000 }).catch(() => false)) {
      return await message.textContent();
    }
    return null;
  }

  async getPaginationInfo() {
    await this.paginationInfo.waitFor({ state: 'visible' });
    const text = await this.paginationInfo.textContent();
    const match = text.match(/Total: (\d+).*Pages: (\d+)/);
    
    return {
      totalCount: parseInt(match[1]),
      totalPages: parseInt(match[2])
    };
  }

  async loadTransactions(page, pageSize) {
    await this.page.goto(`/transactions?page=${page}&pageSize=${pageSize}`);
    await this.page.waitForLoadState('networkidle');
  }

  async setupTestScenario(config) {
    await this.page.evaluate((cfg) => {
      window.testScenarioConfig = cfg;
    }, config);
  }
};
