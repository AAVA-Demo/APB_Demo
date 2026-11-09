const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardList = page.locator('.card-item');
    this.noCardsMessage = page.locator('text=No credit cards are currently linked');
    this.spendAnalysisSection = page.locator('.spend-analysis');
    this.categoryBreakdown = page.locator('.category-breakdown');
    this.cardComparison = page.locator('.card-comparison');
    this.comparisonView = page.locator('.comparison-view');
    this.visualIndicators = page.locator('.visual-indicators');
    this.comparisonErrorMessage = page.locator('text=Comparison requires at least two credit cards');
  }

  async navigateToCards() {
    await this.page.click('a[href="#/cards"]');
    await this.page.waitForURL('**/cards');
  }

  async navigateToComparison() {
    await this.navigateToCards();
    await this.page.click('button:has-text("Compare")');
  }

  async waitForCardListLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardDetailLoad() {
    await expect(this.spendAnalysisSection).toBeVisible();
  }

  async waitForComparisonLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    return await this.cardList.count();
  }

  async getCardDetails(index) {
    const card = this.cardList.nth(index);
    const cardName = await card.locator('h4').textContent();
    const limitText = await card.locator('text=Limit:').locator('..').textContent();
    const balanceText = await card.locator('text=Balance:').locator('..').textContent();
    return {
      cardName: cardName.trim(),
      limit: limitText.replace(/[^0-9.]/g, ''),
      balance: balanceText.replace(/[^0-9.]/g, '')
    };
  }

  async selectCard(index) {
    await this.cardList.nth(index).click();
  }

  async getComparedCardCount() {
    return await this.comparisonView.locator('.card-item').count();
  }
};
