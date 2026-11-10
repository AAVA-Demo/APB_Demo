const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.creditLimitKPI = page.locator('[data-testid="kpi-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingKPI = page.locator('[data-testid="kpi-outstanding"]');
    this.creditUtilizationBar = page.locator('[data-testid="credit-utilization-bar"]');
    
    // Value Locators
    this.monthlySpendValue = page.locator('[data-testid="value-monthly-spend"]');
    this.creditLimitValue = page.locator('[data-testid="value-credit-limit"]');
    this.availableCreditValue = page.locator('[data-testid="value-available-credit"]');
    this.outstandingValue = page.locator('[data-testid="value-outstanding"]');
    this.utilizationValue = page.locator('[data-testid="value-utilization"]');
    
    // Layout Locators
    this.kpiContainer = page.locator('.dashboard-container .row');
    this.kpiCards = page.locator('.panel.panel-default, .panel.panel-primary, .panel.panel-success, .panel.panel-info, .panel.panel-warning');
    this.dashboardSpinner = page.locator('.spinner');
    this.errorAlert = page.locator('.alert.alert-danger');
  }

  async navigate() {
    await this.page.goto('/#/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    await this.page.waitForSelector('.dashboard-container', { state: 'visible' });
    await this.dashboardSpinner.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.creditLimitKPI).toBeVisible();
    return await this.creditLimitValue.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditValue.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingKPI).toBeVisible();
    return await this.outstandingValue.textContent();
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationBar).toBeVisible();
    return await this.utilizationValue.textContent();
  }

  async verifyFinancialCalculations() {
    const creditLimit = parseFloat((await this.getTotalCreditLimit()).replace(/[$,]/g, ''));
    const outstanding = parseFloat((await this.getOutstandingAmount()).replace(/[$,]/g, ''));
    const available = parseFloat((await this.getAvailableCredit()).replace(/[$,]/g, ''));
    
    const expectedAvailable = creditLimit - outstanding;
    expect(Math.abs(available - expectedAvailable)).toBeLessThan(0.01);
  }

  async getKPILayout() {
    const firstCard = this.kpiCards.first();
    const secondCard = this.kpiCards.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    if (secondBox.y > firstBox.y + firstBox.height) {
      return 'vertical';
    }
    return 'horizontal';
  }

  async getAllKPICards() {
    return await this.kpiCards.all();
  }

  async getKPIContainerWidth() {
    const box = await this.kpiContainer.boundingBox();
    return box.width;
  }

  async hasHorizontalScrollbar() {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    return scrollWidth > clientWidth;
  }

  async getTruncatedElements() {
    return await this.page.locator('[style*="text-overflow: ellipsis"], [style*="overflow: hidden"]').all();
  }
};
