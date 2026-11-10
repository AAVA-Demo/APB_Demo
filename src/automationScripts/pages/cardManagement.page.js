const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    
    this.cardManagementSection = page.locator('.card-management-section, .cards-section');
    this.cardManagementNav = page.locator('a[href*="cards"], button:has-text("My Cards")');
    this.cardSelectionInterface = page.locator('.card-selection, .card-switcher');
    this.cardList = page.locator('.card-list');
    this.cardItem = (cardName) => page.locator(`[data-card="${cardName}"], .card-item:has-text("${cardName}")`);
    this.cardLimit = (cardName) => page.locator(`[data-card="${cardName}"] [data-testid="credit-limit"]`);
    this.cardAvailable = (cardName) => page.locator(`[data-card="${cardName}"] [data-testid="available-credit"]`);
    this.cardOutstanding = (cardName) => page.locator(`[data-card="${cardName}"] [data-testid="outstanding-balance"]`);
    this.noCardsMessage = page.locator('.no-cards-message, .empty-state');
    this.addCardPrompt = page.locator('button:has-text("Add a credit card"), a:has-text("Add a credit card")');
    this.errorMessage = page.locator('.error-message, .alert-error');
  }

  async navigateToCardManagement() {
    this.logger.info('Navigating to Card Management section');
    await this.cardManagementNav.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.cardManagementSection).toBeVisible();
  }

  async navigateToCardSelection() {
    this.logger.info('Navigating to Card Selection interface');
    await this.cardManagementNav.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.cardSelectionInterface).toBeVisible();
  }

  async verifyCardCount(expectedCount) {
    this.logger.info(`Verifying card count: ${expectedCount}`);
    const cards = await this.page.locator('.card-item').count();
    expect(cards).toBe(expectedCount);
  }

  async verifyCardDetails(cardName, creditLimit, availableCredit, outstandingBalance) {
    this.logger.info(`Verifying details for ${cardName}`);
    await expect(this.cardItem(cardName)).toBeVisible();
    await expect(this.cardLimit(cardName)).toContainText(creditLimit);
    await expect(this.cardAvailable(cardName)).toContainText(availableCredit);
    await expect(this.cardOutstanding(cardName)).toContainText(outstandingBalance);
  }

  async verifyLoadTime(maxLoadTime) {
    const startTime = Date.now();
    await expect(this.cardManagementSection).toBeVisible();
    const loadTime = Date.now() - startTime;
    this.logger.info(`Card management section loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(maxLoadTime);
  }

  async verifyAllCardsHaveDetails() {
    this.logger.info('Verifying all cards have complete details');
    const cardCount = await this.page.locator('.card-item').count();
    for (let i = 0; i < cardCount; i++) {
      const card = this.page.locator('.card-item').nth(i);
      await expect(card.locator('[data-testid="credit-limit"]')).toBeVisible();
      await expect(card.locator('[data-testid="available-credit"]')).toBeVisible();
      await expect(card.locator('[data-testid="outstanding-balance"]')).toBeVisible();
    }
  }

  async selectCard(cardName) {
    this.logger.info(`Selecting card: ${cardName}`);
    const card = this.cardItem(cardName);
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardAndVerify(cardName, creditLimit, availableCredit, outstandingBalance) {
    const startTime = Date.now();
    await this.selectCard(cardName);
    const switchTime = Date.now() - startTime;
    this.logger.info(`Card ${cardName} switched in ${switchTime}ms`);
    expect(switchTime).toBeLessThan(500);
    await this.verifyCardDetails(cardName, creditLimit, availableCredit, outstandingBalance);
  }
};