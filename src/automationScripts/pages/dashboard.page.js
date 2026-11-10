const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.monthlySpendKPI = page.locator('.kpi-widget').filter({ hasText: 'Monthly Spend' });
    this.totalCreditLimitKPI = page.locator('.kpi-widget').filter({ hasText: 'Total Credit Limit' });
    this.availableCreditKPI = page.locator('.kpi-widget').filter({ hasText: 'Available Credit' });
    this.outstandingAmountKPI = page.locator('.kpi-widget').filter({ hasText: 'Outstanding Amount' });
    
    // KPI Value Locators
    this.monthlySpendValue = this.monthlySpendKPI.locator('.kpi-value');
    this.totalCreditLimitValue = this.totalCreditLimitKPI.locator('.kpi-value');
    this.availableCreditValue = this.availableCreditKPI.locator('.kpi-value');
    this.outstandingAmountValue = this.outstandingAmountKPI.locator('.kpi-value');
    
    // Loading and Error State Locators
    this.loadingSpinner = page.locator('.loading-spinner');
    this.errorMessage = page.locator('.error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    
    // Message Locators
    this.noCardsMessage = page.locator('text=No active credit cards found');
    this.noSpendingMessage = page.locator('text=No spending activity detected');
    
    // Warning Locators
    this.highUtilizationWarning = page.locator('.kpi-widget .warning-indicator, .alert-icon');
    this.warningTooltip = page.locator('.tooltip, [role="tooltip"]');
    
    // Card Summary Table
    this.cardSummaryTable = page.locator('table.table-striped, .panel-body table');
    
    // Navigation
    this.dashboardLink = page.locator('a[href*="dashboard"], nav a:has-text("Dashboard")');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Dashboard page');
  }

  async login(username, password) {
    // Check if already on dashboard or need to login
    const isLoginPage = await this.page.locator('input[type="text"], input[name="username"]').isVisible().catch(() => false);
    
    if (isLoginPage) {
      await this.page.fill('input[type="text"], input[name="username"]', username);
      await this.page.fill('input[type="password"], input[name="password"]', password);
      await this.page.click('button[type="submit"], button:has-text("Login")');
      await this.page.waitForLoadState('networkidle');
      logger.info(`Logged in with username: ${username}`);
    } else {
      logger.info('Already logged in or on dashboard');
    }
  }

  async waitForAllKPIsToLoad() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    logger.info('All KPI widgets loaded');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendValue).toBeVisible();
    const value = await this.monthlySpendValue.textContent();
    return value.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitValue).toBeVisible();
    const value = await this.totalCreditLimitValue.textContent();
    return value.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditValue).toBeVisible();
    const value = await this.availableCreditValue.textContent();
    return value.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountValue).toBeVisible();
    const value = await this.outstandingAmountValue.textContent();
    return value.trim();
  }

  async getCardSummaryTable() {
    await expect(this.cardSummaryTable).toBeVisible();
    const rows = await this.cardSummaryTable.locator('tbody tr').count();
    logger.info(`Card summary table has ${rows} rows`);
    return rows > 0;
  }
};
