const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('kpi-widget:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('kpi-widget:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('kpi-widget:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('kpi-widget:has-text("Outstanding Amount")');
    this.noTransactionsMessage = page.locator('text=No transactions this month');
    this.lastUpdatedTimestamp = page.locator('.text-muted:has-text("Last updated")');
  }

  async waitForDashboardLoad() {
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 2000 });
  }

  async getMonthlySpendValue() {
    const text = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getTotalCreditLimitValue() {
    const text = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getAvailableCreditValue() {
    const text = await this.availableCreditKPI.locator('.kpi-value').textContent();
    return text.replace(/[^0-9.]/g, '');
  }

  async getOutstandingAmountValue() {
    const text = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    return text.replace(/[^0-9.]/g, '');
  }
};
