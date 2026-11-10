const { expect } = require('@playwright/test');

exports.MultiCardManagementPage = class MultiCardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardListContainer = page.locator('.card-list-container');
    this.cardItems = page.locator('.card-item');
    this.noCardsMessage = page.locator('.no-cards-message');
    this.loadingSpinner = page.locator('.loading-spinner');
    this.errorIndicators = page.locator('.card-error-indicator');
  }

  async navigate() {
    await this.page.click('a[href="/multi-card-management"]');
    await expect(this.cardListContainer).toBeVisible({ timeout: 3000 });
  }

  async waitForCardsLoad() {
    await expect(this.cardListContainer).toBeVisible();
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
    await expect(this.cardItems.first()).toBeVisible();
  }

  async verifyCardNumberMasked(lastFourDigits) {
    const cardNumberLocator = this.page.locator(`[data-card-last-four="${lastFourDigits}"] .card-number`);
    await expect(cardNumberLocator).toBeVisible();
    const cardNumberText = await cardNumberLocator.textContent();
    return cardNumberText.includes('****') && cardNumberText.includes(lastFourDigits);
  }

  async getAllCreditLimits() {
    const limits = [];
    const limitLocators = this.page.locator('.card-credit-limit');
    const count = await limitLocators.count();
    for (let i = 0; i < count; i++) {
      limits.push(await limitLocators.nth(i).textContent());
    }
    return limits;
  }

  async getAllOutstandingBalances() {
    const balances = [];
    const balanceLocators = this.page.locator('.card-outstanding-balance');
    const count = await balanceLocators.count();
    for (let i = 0; i < count; i++) {
      balances.push(await balanceLocators.nth(i).textContent());
    }
    return balances;
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async verifyCardDataDisplayed(lastFour, limit, outstanding) {
    const cardLocator = this.page.locator(`[data-card-last-four="${lastFour}"]`);
    await expect(cardLocator).toBeVisible();
    const limitText = await cardLocator.locator('.card-credit-limit').textContent();
    const outstandingText = await cardLocator.locator('.card-outstanding-balance').textContent();
    return limitText === limit && outstandingText === outstanding;
  }

  async getErrorIndicatorCount() {
    return await this.errorIndicators.count();
  }

  async getErrorIndicatorMessage() {
    await expect(this.errorIndicators.first()).toBeVisible();
    return await this.errorIndicators.first().textContent();
  }
};