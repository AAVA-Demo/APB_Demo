const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend") .kpi-value, [data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit") .kpi-value, [data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit") .kpi-value, [data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding") .kpi-value, [data-testid="outstanding-amount"]');
    this.creditUtilizationKPI = page.locator('.kpi-card:has-text("Utilization") .kpi-value, [data-testid="credit-utilization"]');
    this.kpiCards = page.locator('.kpi-card');
  }

  async waitForDashboardLoad() {
    await this.kpiCards.first().waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard loaded');
  }

  async getMonthlySpend() {
    await this.monthlySpendKPI.waitFor({ state: 'visible' });
    return await this.monthlySpendKPI.textContent();
  }

  async getMonthlySpendValue() {
    const text = await this.getMonthlySpend();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getTotalCreditLimit() {
    await this.totalCreditLimitKPI.waitFor({ state: 'visible' });
    return await this.totalCreditLimitKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    const text = await this.getTotalCreditLimit();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getAvailableCredit() {
    await this.availableCreditKPI.waitFor({ state: 'visible' });
    return await this.availableCreditKPI.textContent();
  }

  async getAvailableCreditValue() {
    const text = await this.getAvailableCredit();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getOutstandingAmount() {
    await this.outstandingAmountKPI.waitFor({ state: 'visible' });
    return await this.outstandingAmountKPI.textContent();
  }

  async getOutstandingAmountValue() {
    const text = await this.getOutstandingAmount();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getCreditUtilization() {
    await this.creditUtilizationKPI.waitFor({ state: 'visible' });
    return await this.creditUtilizationKPI.textContent();
  }

  async getCreditUtilizationValue() {
    const text = await this.getCreditUtilization();
    return parseFloat(text.replace(/%/g, ''));
  }

  async verifyCurrencyFormatting() {
    const monthlySpend = await this.getMonthlySpend();
    const totalCredit = await this.getTotalCreditLimit();
    expect(monthlySpend).toMatch(/\$[\d,]+\.\d{2}/);
    expect(totalCredit).toMatch(/\$[\d,]+\.\d{2}/);
    logger.info('Currency formatting verified');
  }

  async getCardAvailableCredit(cardId) {
    const cardLocator = this.page.locator(`[data-card-id="${cardId}"] .available-credit`);
    const text = await cardLocator.textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getCardOutstandingAmount(cardId) {
    const cardLocator = this.page.locator(`[data-card-id="${cardId}"] .outstanding-amount`);
    const text = await cardLocator.textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getCardCreditLimit(cardId) {
    const cardLocator = this.page.locator(`[data-card-id="${cardId}"] .credit-limit`);
    const text = await cardLocator.textContent();
    return parseFloat(text.replace(/[$,]/g, ''));
  }

  async getAllKPIs() {
    return {
      monthlySpend: await this.getMonthlySpendValue(),
      totalCreditLimit: await this.getTotalCreditLimitValue(),
      availableCredit: await this.getAvailableCreditValue(),
      outstandingAmount: await this.getOutstandingAmountValue(),
      creditUtilization: await this.getCreditUtilizationValue()
    };
  }
};
