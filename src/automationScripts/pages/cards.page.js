const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.myCardsLink = page.locator('a:has-text("My Cards"), a[href*="cards"], nav a:has-text("Cards")').first();
    
    // Card List Locators
    this.cardListContainer = page.locator('[data-testid="card-list"], .card-list, .cards-container').first();
    this.cardItems = page.locator('.card-item, .card, [class*="card-"]');
    this.compareCardsButton = page.locator('button:has-text("Compare Cards"), button:has-text("Compare")').first();
    
    // Card Details Locators
    this.creditLimitField = page.locator('[data-testid="credit-limit"], text=/Credit Limit:/i').first();
    this.outstandingBalanceField = page.locator('[data-testid="outstanding-balance"], text=/Outstanding:/i').first();
    this.availableCreditField = page.locator('[data-testid="available-credit"], text=/Available:/i').first();
    this.monthlySpendField = page.locator('[data-testid="monthly-spend"], text=/Monthly Spend:/i').first();
    this.creditUtilizationField = page.locator('[data-testid="credit-utilization"], text=/Utilization:/i').first();
    this.lastUpdatedField = page.locator('[data-testid="last-updated"], text=/Last Updated:/i').first();
    this.recentTransactionsSection = page.locator('[data-testid="recent-transactions"], .recent-transactions, section:has-text("Recent")').first();
    
    // Comparison Locators
    this.comparisonTable = page.locator('[data-testid="comparison-table"], .comparison-table, table').first();
  }

  async navigateToMyCards() {
    await this.myCardsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to My Cards section');
  }

  async getCardCount() {
    const cards = await this.cardItems.all();
    return cards.length;
  }

  async clickFirstCard() {
    const firstCard = this.cardItems.first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    logger.info('Clicked on first card');
  }

  async getCreditLimit() {
    await expect(this.creditLimitField).toBeVisible();
    const text = await this.creditLimitField.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getOutstandingBalance() {
    await expect(this.outstandingBalanceField).toBeVisible();
    const text = await this.outstandingBalanceField.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getAvailableCredit() {
    await expect(this.availableCreditField).toBeVisible();
    const text = await this.availableCreditField.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendField).toBeVisible();
    const text = await this.monthlySpendField.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationField).toBeVisible();
    const text = await this.creditUtilizationField.textContent();
    const match = text.match(/[\d.]+%/);
    return match ? match[0] : text;
  }

  async getRecentTransactions() {
    await expect(this.recentTransactionsSection).toBeVisible();
    const transactionRows = await this.page.locator('.transaction-row, .transaction, tr').all();
    
    const transactions = [];
    for (const row of transactionRows.slice(0, 10)) {
      const text = await row.textContent();
      transactions.push({
        date: text.match(/\d{1,2}-\w{3}-\d{4}/) ? text.match(/\d{1,2}-\w{3}-\d{4}/)[0] : '',
        merchant: text,
        category: text,
        amount: text.match(/₹[\d,]+/) ? text.match(/₹[\d,]+/)[0] : ''
      });
    }
    
    return transactions;
  }

  async clickCompareCardsButton() {
    await expect(this.compareCardsButton).toBeVisible();
    await this.compareCardsButton.click();
    logger.info('Clicked Compare Cards button');
  }

  async getComparisonData() {
    await expect(this.comparisonTable).toBeVisible();
    
    const cardNames = await this.page.locator('th:not(:first-child), .card-name').allTextContents();
    const creditLimits = await this.page.locator('tr:has-text("Credit Limit") td, tr:has-text("Limit") td').allTextContents();
    const outstandingBalances = await this.page.locator('tr:has-text("Outstanding") td, tr:has-text("Balance") td').allTextContents();
    const availableCredits = await this.page.locator('tr:has-text("Available") td').allTextContents();
    const utilizations = await this.page.locator('tr:has-text("Utilization") td').allTextContents();
    const monthlySpendings = await this.page.locator('tr:has-text("Monthly Spend") td, tr:has-text("Spend") td').allTextContents();
    
    return {
      cardNames: cardNames.filter(name => name.trim() !== ''),
      creditLimits: creditLimits.filter(val => val.trim() !== ''),
      outstandingBalances: outstandingBalances.filter(val => val.trim() !== ''),
      availableCredits: availableCredits.filter(val => val.trim() !== ''),
      utilizations: utilizations.filter(val => val.trim() !== ''),
      monthlySpendings: monthlySpendings.filter(val => val.trim() !== '')
    };
  }
};
