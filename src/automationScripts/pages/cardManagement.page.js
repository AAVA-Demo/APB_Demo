const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Locators for card listing
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardPanels = page.locator('[data-testid="card-panel"]');
    this.cardLimitWarning = page.locator('[data-testid="card-limit-warning"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.addCardButton = page.locator('[data-testid="add-card-button"]');
    
    // Locators for card details
    this.cardDetailsContainer = page.locator('[data-testid="card-details-container"]');
    this.cardLabelElement = page.locator('[data-testid="card-label"]');
    this.cardNumberElement = page.locator('[data-testid="card-number"]');
    this.issuerElement = page.locator('[data-testid="card-issuer"]');
    this.creditLimitElement = page.locator('[data-testid="card-credit-limit"]');
    this.availableCreditElement = page.locator('[data-testid="card-available-credit"]');
    this.outstandingElement = page.locator('[data-testid="card-outstanding"]');
    this.monthlySpendElement = page.locator('[data-testid="card-monthly-spend"]');
    this.categoryBreakdownContainer = page.locator('[data-testid="category-breakdown"]');
    
    // Locators for error handling
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.authorizationError = page.locator('[data-testid="authorization-error"]');
    this.backToListingButton = page.locator('[data-testid="back-to-listing-button"]');
  }

  async navigate() {
    logger.info('Navigating to card management page');
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async authenticateUser(username, password) {
    logger.info(`Authenticating user: ${username}`);
    await this.page.fill('[data-testid="username-input"]', username);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardListLoad() {
    logger.info('Waiting for card list to load');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async getCardCount() {
    const count = await this.cardPanels.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async getAllMaskedCardNumbers() {
    const cards = await this.cardPanels.all();
    const maskedNumbers = [];
    for (const card of cards) {
      const numberElement = card.locator('[data-testid="card-number-masked"]');
      const number = await numberElement.textContent();
      maskedNumbers.push(number);
    }
    return maskedNumbers;
  }

  async getAllCardLabels() {
    const cards = await this.cardPanels.all();
    const labels = [];
    for (const card of cards) {
      const labelElement = card.locator('[data-testid="card-label"]');
      const label = await labelElement.textContent();
      labels.push(label);
    }
    return labels;
  }

  async getAllIssuers() {
    const cards = await this.cardPanels.all();
    const issuers = [];
    for (const card of cards) {
      const issuerElement = card.locator('[data-testid="card-issuer"]');
      const issuer = await issuerElement.textContent();
      issuers.push(issuer);
    }
    return issuers;
  }

  async getAllCreditLimits() {
    const cards = await this.cardPanels.all();
    const limits = [];
    for (const card of cards) {
      const limitElement = card.locator('[data-testid="card-credit-limit"]');
      const limit = await limitElement.textContent();
      limits.push(limit);
    }
    return limits;
  }

  async getAllAvailableCredits() {
    const cards = await this.cardPanels.all();
    const credits = [];
    for (const card of cards) {
      const creditElement = card.locator('[data-testid="card-available-credit"]');
      const credit = await creditElement.textContent();
      credits.push(credit);
    }
    return credits;
  }

  async getAllOutstandingAmounts() {
    const cards = await this.cardPanels.all();
    const amounts = [];
    for (const card of cards) {
      const amountElement = card.locator('[data-testid="card-outstanding"]');
      const amount = await amountElement.textContent();
      amounts.push(amount);
    }
    return amounts;
  }

  async checkForSensitiveDataExposure() {
    const cvvElements = await this.page.locator('[data-testid*="cvv"]').count();
    const fullCardNumbers = await this.page.locator('[data-testid*="full-card-number"]').count();
    return cvvElements > 0 || fullCardNumbers > 0;
  }

  async getCardLimitWarningText() {
    await expect(this.cardLimitWarning).toBeVisible();
    return await this.cardLimitWarning.textContent();
  }

  async isCardVisible(cardId) {
    const cardLocator = this.page.locator(`[data-testid="card-panel-${cardId}"]`);
    return await cardLocator.isVisible();
  }

  async checkForSystemErrors() {
    const errorElements = await this.page.locator('[data-testid="system-error"]').count();
    return errorElements > 0;
  }

  async verifyAllCardsHaveCompleteDetails() {
    const cards = await this.cardPanels.all();
    for (const card of cards) {
      const hasNumber = await card.locator('[data-testid="card-number-masked"]').isVisible();
      const hasLabel = await card.locator('[data-testid="card-label"]').isVisible();
      const hasLimit = await card.locator('[data-testid="card-credit-limit"]').isVisible();
      if (!hasNumber || !hasLabel || !hasLimit) {
        return false;
      }
    }
    return true;
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getAddCardButtonText() {
    await expect(this.addCardButton).toBeVisible();
    return await this.addCardButton.textContent();
  }

  async checkForErrorMessages() {
    const errorCount = await this.page.locator('[data-testid*="error"]').count();
    return errorCount > 0;
  }

  async selectCard(cardId) {
    logger.info(`Selecting card: ${cardId}`);
    const cardLocator = this.page.locator(`[data-testid="card-panel-${cardId}"]`);
    await cardLocator.click();
  }

  async waitForCardDetailsLoad() {
    logger.info('Waiting for card details to load');
    await expect(this.cardDetailsContainer).toBeVisible({ timeout: 1000 });
  }

  async getCardLabel() {
    await expect(this.cardLabelElement).toBeVisible();
    return await this.cardLabelElement.textContent();
  }

  async getCardNumber() {
    await expect(this.cardNumberElement).toBeVisible();
    return await this.cardNumberElement.textContent();
  }

  async getIssuer() {
    await expect(this.issuerElement).toBeVisible();
    return await this.issuerElement.textContent();
  }

  async getCreditLimit() {
    await expect(this.creditLimitElement).toBeVisible();
    return await this.creditLimitElement.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditElement).toBeVisible();
    return await this.availableCreditElement.textContent();
  }

  async getOutstanding() {
    await expect(this.outstandingElement).toBeVisible();
    return await this.outstandingElement.textContent();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendElement).toBeVisible();
    return await this.monthlySpendElement.textContent();
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdownContainer).toBeVisible();
    const categories = await this.categoryBreakdownContainer.locator('[data-testid="category-item"]').all();
    const breakdown = {};
    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      const amount = await category.locator('[data-testid="category-amount"]').textContent();
      breakdown[name] = amount;
    }
    return breakdown;
  }

  async verifyDataIsolation(cardId) {
    const displayedCardId = await this.page.getAttribute('[data-testid="card-details-container"]', 'data-card-id');
    return displayedCardId === cardId;
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async checkForUnhandledExceptions() {
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    return consoleErrors.length > 0;
  }

  async getAuthorizationErrorText() {
    await expect(this.authorizationError).toBeVisible();
    return await this.authorizationError.textContent();
  }

  async checkForUnauthorizedDataExposure() {
    const unauthorizedData = await this.page.locator('[data-testid*="userB"]').count();
    return unauthorizedData > 0;
  }

  async verifySecurityAuditLog(userId, cardId) {
    const auditLog = await this.page.evaluate(({ userId, cardId }) => {
      return window.localStorage.getItem(`audit-log-${userId}-${cardId}`);
    }, { userId, cardId });
    return auditLog !== null;
  }
};