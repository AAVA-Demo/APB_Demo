const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {

  constructor(page) {
    this.page = page;
    
    // Login page locators
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    
    // Dashboard KPI locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"], .kpi-card:has-text("Monthly Spend") .kpi-value, div:has-text("Monthly Spend") + div').first();
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"], .kpi-card:has-text("Total Credit Limit") .kpi-value, div:has-text("Total Credit Limit") + div').first();
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"], .kpi-card:has-text("Available Credit") .kpi-value, div:has-text("Available Credit") + div').first();
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"], .kpi-card:has-text("Outstanding Amount") .kpi-value, div:has-text("Outstanding") + div').first();
    
    // Dashboard elements
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"], .dashboard, main').first();
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"], .loading, .spinner, div:has-text("Loading")').first();
    this.errorMessage = page.locator('[data-testid="error-message"], .error, .alert-danger').first();
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], div:has-text("No credit cards registered")').first();
    
    // Card summary locators
    this.cardSummaries = page.locator('[data-testid="card-summary"], .card-summary, .credit-card-item');
    this.warningIndicator = page.locator('[data-testid="warning-indicator"], .warning, .alert-warning, [class*="warning"]').first();
    this.errorIndicator = page.locator('[data-testid="error-indicator"], .error-indicator, [class*="error"]').first();
  }

  async navigate() {
    logger.info('Navigating to Credit Card Dashboard');
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardToLoad() {
    logger.info('Waiting for dashboard to fully load');
    await expect(this.dashboardContainer).toBeVisible({ timeout: 15000 });
    // Wait for at least one KPI to be visible
    await expect(this.monthlySpendKPI.or(this.totalCreditLimitKPI)).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    logger.info('Retrieving Monthly Spend KPI value');
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 5000 });
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    logger.info('Retrieving Total Credit Limit KPI value');
    await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 5000 });
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditValue() {
    logger.info('Retrieving Available Credit KPI value');
    await expect(this.availableCreditKPI).toBeVisible({ timeout: 5000 });
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountValue() {
    logger.info('Retrieving Outstanding Amount KPI value');
    await expect(this.outstandingAmountKPI).toBeVisible({ timeout: 5000 });
    return await this.outstandingAmountKPI.textContent();
  }

  async getNoCardsMessage() {
    logger.info('Retrieving no cards message');
    await expect(this.noCardsMessage).toBeVisible({ timeout: 5000 });
    return await this.noCardsMessage.textContent();
  }

  async isLoadingIndicatorVisible() {
    logger.info('Checking if loading indicator is visible');
    try {
      await expect(this.loadingIndicator).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForDataOrTimeout(timeoutMs) {
    logger.info(`Waiting for data or timeout (${timeoutMs}ms)`);
    try {
      await this.page.waitForSelector('[data-testid="monthly-spend-kpi"], .kpi-card', { timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async getAllCardDetails() {
    logger.info('Retrieving all card details');
    await expect(this.cardSummaries.first()).toBeVisible({ timeout: 5000 });
    const cardCount = await this.cardSummaries.count();
    logger.info(`Found ${cardCount} credit cards`);
    
    const cards = [];
    for (let i = 0; i < cardCount; i++) {
      const card = this.cardSummaries.nth(i);
      const cardText = await card.textContent();
      
      // Extract credit limit and outstanding amount using regex
      const limitMatch = cardText.match(/(?:Limit|Credit Limit)[:\s]*\$?([0-9,]+\.?[0-9]*)/i);
      const outstandingMatch = cardText.match(/(?:Outstanding|Outstanding Amount)[:\s]*\$?([0-9,]+\.?[0-9]*)/i);
      
      const creditLimit = limitMatch ? parseFloat(limitMatch[1].replace(/,/g, '')) : null;
      const outstandingAmount = outstandingMatch ? parseFloat(outstandingMatch[1].replace(/,/g, '')) : null;
      
      cards.push({
        creditLimit,
        outstandingAmount,
        cardElement: card
      });
    }
    
    return cards;
  }

  async isWarningIndicatorVisible() {
    logger.info('Checking if warning indicator is visible');
    try {
      await expect(this.warningIndicator).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getWarningMessage() {
    logger.info('Retrieving warning message');
    await expect(this.warningIndicator).toBeVisible({ timeout: 5000 });
    return await this.warningIndicator.textContent();
  }

  async isErrorIndicatorVisible() {
    logger.info('Checking if error indicator is visible');
    try {
      await expect(this.errorIndicator).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorIndicatorMessage() {
    logger.info('Retrieving error indicator message');
    await expect(this.errorIndicator).toBeVisible({ timeout: 5000 });
    return await this.errorIndicator.textContent();
  }

};