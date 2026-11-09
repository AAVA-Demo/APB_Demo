const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DashboardPage');
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding"]');
    
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend"] .kpi-value');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-limit"] .kpi-value');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit"] .kpi-value');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding"] .kpi-value');
    
    this.highUtilizationWarning = page.locator('[data-testid="high-utilization-warning"]');
    this.kpiRefreshIndicator = page.locator('[data-testid="kpi-refresh-indicator"]');
    
    this.transactionSimulator = page.locator('[data-testid="transaction-simulator"]');
    this.paymentSimulator = page.locator('[data-testid="payment-simulator"]');
  }

  async navigate() {
    this.logger.info(`Navigating to dashboard: ${config.baseURL}/dashboard`);
    await this.page.goto(`${config.baseURL}/dashboard`);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    this.logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    this.logger.info('Waiting for dashboard to load');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    const value = await this.monthlySpendValue.textContent();
    this.logger.info(`Monthly Spend: ${value}`);
    return value.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    const value = await this.totalCreditLimitValue.textContent();
    this.logger.info(`Total Credit Limit: ${value}`);
    return value.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    const value = await this.availableCreditValue.textContent();
    this.logger.info(`Available Credit: ${value}`);
    return value.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    const value = await this.outstandingAmountValue.textContent();
    this.logger.info(`Outstanding Amount: ${value}`);
    return value.trim();
  }

  async simulateTransaction(amount) {
    this.logger.info(`Simulating transaction of $${amount}`);
    await this.transactionSimulator.click();
    const amountInput = this.page.locator('[data-testid="transaction-amount"]');
    await amountInput.fill(amount.toString());
    const submitButton = this.page.locator('[data-testid="submit-transaction"]');
    await submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async makePayment(amount) {
    this.logger.info(`Making payment of $${amount}`);
    await this.paymentSimulator.click();
    const amountInput = this.page.locator('[data-testid="payment-amount"]');
    await amountInput.fill(amount.toString());
    const submitButton = this.page.locator('[data-testid="submit-payment"]');
    await submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForKPIRefresh() {
    this.logger.info('Waiting for KPI refresh');
    await this.page.waitForFunction(() => {
      const indicator = document.querySelector('[data-testid="kpi-refresh-indicator"]');
      return indicator && indicator.classList.contains('refreshed');
    }, { timeout: 35000 });
  }
};
