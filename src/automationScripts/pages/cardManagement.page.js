const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const { getBaseUrl } = require('../../data/environment');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Card list container
    this.cardListContainer = page.locator('div[ng-if="!vm.loading&&!vm.error"]');
    
    // Card tiles
    this.cardTiles = page.locator('card-tile[card="card"]');
    
    // Card details (when viewing individual card)
    this.cardDetailsContainer = page.locator('div[ng-if="!vm.loading&&!vm.error&&vm.card"]');
    this.backToCardsButton = page.locator('button:has-text("Back to Cards")');
    
    // Filters
    this.cardTypeFilter = page.locator('select[ng-model="filters.cardType"]');
    this.statusFilter = page.locator('select[ng-model="filters.status"]');
    this.issuerFilter = page.locator('input[ng-model="filters.issuer"]');
    
    // Messages and indicators
    this.emptyStateMessage = page.locator('p.text-center:has-text("No cards found")');
    this.errorMessage = page.locator('div.alert.alert-danger');
    this.loadingIndicator = page.locator('div[ng-if="vm.loading"]');
    
    // Navigation
    this.cardsTab = page.locator('a[href="#!/cards"]');
  }

  async navigate() {
    const baseUrl = getBaseUrl();
    logger.info(`Navigating to Card Management: ${baseUrl}/cards`);
    await this.page.goto(`${baseUrl}/cards`);
    await expect(this.cardListContainer.or(this.loadingIndicator).or(this.emptyStateMessage)).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Card management page loaded');
  }

  async refreshCardList() {
    logger.info('Refreshing card list');
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await expect(this.cardListContainer.or(this.loadingIndicator).or(this.errorMessage).or(this.emptyStateMessage)).toBeVisible({ timeout: 10000 });
    logger.info('Card list refreshed');
  }

  getCardTileByIndex(index) {
    return this.cardTiles.nth(index);
  }

  async selectCard(cardId) {
    logger.info(`Selecting card: ${cardId}`);
    const cardTile = this.page.locator(`card-tile[card.cardId="${cardId}"]`);
    await cardTile.click();
    await expect(this.cardDetailsContainer).toBeVisible({ timeout: 5000 });
    logger.info(`Card ${cardId} selected, details displayed`);
  }

  async goBackToCardList() {
    logger.info('Navigating back to card list');
    await this.backToCardsButton.click();
    await expect(this.cardListContainer).toBeVisible({ timeout: 5000 });
    logger.info('Returned to card list');
  }

  async applyCardTypeFilter(cardType) {
    logger.info(`Applying card type filter: ${cardType}`);
    await this.cardTypeFilter.selectOption(cardType);
    await this.page.waitForTimeout(500);
    logger.info('Card type filter applied');
  }

  async applyStatusFilter(status) {
    logger.info(`Applying status filter: ${status}`);
    await this.statusFilter.selectOption(status);
    await this.page.waitForTimeout(500);
    logger.info('Status filter applied');
  }

  async applyIssuerFilter(issuer) {
    logger.info(`Applying issuer filter: ${issuer}`);
    await this.issuerFilter.fill(issuer);
    await this.page.waitForTimeout(500);
    logger.info('Issuer filter applied');
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    const message = await this.emptyStateMessage.textContent();
    logger.info(`Empty State Message: ${message}`);
    return message.trim();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info(`Error Message: ${message}`);
    return message.trim();
  }

  async waitForCardListLoad() {
    logger.info('Waiting for card list to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.cardListContainer.or(this.errorMessage).or(this.emptyStateMessage)).toBeVisible();
    logger.info('Card list load complete');
  }
};