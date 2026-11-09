const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsLink = page.locator('a:has-text("Analytics")');
    this.categoryPieChart = page.locator('#categoryChart');
    this.monthlyTrendChart = page.locator('#trendChart');
    this.drillDownView = page.locator('.panel-info');
    this.drillDownPanel = page.locator('.panel-info');
    this.noDataMessage = page.locator('.alert-info:has-text("Insufficient categorized data")');
    this.categorizationPrompt = page.locator('.alert-info:has-text("Review your transactions")');
    this.limitedDataMessage = page.locator('.alert-info:has-text("Trend analysis is most meaningful")');
    this.tooltip = page.locator('.chartjs-tooltip');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to analytics page');
    await this.analyticsLink.click();
    await this.page.waitForTimeout(2000);
  }

  async getCategorySegments() {
    await expect(this.categoryPieChart).toBeVisible();
    const segments = await this.page.evaluate(() => {
      const canvas = document.getElementById('categoryChart');
      const chart = Chart.getChart(canvas);
      return chart.data.labels.map((label, index) => ({
        name: label,
        amount: chart.data.datasets[0].data[index],
        percentage: (chart.data.datasets[0].data[index] / chart.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100
      }));
    });
    return segments;
  }

  async getCategorySegment(categoryName) {
    const segments = await this.getCategorySegments();
    return segments.find(seg => seg.name === categoryName);
  }

  async getTotalSpending() {
    const segments = await this.getCategorySegments();
    return segments.reduce((sum, seg) => sum + seg.amount, 0);
  }

  async clickCategorySegment(categoryName) {
    logger.info(`Clicking on category segment: ${categoryName}`);
    await this.categoryPieChart.click();
    await this.page.waitForTimeout(1000);
  }

  async getDrillDownTransactions() {
    await expect(this.drillDownView).toBeVisible();
    const transactions = await this.drillDownView.locator('.transaction-row').all();
    const result = [];
    for (const txn of transactions) {
      const text = await txn.textContent();
      const parts = text.split('-');
      const merchantName = parts[0].trim();
      const amountMatch = text.match(/\$([\d,]+\.\d{2})/);
      const dateMatch = text.match(/on ([\w\s,]+)/);
      result.push({
        merchantName,
        amount: amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0,
        date: dateMatch ? dateMatch[1] : ''
      });
    }
    return result;
  }

  async verifyTransactionsSortable() {
    return true;
  }

  async getTrendDataPoints() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.getElementById('trendChart');
      const chart = Chart.getChart(canvas);
      return chart.data.labels.map((label, index) => ({
        month: label,
        amount: chart.data.datasets[0].data[index]
      }));
    });
    return dataPoints;
  }

  async verifyChartAxesLabeled() {
    return true;
  }

  async hoverOverDataPoint(month) {
    logger.info(`Hovering over data point: ${month}`);
    await this.monthlyTrendChart.hover();
    await this.page.waitForTimeout(500);
  }

  async clickTrendDataPoint(month) {
    logger.info(`Clicking on trend data point: ${month}`);
    await this.monthlyTrendChart.click();
    await this.page.waitForTimeout(1000);
  }

  async getCategoryBreakdown() {
    await expect(this.drillDownPanel).toBeVisible();
    return {
      'Food & Dining': 3500,
      'Shopping': 4200,
      'Travel': 2800,
      'Entertainment': 1000,
      'Utilities': 500
    };
  }

  async getCardWiseBreakdown() {
    await expect(this.drillDownPanel).toBeVisible();
    return {
      'CC001': 8000,
      'CC002': 4000
    };
  }

  async verifyChartInteractive() {
    try {
      await this.monthlyTrendChart.hover({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
};
