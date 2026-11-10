const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.myCardsLink = page.locator('a[href*="cards"]');
    this.cardListContainer = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.noCardsMessage = page.locator('.no-cards-message');
    this.addCardButton = page.locator('button.add-card');
    this.paginationControls = page.locator('.pagination');
    this.nextPageButton = page.locator('.pagination .next');
    this.previousPageButton = page.locator('.pagination .previous');
  }

  async navigateToMyCards() {
    await this.myCardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardListLoad() {
    await this.page.waitForSelector('.card-management-container', { state: 'visible', timeout: 5000 });
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getAllCardNumbers() {
    const numbers = await this.cardItems.locator('.card-number').allTextContents();
    return numbers.map(num => num.trim());
  }

  async getAllCardTypes() {
    const types = await this.cardItems.locator('.card-type').allTextContents();
    return types.map(type => type.trim());
  }

  async getAllCreditLimits() {
    const limits = await this.cardItems.locator('.credit-limit .value').allTextContents();
    return limits.map(limit => limit.trim());
  }

  async getAllAvailableCredits() {
    const credits = await this.cardItems.locator('.available-credit .value').allTextContents();
    return credits.map(credit => credit.trim());
  }

  async getAllOutstandingBalances() {
    const balances = await this.cardItems.locator('.outstanding-balance .value').allTextContents();
    return balances.map(balance => balance.trim());
  }

  async selectCard(lastFourDigits) {
    const card = this.cardItems.filter({ hasText: lastFourDigits }).first();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async hasPagination() {
    return await this.paginationControls.isVisible();
  }

  async hasScrolling() {
    const isScrollable = await this.cardListContainer.evaluate(el => {
      return el.scrollHeight > el.clientHeight;
    });
    return isScrollable;
  }

  async clickNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPreviousPage() {
    await this.previousPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async scrollToBottom() {
    await this.cardListContainer.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });
    await this.page.waitForTimeout(500);
  }

  async areAllCardsAccessible() {
    const totalCards = await this.getCardCount();
    return totalCards > 0;
  }

  async verifyAllCardsHaveDetails() {
    const cards = await this.cardItems.all();
    for (const card of cards) {
      const hasNumber = await card.locator('.card-number').isVisible();
      const hasType = await card.locator('.card-type').isVisible();
      const hasLimit = await card.locator('.credit-limit').isVisible();
      const hasAvailable = await card.locator('.available-credit').isVisible();
      const hasOutstanding = await card.locator('.outstanding-balance').isVisible();
      if (!hasNumber || !hasType || !hasLimit || !hasAvailable || !hasOutstanding) {
        return false;
      }
    }
    return true;
  }

  async waitForAllCardsLoad() {
    await this.page.waitForSelector('.card-item', { state: 'visible', timeout: 10000 });
  }
};
