const { expect } = require('@playwright/test');

exports.MultiCardPage = class MultiCardPage {
  constructor(page) {
    this.page = page;
    // Card list elements
    this.cardItems = page.locator('.card-item, [data-testid="card-item"]');
    this.filterInput = page.locator('input[placeholder*="Filter"], input[type="text"]').first();
    
    // Card detail elements
    this.cardNumber = page.locator('.card-number, [data-testid="card-number"]');
    this.cardType = page.locator('.card-type, [data-testid="card-type"]');
    this.issuer = page.locator('.issuer, [data-testid="issuer"]');
    this.creditLimit = page.locator('.credit-limit, [data-testid="credit-limit"]');
    this.currentBalance = page.locator('.current-balance, [data-testid="current-balance"]');
    this.availableCredit = page.locator('.available-credit, [data-testid="available-credit"]');
    this.status = page.locator('.status, [data-testid="status"]');
    
    // Spend analysis elements
    this.yearlySpend = page.locator('[data-testid="yearly-spend"], .yearly-spend');
    this.categoryBreakdown = page.locator('.category-breakdown, [data-testid="category-breakdown"]');
    this.categoryItem = page.locator('.category-item, [data-testid="category-item"]');
    this.trendChart = page.locator('canvas, .chart, [data-testid="trend-chart"]');
    
    // Messages
    this.noSpendingDataMessage = page.locator('.alert-info:has-text("No spending data"), .message:has-text("No spending data")');
    
    // Error elements
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.spendingErrorMessage = page.locator('.spending-error, [data-testid="spending-error"]');
    this.spendingRetryButton = page.locator('[data-testid="spending-retry"], button:has-text("Retry")').first();
    
    // Loading indicators
    this.loadingSpinner = page.locator('.spinner, .loading, [data-testid="loading"]');
  }

  async waitForCardsToLoad() {
    await this.page.waitForTimeout(500);
    const spinnerVisible = await this.loadingSpinner.isVisible().catch(() => false);
    if (spinnerVisible) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    // Wait for cards to be visible or error message
    await this.page.waitForSelector('.card-item, .error-message', { timeout: 10000 });
  }

  async getCardCount() {
    return await this.cardItems.count();
  }

  async getAllCards() {
    const count = await this.getCardCount();
    const cards = [];
    for (let i = 0; i < count; i++) {
      const card = this.cardItems.nth(i);
      cards.push({
        cardNumber: card.locator('.card-number'),
        cardType: card.locator('.card-type'),
        issuer: card.locator('.issuer'),
        creditLimit: card.locator('.credit-limit'),
        currentBalance: card.locator('.current-balance'),
        availableCredit: card.locator('.available-credit'),
        status: card.locator('.status')
      });
    }
    return cards;
  }

  async getCardByIndex(index) {
    const card = this.cardItems.nth(index);
    return {
      cardNumber: card.locator('.card-number'),
      cardType: card.locator('.card-type'),
      issuer: card.locator('.issuer'),
      creditLimit: card.locator('.credit-limit'),
      currentBalance: card.locator('.current-balance'),
      availableCredit: card.locator('.available-credit'),
      status: card.locator('.status')
    };
  }

  async filterCards(filterText) {
    await this.filterInput.fill(filterText);
    await this.page.waitForTimeout(500);
  }

  async waitForFilterResults() {
    await this.page.waitForTimeout(1000);
  }

  async selectCard(cardNumber) {
    const card = this.page.locator(`.card-item:has-text("${cardNumber}")`);
    await card.click();
    await this.page.waitForURL(/.*cards\/\d+/, { timeout: 5000 });
  }

  async selectCardByIndex(index) {
    await this.cardItems.nth(index).click();
    await this.page.waitForURL(/.*cards\/\d+/, { timeout: 5000 });
  }

  async waitForSpendAnalysisToLoad() {
    await this.page.waitForTimeout(500);
    const spinnerVisible = await this.loadingSpinner.isVisible().catch(() => false);
    if (spinnerVisible) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    await this.page.waitForSelector('[data-testid="yearly-spend"], .yearly-spend, .spending-error', { timeout: 10000 });
  }

  async getYearlySpend() {
    await expect(this.yearlySpend).toBeVisible();
    return await this.yearlySpend.textContent();
  }

  async getAllCategories() {
    return await this.categoryItem.all();
  }

  async categoryExists(categoryName) {
    const category = this.page.locator(`.category-item:has-text("${categoryName}")`);
    return await category.isVisible().catch(() => false);
  }

  async getTrendChartMonths() {
    // This would need to interact with the chart library's data
    // For now, return a mock implementation
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    return chartData;
  }

  async getNoSpendingDataMessage() {
    await expect(this.noSpendingDataMessage).toBeVisible();
    return await this.noSpendingDataMessage.textContent();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async waitForSpendingErrorMessage() {
    await expect(this.spendingErrorMessage).toBeVisible({ timeout: 10000 });
  }

  async getSpendingErrorMessage() {
    await expect(this.spendingErrorMessage).toBeVisible();
    return await this.spendingErrorMessage.textContent();
  }
};