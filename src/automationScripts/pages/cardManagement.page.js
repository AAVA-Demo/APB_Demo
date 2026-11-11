const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {

  constructor(page) {
    this.page = page;
    
    // Card List Locators
    this.cardTiles = page.locator('[data-testid="card-tile"]');
    this.cardNumbers = page.locator('[data-testid="card-number"]');
    this.issuerNames = page.locator('[data-testid="issuer-name"]');
    this.expiryDates = page.locator('[data-testid="expiry-date"]');
    
    // Empty State Locators
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    
    // Filter and Search Locators
    this.filterInput = page.locator('[data-testid="filter-input"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters"]');
    
    // Card Details Locators
    this.totalSpendValue = page.locator('[data-testid="total-spend"]');
    this.transactionCountValue = page.locator('[data-testid="transaction-count"]');
    this.categoryBreakdownSection = page.locator('[data-testid="category-breakdown"]');
    this.categoryItems = page.locator('[data-testid="category-item"]');
    this.spendingPatternsSection = page.locator('[data-testid="spending-patterns"]');
    this.spendingPatternsEmptyState = page.locator('[data-testid="spending-patterns-empty"]');
    
    // Page Elements
    this.pageHeader = page.locator('[data-testid="page-header"]');
    this.navigationMenu = page.locator('[data-testid="navigation-menu"]');
    
    // Console error tracking
    this.consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

  async navigate() {
    logger.info('Navigating to card management page');
    await this.page.goto('/cards');
  }

  async waitForPageLoad() {
    logger.info('Waiting for card management page to load');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async getCardCount() {
    await this.page.waitForTimeout(500);
    const count = await this.cardTiles.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async getMaskedCardNumbers() {
    const numbers = await this.cardNumbers.allTextContents();
    logger.info(`Masked card numbers: ${JSON.stringify(numbers)}`);
    return numbers.map(n => n.trim());
  }

  async getIssuerNames() {
    const issuers = await this.issuerNames.allTextContents();
    logger.info(`Issuer names: ${JSON.stringify(issuers)}`);
    return issuers.map(i => i.trim());
  }

  async getExpiryDates() {
    const dates = await this.expiryDates.allTextContents();
    logger.info(`Expiry dates: ${JSON.stringify(dates)}`);
    return dates.map(d => d.trim());
  }

  async getEmptyStateMessageText() {
    await expect(this.emptyStateMessage).toBeVisible();
    const text = await this.emptyStateMessage.textContent();
    logger.info(`Empty state message: ${text}`);
    return text.trim();
  }

  async applyFilter(filterValue) {
    logger.info(`Applying filter: ${filterValue}`);
    await this.filterInput.fill(filterValue);
    await this.page.waitForTimeout(500);
  }

  async searchCards(searchTerm) {
    logger.info(`Searching cards: ${searchTerm}`);
    await this.searchInput.fill(searchTerm);
    await this.page.waitForTimeout(500);
  }

  async clearFilters() {
    logger.info('Clearing filters');
    await this.clearFiltersButton.click();
    await this.page.waitForTimeout(500);
  }

  async verifyAllCardDetails() {
    logger.info('Verifying all card details are displayed');
    const cardCount = await this.getCardCount();
    expect(cardCount).toBeGreaterThan(0);
    
    for (let i = 0; i < cardCount; i++) {
      await expect(this.cardNumbers.nth(i)).toBeVisible();
      await expect(this.issuerNames.nth(i)).toBeVisible();
      await expect(this.expiryDates.nth(i)).toBeVisible();
    }
  }

  async selectCard(cardNumberSuffix) {
    logger.info(`Selecting card with suffix: ${cardNumberSuffix}`);
    const cardTile = this.page.locator(`[data-testid="card-tile"][data-card-suffix="${cardNumberSuffix}"]`);
    await cardTile.click();
  }

  async waitForCardDetailsLoad() {
    logger.info('Waiting for card details page to load');
    await expect(this.totalSpendValue).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getTotalSpend() {
    await expect(this.totalSpendValue).toBeVisible();
    const value = await this.totalSpendValue.textContent();
    logger.info(`Total Spend: ${value}`);
    return value.trim();
  }

  async getTransactionCount() {
    await expect(this.transactionCountValue).toBeVisible();
    const value = await this.transactionCountValue.textContent();
    logger.info(`Transaction Count: ${value}`);
    return value.trim();
  }

  async getCategoryBreakdown() {
    await this.page.waitForTimeout(500);
    const categoryCount = await this.categoryItems.count();
    const breakdown = [];
    
    for (let i = 0; i < categoryCount; i++) {
      const item = this.categoryItems.nth(i);
      const category = await item.locator('[data-testid="category-name"]').textContent();
      const amount = await item.locator('[data-testid="category-amount"]').textContent();
      breakdown.push({ category: category.trim(), amount: amount.trim() });
    }
    
    logger.info(`Category Breakdown: ${JSON.stringify(breakdown)}`);
    return breakdown;
  }

  async getConsoleErrors() {
    return this.consoleErrors;
  }

};