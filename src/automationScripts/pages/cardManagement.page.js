const { expect } = require('@playwright/test');
const BasePage = require('./base.page');
const config = require('../../data/config.json');

exports.CardManagementPage = class CardManagementPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Locators
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('.card-item');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.addCardCTA = page.locator('[data-testid="add-card-cta"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.cardWiseSpendAnalysisButton = page.locator('[data-testid="card-wise-spend-analysis"]');
    this.transactionTotals = page.locator('[data-testid="transaction-totals"]');
    this.categoryDistribution = page.locator('[data-testid="category-distribution"]');
    this.spendingPatterns = page.locator('[data-testid="spending-patterns"]');
    this.comparativeMetricsSection = page.locator('[data-testid="comparative-metrics"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.cardDetailsPanel = page.locator('[data-testid="card-details-panel"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/cards');
  }

  async waitForCardsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async getCardCount() {
    await this.waitForCardsLoad();
    return await this.cardItem.count();
  }

  async getAllCardDetails() {
    await this.waitForCardsLoad();
    const cards = await this.cardItem.all();
    const cardDetails = [];

    for (const card of cards) {
      const bankName = await card.locator('[data-testid="bank-name"]').textContent();
      const last4Digits = await card.locator('[data-testid="last-4-digits"]').textContent();
      const creditLimit = await card.locator('[data-testid="credit-limit"]').textContent();
      const availableCredit = await card.locator('[data-testid="available-credit"]').textContent();
      const outstandingBalance = await card.locator('[data-testid="outstanding-balance"]').textContent();

      cardDetails.push({
        bankName: bankName.trim(),
        last4Digits: last4Digits.trim(),
        creditLimit: this.parseAmount(creditLimit),
        availableCredit: this.parseAmount(availableCredit),
        outstandingBalance: this.parseAmount(outstandingBalance)
      });
    }

    return cardDetails;
  }

  parseAmount(text) {
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async selectCard(index) {
    await this.waitForCardsLoad();
    const cards = await this.cardItem.all();
    await cards[index].click();
    await this.waitForCardDetailsLoad();
  }

  async waitForCardDetailsLoad() {
    await expect(this.cardDetailsPanel).toBeVisible({ timeout: 5000 });
  }

  async clickCardWiseSpendAnalysis() {
    await this.cardWiseSpendAnalysisButton.click();
  }

  async waitForSpendAnalysisLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.transactionTotals).toBeVisible({ timeout: 5000 });
  }

  async getComparativeMetrics() {
    await expect(this.comparativeMetricsSection).toBeVisible();
    
    const monthlyAverage = await this.comparativeMetricsSection.locator('[data-testid="monthly-average"]').textContent();
    const highestSpendingCategory = await this.comparativeMetricsSection.locator('[data-testid="highest-spending-category"]').textContent();
    const transactionCount = await this.comparativeMetricsSection.locator('[data-testid="transaction-count"]').textContent();

    return {
      monthlyAverage: this.parseAmount(monthlyAverage),
      highestSpendingCategory: highestSpendingCategory.trim(),
      transactionCount: parseInt(transactionCount)
    };
  }
};
