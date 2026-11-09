const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"]');
    this.noCardMessage = page.locator('[data-testid="no-card-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async getNoCardMessageText() {
    await expect(this.noCardMessage).toBeVisible();
    return await this.noCardMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await expect(this.retryButton).toBeEnabled();
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};
