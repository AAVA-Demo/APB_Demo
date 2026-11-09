const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding"]');
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"]');
    this.availableCreditErrorPlaceholder = page.locator('[data-testid="error-available-credit"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    this.utilizationDisplay = page.locator('[data-testid="utilization-rate"]');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('networkidle');
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard loaded successfully');
  }

  async waitForKPILoad(kpiName) {
    logger.info(`Waiting for KPI: ${kpiName} to load`);
    const kpiLocator = this.page.locator(`[data-testid="kpi-${kpiName}"]`);
    await expect(kpiLocator).toBeVisible({ timeout: 15000 });
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    logger.info(`Monthly spend value: ${value}`);
    return value;
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    logger.info(`Total credit limit: ${value}`);
    return value;
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    logger.info(`Available credit: ${value}`);
    return value;
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    logger.info(`Outstanding amount: ${value}`);
    return value;
  }

  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    logger.info('Retry button clicked');
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await this.lastUpdatedTimestamp.textContent();
    return timestamp;
  }

  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async getUtilizationText() {
    await expect(this.utilizationDisplay).toBeVisible();
    return await this.utilizationDisplay.textContent();
  }
};
