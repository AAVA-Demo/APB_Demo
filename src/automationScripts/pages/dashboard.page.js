const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.DashboardPage = class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.monthlySpendIcon = page.locator('[data-testid="icon-monthly-spend"]');
    this.creditLimitIcon = page.locator('[data-testid="icon-credit-limit"]');
    this.availableCreditIcon = page.locator('[data-testid="icon-available-credit"]');
    this.outstandingIcon = page.locator('[data-testid="icon-outstanding"]');
    this.refreshButton = page.locator('button:has-text("Refresh"), [data-testid="refresh-button"]');
    this.loadingIndicator = page.locator('.fa-spin, [data-testid="loading-indicator"]');
    this.successNotification = page.locator('text=/Dashboard updated successfully/i');
    this.errorNotification = page.locator('text=/Unable to refresh data/i');
    this.warningBanner = page.locator('text=/Some credit card data could not be loaded/i');
    this.welcomeMessage = page.locator('text=/Welcome! You don\'t have any credit cards linked yet/i');
    this.addCardButton = page.locator('button:has-text("Add Your First Credit Card"), [data-testid="add-card-button"]');
    this.lastUpdatedIndicator = page.locator('text=/Last updated:/i');
  }

  async navigate() {
    await super.navigate('/dashboard');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('[data-testid="kpi-monthly-spend"], .kpi-card', { timeout: 10000 });
  }

  async getKPIValue(kpiType) {
    let locator;
    switch (kpiType) {
      case 'monthlySpend':
        locator = this.monthlySpendKPI.locator('.kpi-value');
        break;
      case 'totalCreditLimit':
        locator = this.totalCreditLimitKPI.locator('.kpi-value');
        break;
      case 'availableCredit':
        locator = this.availableCreditKPI.locator('.kpi-value');
        break;
      case 'outstanding':
        locator = this.outstandingAmountKPI.locator('.kpi-value');
        break;
      default:
        throw new Error(`Unknown KPI type: ${kpiType}`);
    }
    
    await this.waitForElement(locator);
    return await locator.textContent();
  }

  async clickRefreshButton() {
    await this.clickElement(this.refreshButton);
  }

  async waitForRefreshComplete() {
    await this.loadingIndicator.waitFor({ state: 'visible' });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async verifyKPIsVisible() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async verifyIconsVisible() {
    await expect(this.monthlySpendIcon).toBeVisible();
    await expect(this.creditLimitIcon).toBeVisible();
    await expect(this.availableCreditIcon).toBeVisible();
    await expect(this.outstandingIcon).toBeVisible();
  }

  async getWarningBannerText() {
    return await this.getText(this.warningBanner);
  }

  async getWelcomeMessageText() {
    return await this.getText(this.welcomeMessage);
  }

  async clickAddCardButton() {
    await this.clickElement(this.addCardButton);
  }

  async getLastUpdatedText() {
    return await this.getText(this.lastUpdatedIndicator);
  }
};