const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card management container
    this.cardManagementContainer = page.locator('.card-management-container, [data-testid="card-management"]');
    this.cardListContainer = page.locator('.card-list, [data-testid="card-list"]');
    
    // Card item locators
    this.cardItems = page.locator('.card-item, [data-testid="card-item"]');
    this.selectedCardHighlight = page.locator('.card-item.selected, [data-testid="selected-card"]');
    
    // Card details section
    this.cardDetailsSection = page.locator('.card-detail, [data-testid="card-details"]');
    this.currentMonthSpendingValue = page.locator('[data-testid="current-month-spending"], .card-detail .spending-value');
    
    // Transaction list
    this.transactionList = page.locator('.transaction-list, [data-testid="transaction-list"]');
    this.transactionItems = page.locator('.transaction-item, [data-testid="transaction-item"]');
    this.emptyTransactionTable = page.locator('.empty-transactions, table:empty');
    
    // Messages
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"], .no-transactions-message, .alert:has-text("No transactions found")');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message, .alert:has-text("no credit cards registered")');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.emptyCardGrid = page.locator('.card-grid:empty, .card-list:empty');
    
    // Navigation
    this.cardManagementNavLink = page.locator('a[href*="cards"], nav >> text=My Cards');
  }

  async navigate() {
    logger.info('Navigating to Card Management page');
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCardManagement() {
    logger.info('Clicking Card Management navigation link');
    await this.cardManagementNavLink.click();
    await expect(this.cardManagementContainer).toBeVisible({ timeout: 5000 });
  }

  async selectCard(cardName) {
    logger.info(`Selecting card: ${cardName}`);
    const cardLocator = this.page.locator(`.card-item:has-text("${cardName}"), [data-testid="card-item"]:has-text("${cardName}")`);
    await expect(cardLocator).toBeVisible({ timeout: 3000 });
    await cardLocator.click();
    await this.page.waitForTimeout(500); // Wait for selection animation
  }

  async getCurrentMonthSpending() {
    logger.info('Retrieving current month spending value');
    await expect(this.currentMonthSpendingValue).toBeVisible({ timeout: 3000 });
    const value = await this.currentMonthSpendingValue.textContent();
    return value.trim();
  }

  async getRecentTransactions() {
    logger.info('Retrieving recent transactions list');
    await expect(this.transactionList).toBeVisible({ timeout: 3000 });
    const transactions = await this.transactionItems.allTextContents();
    return transactions;
  }

  async getNoTransactionsMessage() {
    logger.info('Retrieving no transactions message');
    await expect(this.noTransactionsMessage).toBeVisible({ timeout: 3000 });
    const message = await this.noTransactionsMessage.textContent();
    return message.trim();
  }

  async attemptAccessDeactivatedCard(cardId) {
    logger.info(`Attempting to access deactivated card: ${cardId}`);
    await this.page.goto(`/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage() {
    logger.info('Retrieving error message text');
    await expect(this.errorMessage).toBeVisible({ timeout: 3000 });
    const message = await this.errorMessage.textContent();
    return message.trim();
  }

  async getAllCards() {
    logger.info('Retrieving all displayed credit cards');
    await expect(this.cardListContainer).toBeVisible({ timeout: 5000 });
    const cardCount = await this.cardItems.count();
    const cards = [];
    
    for (let i = 0; i < cardCount; i++) {
      const cardItem = this.cardItems.nth(i);
      const cardText = await cardItem.textContent();
      
      const nameMatch = cardText.match(/([A-Za-z\s]+)/);
      const digitsMatch = cardText.match(/\*+(\d{4})/);
      const balanceMatch = cardText.match(/\$[\d,]+\.\d{2}/);
      
      cards.push({
        name: nameMatch ? nameMatch[1].trim() : '',
        lastFourDigits: digitsMatch ? digitsMatch[1] : '',
        balance: balanceMatch ? balanceMatch[0] : ''
      });
    }
    
    logger.info(`Retrieved ${cards.length} cards`);
    return cards;
  }

  async scrollCardList() {
    logger.info('Scrolling card list');
    await this.cardListContainer.evaluate(el => el.scrollTo(0, el.scrollHeight));
    await this.page.waitForTimeout(300);
  }

  async getNoCardsMessage() {
    logger.info('Retrieving no cards message');
    await expect(this.noCardsMessage).toBeVisible({ timeout: 3000 });
    const message = await this.noCardsMessage.textContent();
    return message.trim();
  }
};