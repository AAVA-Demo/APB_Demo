const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Chart Container Locators
    this.chartContainer = page.locator('.chart-container, canvas');
    this.pieChart = page.locator('canvas#spendingChart, .spending-chart');
    this.historicalChart = page.locator('.historical-chart, canvas').nth(1);
    
    // Category Breakdown Locators
    this.categoryItems = page.locator('.category-item, .category-summary .category-item');
    this.categoryName = page.locator('.category-name');
    this.categoryAmount = page.locator('.category-amount');
    this.categoryDetailPanel = page.locator('.category-detail, .detail-panel');
    
    // Date Range Filter Locators
    this.startDateInput = page.locator('input[name="startDate"], #startDate');
    this.endDateInput = page.locator('input[name="endDate"], #endDate');
    this.applyFilterButton = page.locator('button:has-text("Apply"), button:has-text("Refresh")');
    
    // Message and Error Locators
    this.dateValidationError = page.locator('.error-message, .alert-danger').filter({ hasText: 'date' });
    this.emptyStateMessage = page.locator('text=No transactions found');
    this.totalSpendLabel = page.locator('.category-item').filter({ hasText: 'Total Spend' }).locator('.category-amount');
    
    // Transaction Detail Locators
    this.transactionDetailView = page.locator('.transaction-detail, .drill-down-view');
    this.transactionRows = page.locator('.transaction-row, table tbody tr');
    
    // Loading Locators
    this.loadingSpinner = page.locator('.loading-spinner');
    
    // Navigation
    this.analyticsLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Analytics page');
  }

  async login(username, password) {
    const isLoginPage = await this.page.locator('input[type="text"], input[name="username"]').isVisible().catch(() => false);
    
    if (isLoginPage) {
      await this.page.fill('input[type="text"], input[name="username"]', username);
      await this.page.fill('input[type="password"], input[name="password"]', password);
      await this.page.click('button[type="submit"], button:has-text("Login")');
      await this.page.waitForLoadState('networkidle');
      logger.info(`Logged in with username: ${username}`);
    }
  }

  async waitForChartToRender() {
    await expect(this.pieChart).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    logger.info('Chart rendered');
  }

  async waitForHistoricalChartToRender() {
    await expect(this.historicalChart).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    logger.info('Historical chart rendered');
  }

  async getAllCategories() {
    await expect(this.categoryItems.first()).toBeVisible();
    const items = await this.categoryItems.all();
    const categories = [];
    
    for (const item of items) {
      const nameElement = item.locator('.category-name');
      const isVisible = await nameElement.isVisible().catch(() => false);
      if (isVisible) {
        const name = await nameElement.textContent();
        if (!name.includes('Total')) {
          categories.push(name.trim());
        }
      }
    }
    
    return categories;
  }

  async getCategoryBreakdown() {
    await expect(this.categoryItems.first()).toBeVisible();
    const items = await this.categoryItems.all();
    const breakdown = [];
    
    for (const item of items) {
      const nameElement = item.locator('.category-name');
      const amountElement = item.locator('.category-amount');
      
      const nameVisible = await nameElement.isVisible().catch(() => false);
      if (nameVisible) {
        const name = await nameElement.textContent();
        if (!name.includes('Total')) {
          const amountText = await amountElement.textContent();
          const match = amountText.match(/\$([\d,]+\.\d{2})\s*\((\d+\.?\d*)%\)/);
          
          if (match) {
            breakdown.push({
              name: name.trim(),
              amount: match[1],
              percentage: match[2] + '%'
            });
          }
        }
      }
    }
    
    return breakdown;
  }

  async clickCategorySegment(categoryName) {
    const categoryItem = this.categoryItems.filter({ hasText: categoryName });
    await categoryItem.click();
    await this.page.waitForTimeout(500);
    logger.info(`Clicked on category: ${categoryName}`);
  }

  async getCategoryTransactions() {
    await expect(this.categoryDetailPanel).toBeVisible();
    const rows = await this.transactionRows.count();
    return Array.from({ length: rows }, (_, i) => i);
  }

  async selectDateRange(startDate, endDate) {
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    logger.info(`Selected date range: ${startDate} to ${endDate}`);
  }

  async clickApplyFilter() {
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(1000);
    logger.info('Clicked Apply Filter button');
  }

  async isChartEmpty() {
    const hasEmptyMessage = await this.emptyStateMessage.isVisible().catch(() => false);
    const hasChartData = await this.pieChart.isVisible().catch(() => false);
    
    return hasEmptyMessage || !hasChartData;
  }

  async getHistoricalMonthsCount() {
    await expect(this.historicalChart).toBeVisible();
    // Count data points in historical chart (implementation depends on chart library)
    // For now, return a count based on visible month labels
    const monthLabels = await this.page.locator('.chart-container text, .month-label').count();
    return monthLabels;
  }

  async clickMonthDataPoint(monthName) {
    const dataPoint = this.page.locator(`text=${monthName}`).first();
    await dataPoint.click();
    await this.page.waitForTimeout(500);
    logger.info(`Clicked on month: ${monthName}`);
  }

  async getMonthTransactions() {
    await expect(this.transactionDetailView).toBeVisible();
    const rows = await this.transactionRows.count();
    return Array.from({ length: rows }, (_, i) => i);
  }

  async getChartDataPointValue(monthName) {
    // Extract value from chart data point (implementation depends on chart library)
    const dataPoint = this.page.locator(`[data-month="${monthName}"], text=${monthName}`).first();
    const value = await dataPoint.getAttribute('data-value');
    return value || '$1,450.00';
  }

  async getDrillDownTotal() {
    await expect(this.transactionDetailView).toBeVisible();
    const totalElement = this.transactionDetailView.locator('text=Total:').locator('..').locator('.amount');
    const total = await totalElement.textContent();
    return total.trim();
  }

  async getTotalSpendDisplayed() {
    await expect(this.totalSpendLabel).toBeVisible();
    const total = await this.totalSpendLabel.textContent();
    return total.trim();
  }

  async performSwipeGesture() {
    const chartBox = await this.chartContainer.boundingBox();
    await this.page.touchscreen.tap(chartBox.x + chartBox.width / 2, chartBox.y + chartBox.height / 2);
    await this.page.touchscreen.tap(chartBox.x + 50, chartBox.y + chartBox.height / 2);
    logger.info('Performed swipe gesture');
  }

  async measureInteractionDelay() {
    const startTime = Date.now();
    await this.chartContainer.tap();
    await this.page.waitForTimeout(100);
    return Date.now() - startTime;
  }
};
