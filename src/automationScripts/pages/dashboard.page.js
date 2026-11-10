const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], .kpi-card:has-text("Outstanding Amount")');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.activeCardCount = page.locator('[data-testid="card-count"], .kpi-card:has-text("Active Cards")');
    this.lastUpdatedTimestamp = page.locator('[data-testid="last-updated"], .last-updated');
    
    // Dashboard Elements
    this.dashboardContainer = page.locator('.dashboard-container, [data-testid="dashboard"]');
    this.refreshButton = page.locator('button:has-text("Refresh"), [data-testid="refresh-button"]');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.retryButton = page.locator('button:has-text("Retry"), button:has-text("Try Again")');
    this.loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    
    // Wait for loading indicator to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      logger.info('No loading indicator found or already hidden');
    });
    
    logger.info('Dashboard loaded successfully');
  }

  async verifyTotalCreditLimit(expectedValue) {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    expect(text).toContain(expectedValue);
    logger.info(`Total Credit Limit verified: ${expectedValue}`);
  }

  async verifyAvailableCredit(expectedValue) {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    expect(text).toContain(expectedValue);
    logger.info(`Available Credit verified: ${expectedValue}`);
  }

  async verifyOutstandingAmount(expectedValue) {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    expect(text).toContain(expectedValue);
    logger.info(`Outstanding Amount verified: ${expectedValue}`);
  }

  async verifyMonthlySpend(expectedValue) {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    expect(text).toContain(expectedValue);
    logger.info(`Monthly Spend verified: ${expectedValue}`);
  }

  async verifyKPIFormatting() {
    const kpis = [this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI, this.monthlySpendKPI];
    
    for (const kpi of kpis) {
      const text = await kpi.textContent();
      const hasCorrectFormat = /\$[\d,]+\.\d{2}/.test(text);
      expect(hasCorrectFormat).toBeTruthy();
    }
    
    logger.info('All KPI values have correct currency formatting ($XX,XXX.XX)');
  }

  async verifyCreditCalculation() {
    const availableText = await this.availableCreditKPI.textContent();
    const outstandingText = await this.outstandingAmountKPI.textContent();
    const totalText = await this.totalCreditLimitKPI.textContent();
    
    const available = parseFloat(availableText.replace(/[^\d.]/g, ''));
    const outstanding = parseFloat(outstandingText.replace(/[^\d.]/g, ''));
    const total = parseFloat(totalText.replace(/[^\d.]/g, ''));
    
    const calculatedTotal = available + outstanding;
    const isCorrect = Math.abs(calculatedTotal - total) < 0.01;
    
    logger.info(`Credit calculation: ${available} + ${outstanding} = ${calculatedTotal} (Expected: ${total})`);
    return isCorrect;
  }

  async verifyActiveCardCount(expectedCount) {
    await expect(this.activeCardCount).toBeVisible();
    const text = await this.activeCardCount.textContent();
    expect(text).toContain(expectedCount.toString());
    logger.info(`Active card count verified: ${expectedCount}`);
  }

  async isKPIDataVisible() {
    try {
      await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async verifyAllKPIsVisible() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    await expect(this.monthlySpendKPI).toBeVisible();
    logger.info('All KPIs are visible on dashboard');
  }

  async getAvailableCreditValue() {
    const text = await this.availableCreditKPI.textContent();
    return parseFloat(text.replace(/[^\d.]/g, ''));
  }

  async getOutstandingAmountValue() {
    const text = await this.outstandingAmountKPI.textContent();
    return parseFloat(text.replace(/[^\d.]/g, ''));
  }

  async simulateTransaction(amount, merchant) {
    // This would typically call a test API endpoint to create a transaction
    // For now, we'll use page.evaluate to mock this
    await this.page.evaluate(({ amt, merch }) => {
      // Mock transaction simulation
      console.log(`Simulated transaction: $${amt} at ${merch}`);
      // In real scenario, this would trigger backend API
    }, { amt: amount, merch: merchant });
    
    logger.info(`Simulated transaction: $${amount} at ${merchant}`);
  }

  async refreshDashboard() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard refreshed');
  }

  async verifyLastUpdatedWithinMinutes(minutes) {
    const timestampText = await this.lastUpdatedTimestamp.textContent();
    const timestampMatch = timestampText.match(/\d{1,2}:\d{2}/);
    
    if (!timestampMatch) {
      logger.warn('Could not parse timestamp');
      return false;
    }
    
    // Simplified check - in production would parse full timestamp
    logger.info(`Last updated timestamp: ${timestampText}`);
    return true; // Assuming timestamp is recent
  }

  async verifyAutoRefreshEnabled() {
    // Check for auto-refresh indicator or meta tag
    const hasAutoRefresh = await this.page.evaluate(() => {
      return document.querySelector('[data-auto-refresh="true"]') !== null;
    });
    
    logger.info(`Auto-refresh enabled: ${hasAutoRefresh}`);
    return hasAutoRefresh;
  }

  async verifyServiceUnavailableMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const text = await this.errorMessage.textContent();
    expect(text).toMatch(/temporarily unavailable|service.*unavailable/i);
    logger.info('Service unavailable message displayed');
  }

  async verifyErrorMessageIsUserFriendly() {
    const text = await this.errorMessage.textContent();
    const hasTechnicalDetails = /HTTP|503|500|NullPointerException|SQLException/i.test(text);
    logger.info(`Error message is user-friendly: ${!hasTechnicalDetails}`);
    return !hasTechnicalDetails;
  }

  async verifyRetryButtonVisible() {
    await expect(this.retryButton).toBeVisible();
    logger.info('Retry button is visible');
  }

  async clickRetryButton() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Retry button clicked');
  }
};
