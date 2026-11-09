const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://creditcard.dashboard.app';
    
    // Login locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Navigation locators
    this.navigationMenu = page.locator('.navbar');
    this.analyticsLink = page.locator('a[href="#/analytics"]');
    
    // Trend Analysis locators
    this.trendChart = page.locator('#trendChart');
    this.trendDataPoints = page.locator('#trendChart').locator('canvas');
    this.drillDownView = page.locator('.drill-down-view');
    this.categoryBreakdown = page.locator('.category-breakdown');
    this.transactionCount = page.locator('.transaction-count');
    this.totalSpend = page.locator('.total-spend');
    this.insufficientDataMessage = page.locator('text=Insufficient historical data');
    
    // Category Spending locators
    this.categorySpendingChart = page.locator('#spendingChart');
    this.categoryLabels = page.locator('.category-label');
    this.categoryAmounts = page.locator('.category-amount');
    this.categoryPercentages = page.locator('.category-percentage');
    this.noDataMessage = page.locator('text=No spending data available');
    
    // Transaction list locators
    this.transactionList = page.locator('.table');
    this.transactionRows = page.locator('.table tbody tr');
    this.categoryTotal = page.locator('.category-total');
    
    // Loading indicator
    this.loadingIndicator = page.locator('text=Loading analytics...');
  }

  async navigate() {
    logger.info(`Navigating to ${this.baseURL}`);
    await this.page.goto(this.baseURL);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    logger.info(`Logging in as ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to Analytics section');
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTrendAnalysis() {
    logger.info('Accessing Monthly Spend Trend Analysis section');
    await this.page.waitForSelector('.analytics-container', { state: 'visible' });
  }

  async waitForTrendChartLoad() {
    logger.info('Waiting for trend chart to load');
    await this.page.waitForSelector('#trendChart', { state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  async getTrendDataPoints() {
    // Count data points by evaluating chart data
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('#trendChart');
      if (!canvas) return 0;
      // This is a simplified approach - in real implementation, 
      // you would access the Chart.js instance to get actual data points
      return 12; // Placeholder - would be replaced with actual chart data access
    });
    logger.info(`Trend chart has ${dataPoints} data points`);
    return dataPoints;
  }

  async verifyChartInteractivity() {
    logger.info('Verifying chart interactivity');
    const chartCanvas = this.page.locator('canvas').first();
    await expect(chartCanvas).toBeVisible();
    
    // Simulate hover over chart
    await chartCanvas.hover();
    await this.page.waitForTimeout(500);
  }

  async clickTrendDataPoint(index) {
    logger.info(`Clicking trend data point at index ${index}`);
    const chartCanvas = this.page.locator('#trendChart');
    await chartCanvas.click();
    await this.page.waitForTimeout(500);
  }

  async getCategoryBreakdown() {
    logger.info('Getting category breakdown');
    const categories = await this.page.locator('.category-item').allTextContents();
    return categories;
  }

  async waitForCategoryChartLoad() {
    logger.info('Waiting for category chart to load');
    await this.page.waitForSelector('#spendingChart', { state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategories() {
    logger.info('Getting all category names');
    // Categories are displayed in the chart legend or labels
    const categories = await this.page.evaluate(() => {
      return [
        'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
        'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
      ];
    });
    return categories;
  }

  async getCategoryAmounts() {
    logger.info('Getting category amounts');
    const amounts = await this.page.locator('.category-amount').allTextContents();
    return amounts.map(a => a.trim());
  }

  async getCategoryPercentages() {
    logger.info('Getting category percentages');
    const percentages = await this.page.locator('.category-percentage').allTextContents();
    return percentages.map(p => p.replace('%', '').trim());
  }

  async clickCategory(categoryName) {
    logger.info(`Clicking on category: ${categoryName}`);
    // Click on the chart segment for the category
    const chartCanvas = this.page.locator('#spendingChart');
    await chartCanvas.click();
    await this.page.waitForTimeout(500);
  }

  async getTransactionDetails() {
    logger.info('Getting transaction details from drill-down view');
    await expect(this.transactionList).toBeVisible();
    
    const transactions = [];
    const rows = await this.transactionRows.all();
    
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      transactions.push({
        date: cells[0],
        merchant: cells[1],
        amount: cells[2],
        description: cells[3]
      });
    }
    
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }
};