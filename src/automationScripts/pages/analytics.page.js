const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.analyticsContainer = page.locator('.analytics-container, #analytics, [data-testid="analytics"]');
    
    this.monthlyTrendsTab = page.locator('button:has-text("Monthly Trends"), a:has-text("Trends"), [data-tab="trends"]');
    this.categoryWiseTab = page.locator('button:has-text("Category"), a:has-text("Category-Wise"), [data-tab="category"]');
    
    this.trendsChart = page.locator('.chart-container canvas, #trend-chart, [data-chart="trends"]');
    this.categoryChart = page.locator('.chart-container canvas, #category-chart, [data-chart="category"]');
    
    this.categoryFilter = page.locator('select.form-control, select[ng-model*="category"], #category-filter');
    this.categoryOption = (category) => page.locator(`option:has-text("${category}")`);
    
    this.drillDownView = page.locator('.drill-down-view, .transaction-details, [data-view="drilldown"]');
    this.drillDownTransactions = page.locator('.transaction-item, .drill-down-view tr');
    
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.insufficientDataMessage = page.locator('.alert-info, .message:has-text("months of data")');
    
    this.categoryLabels = page.locator('.chart-container table td:first-child, [data-category-label]');
    this.categoryTotals = page.locator('.chart-container table td:nth-child(2), [data-category-total]');
    this.categoryPercentages = page.locator('.chart-container table td:nth-child(3), [data-category-percentage]');
  }

  async waitForAnalyticsPageLoad() {
    await expect(this.analyticsContainer).toBeVisible({ timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Analytics page loaded');
  }

  async selectMonthlyTrendsView() {
    const tabVisible = await this.monthlyTrendsTab.isVisible().catch(() => false);
    if (tabVisible) {
      await this.monthlyTrendsTab.click();
      logger.info('Selected Monthly Trends view');
    } else {
      logger.info('Monthly Trends view already active or no tab required');
    }
    await this.page.waitForLoadState('networkidle');
  }

  async selectCategoryWiseView() {
    const tabVisible = await this.categoryWiseTab.isVisible().catch(() => false);
    if (tabVisible) {
      await this.categoryWiseTab.click();
      logger.info('Selected Category-Wise view');
    } else {
      logger.info('Category-Wise view already active or no tab required');
    }
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendsChartLoad() {
    await expect(this.trendsChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
    logger.info('Trends chart loaded');
  }

  async waitForCategoryChartLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
    logger.info('Category chart loaded');
  }

  async getTrendsChartMonthsCount() {
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[id*="trend"]');
      if (!canvas) return 0;
      
      const rows = document.querySelectorAll('.chart-container table tbody tr');
      if (rows.length > 0) return rows.length;
      
      const labels = document.querySelectorAll('[data-month-label]');
      return labels.length;
    });
    return chartData;
  }

  async getMonthlyTrendsData() {
    const trendsData = await this.page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll('.chart-container table tbody tr');
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          data.push({
            month: cells[0].textContent.trim(),
            total: parseFloat(cells[1].textContent.replace(/[^0-9.]/g, ''))
          });
        }
      });
      
      return data;
    });
    return trendsData;
  }

  async clickTrendsDataPoint(month) {
    const dataPoint = this.page.locator(`[data-month="${month}"], td:has-text("${month}")`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    logger.info(`Clicked trends data point for ${month}`);
  }

  async waitForDrillDownView() {
    await expect(this.drillDownView).toBeVisible({ timeout: 10000 });
    logger.info('Drill-down view loaded');
  }

  async isDrillDownViewVisible() {
    return await this.drillDownView.isVisible();
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async isTrendsChartVisible() {
    return await this.trendsChart.isVisible().catch(() => false);
  }

  async isCategoryChartVisible() {
    return await this.categoryChart.isVisible().catch(() => false);
  }

  async getDisplayedCategories() {
    const categories = await this.categoryLabels.allTextContents();
    return categories.map(cat => cat.trim()).filter(cat => cat.length > 0);
  }

  async getCategorySpendingData() {
    const categoryData = await this.page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll('.chart-container table tbody tr');
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
          data.push({
            category: cells[0].textContent.trim(),
            total: parseFloat(cells[1].textContent.replace(/[^0-9.]/g, '')),
            percentage: parseFloat(cells[2].textContent.replace(/[^0-9.]/g, ''))
          });
        }
      });
      
      return data;
    });
    return categoryData;
  }

  async selectCategoryFilter(category) {
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption({ label: category });
    logger.info(`Selected category filter: ${category}`);
    await this.page.waitForTimeout(500);
  }

  async clickCategorySegment(category) {
    const segment = this.page.locator(`[data-category="${category}"], td:has-text("${category}")`);
    await expect(segment).toBeVisible();
    await segment.click();
    logger.info(`Clicked category segment: ${category}`);
  }

  async getDrillDownTransactionCount() {
    const count = await this.drillDownTransactions.count();
    return count;
  }

  async getDrillDownTransactions() {
    const transactions = await this.drillDownTransactions.allTextContents();
    return transactions;
  }

  async getCategoryDataByName(categoryName) {
    const allData = await this.getCategorySpendingData();
    return allData.find(data => data.category === categoryName);
  }
};