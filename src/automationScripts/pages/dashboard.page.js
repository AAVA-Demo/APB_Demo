const { expect } = require('@playwright/test');
const config = require('../../config/config');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.errorNotification = page.locator('.notification-error, .toast-error');
    this.noDataMessage = page.locator('.no-data-message');
    this.kpiPlaceholder = page.locator('.kpi-placeholder, .kpi-loading');
    this.refreshButton = page.locator('button:has-text("Refresh")');
  }

  async navigate() {
    await this.page.goto(`${config.baseUrl}/dashboard`);
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to dashboard page');
  }

  async waitForKPIVisible(kpiName) {
    const kpiLocator = this.getKPILocator(kpiName);
    await expect(kpiLocator).toBeVisible({ timeout: 5000 });
    logger.info(`${kpiName} KPI is visible`);
  }

  async getKPIValue(kpiName) {
    const kpiLocator = this.getKPILocator(kpiName);
    await expect(kpiLocator).toBeVisible();
    const value = await kpiLocator.textContent();
    return value.trim();
  }

  getKPILocator(kpiName) {
    const kpiMap = {
      'monthlySpend': this.monthlySpendKPI,
      'totalCreditLimit': this.totalCreditLimitKPI,
      'availableCredit': this.availableCreditKPI,
      'outstandingAmount': this.outstandingAmountKPI
    };
    return kpiMap[kpiName];
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    logger.info('Error message displayed');
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async waitForErrorNotification() {
    await expect(this.errorNotification).toBeVisible({ timeout: 5000 });
    logger.info('Error notification displayed');
  }

  async getErrorNotificationText() {
    await expect(this.errorNotification).toBeVisible();
    return await this.errorNotification.textContent();
  }

  async hasKPIPlaceholders() {
    const count = await this.kpiPlaceholder.count();
    return count > 0;
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async simulateTransaction(amount) {
    // Simulate transaction by triggering API call or mock event
    await this.page.evaluate((amt) => {
      window.dispatchEvent(new CustomEvent('newTransaction', { detail: { amount: amt } }));
    }, amount);
    logger.info(`Simulated transaction of $${amount}`);
  }

  async waitForKPIUpdate(kpiName, timeout = 2000) {
    const kpiLocator = this.getKPILocator(kpiName);
    await expect(kpiLocator).toBeVisible();
    // Wait for the KPI value to change by waiting for a network response or DOM mutation
    await this.page.waitForResponse(response => 
      response.url().includes('/api/') && response.status() === 200,
      { timeout }
    );
    logger.info(`${kpiName} KPI updated`);
  }

  async refreshDashboard() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard refreshed');
  }
};