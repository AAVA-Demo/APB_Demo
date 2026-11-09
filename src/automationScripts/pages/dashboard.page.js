const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardContainer = page.locator('.dashboard-container');
    this.kpiCards = page.locator('.kpi-card');
    this.monthlySpendKPI = page.locator('[data-kpi="monthly-spend"] .kpi-value');
    this.availableCreditKPI = page.locator('[data-kpi="available-credit"] .kpi-value');
    this.totalCreditLimitKPI = page.locator('[data-kpi="total-credit-limit"] .kpi-value');
    this.outstandingAmountKPI = page.locator('[data-kpi="outstanding-amount"] .kpi-value');
    this.transactionList = page.locator('.transaction-list');
    this.transactionItem = page.locator('.transaction-item');
    this.cardDataContainer = page.locator('.card-data-container');
    this.cardItem = (cardName) => page.locator(`[data-card-name="${cardName}"]`);
    this.cardLimit = (cardName) => page.locator(`[data-card-name="${cardName}"] .card-limit`);
    this.cardOutstanding = (cardName) => page.locator(`[data-card-name="${cardName}"] .card-outstanding`);
    this.errorLogIndicator = page.locator('.error-log-indicator');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL(/login/);
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/dashboard/);
    logger.info(`Logged in as ${username}`);
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard loaded');
  }

  async waitForKPICards() {
    await expect(this.kpiCards.first()).toBeVisible({ timeout: 5000 });
    const count = await this.kpiCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
    logger.info('KPI cards loaded');
  }

  async getMonthlySpendKPI() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.textContent();
    return value.trim();
  }

  async getAvailableCreditKPI() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.textContent();
    return value.trim();
  }

  async getTotalCreditLimitKPI() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.textContent();
    return value.trim();
  }

  async getOutstandingAmountKPI() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.textContent();
    return value.trim();
  }

  async getTransactionCount() {
    await expect(this.transactionList).toBeVisible();
    const count = await this.transactionItem.count();
    return count;
  }

  async triggerKPICalculation() {
    await this.page.evaluate(() => {
      if (window.calculateKPIs) {
        window.calculateKPIs();
      }
    });
    await this.page.waitForTimeout(1000);
    logger.info('KPI calculation triggered');
  }

  async waitForCardDataLoad() {
    await expect(this.cardDataContainer).toBeVisible({ timeout: 5000 });
    logger.info('Card data loaded');
  }

  async getCardLimit(cardName) {
    const cardExists = await this.cardItem(cardName).count();
    if (cardExists === 0) {
      return null;
    }
    await expect(this.cardLimit(cardName)).toBeVisible();
    const limitText = await this.cardLimit(cardName).textContent();
    if (limitText.toLowerCase().includes('null') || limitText.trim() === '') {
      return null;
    }
    return parseFloat(limitText.replace(/[$,]/g, ''));
  }

  async getCardOutstanding(cardName) {
    await expect(this.cardOutstanding(cardName)).toBeVisible();
    const outstandingText = await this.cardOutstanding(cardName).textContent();
    return parseFloat(outstandingText.replace(/[$,]/g, ''));
  }

  async checkErrorLog() {
    const errorExists = await this.errorLogIndicator.count();
    if (errorExists > 0) {
      const isVisible = await this.errorLogIndicator.isVisible();
      return isVisible;
    }
    const consoleErrors = await this.page.evaluate(() => {
      return window.errorLogs && window.errorLogs.length > 0;
    });
    return consoleErrors;
  }
};