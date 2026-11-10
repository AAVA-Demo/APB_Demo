const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .kpi-monthly-spend');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .kpi-total-limit');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .kpi-available-credit');
    this.totalOutstandingKPI = page.locator('[data-testid="total-outstanding"], .kpi-outstanding');
    this.errorNotification = page.locator('[data-testid="error-notification"], .error-banner');
    this.warningNotification = page.locator('[data-testid="warning-notification"], .warning-banner');
    this.navigationLinks = page.locator('nav a');
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry")');
    this.cardOverview = page.locator('[data-testid="card-overview"], .card-overview');
    this.cardOverviewRows = page.locator('[data-testid="card-row"], .card-overview-row');
    this.notificationContainer = page.locator('[data-testid="notifications"], .notification-container');
  }

  async navigate() {
    logger.info('Navigating to Dashboard page');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.monthlySpendKPI.waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForAuthenticationComplete() {
    logger.info('Waiting for authentication to complete');
    await this.page.waitForSelector('[data-testid="authenticated"], .user-authenticated', { timeout: 5000 }).catch(() => {
      logger.warn('Authentication indicator not found, proceeding');
    });
  }

  async getMonthlySpend() {
    logger.info('Getting monthly spend value');
    const text = await this.monthlySpendKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalCreditLimit() {
    logger.info('Getting total credit limit');
    const text = await this.totalCreditLimitKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getAvailableCredit() {
    logger.info('Getting available credit');
    const text = await this.availableCreditKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalOutstanding() {
    logger.info('Getting total outstanding');
    const text = await this.totalOutstandingKPI.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getErrorNotification() {
    logger.info('Getting error notification message');
    await this.errorNotification.waitFor({ state: 'visible', timeout: 3000 });
    return await this.errorNotification.textContent();
  }

  async getWarningNotification() {
    logger.info('Getting warning notification message');
    await this.warningNotification.waitFor({ state: 'visible', timeout: 3000 });
    return await this.warningNotification.textContent();
  }

  async isNavigationActive() {
    logger.info('Checking if navigation is active');
    const count = await this.navigationLinks.count();
    if (count === 0) return false;
    
    const firstLink = this.navigationLinks.first();
    const isEnabled = await firstLink.isEnabled();
    const isVisible = await firstLink.isVisible();
    return isEnabled && isVisible;
  }

  async hasRetryButton() {
    logger.info('Checking for retry button');
    try {
      await this.retryButton.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async getVisibleCardCount() {
    logger.info('Getting visible card count');
    return await this.cardOverviewRows.count();
  }

  async verifyCurrencyFormatting() {
    logger.info('Verifying currency formatting');
    const monthlySpendText = await this.monthlySpendKPI.textContent();
    const hasDollarSign = monthlySpendText.includes('$');
    const hasComma = monthlySpendText.includes(',');
    return hasDollarSign && hasComma;
  }

  async hasNotifications() {
    logger.info('Checking for notifications');
    const count = await this.notificationContainer.count();
    return count > 0;
  }

  async getCardOverviewBalances() {
    logger.info('Getting card overview balances');
    const balances = [];
    const rows = await this.cardOverviewRows.all();
    
    for (const row of rows) {
      const balanceElement = row.locator('[data-testid="outstanding"], .outstanding-amount');
      const text = await balanceElement.textContent();
      const balance = parseFloat(text.replace(/[^0-9.]/g, ''));
      balances.push(balance);
    }
    
    return balances;
  }
};
