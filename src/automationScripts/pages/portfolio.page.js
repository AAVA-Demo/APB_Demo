const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const { WaitUtils } = require('../../utils/wait-utils');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    // Portfolio Locators
    this.portfolioContainer = page.locator('[data-testid="portfolio-container"], .portfolio-page, #portfolio');
    this.cardItems = page.locator('.card-item, [data-testid="credit-card-item"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .no-cards-message, .empty-state');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"], .loading-indicator');
    
    // Card Detail Locators
    this.selectedCardDetails = page.locator('[data-testid="selected-card-details"], .card-details-expanded');
    this.cardName = page.locator('.card-name, [data-testid="card-name"]');
    this.cardNumber = page.locator('.card-number, [data-testid="card-number"]');
    this.cardType = page.locator('.card-type, [data-testid="card-type"]');
    this.creditLimit = page.locator('.credit-limit, [data-testid="credit-limit"]');
    this.availableCredit = page.locator('.available-credit, [data-testid="available-credit"]');
    this.outstandingBalance = page.locator('.outstanding-balance, [data-testid="outstanding-balance"]');
    this.cardStatus = page.locator('.card-status, [data-testid="card-status"]');
  }

  async navigate() {
    Logger.info('Navigating to Portfolio page');
    await this.page.goto('/portfolio');
    await WaitUtils.waitForPageLoad(this.page);
  }

  async waitForCardsToLoad() {
    Logger.info('Waiting for cards to load');
    await WaitUtils.waitForElementVisible(this.page, this.portfolioContainer);
    await WaitUtils.waitForElementHidden(this.page, this.loadingIndicator);
    await this.page.waitForTimeout(500);
  }

  async getCardCount() {
    const count = await this.cardItems.count();
    Logger.info(`Card count: ${count}`);
    return count;
  }

  async getCardDetails(index) {
    const card = this.cardItems.nth(index);
    await WaitUtils.waitForElementVisible(this.page, card);
    
    const details = {
      cardName: await card.locator('.card-name, h4').textContent(),
      maskedNumber: await card.locator('.card-number').textContent(),
      cardType: await card.locator('.card-type, p:has-text("Type:")').textContent(),
      creditLimit: await card.locator('p:has-text("Credit Limit:")').textContent(),
      availableCredit: await card.locator('p:has-text("Available:")').textContent(),
      outstandingBalance: await card.locator('p:has-text("Outstanding:")').textContent(),
      status: await card.locator('.card-status, .label').textContent()
    };
    
    Logger.info(`Card details retrieved for card ${index}`);
    return details;
  }

  async selectCard(index) {
    Logger.info(`Selecting card at index ${index}`);
    const card = this.cardItems.nth(index);
    await card.click();
    await this.page.waitForTimeout(500);
  }

  async getSelectedCardDetails() {
    await WaitUtils.waitForElementVisible(this.page, this.selectedCardDetails);
    
    const details = {
      creditLimit: await this.selectedCardDetails.locator('p:has-text("Credit Limit:")').textContent(),
      availableCredit: await this.selectedCardDetails.locator('p:has-text("Available Credit:")').textContent(),
      outstandingBalance: await this.selectedCardDetails.locator('p:has-text("Outstanding Balance:")').textContent()
    };
    
    Logger.info('Selected card details retrieved');
    return details;
  }

  async getEmptyStateMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.emptyStateMessage);
    const message = await this.emptyStateMessage.textContent();
    Logger.info(`Empty state message: ${message}`);
    return message;
  }

  async getErrorMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.errorMessage);
    const message = await this.errorMessage.textContent();
    Logger.info(`Error message: ${message}`);
    return message;
  }

  async isScrollable() {
    const isScrollable = await this.page.evaluate(() => {
      const container = document.querySelector('.portfolio-page, [data-testid="portfolio-container"]');
      return container ? container.scrollHeight > container.clientHeight : false;
    });
    Logger.info(`Portfolio is scrollable: ${isScrollable}`);
    return isScrollable;
  }
};