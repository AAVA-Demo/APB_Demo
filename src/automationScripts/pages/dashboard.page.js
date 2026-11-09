const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"]');
    this.kpiContainer = page.locator('.kpi-cards');
    this.warningMessage = page.locator('.alert-warning');
    this.errorMessage = page.locator('.alert-danger');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.refreshButton = page.locator('button:has-text("Refresh")');
    this.autoRefreshToggle = page.locator('#auto-refresh-toggle');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    await expect(this.kpiContainer).toBeVisible({ timeout: 5000 });
    logger.info('Dashboard loaded');
  }

  async waitForAllKPIs() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async getAvailableCredit() {
    const text = await this.availableCreditKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getOutstandingAmount() {
    const text = await this.outstandingAmountKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async simulateTransaction(amount, merchant) {
    // This would typically call an API endpoint to create a transaction
    await this.page.evaluate(async ({ amount, merchant }) => {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, merchant })
      });
    }, { amount, merchant });
    logger.info(`Transaction simulated: $${amount} at ${merchant}`);
  }

  async enableAutoRefresh(intervalSeconds) {
    await this.autoRefreshToggle.check();
    await this.page.selectOption('#refresh-interval', intervalSeconds.toString());
    logger.info(`Auto-refresh enabled with ${intervalSeconds}s interval`);
  }
};
