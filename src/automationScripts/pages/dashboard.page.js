const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {

  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#loginButton');
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend") h3');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit") h3');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit") h3');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount") h3');
    this.errorMessage = page.locator('.alert-danger');
    this.noSpendingMessage = page.locator('text=No spending activity');
    this.noActiveCardsMessage = page.locator('text=No active cards');
    this.noCardsMessage = page.locator('text=No credit cards available');
    this.maintenanceMessage = page.locator('text=Service temporarily unavailable');
    this.staleDataWarning = page.locator('text=Data cannot be refreshed');
    this.authenticationError = page.locator('text=Authentication required');
    this.compatibilityWarning = page.locator('text=browser version is not fully supported');
  }

  async navigate() {
    logger.info('Navigating to application home page');
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/.*/);
  }

  async login(username, password) {
    logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    logger.info('Navigating to dashboard');
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createTransactions(amounts) {
    logger.info(`Creating transactions with amounts: ${amounts}`);
    for (const amount of amounts) {
      await this.page.evaluate((amt) => {
        window.localStorage.setItem('mockTransaction_' + Date.now(), JSON.stringify({ amount: amt, date: new Date() }));
      }, amount);
    }
  }

  async setupMultipleCards(cards) {
    logger.info(`Setting up ${cards.length} credit cards`);
    await this.page.evaluate((cardsData) => {
      window.localStorage.setItem('mockCards', JSON.stringify(cardsData));
    }, cards);
  }

  async setupInactiveCards() {
    logger.info('Setting up inactive cards');
    await this.page.evaluate(() => {
      window.localStorage.setItem('mockCards', JSON.stringify([{ status: 'CLOSED' }, { status: 'INACTIVE' }]));
    });
  }

  async simulateServiceFailure(serviceName) {
    logger.info(`Simulating service failure for: ${serviceName}`);
    await this.page.evaluate((service) => {
      window.localStorage.setItem('serviceFailure_' + service, 'true');
    }, serviceName);
  }

  async simulateMaintenanceMode() {
    logger.info('Simulating maintenance mode');
    await this.page.evaluate(() => {
      window.localStorage.setItem('maintenanceMode', 'true');
    });
  }

  async simulateUnsupportedBrowser() {
    logger.info('Simulating unsupported browser');
    await this.page.evaluate(() => {
      window.localStorage.setItem('unsupportedBrowser', 'true');
    });
  }

  async getMonthlySpendKPI() {
    logger.info('Retrieving monthly spend KPI');
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getAllKPIs() {
    logger.info('Retrieving all KPIs');
    await expect(this.monthlySpendKPI).toBeVisible();
    const monthlySpend = await this.monthlySpendKPI.textContent();
    const totalCreditLimit = await this.totalCreditLimitKPI.textContent();
    const availableCredit = await this.availableCreditKPI.textContent();
    const outstandingAmount = await this.outstandingAmountKPI.textContent();
    return {
      monthlySpend: monthlySpend.replace('$', '').trim(),
      totalCreditLimit: totalCreditLimit.replace('$', '').trim(),
      availableCredit: availableCredit.replace('$', '').trim(),
      outstandingAmount: outstandingAmount.replace('$', '').trim()
    };
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getNoSpendingMessage() {
    logger.info('Retrieving no spending message');
    await expect(this.noSpendingMessage).toBeVisible();
    return await this.noSpendingMessage.textContent();
  }

  async getNoActiveCardsMessage() {
    logger.info('Retrieving no active cards message');
    await expect(this.noActiveCardsMessage).toBeVisible();
    return await this.noActiveCardsMessage.textContent();
  }

  async getNoCardsMessage() {
    logger.info('Retrieving no cards message');
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getMaintenanceMessage() {
    logger.info('Retrieving maintenance message');
    await expect(this.maintenanceMessage).toBeVisible();
    return await this.maintenanceMessage.textContent();
  }

  async getStaleDataWarning() {
    logger.info('Retrieving stale data warning');
    await expect(this.staleDataWarning).toBeVisible();
    return await this.staleDataWarning.textContent();
  }

  async getAuthenticationError() {
    logger.info('Retrieving authentication error');
    await expect(this.authenticationError).toBeVisible();
    return await this.authenticationError.textContent();
  }

  async getCompatibilityWarning() {
    logger.info('Retrieving compatibility warning');
    await expect(this.compatibilityWarning).toBeVisible();
    return await this.compatibilityWarning.textContent();
  }

  async verifyResponsiveLayout(deviceType) {
    logger.info(`Verifying responsive layout for: ${deviceType}`);
    const isVisible = await this.monthlySpendKPI.isVisible();
    return isVisible;
  }

};
