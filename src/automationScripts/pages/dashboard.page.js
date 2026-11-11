const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {

  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitWidget = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend"] .kpi-value');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-credit-limit"] .kpi-value');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit"] .kpi-value');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding-amount"] .kpi-value');
    
    // Other Elements
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    this.utilizationPercentage = page.locator('[data-testid="utilization-percentage"]');
    
    // Console error tracking
    this.consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/dashboard');
  }

  async waitForPageLoad() {
    logger.info('Waiting for dashboard page to load');
    await expect(this.monthlySpendWidget).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    const value = await this.monthlySpendValue.textContent();
    logger.info(`Monthly Spend Value: ${value}`);
    return value.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    const value = await this.totalCreditLimitValue.textContent();
    logger.info(`Total Credit Limit Value: ${value}`);
    return value.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    const value = await this.availableCreditValue.textContent();
    logger.info(`Available Credit Value: ${value}`);
    return value.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    const value = await this.outstandingAmountValue.textContent();
    logger.info(`Outstanding Amount Value: ${value}`);
    return value.trim();
  }

  async getUtilizationPercentage() {
    await expect(this.utilizationPercentage).toBeVisible();
    const value = await this.utilizationPercentage.textContent();
    logger.info(`Utilization Percentage: ${value}`);
    return value.trim();
  }

  async triggerRefresh() {
    logger.info('Triggering dashboard refresh');
    await this.refreshButton.click();
  }

  async waitForMonthlySpendUpdate(expectedValue) {
    logger.info(`Waiting for Monthly Spend to update to ${expectedValue}`);
    await expect(this.monthlySpendValue).toHaveText(expectedValue, { timeout: 5000 });
  }

  async verifyDataRefresh() {
    logger.info('Verifying data refresh occurred');
    const initialTimestamp = await this.lastUpdatedTimestamp.textContent();
    await this.page.waitForTimeout(1000);
    const updatedTimestamp = await this.lastUpdatedTimestamp.textContent();
    return initialTimestamp !== updatedTimestamp;
  }

  async checkPageReload() {
    logger.info('Checking if page reloaded');
    const performanceEntries = await this.page.evaluate(() => {
      return performance.getEntriesByType('navigation');
    });
    return performanceEntries.length > 0 && performanceEntries[0].type === 'reload';
  }

  async verifyCurrencyFormatting() {
    logger.info('Verifying currency formatting');
    const values = [
      await this.getMonthlySpendValue(),
      await this.getTotalCreditLimitValue(),
      await this.getAvailableCreditValue(),
      await this.getOutstandingAmountValue()
    ];
    
    for (const value of values) {
      expect(value).toMatch(/^\$[\d,]+(\.\d{2})?$/);
    }
  }

  async getConsoleErrors() {
    return this.consoleErrors;
  }

};