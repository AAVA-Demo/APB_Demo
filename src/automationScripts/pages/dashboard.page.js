const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.overallUtilizationKPI = page.locator('[data-testid="kpi-overall-utilization"]');
    this.currentMonthLabel = page.locator('[data-testid="current-month"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.kpiContainer = page.locator('[data-testid="kpi-container"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 10000 });
  }

  async loadKPIsForUser(userId) {
    await this.page.evaluate((id) => {
      window.localStorage.setItem('userId', id);
    }, userId);
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async getOverallUtilization() {
    await expect(this.overallUtilizationKPI).toBeVisible();
    return await this.overallUtilizationKPI.textContent();
  }

  async getCurrentMonth() {
    await expect(this.currentMonthLabel).toBeVisible();
    return await this.currentMonthLabel.textContent();
  }

  async hasErrorMessage() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async hasKPIData() {
    return await this.kpiContainer.isVisible();
  }

  async hasPartialKPIData() {
    const kpiElements = await this.page.locator('[data-testid^="kpi-"]').count();
    return kpiElements > 0 && kpiElements < 5;
  }
};