const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.errorMessage = page.locator('.error-message');
    this.creditLimitWarning = page.locator('.credit-limit-warning');
    this.loadingIndicator = page.locator('.loading-spinner');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await expect(this.dashboardContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    if (await this.loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(this.loadingIndicator).toBeHidden({ timeout: 5000 });
    }
    logger.info('Dashboard loaded');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    return text.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return text.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return text.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    return text.trim();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getWarningText() {
    await expect(this.creditLimitWarning).toBeVisible();
    return await this.creditLimitWarning.textContent();
  }

  async simulateTransaction(amount, merchant) {
    logger.info(`Simulating transaction: $${amount} at ${merchant}`);
    await this.page.evaluate(({ amt, merch }) => {
      window.simulateTransaction({ amount: amt, merchant: merch });
    }, { amt: amount, merch: merchant });
    logger.info('Transaction simulated');
  }
};