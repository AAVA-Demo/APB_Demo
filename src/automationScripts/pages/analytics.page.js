const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryChart = page.locator('#categoryChart');
    this.monthlyTrendsChart = page.locator('#monthlyTrendsChart');
    this.chartLoadingIndicator = page.locator('.chart-loading');
    this.categoryDataContainer = page.locator('.category-data');
    this.monthlyDataContainer = page.locator('.monthly-data');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCategoryChartToLoad() {
    await this.categoryChart.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForFunction(() => {
      return !document.querySelector('.chart-loading');
    }, { timeout: 5000 });
  }

  async waitForMonthlyTrendsChartToLoad() {
    await this.monthlyTrendsChart.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForFunction(() => {
      return !document.querySelector('.chart-loading');
    }, { timeout: 5000 });
  }

  async getCategoryWiseSpending() {
    await this.categoryDataContainer.waitFor({ state: 'visible' });
    const categoryData = await this.page.evaluate(() => {
      return window.categorySpendingData || {};
    });
    return categoryData;
  }

  async getMiscellaneousTransactionCount() {
    const count = await this.page.evaluate(() => {
      return window.miscellaneousTransactionCount || 0;
    });
    return count;
  }

  async getAllTransactionsForCategory(category) {
    const transactions = await this.page.evaluate((cat) => {
      return window.allTransactions.filter(txn => txn.category === cat);
    }, category);
    return transactions;
  }

  async getMonthlySpendTrends() {
    await this.monthlyDataContainer.waitFor({ state: 'visible' });
    const monthlyData = await this.page.evaluate(() => {
      return window.monthlySpendData || [];
    });
    return monthlyData;
  }

  async getTransactionsForMonth(month) {
    const transactions = await this.page.evaluate((m) => {
      return window.allTransactions.filter(txn => {
        const txnDate = new Date(txn.date);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[txnDate.getMonth()] === m;
      });
    }, month);
    return transactions;
  }

  async addTestTransaction(transaction) {
    await this.page.evaluate((txn) => {
      if (!window.testTransactions) {
        window.testTransactions = [];
      }
      window.testTransactions.push(txn);
    }, transaction);
  }

  async setupTestScenario(config) {
    await this.page.evaluate((cfg) => {
      window.testScenarioConfig = cfg;
    }, config);
  }
};
