const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.errorMessage = page.locator('.error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.conversionIndicator = page.locator('.conversion-indicator');
    this.conversionRatesInfo = page.locator('.conversion-rates');
    this.dashboardMenuItem = page.locator('a[href="#!/dashboard"]');
  }

  async getKPIValue(kpiName) {
    logger.info('Getting KPI value for: ' + kpiName);
    const kpiLocator = this.page.locator(`[data-testid="kpi-${kpiName.toLowerCase().replace(/ /g, '-')}"] .value`);
    await expect(kpiLocator).toBeVisible();
    return await kpiLocator.textContent();
  }

  async verifyKPIFormatting() {
    logger.info('Verifying KPI formatting');
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const value = await kpi.locator('.value').textContent();
      expect(value).toMatch(/[₹$]/); // Contains currency symbol
      expect(value).toMatch(/\d{1,3}(,\d{3})*\.\d{2}/); // Formatted with commas and 2 decimals
    }
  }

  async checkConsoleErrors(page) {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  async verifyNoStaleKPIValues() {
    logger.info('Verifying no stale KPI values displayed');
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const isVisible = await kpi.isVisible();
      if (isVisible) {
        const value = await kpi.locator('.value').textContent();
        expect(value === 'Loading...' || value === 'Error' || value === '').toBeTruthy();
      }
    }
  }

  async navigateToDashboardOverview() {
    logger.info('Navigating to Dashboard Overview');
    await this.dashboardMenuItem.click();
    await expect(this.dashboardContainer).toBeVisible();
  }
};
