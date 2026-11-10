const { expect } = require('@playwright/test');

/**
 * DashboardPage - Page Object for Dashboard KPI functionality
 * Handles dashboard KPI cards, real-time updates, and error states
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Card Locators
    this.monthlySpendCard = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitCard = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditCard = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountCard = page.locator('.kpi-card:has-text("Outstanding Amount")');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('.kpi-card:has-text("Monthly Spend") .kpi-value');
    this.totalCreditLimitValue = page.locator('.kpi-card:has-text("Total Credit Limit") .kpi-value');
    this.availableCreditValue = page.locator('.kpi-card:has-text("Available Credit") .kpi-value');
    this.outstandingAmountValue = page.locator('.kpi-card:has-text("Outstanding Amount") .kpi-value');
    
    // Loading and Error States
    this.loadingSpinner = page.locator('.loading-spinner, .spinner');
    this.errorMessage = page.locator('.alert-danger');
    this.warningMessage = page.locator('.alert-warning');
    this.retryButton = page.locator('button:has-text("Retry")');
    
    // Timestamp
    this.lastUpdatedTimestamp = page.locator('.text-muted:has-text("Last updated")');
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad() {
    await expect(this.monthlySpendCard).toBeVisible({ timeout: 10000 });
    await expect(this.totalCreditLimitCard).toBeVisible();
    await expect(this.availableCreditCard).toBeVisible();
    await expect(this.outstandingAmountCard).toBeVisible();
  }

  /**
   * Get Monthly Spend KPI value
   * @returns {Promise<string>} Monthly spend value
   */
  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  /**
   * Get Total Credit Limit KPI value
   * @returns {Promise<string>} Total credit limit value
   */
  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    return await this.totalCreditLimitValue.textContent();
  }

  /**
   * Get Available Credit KPI value
   * @returns {Promise<string>} Available credit value
   */
  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    return await this.availableCreditValue.textContent();
  }

  /**
   * Get Outstanding Amount KPI value
   * @returns {Promise<string>} Outstanding amount value
   */
  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    return await this.outstandingAmountValue.textContent();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  /**
   * Get warning message text
   * @returns {Promise<string>} Warning message
   */
  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  /**
   * Click Retry button
   */
  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
  }

  /**
   * Get last updated timestamp
   * @returns {Promise<string>} Last updated timestamp
   */
  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    return await this.lastUpdatedTimestamp.textContent();
  }
};