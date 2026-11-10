const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.myCardsLink = page.locator('a[href*="cards"], text=My Cards');
    this.cardTiles = page.locator('.card-tile, [data-testid="card-tile"]');
    this.maskedCardNumbers = page.locator('.card-number, [data-testid="masked-number"]');
    this.creditLimitElements = page.locator('.credit-limit, [data-testid="credit-limit"]');
    this.outstandingElements = page.locator('.outstanding-balance, [data-testid="outstanding"]');
    this.availableCreditElements = page.locator('.available-credit, [data-testid="available-credit"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-message');
    this.errorMessage = page.locator('.error-message, [role="alert"]');
    this.authErrorMessage = page.locator('[data-testid="auth-error"], .auth-error');
    this.dashboardLink = page.locator('a[href*="dashboard"]');
    this.analyticsLink = page.locator('a[href*="analytics"]');
    this.cardDataContainer = page.locator('[data-testid="card-data"], .card-data-container');
  }

  async navigate() {
    logger.info('Navigating to Card Management page');
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAuthenticationComplete() {
    logger.info('Waiting for authentication to complete');
    await this.page.waitForSelector('[data-testid="authenticated"], .user-authenticated', { timeout: 5000 }).catch(() => {
      logger.warn('Authentication indicator not found, proceeding');
    });
  }

  async navigateToMyCards() {
    logger.info('Navigating to My Cards section');
    await this.myCardsLink.click();
  }

  async waitForPageLoad(timeout = 2000) {
    logger.info(`Waiting for page load with timeout: ${timeout}ms`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(timeout);
  }

  async getCardCount() {
    logger.info('Getting card count');
    return await this.cardTiles.count();
  }

  async getAllMaskedCardNumbers() {
    logger.info('Getting all masked card numbers');
    const numbers = await this.maskedCardNumbers.allTextContents();
    return numbers.map(num => num.trim());
  }

  async getAllCreditLimits() {
    logger.info('Getting all credit limits');
    const limits = await this.creditLimitElements.allTextContents();
    return limits.map(limit => parseFloat(limit.replace(/[^0-9.]/g, '')));
  }

  async getAllOutstandingBalances() {
    logger.info('Getting all outstanding balances');
    const balances = await this.outstandingElements.allTextContents();
    return balances.map(balance => parseFloat(balance.replace(/[^0-9.]/g, '')));
  }

  async getAllAvailableCredits() {
    logger.info('Getting all available credits');
    const credits = await this.availableCreditElements.allTextContents();
    return credits.map(credit => parseFloat(credit.replace(/[^0-9.]/g, '')));
  }

  async getEmptyStateMessage() {
    logger.info('Getting empty state message');
    await this.emptyStateMessage.waitFor({ state: 'visible', timeout: 3000 });
    return await this.emptyStateMessage.textContent();
  }

  async hasErrorMessages() {
    logger.info('Checking for error messages');
    const count = await this.errorMessage.count();
    return count > 0;
  }

  async isDashboardLinkActive() {
    logger.info('Checking if dashboard link is active');
    const isEnabled = await this.dashboardLink.isEnabled();
    const isVisible = await this.dashboardLink.isVisible();
    return isEnabled && isVisible;
  }

  async isAnalyticsLinkActive() {
    logger.info('Checking if analytics link is active');
    const isEnabled = await this.analyticsLink.isEnabled();
    const isVisible = await this.analyticsLink.isVisible();
    return isEnabled && isVisible;
  }

  async getAuthErrorMessage() {
    logger.info('Getting authentication error message');
    await this.authErrorMessage.waitFor({ state: 'visible', timeout: 3000 });
    return await this.authErrorMessage.textContent();
  }

  async isCardDataVisible() {
    logger.info('Checking if card data is visible');
    try {
      await this.cardDataContainer.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
};
