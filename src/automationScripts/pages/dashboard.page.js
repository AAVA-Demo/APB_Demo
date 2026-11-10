const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    
    this.kpiDashboard = page.locator('.kpi-dashboard');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"]');
    this.errorMessage = page.locator('.error-message, .alert-error');
  }

  async openConsolidatedKPIDashboard() {
    this.logger.info('Opening consolidated KPI dashboard');
    await expect(this.kpiDashboard).toBeVisible({ timeout: 5000 });
  }

  async verifyDashboardLoadTime(maxLoadTime) {
    const startTime = Date.now();
    await expect(this.kpiDashboard).toBeVisible();
    const loadTime = Date.now() - startTime;
    this.logger.info(`Dashboard loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(maxLoadTime);
  }

  async verifyMonthlySpend(expectedAmount) {
    this.logger.info(`Verifying monthly spend: ${expectedAmount}`);
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.monthlySpendKPI).toContainText(expectedAmount);
  }

  async verifyTotalCreditLimit(expectedAmount) {
    this.logger.info(`Verifying total credit limit: ${expectedAmount}`);
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toContainText(expectedAmount);
  }

  async verifyAvailableCredit(expectedAmount) {
    this.logger.info(`Verifying available credit: ${expectedAmount}`);
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.availableCreditKPI).toContainText(expectedAmount);
  }

  async verifyOutstandingAmount(expectedAmount) {
    this.logger.info(`Verifying outstanding amount: ${expectedAmount}`);
    await expect(this.outstandingAmountKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toContainText(expectedAmount);
  }
};