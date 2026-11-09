const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.dashboardTitle = page.locator('h1, h2').filter({ hasText: /Dashboard|Financial Dashboard/ });
    this.dashboardContainer = page.locator('.dashboard-container, #dashboard');
    this.kpiWidgets = page.locator('.kpi-widget, .kpi-card');
    
    this.monthlySpendKPI = page.locator('[data-kpi="monthly-spend"], .monthly-spend-kpi');
    this.totalCreditLimitKPI = page.locator('[data-kpi="total-credit-limit"], .total-credit-limit-kpi');
    this.availableCreditKPI = page.locator('[data-kpi="available-credit"], .available-credit-kpi');
    this.outstandingAmountKPI = page.locator('[data-kpi="outstanding-amount"], .outstanding-amount-kpi');
    
    this.refreshButton = page.locator('button').filter({ hasText: /Refresh|Reload/ });
    this.overLimitWarning = page.locator('.warning, .alert-warning, [data-warning="over-limit"]');
    this.loadingIndicator = page.locator('.loading, .spinner, [data-loading]');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.kpiWidgets.first()).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard loaded successfully');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value, .value, [data-value]').textContent();
    return text.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.locator('.kpi-value, .value, [data-value]').textContent();
    return text.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value, .value, [data-value]').textContent();
    return text.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.locator('.kpi-value, .value, [data-value]').textContent();
    return text.trim();
  }

  async verifyResponsiveLayout(deviceType) {
    await expect(this.dashboardContainer).toBeVisible();
    const boundingBox = await this.dashboardContainer.boundingBox();
    
    if (deviceType === 'tablet') {
      return boundingBox.width <= 768;
    } else if (deviceType === 'mobile') {
      return boundingBox.width <= 375;
    }
    return true;
  }

  async clickRefreshButton() {
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
    logger.info('Refresh button clicked');
  }

  async waitForKPIUpdate() {
    await this.page.waitForResponse(response => 
      response.url().includes('/api/') && response.status() === 200
    );
    await this.page.waitForLoadState('networkidle');
    logger.info('KPI widgets updated');
  }

  async simulateNewTransaction(amount, category) {
    await this.page.evaluate(({ amt, cat }) => {
      window.sessionStorage.setItem('newTransaction', JSON.stringify({ amount: amt, category: cat }));
    }, { amt: amount, cat: category });
    logger.info(`Simulated transaction: $${amount} in ${category}`);
  }

  async simulatePayment(amount, cardName) {
    await this.page.evaluate(({ amt, card }) => {
      window.sessionStorage.setItem('payment', JSON.stringify({ amount: amt, card: card }));
    }, { amt: amount, card: cardName });
    logger.info(`Simulated payment: $${amount} on ${cardName}`);
  }

  async getWarningMessage() {
    await expect(this.overLimitWarning).toBeVisible();
    return await this.overLimitWarning.textContent();
  }
};