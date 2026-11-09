const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

/**
 * Page Object: DashboardPage
 * Handles all interactions with the Credit Card Dashboard
 * Used by test cases: QE-8984 TS-001/002/003 TC-001, QE-8989 TS-001/002/003 TC-001
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Card Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Error and Message Locators
    this.errorMessageContainer = page.locator('[data-testid="error-message"]');
    this.warningMessageContainer = page.locator('[data-testid="warning-message"]');
    this.noCardsMessageContainer = page.locator('[data-testid="no-cards-message"]');
    
    // Action Locators
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    
    // Credit Card List Locators
    this.cardListContainer = page.locator('[data-testid="card-list"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForSelector('[data-testid="dashboard-container"]', { state: 'visible' });
    // Wait for loading indicator to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      logger.info('Loading indicator not found or already hidden');
    });
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    logger.info(`Monthly Spend KPI text: ${text}`);
    return text;
  }

  async getMonthlySpendValue() {
    const text = await this.getMonthlySpend();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    return isNaN(value) ? 0 : value;
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    logger.info(`Total Credit Limit KPI text: ${text}`);
    return text;
  }

  async getTotalCreditLimitValue() {
    const text = await this.getTotalCreditLimit();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    return isNaN(value) ? 0 : value;
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    logger.info(`Available Credit KPI text: ${text}`);
    return text;
  }

  async getAvailableCreditValue() {
    const text = await this.getAvailableCredit();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    return isNaN(value) ? 0 : value;
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    logger.info(`Outstanding Amount KPI text: ${text}`);
    return text;
  }

  async getOutstandingAmountValue() {
    const text = await this.getOutstandingAmount();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    return isNaN(value) ? 0 : value;
  }

  async waitForErrorMessage() {
    logger.info('Waiting for error message');
    await this.errorMessageContainer.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessageContainer).toBeVisible();
    const text = await this.errorMessageContainer.textContent();
    logger.info(`Error message: ${text}`);
    return text;
  }

  async hasKPIData() {
    const monthlySpendVisible = await this.monthlySpendKPI.isVisible().catch(() => false);
    const totalCreditVisible = await this.totalCreditLimitKPI.isVisible().catch(() => false);
    return monthlySpendVisible && totalCreditVisible;
  }

  async hasErrors() {
    const errorVisible = await this.errorMessageContainer.isVisible().catch(() => false);
    return errorVisible;
  }

  async getNoCardsMessage() {
    const isVisible = await this.noCardsMessageContainer.isVisible().catch(() => false);
    if (!isVisible) return null;
    const text = await this.noCardsMessageContainer.textContent();
    logger.info(`No cards message: ${text}`);
    return text;
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    await this.refreshButton.click();
    await this.waitForDashboardLoad();
  }

  async hasStaleDataWarning() {
    const isVisible = await this.warningMessageContainer.isVisible().catch(() => false);
    return isVisible;
  }

  async getWarningMessage() {
    await expect(this.warningMessageContainer).toBeVisible();
    const text = await this.warningMessageContainer.textContent();
    logger.info(`Warning message: ${text}`);
    return text;
  }

  async wasAutoRefreshed() {
    // Check if refresh was triggered by looking for refresh indicator or timestamp change
    const refreshIndicator = this.page.locator('[data-testid="auto-refresh-indicator"]');
    const wasVisible = await refreshIndicator.isVisible().catch(() => false);
    return wasVisible;
  }

  async getCardCount() {
    const count = await this.cardItems.count();
    logger.info(`Card count: ${count}`);
    return count;
  }
};
