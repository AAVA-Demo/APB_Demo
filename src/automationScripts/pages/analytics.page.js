const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics Container Locators
    this.analyticsContainer = page.locator('[data-testid="analytics-container"]');
    this.chartContainer = page.locator('[data-testid="chart-container"]');
    this.chartCanvas = page.locator('[data-testid="chart-canvas"]');
    
    // Category View Locators
    this.categoryChartSegments = page.locator('[data-testid="chart-segment"]');
    
    // Monthly Trend Locators
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.trendLine = page.locator('[data-testid="trend-line"]');
    this.chartDataPoints = page.locator('[data-testid="chart-data-point"]');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.errorPlaceholder = page.locator('[data-testid="error-placeholder"]');
    
    // Loading State Locators
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await expect(this.analyticsContainer).toBeVisible();
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    logger.info('Analytics page loaded successfully');
  }

  async authenticateUser(email, categoriesOrDateRange) {
    logger.info(`Authenticating user: ${email} with data: ${categoriesOrDateRange}`);
    
    await this.page.evaluate(({ email, categoriesOrDateRange }) => {
      window.mockUserData = {
        email: email,
        dataConfig: categoriesOrDateRange
      };
    }, { email, categoriesOrDateRange });
    
    await this.page.reload();
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    logger.info('User authentication completed');
  }

  async getTransactions() {
    logger.info('Retrieving transactions for analytics');
    
    const transactions = await this.page.evaluate(() => {
      return window.mockTransactions || [];
    });
    
    logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async getTransactionsWithInvalidCategories() {
    logger.info('Retrieving transactions with invalid categories');
    
    const transactions = await this.page.evaluate(() => {
      return [
        { transactionId: 'T1', amount: 1000, category: null },
        { transactionId: 'T2', amount: 2000, category: 'InvalidCategory' },
        { transactionId: 'T3', amount: 1500, category: undefined }
      ];
    });
    
    logger.info('Transactions with invalid categories retrieved');
    return transactions;
  }

  async getTransactionsWithMissingDates() {
    logger.info('Retrieving transactions with missing dates');
    
    const transactions = await this.page.evaluate(() => {
      return [
        { transactionId: 'T1', amount: 1000, date: null },
        { transactionId: 'T2', amount: 2000, date: undefined },
        { transactionId: 'T3', amount: 1500 }
      ];
    });
    
    logger.info('Transactions with missing dates retrieved');
    return transactions;
  }

  async aggregateByCategory(transactions) {
    logger.info('Aggregating transactions by category');
    
    const categoryData = await this.page.evaluate((txns) => {
      const categoryMap = {};
      const validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      
      txns.forEach(txn => {
        const category = txn.category || 'Miscellaneous';
        if (!categoryMap[category]) {
          categoryMap[category] = { category, totalAmount: 0, transactionCount: 0 };
        }
        categoryMap[category].totalAmount += txn.amount;
        categoryMap[category].transactionCount++;
      });
      
      return Object.values(categoryMap);
    }, transactions);
    
    logger.info('Category aggregation completed');
    return categoryData;
  }

  async categorizeTransactions(transactions) {
    logger.info('Categorizing transactions');
    
    const categorizedTransactions = transactions.map(txn => {
      const validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      if (!txn.category || !validCategories.includes(txn.category)) {
        txn.category = 'Miscellaneous';
      }
      return txn;
    });
    
    logger.info('Transaction categorization completed');
    return categorizedTransactions;
  }

  async renderChart(categoryData) {
    logger.info('Rendering category chart');
    
    await this.page.evaluate((data) => {
      window.renderCategoryChart(data);
    }, categoryData);
    
    await expect(this.chartCanvas).toBeVisible();
    logger.info('Category chart rendered successfully');
  }

  async isChartInteractive() {
    logger.info('Checking if chart is interactive');
    
    const isInteractive = await this.chartCanvas.evaluate(canvas => {
      return canvas.getAttribute('data-interactive') === 'true';
    });
    
    logger.info(`Chart interactive status: ${isInteractive}`);
    return isInteractive;
  }

  async getChartSegmentCount() {
    logger.info('Counting chart segments');
    const segmentCount = await this.categoryChartSegments.count();
    logger.info(`Chart has ${segmentCount} segments`);
    return segmentCount;
  }

  async getTotalChartAmount() {
    logger.info('Calculating total chart amount');
    
    const totalAmount = await this.page.evaluate(() => {
      return window.chartTotalAmount || 0;
    });
    
    logger.info(`Total chart amount: ${totalAmount}`);
    return totalAmount;
  }

  async aggregateByMonth(transactions) {
    logger.info('Aggregating transactions by month');
    
    const monthlyData = await this.page.evaluate((txns) => {
      const monthMap = {};
      
      txns.forEach(txn => {
        if (!txn.date) return;
        
        const date = new Date(txn.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { month: monthKey, totalSpend: 0 };
        }
        monthMap[monthKey].totalSpend += txn.amount;
      });
      
      return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
    }, transactions);
    
    logger.info('Monthly aggregation completed');
    return monthlyData;
  }

  async aggregateByMonthWithError(transactions) {
    logger.info('Attempting monthly aggregation with expected error');
    
    const hasValidDates = transactions.some(txn => txn.date != null);
    
    if (!hasValidDates) {
      logger.info('No valid dates found in transactions');
      return { error: true, message: 'Unable to generate monthly trend. Date information missing.' };
    }
    
    return { error: false, data: await this.aggregateByMonth(transactions) };
  }

  async renderMonthlyTrendChart(monthlyData) {
    logger.info('Rendering monthly trend chart');
    
    await this.page.evaluate((data) => {
      window.renderMonthlyTrendChart(data);
    }, monthlyData);
    
    await expect(this.monthlyTrendChart).toBeVisible();
    logger.info('Monthly trend chart rendered successfully');
  }

  async getChartDataPointCount() {
    logger.info('Counting chart data points');
    const dataPointCount = await this.chartDataPoints.count();
    logger.info(`Chart has ${dataPointCount} data points`);
    return dataPointCount;
  }

  async isTrendLineVisible() {
    logger.info('Checking if trend line is visible');
    return await this.trendLine.isVisible();
  }

  async getInsufficientDataMessage() {
    logger.info('Retrieving insufficient data message');
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getAggregationErrorMessage() {
    logger.info('Retrieving aggregation error message');
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isChartVisible() {
    logger.info('Checking if chart is visible');
    return await this.chartCanvas.isVisible();
  }

  async isErrorPlaceholderVisible() {
    logger.info('Checking if error placeholder is visible');
    return await this.errorPlaceholder.isVisible();
  }
};