const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    // Navigation elements
    this.cardsLink = page.locator('a[href*="cards"], nav a:has-text("Cards"), nav a:has-text("My Cards")');
    this.analyticsLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")');
    
    // KPI elements
    this.totalCreditLimitKpi = page.locator('[data-testid="total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKpi = page.locator('[data-testid="available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKpi = page.locator('[data-testid="outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    this.monthlySpendKpi = page.locator('[data-testid="monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.creditUtilizationKpi = page.locator('[data-testid="credit-utilization"], .kpi-card:has-text("Credit Utilization")');
    
    // Progress and visual indicators
    this.progressIndicator = page.locator('.progress-bar, [role="progressbar"]');
    
    // Messages
    this.noCardsMessage = page.locator('.alert-info:has-text("No credit cards"), .message:has-text("No credit cards")');
    this.noSpendingMessage = page.locator('.alert-info:has-text("No spending activity"), .message:has-text("No spending activity")');
    
    // Error elements
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.monthlySpendErrorMessage = page.locator('.monthly-spend-error, [data-testid="monthly-spend-error"]');
    this.monthlySpendRetryButton = page.locator('[data-testid="monthly-spend-retry"], button:has-text("Retry")').first();
    
    // Loading indicators
    this.loadingSpinner = page.locator('.spinner, .loading, [data-testid="loading"]');
  }

  async navigateToCards() {
    await this.cardsLink.click();
    await this.page.waitForURL(/.*cards/, { timeout: 5000 });
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForURL(/.*analytics/, { timeout: 5000 });
  }

  async waitForKpiToLoad() {
    // Wait for loading spinner to disappear if present
    await this.page.waitForTimeout(500);
    const spinnerVisible = await this.loadingSpinner.isVisible().catch(() => false);
    if (spinnerVisible) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    // Wait for at least one KPI to be visible
    await expect(this.totalCreditLimitKpi.or(this.monthlySpendKpi)).toBeVisible({ timeout: 10000 });
  }

  async getTotalCreditLimit() {
    await expect(this.totalCreditLimitKpi).toBeVisible();
    return await this.totalCreditLimitKpi.textContent();
  }

  async getAvailableCredit() {
    await expect(this.availableCreditKpi).toBeVisible();
    return await this.availableCreditKpi.textContent();
  }

  async getOutstandingAmount() {
    await expect(this.outstandingAmountKpi).toBeVisible();
    return await this.outstandingAmountKpi.textContent();
  }

  async getMonthlySpend() {
    await expect(this.monthlySpendKpi).toBeVisible();
    return await this.monthlySpendKpi.textContent();
  }

  async getCreditUtilization() {
    await expect(this.creditUtilizationKpi).toBeVisible();
    return await this.creditUtilizationKpi.textContent();
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getNoSpendingMessage() {
    await expect(this.noSpendingMessage).toBeVisible();
    return await this.noSpendingMessage.textContent();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForTimeout(1000);
  }

  async waitForMonthlySpendError() {
    await expect(this.monthlySpendErrorMessage).toBeVisible({ timeout: 10000 });
  }

  async getMonthlySpendErrorMessage() {
    await expect(this.monthlySpendErrorMessage).toBeVisible();
    return await this.monthlySpendErrorMessage.textContent();
  }

  async clickMonthlySpendRetry() {
    await this.monthlySpendRetryButton.click();
    await this.page.waitForTimeout(1000);
  }
};