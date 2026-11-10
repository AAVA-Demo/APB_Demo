const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.totalMonthlySpendKPI = page.locator('.kpi-card:has-text("Total Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.totalAvailableCreditKPI = page.locator('.kpi-card:has-text("Total Available Credit")');
    this.totalOutstandingKPI = page.locator('.kpi-card:has-text("Total Outstanding")');
    this.kpiCardsContainer = page.locator('.dashboard-container .row');
    
    // Error Locators
    this.errorMessage = page.locator('.alert-danger, [class*="error"]');
    
    // Multi-card summary
    this.cardCountElement = page.locator('text=/Total Cards:/');
  }

  async navigate() {
    Logger.info('Navigating to Dashboard page');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForKPIsToLoad() {
    Logger.info('Waiting for KPIs to load');
    await expect(this.totalMonthlySpendKPI).toBeVisible({ timeout: 3000 });
  }

  async getTotalMonthlySpend() {
    await expect(this.totalMonthlySpendKPI).toBeVisible();
    const text = await this.totalMonthlySpendKPI.locator('.kpi-value').textContent();
    Logger.info(`Total Monthly Spend: ${text}`);
    return text;
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    Logger.info(`Total Credit Limit: ${text}`);
    return text;
  }

  async getTotalAvailableCredit() {
    await expect(this.totalAvailableCreditKPI).toBeVisible();
    const text = await this.totalAvailableCreditKPI.locator('.kpi-value').textContent();
    Logger.info(`Total Available Credit: ${text}`);
    return text;
  }

  async getTotalOutstanding() {
    await expect(this.totalOutstandingKPI).toBeVisible();
    const text = await this.totalOutstandingKPI.locator('.kpi-value').textContent();
    Logger.info(`Total Outstanding: ${text}`);
    return text;
  }

  async getCardCount() {
    await expect(this.cardCountElement).toBeVisible();
    const text = await this.cardCountElement.textContent();
    const match = text.match(/\d+/);
    const count = match ? parseInt(match[0]) : 0;
    Logger.info(`Card Count: ${count}`);
    return count;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const text = await this.errorMessage.textContent();
    Logger.info(`Error Message: ${text}`);
    return text;
  }
};
