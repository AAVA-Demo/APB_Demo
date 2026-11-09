const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('[ng-controller="AnalyticsController as vm"]');
    this.categoryChartCanvas = page.locator('#categoryChartCanvas');
    this.trendChartCanvas = page.locator('#trendChartCanvas');
    this.categoryItems = page.locator('.category-item');
    this.dateRangeStartInput = page.locator('input[ng-model="dateRange.start"]');
    this.dateRangeEndInput = page.locator('input[ng-model="dateRange.end"]');
    this.applyFilterButton = page.locator('button:has-text("Apply")');
    this.loadingIndicator = page.locator('h4:has-text("Loading analytics...")');
    this.errorAlert = page.locator('.alert-danger');
  }

  async waitForAnalyticsLoad() {
    await this.analyticsContainer.waitFor({ state: 'visible', timeout: 5000 });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async loadCategorySpending() {
    await this.page.waitForFunction(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope && scope.vm && scope.vm.analyticsData && scope.vm.analyticsData.categorySpending;
    }, { timeout: 5000 });
  }

  async getCategoryCount() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.categorySpending.length;
    });
  }

  async getAllCategories() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.categorySpending.map(c => c.category);
    });
  }

  async getCategoryData(categoryName) {
    return await this.page.evaluate((name) => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.categorySpending.find(c => c.category === name);
    }, categoryName);
  }

  async getAllCategoryData() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.categorySpending;
    });
  }

  async getTotalSpendFromCategories() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.categorySpending.reduce((sum, cat) => sum + cat.totalAmount, 0);
    });
  }

  async getTotalPercentage() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.categorySpending.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0);
    });
  }

  async getTotalTransactionCount() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.totalTransactions;
    });
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.dateRangeStartInput.fill(this.formatDate(startDate));
    await this.dateRangeEndInput.fill(this.formatDate(endDate));
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(500);
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getAppliedDateRange() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return {
        start: scope.vm.analyticsData.dateRange.start ? scope.vm.analyticsData.dateRange.start.toISOString().split('T')[0] : null,
        end: scope.vm.analyticsData.dateRange.end ? scope.vm.analyticsData.dateRange.end.toISOString().split('T')[0] : null
      };
    });
  }

  async hasNullOrUndefinedData() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      const categories = scope.vm.analyticsData.categorySpending;
      return categories.some(cat => 
        cat.totalAmount === null || cat.totalAmount === undefined ||
        cat.transactionCount === null || cat.transactionCount === undefined
      );
    });
  }

  async loadMonthlyTrends() {
    await this.page.waitForFunction(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope && scope.vm && scope.vm.analyticsData && scope.vm.analyticsData.monthlyTrends;
    }, { timeout: 5000 });
  }

  async waitForTrendsLoad() {
    await this.trendChartCanvas.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getMonthlyTrends() {
    return await this.page.evaluate(() => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.monthlyTrends;
    });
  }

  async getMonthData(monthKey) {
    return await this.page.evaluate((key) => {
      const scope = angular.element(document.querySelector('[ng-controller="AnalyticsController as vm"]')).scope();
      return scope.vm.analyticsData.monthlyTrends.find(m => m.month === key);
    }, monthKey);
  }

  async hasConsoleErrors() {
    return await this.page.evaluate(() => {
      return window.consoleErrors && window.consoleErrors.length > 0;
    });
  }
};