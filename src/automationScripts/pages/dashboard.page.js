const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.kpiSection = page.locator('.kpi-overview');
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"]');
    this.monthlySpendLabel = page.locator('[data-testid="monthly-spend-label"]');
    this.totalCreditLimitValue = page.locator('[data-testid="total-credit-limit-value"]');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"]');
    this.outstandingAmountValue = page.locator('[data-testid="outstanding-amount-value"]');
    this.overlimitWarning = page.locator('[data-testid="overlimit-warning"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.waitForKPISection();
  }

  async waitForKPISection() {
    await expect(this.kpiSection).toBeVisible({ timeout: 10000 });
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  async getMonthlySpendLabel() {
    await expect(this.monthlySpendLabel).toBeVisible();
    return await this.monthlySpendLabel.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    return await this.totalCreditLimitValue.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditValue).toBeVisible();
    return await this.availableCreditValue.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountValue).toBeVisible();
    return await this.outstandingAmountValue.textContent();
  }

  async getOverlimitWarning() {
    await expect(this.overlimitWarning).toBeVisible();
    return await this.overlimitWarning.textContent();
  }
};
