const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators for KPI elements
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // Locators for messages
    this.infoMessage = page.locator('.info-message, .alert-info');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.warningMessage = page.locator('.warning-message, .alert-warning');
    
    // Locators for dashboard elements
    this.dashboardContainer = page.locator('.dashboard-container, #dashboard');
    this.loadingIndicator = page.locator('.loading-spinner, .loading-indicator');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/dashboard');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.dashboardContainer.waitFor({ state: 'visible', timeout: 5000 });
    // Wait for loading indicator to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      logger.info('No loading indicator found or already hidden');
    });
  }

  async getMonthlySpendKPI() {
    logger.info('Getting monthly spend KPI');
    await expect(this.monthlySpendKPI).toBeVisible();
    return this.monthlySpendKPI;
  }

  async getTotalCreditLimitKPI() {
    logger.info('Getting total credit limit KPI');
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return this.totalCreditLimitKPI;
  }

  async getAvailableCreditKPI() {
    logger.info('Getting available credit KPI');
    await expect(this.availableCreditKPI).toBeVisible();
    return this.availableCreditKPI;
  }

  async getOutstandingAmountKPI() {
    logger.info('Getting outstanding amount KPI');
    await expect(this.outstandingAmountKPI).toBeVisible();
    return this.outstandingAmountKPI;
  }

  async getAllKPIValues() {
    logger.info('Getting all KPI values');
    const monthlySpend = await this.monthlySpendKPI.textContent();
    const totalCreditLimit = await this.totalCreditLimitKPI.textContent();
    const availableCredit = await this.availableCreditKPI.textContent();
    const outstandingAmount = await this.outstandingAmountKPI.textContent();
    
    return {
      monthlySpend: monthlySpend.trim(),
      totalCreditLimit: totalCreditLimit.trim(),
      availableCredit: availableCredit.trim(),
      outstandingAmount: outstandingAmount.trim()
    };
  }

  async getInfoMessage() {
    logger.info('Getting info message');
    await expect(this.infoMessage).toBeVisible();
    return this.infoMessage;
  }

  async getErrorMessage() {
    logger.info('Getting error message');
    await expect(this.errorMessage).toBeVisible();
    return this.errorMessage;
  }

  async getWarningMessage() {
    logger.info('Getting warning message');
    await expect(this.warningMessage).toBeVisible();
    return this.warningMessage;
  }

  async verifyResponsiveLayout() {
    logger.info('Verifying responsive layout');
    const viewport = this.page.viewportSize();
    const container = await this.dashboardContainer.boundingBox();
    
    // Verify container adapts to viewport
    if (container) {
      const isResponsive = container.width <= viewport.width;
      logger.info(`Layout is ${isResponsive ? 'responsive' : 'not responsive'}`);
      return isResponsive;
    }
    return false;
  }

  async setupTransactions(amounts) {
    logger.info(`Setting up transactions with amounts: ${amounts}`);
    // Mock API call to setup transactions
    await this.page.evaluate((amounts) => {
      window.mockTransactions = amounts.map((amount, index) => ({
        id: `txn-${index}`,
        amount: amount,
        date: new Date().toISOString()
      }));
    }, amounts);
  }

  async setupCreditCards(cards) {
    logger.info(`Setting up credit cards: ${JSON.stringify(cards)}`);
    // Mock API call to setup credit cards
    await this.page.evaluate((cards) => {
      window.mockCreditCards = cards.map((card, index) => ({
        id: `card-${index}`,
        ...card
      }));
    }, cards);
  }
};