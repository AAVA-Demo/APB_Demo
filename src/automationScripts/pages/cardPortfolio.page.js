const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.CardPortfolioPage = class CardPortfolioPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Portfolio Page Locators
    this.portfolioContainer = page.locator('[data-testid="portfolio-container"]');
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardTile = page.locator('[data-testid="card-tile"]');
    this.emptyState = page.locator('[data-testid="empty-state"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    
    // Card Detail Locators
    this.cardType = page.locator('[data-testid="card-type"]');
    this.cardNumber = page.locator('[data-testid="card-number"]');
    this.creditLimit = page.locator('[data-testid="credit-limit"]');
    this.availableCredit = page.locator('[data-testid="available-credit"]');
    this.outstandingBalance = page.locator('[data-testid="outstanding-balance"]');
    this.utilizationPercentage = page.locator('[data-testid="utilization-percentage"]');
    this.utilizationBar = page.locator('[data-testid="utilization-bar"]');
    
    // Portfolio Summary Locators
    this.portfolioSummary = page.locator('[data-testid="portfolio-summary"]');
    this.totalCardsCount = page.locator('[data-testid="total-cards-count"]');
    this.totalCreditLimitSummary = page.locator('[data-testid="total-credit-limit-summary"]');
    this.totalAvailableCreditSummary = page.locator('[data-testid="total-available-credit-summary"]');
    this.averageUtilizationSummary = page.locator('[data-testid="average-utilization-summary"]');
    
    // Card Detail View Locators
    this.cardDetailView = page.locator('[data-testid="card-detail-view"]');
    this.spendingBreakdown = page.locator('[data-testid="spending-breakdown"]');
    this.monthlySpendDetail = page.locator('[data-testid="monthly-spend-detail"]');
    this.categoryBreakdown = page.locator('[data-testid="category-breakdown"]');
  }

  async navigateToPortfolio() {
    await this.page.goto('/portfolio');
    await this.waitForPortfolioLoad();
  }

  async waitForPortfolioLoad() {
    await expect(this.portfolioContainer).toBeVisible({ timeout: 10000 });
    // Wait for either card list or empty state to be visible
    await Promise.race([
      expect(this.cardList).toBeVisible({ timeout: 5000 }),
      expect(this.emptyState).toBeVisible({ timeout: 5000 })
    ]).catch(() => {});
  }

  async getCardCount() {
    const cards = await this.cardTile.all();
    return cards.length;
  }

  async getAllCardTypes() {
    await expect(this.cardType.first()).toBeVisible();
    return await this.cardType.allTextContents();
  }

  async getAllCardNumbers() {
    await expect(this.cardNumber.first()).toBeVisible();
    return await this.cardNumber.allTextContents();
  }

  async getCardDetails(index) {
    const cards = await this.cardTile.all();
    if (index >= cards.length) {
      throw new Error(`Card index ${index} out of bounds`);
    }
    
    const card = cards[index];
    return {
      cardType: await card.locator('[data-testid="card-type"]').textContent(),
      cardNumber: await card.locator('[data-testid="card-number"]').textContent(),
      creditLimit: await card.locator('[data-testid="credit-limit"]').textContent(),
      availableCredit: await card.locator('[data-testid="available-credit"]').textContent(),
      outstandingBalance: await card.locator('[data-testid="outstanding-balance"]').textContent(),
      utilization: await card.locator('[data-testid="utilization-percentage"]').textContent()
    };
  }

  async getCardUtilization(index) {
    const cards = await this.cardTile.all();
    if (index >= cards.length) {
      throw new Error(`Card index ${index} out of bounds`);
    }
    
    const card = cards[index];
    return await card.locator('[data-testid="utilization-percentage"]').textContent();
  }

  async clickCard(index) {
    const cards = await this.cardTile.all();
    if (index >= cards.length) {
      throw new Error(`Card index ${index} out of bounds`);
    }
    
    await cards[index].click();
  }

  async isCardDetailViewVisible() {
    return await this.cardDetailView.isVisible();
  }

  async isEmptyStateVisible() {
    return await this.emptyState.isVisible();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getPortfolioSummary() {
    await expect(this.portfolioSummary).toBeVisible();
    return {
      totalCards: await this.totalCardsCount.textContent(),
      totalCreditLimit: await this.totalCreditLimitSummary.textContent(),
      totalAvailableCredit: await this.totalAvailableCreditSummary.textContent(),
      averageUtilization: await this.averageUtilizationSummary.textContent()
    };
  }

  async getCardSpendingBreakdown() {
    await expect(this.spendingBreakdown).toBeVisible();
    return {
      monthlySpend: await this.monthlySpendDetail.textContent(),
      categories: await this.categoryBreakdown.allTextContents()
    };
  }

  async getCardSpending(index) {
    const cards = await this.cardTile.all();
    if (index >= cards.length) {
      throw new Error(`Card index ${index} out of bounds`);
    }
    
    const card = cards[index];
    const spendingElement = card.locator('[data-testid="card-spending"]');
    await expect(spendingElement).toBeVisible();
    return await spendingElement.textContent();
  }

  async getUtilizationIndicatorColor(index) {
    const cards = await this.cardTile.all();
    if (index >= cards.length) {
      throw new Error(`Card index ${index} out of bounds`);
    }
    
    const card = cards[index];
    const indicator = card.locator('[data-testid="utilization-indicator"]');
    await expect(indicator).toBeVisible();
    
    const classList = await indicator.getAttribute('class');
    if (classList.includes('green')) return 'green';
    if (classList.includes('yellow')) return 'yellow';
    if (classList.includes('red')) return 'red';
    return 'unknown';
  }
};
