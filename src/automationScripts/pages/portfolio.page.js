const { expect } = require('@playwright/test');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    this.portfolioLink = page.locator('a[href="#/portfolio"]');
    
    this.cardItems = page.locator('.card-item');
    this.cardDetailsPanel = page.locator('[data-testid="card-details-panel"]');
    
    this.loadingIndicator = page.locator('.loading-spinner, [data-testid="loading"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.navigationMenu = page.locator('nav, .navbar');
    this.retryButton = page.locator('button:has-text("Retry"), [data-testid="retry-button"]');
    
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.spendingTrendChart = page.locator('[data-testid="spending-trend-chart"]');
    
    this.optimizationRecommendation = page.locator('[data-testid="optimization-recommendation"]');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToPortfolio() {
    await this.portfolioLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await expect(this.cardItems.first()).toBeVisible();
    return await this.cardItems.count();
  }

  async getAllCardTypes() {
    await expect(this.cardItems.first()).toBeVisible();
    const types = [];
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const type = await this.cardItems.nth(i).locator('[data-testid="card-type"]').textContent();
      types.push(type.trim());
    }
    return types;
  }

  async getAllMaskedCardNumbers() {
    await expect(this.cardItems.first()).toBeVisible();
    const numbers = [];
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const number = await this.cardItems.nth(i).locator('[data-testid="card-number"]').textContent();
      numbers.push(number.trim());
    }
    return numbers;
  }

  async getAllCreditLimits() {
    await expect(this.cardItems.first()).toBeVisible();
    const limits = [];
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.cardItems.nth(i).locator('[data-testid="credit-limit"]').textContent();
      limits.push(parseFloat(text.replace(/[$,]/g, '')));
    }
    return limits;
  }

  async getAllCurrentBalances() {
    await expect(this.cardItems.first()).toBeVisible();
    const balances = [];
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.cardItems.nth(i).locator('[data-testid="current-balance"]').textContent();
      balances.push(parseFloat(text.replace(/[$,]/g, '')));
    }
    return balances;
  }

  async getAllAvailableCredits() {
    await expect(this.cardItems.first()).toBeVisible();
    const credits = [];
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.cardItems.nth(i).locator('[data-testid="available-credit"]').textContent();
      credits.push(parseFloat(text.replace(/[$,]/g, '')));
    }
    return credits;
  }

  getCardLogo(cardType) {
    return this.page.locator(`[data-testid="card-logo-${cardType}"]`);
  }

  async getAllExpirationDates() {
    await expect(this.cardItems.first()).toBeVisible();
    const dates = [];
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const date = await this.cardItems.nth(i).locator('[data-testid="expiration-date"]').textContent();
      dates.push(date.trim());
    }
    return dates;
  }

  async getAllCardholderNames() {
    await expect(this.cardItems.first()).toBeVisible();
    const names = [];
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const name = await this.cardItems.nth(i).locator('[data-testid="cardholder-name"]').textContent();
      names.push(name.trim());
    }
    return names;
  }

  async verifyVisualDifferentiation() {
    const visaCard = this.page.locator('.card-item:has([data-testid="card-type"]:has-text("Visa"))');
    const mastercardCard = this.page.locator('.card-item:has([data-testid="card-type"]:has-text("Mastercard"))');
    const amexCard = this.page.locator('.card-item:has([data-testid="card-type"]:has-text("Amex"))');
    
    await expect(visaCard).toHaveCSS('background-color', /blue|#[0-9a-f]{6}/i);
    await expect(mastercardCard).toHaveCSS('background-color', /red|orange|#[0-9a-f]{6}/i);
    await expect(amexCard).toHaveCSS('background-color', /blue-green|teal|#[0-9a-f]{6}/i);
  }

  async selectCard(cardIdentifier) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpendForSelectedCard() {
    await expect(this.cardDetailsPanel).toBeVisible();
    const text = await this.cardDetailsPanel.locator('[data-testid="total-spend"]').textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getTotalSpendText() {
    await expect(this.cardDetailsPanel).toBeVisible();
    return await this.cardDetailsPanel.locator('[data-testid="total-spend"]').textContent();
  }

  async getUtilizationRateForSelectedCard() {
    await expect(this.cardDetailsPanel).toBeVisible();
    const text = await this.cardDetailsPanel.locator('[data-testid="utilization-rate"]').textContent();
    return parseFloat(text.replace('%', ''));
  }

  async getUtilizationRateText() {
    await expect(this.cardDetailsPanel).toBeVisible();
    return await this.cardDetailsPanel.locator('[data-testid="utilization-rate"]').textContent();
  }

  async getTransactionCountForSelectedCard() {
    await expect(this.cardDetailsPanel).toBeVisible();
    const text = await this.cardDetailsPanel.locator('[data-testid="transaction-count"]').textContent();
    return parseInt(text);
  }

  async getTransactionCountValue() {
    await expect(this.cardDetailsPanel).toBeVisible();
    const text = await this.cardDetailsPanel.locator('[data-testid="transaction-count"]').textContent();
    return parseInt(text) || 0;
  }

  async getAvgTransactionForSelectedCard() {
    await expect(this.cardDetailsPanel).toBeVisible();
    const text = await this.cardDetailsPanel.locator('[data-testid="avg-transaction"]').textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getAvgTransactionText() {
    await expect(this.cardDetailsPanel).toBeVisible();
    return await this.cardDetailsPanel.locator('[data-testid="avg-transaction"]').textContent();
  }

  async getOptimizationRecommendation() {
    await expect(this.optimizationRecommendation).toBeVisible();
    return await this.optimizationRecommendation.textContent();
  }
};