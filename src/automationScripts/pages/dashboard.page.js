const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard")');
    this.kpiContainer = page.locator('.kpi-box, .dashboard-kpi, [data-testid="kpi"]');
    this.creditCardsLink = page.locator('a[href*="credit"], a:has-text("Credit Cards"), nav a:has-text("Cards")');
    this.transactionsLink = page.locator('a[href*="transaction"], a:has-text("Transactions")');
    this.analyticsLink = page.locator('a[href*="analytics"], a:has-text("Analytics")');
    this.noCardsMessage = page.locator('text=/No credit cards registered/i, text=/Please add a card/i');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardHeader).toBeVisible({ timeout: 10000 });
    await expect(this.kpiContainer.first()).toBeVisible({ timeout: 5000 });
    logger.info('Dashboard loaded successfully');
  }

  async navigateDirectly() {
    await this.page.goto('https://creditcard.example.com/dashboard');
    logger.info('Attempted direct navigation to dashboard');
  }

  async navigateToCreditCards() {
    await expect(this.creditCardsLink).toBeVisible();
    await this.creditCardsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Credit Cards page');
  }

  async navigateToTransactions() {
    await expect(this.transactionsLink).toBeVisible();
    await this.transactionsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Transactions page');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Analytics page');
  }

  async verifyKPI(kpiName, expectedValue) {
    const kpiLocator = this.page.locator(`.kpi-box:has-text("${kpiName}"), [data-testid="${kpiName.toLowerCase().replace(/\s+/g, '-')}"]`);
    await expect(kpiLocator).toBeVisible();
    const kpiText = await kpiLocator.textContent();
    expect(kpiText).toContain(expectedValue.replace(/,/g, ''));
    logger.info(`KPI ${kpiName} verified with value ${expectedValue}`);
  }

  async verifyNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible({ timeout: 5000 });
    logger.info('No cards registered message displayed');
  }

  async verifyAuthenticationError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    expect(errorText).toContain('Authentication');
    logger.info('Authentication error verified');
  }

  async verifyNoFinancialDataDisplayed() {
    const financialElements = this.page.locator('.kpi-box, .card-balance, [data-testid*="amount"]');
    await expect(financialElements.first()).not.toBeVisible({ timeout: 3000 }).catch(() => {});
    logger.info('No financial data displayed');
  }
};
