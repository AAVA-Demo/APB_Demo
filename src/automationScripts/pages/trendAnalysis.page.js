const { expect } = require('@playwright/test');
const { WaitUtils } = require('../utils/wait.utils');
const { Logger } = require('../utils/logger');

exports.TrendAnalysisPage = class TrendAnalysisPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    this.waitUtils = new WaitUtils(page);
    
    // Locators
    this.analyticsLink = page.locator('a[href="#/analytics"]');
    this.trendChart = page.locator('monthly-trend-chart, canvas#trendChart');
    this.insufficientDataMessage = page.locator('.analytics-container .alert:has-text("Insufficient"), .analytics-container .notice');
    this.categoryFilterDropdown = page.locator('category-filter select[multiple]');
    this.dateRangeStartInput = page.locator('input[type="month"][ng-model*="startDate"]');
    this.dateRangeEndInput = page.locator('input[type="month"][ng-model*="endDate"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    this.trendDataTable = page.locator('.analytics-container table');
  }

  async navigateToTrendAnalysis() {
    await this.analyticsLink.click();
    await this.waitUtils.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*analytics/);
    this.logger.info('Navigated to Trend Analysis section');
  }

  async getMonthlyTrendData() {
    await this.waitUtils.waitForElement(this.trendChart);
    
    const trendData = await this.page.evaluate(() => {
      const controller = angular.element(document.querySelector('[ng-controller="AnalyticsController"]')).scope();
      return controller.vm.trendData.map(trend => ({
        month: trend.month,
        totalSpend: trend.totalSpend,
        categoryBreakdown: trend.categoryBreakdown || []
      }));
    });
    
    this.logger.info(`Retrieved ${trendData.length} trend data points`);
    return trendData;
  }

  async getChartDataPointCount() {
    const count = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#trendChart');
      if (!canvas) return 0;
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels.length : 0;
    });
    return count;
  }

  async getRawTransactionsForMonth(month) {
    const transactions = await this.page.evaluate(async (targetMonth) => {
      const response = await fetch(`/api/transactions?month=${targetMonth}`);
      const data = await response.json();
      return data.map(txn => ({
        transactionId: txn.transactionId,
        amount: txn.amount,
        date: txn.date
      }));
    }, month);
    
    this.logger.info(`Retrieved ${transactions.length} raw transactions for ${month}`);
    return transactions;
  }

  async applyCategoryFilter(categories) {
    await this.categoryFilterDropdown.selectOption(categories);
    await this.applyFilterButton.click();
    await this.waitUtils.waitForNetworkIdle();
    this.logger.info(`Applied category filter: ${categories.join(', ')}`);
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyFilterButton.click();
    await this.waitUtils.waitForNetworkIdle();
    this.logger.info(`Applied date range filter: ${startDate} to ${endDate}`);
  }
};
