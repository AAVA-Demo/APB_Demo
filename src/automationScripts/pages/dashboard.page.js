const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.creditUtilizationKPI = page.locator('[data-testid="kpi-credit-utilization"]');
    
    // KPI Section
    this.kpiSection = page.locator('.kpi-box');
    
    // Utilization Bar
    this.utilizationBar = page.locator('[data-testid="utilization-bar"]');
    
    // Card Portfolio
    this.cardPortfolioSection = page.locator('[data-testid="card-portfolio"]');
    
    // Error and Warning Messages
    this.serviceUnavailableMessage = page.locator('[data-testid="service-unavailable"]');
    this.monthlySpendError = page.locator('[data-testid="monthly-spend-error"]');
    this.staleDataWarning = page.locator('[data-testid="stale-data-warning"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated-timestamp"]');
    
    // Buttons
    this.retryButton = page.locator('button:has-text("Retry")');
    this.refreshButton = page.locator('button:has-text("Refresh")');
  }

  async navigate() {
    logger.info('Navigating to Dashboard');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiSection.first()).toBeVisible({ timeout: 2000 });
    logger.info('Dashboard page loaded successfully');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    logger.info(`Monthly Spend: ${text}`);
    return text.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    logger.info(`Total Credit Limit: ${text}`);
    return text.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    logger.info(`Available Credit: ${text}`);
    return text.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    logger.info(`Outstanding Amount: ${text}`);
    return text.trim();
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationKPI).toBeVisible();
    const text = await this.creditUtilizationKPI.textContent();
    logger.info(`Credit Utilization: ${text}`);
    return text.trim();
  }

  async scrollToCardPortfolio() {
    logger.info('Scrolling to card portfolio section');
    await this.cardPortfolioSection.scrollIntoViewIfNeeded();
    await expect(this.cardPortfolioSection).toBeVisible();
  }

  getCardUtilizationBar(cardId) {
    return this.page.locator(`[data-testid="card-${cardId}-utilization-bar"]`);
  }

  async verifyKPIVisibility() {
    logger.info('Verifying all KPIs are visible');
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    await expect(this.creditUtilizationKPI).toBeVisible();
    logger.info('All KPIs verified as visible');
  }
};