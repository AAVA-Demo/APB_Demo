const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardListContainer = page.locator('[data-testid="card-list"], .card-list');
    this.cardItems = page.locator('[data-testid="card-item"], .card-item');
    this.errorMessage = page.locator('[data-testid="error-message"], .alert-danger');
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry")');
    
    // Card Detail Locators
    this.cardDetailContainer = page.locator('[data-testid="card-detail"], .card-detail');
    this.creditLimitField = page.locator('[data-testid="credit-limit"], td:has-text("Credit Limit") + td');
    this.outstandingBalanceField = page.locator('[data-testid="outstanding-balance"], td:has-text("Outstanding Balance") + td');
    this.availableCreditField = page.locator('[data-testid="available-credit"], td:has-text("Available Credit") + td');
    this.monthlySpendingField = page.locator('[data-testid="monthly-spend"], td:has-text("Monthly Spend") + td');
    this.categoryBreakdownSection = page.locator('[data-testid="category-breakdown"], .category-breakdown');
    this.inactiveCardWarning = page.locator('[data-testid="inactive-warning"], .alert-warning:has-text("inactive")');
    this.cardStatusBadge = page.locator('[data-testid="card-status"], .label, .badge');
    this.backButton = page.locator('[data-testid="back-button"], button:has-text("Back")');
  }

  async navigate() {
    logger.info('Navigating to card management section');
    await this.page.click('[href="#/cards"], a:has-text("My Cards")');
    await this.page.waitForLoadState('networkidle');
    logger.info('Card management navigation completed');
  }

  async waitForCardListLoad() {
    logger.info('Waiting for card list to load');
    await expect(this.cardListContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Card list loaded successfully');
  }

  async waitForCardDetailLoad() {
    logger.info('Waiting for card detail to load');
    await expect(this.cardDetailContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Card detail loaded successfully');
  }

  async selectCard(lastFourDigits) {
    logger.info(`Selecting card ending in: ${lastFourDigits}`);
    const cardSelector = `[data-testid="card-item"]:has-text("${lastFourDigits}"), .card-item:has-text("${lastFourDigits}")`;
    await this.page.click(cardSelector);
    logger.info('Card selected');
  }

  async getCreditLimit() {
    await expect(this.creditLimitField).toBeVisible();
    const value = await this.creditLimitField.textContent();
    logger.info(`Credit Limit: ${value}`);
    return value.trim();
  }

  async getOutstandingBalance() {
    await expect(this.outstandingBalanceField).toBeVisible();
    const value = await this.outstandingBalanceField.textContent();
    logger.info(`Outstanding Balance: ${value}`);
    return value.trim();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditField).toBeVisible();
    const value = await this.availableCreditField.textContent();
    logger.info(`Available Credit: ${value}`);
    return value.trim();
  }

  async getMonthlySpending() {
    await expect(this.monthlySpendingField).toBeVisible();
    const value = await this.monthlySpendingField.textContent();
    logger.info(`Monthly Spending: ${value}`);
    return value.trim();
  }

  async getCategoryBreakdown() {
    logger.info('Getting category breakdown');
    await expect(this.categoryBreakdownSection).toBeVisible();
    const categories = {};
    const rows = await this.categoryBreakdownSection.locator('tr').all();
    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 2) {
        const category = await cells[0].textContent();
        const amount = await cells[1].textContent();
        categories[category.trim()] = amount.trim();
      }
    }
    return categories;
  }

  async getInactiveCardWarningText() {
    await expect(this.inactiveCardWarning).toBeVisible();
    const text = await this.inactiveCardWarning.textContent();
    logger.info(`Inactive card warning: ${text}`);
    return text.trim();
  }

  async getCardStatus() {
    await expect(this.cardStatusBadge).toBeVisible();
    const status = await this.cardStatusBadge.textContent();
    logger.info(`Card status: ${status}`);
    return status.trim();
  }

  async goBackToCardList() {
    logger.info('Navigating back to card list');
    await expect(this.backButton).toBeVisible();
    await this.backButton.click();
    logger.info('Back button clicked');
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    const text = await this.errorMessage.textContent();
    logger.info(`Error message: ${text}`);
    return text.trim();
  }

  async clickRetry() {
    logger.info('Clicking retry button');
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
    logger.info('Retry button clicked');
  }
};