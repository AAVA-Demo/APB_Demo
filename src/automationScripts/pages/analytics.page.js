const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const config = require('../../config/environment');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    // Charts
    this.categoryChart = page.locator('[data-testid="category-chart"], #categoryChart, canvas.chart-pie');
    this.trendsChart = page.locator('[data-testid="trends-chart"], #trendChart, canvas.chart-line');
    
    // Chart Elements
    this.chartTooltip = page.locator('.chartjs-tooltip, [data-testid="chart-tooltip"]');
    this.categoryLabels = page.locator('[data-testid="category-label"], .chart-legend-item');
    
    // Views
    this.trendsViewTab = page.locator('[data-testid="trends-view"], button:has-text("Monthly Trends")');
    this.categoryViewTab = page.locator('[data-testid="category-view"], button:has-text("Category")');
    
    // Messages
    this.categorizationWarning = page.locator('[data-testid="categorization-warning"], .categorization-warning');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"], .insufficient-data-message');
    
    // Total Spending
    this.totalSpendingLabel = page.locator('[data-testid="total-spending"], .total-spending');
    
    // Gap Indicators
    this.gapIndicatorElements = page.locator('[data-testid="gap-indicator"], .gap-indicator, .dotted-line');
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto(config.baseUrl + '/analytics');
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    logger.info('Analytics page loaded successfully');
  }

  async selectTrendsView() {
    await expect(this.trendsViewTab).toBeVisible();
    await this.trendsViewTab.click();
    await expect(this.trendsChart).toBeVisible({ timeout: 5000 });
    logger.info('Monthly trends view selected');
  }

  async getCategoryLabels() {
    await expect(this.categoryChart).toBeVisible();
    // Extract category labels from chart data
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-pie, #categoryChart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    logger.info(`Retrieved ${labels.length} category labels`);
    return labels;
  }

  async getCategoryAmount(categoryName) {
    await expect(this.categoryChart).toBeVisible();
    const amount = await this.page.evaluate((category) => {
      const canvas = document.querySelector('canvas.chart-pie, #categoryChart');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(category);
        if (index !== -1) {
          return canvas.chart.data.datasets[0].data[index].toString();
        }
      }
      return '0';
    }, categoryName);
    logger.info(`Category ${categoryName} amount: ${amount}`);
    return amount;
  }

  async getTotalSpending() {
    await expect(this.totalSpendingLabel).toBeVisible();
    const text = await this.totalSpendingLabel.textContent();
    return text.replace(/[^0-9]/g, '');
  }

  async hoverOverCategory(categoryName) {
    await expect(this.categoryChart).toBeVisible();
    await this.page.evaluate((category) => {
      const canvas = document.querySelector('canvas.chart-pie, #categoryChart');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(category);
        if (index !== -1) {
          const meta = canvas.chart.getDatasetMeta(0);
          const element = meta.data[index];
          const event = new MouseEvent('mousemove', {
            clientX: element.x,
            clientY: element.y
          });
          canvas.dispatchEvent(event);
        }
      }
    }, categoryName);
    await this.page.waitForTimeout(500);
    logger.info(`Hovered over category: ${categoryName}`);
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async getVisibleCategories() {
    await expect(this.categoryChart).toBeVisible();
    const visibleCategories = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-pie, #categoryChart');
      if (canvas && canvas.chart) {
        const data = canvas.chart.data;
        return data.labels.filter((label, index) => {
          return data.datasets[0].data[index] > 0;
        });
      }
      return [];
    });
    logger.info(`Visible categories: ${visibleCategories.join(', ')}`);
    return visibleCategories;
  }

  async getAllCategoryElements() {
    await expect(this.categoryChart).toBeVisible();
    const categories = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-pie, #categoryChart');
      if (canvas && canvas.chart) {
        const data = canvas.chart.data;
        return data.labels.map((label, index) => ({
          name: label,
          amount: data.datasets[0].data[index].toString(),
          visible: data.datasets[0].data[index] > 0
        }));
      }
      return [];
    });
    return categories;
  }

  async getCategorizationWarningText() {
    await expect(this.categorizationWarning).toBeVisible();
    return await this.categorizationWarning.textContent();
  }

  async getTrendMonths() {
    await expect(this.trendsChart).toBeVisible();
    const months = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas.chart-line, #trendChart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    logger.info(`Retrieved ${months.length} trend months`);
    return months;
  }

  async getMonthTotal(monthName) {
    await expect(this.trendsChart).toBeVisible();
    const total = await this.page.evaluate((month) => {
      const canvas = document.querySelector('canvas.chart-line, #trendChart');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(month);
        if (index !== -1) {
          return canvas.chart.data.datasets[0].data[index].toString();
        }
      }
      return '0';
    }, monthName);
    logger.info(`Month ${monthName} total: ${total}`);
    return total;
  }

  async getMonthBreakdown(monthName) {
    await expect(this.trendsChart).toBeVisible();
    const breakdown = await this.page.evaluate((month) => {
      const canvas = document.querySelector('canvas.chart-line, #trendChart');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(month);
        if (index !== -1) {
          const result = {};
          canvas.chart.data.datasets.forEach(dataset => {
            result[dataset.label] = dataset.data[index].toString();
          });
          return result;
        }
      }
      return {};
    }, monthName);
    logger.info(`Month ${monthName} breakdown retrieved`);
    return breakdown;
  }

  async hoverOverMonth(monthName) {
    await expect(this.trendsChart).toBeVisible();
    await this.page.evaluate((month) => {
      const canvas = document.querySelector('canvas.chart-line, #trendChart');
      if (canvas && canvas.chart) {
        const index = canvas.chart.data.labels.indexOf(month);
        if (index !== -1) {
          const meta = canvas.chart.getDatasetMeta(0);
          const element = meta.data[index];
          const event = new MouseEvent('mousemove', {
            clientX: element.x,
            clientY: element.y
          });
          canvas.dispatchEvent(event);
        }
      }
    }, monthName);
    await this.page.waitForTimeout(500);
    logger.info(`Hovered over month: ${monthName}`);
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getGapIndicators() {
    const count = await this.gapIndicatorElements.count();
    const indicators = [];
    for (let i = 0; i < count; i++) {
      const element = this.gapIndicatorElements.nth(i);
      indicators.push({
        visible: await element.isVisible(),
        text: await element.textContent()
      });
    }
    logger.info(`Retrieved ${indicators.length} gap indicators`);
    return indicators;
  }
};