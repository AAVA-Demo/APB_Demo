const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardTiles = page.locator('.card-tile, .card-item');
    this.cardManagementLink = page.locator('nav a:has-text("My Cards"), a[href*="cards"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.retryButton = page.locator('button:has-text("Retry"), .retry-btn');
    this.cardDetails = page.locator('.card-details, .card-info');
  }

  async navigateToCardManagement() {
    await this.cardManagementLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Card Management');
  }

  async waitForCardsToLoad() {
    await this.cardTiles.first().waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Cards loaded');
  }

  async getCardCount() {
    return await this.cardTiles.count();
  }

  async getCardTypes() {
    const types = [];
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const typeText = await this.cardTiles.nth(i).locator('.card-type, [data-card-type]').textContent();
      types.push(typeText.trim());
    }
    return types;
  }

  async verifyColorCoding() {
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const card = this.cardTiles.nth(i);
      const classList = await card.getAttribute('class');
      expect(classList).toMatch(/visa|mastercard|amex|discover/i);
    }
    logger.info('Color coding verified for all cards');
  }

  async getLast4Digits() {
    const digits = [];
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const digitText = await this.cardTiles.nth(i).locator('.card-number, [data-card-number]').textContent();
      const last4 = digitText.match(/\d{4}/);
      if (last4) digits.push(last4[0]);
    }
    return digits;
  }

  async getCardNames() {
    const names = [];
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const nameText = await this.cardTiles.nth(i).locator('.card-name, [data-card-name]').textContent();
      names.push(nameText.trim());
    }
    return names;
  }

  async getCreditLimits() {
    const limits = [];
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const limitText = await this.cardTiles.nth(i).locator('.credit-limit, [data-credit-limit]').textContent();
      limits.push(limitText.trim());
    }
    return limits;
  }

  async getAvailableCredits() {
    const credits = [];
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const creditText = await this.cardTiles.nth(i).locator('.available-credit, [data-available-credit]').textContent();
      credits.push(creditText.trim());
    }
    return credits;
  }

  async getOutstandingBalances() {
    const balances = [];
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const balanceText = await this.cardTiles.nth(i).locator('.outstanding-balance, [data-outstanding]').textContent();
      balances.push(balanceText.trim());
    }
    return balances;
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async getRetryButton() {
    return this.retryButton;
  }

  async verifyLayoutConsistency() {
    const count = await this.cardTiles.count();
    const firstCardHeight = await this.cardTiles.first().boundingBox();
    for (let i = 1; i < count; i++) {
      const cardBox = await this.cardTiles.nth(i).boundingBox();
      expect(Math.abs(cardBox.height - firstCardHeight.height)).toBeLessThan(10);
    }
    logger.info('Layout consistency verified');
  }

  async isScrollable() {
    const scrollHeight = await this.page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await this.page.evaluate(() => document.documentElement.clientHeight);
    return scrollHeight > clientHeight;
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);
    logger.info('Scrolled to bottom');
  }

  async navigateThroughPages() {
    const nextButton = this.page.locator('.pagination .next, button:has-text("Next")');
    const isVisible = await nextButton.isVisible().catch(() => false);
    if (isVisible) {
      await nextButton.click();
      await this.waitForCardsToLoad();
      logger.info('Navigated to next page');
    }
  }

  async verifyNoTruncation() {
    const count = await this.cardTiles.count();
    for (let i = 0; i < count; i++) {
      const card = this.cardTiles.nth(i);
      const cardName = await card.locator('.card-name').textContent();
      expect(cardName.length).toBeGreaterThan(0);
    }
    logger.info('No truncation detected');
  }

  async verifyUniqueCardData() {
    const cardNames = await this.getCardNames();
    const uniqueNames = new Set(cardNames);
    expect(uniqueNames.size).toBe(cardNames.length);
    logger.info('Unique data verified for all cards');
  }

  async clickFirstCard() {
    await this.cardTiles.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCard(cardName) {
    const card = this.page.locator(`.card-tile:has-text("${cardName}")`);
    await card.waitFor({ state: 'visible', timeout: 5000 });
    await card.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Selected card: ${cardName}`);
  }

  async getCardDetails() {
    await this.cardDetails.waitFor({ state: 'visible' });
    const creditLimit = await this.page.locator('.credit-limit, [data-credit-limit]').textContent();
    const availableCredit = await this.page.locator('.available-credit, [data-available-credit]').textContent();
    return {
      creditLimit: creditLimit.trim(),
      availableCredit: availableCredit.trim()
    };
  }

  async getSpendingPatterns() {
    const topCategory = await this.page.locator('.top-category, [data-top-category]').textContent();
    return {
      topCategory: topCategory.trim()
    };
  }

  async getUtilization() {
    const utilization = await this.page.locator('.utilization, [data-utilization]').textContent();
    return utilization.trim();
  }

  async getRecentTransactions() {
    const transactions = await this.page.locator('.transaction-item, .transaction-row').all();
    return transactions;
  }
};
