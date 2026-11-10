const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const { getBaseUrl } = require('../../data/environment');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard container
    this.dashboardContainer = page.locator('div[ng-if="!vm.loading&&!vm.error"]');
    
    // KPI Widgets
    this.monthlySpendWidget = page.locator('kpi-widget[kpi="kpi"]').filter({ hasText: 'Monthly Spend' });
    this.monthlySpendValue = this.monthlySpendWidget.locator('div.value');
    this.totalCreditLimitWidget = page.locator('kpi-widget[kpi="kpi"]').filter({ hasText: 'Total Credit Limit' });
    this.totalCreditLimitValue = this.totalCreditLimitWidget.locator('div.value');
    this.availableCreditWidget = page.locator('kpi-widget[kpi="kpi"]').filter({ hasText: 'Available Credit' });
    this.availableCreditValue = this.availableCreditWidget.locator('div.value');
    this.outstandingAmountWidget = page.locator('kpi-widget[kpi="kpi"]').filter({ hasText: 'Outstanding Amount' });
    this.outstandingAmountValue = this.outstandingAmountWidget.locator('div.value');
    
    // Timestamps and messages
    this.lastUpdatedTimestamp = page.locator('small:has-text("Last updated:")');
    this.errorMessage = page.locator('div.alert.alert-danger');
    this.loadingIndicator = page.locator('div[ng-if="vm.loading"]');
    this.noActiveCardsMessage = page.locator('div.alert.alert-info:has-text("No active cards")');
    
    // Navigation
    this.dashboardTab = page.locator('a[href="#!/dashboard"]');
  }

  async navigate() {
    const baseUrl = getBaseUrl();
    logger.info(`Navigating to Dashboard: ${baseUrl}/dashboard`);
    await this.page.goto(`${baseUrl}/dashboard`);
    await expect(this.dashboardContainer.or(this.loadingIndicator)).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard page loaded');
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await expect(this.dashboardContainer.or(this.loadingIndicator).or(this.errorMessage)).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard refreshed');
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

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await this.lastUpdatedTimestamp.textContent();
    logger.info(`Last Updated Timestamp: ${timestamp}`);
    return timestamp.trim();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info(`Error Message: ${message}`);
    return message.trim();
  }

  async getNoActiveCardsMessage() {
    await expect(this.noActiveCardsMessage).toBeVisible();
    const message = await this.noActiveCardsMessage.textContent();
    logger.info(`No Active Cards Message: ${message}`);
    return message.trim();
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.dashboardContainer.or(this.errorMessage)).toBeVisible();
    logger.info('Dashboard load complete');
  }
};