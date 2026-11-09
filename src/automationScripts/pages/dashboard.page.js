const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendCard = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitCard = page.locator('[data-testid="kpi-total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditCard = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountCard = page.locator('[data-testid="kpi-outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    this.errorMessageContainer = page.locator('[data-testid="error-message"], .alert-danger, .error-message');
    this.warningIndicator = page.locator('[data-testid="warning-indicator"], .warning-icon, text=/Over Limit/i');
    this.cardsNavLink = page.locator('a[href*="cards"], nav a:has-text("Cards"), nav a:has-text("My Cards")');
  }

  async waitForDashboardLoad() {
    await expect(this.monthlySpendCard).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendCard).toBeVisible();
    const text = await this.monthlySpendCard.locator('h2, .kpi-value, [data-testid="monthly-spend-value"]').textContent();
    const numericValue = parseFloat(text.replace(/[^0-9.-]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  }

  async getMonthlySpendFormatted() {
    await expect(this.monthlySpendCard).toBeVisible();
    const text = await this.monthlySpendCard.locator('h2, .kpi-value, [data-testid="monthly-spend-value"]').textContent();
    return text.trim();
  }

  async isMonthlySpendCardVisible() {
    return await this.monthlySpendCard.isVisible();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditCard).toBeVisible();
    const text = await this.availableCreditCard.locator('h2, .kpi-value, [data-testid="available-credit-value"]').textContent();
    const numericValue = parseFloat(text.replace(/[^0-9.-]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  }

  async getAvailableCreditFormatted() {
    await expect(this.availableCreditCard).toBeVisible();
    const text = await this.availableCreditCard.locator('h2, .kpi-value, [data-testid="available-credit-value"]').textContent();
    return text.trim();
  }

  async getErrorMessage() {
    if (await this.errorMessageContainer.isVisible()) {
      return await this.errorMessageContainer.textContent();
    }
    return null;
  }

  async isWarningIndicatorVisible() {
    return await this.warningIndicator.isVisible();
  }

  async checkForJavaScriptErrors(page) {
    let hasError = false;
    page.on('pageerror', (error) => {
      console.error('JavaScript error:', error);
      hasError = true;
    });
    return hasError;
  }

  async navigateToCardsSection() {
    await this.cardsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isInactiveCardStatusVisible() {
    const inactiveStatus = this.page.locator('text=/Inactive|Suspended/i, [data-testid="card-status"]:has-text("Inactive")');
    return await inactiveStatus.isVisible();
  }
};
