const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

exports.CreditUtilizationPage = class CreditUtilizationPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    
    this.creditUtilizationSection = page.locator('.credit-utilization-section');
    this.creditUtilizationNav = page.locator('a[href*="credit-utilization"], button:has-text("Credit Utilization")');
    this.availableCreditCard = (cardName) => page.locator(`[data-card="${cardName}"] [data-testid="available-credit"]`);
    this.outstandingAmountCard = (cardName) => page.locator(`[data-card="${cardName}"] [data-testid="outstanding-amount"]`);
    this.overLimitWarning = page.locator('.over-limit-warning, .alert-warning');
    this.creditLimitDisplay = page.locator('[data-testid="credit-limit"]');
    this.transactionButton = page.locator('button:has-text("New Transaction")');
  }

  async navigateToRealTimeCreditUtilization() {
    this.logger.info('Navigating to Real-Time Credit Utilization section');
    await this.creditUtilizationNav.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.creditUtilizationSection).toBeVisible();
  }

  async verifyAvailableCredit(cardName, expectedAmount) {
    this.logger.info(`Verifying available credit for ${cardName}: ${expectedAmount}`);
    const cardCredit = this.availableCreditCard(cardName);
    await expect(cardCredit).toBeVisible();
    await expect(cardCredit).toContainText(expectedAmount);
  }

  async verifyOutstandingAmount(cardName, expectedAmount) {
    this.logger.info(`Verifying outstanding amount for ${cardName}: ${expectedAmount}`);
    const cardOutstanding = this.outstandingAmountCard(cardName);
    await expect(cardOutstanding).toBeVisible();
    await expect(cardOutstanding).toContainText(expectedAmount);
  }

  async verifyLoadTime(maxLoadTime) {
    const startTime = Date.now();
    await expect(this.creditUtilizationSection).toBeVisible();
    const loadTime = Date.now() - startTime;
    this.logger.info(`Credit utilization data loaded in ${loadTime}ms`);
    expect(loadTime).toBeLessThan(maxLoadTime);
  }

  async verifyCreditLimitExceeded(creditLimit, outstanding) {
    this.logger.info(`Verifying credit limit exceeded - Limit: ${creditLimit}, Outstanding: ${outstanding}`);
    await expect(this.creditLimitDisplay).toContainText(creditLimit);
    const outstandingLocator = this.page.locator('[data-testid="outstanding-amount"]').first();
    await expect(outstandingLocator).toContainText(outstanding);
  }

  async getAvailableCredit() {
    const creditText = await this.page.locator('[data-testid="available-credit"]').first().textContent();
    this.logger.info(`Current available credit: ${creditText}`);
    return creditText;
  }

  async getOutstandingAmount() {
    const outstandingText = await this.page.locator('[data-testid="outstanding-amount"]').first().textContent();
    this.logger.info(`Current outstanding amount: ${outstandingText}`);
    return outstandingText;
  }

  async completeTransaction(amount) {
    this.logger.info(`Completing transaction of ${amount}`);
    await this.transactionButton.click();
    await this.page.locator('input[name="amount"]').fill(amount.replace('$', '').replace(',', ''));
    await this.page.locator('button:has-text("Submit")').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAvailableCreditDecreased(expectedAmount) {
    this.logger.info(`Verifying available credit decreased to: ${expectedAmount}`);
    const creditLocator = this.page.locator('[data-testid="available-credit"]').first();
    await expect(creditLocator).toContainText(expectedAmount);
  }

  async verifyOutstandingAmountIncreased(expectedAmount) {
    this.logger.info(`Verifying outstanding amount increased to: ${expectedAmount}`);
    const outstandingLocator = this.page.locator('[data-testid="outstanding-amount"]').first();
    await expect(outstandingLocator).toContainText(expectedAmount);
  }
};