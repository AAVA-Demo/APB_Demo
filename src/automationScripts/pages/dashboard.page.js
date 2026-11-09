const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated-timestamp"]');
    
    // Message and Button Locators
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.addCardButton = page.locator('[data-testid="add-card-button"]');
    this.errorBanner = page.locator('[data-testid="error-banner"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    
    // Warning and Alert Locators
    this.stalenessWarning = page.locator('[data-testid="staleness-warning"]');
    this.overLimitWarning = page.locator('[data-testid="over-limit-warning"]');
    this.overLimitAmount = page.locator('[data-testid="over-limit-amount"]');
    this.creditUtilization = page.locator('[data-testid="credit-utilization"]');
    this.refreshNotification = page.locator('[data-testid="refresh-notification"]');
    
    // Dashboard Container
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    logger.info('Navigated to dashboard');
  }

  async navigateWithUser(userId) {
    await this.page.goto(`/dashboard?userId=${userId}`);
    logger.info(`Navigated to dashboard with user: ${userId}`);
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard container loaded');
  }

  async waitForAllKPIsToLoad() {
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 5000 });
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    logger.info('All KPI widgets loaded');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.locator('.value').textContent();
    return value.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.locator('.value').textContent();
    return value.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.locator('.value').textContent();
    return value.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.locator('.value').textContent();
    return value.trim();
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await this.lastUpdatedTimestamp.textContent();
    return timestamp.trim();
  }

  async verifyAvailableCreditCalculation() {
    const creditLimit = parseFloat((await this.getTotalCreditLimitValue()).replace(/[$,]/g, ''));
    const outstanding = parseFloat((await this.getOutstandingAmountValue()).replace(/[$,]/g, ''));
    const available = parseFloat((await this.getAvailableCreditValue()).replace(/[$,]/g, ''));
    return Math.abs((creditLimit - outstanding) - available) < 0.01;
  }

  async areAllKPIsVisible() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      if (!(await kpi.isVisible())) return false;
    }
    return true;
  }

  async hasLoadingIndicators() {
    return await this.loadingIndicator.isVisible();
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async areAllKPIsZeroOrNA() {
    const values = [
      await this.getMonthlySpendValue(),
      await this.getTotalCreditLimitValue(),
      await this.getAvailableCreditValue(),
      await this.getOutstandingAmountValue()
    ];
    return values.every(val => val === '$0.00' || val === 'N/A');
  }

  async isAddCardButtonVisible() {
    return await this.addCardButton.isVisible();
  }

  async isDashboardStable() {
    await this.page.waitForTimeout(1000);
    return await this.dashboardContainer.isVisible();
  }

  async mockBackendServiceFailure() {
    await this.page.route('**/api/dashboard/kpis', route => route.abort());
    logger.info('Backend service failure mocked');
  }

  async waitForErrorOrDashboard() {
    await this.page.waitForSelector('[data-testid="error-banner"], [data-testid="dashboard-container"]', { timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorBanner).toBeVisible();
    return await this.errorBanner.textContent();
  }

  async areAllKPIsNA() {
    const values = [
      await this.getMonthlySpendValue(),
      await this.getTotalCreditLimitValue(),
      await this.getAvailableCreditValue(),
      await this.getOutstandingAmountValue()
    ];
    return values.every(val => val === 'N/A' || val === '--');
  }

  async isPageVisible() {
    return await this.dashboardContainer.isVisible();
  }

  async isRetryButtonVisible() {
    return await this.retryButton.isVisible();
  }

  async clickRetryButton() {
    await expect(this.retryButton).toBeEnabled();
    await this.retryButton.click();
    logger.info('Retry button clicked');
  }

  async hasIncorrectKPIValues() {
    const values = [
      await this.getMonthlySpendValue(),
      await this.getTotalCreditLimitValue(),
      await this.getAvailableCreditValue(),
      await this.getOutstandingAmountValue()
    ];
    // Check if any value contains invalid patterns
    return values.some(val => val.includes('undefined') || val.includes('null') || val.includes('NaN'));
  }

  async simulateTransaction(amount, cardNumber) {
    await this.page.evaluate(({ amt, card }) => {
      window.simulateTransaction = { amount: amt, card: card };
    }, { amt: amount, card: cardNumber });
    logger.info(`Transaction simulated: $${amount} on ${cardNumber}`);
  }

  async refreshDashboard() {
    await this.page.reload();
    await this.waitForDashboardLoad();
    logger.info('Dashboard refreshed');
  }

  async simulateBackgroundTransaction(amount, cardNumber) {
    await this.page.evaluate(({ amt, card }) => {
      window.backgroundTransaction = { amount: amt, card: card };
    }, { amt: amount, card: cardNumber });
    logger.info(`Background transaction simulated: $${amount}`);
  }

  async waitForAutoRefresh(interval) {
    // Wait for auto-refresh interval (5 minutes = 300000ms)
    // For testing purposes, we wait for a shorter time
    await this.page.waitForTimeout(Math.min(interval, 5000));
    logger.info('Waited for auto-refresh');
  }

  async hasRefreshNotification() {
    return await this.refreshNotification.isVisible();
  }

  async mockTransactionServiceFailure() {
    await this.page.route('**/api/transactions/**', route => route.abort());
    logger.info('Transaction service failure mocked');
  }

  async getStalenessWarning() {
    await expect(this.stalenessWarning).toBeVisible();
    return await this.stalenessWarning.textContent();
  }

  async isTimestampMarkedStale() {
    const timestampClass = await this.lastUpdatedTimestamp.getAttribute('class');
    return timestampClass.includes('stale') || timestampClass.includes('warning');
  }

  async getOverLimitWarning() {
    await expect(this.overLimitWarning).toBeVisible();
    return await this.overLimitWarning.textContent();
  }

  async getOverLimitAmount() {
    await expect(this.overLimitAmount).toBeVisible();
    return await this.overLimitAmount.textContent();
  }

  async getCreditUtilization() {
    await expect(this.creditUtilization).toBeVisible();
    return await this.creditUtilization.textContent();
  }

  async hasAvailableCreditAlert() {
    const kpiClass = await this.availableCreditKPI.getAttribute('class');
    return kpiClass.includes('alert') || kpiClass.includes('danger');
  }
};