const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.monthlySpendKPI = page.locator('.kpi-monthly-spend, [data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('.kpi-credit-limit, [data-testid="credit-limit"]');
    this.availableCreditKPI = page.locator('.kpi-available-credit, [data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('.kpi-outstanding, [data-testid="outstanding"]');
    this.loadingIndicator = page.locator('.spinner, [data-testid="loading"]');
    this.timeoutMessage = page.locator('.timeout-message, [data-testid="timeout"]');
    this.incompleteDataWarning = page.locator('.incomplete-data, [data-testid="incomplete"]');
    this.warningIndicator = page.locator('.warning-indicator, [data-testid="warning"]');
    this.kpiContainer = page.locator('.kpi-container, [data-testid="kpi-section"]');
  }

  async waitForKPILoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(500);
  }

  async waitForKPIRefresh() {
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyKPIValue(kpiName, expectedValue) {
    const kpiElement = this.page.locator(`.kpi-card:has-text("${kpiName}"), [data-testid*="${kpiName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await expect(kpiElement).toBeVisible();
    await expect(kpiElement).toContainText(expectedValue);
  }

  async getKPINumericValue(kpiName) {
    const kpiElement = this.page.locator(`.kpi-card:has-text("${kpiName}"), [data-testid*="${kpiName.toLowerCase().replace(/\s+/g, '-')}"]`);
    const valueText = await kpiElement.locator('.kpi-value, .value').textContent();
    const numericValue = parseFloat(valueText.replace(/[^0-9.-]/g, ''));
    return numericValue;
  }

  async verifyInterfaceResponsive() {
    const isResponsive = await this.page.evaluate(() => {
      const body = document.body;
      const isScrollable = body.scrollHeight > body.clientHeight;
      const hasNoFreeze = !document.querySelector('.frozen, .unresponsive');
      return hasNoFreeze;
    });
    return isResponsive;
  }

  async verifySystemStability() {
    const isStable = await this.page.evaluate(() => {
      const hasNoErrors = !document.querySelector('.error, .crash');
      const hasNoCalculationErrors = !document.querySelector('.calculation-error');
      return hasNoErrors && hasNoCalculationErrors;
    });
    return isStable;
  }

  async verifyRecalculationAccuracy() {
    const totalCreditLimit = await this.getKPINumericValue('Total Credit Limit');
    const totalOutstanding = await this.getKPINumericValue('Outstanding');
    const displayedAvailableCredit = await this.getKPINumericValue('Available Credit');
    
    const calculatedAvailableCredit = totalCreditLimit - totalOutstanding;
    
    return Math.abs(displayedAvailableCredit - calculatedAvailableCredit) < 1;
  }
};
