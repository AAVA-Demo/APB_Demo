const { expect } = require('@playwright/test');

exports.CardOverviewPage = class CardOverviewPage {
  constructor(page) {
    this.page = page;
    this.cardList = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.cardLoadingIndicator = page.locator('.card-loading');
    this.discrepancyWarning = page.locator('.discrepancy-warning');
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardsToLoad() {
    await this.cardList.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForFunction(() => {
      return !document.querySelector('.card-loading');
    }, { timeout: 5000 });
  }

  async getDisplayedCards() {
    await this.cardItems.first().waitFor({ state: 'visible' });
    const items = await this.cardItems.all();
    const cards = [];
    
    for (const item of items) {
      const cardId = await item.getAttribute('data-card-id');
      const cardType = await item.locator('.card-type').textContent();
      const cardNumber = await item.locator('.card-number').textContent();
      const creditLimit = await item.locator('.credit-limit').textContent();
      const availableCredit = await item.locator('.available-credit').textContent();
      const outstandingBalance = await item.locator('.outstanding-balance').textContent();
      const outstandingAmount = await item.locator('.outstanding-amount').textContent();
      
      cards.push({
        cardId: cardId,
        cardType: cardType.trim(),
        cardNumber: cardNumber.trim(),
        creditLimit: parseFloat(creditLimit.replace(/[^0-9.-]+/g, '')),
        availableCredit: parseFloat(availableCredit.replace(/[^0-9.-]+/g, '')),
        outstandingBalance: parseFloat(outstandingBalance.replace(/[^0-9.-]+/g, '')),
        outstandingAmount: parseFloat(outstandingAmount.replace(/[^0-9.-]+/g, ''))
      });
    }
    
    return cards;
  }

  async checkForLayoutErrors() {
    const hasOverflow = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('.card-item');
      for (const el of elements) {
        if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
          return true;
        }
      }
      return false;
    });
    return hasOverflow;
  }

  async getDiscrepancyFlags() {
    const warnings = await this.discrepancyWarning.all();
    const flags = [];
    
    for (const warning of warnings) {
      const cardId = await warning.getAttribute('data-card-id');
      const message = await warning.textContent();
      flags.push({ cardId, message: message.trim() });
    }
    
    return flags;
  }

  async getDiscrepancyWarning(cardId) {
    const warning = this.page.locator(`.discrepancy-warning[data-card-id="${cardId}"]`);
    if (await warning.isVisible({ timeout: 3000 }).catch(() => false)) {
      return await warning.textContent();
    }
    return null;
  }

  async addTestCard(cardData) {
    await this.page.evaluate((card) => {
      if (!window.testCards) {
        window.testCards = [];
      }
      window.testCards.push(card);
    }, cardData);
  }

  async setupTestScenario(config) {
    await this.page.evaluate((cfg) => {
      window.testScenarioConfig = cfg;
    }, config);
  }
};
