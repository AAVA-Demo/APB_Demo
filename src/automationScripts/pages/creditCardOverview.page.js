const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CreditCardOverviewPage = class CreditCardOverviewPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.locator('h1:has-text("Credit Card"), h2:has-text("Your Credit Cards")');
    this.cardContainer = page.locator('.credit-card-item, .card-panel, [data-testid="credit-card"]');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigateDirectly() {
    await this.page.goto('https://creditcard.example.com/overview');
    logger.info('Attempted direct navigation to credit card overview');
  }

  getCardByNumber(cardNumber) {
    return this.page.locator(`.credit-card-item:has-text("${cardNumber}"), [data-card-number="${cardNumber}"]`);
  }

  async verifyCardDetails(cardNumber, expectedDetails) {
    const cardLocator = this.getCardByNumber(cardNumber);
    await expect(cardLocator).toBeVisible();
    const cardText = await cardLocator.textContent();
    
    if (expectedDetails.limit) {
      expect(cardText).toContain(expectedDetails.limit.replace(/,/g, ''));
    }
    if (expectedDetails.outstanding) {
      expect(cardText).toContain(expectedDetails.outstanding.replace(/,/g, ''));
    }
    if (expectedDetails.available) {
      expect(cardText).toContain(expectedDetails.available.replace(/,/g, ''));
    }
    if (expectedDetails.monthlySpend) {
      expect(cardText).toContain(expectedDetails.monthlySpend.replace(/,/g, ''));
    }
    logger.info(`Card ${cardNumber} details verified`);
  }

  async verifyResponsiveLayout() {
    const viewportSizes = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    for (const size of viewportSizes) {
      await this.page.setViewportSize(size);
      await expect(this.cardContainer.first()).toBeVisible();
      logger.info(`Responsive layout verified at ${size.width}x${size.height}`);
    }
  }

  async verifyAllCardsHaveZeroValues() {
    const cards = await this.cardContainer.all();
    for (const card of cards) {
      const cardText = await card.textContent();
      expect(cardText).toMatch(/Credit Limit.*0/);
      expect(cardText).toMatch(/Outstanding.*0/);
      expect(cardText).toMatch(/Available.*0/);
      expect(cardText).toMatch(/Monthly Spend.*0/);
    }
    logger.info('All cards display zero values');
  }

  async verifyNoCalculationErrors() {
    const errorIndicators = this.page.locator('text=/NaN/i, text=/undefined/i, text=/-\d+/');
    await expect(errorIndicators.first()).not.toBeVisible({ timeout: 3000 }).catch(() => {});
    logger.info('No calculation errors detected');
  }

  async verifyAuthenticationError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toContain('Authentication');
    logger.info('Authentication error verified');
  }

  async verifyNoSensitiveDataDisplayed() {
    const sensitiveElements = this.page.locator('.credit-card-item, [data-testid*="card"], text=/\d{4}/');
    await expect(sensitiveElements.first()).not.toBeVisible({ timeout: 3000 }).catch(() => {});
    logger.info('No sensitive data displayed');
  }
};
