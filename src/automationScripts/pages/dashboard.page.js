const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    
    // Credit Card Tiles
    this.creditCardTiles = page.locator('.credit-card-tile, [data-testid="credit-card-tile"]');
    this.creditUtilizationIndicator = page.locator('.utilization-bar, [data-testid="utilization-indicator"]');
    
    // Messages and States
    this.errorMessage = page.locator('.alert-danger, .error-message, [role="alert"][class*="error"]');
    this.warningMessage = page.locator('.alert-warning, .warning-message, [role="alert"][class*="warning"]');
    this.emptyStateMessage = page.locator('.empty-state, .no-data-message, .alert-info:has-text("no credit card")');
    this.loadingSpinner = page.locator('.loading-spinner, .spinner, [data-testid="loading"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard.demo.com/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async waitForWarningMessage() {
    await expect(this.warningMessage).toBeVisible({ timeout: 5000 });
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return text.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return text.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return text.trim();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return text.trim();
  }

  async getKPICardsCount() {
    const kpiCards = this.page.locator('.kpi-card, [data-testid="kpi-card"]');
    return await kpiCards.count();
  }

  async getCreditCardTilesCount() {
    return await this.creditCardTiles.count();
  }

  async getCreditUtilization() {
    const utilizationText = await this.creditUtilizationIndicator.first().textContent();
    const match = utilizationText.match(/([0-9.]+)%/);
    return match ? match[1] : '0';
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }
};