const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsLink = page.locator('a[href="#/cards"]');
    this.cardsContainer = page.locator('.card-item');
    this.firstCard = page.locator('.card-item').first();
    this.loadingIndicator = page.locator('.spinner');
    this.errorMessage = page.locator('.alert-danger');
    this.performanceWarning = page.locator('.alert-warning');
    this.spendAnalysisSection = page.locator('.spend-analysis');
    this.noDataMessage = page.locator('.no-data-message');
    this.viewSpendAnalysisButton = page.locator('button:has-text("View Spend Analysis")');
  }

  async navigateToCards() {
    await expect(this.cardsLink).toBeVisible();
    await this.cardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardsLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.cardsContainer.first()).toBeVisible();
  }

  async getCardCount() {
    return await this.cardsContainer.count();
  }

  async getAllCardNumbers() {
    const cards = await this.cardsContainer.all();
    const cardNumbers = [];
    for (const card of cards) {
      const number = await card.locator('.card-number').textContent();
      cardNumbers.push(number.trim());
    }
    return cardNumbers;
  }

  async getCardCreditLimit(index) {
    const card = this.cardsContainer.nth(index);
    await expect(card).toBeVisible();
    const limit = await card.locator('div:has-text("Limit:")').textContent();
    return limit.replace('Limit:', '').trim();
  }

  async getCardAvailableCredit(index) {
    const card = this.cardsContainer.nth(index);
    await expect(card).toBeVisible();
    const available = await card.locator('div:has-text("Available:")').textContent();
    return available.replace('Available:', '').trim();
  }

  async getCardOutstandingBalance(index) {
    const card = this.cardsContainer.nth(index);
    await expect(card).toBeVisible();
    const outstanding = await card.locator('div:has-text("Outstanding:")').textContent();
    return outstanding.replace('Outstanding:', '').trim();
  }

  async clickCard(index) {
    const card = this.cardsContainer.nth(index);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async findCardByLastFourDigits(lastFour) {
    const cards = await this.cardsContainer.all();
    for (const card of cards) {
      const number = await card.locator('.card-number').textContent();
      if (number.includes(lastFour)) {
        return number.trim();
      }
    }
    return null;
  }

  async clickCardByNumber(cardNumber) {
    const cards = await this.cardsContainer.all();
    for (const card of cards) {
      const number = await card.locator('.card-number').textContent();
      if (number.trim() === cardNumber) {
        await card.click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }
  }

  async clickViewSpendAnalysis() {
    await expect(this.viewSpendAnalysisButton).toBeVisible();
    await this.viewSpendAnalysisButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpend() {
    await expect(this.spendAnalysisSection).toBeVisible();
    const total = await this.spendAnalysisSection.locator('p:has-text("Total Spend:")').textContent();
    return total.replace('Total Spend:', '').trim();
  }

  async getCategoryBreakdown() {
    await expect(this.spendAnalysisSection).toBeVisible();
    const categories = await this.spendAnalysisSection.locator('.category-badge').allTextContents();
    return categories;
  }

  async getMonthlyTrends() {
    await expect(this.spendAnalysisSection).toBeVisible();
    const trends = await this.spendAnalysisSection.locator('.trend-item').allTextContents();
    return trends;
  }

  async getTransactionCount() {
    await expect(this.spendAnalysisSection).toBeVisible();
    const count = await this.spendAnalysisSection.locator('p:has-text("Total Transactions:")').textContent();
    return parseInt(count.replace('Total Transactions:', '').trim());
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getNoDataMessageText() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async getPerformanceWarning() {
    if (await this.performanceWarning.isVisible()) {
      return await this.performanceWarning.textContent();
    }
    return null;
  }
};