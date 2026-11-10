const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Locators
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"], .panel:has-text("Monthly Spend") h3');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-credit-limit"], .panel:has-text("Total Credit Limit") h3');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"], .panel:has-text("Available Credit") h3');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding"], .panel:has-text("Outstanding Amount") h3');
    
    // Card List Locators
    this.cardListSection = page.locator('[data-testid="card-list"], .table:has-text("Card Name")');
    this.cardRows = page.locator('[data-testid="card-row"], .table tbody tr');
    this.cardCountHeading = page.locator('h3:has-text("My Credit Cards")');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], :text("No credit cards registered")');
    
    // Refresh Button
    this.refreshButton = page.locator('[data-testid="refresh-btn"], button:has-text("Refresh")');
  }

  async navigate() {
    logger.info('Navigating to Dashboard page');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    return text.replace(/[₹,\s]/g, '');
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return text.replace(/[₹,\s]/g, '');
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return text.replace(/[₹,\s]/g, '');
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    return text.replace(/[₹,\s]/g, '');
  }

  async getCardCount() {
    await expect(this.cardListSection).toBeVisible();
    const count = await this.cardRows.count();
    logger.info(`Card count: ${count}`);
    return count;
  }

  async getCardDetails(index) {
    await expect(this.cardRows.nth(index)).toBeVisible();
    const row = this.cardRows.nth(index);
    
    const cells = row.locator('td');
    const name = await cells.nth(0).textContent();
    const type = await cells.nth(1).textContent();
    const lastFourDigits = (await cells.nth(2).textContent()).replace(/\*+/g, '');
    const creditLimit = (await cells.nth(3).textContent()).replace(/[₹,\s]/g, '');
    const available = (await cells.nth(4).textContent()).replace(/[₹,\s]/g, '');
    const outstanding = (await cells.nth(5).textContent()).replace(/[₹,\s]/g, '');
    const monthlySpend = (await cells.nth(6).textContent()).replace(/[₹,\s]/g, '');
    
    return {
      name: name.trim(),
      type: type.trim(),
      lastFourDigits: lastFourDigits.trim(),
      creditLimit,
      available,
      outstanding,
      monthlySpend
    };
  }

  async getAllCardDetails() {
    const count = await this.getCardCount();
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      cards.push(await this.getCardDetails(i));
    }
    
    return cards;
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async clickRefresh() {
    logger.info('Clicking refresh button');
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};