const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Widget Locators
    this.monthlySpendWidget = page.locator('[data-testid="monthly-spend"], .kpi-widget:has-text("Monthly Spend")').first();
    this.totalCreditLimitWidget = page.locator('[data-testid="total-credit-limit"], .kpi-widget:has-text("Total Credit Limit")').first();
    this.availableCreditWidget = page.locator('[data-testid="available-credit"], .kpi-widget:has-text("Available Credit")').first();
    this.outstandingAmountWidget = page.locator('[data-testid="outstanding-amount"], .kpi-widget:has-text("Outstanding")').first();
    
    // Portfolio Overview Locators
    this.portfolioOverviewSection = page.locator('[data-testid="portfolio-overview"], .portfolio-overview, section:has-text("Portfolio")').first();
    this.cardCountElement = page.locator('[data-testid="card-count"], .card-count, text=/Total Cards:/i').first();
    this.creditUtilizationElement = page.locator('[data-testid="credit-utilization"], .credit-utilization, text=/Credit Utilization:/i').first();
    this.cardSummariesContainer = page.locator('[data-testid="card-summaries"], .card-summaries, .card-list').first();
  }

  async getAllKpiWidgets() {
    return await this.page.locator('.kpi-widget, [class*="kpi"]').all();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendWidget).toBeVisible();
    const text = await this.monthlySpendWidget.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitWidget).toBeVisible();
    const text = await this.totalCreditLimitWidget.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditWidget).toBeVisible();
    const text = await this.availableCreditWidget.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountWidget).toBeVisible();
    const text = await this.outstandingAmountWidget.textContent();
    const match = text.match(/₹[\d,]+/);
    return match ? match[0] : text;
  }

  async getCardCount() {
    await expect(this.cardCountElement).toBeVisible();
    const text = await this.cardCountElement.textContent();
    const match = text.match(/\d+/);
    return match ? match[0] : '0';
  }

  async getCreditUtilizationPercentage() {
    await expect(this.creditUtilizationElement).toBeVisible();
    const text = await this.creditUtilizationElement.textContent();
    const match = text.match(/[\d.]+%/);
    return match ? match[0] : '0%';
  }

  async getCardSummaries() {
    const summaries = await this.page.locator('.card-summary, .card-item, [class*="card"]').all();
    return summaries;
  }
};
