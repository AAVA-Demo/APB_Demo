const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const config = require('../../config/environment');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    // KPI Widgets
    this.monthlySpendWidget = page.locator('[data-testid="monthly-spend-widget"], .kpi-widget:has-text("Monthly Spend")');
    this.totalCreditLimitWidget = page.locator('[data-testid="total-credit-limit-widget"], .kpi-widget:has-text("Total Credit Limit")');
    this.availableCreditWidget = page.locator('[data-testid="available-credit-widget"], .kpi-widget:has-text("Available Credit")');
    this.outstandingAmountWidget = page.locator('[data-testid="outstanding-amount-widget"], .kpi-widget:has-text("Outstanding Amount")');
    
    // KPI Values
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"], .kpi-widget:has-text("Monthly Spend") .value');
    this.totalCreditLimitValue = page.locator('[data-testid="total-credit-limit-value"], .kpi-widget:has-text("Total Credit Limit") .value');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"], .kpi-widget:has-text("Available Credit") .value');
    this.outstandingAmountValue = page.locator('[data-testid="outstanding-amount-value"], .kpi-widget:has-text("Outstanding Amount") .value');
    
    // Card Details
    this.cardDetailsSection = page.locator('[data-testid="card-details-section"], .card-overview');
    this.cardItems = page.locator('[data-testid="card-item"], .card-overview');
    
    // Empty State
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"], .empty-state');
    
    // Warnings and Indicators
    this.warningIndicator = page.locator('[data-testid="warning-indicator"], .warning-icon, .alert-warning');
    this.overLimitWarning = page.locator('[data-testid="over-limit-warning"], .over-limit-warning');
    this.partialDataIndicator = page.locator('[data-testid="partial-data-indicator"], .partial-data-warning');
    
    // Actions
    this.refreshButton = page.locator('[data-testid="refresh-button"], button:has-text("Refresh")');
    this.transactionsLink = page.locator('a[href*="transactions"], nav a:has-text("Transactions")');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto(config.baseUrl + '/dashboard');
    await expect(this.monthlySpendWidget).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard page loaded successfully');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    const text = await this.monthlySpendValue.textContent();
    return text.replace(/[^0-9.-]/g, '');
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    const text = await this.totalCreditLimitValue.textContent();
    return text.replace(/[^0-9.-]/g, '');
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    const text = await this.availableCreditValue.textContent();
    return text.replace(/[^0-9.-]/g, '');
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    const text = await this.outstandingAmountValue.textContent();
    return text.replace(/[^0-9.-]/g, '');
  }

  async getCardCount() {
    await expect(this.cardDetailsSection).toBeVisible();
    return await this.cardItems.count();
  }

  async getCardAvailableCredit(cardId) {
    const cardLocator = this.page.locator(`[data-card-id="${cardId}"], .card-overview:has-text("${cardId}")`);
    await expect(cardLocator).toBeVisible();
    const availableCreditLocator = cardLocator.locator('[data-testid="available-credit"], .available-credit');
    const text = await availableCreditLocator.textContent();
    return text.replace(/[^0-9.-]/g, '');
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getWarningText() {
    await expect(this.warningIndicator).toBeVisible();
    return await this.warningIndicator.textContent();
  }

  async getOverLimitWarningText() {
    await expect(this.overLimitWarning).toBeVisible();
    return await this.overLimitWarning.textContent();
  }

  async getCachedDataIndicator() {
    const cachedIndicator = this.page.locator('[data-testid="cached-data-indicator"], .cached-data-timestamp');
    const isVisible = await cachedIndicator.isVisible().catch(() => false);
    if (isVisible) {
      return await cachedIndicator.textContent();
    }
    return null;
  }

  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard refreshed');
  }

  async navigateToTransactions() {
    await expect(this.transactionsLink).toBeVisible();
    await this.transactionsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to transactions page');
  }
};