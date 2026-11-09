const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.addCardButton = page.locator('[data-testid="add-card-button"]');
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    
    this.highUtilizationWarning = page.locator('[data-testid="high-utilization-warning"]');
    this.moderateUtilizationMessage = page.locator('[data-testid="moderate-utilization-message"]');
    
    this.cardDetailModal = page.locator('[data-testid="card-detail-modal"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.fullyAvailableIndicator = page.locator('[data-testid="fully-available-indicator"]');
  }

  async navigate() {
    logger.info('Navigating to portfolio page');
    await this.page.goto('/portfolio');
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.cardItems.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.cardItems.count();
  }

  async getCardDetails(index) {
    const card = this.cardItems.nth(index);
    await expect(card).toBeVisible();
    
    const cardType = await card.locator('[data-testid="card-type"]').textContent();
    const issuer = await card.locator('[data-testid="card-issuer"]').textContent();
    const lastFourDigits = await card.locator('[data-testid="card-last-four"]').textContent();
    const creditLimit = await card.locator('[data-testid="card-credit-limit"]').textContent();
    const currentBalance = await card.locator('[data-testid="card-current-balance"]').textContent();
    const utilizationPercentage = await card.locator('[data-testid="card-utilization"]').textContent();
    
    return {
      cardType: cardType.trim(),
      issuer: issuer.trim(),
      lastFourDigits: lastFourDigits.trim(),
      creditLimit: creditLimit.trim(),
      currentBalance: currentBalance.trim(),
      utilizationPercentage: utilizationPercentage.trim()
    };
  }

  async waitForCardsToLoad() {
    await this.cardItems.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async getUtilizationIndicator(index) {
    const card = this.cardItems.nth(index);
    const indicator = card.locator('[data-testid="utilization-indicator"]');
    await expect(indicator).toBeVisible();
    
    const classList = await indicator.getAttribute('class');
    
    if (classList.includes('green') || classList.includes('healthy')) {
      return 'green';
    } else if (classList.includes('red') || classList.includes('danger')) {
      return 'red';
    } else if (classList.includes('yellow') || classList.includes('orange') || classList.includes('warning')) {
      return 'yellow';
    }
    
    return 'unknown';
  }

  async clickCard(index) {
    logger.info(`Clicking card at index ${index}`);
    const card = this.cardItems.nth(index);
    await card.click();
    await this.page.waitForTimeout(500);
  }

  async getCardDetailModalInfo() {
    await expect(this.cardDetailModal).toBeVisible();
    
    const cardType = await this.cardDetailModal.locator('[data-testid="modal-card-type"]').textContent();
    const creditLimit = await this.cardDetailModal.locator('[data-testid="modal-credit-limit"]').textContent();
    const currentBalance = await this.cardDetailModal.locator('[data-testid="modal-current-balance"]').textContent();
    const availableCredit = await this.cardDetailModal.locator('[data-testid="modal-available-credit"]').textContent();
    const utilizationPercentage = await this.cardDetailModal.locator('[data-testid="modal-utilization"]').textContent();
    
    return {
      cardType: cardType.trim(),
      creditLimit: creditLimit.trim(),
      currentBalance: currentBalance.trim(),
      availableCredit: availableCredit.trim(),
      utilizationPercentage: utilizationPercentage.trim()
    };
  }
};
