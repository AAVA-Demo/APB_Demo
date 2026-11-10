const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const { getBaseUrl } = require('../../data/environment');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics container
    this.analyticsContainer = page.locator('div[ng-if="!vm.loading&&!vm.error"]');
    
    // Charts
    this.categoryChart = page.locator('category-chart[data="vm.categoryData"]');
    this.trendChart = page.locator('trend-chart[data="vm.trendData"]');
    this.categoryChartCanvas = page.locator('#categoryChart');
    this.trendChartCanvas = page.locator('#trendChart');
    
    // Filters
    this.startDateFilter = page.locator('input[ng-model="vm.filters.startDate"]');
    this.endDateFilter = page.locator('input[ng-model="vm.filters.endDate"]');
    this.cardIdFilter = page.locator('input[ng-model="vm.filters.cardId"]');
    this.categoryFilter = page.locator('select[ng-model="vm.filters.category"]');
    
    // Messages and indicators
    this.totalTransactionsAlert = page.locator('div.alert.alert-info:has-text("Total Transactions Analyzed:")');
    this.errorMessage = page.locator('div.alert.alert-danger');
    this.loadingIndicator = page.locator('div[ng-if="vm.loading"]');
    
    // Navigation
    this.analyticsTab = page.locator('a[href="#!/analytics"]');
  }

  async navigate() {
    const baseUrl = getBaseUrl();
    logger.info(`Navigating to Analytics: ${baseUrl}/analytics`);
    await this.page.goto(`${baseUrl}/analytics`);
    await expect(this.analyticsContainer.or(this.loadingIndicator)).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Analytics page loaded');
  }

  async refreshAnalytics() {
    logger.info('Refreshing analytics');
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsContainer.or(this.loadingIndicator).or(this.errorMessage)).toBeVisible({ timeout: 10000 });
    logger.info('Analytics refreshed');
  }

  async getTotalTransactionsCount() {
    await expect(this.totalTransactionsAlert).toBeVisible();
    const alertText = await this.totalTransactionsAlert.textContent();
    const match = alertText.match(/Total Transactions Analyzed:\s*(\d+)/);
    const count = match ? match[1] : '0';
    logger.info(`Total Transactions Analyzed: ${count}`);
    return count;
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info(`Error Message: ${message}`);
    return message.trim();
  }

  async applyDateFilter(startDate, endDate) {
    logger.info(`Applying date filter: ${startDate} to ${endDate}`);
    await this.startDateFilter.fill(startDate);
    await this.endDateFilter.fill(endDate);
    await this.page.waitForTimeout(500); // Allow filter debounce
    logger.info('Date filter applied');
  }

  async applyCardIdFilter(cardId) {
    logger.info(`Applying card ID filter: ${cardId}`);
    await this.cardIdFilter.fill(cardId);
    await this.page.waitForTimeout(500);
    logger.info('Card ID filter applied');
  }

  async applyCategoryFilter(category) {
    logger.info(`Applying category filter: ${category}`);
    await this.categoryFilter.selectOption(category);
    await this.page.waitForTimeout(500);
    logger.info('Category filter applied');
  }

  async waitForAnalyticsLoad() {
    logger.info('Waiting for analytics to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.analyticsContainer.or(this.errorMessage)).toBeVisible();
    logger.info('Analytics load complete');
  }
};