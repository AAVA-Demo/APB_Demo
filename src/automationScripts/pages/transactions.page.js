const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    
    this.transactionsContainer = page.locator('[data-testid="transactions-container"]');
    this.transactionsList = page.locator('[data-testid="transactions-list"]');
    this.transactionItem = page.locator('.transaction-item');
    
    this.dateFilterDropdown = page.locator('[data-testid="date-filter-dropdown"]');
    this.dateRangeStartInput = page.locator('[data-testid="date-range-start"]');
    this.dateRangeEndInput = page.locator('[data-testid="date-range-end"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    
    this.merchantSearchInput = page.locator('[data-testid="merchant-search-input"]');
    this.searchButton = page.locator('[data-testid="search-button"]');
    
    this.validationError = page.locator('[data-testid="validation-error"]');
    
    this.cardDetailsPanel = page.locator('[data-testid="card-details-panel"]');
    this.transactionHistory = page.locator('[data-testid="transaction-history"]');
    this.categoryBreakdown = page.locator('[data-testid="category-breakdown"]');
    this.spendingBreakdown = page.locator('[data-testid="spending-breakdown"]');
    
    this.noSpendingDataMessage = page.locator('[data-testid="no-spending-data-message"]');
    
    this.cardSelector = page.locator('[data-testid="card-selector"]');
  }

  async navigate() {
    await this.page.goto('/transactions');
  }

  async navigateToCardDetails(cardId) {
    await this.page.goto(`/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTransactionsLoad() {
    await expect(this.transactionsContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactions() {
    await this.waitForTransactionsLoad();
    const transactions = [];
    const transactionElements = await this.transactionItem.all();
    
    for (const element of transactionElements) {
      const merchant = await element.locator('[data-testid="transaction-merchant"]').textContent();
      const date = await element.locator('[data-testid="transaction-date"]').textContent();
      const amount = await element.locator('[data-testid="transaction-amount"]').textContent();
      const card = await element.locator('[data-testid="transaction-card"]').textContent();
      const cardId = await element.getAttribute('data-card-id');
      
      transactions.push({ merchant, date, amount, card, cardId });
    }
    
    return transactions;
  }

  async applyDateFilter(filterOption) {
    await this.dateFilterDropdown.click();
    const option = this.page.locator(`[data-filter-option="${filterOption}"]`);
    await option.click();
    await this.page.waitForLoadState('networkidle');
  }

  async setDateRange(startDate, endDate) {
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByMerchant(merchantName) {
    await this.merchantSearchInput.fill(merchantName);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdown).toBeVisible();
    const categoryData = {};
    const categoryElements = await this.categoryBreakdown.locator('.category-item').all();
    
    for (const element of categoryElements) {
      const categoryName = await element.locator('[data-testid="category-name"]').textContent();
      const categoryAmount = await element.locator('[data-testid="category-amount"]').textContent();
      categoryData[categoryName.trim()] = categoryAmount.trim();
    }
    
    return categoryData;
  }

  async selectCard(cardId) {
    const cardOption = this.page.locator(`[data-card-id="${cardId}"]`);
    await cardOption.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpending() {
    const totalElement = this.page.locator('[data-testid="total-spending"]');
    await expect(totalElement).toBeVisible();
    return await totalElement.textContent();
  }
};