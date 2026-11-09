const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    
    // Portfolio Locators
    this.portfolioSection = page.locator('[data-testid="portfolio-section"]');
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('[data-testid="card-item"]');
    
    // Loading State
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    logger.info('Navigated to Dashboard');
  }

  async waitForDashboardLoad() {
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 5000 });
    logger.info('Dashboard loaded successfully');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    logger.info(`Monthly Spend: ${text}`);
    return text;
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    logger.info(`Total Credit Limit: ${text}`);
    return text;
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    logger.info(`Available Credit: ${text}`);
    return text;
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    logger.info(`Outstanding Amount: ${text}`);
    return text;
  }

  async navigateToPortfolio() {
    await this.page.click('[data-testid="nav-portfolio"]');
    await expect(this.portfolioSection).toBeVisible();
    logger.info('Navigated to Portfolio section');
  }

  async getCardCount() {
    await expect(this.cardList).toBeVisible();
    const count = await this.cardItem.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async getCardDetails(index) {
    const card = this.cardItem.nth(index);
    await expect(card).toBeVisible();
    
    const limit = await card.locator('[data-testid="card-limit"]').textContent();
    const available = await card.locator('[data-testid="card-available"]').textContent();
    const outstanding = await card.locator('[data-testid="card-outstanding"]').textContent();
    
    return { limit, available, outstanding };
  }
};