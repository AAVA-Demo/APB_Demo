const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardContainer = page.locator('.dashboard-container');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.navigationMenu = page.locator('nav.navbar');
    this.kpiPlaceholder = page.locator('.kpi-placeholder, .kpi-loading');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"]');
    this.stalenessIndicator = page.locator('[data-testid="staleness-indicator"]');
    this.refreshButton = page.locator('button[data-testid="refresh-dashboard"]');
    this.logoutButton = page.locator('button[data-testid="logout"]');
  }

  async navigate() {
    logger.info('Navigating to dashboard');
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    logger.info('Logging out');
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const value = await this.monthlySpendKPI.textContent();
    return value.trim();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const value = await this.totalCreditLimitKPI.textContent();
    return value.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const value = await this.availableCreditKPI.textContent();
    return value.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const value = await this.outstandingAmountKPI.textContent();
    return value.trim();
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isPageStructureIntact() {
    const isNavVisible = await this.navigationMenu.isVisible();
    const isDashboardVisible = await this.dashboardContainer.isVisible();
    return isNavVisible && isDashboardVisible;
  }

  async hasKPIPlaceholders() {
    const count = await this.kpiPlaceholder.count();
    return count > 0;
  }

  async hasNullOrUndefinedValues() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const text = await kpi.textContent();
      if (text.includes('null') || text.includes('undefined') || text.includes('NaN')) {
        return true;
      }
    }
    return false;
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    if (await this.refreshButton.isVisible()) {
      await this.refreshButton.click();
    } else {
      await this.page.reload();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async simulateTransaction(amount, merchant) {
    logger.info(`Simulating transaction: $${amount} at ${merchant}`);
    await this.page.evaluate(({ amount, merchant }) => {
      window.localStorage.setItem('pendingTransaction', JSON.stringify({ amount, merchant, timestamp: Date.now() }));
    }, { amount, merchant });
  }

  async simulateTransactionOnCard(cardId, amount, merchant) {
    logger.info(`Simulating transaction on ${cardId}: $${amount} at ${merchant}`);
    await this.page.evaluate(({ cardId, amount, merchant }) => {
      const transactions = JSON.parse(window.localStorage.getItem('pendingTransactions') || '[]');
      transactions.push({ cardId, amount, merchant, timestamp: Date.now() });
      window.localStorage.setItem('pendingTransactions', JSON.stringify(transactions));
    }, { cardId, amount, merchant });
  }

  async captureKPIValues() {
    return {
      monthlySpend: await this.getMonthlySpend(),
      totalCreditLimit: await this.getTotalCreditLimit(),
      availableCredit: await this.getAvailableCredit(),
      outstandingAmount: await this.getOutstandingAmount()
    };
  }

  async getLastUpdatedTimestamp() {
    if (await this.lastUpdatedTimestamp.isVisible()) {
      return await this.lastUpdatedTimestamp.textContent();
    }
    return null;
  }

  async hasStalenessIndicator() {
    return await this.stalenessIndicator.isVisible();
  }

  async getStalenessMessage() {
    if (await this.stalenessIndicator.isVisible()) {
      return await this.stalenessIndicator.textContent();
    }
    return '';
  }

  async isDashboardFunctional() {
    const isNavClickable = await this.navigationMenu.isEnabled();
    const canInteract = await this.dashboardContainer.isVisible();
    return isNavClickable && canInteract;
  }

  async getCardAvailableCredit(cardId) {
    const cardLocator = this.page.locator(`[data-card-id="${cardId}"] [data-testid="available-credit"]`);
    await expect(cardLocator).toBeVisible();
    return await cardLocator.textContent();
  }

  async getCardOutstanding(cardId) {
    const cardLocator = this.page.locator(`[data-card-id="${cardId}"] [data-testid="outstanding-amount"]`);
    await expect(cardLocator).toBeVisible();
    return await cardLocator.textContent();
  }
};