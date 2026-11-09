const { expect } = require('@playwright/test');

/**
 * Page Object: Dashboard Page
 * Covers: Dashboard KPIs Display functionality
 * Related Test Cases: QE-8456 TS-001, TS-002, TS-003
 */
exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Value Locators
    this.totalCreditLimitValue = page.locator('[data-testid="total-credit-limit-value"]');
    this.totalOutstandingValue = page.locator('[data-testid="total-outstanding-value"]');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"]');
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"]');
    this.creditUtilizationValue = page.locator('[data-testid="credit-utilization-value"]');
    
    // UI Elements
    this.kpiContainer = page.locator('[data-testid="kpi-container"]');
    this.creditUtilizationIndicator = page.locator('[data-testid="utilization-indicator"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async refresh() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForKPIsToLoad() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    await expect(this.kpiContainer).toBeVisible();
  }

  async getKPIValues() {
    return {
      totalCreditLimit: await this.totalCreditLimitValue.textContent(),
      totalOutstanding: await this.totalOutstandingValue.textContent(),
      availableCredit: await this.availableCreditValue.textContent(),
      monthlySpend: await this.monthlySpendValue.textContent(),
      creditUtilization: await this.creditUtilizationValue.textContent()
    };
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};