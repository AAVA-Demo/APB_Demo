const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.dashboardContainer = page.locator('.dashboard-kpi-container');
    this.financialOverviewSection = page.locator('.financial-overview');
    this.monthlySpendKPI = page.locator('[data-kpi="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-kpi="total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-kpi="available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-kpi="outstanding-amount"]');
    this.errorMessage = page.locator('.alert-danger');
    this.noCardsMessage = page.locator('.no-cards-message');
    this.noSpendingMessage = page.locator('.no-spending-message');
    this.cachedDataIndicator = page.locator('.cached-data-indicator');
    this.lastUpdatedTimestamp = page.locator('.last-updated');
  }

  async navigateToFinancialOverview() {
    logger.info('Navigating to financial overview');
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.financialOverviewSection).toBeVisible();
    logger.info('Financial overview section loaded');
  }

  async getMonthlySpend() {
    logger.info('Retrieving monthly spend KPI');
    await expect(this.monthlySpendKPI).toBeVisible();
    const valueText = await this.monthlySpendKPI.locator('.kpi-value').textContent();
    const value = parseFloat(valueText.replace(/[$,]/g, ''));
    logger.info(`Monthly spend: $${value}`);
    return value;
  }

  async getTotalCreditLimit() {
    logger.info('Retrieving total credit limit KPI');
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const valueText = await this.totalCreditLimitKPI.locator('.kpi-value').textContent();
    const value = parseFloat(valueText.replace(/[$,]/g, ''));
    logger.info(`Total credit limit: $${value}`);
    return value;
  }

  async getAvailableCredit() {
    logger.info('Retrieving available credit KPI');
    await expect(this.availableCreditKPI).toBeVisible();
    const valueText = await this.availableCreditKPI.locator('.kpi-value').textContent();
    const value = parseFloat(valueText.replace(/[$,]/g, ''));
    logger.info(`Available credit: $${value}`);
    return value;
  }

  async getOutstandingAmount() {
    logger.info('Retrieving outstanding amount KPI');
    await expect(this.outstandingAmountKPI).toBeVisible();
    const valueText = await this.outstandingAmountKPI.locator('.kpi-value').textContent();
    const value = parseFloat(valueText.replace(/[$,]/g, ''));
    logger.info(`Outstanding amount: $${value}`);
    return value;
  }

  async getAllKPIs() {
    logger.info('Retrieving all KPIs');
    const kpis = {
      monthlySpend: await this.getMonthlySpend(),
      totalCreditLimit: await this.getTotalCreditLimit(),
      availableCredit: await this.getAvailableCredit(),
      outstandingAmount: await this.getOutstandingAmount()
    };
    logger.info('All KPIs retrieved successfully');
    return kpis;
  }

  async getErrorMessage() {
    logger.debug('Checking for error message');
    if (await this.errorMessage.isVisible()) {
      const message = await this.errorMessage.textContent();
      logger.warn(`Error message: ${message}`);
      return message;
    }
    return '';
  }

  async getNoCardsMessage() {
    logger.debug('Checking for no cards message');
    if (await this.noCardsMessage.isVisible()) {
      const message = await this.noCardsMessage.textContent();
      logger.info(`No cards message: ${message}`);
      return message;
    }
    return '';
  }

  async getNoSpendingMessage() {
    logger.debug('Checking for no spending message');
    if (await this.noSpendingMessage.isVisible()) {
      const message = await this.noSpendingMessage.textContent();
      logger.info(`No spending message: ${message}`);
      return message;
    }
    return '';
  }

  async getCachedDataIndicator() {
    logger.debug('Checking for cached data indicator');
    if (await this.cachedDataIndicator.isVisible()) {
      const indicator = await this.cachedDataIndicator.textContent();
      logger.info(`Cached data indicator: ${indicator}`);
      return indicator;
    }
    return '';
  }

  async getLastUpdatedTimestamp() {
    logger.debug('Retrieving last updated timestamp');
    if (await this.lastUpdatedTimestamp.isVisible()) {
      const timestamp = await this.lastUpdatedTimestamp.textContent();
      logger.info(`Last updated: ${timestamp}`);
      return timestamp;
    }
    return null;
  }

  async waitForKPIUpdate() {
    logger.info('Waiting for KPI update');
    await this.page.waitForTimeout(500);
    await expect(this.monthlySpendKPI).toBeVisible();
    logger.info('KPI update complete');
  }
};