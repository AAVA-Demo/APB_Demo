const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

exports.AnalyticsPage = class AnalyticsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    
    // Main Container Locators
    this.analyticsContainer = page.locator('.analytics-container, [data-testid="analytics-container"]');
    
    // Chart Locators
    this.categoryChart = page.locator('#categoryChart, canvas[data-chart="category"], [data-testid="category-chart"]');
    this.trendChart = page.locator('#trendChart, canvas[data-chart="trend"], [data-testid="trend-chart"]');
    
    // Navigation Locators
    this.trendViewTab = page.locator('[data-tab="trends"], .tab-trends, a:has-text("Trends")');
    this.categoryViewTab = page.locator('[data-tab="categories"], .tab-categories, a:has-text("Categories")');
    
    // Data Display Locators
    this.categoryLabels = page.locator('.category-label, [data-testid="category-label"]');
    this.categoryAmounts = page.locator('.category-amount, [data-testid="category-amount"]');
    this.trendMonthLabels = page.locator('.trend-month-label, [data-testid="month-label"]');
    this.trendDataPoints = page.locator('.trend-data-point, [data-testid="data-point"]');
    
    // Message Locators
    this.emptyStateMessage = page.locator('.empty-state-message, [data-testid="empty-state"], .no-data-message');
    this.informationalMessage = page.locator('.info-message, .alert-info, [data-testid="info-message"]');
    
    // Tooltip Locators
    this.chartTooltip = page.locator('.chart-tooltip, [data-testid="chart-tooltip"], .tooltip');
    
    // Summary Table Locators
    this.categorySummaryTable = page.locator('table.category-summary, [data-testid="category-summary-table"]');
    this.categoryRows = page.locator('table.category-summary tbody tr, [data-testid="category-row"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.waitForPageLoad();
    await expect(this.analyticsContainer).toBeVisible({ timeout: 10000 });
  }

  async navigateToTrendView() {
    await expect(this.trendViewTab).toBeVisible();
    await this.trendViewTab.click();
    await this.page.waitForTimeout(1000); // Wait for chart to render
    await expect(this.trendChart).toBeVisible();
  }

  // Category Chart Methods
  async getCategoryCount() {
    // Try multiple approaches to get category count
    const labelCount = await this.categoryLabels.count();
    if (labelCount > 0) return labelCount;
    
    // Alternative: Count from summary table
    const rowCount = await this.categoryRows.count();
    if (rowCount > 0) return rowCount;
    
    // Alternative: Extract from chart data
    const chartCategories = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-chart="category"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
    return chartCategories;
  }

  async getCategoryLabels() {
    await this.page.waitForTimeout(1000);
    
    // Try to get labels from visible elements
    const labelElements = await this.categoryLabels.all();
    if (labelElements.length > 0) {
      const labels = [];
      for (const element of labelElements) {
        labels.push(await element.textContent());
      }
      return labels;
    }
    
    // Alternative: Get from summary table
    const tableVisible = await this.categorySummaryTable.isVisible().catch(() => false);
    if (tableVisible) {
      const rows = await this.categoryRows.all();
      const labels = [];
      for (const row of rows) {
        const categoryCell = row.locator('td:first-child');
        labels.push(await categoryCell.textContent());
      }
      return labels;
    }
    
    // Alternative: Extract from chart
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-chart="category"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
  }

  async getCategoryAmount(categoryName) {
    // Try to find amount in summary table
    const tableVisible = await this.categorySummaryTable.isVisible().catch(() => false);
    if (tableVisible) {
      const row = this.page.locator(`tr:has-text("${categoryName}")`);
      const amountCell = row.locator('td:nth-child(2)');
      const text = await amountCell.textContent();
      return text.replace(/[^0-9.]/g, '');
    }
    
    // Alternative: Extract from chart data
    return await this.page.evaluate((category) => {
      const canvas = document.querySelector('canvas[data-chart="category"]');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(category);
        if (index !== -1) {
          return canvas.chart.data.datasets[0].data[index].toString();
        }
      }
      return '0';
    }, categoryName);
  }

  async getActiveCategoriesWithSpending() {
    const categories = await this.getCategoryLabels();
    const activeCategories = [];
    
    for (const category of categories) {
      const amount = await this.getCategoryAmount(category);
      if (parseFloat(amount) > 0) {
        activeCategories.push(category);
      }
    }
    
    return activeCategories;
  }

  // Trend Chart Methods
  async getTrendMonthCount() {
    await this.page.waitForTimeout(1000);
    
    // Try to get count from visible elements
    const labelCount = await this.trendMonthLabels.count();
    if (labelCount > 0) return labelCount;
    
    // Alternative: Extract from chart
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-chart="trend"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
  }

  async getTrendMonthLabels() {
    await this.page.waitForTimeout(1000);
    
    // Try to get labels from visible elements
    const labelElements = await this.trendMonthLabels.all();
    if (labelElements.length > 0) {
      const labels = [];
      for (const element of labelElements) {
        labels.push(await element.textContent());
      }
      return labels;
    }
    
    // Alternative: Extract from chart
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-chart="trend"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
  }

  async getTrendValueForMonth(monthName) {
    return await this.page.evaluate((month) => {
      const canvas = document.querySelector('canvas[data-chart="trend"]');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(month);
        if (index !== -1) {
          return canvas.chart.data.datasets[0].data[index].toString();
        }
      }
      return '0';
    }, monthName);
  }

  async getZeroSpendMonths() {
    const months = await this.getTrendMonthLabels();
    const zeroMonths = [];
    
    for (const month of months) {
      const value = await this.getTrendValueForMonth(month);
      if (parseFloat(value) === 0) {
        zeroMonths.push(month);
      }
    }
    
    return zeroMonths;
  }

  // Interaction Methods
  async clickTrendDataPoint(monthName) {
    // Try to click on chart canvas at the position of the data point
    await this.trendChart.click();
    await this.page.waitForTimeout(500);
    
    // Alternative: Trigger chart interaction via JavaScript
    await this.page.evaluate((month) => {
      const canvas = document.querySelector('canvas[data-chart="trend"]');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(month);
        if (index !== -1) {
          // Simulate click on data point
          const meta = canvas.chart.getDatasetMeta(0);
          const element = meta.data[index];
          if (element) {
            const event = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
              clientX: element.x,
              clientY: element.y
            });
            canvas.dispatchEvent(event);
          }
        }
      }
    }, monthName);
  }

  async isTrendTooltipVisible() {
    await this.page.waitForTimeout(500);
    return await this.chartTooltip.isVisible().catch(() => false);
  }

  async getTrendTooltipText() {
    await expect(this.chartTooltip).toBeVisible({ timeout: 3000 });
    return await this.chartTooltip.textContent();
  }

  // Message Methods
  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible({ timeout: 5000 });
    return await this.emptyStateMessage.textContent();
  }

  async getInformationalMessage() {
    await expect(this.informationalMessage).toBeVisible({ timeout: 5000 });
    return await this.informationalMessage.textContent();
  }

  // Error Detection
  async hasPageErrors() {
    // Check for console errors
    const errors = [];
    this.page.on('pageerror', error => errors.push(error));
    await this.page.waitForTimeout(1000);
    return errors.length > 0;
  }
};