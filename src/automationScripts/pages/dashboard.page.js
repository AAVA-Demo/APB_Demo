const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.monthlySpendWidget = page.locator('[data-testid="kpi-monthly-spend"], .kpi-widget:has-text("Monthly Spend")');
    this.totalCreditLimitWidget = page.locator('[data-testid="kpi-total-limit"], .kpi-widget:has-text("Total Credit Limit")');
    this.availableCreditWidget = page.locator('[data-testid="kpi-available-credit"], .kpi-widget:has-text("Available Credit")');
    this.outstandingAmountWidget = page.locator('[data-testid="kpi-outstanding"], .kpi-widget:has-text("Outstanding Amount")');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"], .kpi-widget:has-text("Monthly Spend") .kpi-value');
    this.totalCreditLimitValue = page.locator('[data-testid="total-limit-value"], .kpi-widget:has-text("Total Credit Limit") .kpi-value');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"], .kpi-widget:has-text("Available Credit") .kpi-value');
    this.outstandingAmountValue = page.locator('[data-testid="outstanding-value"], .kpi-widget:has-text("Outstanding Amount") .kpi-value');
    
    // Error and Alert Locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.warningIndicator = page.locator('[data-testid="warning-indicator"], .warning-icon, .text-danger');
    this.alertMessage = page.locator('[data-testid="alert-message"], .alert-warning, .alert-info');
    this.partialDataNotification = page.locator('[data-testid="partial-data-notification"], .notification:has-text("unavailable")');
    
    // Navigation
    this.dashboardTab = page.locator('[href="#!/dashboard"], a:has-text("Dashboard")');
    this.cardsTab = page.locator('[href="#!/cards"], a:has-text("My Cards")');
    this.analyticsTab = page.locator('[href="#!/analytics"], a:has-text("Analytics")');
  }

  async navigate() {
    logger.info('Navigating to dashboard');
    await this.page.goto('/#!/dashboard');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await expect(this.monthlySpendWidget).toBeVisible({ timeout: 10000 });
    // Wait for data to be populated (not loading state)
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendLabel() {
    await expect(this.monthlySpendWidget).toBeVisible();
    const labelText = await this.monthlySpendWidget.locator('.kpi-label').textContent();
    return labelText.trim();
  }

  async getMonthlySpendAmount() {
    await expect(this.monthlySpendValue).toBeVisible();
    const amountText = await this.monthlySpendValue.textContent();
    return amountText.trim();
  }

  async getTotalCreditLimitAmount() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    const amountText = await this.totalCreditLimitValue.textContent();
    return amountText.trim();
  }

  async getAvailableCreditAmount() {
    await expect(this.availableCreditValue).toBeVisible();
    const amountText = await this.availableCreditValue.textContent();
    return amountText.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountValue).toBeVisible();
    const amountText = await this.outstandingAmountValue.textContent();
    return amountText.trim();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getWarningText() {
    await expect(this.warningIndicator).toBeVisible();
    return await this.warningIndicator.textContent();
  }

  async getAlertMessageText() {
    await expect(this.alertMessage).toBeVisible();
    return await this.alertMessage.textContent();
  }

  async getPartialDataNotificationText() {
    await expect(this.partialDataNotification).toBeVisible();
    return await this.partialDataNotification.textContent();
  }

  async verifyAllKPIsVisible() {
    logger.info('Verifying all KPI widgets are visible');
    await expect(this.monthlySpendWidget).toBeVisible();
    await expect(this.totalCreditLimitWidget).toBeVisible();
    await expect(this.availableCreditWidget).toBeVisible();
    await expect(this.outstandingAmountWidget).toBeVisible();
  }

  async navigateToCards() {
    logger.info('Navigating to My Cards');
    await this.cardsTab.click();
    await this.page.waitForURL(/.*\/cards/);
  }

  async navigateToAnalytics() {
    logger.info('Navigating to Analytics');
    await this.analyticsTab.click();
    await this.page.waitForURL(/.*\/analytics/);
  }
};
