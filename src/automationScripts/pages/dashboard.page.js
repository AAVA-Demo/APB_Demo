const { expect } = require('@playwright/test');
const config = require('../../data/config.json');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Loading and Error States
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.availableCreditError = page.locator('[data-testid="error-available-credit"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    // Layout
    this.kpiContainer = page.locator('[data-testid="kpi-container"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated-timestamp"]');
  }

  async navigate() {
    await this.page.goto(config.baseUrl + '/dashboard');
  }

  async waitForDashboardLoad() {
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 5000 });
    await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 5000 });
    await expect(this.availableCreditKPI).toBeVisible({ timeout: 5000 });
    await expect(this.outstandingAmountKPI).toBeVisible({ timeout: 5000 });
  }

  async waitForKPIsToLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    const match = text.match(/₹([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  }

  async getAllKPIs() {
    return await this.page.locator('[data-testid^="kpi-"]').all();
  }

  async waitForKPIUpdate() {
    await this.page.waitForResponse(response => 
      response.url().includes('/api/kpi') && response.status() === 200
    );
    await this.page.waitForTimeout(1000);
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    return await this.lastUpdatedTimestamp.textContent();
  }
};
