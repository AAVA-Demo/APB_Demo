const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard container and sections
    this.dashboardContainer = page.locator('.dashboard-container');
    this.kpiSection = page.locator('.kpi-section, .dashboard-kpis');
    
    // KPI locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"], .kpi-card:has-text("Outstanding Amount")');
    
    // KPI value locators
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"], .kpi-card:has-text("Monthly Spend") .kpi-value');
    this.totalCreditLimitValue = page.locator('[data-testid="total-credit-limit-value"], .kpi-card:has-text("Total Credit Limit") .kpi-value');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"], .kpi-card:has-text("Available Credit") .kpi-value');
    this.outstandingAmountValue = page.locator('[data-testid="outstanding-amount-value"], .kpi-card:has-text("Outstanding Amount") .kpi-value');
    
    // Message locators
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message, .alert:has-text("No credit cards found")');
    this.noSpendingMessage = page.locator('[data-testid="no-spending-message"], .no-spending-message, .info-message:has-text("No spending recorded")');
    
    // Navigation
    this.dashboardNavLink = page.locator('a[href*="dashboard"], nav >> text=Dashboard');
  }

  async navigate() {
    logger.info('Navigating to Credit Card Dashboard');
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    logger.info('Clicking Dashboard navigation link');
    await this.dashboardNavLink.click();
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
  }

  async getMonthlySpend() {
    logger.info('Retrieving Monthly Spend KPI value');
    await expect(this.monthlySpendValue).toBeVisible({ timeout: 3000 });
    const value = await this.monthlySpendValue.textContent();
    return value.trim();
  }

  async getTotalCreditLimit() {
    logger.info('Retrieving Total Credit Limit KPI value');
    await expect(this.totalCreditLimitValue).toBeVisible({ timeout: 3000 });
    const value = await this.totalCreditLimitValue.textContent();
    return value.trim();
  }

  async getAvailableCredit() {
    logger.info('Retrieving Available Credit KPI value');
    await expect(this.availableCreditValue).toBeVisible({ timeout: 3000 });
    const value = await this.availableCreditValue.textContent();
    return value.trim();
  }

  async getOutstandingAmount() {
    logger.info('Retrieving Outstanding Amount KPI value');
    await expect(this.outstandingAmountValue).toBeVisible({ timeout: 3000 });
    const value = await this.outstandingAmountValue.textContent();
    return value.trim();
  }

  async getNoCardsMessage() {
    logger.info('Retrieving no cards message text');
    await expect(this.noCardsMessage).toBeVisible({ timeout: 3000 });
    const message = await this.noCardsMessage.textContent();
    return message.trim();
  }

  async getNoSpendingMessage() {
    logger.info('Retrieving no spending message text');
    await expect(this.noSpendingMessage).toBeVisible({ timeout: 3000 });
    const message = await this.noSpendingMessage.textContent();
    return message.trim();
  }

  async waitForKPIsToLoad() {
    logger.info('Waiting for all KPI widgets to load');
    await expect(this.monthlySpendKPI).toBeVisible({ timeout: 5000 });
    await expect(this.totalCreditLimitKPI).toBeVisible({ timeout: 5000 });
    await expect(this.availableCreditKPI).toBeVisible({ timeout: 5000 });
    await expect(this.outstandingAmountKPI).toBeVisible({ timeout: 5000 });
  }
};