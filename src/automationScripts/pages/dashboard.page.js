const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Dashboard KPIs
    this.dashboardContainer = page.locator('.dashboard-container');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.totalAvailableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.totalOutstandingKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.totalMonthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    
    // Locators for Credit Card List
    this.creditCardTable = page.locator('.credit-cards-table');
    this.creditCardRows = page.locator('.credit-card-row');
    
    // Locators for Utilization Metrics
    this.utilizationMetricsContainer = page.locator('.utilization-metrics');
    this.availableCreditDisplay = (cardId) => page.locator(`[data-card-id="${cardId}"] .available-credit`);
    this.outstandingAmountDisplay = (cardId) => page.locator(`[data-card-id="${cardId}"] .outstanding-amount`);
    this.lastUpdatedTimestamp = (cardId) => page.locator(`[data-card-id="${cardId}"] .last-updated`);
    
    // Locators for Warning Indicators
    this.warningIndicatorText = (cardId) => page.locator(`[data-card-id="${cardId}"] .warning-message`);
    this.warningIcon = (cardId) => page.locator(`[data-card-id="${cardId}"] .warning-icon`);
    
    // Locators for Messages and Errors
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    // Loading indicator
    this.loadingSpinner = page.locator('.loading-spinner');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    logger.info('Navigated to /dashboard');
  }

  async authenticateUser(userId) {
    // Simulate authentication by setting session storage or cookies
    await this.page.evaluate((id) => {
      sessionStorage.setItem('userId', id);
      sessionStorage.setItem('authToken', 'mock_token_' + id);
    }, userId);
    logger.info(`User ${userId} authenticated`);
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    logger.info('Dashboard loaded successfully');
  }

  async getKPIValues() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.totalAvailableCreditKPI).toBeVisible();
    await expect(this.totalOutstandingKPI).toBeVisible();
    await expect(this.totalMonthlySpendKPI).toBeVisible();

    const kpis = {
      totalCreditLimit: await this.totalCreditLimitKPI.textContent(),
      totalAvailableCredit: await this.totalAvailableCreditKPI.textContent(),
      totalOutstanding: await this.totalOutstandingKPI.textContent(),
      totalMonthlySpend: await this.totalMonthlySpendKPI.textContent()
    };
    logger.info('KPI values retrieved');
    return kpis;
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    const message = await this.noCardsMessage.textContent();
    logger.info('No cards message retrieved');
    return message;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info('Error message retrieved');
    return message;
  }

  async simulateDataSourceError() {
    // Simulate data source error by intercepting API call
    await this.page.route('**/api/creditcards', route => {
      route.abort('failed');
    });
    logger.info('Data source error simulated');
  }

  async getCreditUtilizationMetrics(cardId) {
    await expect(this.availableCreditDisplay(cardId)).toBeVisible();
    await expect(this.outstandingAmountDisplay(cardId)).toBeVisible();

    const utilization = {
      availableCredit: await this.availableCreditDisplay(cardId).textContent(),
      outstandingAmount: await this.outstandingAmountDisplay(cardId).textContent(),
      lastUpdated: await this.lastUpdatedTimestamp(cardId).textContent()
    };
    logger.info(`Credit utilization metrics retrieved for card ${cardId}`);
    return utilization;
  }

  async getWarningIndicator(cardId) {
    await expect(this.warningIndicatorText(cardId)).toBeVisible();
    const warningText = await this.warningIndicatorText(cardId).textContent();
    logger.info(`Warning indicator retrieved for card ${cardId}`);
    return warningText;
  }

  async hasHorizontalScroll() {
    const hasScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    logger.info(`Horizontal scroll check: ${hasScroll}`);
    return hasScroll;
  }

  async isTextTruncated() {
    const isTruncated = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('.utilization-metrics *');
      for (let el of elements) {
        if (el.scrollWidth > el.clientWidth) {
          return true;
        }
      }
      return false;
    });
    logger.info(`Text truncation check: ${isTruncated}`);
    return isTruncated;
  }
};