const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    
    // Card Detail Locators
    this.cardDetailContainer = page.locator('[data-testid="card-detail-container"]');
    this.totalSpendLabel = page.locator('[data-testid="total-spend-label"]');
    this.totalSpendValue = page.locator('[data-testid="total-spend-value"]');
    
    // Category Breakdown Locators
    this.categoryBreakdownSection = page.locator('[data-testid="category-breakdown"]');
    this.categoryItems = page.locator('[data-testid="category-item"]');
    
    // Transaction History Locators
    this.transactionHistoryTable = page.locator('[data-testid="transaction-history-table"]');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');
    this.emptyTransactionMessage = page.locator('[data-testid="empty-transaction-message"]');
    
    // Error Locators
    this.errorMessage = page.locator('[data-testid="card-error-message"]');
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.page.waitForTimeout(1000); // Wait for cards to load
    return await this.cardItems.count();
  }

  async getAllCardTypes() {
    const types = [];
    const count = await this.cardItems.count();
    
    for (let i = 0; i < count; i++) {
      const typeLocator = this.cardItems.nth(i).locator('[data-testid="card-type"]');
      const text = await typeLocator.textContent();
      types.push(text.trim());
    }
    return types;
  }

  async getAllCreditLimits() {
    const limits = [];
    const count = await this.cardItems.count();
    
    for (let i = 0; i < count; i++) {
      const limitLocator = this.cardItems.nth(i).locator('[data-testid="credit-limit"]');
      const text = await limitLocator.textContent();
      limits.push(text.trim());
    }
    return limits;
  }

  async getAllOutstandingBalances() {
    const balances = [];
    const count = await this.cardItems.count();
    
    for (let i = 0; i < count; i++) {
      const balanceLocator = this.cardItems.nth(i).locator('[data-testid="outstanding-balance"]');
      const text = await balanceLocator.textContent();
      balances.push(text.trim());
    }
    return balances;
  }

  async getAllAvailableCredits() {
    const credits = [];
    const count = await this.cardItems.count();
    
    for (let i = 0; i < count; i++) {
      const creditLocator = this.cardItems.nth(i).locator('[data-testid="available-credit"]');
      const text = await creditLocator.textContent();
      credits.push(text.trim());
    }
    return credits;
  }

  async getAvailableCreditForCard(index) {
    const creditLocator = this.cardItems.nth(index).locator('[data-testid="available-credit"]');
    await expect(creditLocator).toBeVisible();
    return await creditLocator.textContent();
  }

  async getCreditLimitForCard(index) {
    const limitLocator = this.cardItems.nth(index).locator('[data-testid="credit-limit"]');
    await expect(limitLocator).toBeVisible();
    return await limitLocator.textContent();
  }

  async getCardWithZeroBalance() {
    const count = await this.cardItems.count();
    
    for (let i = 0; i < count; i++) {
      const balanceLocator = this.cardItems.nth(i).locator('[data-testid="outstanding-balance"]');
      const balance = await balanceLocator.textContent();
      if (balance.trim() === '$0.00') {
        return i;
      }
    }
    return null;
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async selectCard(cardIdentifier) {
    const cardLocator = this.page.locator(`[data-testid="card-item"]:has-text("${cardIdentifier}")`);
    await expect(cardLocator).toBeVisible();
    await cardLocator.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpendValue() {
    await expect(this.totalSpendValue).toBeVisible();
    return await this.totalSpendValue.textContent();
  }

  async getAllCategories() {
    const categories = [];
    const count = await this.categoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const categoryNameLocator = this.categoryItems.nth(i).locator('[data-testid="category-name"]');
      const text = await categoryNameLocator.textContent();
      categories.push(text.trim());
    }
    return categories;
  }

  async getAllCategoryAmounts() {
    const amounts = [];
    const count = await this.categoryItems.count();
    
    for (let i = 0; i < count; i++) {
      const amountLocator = this.categoryItems.nth(i).locator('[data-testid="category-amount"]');
      const text = await amountLocator.textContent();
      amounts.push(text.trim());
    }
    return amounts;
  }

  async getTransactionCount() {
    await this.page.waitForTimeout(1000);
    return await this.transactionRows.count();
  }

  async getTransactionDetails(index) {
    const row = this.transactionRows.nth(index);
    await expect(row).toBeVisible();
    
    return {
      date: await row.locator('[data-testid="transaction-date"]').textContent(),
      merchant: await row.locator('[data-testid="transaction-merchant"]').textContent(),
      category: await row.locator('[data-testid="transaction-category"]').textContent(),
      amount: await row.locator('[data-testid="transaction-amount"]').textContent()
    };
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getEmptyTransactionMessageText() {
    await expect(this.emptyTransactionMessage).toBeVisible();
    return await this.emptyTransactionMessage.textContent();
  }
};