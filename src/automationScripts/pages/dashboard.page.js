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
    this.monthlySpendErrorIndicator = page.locator('[data-testid="kpi-monthly-spend-error"]');
    this.monthlySpendRetryButton = page.locator('[data-testid="kpi-monthly-spend-retry"]');
    this.kpiLoadingIndicators = page.locator('.kpi-loading');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiLoadingIndicators).toHaveCount(0);
    logger.info('Dashboard loaded successfully');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    return value.trim();
  }

  async getMonthlySpendErrorMessage() {
    await expect(this.monthlySpendErrorIndicator).toBeVisible();
    const message = await this.monthlySpendErrorIndicator.locator('.error-text').textContent();
    return message.trim();
  }

  async isKPIVisible(kpiName) {
    const kpiMap = {
      'monthlySpend': this.monthlySpendKPI,
      'totalCreditLimit': this.totalCreditLimitKPI,
      'availableCredit': this.availableCreditKPI,
      'outstandingAmount': this.outstandingAmountKPI
    };
    const kpi = kpiMap[kpiName];
    return await kpi.isVisible();
  }
};
