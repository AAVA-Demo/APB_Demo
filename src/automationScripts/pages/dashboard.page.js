const { expect } = require('@playwright/test');
const { Logger } = require('../utils/logger');
const config = require('../../../data/config.json');

const logger = new Logger('DashboardPage');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard container
    this.dashboardContainer = page.locator('#dashboard');
    
    // KPI card locators
    this.kpiCards = page.locator('.kpi-card');
    this.kpiValue = (label) => page.locator(`.kpi-card:has-text("${label}") .kpi-value`);
    this.kpiLabel = (label) => page.locator(`.kpi-card:has-text("${label}") .kpi-label`);
    
    // Card portfolio locators
    this.cardContainer = page.locator('.card-item').first();
    this.cardItems = page.locator('.card-item');
    this.cardName = (index) => page.locator('.card-item').nth(index).locator('h4');
    this.cardNumber = (index) => page.locator('.card-item').nth(index).locator('.card-number');
    this.cardCreditLimit = (index) => page.locator('.card-item').nth(index).locator('text=/Limit:/i').locator('..');
    this.cardAvailableCredit = (index) => page.locator('.card-item').nth(index).locator('text=/Available:/i').locator('..');
    this.cardOutstandingBalance = (index) => page.locator('.card-item').nth(index).locator('text=/Outstanding:/i').locator('..');
    this.cardMonthlySpend = (index) => page.locator('.card-item').nth(index).locator('text=/This Month:/i').locator('..');
    
    // Empty state and error messages
    this.emptyPortfolioMessage = page.locator('text=/No credit cards are available/i');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.retryButton = page.locator('button:has-text("Retry")');
    this.dataInconsistencyError = page.locator('text=/Data inconsistency detected/i');
    this.refreshButton = page.locator('button:has-text("Refresh")');
    
    // Loading indicators
    this.loadingIndicator = page.locator('text=/Loading/i');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto(config.baseUrl + '/dashboard');
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard page loaded');
  }

  async waitForCardsToLoad() {
    logger.info('Waiting for credit cards to load');
    await this.page.waitForSelector('.card-item', { state: 'visible', timeout: 10000 }).catch(() => {
      logger.warn('No cards found or timeout waiting for cards');
    });
  }

  async waitForKPIsToLoad() {
    logger.info('Waiting for KPIs to load');
    await this.page.waitForSelector('.kpi-card', { state: 'visible', timeout: 10000 });
    await expect(this.kpiCards.first()).toBeVisible();
  }

  async getCardCount() {
    logger.info('Getting card count');
    const count = await this.cardItems.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async getCardDetails(index) {
    logger.info(`Getting details for card at index ${index}`);
    await expect(this.cardItems.nth(index)).toBeVisible();
    
    const cardName = await this.cardName(index).textContent();
    const cardNumber = await this.cardNumber(index).textContent();
    const creditLimitText = await this.cardCreditLimit(index).textContent();
    const availableCreditText = await this.cardAvailableCredit(index).textContent();
    const outstandingBalanceText = await this.cardOutstandingBalance(index).textContent();
    const monthlySpendText = await this.cardMonthlySpend(index).textContent();
    
    const details = {
      cardName: cardName.trim(),
      cardNumber: cardNumber.trim(),
      creditLimit: creditLimitText.trim(),
      availableCredit: availableCreditText.trim(),
      outstandingBalance: outstandingBalanceText.trim(),
      currentMonthSpend: monthlySpendText.trim()
    };
    
    logger.info(`Card details: ${JSON.stringify(details)}`);
    return details;
  }

  async getKPIValue(label) {
    logger.info(`Getting KPI value for: ${label}`);
    await expect(this.kpiValue(label)).toBeVisible();
    const value = await this.kpiValue(label).textContent();
    logger.info(`KPI ${label}: ${value}`);
    return value.trim();
  }

  async verifyKPIExists(label) {
    logger.info(`Verifying KPI exists: ${label}`);
    await expect(this.kpiLabel(label)).toBeVisible();
    await expect(this.kpiValue(label)).toBeVisible();
  }

  async clickRetryButton() {
    logger.info('Clicking retry button');
    await expect(this.retryButton).toBeVisible();
    await this.retryButton.click();
  }

  async clickRefreshButton() {
    logger.info('Clicking refresh button');
    await expect(this.refreshButton).toBeVisible();
    await this.refreshButton.click();
  }
};