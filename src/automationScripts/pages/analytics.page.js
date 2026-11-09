const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('AnalyticsPage');
    
    // Chart Locators
    this.categoryChartPanel = page.locator('.panel:has-text("Category-wise Spending")');
    this.categoryChart = page.locator('cc-spending-chart[chart-type="pie"]');
    this.monthlyTrendPanel = page.locator('.panel:has-text("Monthly Spend Trends")');
    this.monthlyTrendChart = page.locator('cc-spending-chart[chart-type="line"]');
    this.cardSpendPanel = page.locator('.panel:has-text("Card-wise Spend Analysis")');
    this.cardSpendChart = page.locator('cc-spending-chart[chart-type="bar"]');
    
    // Loading and Error Locators
    this.loadingIndicator = page.locator('text=Loading analytics...');
    this.errorMessage = page.locator('.alert-danger');
    this.pageTitle = page.locator('h2:has-text("Spending Analytics & Insights")');
  }

  async navigate() {
    await this.page.goto('/analytics');
    this.logger.info('Navigated to analytics page');
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      this.logger.info('Loading indicator not found or already hidden');
    });
    this.logger.info('Analytics loaded successfully');
  }

  async isCategoryChartVisible() {
    return await this.categoryChart.isVisible().catch(() => false);
  }

  async isMonthlyTrendChartVisible() {
    return await this.monthlyTrendChart.isVisible().catch(() => false);
  }

  async getCategoryLabels() {
    // Extract category labels from chart data attribute or evaluate JavaScript
    const chartData = await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController"]')).scope();
      return scope.vm.analyticsData.categorySpends.map(c => c.category);
    });
    return chartData;
  }

  async getCategorySpendData() {
    const chartData = await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController"]')).scope();
      return scope.vm.analyticsData.categorySpends;
    });
    return chartData;
  }

  async getCategoryCount() {
    const data = await this.getCategorySpendData();
    return data.length;
  }

  async getCategoryDataByName(categoryName) {
    const data = await this.getCategorySpendData();
    return data.find(c => c.category === categoryName) || { category: categoryName, totalAmount: 0, transactionCount: 0 };
  }

  async getMonthlyTrendData() {
    const chartData = await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController"]')).scope();
      return scope.vm.analyticsData.monthlyTrends;
    });
    return chartData;
  }

  async getMonthlyTrendLabels() {
    const data = await this.getMonthlyTrendData();
    return data.map(d => d.month);
  }

  async loadEmptyAnalyticsData() {
    await this.page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    await this.page.reload();
    this.logger.info('Loaded empty analytics data');
  }

  async loadUncategorizedTransactionData() {
    const transactions = [
      { transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', amount: 1000, category: 'Food & Dining' },
      { transactionId: 'T002', cardId: 'CC001', date: '2024-01-18', amount: 1200, category: 'Fuel' },
      { transactionId: 'T003', cardId: 'CC002', date: '2024-01-20', amount: 4500, category: 'Shopping' },
      { transactionId: 'T004', cardId: 'CC003', date: '2024-01-22', amount: 2000 }, // No category
      { transactionId: 'T005', cardId: 'CC001', date: '2024-01-25', amount: 1500 }  // No category
    ];
    
    await this.page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactions)
      });
    });
    await this.page.reload();
    this.logger.info('Loaded uncategorized transaction data');
  }

  async loadSingleMonthData() {
    const transactions = [
      { transactionId: 'T001', cardId: 'CC001', date: '2024-01-15', amount: 2500, category: 'Food & Dining' },
      { transactionId: 'T002', cardId: 'CC001', date: '2024-01-18', amount: 1200, category: 'Fuel' },
      { transactionId: 'T003', cardId: 'CC002', date: '2024-01-20', amount: 4500, category: 'Shopping' }
    ];
    
    await this.page.route('**/api/transactions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(transactions)
      });
    });
    await this.page.reload();
    this.logger.info('Loaded single month data');
  }

  async hasErrorMessage() {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  async isLoadingIndicatorVisible() {
    return await this.loadingIndicator.isVisible().catch(() => false);
  }
};