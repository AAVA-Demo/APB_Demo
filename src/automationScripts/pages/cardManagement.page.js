const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardItems = page.locator('.card-item');
    this.cardNames = page.locator('[data-testid="card-name"]');
    this.cardTypes = page.locator('[data-testid="card-type"]');
    this.cardNumbers = page.locator('[data-testid="card-number"]');
    this.monthlySpends = page.locator('[data-testid="monthly-spend"]');
    this.creditLimits = page.locator('[data-testid="credit-limit"]');
    this.availableCredits = page.locator('[data-testid="available-credit"]');
    this.currentBalances = page.locator('[data-testid="current-balance"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async navigate() {
    await this.page.goto('/cards');
  }

  async waitForCardsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('.card-item', { state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getAllCardNames() {
    await expect(this.cardNames.first()).toBeVisible();
    return await this.cardNames.allTextContents();
  }

  async getAllCardTypes() {
    await expect(this.cardTypes.first()).toBeVisible();
    return await this.cardTypes.allTextContents();
  }

  async getAllCardNumbers() {
    await expect(this.cardNumbers.first()).toBeVisible();
    return await this.cardNumbers.allTextContents();
  }

  async getAllMonthlySpends() {
    await expect(this.monthlySpends.first()).toBeVisible();
    return await this.monthlySpends.allTextContents();
  }

  async getAllCreditLimits() {
    await expect(this.creditLimits.first()).toBeVisible();
    return await this.creditLimits.allTextContents();
  }

  async getAllAvailableCredits() {
    await expect(this.availableCredits.first()).toBeVisible();
    return await this.availableCredits.allTextContents();
  }

  async getAllCurrentBalances() {
    await expect(this.currentBalances.first()).toBeVisible();
    return await this.currentBalances.allTextContents();
  }

  async verifyAllDetailsLoaded() {
    const cards = await this.cardItems.all();
    for (const card of cards) {
      const name = await card.locator('[data-testid="card-name"]').textContent();
      const type = await card.locator('[data-testid="card-type"]').textContent();
      const number = await card.locator('[data-testid="card-number"]').textContent();
      if (!name || !type || !number) return false;
    }
    return true;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    return await this.errorMessage.textContent();
  }
};
