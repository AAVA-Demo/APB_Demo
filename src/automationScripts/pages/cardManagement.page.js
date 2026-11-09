const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Locators for card list view
    this.cardManagementContainer = page.locator('[ng-controller="cardManagementController as vm"]');
    this.loadingIndicator = page.locator('.row:has-text("Loading Cards...")');
    this.errorAlert = page.locator('.alert-danger');
    this.cardItems = page.locator('.card-item');
    this.emptyStateMessage = page.locator('text=/No credit cards registered|No cards available/');
    
    // Locators for card details view
    this.cardDetailPanel = page.locator('.card-detail-panel');
    this.currentMonthSpendLabel = page.locator('p:has-text("Current Month Spend:")');
    this.yearToDateSpendLabel = page.locator('p:has-text("Year-to-Date Spend:")');
    this.currentBalanceLabel = page.locator('p:has-text("Current Balance:")');
    this.availableCreditLabel = page.locator('p:has-text("Available Credit:")');
    this.creditLimitLabel = page.locator('p:has-text("Credit Limit:")');
    this.transactionCountLabel = page.locator('p:has-text("Transaction Count:")');
    this.backButton = page.locator('button:has-text("Back to Portfolio")');
  }

  async navigate() {
    logger.info('Navigating to Card Management page');
    await this.page.goto('/cards');
    await this.waitForCardManagementLoad();
  }

  async navigateWithUser(username) {
    logger.info(`Navigating to Card Management page with user: ${username}`);
    await this.page.goto(`/cards?user=${username}`);
    await this.waitForCardManagementLoad();
  }

  async navigateDirectToCard(cardId) {
    logger.info(`Navigating directly to card details: ${cardId}`);
    await this.page.goto(`/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardManagementLoad() {
    logger.info('Waiting for card management interface to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.cardManagementContainer).toBeVisible();
  }

  async waitForCardDetailsLoad() {
    logger.info('Waiting for card details to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.cardDetailPanel.first()).toBeVisible();
  }

  async getCardCount() {
    logger.info('Getting total card count');
    return await this.cardItems.count();
  }

  async verifyCardNumber(index, expectedNumber) {
    logger.info(`Verifying card number at index ${index}: ${expectedNumber}`);
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    const cardText = await card.textContent();
    expect(cardText).toContain(expectedNumber);
  }

  async verifyCardType(index, expectedType) {
    logger.info(`Verifying card type at index ${index}: ${expectedType}`);
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    const cardText = await card.textContent();
    expect(cardText).toContain(expectedType);
  }

  async verifyCardHolderName(index, expectedName) {
    logger.info(`Verifying card holder name at index ${index}: ${expectedName}`);
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    const holderText = await card.locator('p:has-text("Holder:")').textContent();
    expect(holderText).toContain(expectedName);
  }

  async verifyExpiryDate(index, expectedDate) {
    logger.info(`Verifying expiry date at index ${index}: ${expectedDate}`);
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    const expiryText = await card.locator('p:has-text("Expiry:")').textContent();
    expect(expiryText).toContain(expectedDate);
  }

  async verifyCardStatus(index, expectedStatus) {
    logger.info(`Verifying card status at index ${index}: ${expectedStatus}`);
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    const statusLabel = card.locator('.label-success');
    const statusText = await statusLabel.textContent();
    expect(statusText.trim()).toBe(expectedStatus);
  }

  async getCardOrder() {
    logger.info('Getting card order');
    const cards = await this.cardItems.all();
    const cardIds = [];
    for (const card of cards) {
      const cardText = await card.textContent();
      const match = cardText.match(/\*\*\*(\d+)/);
      if (match) {
        const lastDigits = match[1];
        if (lastDigits === '1234') cardIds.push('1');
        else if (lastDigits === '5678') cardIds.push('2');
        else if (lastDigits === '9012') cardIds.push('3');
      }
    }
    return cardIds;
  }

  async verifyVisualSeparation() {
    logger.info('Verifying visual separation between cards');
    const firstCard = this.cardItems.first();
    const secondCard = this.cardItems.nth(1);
    
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    if (!firstBox || !secondBox) return false;
    
    const verticalGap = secondBox.y - (firstBox.y + firstBox.height);
    return verticalGap > 0;
  }

  async getEmptyStateMessage() {
    logger.info('Getting empty state message');
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async checkForSystemErrors() {
    logger.info('Checking for system errors');
    const errors = [];
    this.page.on('pageerror', error => errors.push(error));
    await this.page.waitForTimeout(1000);
    return errors.length > 0;
  }

  async isInterfaceStable() {
    logger.info('Checking if interface is stable');
    await expect(this.cardManagementContainer).toBeVisible();
    const errorVisible = await this.errorAlert.isVisible().catch(() => false);
    return !errorVisible;
  }

  async isEmptyStateVisible() {
    logger.info('Checking if empty state is visible');
    return await this.emptyStateMessage.isVisible().catch(() => false);
  }

  async checkForUndefinedValues() {
    logger.info('Checking for undefined values in card list');
    const pageContent = await this.page.content();
    return pageContent.includes('undefined') || pageContent.includes('null');
  }

  async checkForConsoleErrors() {
    logger.info('Checking for console errors');
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await this.page.waitForTimeout(1000);
    return consoleErrors.length > 0;
  }

  async selectCard(cardId) {
    logger.info(`Selecting card with ID: ${cardId}`);
    await this.page.goto(`/cards/${cardId}`);
  }

  async getCurrentMonthSpend() {
    logger.info('Getting current month spend');
    const text = await this.currentMonthSpendLabel.textContent();
    const match = text.match(/\$([\d,]+\.\d{2})/);
    return match ? match[1].replace(',', '') : '0';
  }

  async getYearToDateSpend() {
    logger.info('Getting year-to-date spend');
    const text = await this.yearToDateSpendLabel.textContent();
    const match = text.match(/\$([\d,]+\.\d{2})/);
    return match ? match[1].replace(',', '') : '0';
  }

  async getCurrentBalance() {
    logger.info('Getting current balance');
    const text = await this.currentBalanceLabel.textContent();
    const match = text.match(/\$([\d,]+\.\d{2})/);
    return match ? match[1].replace(',', '') : '0';
  }

  async getAvailableCredit() {
    logger.info('Getting available credit');
    const text = await this.availableCreditLabel.textContent();
    const match = text.match(/\$([\d,]+\.\d{2})/);
    return match ? match[1].replace(',', '') : '0';
  }

  async getCreditLimit() {
    logger.info('Getting credit limit');
    const text = await this.creditLimitLabel.textContent();
    const match = text.match(/\$([\d,]+\.\d{2})/);
    return match ? match[1].replace(',', '') : '0';
  }

  async getTransactionCount() {
    logger.info('Getting transaction count');
    const text = await this.transactionCountLabel.textContent();
    const match = text.match(/Transaction Count:\s*(\d+)/);
    return match ? match[1] : '0';
  }

  async verifySpendingMetricsAreZero() {
    logger.info('Verifying spending metrics are zero');
    const currentMonth = await this.getCurrentMonthSpend();
    const yearToDate = await this.getYearToDateSpend();
    const transactionCount = await this.getTransactionCount();
    return currentMonth === '0' && yearToDate === '0' && transactionCount === '0';
  }

  async checkForJavaScriptErrors() {
    logger.info('Checking for JavaScript errors');
    const jsErrors = [];
    this.page.on('pageerror', error => jsErrors.push(error));
    await this.page.waitForTimeout(1000);
    return jsErrors.length > 0;
  }

  async verifyCardInformationDisplayed() {
    logger.info('Verifying card information is displayed');
    const cardInfoPanel = this.page.locator('.card-detail-panel:has-text("Card Information")');
    await expect(cardInfoPanel).toBeVisible();
    return true;
  }

  async getErrorMessage() {
    logger.info('Getting error message');
    await expect(this.errorAlert).toBeVisible({ timeout: 5000 });
    return await this.errorAlert.textContent();
  }

  async checkForSystemCrash() {
    logger.info('Checking for system crash');
    const whiteScreen = await this.page.locator('body').evaluate(el => {
      return el.textContent.trim() === '' || el.innerHTML.trim() === '';
    });
    return whiteScreen;
  }

  async verifyNavigationWorking() {
    logger.info('Verifying navigation is working');
    const navLinks = this.page.locator('nav a');
    const count = await navLinks.count();
    return count > 0;
  }

  async isErrorHandledGracefully() {
    logger.info('Checking if error is handled gracefully');
    const errorVisible = await this.errorAlert.isVisible().catch(() => false);
    const pageVisible = await this.cardManagementContainer.isVisible().catch(() => false);
    return errorVisible || pageVisible;
  }

  async checkForUndefinedCardDataErrors() {
    logger.info('Checking for undefined card data errors in console');
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('undefined')) {
        consoleErrors.push(msg.text());
      }
    });
    await this.page.waitForTimeout(1000);
    return consoleErrors.length > 0;
  }
};
