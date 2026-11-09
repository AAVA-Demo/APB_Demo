const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Dashboard KPIs
    this.userProfileSection = page.locator('[data-testid="user-profile"]');
    this.kpiPanelsContainer = page.locator('[data-testid="kpi-panels-container"]');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    
    // Locators for error handling
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    this.timeoutMessage = page.locator('[data-testid="timeout-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.cachedDataMessage = page.locator('[data-testid="cached-data-message"]');
    this.viewCachedDataButton = page.locator('[data-testid="view-cached-data-button"]');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Locators for real-time tracking
    this.serviceErrorMessage = page.locator('[data-testid="service-error-message"]');
    this.cardAvailableCreditPrefix = '[data-testid="card-available-credit-';
    this.cardOutstandingPrefix = '[data-testid="card-outstanding-';
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async authenticateUser(username, password) {
    logger.info(`Authenticating user: ${username}`);
    await this.page.fill('[data-testid="username-input"]', username);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForKPIDataLoad() {
    logger.info('Waiting for KPI data to load');
    await expect(this.kpiPanelsContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async measurePageLoadTime() {
    const performanceMetrics = await this.page.evaluate(() => {
      const perfData = window.performance.timing;
      return perfData.loadEventEnd - perfData.navigationStart;
    });
    return performanceMetrics;
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async getTotalCreditLimitNumeric() {
    const text = await this.getTotalCreditLimit();
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  async verifyResponsiveLayout() {
    const panelsVisible = await this.kpiPanelsContainer.isVisible();
    const boundingBox = await this.kpiPanelsContainer.boundingBox();
    return panelsVisible && boundingBox !== null && boundingBox.width > 0;
  }

  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async checkForSystemErrors() {
    const errorElements = await this.page.locator('[data-testid="system-error"]').count();
    return errorElements > 0;
  }

  async simulateServiceDelay(delayMs) {
    logger.info(`Simulating service delay of ${delayMs}ms`);
    await this.page.route('**/api/dashboard/kpis', async route => {
      await this.page.waitForTimeout(delayMs);
      await route.continue();
    });
  }

  async getTimeoutMessageText() {
    await expect(this.timeoutMessage).toBeVisible();
    return await this.timeoutMessage.textContent();
  }

  async clickViewCachedDataButton() {
    await expect(this.viewCachedDataButton).toBeVisible();
    await this.viewCachedDataButton.click();
  }

  async getCachedDataMessageText() {
    await expect(this.cachedDataMessage).toBeVisible();
    return await this.cachedDataMessage.textContent();
  }

  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
  }

  async getCardAvailableCredit(cardId) {
    const locator = this.page.locator(`${this.cardAvailableCreditPrefix}${cardId}"]`);
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }

  async getCardOutstanding(cardId) {
    const locator = this.page.locator(`${this.cardOutstandingPrefix}${cardId}"]`);
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }

  async simulateTransaction(cardId, amount) {
    logger.info(`Simulating transaction: ${amount} on ${cardId}`);
    await this.page.evaluate(({ cardId, amount }) => {
      window.localStorage.setItem('simulatedTransaction', JSON.stringify({ cardId, amount, timestamp: Date.now() }));
    }, { cardId, amount });
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async simulateServiceUnavailability() {
    logger.info('Simulating service unavailability (503)');
    await this.page.route('**/api/dashboard/kpis', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });
  }

  async getServiceErrorMessageText() {
    await expect(this.serviceErrorMessage).toBeVisible();
    return await this.serviceErrorMessage.textContent();
  }

  async checkForUnhandledExceptions() {
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    return consoleErrors.length > 0;
  }

  async checkForManualRefreshAction() {
    const refreshLog = await this.page.evaluate(() => {
      return window.localStorage.getItem('manualRefreshTriggered');
    });
    return refreshLog !== null;
  }
};