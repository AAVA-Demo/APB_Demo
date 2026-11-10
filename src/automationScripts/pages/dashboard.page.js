const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DashboardPage');
    
    // KPI Card Locators
    this.monthlySpendCard = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitCard = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditCard = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountCard = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend-value"], .kpi-card:has-text("Monthly Spend") .kpi-value');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-credit-limit-value"], .kpi-card:has-text("Total Credit Limit") .kpi-value');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit-value"], .kpi-card:has-text("Available Credit") .kpi-value');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding-amount-value"], .kpi-card:has-text("Outstanding Amount") .kpi-value');
    
    // Message Locators
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .alert:has-text("No active credit cards")');
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger, .error-message');
    this.serviceWarningMessage = page.locator('[data-testid="service-warning"], .alert-warning:has-text("may not be current")');
    this.overLimitWarning = page.locator('[data-testid="over-limit-warning"], .alert-danger:has-text("exceeded your credit limit")');
    
    // Navigation Locators
    this.navigationMenu = page.locator('[data-testid="navigation-menu"], nav, .navbar');
    this.dashboardLink = page.locator('[data-testid="dashboard-link"], a:has-text("Dashboard")');
    
    // Login Locators
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], #password');
    this.loginButton = page.locator('[data-testid="login-button"], button:has-text("Login"), button[type="submit"]');
    
    // Loading Indicator
    this.loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner');
  }

  async navigate() {
    this.logger.info('Navigating to dashboard');
    await this.page.goto('/dashboard');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    this.logger.info('Waiting for dashboard to load');
    // Wait for loading indicator to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      this.logger.info('No loading indicator found or already hidden');
    });
    // Wait for at least one KPI card or message to be visible
    await Promise.race([
      this.monthlySpendCard.waitFor({ state: 'visible', timeout: 3000 }),
      this.noCardsMessage.waitFor({ state: 'visible', timeout: 3000 }),
      this.errorMessage.waitFor({ state: 'visible', timeout: 3000 })
    ]).catch(() => {
      this.logger.warn('Dashboard load timeout - continuing');
    });
    this.logger.info('Dashboard load complete');
  }

  async loginWithCredentials(username, password) {
    this.logger.info(`Logging in with username: ${username}`);
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitForDashboardLoad();
    this.logger.info('Login completed');
  }

  async getMonthlySpend() {
    this.logger.info('Retrieving monthly spend value');
    await expect(this.monthlySpendValue).toBeVisible();
    const value = await this.monthlySpendValue.textContent();
    this.logger.info(`Monthly Spend: ${value}`);
    return value.trim();
  }

  async getTotalCreditLimit() {
    this.logger.info('Retrieving total credit limit value');
    await expect(this.totalCreditLimitValue).toBeVisible();
    const value = await this.totalCreditLimitValue.textContent();
    this.logger.info(`Total Credit Limit: ${value}`);
    return value.trim();
  }

  async getAvailableCredit() {
    this.logger.info('Retrieving available credit value');
    await expect(this.availableCreditValue).toBeVisible();
    const value = await this.availableCreditValue.textContent();
    this.logger.info(`Available Credit: ${value}`);
    return value.trim();
  }

  async getOutstandingAmount() {
    this.logger.info('Retrieving outstanding amount value');
    await expect(this.outstandingAmountValue).toBeVisible();
    const value = await this.outstandingAmountValue.textContent();
    this.logger.info(`Outstanding Amount: ${value}`);
    return value.trim();
  }

  async isNavigationAccessible() {
    this.logger.info('Checking navigation accessibility');
    const isVisible = await this.navigationMenu.isVisible();
    const isEnabled = await this.navigationMenu.isEnabled();
    this.logger.info(`Navigation accessible: ${isVisible && isEnabled}`);
    return isVisible && isEnabled;
  }

  async simulateTransaction(amount, merchant) {
    this.logger.info(`Simulating transaction: $${amount} at ${merchant}`);
    // This method would interact with a transaction simulation API or mock endpoint
    // For now, we'll use route interception to mock the transaction
    await this.page.evaluate(({ amount, merchant }) => {
      // Store transaction in sessionStorage for mock API to use
      const transactions = JSON.parse(sessionStorage.getItem('mockTransactions') || '[]');
      transactions.push({ amount, merchant, timestamp: Date.now() });
      sessionStorage.setItem('mockTransactions', JSON.stringify(transactions));
    }, { amount, merchant });
    this.logger.info('Transaction simulation completed');
  }
};