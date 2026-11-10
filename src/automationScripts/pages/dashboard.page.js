const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard, [data-testid="dashboard"], .container-fluid');
    this.monthlySpendWidget = page.locator('kpi-widget:has-text("Monthly Spend"), .kpi-widget:has-text("Monthly Spend")');
    this.totalCreditLimitWidget = page.locator('kpi-widget:has-text("Total Credit Limit"), .kpi-widget:has-text("Total Credit Limit")');
    this.availableCreditWidget = page.locator('kpi-widget:has-text("Available Credit"), .kpi-widget:has-text("Available Credit")');
    this.outstandingAmountWidget = page.locator('kpi-widget:has-text("Outstanding Amount"), .kpi-widget:has-text("Outstanding Amount")');
    this.lastUpdatedTimestamp = page.locator('.text-muted:has-text("Last updated"), p:has-text("Last updated")');
    this.warningIndicator = page.locator('.warning, .alert-warning, [data-testid="warning"]');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await expect(this.dashboardContainer).toBeVisible();
  }

  async getKPIValue(kpiName) {
    const kpiWidget = this.page.locator(`kpi-widget:has-text("${kpiName}"), .kpi-widget:has-text("${kpiName}")`);
    await expect(kpiWidget).toBeVisible();
    const valueElement = kpiWidget.locator('.value, .kpi-value');
    await expect(valueElement).toBeVisible();
    return await valueElement.textContent();
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const text = await this.lastUpdatedTimestamp.textContent();
    return text.trim();
  }

  async waitForAutoRefresh(seconds = 61) {
    // Wait for auto-refresh cycle - using explicit timeout with reason
    await this.page.waitForTimeout(seconds * 1000);
  }
};
