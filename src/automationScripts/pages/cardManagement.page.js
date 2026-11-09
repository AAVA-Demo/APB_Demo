const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    this.cardList = page.locator('[data-testid="card-list"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.cardAnalysisView = page.locator('[data-testid="card-analysis"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.comparisonView = page.locator('[data-testid="comparison-view"]');
    this.validationMessage = page.locator('[data-testid="validation-message"]');
    this.cardDetailView = page.locator('[data-testid="card-detail"]');
    this.transactionErrorMessage = page.locator('[data-testid="transaction-error"]');
    this.highUtilizationIndicator = page.locator('[data-testid="high-utilization-indicator"]');
    this.compareButton = page.locator('[data-testid="compare-button"]');
  }

  async navigate() {
    await this.page.goto('/cards');
    logger.info('Navigated to card management page');
  }

  async waitForCardListLoad() {
    await expect(this.cardList).toBeVisible({ timeout: 10000 });
    logger.info('Card list loaded');
  }

  async getAllCards() {
    await expect(this.cardList).toBeVisible();
    const cardElements = await this.page.locator('[data-testid="card-item"]').all();
    const cards = [];
    for (const card of cardElements) {
      const maskedNumber = await card.locator('[data-field="masked-number"]').textContent();
      const balance = await card.locator('[data-field="balance"]').textContent();
      const limit = await card.locator('[data-field="limit"]').textContent();
      const utilization = await card.locator('[data-field="utilization"]').textContent();
      cards.push({
        maskedNumber,
        balance: parseFloat(balance.replace(/[^0-9.]/g, '')),
        limit: parseFloat(limit.replace(/[^0-9.]/g, '')),
        utilization: parseFloat(utilization.replace(/[^0-9.]/g, ''))
      });
    }
    return cards;
  }

  async selectCard(index) {
    const cards = await this.page.locator('[data-testid="card-item"]').all();
    await cards[index].click();
    logger.info(`Selected card at index: ${index}`);
  }

  async selectCardByLastFourDigits(lastFour) {
    const card = this.page.locator(`[data-card-last4="${lastFour}"]`);
    await expect(card).toBeVisible();
    await card.click();
    logger.info(`Selected card ending in: ${lastFour}`);
  }

  async selectNewCard() {
    const newCard = this.page.locator('[data-card-status="new"]');
    await expect(newCard).toBeVisible();
    await newCard.click();
    logger.info('Selected new card with no transactions');
  }

  async selectHighUtilizationCard() {
    const highUtilCard = this.page.locator('[data-utilization-high="true"]');
    await expect(highUtilCard).toBeVisible();
    await highUtilCard.click();
    logger.info('Selected high utilization card');
  }

  async getCardAnalysis() {
    await expect(this.cardAnalysisView).toBeVisible();
    const categorySpending = await this.page.locator('[data-testid="category-spending"]').textContent();
    const transactionHistory = await this.page.locator('[data-testid="transaction-history"]').count();
    const utilization = await this.page.locator('[data-testid="utilization"]').textContent();
    return { categorySpending, transactionHistory, utilization };
  }

  async getFinancialMetrics() {
    await expect(this.cardAnalysisView).toBeVisible();
    const limit = await this.page.locator('[data-metric="limit"]').textContent();
    const available = await this.page.locator('[data-metric="available"]').textContent();
    const utilization = await this.page.locator('[data-metric="utilization"]').textContent();
    return {
      limit: parseFloat(limit.replace(/[^0-9.]/g, '')),
      available: parseFloat(available.replace(/[^0-9.]/g, '')),
      utilization: parseFloat(utilization.replace(/[^0-9.]/g, ''))
    };
  }

  async getNoDataMessageText() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async selectCardsForComparison(lastFourArray) {
    for (const lastFour of lastFourArray) {
      const checkbox = this.page.locator(`[data-card-last4="${lastFour}"] input[type="checkbox"]`);
      await expect(checkbox).toBeVisible();
      await checkbox.check();
      logger.info(`Selected card ${lastFour} for comparison`);
    }
  }

  async clickCompareButton() {
    await expect(this.compareButton).toBeVisible();
    await this.compareButton.click();
    logger.info('Clicked compare button');
  }

  async getComparisonData() {
    await expect(this.comparisonView).toBeVisible();
    const cards = await this.page.locator('[data-testid="comparison-card"]').all();
    const comparison = [];
    for (const card of cards) {
      const limit = await card.locator('[data-field="limit"]').textContent();
      const utilization = await card.locator('[data-field="utilization"]').textContent();
      const spending = await card.locator('[data-field="spending"]').textContent();
      comparison.push({
        limit: parseFloat(limit.replace(/[^0-9.]/g, '')),
        utilization: parseFloat(utilization.replace(/[^0-9.]/g, '')),
        spending: parseFloat(spending.replace(/[^0-9.]/g, ''))
      });
    }
    return comparison;
  }

  async getValidationMessageText() {
    await expect(this.validationMessage).toBeVisible();
    return await this.validationMessage.textContent();
  }

  async getCardDetails() {
    await expect(this.cardDetailView).toBeVisible();
    const limit = await this.page.locator('[data-detail="limit"]').textContent();
    const available = await this.page.locator('[data-detail="available"]').textContent();
    const utilization = await this.page.locator('[data-detail="utilization"]').textContent();
    const transactions = await this.page.locator('[data-testid="transaction-item"]').all();
    return {
      limit: parseFloat(limit.replace(/[^0-9.]/g, '')),
      available: parseFloat(available.replace(/[^0-9.]/g, '')),
      utilization: parseFloat(utilization.replace(/[^0-9.]/g, '')),
      recentTransactions: transactions
    };
  }

  async getTransactionErrorText() {
    await expect(this.transactionErrorMessage).toBeVisible();
    return await this.transactionErrorMessage.textContent();
  }

  async getUtilizationRate() {
    const utilizationElement = this.page.locator('[data-metric="utilization"]');
    await expect(utilizationElement).toBeVisible();
    const text = await utilizationElement.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getUtilizationIndicatorColor() {
    await expect(this.highUtilizationIndicator).toBeVisible();
    const color = await this.highUtilizationIndicator.evaluate(el => window.getComputedStyle(el).color);
    if (color.includes('255, 0, 0') || color.includes('red')) return 'red';
    if (color.includes('255, 165, 0') || color.includes('orange')) return 'orange';
    return 'green';
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
