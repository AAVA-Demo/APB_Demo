const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.myCardsLink = page.locator('a[href="/my-cards"]');
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardElements = page.locator('[data-testid="card-item"]');
    this.cardWiseSpendAnalysisButton = page.locator('[data-testid="card-wise-spend-analysis-button"]');
    this.comparisonView = page.locator('[data-testid="comparison-view"]');
    this.notificationMessage = page.locator('[data-testid="notification-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.loadMoreButton = page.locator('[data-testid="load-more-button"]');
  }

  async navigateToMyCards() {
    await expect(this.myCardsLink).toBeVisible();
    await this.myCardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardListLoad() {
    await expect(this.cardList).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await expect(this.cardElements.first()).toBeVisible();
    return await this.cardElements.count();
  }

  async getCardNumber(index) {
    const cardElement = this.cardElements.nth(index);
    await expect(cardElement).toBeVisible();
    const cardNumberLocator = cardElement.locator('[data-testid="card-number"]');
    return await cardNumberLocator.textContent();
  }

  async getCardBalance(index) {
    const cardElement = this.cardElements.nth(index);
    await expect(cardElement).toBeVisible();
    const balanceLocator = cardElement.locator('[data-testid="card-balance"]');
    return await balanceLocator.textContent();
  }

  async getCardCreditLimit(index) {
    const cardElement = this.cardElements.nth(index);
    await expect(cardElement).toBeVisible();
    const limitLocator = cardElement.locator('[data-testid="card-credit-limit"]');
    return await limitLocator.textContent();
  }

  getCardElement(index) {
    return this.cardElements.nth(index);
  }

  getCardErrorIndicator(index) {
    return this.cardElements.nth(index).locator('[data-testid="card-error-indicator"]');
  }

  async getCardErrorText(index) {
    const errorIndicator = this.getCardErrorIndicator(index);
    await expect(errorIndicator).toBeVisible();
    return await errorIndicator.textContent();
  }

  getCardRetryButton(index) {
    return this.cardElements.nth(index).locator('[data-testid="card-retry-button"]');
  }

  async clickLoadMoreButton() {
    await expect(this.loadMoreButton).toBeVisible();
    await expect(this.loadMoreButton).toBeEnabled();
    await this.loadMoreButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCardWiseSpendAnalysisButton() {
    await expect(this.cardWiseSpendAnalysisButton).toBeVisible();
    await expect(this.cardWiseSpendAnalysisButton).toBeEnabled();
    await this.cardWiseSpendAnalysisButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForComparisonViewLoad() {
    await expect(this.comparisonView).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getCardSpendingAmount(index) {
    const comparisonCard = this.comparisonView.locator('[data-testid="comparison-card"]').nth(index);
    await expect(comparisonCard).toBeVisible();
    const spendingLocator = comparisonCard.locator('[data-testid="spending-amount"]');
    return await spendingLocator.textContent();
  }

  async getCardUtilizationPercent(index) {
    const comparisonCard = this.comparisonView.locator('[data-testid="comparison-card"]').nth(index);
    await expect(comparisonCard).toBeVisible();
    const utilizationLocator = comparisonCard.locator('[data-testid="utilization-percent"]');
    return await utilizationLocator.textContent();
  }

  getCardSpendingPatternSection(index) {
    return this.comparisonView.locator('[data-testid="comparison-card"]').nth(index).locator('[data-testid="spending-pattern"]');
  }

  async getNotificationText() {
    await expect(this.notificationMessage).toBeVisible();
    return await this.notificationMessage.textContent();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
