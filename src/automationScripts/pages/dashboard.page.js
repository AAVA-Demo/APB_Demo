const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend") .value');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit") .value');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit") .value');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount") .value');
    
    // Message Locators
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .alert:has-text("No credit cards")');
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger, .error-message');
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry")');
    
    // Dashboard Elements
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"], .dashboard, #dashboard');
    this.refreshButton = page.locator('[data-testid="refresh-button"], button:has-text("Refresh")');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('networkidle');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard loaded successfully');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.textContent();
    logger.info(`Monthly Spend value: ${value}`);
    return value.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.textContent();
    logger.info(`Total Credit Limit value: ${value}`);
    return value.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.textContent();
    logger.info(`Available Credit value: ${value}`);
    return value.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.textContent();
    logger.info(`Outstanding Amount value: ${value}`);
    return value.trim();
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    const text = await this.noCardsMessage.textContent();
    logger.info(`No cards message: ${text}`);
    return text.trim();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    const text = await this.errorMessage.textContent();
    logger.info(`Error message: ${text}`);
    return text.trim();
  }

  async clickRetry() {
    logger.info('Clicking retry button');
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    logger.info('Retry button clicked');
  }

  async clickRefresh() {
    logger.info('Clicking refresh button');
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
    logger.info('Refresh button clicked');
  }
};