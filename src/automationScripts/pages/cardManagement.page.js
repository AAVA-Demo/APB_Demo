const { expect } = require('@playwright/test');
const config = require('../../data/config.json');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('[data-testid="card-item"]');
    this.maskedCardNumber = page.locator('[data-testid="masked-card-number"]');
    this.cardBalance = page.locator('[data-testid="card-balance"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardUtilizationRate = page.locator('[data-testid="card-utilization-rate"]');
    
    // Card Details Panel
    this.cardDetailsPanel = page.locator('[data-testid="card-details-panel"]');
    this.creditLimitDisplay = page.locator('[data-testid="credit-limit-display"]');
    this.availableBalanceDisplay = page.locator('[data-testid="available-balance-display"]');
    this.utilizationRateDisplay = page.locator('[data-testid="utilization-rate-display"]');
    this.recentTransactionsList = page.locator('[data-testid="recent-transactions-list"]');
    this.spendingBreakdown = page.locator('[data-testid="spending-breakdown"]');
    this.transactionHistory = page.locator('[data-testid="transaction-history"]');
    this.utilizationMetrics = page.locator('[data-testid="utilization-metrics"]');
    this.noSpendingDataMessage = page.locator('[data-testid="no-spending-data-message"]');
    
    // Error States
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    // Comparison
    this.compareButton = page.locator('[data-testid="compare-button"]');
    this.comparisonTable = page.locator('[data-testid="comparison-table"]');
    this.creditLimitColumn = page.locator('[data-testid="comparison-credit-limit"]');
    this.utilizationRateColumn = page.locator('[data-testid="comparison-utilization-rate"]');
    this.spendingPatternsColumn = page.locator('[data-testid="comparison-spending-patterns"]');
    this.validationMessage = page.locator('[data-testid="validation-message"]');
    this.cardCheckbox = page.locator('[data-testid="card-checkbox"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/cards');
  }

  async waitForCardListLoad() {
    await expect(this.cardList).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await expect(this.cardList).toBeVisible();
    return await this.cardItem.count();
  }

  async getCardByIndex(index) {
    const card = this.cardItem.nth(index);
    await expect(card).toBeVisible();
    return {
      maskedNumber: card.locator('[data-testid="masked-card-number"]'),
      balance: card.locator('[data-testid="card-balance"]'),
      creditLimit: card.locator('[data-testid="card-credit-limit"]'),
      utilizationRate: card.locator('[data-testid="card-utilization-rate"]')
    };
  }

  async selectCardByIndex(index) {
    const card = this.cardItem.nth(index);
    await expect(card).toBeVisible();
    await card.click();
    await expect(this.cardDetailsPanel).toBeVisible({ timeout: 2000 });
  }

  async selectCardWithNoTransactions() {
    const cards = await this.cardItem.all();
    for (const card of cards) {
      const transactionCount = await card.locator('[data-testid="transaction-count"]').textContent();
      if (transactionCount === '0') {
        await card.click();
        return;
      }
    }
  }

  async getUtilizationRate() {
    await expect(this.utilizationRateDisplay).toBeVisible();
    return await this.utilizationRateDisplay.textContent();
  }

  async selectCardsForComparison(indices) {
    for (const index of indices) {
      const checkbox = this.cardCheckbox.nth(index);
      await checkbox.check();
    }
  }

  async clickCompareButton() {
    await this.compareButton.click();
  }

  async getComparisonRows() {
    await expect(this.comparisonTable).toBeVisible();
    return await this.comparisonTable.locator('tbody tr').all();
  }
};
