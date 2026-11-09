const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.analyticsLink = page.locator('a[href="/analytics"]');
    this.categoryVisualization = page.locator('.category-visualization');
    this.categoryItems = page.locator('.category-item');
    this.categoryAmount = (category) => page.locator(`[data-category="${category}"] .amount`);
    this.categoryPercentage = (category) => page.locator(`[data-category="${category}"] .percentage`);
    this.monthlyTrendsChart = page.locator('.monthly-trends-chart');
    this.chartDataPoint = page.locator('.chart-data-point');
    this.monthSelector = (month) => page.locator(`[data-month="${month}"]`);
    this.transactionDetails = page.locator('.transaction-details');
    this.transactionRow = page.locator('.transaction-row');
    this.emptyChartMessage = page.locator('.empty-chart-message');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL(/login/);
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/dashboard|analytics/);
    logger.info(`Logged in as ${username}`);
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    await this.page.waitForURL(/analytics/);
    logger.info('Navigated to analytics page');
  }

  async waitForCategoryVisualization() {
    await expect(this.categoryVisualization).toBeVisible({ timeout: 10000 });
    logger.info('Category visualization loaded');
  }

  async getAllCategories() {
    await expect(this.categoryItems.first()).toBeVisible();
    const items = await this.categoryItems.all();
    const categories = [];
    for (const item of items) {
      const categoryName = await item.getAttribute('data-category');
      categories.push(categoryName);
    }
    return categories;
  }

  async getCategoryBreakdown() {
    const categories = await this.getAllCategories();
    const breakdown = {};
    for (const category of categories) {
      const amountText = await this.categoryAmount(category).textContent();
      const percentageText = await this.categoryPercentage(category).textContent();
      breakdown[category] = {
        amount: parseFloat(amountText.replace(/[$,]/g, '')),
        percentage: parseFloat(percentageText.replace('%', ''))
      };
    }
    return breakdown;
  }

  async getVisibleCategoriesWithData() {
    const categories = await this.getAllCategories();
    const visibleWithData = [];
    for (const category of categories) {
      const amountText = await this.categoryAmount(category).textContent();
      const amount = parseFloat(amountText.replace(/[$,]/g, ''));
      if (amount > 0) {
        visibleWithData.push(category);
      }
    }
    return visibleWithData;
  }

  async getZeroValueCategories() {
    const categories = await this.getAllCategories();
    const zeroCategories = [];
    for (const category of categories) {
      const amountText = await this.categoryAmount(category).textContent();
      const amount = parseFloat(amountText.replace(/[$,]/g, ''));
      if (amount === 0) {
        zeroCategories.push(category);
      }
    }
    return zeroCategories;
  }

  async triggerCategoryClassification(transactionId, amount, category) {
    await this.page.evaluate(({ txnId, amt, cat }) => {
      window.classifyTransaction(txnId, amt, cat);
    }, { txnId: transactionId, amt: amount, cat: category });
    logger.info(`Triggered classification for ${transactionId}`);
  }

  async waitForMonthlyTrendsChart() {
    await expect(this.monthlyTrendsChart).toBeVisible({ timeout: 10000 });
    logger.info('Monthly trends chart loaded');
  }

  async getMonthlyTrendsData() {
    await expect(this.chartDataPoint.first()).toBeVisible();
    const dataPoints = await this.chartDataPoint.all();
    const monthlyData = [];
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const amountText = await point.getAttribute('data-amount');
      monthlyData.push({
        month: month,
        amount: parseFloat(amountText)
      });
    }
    return monthlyData;
  }

  async getMonthlyTrendsDataPoints() {
    const count = await this.chartDataPoint.count();
    return count;
  }

  async selectMonthOnChart(month) {
    await expect(this.monthSelector(month)).toBeVisible();
    await this.monthSelector(month).click();
    logger.info(`Selected month: ${month}`);
  }

  async waitForTransactionDetails() {
    await expect(this.transactionDetails).toBeVisible({ timeout: 5000 });
    logger.info('Transaction details loaded');
  }

  async getDetailedTransactions() {
    await expect(this.transactionRow.first()).toBeVisible();
    const rows = await this.transactionRow.all();
    const transactions = [];
    for (const row of rows) {
      const id = await row.getAttribute('data-txn-id');
      const date = await row.getAttribute('data-txn-date');
      const amount = await row.getAttribute('data-txn-amount');
      const category = await row.getAttribute('data-txn-category');
      transactions.push({ id, date, amount: parseFloat(amount), category });
    }
    return transactions;
  }

  async getEmptyChartMessage() {
    await expect(this.emptyChartMessage).toBeVisible();
    return await this.emptyChartMessage.textContent();
  }
};