const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.MyCardsPage = class MyCardsPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.locator('h2:has-text("My Credit Cards")');
    this.cardList = page.locator('.card-summary');
    this.compareCardsButton = page.locator('button:has-text("Compare Cards")');
    this.comparisonView = page.locator('.kpi-widget:has-text("Card Comparison Summary")');
    this.filterControls = page.locator('input[placeholder*="Filter cards"]');
    this.paginationControls = page.locator('.pagination');
    this.maxCardsError = page.locator('.alert:has-text("Maximum 20 cards")');
    this.authErrorMessage = page.locator('.alert:has-text("Invalid or expired token")');
    this.dataLoadError = page.locator('.alert:has-text("Unable to load data")');
    this.spendAnalysisLink = page.locator('a:has-text("Spend Analysis")');
  }

  async navigate() {
    logger.info('Navigating to My Cards page');
    await this.page.goto('https://creditcard-dashboard.example.com/#!/cards');
    await expect(this.pageHeader).toBeVisible();
  }

  async getCardCount() {
    await expect(this.cardList.first()).toBeVisible();
    return await this.cardList.count();
  }

  async getCardNumber(index) {
    const card = this.cardList.nth(index);
    const cardNumber = card.locator('.card-number');
    return await cardNumber.textContent();
  }

  async getCardSpend(index) {
    const card = this.cardList.nth(index);
    const spendElement = card.locator('strong:has-text("Monthly Spend")').locator('..');
    const spendText = await spendElement.textContent();
    return spendText.replace(/[^0-9]/g, '');
  }

  async getCardUtilization(index) {
    const card = this.cardList.nth(index);
    const utilizationBadge = card.locator('.label');
    return await utilizationBadge.textContent();
  }

  async selectSpendAnalysis() {
    logger.info('Selecting spend analysis view');
    await this.spendAnalysisLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getComparisonMetrics() {
    await expect(this.comparisonView).toBeVisible();
    const metrics = [];
    const cardElements = this.cardList;
    const count = await cardElements.count();
    for (let i = 0; i < count; i++) {
      const card = cardElements.nth(i);
      const cardId = await card.getAttribute('data-card-id');
      const spend = await this.getCardSpend(i);
      const utilization = await this.getCardUtilization(i);
      metrics.push({ cardId, spend, utilization });
    }
    return metrics;
  }

  async getComparisonCardCount() {
    await expect(this.comparisonView).toBeVisible();
    return await this.cardList.count();
  }

  async applyFilter(filterText) {
    logger.info(`Applying filter: ${filterText}`);
    await this.filterControls.fill(filterText);
    await this.page.waitForTimeout(500); // Allow filtering to complete
  }
};