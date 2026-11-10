const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardPortfolioPage = class CardPortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardItems = page.locator('[data-testid="card-item"], .card-item');
    this.cardNumbers = page.locator('[data-testid="card-number"], .card-number');
    this.cardIssuers = page.locator('[data-testid="card-issuer"], .card-item small');
    this.creditLimits = page.locator('[data-testid="credit-limit"], .card-detail-item:has-text("Credit Limit") .card-detail-value');
    this.availableCredits = page.locator('[data-testid="available-credit"], .card-detail-item:has-text("Available") .card-detail-value');
    this.outstandingBalances = page.locator('[data-testid="outstanding-balance"], .card-detail-item:has-text("Outstanding") .card-detail-value');
    this.monthlySpends = page.locator('[data-testid="monthly-spend"], .card-detail-item:has-text("Monthly Spend") .card-detail-value');
    
    // Portfolio Summary Locators
    this.portfolioSummary = page.locator('[data-testid="portfolio-summary"], .kpi-widget:has-text("Portfolio Summary")');
    this.totalCardsValue = page.locator('[data-testid="total-cards"], .kpi-widget:has-text("Total Cards") .kpi-value');
    this.totalLimitValue = page.locator('[data-testid="total-limit-portfolio"], .kpi-widget:has-text("Total Credit Limit") .kpi-value');
    this.totalAvailableValue = page.locator('[data-testid="total-available-portfolio"], .kpi-widget:has-text("Total Available") .kpi-value');
    
    // Card Details Locators
    this.currentMonthSpendValue = page.locator('[data-testid="current-month-spend"], .spend-analysis:has-text("Current Month") .amount');
    this.previousMonthSpendValue = page.locator('[data-testid="previous-month-spend"], .spend-analysis:has-text("Previous Month") .amount');
    this.trendIndicator = page.locator('[data-testid="trend-indicator"], .spend-analysis .trend');
    this.topCategories = page.locator('[data-testid="top-category"], .top-categories .category-item');
    this.trendSection = page.locator('[data-testid="trend-section"], .spend-analysis .trend-section');
    this.categoriesSection = page.locator('[data-testid="categories-section"], .top-categories');
    
    // Sort and Filter Locators
    this.sortByMonthlySpendButton = page.locator('[data-testid="sort-monthly-spend"], button:has-text("Monthly Spend")');
    this.sortByBalanceButton = page.locator('[data-testid="sort-balance"], button:has-text("Balance")');
    this.sortByLimitButton = page.locator('[data-testid="sort-limit"], button:has-text("Limit")');
    
    // Error and Message Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-state:has-text("No cards found")');
    
    // Navigation
    this.cardsTab = page.locator('[href="#!/cards"], a:has-text("My Cards")');
  }

  async navigate() {
    logger.info('Navigating to card portfolio');
    await this.page.goto('/#!/cards');
  }

  async waitForPortfolioLoad() {
    logger.info('Waiting for portfolio to load');
    await expect(this.cardItems.first()).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardDetailsLoad() {
    logger.info('Waiting for card details to load');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Wait for animations
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getAllCardNumbers() {
    const count = await this.cardNumbers.count();
    const numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(await this.cardNumbers.nth(i).textContent());
    }
    return numbers;
  }

  async getAllIssuers() {
    const count = await this.cardIssuers.count();
    const issuers = [];
    for (let i = 0; i < count; i++) {
      issuers.push(await this.cardIssuers.nth(i).textContent());
    }
    return issuers;
  }

  async getAllCreditLimits() {
    const count = await this.creditLimits.count();
    const limits = [];
    for (let i = 0; i < count; i++) {
      limits.push(await this.creditLimits.nth(i).textContent());
    }
    return limits;
  }

  async getAllAvailableCredits() {
    const count = await this.availableCredits.count();
    const credits = [];
    for (let i = 0; i < count; i++) {
      credits.push(await this.availableCredits.nth(i).textContent());
    }
    return credits;
  }

  async getAllOutstandingBalances() {
    const count = await this.outstandingBalances.count();
    const balances = [];
    for (let i = 0; i < count; i++) {
      balances.push(await this.outstandingBalances.nth(i).textContent());
    }
    return balances;
  }

  async getPortfolioSummary() {
    await expect(this.portfolioSummary).toBeVisible();
    return {
      totalCards: parseInt(await this.totalCardsValue.textContent()),
      totalCreditLimit: (await this.totalLimitValue.textContent()).trim(),
      totalAvailable: (await this.totalAvailableValue.textContent()).trim()
    };
  }

  async getCardNumberByIndex(index) {
    return await this.cardNumbers.nth(index).textContent();
  }

  async getIssuerByIndex(index) {
    return await this.cardIssuers.nth(index).textContent();
  }

  async getCreditLimitByIndex(index) {
    return await this.creditLimits.nth(index).textContent();
  }

  async selectCardByIndex(index) {
    logger.info(`Selecting card at index ${index}`);
    await this.cardItems.nth(index).click();
  }

  async getCurrentMonthSpend() {
    await expect(this.currentMonthSpendValue).toBeVisible();
    return (await this.currentMonthSpendValue.textContent()).trim();
  }

  async getPreviousMonthSpend() {
    await expect(this.previousMonthSpendValue).toBeVisible();
    return (await this.previousMonthSpendValue.textContent()).trim();
  }

  async getSpendingTrend() {
    await expect(this.trendIndicator).toBeVisible();
    return (await this.trendIndicator.textContent()).trim();
  }

  async getTopSpendingCategories() {
    const count = await this.topCategories.count();
    const categories = [];
    for (let i = 0; i < count; i++) {
      const text = await this.topCategories.nth(i).textContent();
      const match = text.match(/([^:]+):\s*\$(\S+)/);
      if (match) {
        categories.push({
          name: match[1].trim(),
          amount: `$${match[2]}`
        });
      }
    }
    return categories;
  }

  async getTrendSectionText() {
    await expect(this.trendSection).toBeVisible();
    return await this.trendSection.textContent();
  }

  async getCategoriesSectionText() {
    await expect(this.categoriesSection).toBeVisible();
    return await this.categoriesSection.textContent();
  }

  async sortByMonthlySpend() {
    logger.info('Sorting by monthly spend');
    await this.sortByMonthlySpendButton.click();
  }

  async getCardByIndex(index) {
    const cardItem = this.cardItems.nth(index);
    await expect(cardItem).toBeVisible();
    
    return {
      cardNumber: await cardItem.locator('.card-number').textContent(),
      monthlySpend: await cardItem.locator('.card-detail-item:has-text("Monthly Spend") .card-detail-value').textContent(),
      creditLimit: await cardItem.locator('.card-detail-item:has-text("Credit Limit") .card-detail-value').textContent(),
      outstanding: await cardItem.locator('.card-detail-item:has-text("Outstanding") .card-detail-value').textContent()
    };
  }

  async calculateUtilizationRates() {
    const count = await this.cardItems.count();
    const rates = [];
    
    for (let i = 0; i < count; i++) {
      const card = await this.getCardByIndex(i);
      const limit = parseFloat(card.creditLimit.replace(/[$,]/g, ''));
      const outstanding = parseFloat(card.outstanding.replace(/[$,]/g, ''));
      const rate = (outstanding / limit) * 100;
      rates.push(parseFloat(rate.toFixed(2)));
    }
    
    return rates;
  }

  async getHighestUtilizationCard() {
    const rates = await this.calculateUtilizationRates();
    const maxRate = Math.max(...rates);
    const maxIndex = rates.indexOf(maxRate);
    const card = await this.getCardByIndex(maxIndex);
    
    return {
      cardNumber: card.cardNumber,
      rate: maxRate
    };
  }

  async getComparisonSummary() {
    // Get highest spend card (assuming already sorted)
    const highestSpendCard = await this.getCardByIndex(0);
    const highestUtilization = await this.getHighestUtilizationCard();
    
    return {
      highestSpendCard: highestSpendCard.cardNumber,
      highestSpendAmount: highestSpendCard.monthlySpend,
      highestUtilizationCard: highestUtilization.cardNumber,
      highestUtilizationRate: highestUtilization.rate
    };
  }
};
