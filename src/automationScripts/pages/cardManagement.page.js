const { expect } = require('@playwright/test');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardContainer = page.locator('.card-list-container');
    this.cardItems = page.locator('.card-item');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.selectedCardDetails = page.locator('.card-details-panel');
    this.cardBalance = page.locator('[data-testid="card-balance"]');
    this.cardMonthlySpend = page.locator('[data-testid="card-monthly-spend"]');
    this.utilizationRate = page.locator('[data-testid="utilization-rate"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.categoryBreakdown = page.locator('[data-testid="category-breakdown"]');
    this.spendingPatternsMessage = page.locator('[data-testid="spending-patterns-message"]');
  }

  async navigate() {
    await this.page.goto('/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardsToLoad() {
    await expect(this.cardContainer).toBeVisible({ timeout: 10000 });
  }

  async waitForEmptyState() {
    await expect(this.emptyStateMessage).toBeVisible({ timeout: 10000 });
  }

  async waitForCardDetails() {
    await expect(this.selectedCardDetails).toBeVisible({ timeout: 10000 });
  }

  async getCardCount() {
    const cards = await this.cardItems.count();
    return cards;
  }

  async getCardName(index) {
    const card = this.cardItems.nth(index);
    const nameElement = card.locator('[data-testid="card-name"]');
    await expect(nameElement).toBeVisible();
    return await nameElement.textContent();
  }

  async getCardNumber(index) {
    const card = this.cardItems.nth(index);
    const numberElement = card.locator('[data-testid="card-number"]');
    await expect(numberElement).toBeVisible();
    return await numberElement.textContent();
  }

  async getCardIssuer(index) {
    const card = this.cardItems.nth(index);
    const issuerElement = card.locator('[data-testid="card-issuer"]');
    await expect(issuerElement).toBeVisible();
    return await issuerElement.textContent();
  }

  async getCardLimit(index) {
    const card = this.cardItems.nth(index);
    const limitElement = card.locator('[data-testid="card-limit"]');
    await expect(limitElement).toBeVisible();
    return await limitElement.textContent();
  }

  async getCardBalance(index) {
    const card = this.cardItems.nth(index);
    const balanceElement = card.locator('[data-testid="card-balance"]');
    await expect(balanceElement).toBeVisible();
    return await balanceElement.textContent();
  }

  async selectCard(index) {
    const card = this.cardItems.nth(index);
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardById(cardId) {
    const card = this.page.locator(`[data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async getSelectedCardBalance() {
    await expect(this.cardBalance).toBeVisible();
    return await this.cardBalance.textContent();
  }

  async getSelectedCardMonthlySpend() {
    await expect(this.cardMonthlySpend).toBeVisible();
    return await this.cardMonthlySpend.textContent();
  }

  async getUtilizationRate() {
    await expect(this.utilizationRate).toBeVisible();
    return await this.utilizationRate.textContent();
  }

  async getSelectedCardName() {
    const nameElement = this.selectedCardDetails.locator('[data-testid="selected-card-name"]');
    await expect(nameElement).toBeVisible();
    return await nameElement.textContent();
  }

  async hasMonthOverMonthTrends() {
    return await this.trendChart.isVisible();
  }

  async hasCategoryBreakdown() {
    return await this.categoryBreakdown.isVisible();
  }

  async getSpendingPatternsMessage() {
    await expect(this.spendingPatternsMessage).toBeVisible();
    return await this.spendingPatternsMessage.textContent();
  }

  async verifyScrollPerformance() {
    const startY = await this.page.evaluate(() => window.scrollY);
    await this.page.mouse.wheel(0, 500);
    await this.page.waitForTimeout(100);
    const endY = await this.page.evaluate(() => window.scrollY);
    return endY > startY;
  }
};
