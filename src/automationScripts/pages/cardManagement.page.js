const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://creditcard.dashboard.app';
    
    // Login locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Navigation locators
    this.navigationMenu = page.locator('.navbar');
    this.myCardsLink = page.locator('a[href="#/cards"]');
    this.backButton = page.locator('a:has-text("Back to Cards")');
    
    // Card List locators
    this.cardList = page.locator('.card-management-container');
    this.cardItems = page.locator('.panel-default');
    this.noCardsMessage = page.locator('text=No credit cards available');
    this.addCardButton = page.locator('button:has-text("Add Credit Card"), a:has-text("Register Your First Card")');
    
    // Card Detail locators
    this.cardDetailView = page.locator('.card-detail-container');
    this.transactionHistory = page.locator('.table');
    this.transactionRows = page.locator('.table tbody tr');
    this.spendingBreakdown = page.locator('.spending-breakdown');
    this.totalSpend = page.locator('.total-spend');
    this.utilizationMetrics = page.locator('.utilization-metrics');
    
    // Filter locators
    this.filterControls = page.locator('.filter-controls');
    this.dateFromInput = page.locator('input[type="date"][ng-model*="dateFrom"]');
    this.dateToInput = page.locator('input[type="date"][ng-model*="dateTo"]');
    this.categorySelect = page.locator('select[ng-model*="category"]');
    this.applyFilterButton = page.locator('button:has-text("Apply")');
    this.clearFilterButton = page.locator('button:has-text("Clear")');
    
    // Error locators
    this.errorMessage = page.locator('.alert-danger');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=Loading cards...');
  }

  async navigate() {
    logger.info(`Navigating to ${this.baseURL}`);
    await this.page.goto(this.baseURL);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in as ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToMyCards() {
    logger.info('Navigating to My Cards section');
    await this.myCardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardListLoad() {
    logger.info('Waiting for card list to load');
    await this.page.waitForSelector('.card-management-container', { state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await expect(this.cardList).toBeVisible();
    const count = await this.cardItems.count();
    logger.info(`Found ${count} cards`);
    return count;
  }

  async getAllCardDetails() {
    logger.info('Getting all card details');
    await expect(this.cardList).toBeVisible();
    
    const cards = [];
    const cardElements = await this.cardItems.all();
    
    for (const card of cardElements) {
      const name = await card.locator('.panel-heading strong').textContent();
      const details = await card.locator('.panel-body p').allTextContents();
      
      cards.push({
        name: name.trim(),
        type: this.extractValue(details, 'Cardholder'),
        availableCredit: this.extractValue(details, 'Available Credit'),
        outstandingBalance: this.extractValue(details, 'Current Balance'),
        creditLimit: this.extractValue(details, 'Credit Limit')
      });
    }
    
    logger.info(`Retrieved details for ${cards.length} cards`);
    return cards;
  }

  extractValue(details, label) {
    const line = details.find(d => d.includes(label));
    if (!line) return '';
    return line.split(':')[1].trim();
  }

  async selectCard(cardName) {
    logger.info(`Selecting card: ${cardName}`);
    const card = this.page.locator(`.panel-default:has-text("${cardName}")`);
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardByNumber(lastFourDigits) {
    logger.info(`Selecting card ending in ${lastFourDigits}`);
    const card = this.page.locator(`.panel-default:has-text("${lastFourDigits}")`);
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardDetailLoad() {
    logger.info('Waiting for card detail to load');
    await this.page.waitForSelector('.card-detail-container', { state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactions() {
    logger.info('Getting transaction list');
    await expect(this.transactionHistory).toBeVisible();
    
    const transactions = [];
    const rows = await this.transactionRows.all();
    
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      transactions.push({
        date: cells[0],
        merchant: cells[1],
        category: cells[2],
        amount: cells[3],
        description: cells[4]
      });
    }
    
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async getSpendingBreakdown() {
    logger.info('Getting spending breakdown');
    await expect(this.spendingBreakdown).toBeVisible();
    
    const breakdown = {};
    const items = await this.page.locator('.breakdown-item').all();
    
    for (const item of items) {
      const text = await item.textContent();
      const parts = text.split(':');
      if (parts.length === 2) {
        breakdown[parts[0].trim()] = parts[1].trim();
      }
    }
    
    return breakdown;
  }

  async getUtilizationMetrics() {
    logger.info('Getting utilization metrics');
    await expect(this.utilizationMetrics).toBeVisible();
    
    const metrics = {};
    const items = await this.page.locator('.utilization-item').all();
    
    for (const item of items) {
      const text = await item.textContent();
      const parts = text.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim().replace(/ /g, '');
        metrics[key] = parts[1].trim();
      }
    }
    
    return metrics;
  }

  async setDateRangeFilter(fromDate, toDate) {
    logger.info(`Setting date range filter: ${fromDate} to ${toDate}`);
    await expect(this.dateFromInput).toBeVisible();
    await this.dateFromInput.fill(fromDate);
    await this.dateToInput.fill(toDate);
  }

  async setCategoryFilter(category) {
    logger.info(`Setting category filter: ${category}`);
    await expect(this.categorySelect).toBeVisible();
    await this.categorySelect.selectOption(category);
  }

  async applyFilters() {
    logger.info('Applying filters');
    // AngularJS automatically applies filters on change, no button click needed
    await this.page.waitForTimeout(500);
  }

  async clearFilters() {
    logger.info('Clearing filters');
    await this.categorySelect.selectOption('');
    await this.dateFromInput.clear();
    await this.dateToInput.clear();
    await this.page.waitForTimeout(500);
  }

  async getFilteredTotal() {
    await expect(this.totalSpend).toBeVisible();
    const total = await this.totalSpend.textContent();
    logger.info(`Filtered total: ${total}`);
    return total.trim();
  }

  async navigateBack() {
    logger.info('Navigating back to card list');
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};