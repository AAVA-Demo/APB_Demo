const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardListContainer = page.locator('.list-group');
    this.cardItems = page.locator('.list-group-item');
    this.cardPortfolioPanel = page.locator('.panel:has-text("Card Portfolio")');
    
    // Card Detail Locators
    this.cardDetailPanel = page.locator('[card-detail], .panel-primary');
    this.cardBalance = page.locator('text=/Current Balance:/');
    this.cardAvailableCredit = page.locator('text=/Available Credit:/');
    this.cardCreditLimit = page.locator('text=/Credit Limit:/');
    this.cardMonthlySpend = page.locator('text=/Monthly Spend:/');
    this.cardTransactionCount = page.locator('text=/Transaction Count:/');
    
    // Error Locators
    this.errorMessage = page.locator('.alert-danger, [class*="error"]');
  }

  async navigate() {
    Logger.info('Navigating to Card Management page');
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardsToLoad() {
    Logger.info('Waiting for cards to load');
    await expect(this.cardListContainer).toBeVisible({ timeout: 5000 });
  }

  async getCardCount() {
    await expect(this.cardItems.first()).toBeVisible();
    const count = await this.cardItems.count();
    Logger.info(`Card count: ${count}`);
    return count;
  }

  async selectFirstCard() {
    Logger.info('Selecting first card');
    await expect(this.cardItems.first()).toBeVisible();
    await this.cardItems.first().click();
    await this.page.waitForTimeout(500); // Allow time for card detail to load
  }

  async selectCardByIndex(index) {
    Logger.info(`Selecting card at index ${index}`);
    await expect(this.cardItems.nth(index)).toBeVisible();
    await this.cardItems.nth(index).click();
    await this.page.waitForTimeout(500);
  }

  async areAllCardsVisible() {
    const count = await this.cardItems.count();
    for (let i = 0; i < count; i++) {
      const isVisible = await this.cardItems.nth(i).isVisible();
      if (!isVisible) {
        Logger.warn(`Card at index ${i} is not visible`);
        return false;
      }
    }
    Logger.info('All cards are visible');
    return true;
  }

  async getAllCardTypes() {
    const count = await this.cardItems.count();
    const types = [];
    for (let i = 0; i < count; i++) {
      const text = await this.cardItems.nth(i).locator('.list-group-item-heading').textContent();
      types.push(text);
    }
    Logger.info(`Card types: ${types.join(', ')}`);
    return types;
  }

  async getCardMonthlySpend() {
    await expect(this.cardDetailPanel).toBeVisible();
    const element = this.cardDetailPanel.locator('text=/Monthly Spend:/');
    await expect(element).toBeVisible();
    const text = await element.textContent();
    const spend = text.split(':')[1].trim();
    Logger.info(`Card Monthly Spend: ${spend}`);
    return spend;
  }

  async getCardTransactionCount() {
    await expect(this.cardDetailPanel).toBeVisible();
    const element = this.cardDetailPanel.locator('text=/Transaction Count:/');
    await expect(element).toBeVisible();
    const text = await element.textContent();
    const count = text.split(':')[1].trim();
    Logger.info(`Transaction Count: ${count}`);
    return count;
  }

  async getCardBalance() {
    await expect(this.cardDetailPanel).toBeVisible();
    const element = this.cardDetailPanel.locator('text=/Current Balance:/');
    await expect(element).toBeVisible();
    const text = await element.textContent();
    const balance = text.split(':')[1].trim();
    Logger.info(`Card Balance: ${balance}`);
    return balance;
  }

  async getCardAvailableCredit() {
    await expect(this.cardDetailPanel).toBeVisible();
    const element = this.cardDetailPanel.locator('text=/Available Credit:/');
    await expect(element).toBeVisible();
    const text = await element.textContent();
    const credit = text.split(':')[1].trim();
    Logger.info(`Available Credit: ${credit}`);
    return credit;
  }

  async getCardCreditLimit() {
    await expect(this.cardDetailPanel).toBeVisible();
    const element = this.cardDetailPanel.locator('text=/Credit Limit:/);
    await expect(element).toBeVisible();
    const text = await element.textContent();
    const limit = text.split(':')[1].trim();
    Logger.info(`Credit Limit: ${limit}`);
    return limit;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const text = await this.errorMessage.textContent();
    Logger.info(`Error Message: ${text}`);
    return text;
  }
};
