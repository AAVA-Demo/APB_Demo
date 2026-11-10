const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h2:has-text("Dashboard")');
    this.monthlySpendWidget = page.locator('kpi-widget[label="Monthly Spend"]');
    this.totalCreditLimitWidget = page.locator('kpi-widget[label="Total Credit Limit"]');
    this.availableCreditWidget = page.locator('kpi-widget[label="Available Credit"]');
    this.outstandingAmountWidget = page.locator('kpi-widget[label="Outstanding Amount"]');
    this.utilizationRateWidget = page.locator('.kpi-widget:has-text("Credit Utilization")');
    this.utilizationProgressBar = page.locator('.progress-bar');
    this.noSpendingMessage = page.locator('.alert:has-text("No spending activity")');
    this.serviceErrorMessage = page.locator('.alert:has-text("Service temporarily unavailable")');
  }

  async navigate() {
    logger.info('Navigating to dashboard');
    await this.page.goto('https://creditcard-dashboard.example.com/#!/dashboard');
    await expect(this.dashboardHeader).toBeVisible();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendWidget).toBeVisible();
    const valueElement = this.monthlySpendWidget.locator('.value');
    return await valueElement.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitWidget).toBeVisible();
    const valueElement = this.totalCreditLimitWidget.locator('.value');
    return await valueElement.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditWidget).toBeVisible();
    const valueElement = this.availableCreditWidget.locator('.value');
    return await valueElement.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountWidget).toBeVisible();
    const valueElement = this.outstandingAmountWidget.locator('.value');
    return await valueElement.textContent();
  }

  async getUtilizationRate() {
    await expect(this.utilizationRateWidget).toBeVisible();
    const progressBar = this.utilizationProgressBar;
    const utilizationText = await progressBar.textContent();
    return utilizationText.trim();
  }

  async getUtilizationIndicatorColor() {
    await expect(this.utilizationProgressBar).toBeVisible();
    const classList = await this.utilizationProgressBar.getAttribute('class');
    if (classList.includes('progress-bar-success')) return 'green';
    if (classList.includes('progress-bar-warning')) return 'yellow';
    if (classList.includes('progress-bar-danger')) return 'red';
    return 'unknown';
  }

  async waitForKPILoad(timeout = 2000) {
    logger.info('Waiting for KPI widgets to load');
    await expect(this.monthlySpendWidget).toBeVisible({ timeout });
    await expect(this.totalCreditLimitWidget).toBeVisible({ timeout });
    await expect(this.availableCreditWidget).toBeVisible({ timeout });
    await expect(this.outstandingAmountWidget).toBeVisible({ timeout });
  }
};