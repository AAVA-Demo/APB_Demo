const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"], .kpi-widget:has-text("Monthly Spend")');
    this.creditLimitWidget = page.locator('[data-testid="kpi-credit-limit"], .kpi-widget:has-text("Total Credit Limit")');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"], .kpi-widget:has-text("Available Credit")');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding"], .kpi-widget:has-text("Outstanding Amount")');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend-value"], .kpi-widget:has-text("Monthly Spend") .kpi-value');
    this.creditLimitValue = page.locator('[data-testid="kpi-credit-limit-value"], .kpi-widget:has-text("Total Credit Limit") .kpi-value');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit-value"], .kpi-widget:has-text("Available Credit") .kpi-value');
    this.outstandingValue = page.locator('[data-testid="kpi-outstanding-value"], .kpi-widget:has-text("Outstanding Amount") .kpi-value');
    
    // Action Locators
    this.refreshButton = page.locator('[data-testid="refresh-dashboard"], button:has-text("Refresh Dashboard")');
    
    // Error/Notification Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.errorNotification = page.locator('[data-testid="notification"], .notification, .toast, .alert');
    
    // Card Summary Locators
    this.cardSummaryList = page.locator('[data-testid="card-summary-list"], .card-summary');
  }

  async getKPIValue(kpiType) {
    let locator;
    switch(kpiType) {
      case 'monthlySpend':
        locator = this.monthlySpendValue;
        break;
      case 'creditLimit':
        locator = this.creditLimitValue;
        break;
      case 'availableCredit':
        locator = this.availableCreditValue;
        break;
      case 'outstanding':
        locator = this.outstandingValue;
        break;
      default:
        throw new Error(`Unknown KPI type: ${kpiType}`);
    }
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }

  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
  }

  async waitForKPIUpdate() {
    // Wait for any KPI value to change or loading indicator to disappear
    await this.page.waitForTimeout(100); // Small delay to ensure update starts
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAllKPIsVisible() {
    await expect(this.monthlySpendWidget).toBeVisible();
    await expect(this.creditLimitWidget).toBeVisible();
    await expect(this.availableCreditWidget).toBeVisible();
    await expect(this.outstandingAmountWidget).toBeVisible();
  }

  async verifyNoDataExposed() {
    await expect(this.monthlySpendWidget).not.toBeVisible();
    await expect(this.creditLimitWidget).not.toBeVisible();
    await expect(this.availableCreditWidget).not.toBeVisible();
    await expect(this.outstandingAmountWidget).not.toBeVisible();
  }
};
