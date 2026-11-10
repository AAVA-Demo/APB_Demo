const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsContainer = page.locator('.row, [data-testid="cards-container"]');
    this.cardTiles = page.locator('card-tile, .card-tile');
    this.noCardsMessage = page.locator('p:has-text("No credit cards found"), .text-center:has-text("No credit cards found")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.cardDetailContainer = page.locator('.card-tile, [data-testid="card-detail"]');
    this.monthlySpendLabel = page.locator('p:has-text("Monthly Spend"), strong:has-text("Monthly Spend")');
    this.creditUtilizationLabel = page.locator('p:has-text("Credit Utilization"), .progress');
    this.categoryBreakdownSection = page.locator('h4:has-text("Category Breakdown"), ul.list-group');
    this.recentTransactionsSection = page.locator('h4:has-text("Recent Transactions"), table');
    this.noTransactionsMessage = page.locator('p:has-text("No transactions found"), .text-center:has-text("No transactions")');
  }

  async navigate() {
    await this.page.goto('/cards');
    await expect(this.cardsContainer).toBeVisible();
  }

  async getCardCount() {
    await this.page.waitForLoadState('networkidle');
    return await this.cardTiles.count();
  }

  async getCardDetails(index) {
    const cardTile = this.cardTiles.nth(index);
    await expect(cardTile).toBeVisible();
    
    const cardNumber = await cardTile.locator('.card-number').textContent();
    const cardType = await cardTile.locator('.card-type').textContent();
    const issuer = cardType.split('-')[1]?.trim() || '';
    const creditLimit = await cardTile.locator('div:has-text("Credit Limit")').textContent();
    const currentBalance = await cardTile.locator('.balance').textContent();
    const availableBalance = await cardTile.locator('div:has-text("Available Balance")').textContent();

    return {
      cardNumber: cardNumber.trim(),
      cardType: cardType.split('-')[0]?.trim() || '',
      issuer: issuer,
      creditLimit: creditLimit,
      currentBalance: currentBalance,
      availableBalance: availableBalance
    };
  }

  async selectCard(index) {
    const cardTile = this.cardTiles.nth(index);
    await expect(cardTile).toBeVisible();
    await cardTile.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendLabel).toBeVisible();
    const spendText = await this.monthlySpendLabel.textContent();
    const match = spendText.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : '';
  }

  async getCategoryBreakdownAmounts() {
    const categoryItems = this.page.locator('ul.list-group li.list-group-item');
    const count = await categoryItems.count();
    const amounts = [];
    
    for (let i = 0; i < count; i++) {
      const text = await categoryItems.nth(i).textContent();
      const match = text.match(/\$([\d,]+\.\d{2})/);
      if (match) {
        amounts.push(parseFloat(match[1].replace(/,/g, '')));
      }
    }
    
    return amounts;
  }

  async getCategoryBreakdownPercentages() {
    const categoryItems = this.page.locator('ul.list-group li.list-group-item');
    const count = await categoryItems.count();
    const percentages = [];
    
    for (let i = 0; i < count; i++) {
      const text = await categoryItems.nth(i).textContent();
      const match = text.match(/(\d+)%/);
      if (match) {
        percentages.push(parseFloat(match[1]));
      }
    }
    
    return percentages;
  }
};
