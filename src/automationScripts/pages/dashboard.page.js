const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://creditcard.dashboard.app';
    
    // Login locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Navigation locators
    this.navigationMenu = page.locator('.navbar');
    this.dashboardLink = page.locator('a[href="#/"]');
    
    // KPI locators
    this.kpiContainer = page.locator('.dashboard-container');
    this.monthlySpendKPI = page.locator('.panel-primary:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('.panel-success:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('.panel-info:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('.panel-warning:has-text("Outstanding Amount")');
    
    // Error and warning locators
    this.errorMessage = page.locator('.alert-danger');
    this.warningIndicator = page.locator('.alert-warning');
    this.lastUpdatedTimestamp = page.locator('.text-muted:has-text("Last updated")');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=Loading dashboard...');
  }

  async navigate() {
    logger.info(`Navigating to ${this.baseURL}`);
    await this.page.goto(this.baseURL);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in as ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForSelector('.dashboard-container', { state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  async getKPIValue(kpiType) {
    let locator;
    switch(kpiType) {
      case 'monthlySpend':
        locator = this.monthlySpendKPI.locator('h3');
        break;
      case 'totalCreditLimit':
        locator = this.totalCreditLimitKPI.locator('h3');
        break;
      case 'availableCredit':
        locator = this.availableCreditKPI.locator('h3');
        break;
      case 'outstandingAmount':
        locator = this.outstandingAmountKPI.locator('h3');
        break;
      default:
        throw new Error(`Unknown KPI type: ${kpiType}`);
    }
    
    await expect(locator).toBeVisible();
    const value = await locator.textContent();
    logger.info(`${kpiType} value: ${value}`);
    return value.trim();
  }

  async verifyAllKPIsVisible() {
    logger.info('Verifying all KPIs are visible');
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await this.lastUpdatedTimestamp.textContent();
    logger.info(`Last updated timestamp: ${timestamp}`);
    return timestamp;
  }

  async verifyResponsiveLayout(viewportWidth, viewportHeight) {
    logger.info(`Setting viewport to ${viewportWidth}x${viewportHeight}`);
    await this.page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await this.page.waitForTimeout(500); // Allow layout to adjust
    await expect(this.kpiContainer).toBeVisible();
  }
};