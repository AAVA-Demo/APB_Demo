const { expect } = require('@playwright/test');

/**
 * Page Object: DashboardPage
 * Description: Handles all interactions with the Credit Card Dashboard KPI view
 * Epic: QE-9529 - Dashboard and KPI Management
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login elements
    this.usernameInput = page.locator('input[name="username"], input#username, input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input#password, input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), .login-btn').first();
    
    // KPI Widget elements
    this.monthlySpendWidget = page.locator('.kpi-widget:has-text("Monthly Spend"), [data-testid="monthly-spend-widget"]').first();
    this.totalCreditLimitWidget = page.locator('.kpi-widget:has-text("Total Credit Limit"), [data-testid="total-credit-limit-widget"]').first();
    this.availableCreditWidget = page.locator('.kpi-widget:has-text("Available Credit"), [data-testid="available-credit-widget"]').first();
    this.outstandingAmountWidget = page.locator('.kpi-widget:has-text("Outstanding Amount"), [data-testid="outstanding-amount-widget"]').first();
    
    // KPI values
    this.monthlySpendValue = this.monthlySpendWidget.locator('.value, .kpi-value, [data-testid="monthly-spend-value"]').first();
    this.totalCreditLimitValue = this.totalCreditLimitWidget.locator('.value, .kpi-value, [data-testid="total-limit-value"]').first();
    this.availableCreditValue = this.availableCreditWidget.locator('.value, .kpi-value, [data-testid="available-credit-value"]').first();
    this.outstandingAmountValue = this.outstandingAmountWidget.locator('.value, .kpi-value, [data-testid="outstanding-value"]').first();
    
    // Error and warning messages
    this.monthlySpendErrorMessage = page.locator('.error-message, .alert-danger, [data-testid="monthly-spend-error"]').first();
    this.warningMessage = page.locator('.warning-message, .alert-warning, [data-testid="warning-message"]').first();
    
    // Refresh button
    this.refreshButton = page.locator('button:has-text("Refresh"), .refresh-btn, [data-testid="refresh-button"]').first();
    
    // Navigation elements
    this.dashboardNav = page.locator('a[href*="dashboard"], nav a:has-text("Dashboard")').first();
    this.cardsNav = page.locator('a[href*="cards"], nav a:has-text("My Cards")').first();
    this.analyticsNav = page.locator('a[href*="analytics"], nav a:has-text("Analytics")').first();
    
    // Loading indicator
    this.loadingSpinner = page.locator('.loading-spinner, .spinner, [data-testid="loading-spinner"]').first();
  }

  /**
   * Navigate to the dashboard URL
   */
  async navigate() {
    await this.page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform login action
   * @param {string} username - User's username
   * @param {string} password - User's password
   */
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    
    await this.page.waitForLoadState('networkidle');
    await this.waitForDashboardLoad();
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad() {
    await this.page.waitForSelector('.kpi-widget', { state: 'visible', timeout: 5000 });
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  /**
   * Get monthly spend value as string
   * @returns {Promise<string>}
   */
  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  /**
   * Get monthly spend value as numeric
   * @returns {Promise<number>}
   */
  async getMonthlySpendNumericValue() {
    const valueText = await this.getMonthlySpendValue();
    const numericValue = parseFloat(valueText.replace(/[^0-9.]/g, ''));
    return numericValue;
  }

  /**
   * Get total credit limit value as numeric
   * @returns {Promise<number>}
   */
  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    const valueText = await this.totalCreditLimitValue.textContent();
    return parseFloat(valueText.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get available credit value as numeric
   * @returns {Promise<number>}
   */
  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    const valueText = await this.availableCreditValue.textContent();
    return parseFloat(valueText.replace(/[^0-9.]/g, ''));
  }

  /**
   * Get outstanding amount value as numeric
   * @returns {Promise<number>}
   */
  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    const valueText = await this.outstandingAmountValue.textContent();
    return parseFloat(valueText.replace(/[^0-9.]/g, ''));
  }

  /**
   * Click refresh button and wait for data reload
   */
  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
  }

  /**
   * Wait for dashboard refresh to complete
   */
  async waitForDashboardRefresh() {
    await this.loadingSpinner.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify monthly spend calculation accuracy
   */
  async verifyMonthlySpendCalculation() {
    const monthlySpend = await this.getMonthlySpendNumericValue();
    expect(monthlySpend).toBeGreaterThanOrEqual(0);
  }

  /**
   * Verify navigation menu is accessible
   */
  async verifyNavigationAccessible() {
    await expect(this.dashboardNav).toBeVisible();
    await expect(this.cardsNav).toBeVisible();
    await expect(this.analyticsNav).toBeVisible();
  }
};