const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardManagementPage = class CardManagementPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.cardManagementTab = page.locator('[data-testid="card-management-tab"]');
    this.cardListContainer = page.locator('[data-testid="card-list-container"]');
    this.cardDetailContainer = page.locator('[data-testid="card-detail-container"]');
    
    // Card List Locators
    this.cardItem = page.locator('[data-testid="card-item"]');
    this.cardNumber = page.locator('[data-testid="card-number"]');
    this.cardType = page.locator('[data-testid="card-type"]');
    this.cardIssuer = page.locator('[data-testid="card-issuer"]');
    this.creditLimit = page.locator('[data-testid="credit-limit"]');
    this.currentBalance = page.locator('[data-testid="current-balance"]');
    this.availableCredit = page.locator('[data-testid="available-credit"]');
    
    // Card Detail Locators
    this.viewSpendAnalysisButton = page.locator('[data-testid="view-spend-analysis-button"]');
    this.viewTransactionsButton = page.locator('[data-testid="view-transactions-button"]');
    this.cardStatusBadge = page.locator('[data-testid="card-status-badge"]');
    this.cardExpiryDate = page.locator('[data-testid="card-expiry-date"]');
    
    // Analysis Section Locators
    this.analysisSection = page.locator('[data-testid="analysis-section"]');
    this.cardMonthlySpend = page.locator('[data-testid="card-monthly-spend"]');
    this.categoryBreakdownContainer = page.locator('[data-testid="category-breakdown-container"]');
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.transactionCount = page.locator('[data-testid="transaction-count"]');
    this.averageTransaction = page.locator('[data-testid="average-transaction"]');
    this.analysisPieChart = page.locator('[data-testid="analysis-pie-chart"]');
    
    // Message Locators
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.warningBanner = page.locator('[data-testid="warning-banner"]');
    
    // Additional Locators
    this.monthPicker = page.locator('[data-testid="month-picker"]');
    this.syncTimestamp = page.locator('[data-testid="sync-timestamp"]');
    this.retrySyncButton = page.locator('[data-testid="retry-sync-button"]');
    this.reactivationLink = page.locator('[data-testid="reactivation-link"]');
    this.updateCardLink = page.locator('[data-testid="update-card-link"]');
  }

  async navigate() {
    await this.page.goto('/cards');
    logger.info('Navigated to Card Management');
  }

  async navigateWithUser(userId) {
    await this.page.goto(`/cards?userId=${userId}`);
    logger.info(`Navigated to Card Management with user: ${userId}`);
  }

  async navigateToCardAnalysis(cardId) {
    await this.page.goto(`/cards/${cardId}/analysis`);
    logger.info(`Navigated to analysis for card: ${cardId}`);
  }

  async waitForCardListLoad() {
    await expect(this.cardListContainer).toBeVisible({ timeout: 10000 });
    logger.info('Card list loaded');
  }

  async waitForCardDetailLoad() {
    await expect(this.cardDetailContainer).toBeVisible({ timeout: 10000 });
    logger.info('Card detail loaded');
  }

  async waitForAnalysisLoad() {
    await expect(this.analysisSection).toBeVisible({ timeout: 10000 });
    logger.info('Analysis section loaded');
  }

  async selectCard(cardId) {
    const card = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    await card.click();
    logger.info(`Selected card: ${cardId}`);
  }

  async clickViewSpendAnalysis() {
    await expect(this.viewSpendAnalysisButton).toBeVisible();
    await this.viewSpendAnalysisButton.click();
    logger.info('Clicked View Spend Analysis');
  }

  async getCardMonthlySpend() {
    await expect(this.cardMonthlySpend).toBeVisible();
    return await this.cardMonthlySpend.textContent();
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdownContainer).toBeVisible();
    const categories = await this.categoryItem.all();
    const breakdown = {};
    for (const cat of categories) {
      const name = await cat.locator('[data-testid="category-name"]').textContent();
      const amount = await cat.locator('[data-testid="category-amount"]').textContent();
      breakdown[name.trim()] = amount.trim();
    }
    return breakdown;
  }

  async getTransactionCount() {
    await expect(this.transactionCount).toBeVisible();
    const countText = await this.transactionCount.textContent();
    return parseInt(countText.match(/\d+/)[0]);
  }

  async getAverageTransaction() {
    await expect(this.averageTransaction).toBeVisible();
    return await this.averageTransaction.textContent();
  }

  async hasTransactionsFromOtherCards() {
    const transactions = await this.page.locator('[data-testid="transaction-item"]').all();
    for (const txn of transactions) {
      const cardId = await txn.getAttribute('data-card-id');
      if (cardId !== 'card-001') return true;
    }
    return false;
  }

  async getCategoryPercentages() {
    await expect(this.categoryBreakdownContainer).toBeVisible();
    const categories = await this.categoryItem.all();
    const percentages = {};
    for (const cat of categories) {
      const name = await cat.locator('[data-testid="category-name"]').textContent();
      const percentage = await cat.locator('[data-testid="category-percentage"]').textContent();
      percentages[name.trim()] = percentage.trim();
    }
    return percentages;
  }

  async getTotalPercentage() {
    const totalElem = this.page.locator('[data-testid="total-percentage"]');
    await expect(totalElem).toBeVisible();
    return await totalElem.textContent();
  }

  async getPieChartSegments() {
    const segments = await this.analysisPieChart.locator('[data-testid="pie-segment"]').all();
    const segmentData = [];
    for (const segment of segments) {
      const category = await segment.getAttribute('data-category');
      segmentData.push({ category });
    }
    return segmentData;
  }

  async getCategoryPercentage(categoryName) {
    const category = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    const percentage = await category.locator('[data-testid="category-percentage"]').textContent();
    return percentage.trim();
  }

  async getNoTransactionsMessage() {
    await expect(this.noTransactionsMessage).toBeVisible();
    return await this.noTransactionsMessage.textContent();
  }

  async areAllCategoriesZero() {
    const categories = await this.categoryItem.all();
    for (const cat of categories) {
      const amount = await cat.locator('[data-testid="category-amount"]').textContent();
      if (amount.trim() !== '$0.00') return false;
    }
    return true;
  }

  async getPieChartEmptyState() {
    const emptyState = this.page.locator('[data-testid="pie-chart-empty-state"]');
    await expect(emptyState).toBeVisible();
    return await emptyState.textContent();
  }

  async isMonthPickerVisible() {
    return await this.monthPicker.isVisible();
  }

  async findDeactivatedCard() {
    const cards = await this.cardItem.all();
    for (const card of cards) {
      const status = await card.locator('[data-testid="card-status-badge"]').textContent();
      if (status.includes('Deactivated')) {
        const cardId = await card.getAttribute('data-card-id');
        return { id: cardId, status: 'Deactivated' };
      }
    }
    return null;
  }

  async isSpendAnalysisButtonDisabled() {
    const isDisabled = await this.viewSpendAnalysisButton.getAttribute('disabled');
    return isDisabled !== null;
  }

  async attemptClickSpendAnalysis() {
    try {
      await this.viewSpendAnalysisButton.click({ timeout: 1000 });
    } catch (error) {
      logger.info('Button click prevented (expected for disabled button)');
    }
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isAnalysisSectionVisible() {
    return await this.analysisSection.isVisible();
  }

  async getCardStatusBadge(cardId = null) {
    let badge;
    if (cardId) {
      badge = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"] [data-testid="card-status-badge"]`);
    } else {
      badge = this.cardStatusBadge;
    }
    await expect(badge).toBeVisible();
    const text = await badge.textContent();
    const color = await badge.evaluate(el => window.getComputedStyle(el).backgroundColor);
    return { text: text.trim(), color };
  }

  async getReactivationLink() {
    await expect(this.reactivationLink).toBeVisible();
    return await this.reactivationLink.textContent();
  }

  async getCardCount() {
    return await this.cardItem.count();
  }

  async getAllCardNumbers() {
    const cards = await this.cardItem.all();
    const numbers = [];
    for (const card of cards) {
      const number = await card.locator('[data-testid="card-number"]').textContent();
      numbers.push(number.trim());
    }
    return numbers;
  }

  async getAllCreditLimits() {
    const cards = await this.cardItem.all();
    const limits = [];
    for (const card of cards) {
      const limit = await card.locator('[data-testid="credit-limit"]').textContent();
      limits.push(limit.trim());
    }
    return limits;
  }

  async getAllCurrentBalances() {
    const cards = await this.cardItem.all();
    const balances = [];
    for (const card of cards) {
      const balance = await card.locator('[data-testid="current-balance"]').textContent();
      balances.push(balance.trim());
    }
    return balances;
  }

  async getCardDetails(cardId) {
    const card = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"]`);
    await expect(card).toBeVisible();
    const availableCredit = await card.locator('[data-testid="available-credit"]').textContent();
    return { availableCredit: availableCredit.trim() };
  }

  async getAllCardDetails() {
    const cards = await this.cardItem.all();
    const allDetails = [];
    for (const card of cards) {
      const type = await card.locator('[data-testid="card-type"]').textContent();
      const issuer = await card.locator('[data-testid="card-issuer"]').textContent();
      allDetails.push({ type: type.trim(), issuer: issuer.trim() });
    }
    return allDetails;
  }

  async isCardListScrollable() {
    const scrollHeight = await this.cardListContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await this.cardListContainer.evaluate(el => el.clientHeight);
    return scrollHeight > clientHeight;
  }

  async waitForAllCardsLoaded() {
    await expect(this.cardItem.first()).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('All cards loaded');
  }

  async areAllCardDetailsPopulated() {
    const cards = await this.cardItem.all();
    for (const card of cards) {
      const number = await card.locator('[data-testid="card-number"]').textContent();
      const limit = await card.locator('[data-testid="credit-limit"]').textContent();
      const balance = await card.locator('[data-testid="current-balance"]').textContent();
      if (!number || !limit || !balance) return false;
    }
    return true;
  }

  async isPageResponsive() {
    await this.page.waitForTimeout(500);
    return await this.cardListContainer.isVisible();
  }

  async mockCardIssuerServiceFailure() {
    await this.page.route('**/api/cards/issuer/**', route => route.abort());
    logger.info('Card issuer service failure mocked');
  }

  async getWarningBanner() {
    await expect(this.warningBanner).toBeVisible();
    return await this.warningBanner.textContent();
  }

  async getAllSyncTimestamps() {
    const timestamps = await this.syncTimestamp.all();
    const timestampTexts = [];
    for (const ts of timestamps) {
      timestampTexts.push(await ts.textContent());
    }
    return timestampTexts;
  }

  async hasRealTimeIndicators() {
    const indicator = this.page.locator('[data-testid="real-time-indicator"]');
    return await indicator.isVisible();
  }

  async isRetrySyncButtonVisible() {
    return await this.retrySyncButton.isVisible();
  }

  async clickRetrySyncButton() {
    await expect(this.retrySyncButton).toBeEnabled();
    await this.retrySyncButton.click();
    logger.info('Retry Sync button clicked');
  }

  async findExpiredCard() {
    const cards = await this.cardItem.all();
    for (const card of cards) {
      const status = await card.locator('[data-testid="card-status-badge"]').textContent();
      if (status.includes('Expired')) {
        const cardNumber = await card.locator('[data-testid="card-number"]').textContent();
        return { cardNumber: cardNumber.trim() };
      }
    }
    return null;
  }

  async getCardExpiryDate(cardId) {
    const card = this.page.locator(`[data-testid="card-item"][data-card-id="${cardId}"]`);
    const expiry = await card.locator('[data-testid="card-expiry-date"]').textContent();
    return expiry.trim();
  }

  async isViewTransactionsButtonDisabled() {
    const isDisabled = await this.viewTransactionsButton.getAttribute('disabled');
    return isDisabled !== null;
  }

  async getTransactionButtonTooltip() {
    await this.viewTransactionsButton.hover();
    const tooltip = this.page.locator('[data-testid="button-tooltip"]');
    await expect(tooltip).toBeVisible();
    return await tooltip.textContent();
  }

  async getUpdateCardLink() {
    await expect(this.updateCardLink).toBeVisible();
    return await this.updateCardLink.textContent();
  }
};