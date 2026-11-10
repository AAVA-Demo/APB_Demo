const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"]');
    this.errorMessage = page.locator('.error-message');
    this.warningMessage = page.locator('.warning-message');
    this.dashboardContainer = page.locator('.dashboard-container');
    this.kpiCards = page.locator('.kpi-card');
  }

  async navigateToDashboard() {
    await this.page.goto('https://app.creditcard.com/dashboard');
    await expect(this.dashboardContainer).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.value').textContent();
    return text.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.value').textContent();
    return text.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.value').textContent();
    return text.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('.value').textContent();
    return text.trim();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getWarningMessage() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async getAllKPIValues() {
    await expect(this.kpiCards.first()).toBeVisible();
    const values = await this.kpiCards.locator('.value').allTextContents();
    return values;
  }

  async waitForKPIUpdate(timeout = 60000) {
    await this.page.waitForTimeout(timeout);
  }
};
