const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendWidget = page.locator('[data-testid="monthly-spend-widget"]');
    this.totalCreditLimitWidget = page.locator('[data-testid="total-credit-limit-widget"]');
    this.availableCreditWidget = page.locator('[data-testid="available-credit-widget"]');
    this.outstandingAmountWidget = page.locator('[data-testid="outstanding-amount-widget"]');
    this.creditUtilizationBar = page.locator('[data-testid="credit-utilization-bar"]');
    this.refreshButton = page.locator('button[data-testid="refresh-dashboard"]');
    this.retryButton = page.locator('button[data-testid="retry-button"]');
    this.errorMessage = page.locator('.error-message');
    this.warningMessage = page.locator('.warning-message');
    this.staleDataIndicator = page.locator('[data-testid="stale-data-indicator"]');
    this.dashboardContainer = page.locator('.dashboard-container');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendWidget).toBeVisible();
    const text = await this.monthlySpendWidget.locator('.value').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitWidget).toBeVisible();
    const text = await this.totalCreditLimitWidget.locator('.value').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getAvailableCredit() {
    await expect(this.availableCreditWidget).toBeVisible();
    const text = await this.availableCreditWidget.locator('.value').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountWidget).toBeVisible();
    const text = await this.outstandingAmountWidget.locator('.value').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationBar).toBeVisible();
    const text = await this.creditUtilizationBar.locator('.percentage').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async refreshDashboard() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickRetryButton() {
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getWarningMessage() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async getStaleDataIndicator() {
    return this.staleDataIndicator;
  }
};