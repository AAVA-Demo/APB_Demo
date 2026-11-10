const { expect } = require('@playwright/test');

exports.PortfolioPage = class PortfolioPage {
  constructor(page) {
    this.page = page;
    
    this.portfolioNavLink = page.locator('a[href*="portfolio"], button:has-text("Portfolio")');
    this.portfolioContainer = page.locator('.portfolio-container, [data-testid="portfolio-container"]');
    this.cardTile = page.locator('.card-tile, [data-testid="card-tile"]');
    this.emptyStateMessage = page.locator('.empty-state, [data-testid="empty-state"]');
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"]');
    this.serviceErrorMessage = page.locator('.service-error, [data-testid="service-error"]');
    this.stackTraceElement = page.locator('.stack-trace, pre');
    this.cardDetailsModal = page.locator('.modal, [data-testid="card-details-modal"]');
    this.unauthorizedAccessMessage = page.locator('.unauthorized-message, [data-testid="unauthorized"]');
    this.sensitiveCardData = page.locator('.card-number-full, [data-testid="full-card-number"]');
    this.nullValueError = page.locator('text=/null/i');
    this.undefinedValueError = page.locator('text=/undefined/i');
    this.loadingSpinner = page.locator('.spinner, [data-testid="loading"]');
  }

  async navigateToPortfolio() {
    await this.portfolioNavLink.click();
  }

  async waitForPortfolioLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.portfolioContainer).toBeVisible({ timeout: 5000 });
  }

  async waitForErrorMessage() {
    await expect(this.serviceErrorMessage).toBeVisible({ timeout: 10000 });
  }

  async getDisplayedCardCount() {
    await this.page.waitForTimeout(500);
    return await this.cardTile.count();
  }

  async verifyCardDetailsVisible(cardIdentifier) {
    const cardElement = this.page.locator(`.card-tile:has-text("${cardIdentifier}")`);
    await expect(cardElement).toBeVisible();
    
    const creditLimitText = cardElement.locator('text=/credit limit/i');
    const outstandingText = cardElement.locator('text=/outstanding/i');
    const availableText = cardElement.locator('text=/available/i');
    
    await expect(creditLimitText).toBeVisible();
    await expect(outstandingText).toBeVisible();
    await expect(availableText).toBeVisible();
  }

  async selectCard(cardIdentifier) {
    const cardElement = this.page.locator(`.card-tile:has-text("${cardIdentifier}")`);
    await cardElement.click();
  }

  async waitForCardDetailsLoad() {
    await expect(this.cardDetailsModal).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCardDetailField(fieldName, expectedValue) {
    const fieldLocator = this.cardDetailsModal.locator(`text=/.*${fieldName}.*/i`).locator('..');
    await expect(fieldLocator).toContainText(expectedValue);
  }
};
