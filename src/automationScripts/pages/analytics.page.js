const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators for Analytics Dashboard
    this.spendingAnalyticsDashboard = page.locator('.analytics-container');
    this.trendsVisualizationContainer = page.locator('.trends-visualization');
    
    // Locators for Charts
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.categorySpendingChart = page.locator('[data-testid="category-spending-chart"]');
    
    // Locators for Data Points
    this.monthDataPoint = (month) => page.locator(`[data-month="${month}"]`);
    this.categoryDataPoint = (category) => page.locator(`[data-category="${category}"]`);
    
    // Locators for Messages
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    
    // Locators for Category Indicators
    this.zeroCategoryIndicators = page.locator('.zero-category-indicator');
    
    // Loading indicator
    this.loadingSpinner = page.locator('.loading-spinner');
  }

  async navigate() {
    await this.page.goto('/analytics');
    logger.info('Navigated to /analytics');
  }

  async authenticateUser(userId) {
    await this.page.evaluate((id) => {
      sessionStorage.setItem('userId', id);
      sessionStorage.setItem('authToken', 'mock_token_' + id);
    }, userId);
    logger.info(`User ${userId} authenticated`);
  }

  async waitForPageLoad() {
    await expect(this.spendingAnalyticsDashboard).toBeVisible({ timeout: 5000 });
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    logger.info('Analytics page loaded successfully');
  }

  async getMonthlyTrendsData() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    
    const trendsData = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="monthly-trends-chart"]');
      const dataPoints = chartElement.querySelectorAll('.data-point');
      const data = {};
      dataPoints.forEach(point => {
        const month = point.getAttribute('data-month');
        const amount = point.getAttribute('data-amount');
        data[month] = amount;
      });
      return data;
    });
    logger.info('Monthly trends data retrieved');
    return trendsData;
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    const message = await this.insufficientDataMessage.textContent();
    logger.info('Insufficient data message retrieved');
    return message;
  }

  async clickMonthDataPoint(month) {
    await expect(this.monthDataPoint(month)).toBeVisible();
    await this.monthDataPoint(month).click();
    logger.info(`Clicked on month data point: ${month}`);
  }

  async getMonthBreakdown(month) {
    await this.page.waitForSelector('[data-testid="month-breakdown"]', { timeout: 5000 });
    
    const breakdown = await this.page.evaluate(() => {
      const breakdownElement = document.querySelector('[data-testid="month-breakdown"]');
      const categories = Array.from(breakdownElement.querySelectorAll('.category-item')).map(item => ({
        category: item.getAttribute('data-category'),
        amount: item.getAttribute('data-amount')
      }));
      const transactions = Array.from(breakdownElement.querySelectorAll('.transaction-item')).map(item => ({
        transactionId: item.getAttribute('data-transaction-id'),
        amount: item.getAttribute('data-amount')
      }));
      return { categories, transactions };
    });
    logger.info(`Month breakdown retrieved for ${month}`);
    return breakdown;
  }

  async getCategorySpendingData() {
    await expect(this.categorySpendingChart).toBeVisible();
    
    const categoryData = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="category-spending-chart"]');
      const dataPoints = chartElement.querySelectorAll('.category-data-point');
      const data = {};
      dataPoints.forEach(point => {
        const category = point.getAttribute('data-category');
        const amount = point.getAttribute('data-amount');
        const count = point.getAttribute('data-transaction-count');
        data[category] = { amount, transactionCount: parseInt(count) };
      });
      return data;
    });
    logger.info('Category spending data retrieved');
    return categoryData;
  }

  async getCategoryPercentages() {
    const percentages = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="category-spending-chart"]');
      const dataPoints = chartElement.querySelectorAll('.category-data-point');
      const percentages = {};
      dataPoints.forEach(point => {
        const category = point.getAttribute('data-category');
        const percentage = parseFloat(point.getAttribute('data-percentage'));
        percentages[category] = percentage;
      });
      return percentages;
    });
    logger.info('Category percentages retrieved');
    return percentages;
  }

  async getZeroCategoryIndicators() {
    const count = await this.zeroCategoryIndicators.count();
    logger.info(`Zero category indicators count: ${count}`);
    return await this.zeroCategoryIndicators.all();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const message = await this.errorMessage.textContent();
    logger.info('Error message retrieved');
    return message;
  }

  async simulateCategorizationServiceError() {
    await this.page.route('**/api/analytics/spending', route => {
      route.abort('failed');
    });
    logger.info('Categorization service error simulated');
  }
};