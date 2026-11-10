const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Category Breakdown Locators
    this.categoryBreakdownContainer = page.locator('[data-testid="category-breakdown-container"]');
    this.categoryItems = page.locator('[data-testid="category-item"]');
    this.categoryNameElements = page.locator('[data-testid="category-name"]');
    this.categoryAmountElements = page.locator('[data-testid="category-amount"]');
    this.categoryPercentageElements = page.locator('[data-testid="category-percentage"]');
    
    // Trend Chart Locators
    this.trendChartContainer = page.locator('[data-testid="trend-chart-container"]');
    this.trendChartCanvas = page.locator('[data-testid="trend-chart-canvas"]');
    this.monthDataPoints = page.locator('[data-testid="month-data-point"]');
    
    // Filter Locators
    this.startDateFilter = page.locator('[data-testid="filter-start-date"]');
    this.endDateFilter = page.locator('[data-testid="filter-end-date"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    this.clearFilterButton = page.locator('[data-testid="clear-filter-button"]');
    
    // Message Locators
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.noTransactionDataMessage = page.locator('[data-testid="no-transaction-data-message"]');
    
    // Loading Indicator
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
  }

  async authenticate(userId, authToken) {
    await this.page.evaluate(({ userId, authToken }) => {
      window.sessionStorage.setItem('userId', userId);
      window.sessionStorage.setItem('authToken', authToken);
    }, { userId, authToken });
    await this.page.reload();
  }

  async waitForAnalyticsLoad() {
    await expect(this.loadingIndicator).not.toBeVisible({ timeout: 5000 });
    await expect(this.categoryBreakdownContainer).toBeVisible();
  }

  async waitForTrendChartLoad() {
    await expect(this.loadingIndicator).not.toBeVisible({ timeout: 5000 });
    await expect(this.trendChartContainer).toBeVisible();
  }

  async getAllCategoryTotals() {
    await expect(this.categoryItems.first()).toBeVisible();
    
    const categories = {};
    const items = await this.categoryItems.all();
    
    for (const item of items) {
      const name = await item.locator('[data-testid="category-name"]').textContent();
      const amountText = await item.locator('[data-testid="category-amount"]').textContent();
      const amount = parseInt(amountText.replace(/[^0-9]/g, ''));
      categories[name.trim()] = amount;
    }
    
    return categories;
  }

  async getAllCategoryPercentages() {
    await expect(this.categoryItems.first()).toBeVisible();
    
    const percentages = {};
    const items = await this.categoryItems.all();
    
    for (const item of items) {
      const name = await item.locator('[data-testid="category-name"]').textContent();
      const percentageText = await item.locator('[data-testid="category-percentage"]').textContent();
      const percentage = parseFloat(percentageText.replace(/[^0-9.]/g, ''));
      percentages[name.trim()] = percentage;
    }
    
    return percentages;
  }

  async getCategoryTotal(categoryName) {
    const categoryItem = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await expect(categoryItem).toBeVisible();
    
    const amountText = await categoryItem.locator('[data-testid="category-amount"]').textContent();
    return parseInt(amountText.replace(/[^0-9]/g, ''));
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async getWelcomeMessage() {
    await expect(this.welcomeMessage).toBeVisible();
    return await this.welcomeMessage.textContent();
  }

  async getMonthlyTrendData() {
    await expect(this.trendChartContainer).toBeVisible();
    
    return await this.page.evaluate(() => {
      const chartData = window.trendChartData || [];
      return chartData.map(d => ({
        month: d.month,
        amount: d.amount
      }));
    });
  }

  async getMonthTotal(month) {
    const monthlyData = await this.getMonthlyTrendData();
    const monthData = monthlyData.find(d => d.month === month);
    return monthData ? monthData.amount : 0;
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getNoTransactionDataMessage() {
    await expect(this.noTransactionDataMessage).toBeVisible();
    return await this.noTransactionDataMessage.textContent();
  }

  async applyDateFilter(startDate, endDate) {
    await expect(this.startDateFilter).toBeVisible();
    await expect(this.endDateFilter).toBeVisible();
    
    await this.startDateFilter.fill(startDate);
    await this.endDateFilter.fill(endDate);
    await this.applyFilterButton.click();
  }

  async clearDateFilter() {
    await expect(this.clearFilterButton).toBeVisible();
    await this.clearFilterButton.click();
  }
};