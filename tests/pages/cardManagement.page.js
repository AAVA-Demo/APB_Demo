const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('button[data-testid="logout"]');
    this.cardsLink = page.locator('a[href*="cards"]');
    this.cardList = page.locator('.card-list');
    this.cardItem = page.locator('.card-item');
    this.cardType = page.locator('.card-type');
    this.lastFourDigits = page.locator('.last-four-digits');
    this.creditLimit = page.locator('.credit-limit');
    this.balance = page.locator('.balance');
    this.errorIndicator = page.locator('.error-indicator, .card-error');
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.addCardButton = page.locator('button[data-action="add-card"]');
  }

  async navigate() {
    logger.info('Navigating to application');
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

  async navigateToCardManagement() {
    logger.info('Navigating to card management section');
    await this.cardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await expect(this.cardList).toBeVisible();
    return await this.cardItem.count();
  }

  async getAllCardTypes() {
    const types = await this.cardType.allTextContents();
    return types.map(type => type.trim());
  }

  async getAllLastFourDigits() {
    const digits = await this.lastFourDigits.allTextContents();
    return digits.map(d => d.replace(/[^0-9]/g, ''));
  }

  async getAllCreditLimits() {
    const limits = await this.creditLimit.allTextContents();
    return limits.map(limit => limit.trim());
  }

  async getAllBalances() {
    const balances = await this.balance.allTextContents();
    return balances.map(balance => balance.trim());
  }

  async getValidCardCount() {
    const totalCards = await this.getCardCount();
    const errorCards = await this.errorIndicator.count();
    return totalCards - errorCards;
  }

  async hasErrorIndicatorForCard(cardIndex) {
    const cardLocator = this.cardItem.nth(cardIndex - 1);
    const errorLocator = cardLocator.locator('.error-indicator, .card-error');
    return await errorLocator.isVisible();
  }

  async getCardErrorMessage(cardIndex) {
    const cardLocator = this.cardItem.nth(cardIndex - 1);
    const errorLocator = cardLocator.locator('.error-message');
    if (await errorLocator.isVisible()) {
      return (await errorLocator.textContent()).trim();
    }
    return '';
  }

  async isListViewIntact() {
    const listVisible = await this.cardList.isVisible();
    const hasLayout = await this.cardList.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    return listVisible && hasLayout;
  }

  async canClickCard(cardIndex) {
    const cardLocator = this.cardItem.nth(cardIndex - 1);
    return await cardLocator.isEnabled();
  }

  async hasEmptyStateMessage() {
    return await this.emptyStateMessage.isVisible();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return (await this.emptyStateMessage.textContent()).trim();
  }

  async hasAddCardPrompt() {
    return await this.addCardButton.isVisible();
  }

  async getAddCardButtonText() {
    await expect(this.addCardButton).toBeVisible();
    return (await this.addCardButton.textContent()).trim();
  }

  async hasPageErrors() {
    const errorElements = await this.page.locator('.error, text=/null|undefined/i').count();
    const brokenLayout = await this.page.locator('.broken-layout').count();
    return errorElements > 0 || brokenLayout > 0;
  }

  async selectCard(cardType, lastFour) {
    logger.info(`Selecting card: ${cardType} ending in ${lastFour}`);
    const cardLocator = this.page.locator(`.card-item:has-text("${cardType}"):has-text("${lastFour}")`);
    await cardLocator.click();
    await this.page.waitForLoadState('networkidle');
  }

  async hasStaleCardData() {
    const staleDataIndicators = await this.page.locator('[data-stale="true"], .stale-data').count();
    return staleDataIndicators > 0;
  }
};