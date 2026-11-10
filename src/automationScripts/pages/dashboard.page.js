const { expect } = require('@playwright/test');

/**
 * Page Object: DashboardPage
 * Description: Represents the Credit Card Dashboard page with KPI widgets
 * Features: Monthly Spend, Total Credit Limit, Available Credit, Outstanding Amount
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators for dashboard container
    this.dashboardContainer = page.locator('.dashboard-container');
    
    // KPI widget locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Refresh button
    this.refreshButton = page.locator('button:has-text("Refresh")');
    
    // Last updated timestamp
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    
    // Error/message indicators
    this.errorMessage = page.locator('.alert-danger');
    this.infoMessage = page.locator('.alert-info');
  }

  /**
   * Navigate to dashboard page
   */
  async navigate() {
    await this.page.goto('/dashboard');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get Monthly Spend KPI value
   * @returns {Promise<number>}
   */
  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('h2').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get Total Credit Limit KPI value
   * @returns {Promise<number>}
   */
  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('h2').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get Available Credit KPI value
   * @returns {Promise<number>}
   */
  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('h2').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get Outstanding Amount KPI value
   * @returns {Promise<number>}
   */
  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('h2').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get last updated timestamp
   * @returns {Promise<string>}
   */
  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    return await this.lastUpdatedTimestamp.textContent();
  }

  /**
   * Get Monthly Spend message (for unavailable data scenarios)
   * @returns {Promise<string>}
   */
  async getMonthlySpendMessage() {
    const messageLocator = this.monthlySpendKPI.locator('.unavailable-message');
    await expect(messageLocator).toBeVisible();
    return await messageLocator.textContent();
  }

  /**
   * Wait for KPI refresh (monitors network activity)
   */
  async waitForKPIRefresh() {
    await this.page.waitForResponse(response => 
      response.url().includes('/api/users/') && response.status() === 200,
      { timeout: 10000 }
    );
    await this.page.waitForResponse(response => 
      response.url().includes('/api/transactions') && response.status() === 200,
      { timeout: 10000 }
    );
  }

  /**
   * Click refresh button
   */
  async refresh() {
    await this.refreshButton.click();
    await this.waitForKPIRefresh();
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>}
   */
  async hasErrorMessage() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
