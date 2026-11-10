const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"], p:has-text("Last updated:")');
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger, .error-message');
    this.dashboardLink = page.locator('a[ui-sref="dashboard"], a:has-text("Dashboard")');
    this.myCardsLink = page.locator('a[ui-sref="cardPortfolio"], a:has-text("My Cards")');
  }

  async navigateToDashboard() {
    await expect(this.dashboardLink).toBeVisible();
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToMyCards() {
    await expect(this.myCardsLink).toBeVisible();
    await this.myCardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getKPIValue(kpiType) {
    let kpiLocator;
    switch(kpiType) {
      case 'monthlySpend':
        kpiLocator = this.monthlySpendKPI;
        break;
      case 'totalCreditLimit':
        kpiLocator = this.totalCreditLimitKPI;
        break;
      case 'availableCredit':
        kpiLocator = this.availableCreditKPI;
        break;
      case 'outstandingAmount':
        kpiLocator = this.outstandingAmountKPI;
        break;
      default:
        throw new Error(`Unknown KPI type: ${kpiType}`);
    }
    
    await expect(kpiLocator).toBeVisible();
    const valueElement = kpiLocator.locator('.value, [data-testid="kpi-value"]');
    await expect(valueElement).toBeVisible();
    return await valueElement.textContent();
  }

  async waitForKPIsToLoad() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async verifyKPIFormat(kpiValue) {
    const currencyRegex = /^\$[0-9,]+\.[0-9]{2}$/;
    expect(kpiValue).toMatch(currencyRegex);
  }
};