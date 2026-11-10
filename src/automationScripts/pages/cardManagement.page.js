const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    this.myCardsLink = page.locator('a[ui-sref="cardPortfolio"], a:has-text("My Cards")');
    this.cardPortfolioContainer = page.locator('[data-testid="card-portfolio"], .row:has(.card-item)');
    this.cardItems = page.locator('.card-item');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], p:has-text("No cards found")');
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger');
    this.cardDetailContainer = page.locator('[data-testid="card-detail"], .card-item');
    this.backToPortfolioButton = page.locator('a[ui-sref="cardPortfolio"], a:has-text("Back to Portfolio")');
    this.spendingBreakdownSection = page.locator('[data-testid="spending-breakdown"], .chart-container');
  }

  async navigateToMyCards() {
    await expect(this.myCardsLink).toBeVisible();
    await this.myCardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.page.waitForTimeout(1000);
    return await this.cardItems.count();
  }

  getCardByIndex(index) {
    return this.cardItems.nth(index);
  }

  async getCardType(index) {
    const card = this.getCardByIndex(index);
    const cardNumber = card.locator('.card-number');
    await expect(cardNumber).toBeVisible();
    return await cardNumber.textContent();
  }

  async getCardNumber(index) {
    const card = this.getCardByIndex(index);
    const cardNumber = card.locator('.card-number');
    await expect(cardNumber).toBeVisible();
    return await cardNumber.textContent();
  }

  getCardCreditLimit(index) {
    return this.getCardByIndex(index).locator('.card-detail:has-text("Credit Limit")');
  }

  getCardAvailableBalance(index) {
    return this.getCardByIndex(index).locator('.card-detail:has-text("Available")');
  }

  getCardOutstandingBalance(index) {
    return this.getCardByIndex(index).locator('.card-detail:has-text("Outstanding")');
  }

  getCardStatus(index) {
    return this.getCardByIndex(index).locator('.card-detail:has-text("Status")');
  }

  async selectCardByNumber(lastFourDigits) {
    const card = this.cardItems.filter({ hasText: lastFourDigits }).first();
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpend() {
    const totalSpendElement = this.cardDetailContainer.locator('p:has-text("Total spending"), strong:has-text("Total Spend")');
    await expect(totalSpendElement).toBeVisible();
    const text = await totalSpendElement.textContent();
    const match = text.match(/\$[0-9,]+\.[0-9]{2}/);
    return match ? match[0] : '';
  }

  async getMonthlySpend() {
    const monthlySpendElement = this.cardDetailContainer.locator('p:has-text("Monthly spending"), strong:has-text("Monthly Spend")');
    await expect(monthlySpendElement).toBeVisible();
    const text = await monthlySpendElement.textContent();
    const match = text.match(/\$[0-9,]+\.[0-9]{2}/);
    return match ? match[0] : '';
  }

  async getUtilizationRate() {
    const utilizationElement = this.cardDetailContainer.locator('strong:has-text("Utilization Rate")');
    await expect(utilizationElement).toBeVisible();
    const text = await utilizationElement.textContent();
    const match = text.match(/[0-9]+\.[0-9]%/);
    return match ? match[0] : '';
  }
};