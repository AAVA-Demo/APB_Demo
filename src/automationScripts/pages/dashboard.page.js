const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    // KPI locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .kpi-monthly-spend, div:has-text("Monthly Spend")').first();
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .kpi-total-limit, div:has-text("Total Credit Limit")').first();
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .kpi-available-credit, div:has-text("Available Credit")').first();
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], .kpi-outstanding, div:has-text("Outstanding Amount")').first();
    // Error and notification locators
    this.errorNotification = page.locator('[data-testid="error-notification"], .error-message, .alert-danger, div:has-text("failed"):visible, div:has-text("error"):visible').first();
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry"), button:has-text("Try Again")').first();
    this.noDataMessage = page.locator('[data-testid="no-data-message"], .no-data-message, div:has-text("No credit card data"), div:has-text("no cards")').first();
    this.addCardCTA = page.locator('[data-testid="add-card-cta"], button:has-text("Add"), a:has-text("Add your first credit card")').first();
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getKPIValue(kpiLocator) {
    await expect(kpiLocator).toBeVisible();
    const text = await kpiLocator.textContent();
    const numericValue = text.replace(/[^0-9.]/g, '');
    return parseFloat(numericValue) || 0;
  }

  async isNoDataMessageVisible() {
    try {
      await this.noDataMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
};