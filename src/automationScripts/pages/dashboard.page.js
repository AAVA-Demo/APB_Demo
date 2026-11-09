const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    this.warningBanner = page.locator('[data-testid="warning-banner"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.noSpendingMessage = page.locator('[data-testid="no-spending-message"]');
    
    this.refreshButton = page.locator('[data-testid="refresh-dashboard"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 10000 });
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    return text.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return text.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return text.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    return text.trim();
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForKPIsToLoad() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async verifyAllKPIsVisible() {
    logger.info('Verifying all KPIs are visible');
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    return true;
  }
};
