const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Navigation and authentication locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardLink = page.locator('a[href*="dashboard"]');
    
    // KPI section locators
    this.kpiSection = page.locator('.kpi-section, [data-testid="kpi-section"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .kpi-total-credit-limit');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .kpi-available-credit');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], .kpi-outstanding-amount');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .kpi-monthly-spend');
    
    // Card details section locators
    this.cardDetailsSection = page.locator('.card-details-section, [data-testid="card-details-section"]');
    this.cardDetailRow = page.locator('.card-detail-row, [data-testid="card-detail-row"]');
    
    // Error and message locators
    this.noCardsMessage = page.locator('.no-cards-message, [data-testid="no-cards-message"]');
    this.errorBanner = page.locator('.error-banner, [data-testid="error-banner"]');
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"]');
    this.cardErrorIndicator = page.locator('.card-error-indicator, [data-testid="card-error-indicator"]');
    
    // Refresh and sync locators
    this.refreshButton = page.locator('button[data-testid="refresh-dashboard"], button:has-text("Refresh")');
    this.retryButton = page.locator('button[data-testid="retry"], button:has-text("Retry")');
    this.lastUpdatedTimestamp = page.locator('.last-updated, [data-testid="last-updated"]');
    this.cardLoadingIndicator = page.locator('.card-loading, [data-testid="card-loading"]');
    
    // Transaction notification locators
    this.transactionNotification = page.locator('.transaction-notification, [data-testid="transaction-notification"]');
    this.dismissNotificationButton = page.locator('button[data-testid="dismiss-notification"], .notification-dismiss');
  }

  async navigate() {
    logger.info('Navigating to application home page');
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/.*/);
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    logger.info('Navigating to Dashboard page');
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiSection).toBeVisible();
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return text.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return text.trim();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    return text.trim();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    return text.trim();
  }

  async scrollToCardDetails() {
    logger.info('Scrolling to card details section');
    await this.cardDetailsSection.scrollIntoViewIfNeeded();
  }

  async getCardDetails(cardNumber) {
    logger.info(`Getting details for card: ${cardNumber}`);
    const cardRow = this.page.locator(`[data-card="${cardNumber}"], .card-detail-row:has-text("${cardNumber}")`);
    await expect(cardRow).toBeVisible();
    
    const creditLimit = await cardRow.locator('.credit-limit, [data-testid="credit-limit"]').textContent();
    const availableCredit = await cardRow.locator('.available-credit, [data-testid="available-credit"]').textContent();
    const outstanding = await cardRow.locator('.outstanding, [data-testid="outstanding"]').textContent();
    const monthlySpend = await cardRow.locator('.monthly-spend, [data-testid="monthly-spend"]').textContent();
    
    return {
      creditLimit: creditLimit.trim(),
      availableCredit: availableCredit.trim(),
      outstanding: outstanding.trim(),
      monthlySpend: monthlySpend.trim()
    };
  }

  async getCardErrorIndicator(cardNumber) {
    const cardRow = this.page.locator(`[data-card="${cardNumber}"], .card-detail-row:has-text("${cardNumber}")`);
    return cardRow.locator('.error-indicator, [data-testid="error-indicator"]');
  }

  async clickRetrySync(cardNumber) {
    logger.info(`Clicking retry sync for card: ${cardNumber}`);
    const cardRow = this.page.locator(`[data-card="${cardNumber}"], .card-detail-row:has-text("${cardNumber}")`);
    const retryBtn = cardRow.locator('button:has-text("Retry"), button[data-testid="retry-sync"]');
    await retryBtn.click();
  }

  async getCardLoadingIndicator(cardNumber) {
    const cardRow = this.page.locator(`[data-card="${cardNumber}"], .card-detail-row:has-text("${cardNumber}")`);
    return cardRow.locator('.loading-indicator, [data-testid="loading-indicator"]');
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getLastUpdatedTime() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const text = await this.lastUpdatedTimestamp.textContent();
    return text.trim();
  }

};