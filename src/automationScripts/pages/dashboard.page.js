const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {

  constructor(page) {
    this.page = page;
    
    // Locators for KPI cards
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount")');
    
    // Locators for credit card list
    this.creditCardList = page.locator('credit-card-list, [credit-card-list]');
    this.noCardsMessage = page.locator('.alert-info:has-text("No credit cards")');
    
    // Locators for navigation
    this.navigationMenu = page.locator('.navbar, nav');
    this.dashboardLink = page.locator('a[href*="dashboard"]');
    
    // Locators for timestamp
    this.lastUpdatedTimestamp = page.locator('text=/Last updated:/i').locator('..');
    
    // Login locators
    this.usernameInput = page.locator('input[type="email"], input[name="username"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login"), button:has-text("Sign In")');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.com');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/.*dashboard/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getLastUpdatedTimestamp() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const text = await this.lastUpdatedTimestamp.textContent();
    return text.trim();
  }

  async getAllKPICards() {
    await this.page.waitForSelector('.kpi-card', { state: 'visible' });
    return await this.page.locator('.kpi-card').all();
  }

  async waitForKPIUpdate() {
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle');
  }

};