const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const { WaitUtils } = require('../../utils/wait-utils');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-credit-limit"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding"], .kpi-card:has-text("Outstanding Amount")');
    
    // Dashboard Elements
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"], .dashboard-overview, #dashboard');
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"], .loading-indicator, .spinner');
    this.timeoutMessage = page.locator('[data-testid="timeout-message"], .timeout-message');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry")');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message');
    this.warningIndicator = page.locator('[data-testid="warning-indicator"], .warning-icon, .alert-warning');
    
    // Layout Elements
    this.kpiContainer = page.locator('[data-testid="kpi-container"], .kpi-widgets, .dashboard-kpis');
    this.kpiCards = page.locator('.kpi-card, [data-testid="kpi-card"]');
  }

  async navigate() {
    Logger.info('Navigating to Dashboard page');
    await this.page.goto('/dashboard');
    await WaitUtils.waitForPageLoad(this.page);
  }

  async waitForDashboardLoad() {
    Logger.info('Waiting for dashboard to load');
    await WaitUtils.waitForElementVisible(this.page, this.dashboardContainer);
    await WaitUtils.waitForElementHidden(this.page, this.loadingIndicator);
  }

  async getMonthlySpend() {
    await WaitUtils.waitForElementVisible(this.page, this.monthlySpendKPI);
    const text = await this.monthlySpendKPI.locator('.value, .kpi-value').textContent();
    Logger.info(`Monthly Spend: ${text}`);
    return text.trim();
  }

  async getTotalCreditLimit() {
    await WaitUtils.waitForElementVisible(this.page, this.totalCreditLimitKPI);
    const text = await this.totalCreditLimitKPI.locator('.value, .kpi-value').textContent();
    Logger.info(`Total Credit Limit: ${text}`);
    return text.trim();
  }

  async getAvailableCredit() {
    await WaitUtils.waitForElementVisible(this.page, this.availableCreditKPI);
    const text = await this.availableCreditKPI.locator('.value, .kpi-value').textContent();
    Logger.info(`Available Credit: ${text}`);
    return text.trim();
  }

  async getOutstandingAmount() {
    await WaitUtils.waitForElementVisible(this.page, this.outstandingAmountKPI);
    const text = await this.outstandingAmountKPI.locator('.value, .kpi-value').textContent();
    Logger.info(`Outstanding Amount: ${text}`);
    return text.trim();
  }

  async getAllKPIValues() {
    return {
      monthlySpend: await this.getMonthlySpend(),
      totalCreditLimit: await this.getTotalCreditLimit(),
      availableCredit: await this.getAvailableCredit(),
      outstandingAmount: await this.getOutstandingAmount()
    };
  }

  async getTimeoutMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.timeoutMessage);
    return await this.timeoutMessage.textContent();
  }

  async getErrorMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.errorMessage);
    return await this.errorMessage.textContent();
  }

  async hasRetryButton() {
    return await this.retryButton.isVisible();
  }

  async getNoCardsMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.noCardsMessage);
    return await this.noCardsMessage.textContent();
  }

  async hasIncompleteDataWarning() {
    return await this.warningIndicator.isVisible();
  }

  async getWarningMessage() {
    await WaitUtils.waitForElementVisible(this.page, this.warningIndicator);
    return await this.warningIndicator.textContent();
  }

  async getKPILayout() {
    const containerClass = await this.kpiContainer.getAttribute('class');
    
    if (containerClass.includes('single-column') || containerClass.includes('col-xs-12')) {
      return 'single-column';
    } else if (containerClass.includes('multi-column') || containerClass.includes('col-md-3')) {
      return 'multi-column';
    }
    
    const cardCount = await this.kpiCards.count();
    const firstCardBox = await this.kpiCards.first().boundingBox();
    const secondCardBox = cardCount > 1 ? await this.kpiCards.nth(1).boundingBox() : null;
    
    if (secondCardBox && firstCardBox.y === secondCardBox.y) {
      return 'multi-column';
    }
    
    return 'single-column';
  }

  async hasHorizontalScrollbar() {
    const hasScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    return hasScroll;
  }

  async hasStaticFallbackLayout() {
    const hasTable = await this.page.locator('table.kpi-table, [data-testid="static-kpi-table"]').isVisible();
    return hasTable;
  }
};