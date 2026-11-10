const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DashboardPage');
    
    this.monthlySpendKpi = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKpi = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKpi = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKpi = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.errorMessageContainer = page.locator('[data-testid="error-message"]');
    this.warningMessageContainer = page.locator('[data-testid="warning-message"]');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }
  
  async navigate() {
    this.logger.info('Navigating to dashboard');
    await this.page.goto('/dashboard');
  }
  
  async waitForDashboardLoad() {
    this.logger.info('Waiting for dashboard to load');
    await expect(this.loadingSpinner).toBeHidden({ timeout: 5000 });
    await expect(this.monthlySpendKpi).toBeVisible();
  }
  
  async getMonthlySpend() {
    await expect(this.monthlySpendKpi).toBeVisible();
    const text = await this.monthlySpendKpi.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKpi).toBeVisible();
    const text = await this.totalCreditLimitKpi.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getAvailableCredit() {
    await expect(this.availableCreditKpi).toBeVisible();
    const text = await this.availableCreditKpi.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getOutstandingAmount() {
    await expect(this.outstandingAmountKpi).toBeVisible();
    const text = await this.outstandingAmountKpi.textContent();
    return text.replace(/[^0-9.]/g, '');
  }
  
  async getLoadTime() {
    const startTime = Date.now();
    await this.waitForDashboardLoad();
    return Date.now() - startTime;
  }
  
  async getErrorMessage() {
    await expect(this.errorMessageContainer).toBeVisible();
    return await this.errorMessageContainer.textContent();
  }
  
  async isKpiDataVisible() {
    const isVisible = await this.monthlySpendKpi.isVisible();
    return isVisible;
  }
  
  async simulateTransaction(cardId, amount) {
    this.logger.info(`Simulating transaction: ${cardId} - ${amount}`);
    await this.page.evaluate(({ cardId, amount }) => {
      window.simulateTransaction(cardId, amount);
    }, { cardId, amount });
  }
  
  async waitForKpiUpdate(timeout) {
    this.logger.info(`Waiting for KPI update with timeout: ${timeout}ms`);
    await this.page.waitForTimeout(timeout);
  }
  
  async isResponsiveLayout() {
    const viewport = this.page.viewportSize();
    return viewport.width <= 768;
  }
  
  async getAllKpis() {
    return {
      monthlySpend: await this.getMonthlySpend(),
      totalCreditLimit: await this.getTotalCreditLimit(),
      availableCredit: await this.getAvailableCredit(),
      outstandingAmount: await this.getOutstandingAmount()
    };
  }
  
  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    return await this.lastUpdatedTimestamp.textContent();
  }
  
  async simulateDataSourceFailure() {
    this.logger.info('Simulating data source failure');
    await this.page.evaluate(() => {
      window.simulateDataSourceFailure();
    });
  }
  
  async getWarningMessage() {
    await expect(this.warningMessageContainer).toBeVisible();
    return await this.warningMessageContainer.textContent();
  }
  
  async simulateSimultaneousTransactions(transactions) {
    this.logger.info(`Simulating ${transactions.length} simultaneous transactions`);
    await this.page.evaluate((transactions) => {
      window.simulateSimultaneousTransactions(transactions);
    }, transactions);
  }
};
