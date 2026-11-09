const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators for analytics elements
    this.analyticsContainer = page.locator('.analytics-container, #analytics');
    this.categoryVisualization = page.locator('.category-chart, #category-visualization');
    this.trendChart = page.locator('.trend-chart, #trend-chart');
    
    // Locators for category elements
    this.categoryItem = page.locator('.category-item, [data-category]');
    this.categoryBreakdown = page.locator('.category-breakdown');
    
    // Locators for trend analysis
    this.trendAnalysisSection = page.locator('.trend-analysis, #trend-analysis');
    this.monthDataPoint = page.locator('.month-data-point, [data-month]');
    
    // Locators for filters
    this.filterPanel = page.locator('.filter-panel, .analytics-filters');
    this.categoryFilter = page.locator('[data-filter="category"]');
    this.dateRangeFilter = page.locator('[data-filter="dateRange"]');
    this.cardFilter = page.locator('[data-filter="card"]');
    
    // Locators for detailed views
    this.detailView = page.locator('.detail-view, .transaction-details');
    this.transactionList = page.locator('.transaction-list');
    this.transactionItem = page.locator('.transaction-item');
    
    // Locators for messages
    this.infoMessage = page.locator('.info-message, .alert-info');
    this.errorMessage = page.locator('.error-message, .alert-danger');
    this.warningMessage = page.locator('.warning-message, .alert-warning');
    
    // Locators for loading
    this.loadingIndicator = page.locator('.loading-spinner, .loading-indicator');
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
  }

  async waitForAnalyticsLoad() {
    logger.info('Waiting for analytics to load');
    await this.analyticsContainer.waitFor({ state: 'visible', timeout: 5000 });
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      logger.info('No loading indicator found or already hidden');
    });
  }

  async navigateToTrendAnalysis() {
    logger.info('Navigating to trend analysis section');
    const trendLink = this.page.locator('a[href*="trends"], button:has-text("Trends")');
    await trendLink.click();
    await this.trendAnalysisSection.waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForTrendChartLoad() {
    logger.info('Waiting for trend chart to load');
    await this.trendChart.waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForChartUpdate() {
    logger.info('Waiting for chart to update');
    await this.page.waitForTimeout(1000); // Wait for chart animation
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async getCategoryWiseSpending() {
    logger.info('Getting category-wise spending');
    const breakdown = {};
    const categories = await this.categoryItem.all();
    
    for (const category of categories) {
      const name = await category.getAttribute('data-category') || await category.locator('.category-name').textContent();
      const amount = await category.locator('.category-amount, [data-amount]').textContent();
      breakdown[name.trim()] = amount.trim();
    }
    
    logger.info(`Category breakdown: ${JSON.stringify(breakdown)}`);
    return breakdown;
  }

  async getAllCategories() {
    logger.info('Getting all categories');
    const categories = [];
    const items = await this.categoryItem.all();
    
    for (const item of items) {
      const name = await item.getAttribute('data-category') || await item.locator('.category-name').textContent();
      categories.push(name.trim());
    }
    
    logger.info(`Categories found: ${categories}`);
    return categories;
  }

  async getCategoryVisualization() {
    logger.info('Getting category visualization');
    await expect(this.categoryVisualization).toBeVisible();
    return this.categoryVisualization;
  }

  async getMonthlyTrendData() {
    logger.info('Getting monthly trend data');
    const trendData = [];
    const dataPoints = await this.monthDataPoint.all();
    
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const amount = await point.getAttribute('data-amount') || await point.textContent();
      trendData.push({ month, amount });
    }
    
    logger.info(`Trend data points: ${trendData.length}`);
    return trendData;
  }

  async verifyChartInteractivity() {
    logger.info('Verifying chart interactivity');
    const chart = await this.categoryVisualization.or(this.trendChart).first();
    
    // Hover over chart to check for tooltips or interactions
    await chart.hover();
    const tooltip = this.page.locator('.chart-tooltip, .tooltip');
    const isInteractive = await tooltip.isVisible().catch(() => false);
    
    logger.info(`Chart is ${isInteractive ? 'interactive' : 'not interactive'}`);
    return isInteractive;
  }

  async clickCategory(categoryName) {
    logger.info(`Clicking on category: ${categoryName}`);
    const category = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    await category.click();
  }

  async clickMonth(month) {
    logger.info(`Clicking on month: ${month}`);
    const monthElement = this.page.locator(`[data-month="${month}"]`);
    await monthElement.click();
  }

  async getDetailedTransactionView() {
    logger.info('Getting detailed transaction view');
    await expect(this.detailView).toBeVisible();
    return this.detailView;
  }

  async getDetailedTransactions() {
    logger.info('Getting detailed transactions');
    const transactions = [];
    const items = await this.transactionItem.all();
    
    for (const item of items) {
      const merchant = await item.locator('.merchant-name, [data-merchant]').textContent();
      const amount = await item.locator('.transaction-amount, [data-amount]').textContent();
      const date = await item.locator('.transaction-date, [data-date]').textContent();
      
      transactions.push({
        merchant: merchant.trim(),
        amount: amount.trim(),
        date: date.trim()
      });
    }
    
    logger.info(`Retrieved ${transactions.length} detailed transactions`);
    return transactions;
  }

  async applyFilter(filterType, value) {
    logger.info(`Applying filter: ${filterType} = ${value}`);
    const filter = this.page.locator(`[data-filter="${filterType}"]`);
    await filter.selectOption(value).catch(async () => {
      // If not a select, try clicking and typing
      await filter.click();
      await filter.fill(value);
    });
    await this.waitForChartUpdate();
  }

  async applyMultipleFilters(filters) {
    logger.info(`Applying multiple filters: ${JSON.stringify(filters)}`);
    
    if (filters.categories) {
      for (const category of filters.categories) {
        await this.page.locator(`[data-filter-category="${category}"]`).check();
      }
    }
    
    if (filters.dateRange) {
      await this.dateRangeFilter.selectOption(filters.dateRange);
    }
    
    if (filters.cards) {
      for (const card of filters.cards) {
        await this.page.locator(`[data-filter-card="${card}"]`).check();
      }
    }
    
    await this.waitForChartUpdate();
  }

  async performDrillDown() {
    logger.info('Performing drill-down operation');
    const firstDataPoint = await this.monthDataPoint.first();
    await firstDataPoint.click();
    await this.detailView.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getInfoMessage() {
    logger.info('Getting info message');
    await expect(this.infoMessage).toBeVisible();
    return this.infoMessage;
  }

  async getErrorMessage() {
    logger.info('Getting error message');
    await expect(this.errorMessage).toBeVisible();
    return this.errorMessage;
  }

  async getWarningMessage() {
    logger.info('Getting warning message');
    await expect(this.warningMessage).toBeVisible();
    return this.warningMessage;
  }

  async setupTransactions(transactions) {
    logger.info(`Setting up transactions: ${JSON.stringify(transactions)}`);
    await this.page.evaluate((txns) => {
      window.mockTransactions = txns.map((txn, index) => ({
        id: `txn-${index + 1}`,
        ...txn,
        date: new Date().toISOString()
      }));
    }, transactions);
  }

  async setupMonthlyTransactions(monthCount, transactionCount) {
    logger.info(`Setting up ${transactionCount} transactions across ${monthCount} months`);
    await this.page.evaluate(({ months, count }) => {
      const transactions = [];
      const now = new Date();
      
      for (let i = 0; i < count; i++) {
        const monthOffset = Math.floor(i / (count / months));
        const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, 15);
        
        transactions.push({
          id: `txn-${i + 1}`,
          amount: 50 + Math.random() * 200,
          date: date.toISOString(),
          category: ['Food & Dining', 'Fuel', 'Shopping', 'Travel'][i % 4]
        });
      }
      
      window.mockTransactions = transactions;
    }, { months: monthCount, count: transactionCount });
  }
};