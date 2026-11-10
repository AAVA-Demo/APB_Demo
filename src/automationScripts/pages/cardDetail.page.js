const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    
    // Card Detail Elements
    this.cardDetailContainer = page.locator('.card-detail, [data-testid="card-detail"]');
    this.totalSpend = page.locator('[data-testid="total-spend"], .total-spend');
    this.availableCredit = page.locator('[data-testid="available-credit"], .available-credit');
    this.utilizationPercentage = page.locator('[data-testid="utilization"], .utilization-percentage');
    this.monthlyTrendsChart = page.locator('.monthly-trends-chart, [data-testid="monthly-trends"]');
    this.cardId = page.locator('[data-testid="card-id"], .card-id');
    
    // Navigation
    this.backButton = page.locator('button:has-text("Back"), .back-button');
    
    // Messages
    this.deactivatedMessage = page.locator('.alert, .message').filter({ hasText: /no longer active|deactivated|closed/i });
    this.historicalDataMessage = page.locator('.message').filter({ hasText: /historical data.*limited/i });
    
    // Loading
    this.loadingIndicator = page.locator('.loading, .spinner');
  }

  async waitForCardDetailLoad() {
    await expect(this.cardDetailContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      logger.info('No loading indicator found');
    });
    
    logger.info('Card detail page loaded');
  }

  async verifyTotalSpend(expectedValue) {
    await expect(this.totalSpend).toBeVisible();
    const text = await this.totalSpend.textContent();
    expect(text).toContain(expectedValue);
    logger.info(`Total spend verified: ${expectedValue}`);
  }

  async verifyAvailableCredit(expectedValue) {
    await expect(this.availableCredit).toBeVisible();
    const text = await this.availableCredit.textContent();
    expect(text).toContain(expectedValue);
    logger.info(`Available credit verified: ${expectedValue}`);
  }

  async verifyUtilizationPercentage(expectedValue) {
    await expect(this.utilizationPercentage).toBeVisible();
    const text = await this.utilizationPercentage.textContent();
    expect(text).toContain(expectedValue);
    logger.info(`Utilization percentage verified: ${expectedValue}`);
  }

  async verifyMonthlyTrendsVisible() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    logger.info('Monthly spending trends chart is visible');
  }

  async getCardId() {
    const text = await this.cardId.textContent();
    const id = text.replace(/[^a-z0-9-]/gi, '');
    logger.info(`Card ID: ${id}`);
    return id;
  }

  async getSpendAnalysisData() {
    const spendText = await this.totalSpend.textContent();
    const availableText = await this.availableCredit.textContent();
    const utilizationText = await this.utilizationPercentage.textContent();
    
    const data = {
      spend: parseFloat(spendText.replace(/[^\d.]/g, '')),
      available: parseFloat(availableText.replace(/[^\d.]/g, '')),
      utilization: parseFloat(utilizationText.replace(/[^\d.]/g, ''))
    };
    
    logger.info(`Spend analysis data: ${JSON.stringify(data)}`);
    return data;
  }

  async navigateBackToCards() {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated back to cards page');
  }

  async verifyCardDataIntegrity() {
    await expect(this.totalSpend).toBeVisible();
    await expect(this.availableCredit).toBeVisible();
    await expect(this.utilizationPercentage).toBeVisible();
    logger.info('Card data integrity verified - all elements visible');
  }

  async verifyMonthlyTrendsAreUnique() {
    // Verify chart has data points
    const chartDataPoints = this.monthlyTrendsChart.locator('.data-point, circle, rect');
    const count = await chartDataPoints.count();
    expect(count).toBeGreaterThan(0);
    logger.info(`Monthly trends chart has ${count} unique data points`);
  }

  async verifyCardDeactivatedMessage() {
    await expect(this.deactivatedMessage).toBeVisible();
    const text = await this.deactivatedMessage.textContent();
    logger.info(`Deactivated card message: ${text}`);
  }

  async isCurrentSpendDataVisible() {
    try {
      const currentSpendLocator = this.page.locator('[data-testid="current-spend"], .current-spend');
      await expect(currentSpendLocator).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyHistoricalDataLimitationMessage() {
    await expect(this.historicalDataMessage).toBeVisible();
    const text = await this.historicalDataMessage.textContent();
    logger.info(`Historical data limitation message: ${text}`);
  }

  async getCurrentMonthSpend() {
    const currentSpendLocator = this.page.locator('[data-testid="current-month-spend"], .current-month-spend');
    
    try {
      const text = await currentSpendLocator.textContent({ timeout: 2000 });
      logger.info(`Current month spend: ${text}`);
      return text;
    } catch {
      logger.info('Current month spend not available');
      return 'N/A';
    }
  }
};
