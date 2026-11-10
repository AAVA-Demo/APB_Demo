const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

/**
 * DashboardPage - Page Object for Dashboard KPIs and Financial Overview
 * Epic: QE-9830 - CreditCardNew20261110205228-Dashboard KPIs and Financial Overview
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators for KPI Section
    this.kpiSection = page.locator('.kpi-section');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"]');
    this.creditUtilizationKPI = page.locator('[data-testid="credit-utilization-kpi"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    
    // Warning and Error Messages
    this.warningIndicator = page.locator('.warning-indicator');
    this.noCardsMessage = page.locator('.no-cards-message');
  }

  /**
   * Navigate to dashboard page
   */
  async navigate() {
    Logger.info('Navigating to dashboard');
    await this.page.goto('/dashboard');
    await this.waitForDashboardLoad();
    Logger.info('Dashboard navigation completed');
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad() {
    Logger.info('Waiting for dashboard to load');
    await expect(this.kpiSection).toBeVisible({ timeout: 10000 });
    Logger.info('Dashboard loaded successfully');
  }

  /**
   * Get Monthly Spend value
   * @returns {Promise<string>} Monthly spend amount
   */
  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    Logger.info(`Monthly Spend retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get Total Credit Limit value
   * @returns {Promise<string>} Total credit limit amount
   */
  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    Logger.info(`Total Credit Limit retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get Available Credit value
   * @returns {Promise<string>} Available credit amount
   */
  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.locator('.kpi-value').textContent();
    Logger.info(`Available Credit retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get Outstanding Amount value
   * @returns {Promise<string>} Outstanding amount
   */
  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    Logger.info(`Outstanding Amount retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get Credit Utilization percentage
   * @returns {Promise<string>} Credit utilization percentage
   */
  async getCreditUtilization() {
    await expect(this.creditUtilizationKPI).toBeVisible();
    const value = await this.creditUtilizationKPI.locator('.kpi-value').textContent();
    Logger.info(`Credit Utilization retrieved: ${value}`);
    return value.trim();
  }

  /**
   * Get last updated timestamp
   * @returns {Promise<string>} Last updated timestamp
   */
  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await this.lastUpdatedTimestamp.textContent();
    Logger.info(`Last Updated Timestamp: ${timestamp}`);
    return timestamp.trim();
  }

  /**
   * Get warning message text
   * @returns {Promise<string>} Warning message
   */
  async getWarningMessage() {
    await expect(this.warningIndicator).toBeVisible();
    const message = await this.warningIndicator.textContent();
    Logger.info(`Warning Message: ${message}`);
    return message.trim();
  }

  /**
   * Get no cards message text
   * @returns {Promise<string>} No cards message
   */
  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    const message = await this.noCardsMessage.textContent();
    Logger.info(`No Cards Message: ${message}`);
    return message.trim();
  }

  /**
   * Simulate a transaction (for testing real-time updates)
   * @param {string} cardId - Card identifier
   * @param {number} amount - Transaction amount
   */
  async simulateTransaction(cardId, amount) {
    Logger.info(`Simulating transaction: Card ${cardId}, Amount ${amount}`);
    // This would typically trigger an API call or mock data update
    await this.page.evaluate(({ cardId, amount }) => {
      window.simulateTransaction(cardId, amount);
    }, { cardId, amount });
    Logger.info('Transaction simulation completed');
  }

  /**
   * Verify all KPIs are visible
   */
  async verifyAllKPIsVisible() {
    Logger.info('Verifying all KPIs are visible');
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    await expect(this.creditUtilizationKPI).toBeVisible();
    Logger.info('All KPIs are visible');
  }
};