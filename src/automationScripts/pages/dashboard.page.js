const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('a:has-text("Logout")');
    
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.totalOutstandingAmountKPI = page.locator('[data-testid="kpi-total-outstanding"]');
    this.totalAvailableCreditKPI = page.locator('[data-testid="kpi-total-available"]');
    this.totalMonthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    
    this.creditCardList = page.locator('[data-testid="credit-card-list"]');
    this.creditCardItems = page.locator('[data-testid="credit-card-item"]');
    
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    
    this.dashboardLoader = page.locator('[data-testid="dashboard-loader"]');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto(config.baseUrl + '/dashboard');
    await this.waitForDashboardLoad();
  }

  async login(username, password) {
    logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/dashboard');
    logger.info('Login successful');
  }

  async logout() {
    logger.info('Logging out user');
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.dashboardLoader).toBeHidden({ timeout: 5000 }).catch(() => {});
    logger.info('Dashboard loaded successfully');
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async getTotalOutstandingAmount() {
    await expect(this.totalOutstandingAmountKPI).toBeVisible();
    const text = await this.totalOutstandingAmountKPI.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async getTotalAvailableCredit() {
    await expect(this.totalAvailableCreditKPI).toBeVisible();
    const text = await this.totalAvailableCreditKPI.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async getTotalMonthlySpend() {
    await expect(this.totalMonthlySpendKPI).toBeVisible();
    const text = await this.totalMonthlySpendKPI.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async getWarningMessageText() {
    await expect(this.warningMessage).toBeVisible();
    return await this.warningMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getKPICardsCount() {
    const kpiCards = this.page.locator('[data-testid^="kpi-"]');
    return await kpiCards.count();
  }

  async getCreditCardCount() {
    return await this.creditCardItems.count();
  }

  async getCardName(index) {
    const card = this.creditCardItems.nth(index);
    const nameElement = card.locator('[data-testid="card-name"]');
    await expect(nameElement).toBeVisible();
    return await nameElement.textContent();
  }

  async getCardNumber(index) {
    const card = this.creditCardItems.nth(index);
    const numberElement = card.locator('[data-testid="card-number"]');
    await expect(numberElement).toBeVisible();
    return await numberElement.textContent();
  }

  async getCardCreditLimit(index) {
    const card = this.creditCardItems.nth(index);
    const limitElement = card.locator('[data-testid="card-credit-limit"]');
    await expect(limitElement).toBeVisible();
    const text = await limitElement.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async getCardOutstanding(index) {
    const card = this.creditCardItems.nth(index);
    const outstandingElement = card.locator('[data-testid="card-outstanding"]');
    await expect(outstandingElement).toBeVisible();
    const text = await outstandingElement.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async getCardAvailableCredit(index) {
    const card = this.creditCardItems.nth(index);
    const availableElement = card.locator('[data-testid="card-available"]');
    await expect(availableElement).toBeVisible();
    const text = await availableElement.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async getCardMonthlySpend(index) {
    const card = this.creditCardItems.nth(index);
    const spendElement = card.locator('[data-testid="card-monthly-spend"]');
    await expect(spendElement).toBeVisible();
    const text = await spendElement.textContent();
    return text.replace(/[^0-9,]/g, '');
  }

  async simulateIncompleteKPIData() {
    logger.info('Simulating incomplete KPI data scenario');
    await this.page.route('**/api/kpis/aggregate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          totalOutstandingAmount: 23000,
          totalMonthlySpend: 13700,
          totalCreditLimit: null,
          totalAvailableCredit: null
        })
      });
    });
  }

  async simulateServiceFailure() {
    logger.info('Simulating credit card data service failure');
    await this.page.route('**/api/cards', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
  }
};
