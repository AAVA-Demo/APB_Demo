const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendingKPI = page.locator('[data-testid="monthly-spending"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"]');
    this.loadingSpinner = page.locator('.loading-spinner');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 3000 });
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
    await expect(this.monthlySpendingKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async getMonthlySpending() {
    await expect(this.monthlySpendingKPI).toBeVisible();
    return await this.monthlySpendingKPI.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }
};