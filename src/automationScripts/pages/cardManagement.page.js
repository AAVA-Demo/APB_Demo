const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('CardManagementPage');
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    this.cardDashboard = page.locator('.card-management-container');
    this.cardTiles = page.locator('[data-testid="card-tile"]');
    
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    
    this.cardDetailView = page.locator('[data-testid="card-detail-view"]');
    this.spendAnalysisSection = page.locator('[data-testid="spend-analysis-section"]');
    
    this.totalSpendValue = page.locator('[data-testid="total-spend-value"]');
    this.monthlyTrendItems = page.locator('[data-testid="monthly-trend-item"]');
    this.creditUtilizationValue = page.locator('[data-testid="credit-utilization-value"]');
    this.currentBalanceValue = page.locator('[data-testid="current-balance-value"]');
    this.creditLimitValue = page.locator('[data-testid="credit-limit-value"]');
    
    this.noSpendingDataMessage = page.locator('[data-testid="no-spending-data-message"]');
    this.highUtilizationIndicator = page.locator('[data-testid="high-utilization-indicator"]');
    this.highUtilizationWarning = page.locator('[data-testid="high-utilization-warning"]');
  }

  async navigate() {
    this.logger.info(`Navigating to card management: ${config.baseURL}/cards`);
    await this.page.goto(`${config.baseURL}/cards`);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    this.logger.info(`Logging in as user: ${username}`);
    await this.page.goto(`${config.baseURL}/login`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.navigate();
  }

  async waitForCardDashboardLoad() {
    this.logger.info('Waiting for card dashboard to load');
    await expect(this.cardDashboard).toBeVisible({ timeout: 5000 });
  }

  async getCardCount() {
    const count = await this.cardTiles.count();
    this.logger.info(`Card count: ${count}`);
    return count;
  }

  async getAllCards() {
    const count = await this.cardTiles.count();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const tile = this.cardTiles.nth(i);
      const maskedNumber = await tile.locator('[data-testid="card-masked-number"]').textContent();
      const creditLimit = await tile.locator('[data-testid="card-credit-limit"]').textContent();
      const currentBalance = await tile.locator('[data-testid="card-current-balance"]').textContent();
      
      cards.push({
        maskedNumber: maskedNumber.trim(),
        creditLimit: creditLimit.trim(),
        currentBalance: currentBalance.trim()
      });
    }
    
    this.logger.info(`Retrieved ${cards.length} cards`);
    return cards;
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    const message = await this.noCardsMessage.textContent();
    this.logger.info(`No cards message: ${message}`);
    return message.trim();
  }

  async selectCard(maskedNumber) {
    this.logger.info(`Selecting card: ${maskedNumber}`);
    const cardTile = this.page.locator(`[data-testid="card-tile"]:has-text("${maskedNumber}")`);
    await expect(cardTile).toBeVisible();
    await cardTile.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpend() {
    await expect(this.totalSpendValue).toBeVisible();
    const value = await this.totalSpendValue.textContent();
    this.logger.info(`Total spend: ${value}`);
    return value.trim();
  }

  async getMonthlySpendingTrend() {
    await expect(this.monthlyTrendItems.first()).toBeVisible();
    const count = await this.monthlyTrendItems.count();
    const trend = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.monthlyTrendItems.nth(i);
      const month = await item.locator('[data-testid="trend-month"]').textContent();
      const amount = await item.locator('[data-testid="trend-amount"]').textContent();
      
      trend.push({
        month: month.trim(),
        amount: amount.trim()
      });
    }
    
    this.logger.info(`Monthly trend: ${JSON.stringify(trend)}`);
    return trend;
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationValue).toBeVisible();
    const value = await this.creditUtilizationValue.textContent();
    this.logger.info(`Credit utilization: ${value}`);
    return value.trim();
  }

  async getCurrentBalance() {
    await expect(this.currentBalanceValue).toBeVisible();
    const value = await this.currentBalanceValue.textContent();
    this.logger.info(`Current balance: ${value}`);
    return value.trim();
  }

  async getCreditLimit() {
    await expect(this.creditLimitValue).toBeVisible();
    const value = await this.creditLimitValue.textContent();
    this.logger.info(`Credit limit: ${value}`);
    return value.trim();
  }

  async getNoSpendingDataMessage() {
    await expect(this.noSpendingDataMessage).toBeVisible();
    const message = await this.noSpendingDataMessage.textContent();
    this.logger.info(`No spending data message: ${message}`);
    return message.trim();
  }

  async getHighUtilizationWarning() {
    await expect(this.highUtilizationWarning).toBeVisible();
    const warning = await this.highUtilizationWarning.textContent();
    this.logger.info(`High utilization warning: ${warning}`);
    return warning.trim();
  }
};
