const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.TrendAnalysisPage = class TrendAnalysisPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.trendChart = page.locator('[data-testid="trend-chart"], .chart-container:has-text("Monthly Spend Trends")');
    this.chartCanvas = page.locator('canvas#chart, canvas');
    this.dataPoints = page.locator('[data-testid="data-point"], .chart-data-point');
    
    // Time Period Selectors
    this.timePeriodButtons = page.locator('[data-testid="time-period-button"], .btn:has-text("Months")');
    this.threeMonthsButton = page.locator('button:has-text("3 Months")');
    this.sixMonthsButton = page.locator('button:has-text("6 Months")');
    this.twelveMonthsButton = page.locator('button:has-text("12 Months")');
    this.q1Button = page.locator('button:has-text("Q1")');
    this.q2Button = page.locator('button:has-text("Q2")');
    
    // Summary Locators
    this.periodSummary = page.locator('[data-testid="period-summary"], .period-summary');
    this.totalAmount = page.locator('[data-testid="total-amount"], .summary-total');
    this.averageAmount = page.locator('[data-testid="average-amount"], .summary-average');
    this.comparisonResult = page.locator('[data-testid="comparison-result"], .comparison-summary');
    
    // Notification Locators
    this.missingDataNotification = page.locator('[data-testid="missing-data-notification"], .notification:has-text("Data available")');
    
    // Navigation
    this.analyticsTab = page.locator('[href="#!/analytics"], a:has-text("Analytics")');
    this.trendAnalysisSection = page.locator('[data-testid="trend-analysis"], .trend-analysis-section');
  }

  async navigate() {
    logger.info('Navigating to Trend Analysis');
    await this.page.goto('/#!/analytics');
    // Assuming trend analysis is part of analytics page
    await this.waitForTrendAnalysisLoad();
  }

  async waitForTrendAnalysisLoad() {
    logger.info('Waiting for trend analysis to load');
    await expect(this.trendChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getDataPointCount() {
    // For Chart.js, we need to evaluate the chart data
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data.length;
      }
      return 0;
    });
  }

  async getVisibleDataPointCount() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        const data = canvas.chart.data.datasets[0].data;
        return data.filter(d => d !== null && d !== undefined && d > 0).length;
      }
      return 0;
    });
  }

  async hoverOverDataPoint(index) {
    logger.info(`Hovering over data point ${index}`);
    
    // Simulate hover by triggering chart tooltip
    const tooltipData = await this.page.evaluate((idx) => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        const chart = canvas.chart;
        const meta = chart.getDatasetMeta(0);
        const element = meta.data[idx];
        
        if (element) {
          const month = chart.data.labels[idx];
          const amount = chart.data.datasets[0].data[idx];
          return {
            month: month,
            amount: `$${amount.toFixed(2)}`
          };
        }
      }
      return { month: '', amount: '' };
    }, index);
    
    return tooltipData;
  }

  async getAllMonthlyData() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        const chart = canvas.chart;
        const labels = chart.data.labels;
        const data = chart.data.datasets[0].data;
        
        return labels.map((label, index) => ({
          month: label,
          amount: `$${data[index].toFixed(2)}`
        }));
      }
      return [];
    });
  }

  async getAllMonthLabels() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
  }

  async selectTimePeriod(period) {
    logger.info(`Selecting time period: ${period}`);
    const button = this.page.locator(`button:has-text("${period}")`);
    await button.click();
    await this.page.waitForTimeout(1000); // Wait for chart update
  }

  async getPeriodSummary() {
    await expect(this.periodSummary).toBeVisible();
    
    const totalText = await this.totalAmount.textContent();
    const averageText = await this.averageAmount.textContent();
    
    return {
      total: totalText.trim(),
      average: averageText.trim()
    };
  }

  async getComparisonResult() {
    await expect(this.comparisonResult).toBeVisible();
    const text = await this.comparisonResult.textContent();
    
    // Extract percentage change
    const match = text.match(/(\d+\.\d+)%/);
    
    return {
      text: text.trim(),
      percentageChange: match ? match[1] + '%' : '0%'
    };
  }

  async getHighestSpendingMonth() {
    const monthlyData = await this.getAllMonthlyData();
    
    let highest = { month: '', amount: '$0.00', value: 0 };
    
    monthlyData.forEach(data => {
      const value = parseFloat(data.amount.replace(/[$,]/g, ''));
      if (value > highest.value) {
        highest = {
          month: data.month,
          amount: data.amount,
          value: value
        };
      }
    });
    
    return highest;
  }

  async getMissingDataNotificationText() {
    await expect(this.missingDataNotification).toBeVisible();
    return await this.missingDataNotification.textContent();
  }
};
