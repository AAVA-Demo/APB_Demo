const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

/**
 * Dashboard Page Object
 * Handles all interactions with the Credit Card Dashboard
 * Contains locators and methods for KPI widgets, authentication, and dashboard operations
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Authentication locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.userProfile = page.locator('.user-profile');
    
    // Navigation locators
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
    
    // KPI widget locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Error and notification locators
    this.errorNotification = page.locator('.alert-danger');
    this.transactionErrorMessage = page.locator('.transaction-error');
    
    // Refresh button
    this.refreshButton = page.locator('button:has-text("Refresh")');
    
    // Credit utilization locators
    this.creditUtilizationWidget = page.locator('[data-testid="credit-utilization"]');
  }

  /**
   * Navigate to the application base URL
   */
  async navigate() {
    await this.page.goto('/');
    Logger.info('Navigated to application base URL');
  }

  /**
   * Perform user login
   * @param {string} username - Username for authentication
   * @param {string} password - Password for authentication
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info(`User logged in with username: ${username}`);
  }

  /**
   * Navigate to dashboard page
   */
  async navigateToDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info('Navigated to dashboard page');
  }

  /**
   * Get user profile element
   * @returns {Locator} User profile locator
   */
  getUserProfile() {
    return this.userProfile;
  }

  /**
   * Get Monthly Spend KPI widget
   * @returns {Locator} Monthly Spend KPI locator
   */
  getMonthlySpendKPI() {
    return this.monthlySpendKPI;
  }

  /**
   * Get Total Credit Limit KPI widget
   * @returns {Locator} Total Credit Limit KPI locator
   */
  getTotalCreditLimitKPI() {
    return this.totalCreditLimitKPI;
  }

  /**
   * Get Available Credit KPI widget
   * @returns {Locator} Available Credit KPI locator
   */
  getAvailableCreditKPI() {
    return this.availableCreditKPI;
  }

  /**
   * Get Outstanding Amount KPI widget
   * @returns {Locator} Outstanding Amount KPI locator
   */
  getOutstandingAmountKPI() {
    return this.outstandingAmountKPI;
  }

  /**
   * Get Monthly Spend value from KPI widget
   * @returns {Promise<string>} Monthly spend value
   */
  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get Total Credit Limit value from KPI widget
   * @returns {Promise<string>} Total credit limit value
   */
  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get Available Credit value from KPI widget
   * @returns {Promise<string>} Available credit value
   */
  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get Outstanding Amount value from KPI widget
   * @returns {Promise<string>} Outstanding amount value
   */
  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  /**
   * Get error notification element
   * @returns {Locator} Error notification locator
   */
  getErrorNotification() {
    return this.errorNotification;
  }

  /**
   * Get error notification text
   * @returns {Promise<string>} Error notification text
   */
  async getErrorNotificationText() {
    await expect(this.errorNotification).toBeVisible();
    return await this.errorNotification.textContent();
  }

  /**
   * Simulate a transaction on a specific card
   * @param {string} cardId - Card identifier
   * @param {number} amount - Transaction amount
   * @returns {Promise<Object>} Transaction result object
   */
  async simulateTransaction(cardId, amount) {
    // This method would interact with the application's transaction simulation API
    // For now, it's a placeholder that logs the transaction
    Logger.info(`Simulating transaction: Card ${cardId}, Amount: ₹${amount}`);
    
    // In a real implementation, this would make an API call or interact with UI
    const response = await this.page.evaluate(async ({ cardId, amount }) => {
      // Mock transaction simulation
      return { success: true, cardId, amount };
    }, { cardId, amount });
    
    return response;
  }

  /**
   * Refresh the dashboard to get updated data
   */
  async refreshDashboard() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
    Logger.info('Dashboard refreshed');
  }

  /**
   * Get transaction error message element
   * @returns {Locator} Transaction error message locator
   */
  getTransactionErrorMessage() {
    return this.transactionErrorMessage;
  }

  /**
   * Get transaction error message text
   * @returns {Promise<string>} Transaction error message text
   */
  async getTransactionErrorMessageText() {
    await expect(this.transactionErrorMessage).toBeVisible();
    return await this.transactionErrorMessage.textContent();
  }

  /**
   * Get credit utilization status
   * @returns {Promise<Object>} Credit utilization status object with percentage and over-limit flag
   */
  async getCreditUtilizationStatus() {
    await expect(this.creditUtilizationWidget).toBeVisible();
    const percentageText = await this.creditUtilizationWidget.locator('.utilization-percentage').textContent();
    const percentage = parseFloat(percentageText.replace('%', ''));
    const isOverLimit = percentage > 100;
    
    return {
      percentage,
      isOverLimit
    };
  }
};
