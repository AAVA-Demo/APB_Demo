const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Category Spending Locators
    this.categorySpendingSection = page.locator('[data-testid="category-spending"], .panel:has-text("Category-wise Spending")');
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"], canvas#category-chart');
    this.categoryBreakdownTable = page.locator('[data-testid="category-table"], .table:has-text("Category")');
    this.categoryRows = page.locator('[data-testid="category-row"], .table tbody tr');
    
    // Monthly Trends Locators
    this.monthlyTrendsSection = page.locator('[data-testid="monthly-trends"], .panel:has-text("Monthly Spend Trends")');
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"], canvas#monthly-trends-chart');
    this.categoryBreakdownModal = page.locator('[data-testid="category-breakdown-modal"], .modal:has-text("Category Breakdown")');
    
    // Card-wise Spend Locators
    this.cardWiseSection = page.locator('[data-testid="card-wise-spend"], .panel:has-text("Card-wise Spend Analysis")');
    this.cardWiseChart = page.locator('[data-testid="card-wise-chart"], canvas#card-wise-chart');
  }

  async navigate() {
    logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async isChartVisible(chartType) {
    let chartLocator;
    
    switch(chartType) {
      case 'category-pie':
        chartLocator = this.categoryPieChart;
        break;
      case 'monthly-trends':
        chartLocator = this.monthlyTrendsChart;
        break;
      case 'card-wise':
        chartLocator = this.cardWiseChart;
        break;
      default:
        throw new Error(`Unknown chart type: ${chartType}`);
    }
    
    try {
      await chartLocator.waitFor({ state: 'visible', timeout: 5000 });
      logger.info(`${chartType} chart is visible`);
      return true;
    } catch (error) {
      logger.error(`${chartType} chart not visible`);
      return false;
    }
  }

  async getCategoryList() {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const categories = await this.categoryRows.locator('td:first-child').allTextContents();
    return categories.map(cat => cat.trim());
  }

  async getAllCategoryData() {
    await expect(this.categoryBreakdownTable).toBeVisible();
    const count = await this.categoryRows.count();
    const categoryData = {};
    
    for (let i = 0; i < count; i++) {
      const row = this.categoryRows.nth(i);
      const cells = row.locator('td');
      
      const category = (await cells.nth(0).textContent()).trim();
      const amount = (await cells.nth(1).textContent()).replace(/[₹,\s]/g, '');
      const percentage = (await cells.nth(2).textContent()).replace(/[%\s]/g, '');
      
      categoryData[category] = {
        amount,
        percentage
      };
    }
    
    logger.info(`Retrieved data for ${count} categories`);
    return categoryData;
  }

  async getVisibleChartSegments() {
    // This method would interact with the chart canvas to identify visible segments
    // For now, returning a simplified implementation
    const categoryData = await this.getAllCategoryData();
    const visibleSegments = [];
    
    for (const category in categoryData) {
      const amount = parseFloat(categoryData[category].amount.replace(/,/g, ''));
      if (amount > 0) {
        visibleSegments.push(category);
      }
    }
    
    logger.info(`Visible chart segments: ${visibleSegments.join(', ')}`);
    return visibleSegments;
  }

  async getMonthlyTrendsMonths() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    
    // Extract month labels from chart data attributes or adjacent elements
    const months = await this.page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="monthly-trends-chart"], canvas#monthly-trends-chart');
      if (chartElement && chartElement.dataset.months) {
        return JSON.parse(chartElement.dataset.months);
      }
      return [];
    });
    
    logger.info(`Monthly trends months: ${months.join(', ')}`);
    return months;
  }

  async getMonthSpend(month) {
    await expect(this.monthlyTrendsChart).toBeVisible();
    
    const spend = await this.page.evaluate((targetMonth) => {
      const chartElement = document.querySelector('[data-testid="monthly-trends-chart"], canvas#monthly-trends-chart');
      if (chartElement && chartElement.dataset.spendData) {
        const spendData = JSON.parse(chartElement.dataset.spendData);
        return spendData[targetMonth] || '0';
      }
      return '0';
    }, month);
    
    logger.info(`Spend for ${month}: ₹${spend}`);
    return spend.replace(/[₹,\s]/g, '');
  }

  async verifyChartInteractivity(chartType) {
    let chartLocator;
    
    switch(chartType) {
      case 'category-pie':
        chartLocator = this.categoryPieChart;
        break;
      case 'monthly-trends':
        chartLocator = this.monthlyTrendsChart;
        break;
      case 'card-wise':
        chartLocator = this.cardWiseChart;
        break;
      default:
        throw new Error(`Unknown chart type: ${chartType}`);
    }
    
    await chartLocator.hover();
    await this.page.waitForTimeout(500);
    
    // Check if tooltip or interaction element appears
    const tooltipVisible = await this.page.locator('.chart-tooltip, [role="tooltip"]').isVisible().catch(() => false);
    
    logger.info(`Chart ${chartType} interactivity: ${tooltipVisible}`);
    return tooltipVisible;
  }

  async hasTrendLines() {
    // Check if chart has connecting lines between data points
    const hasTrendLine = await this.page.evaluate(() => {
      const canvas = document.querySelector('[data-testid="monthly-trends-chart"], canvas#monthly-trends-chart');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Simplified check - in real implementation, would analyze pixel data for lines
        return canvas.dataset.hasTrendLines === 'true';
      }
      return false;
    });
    
    logger.info(`Trend lines present: ${hasTrendLine}`);
    return hasTrendLine;
  }

  async clickMonthDataPoint(month) {
    logger.info(`Clicking on month data point: ${month}`);
    
    // Locate and click the specific month data point
    const dataPoint = this.page.locator(`[data-month="${month}"], .chart-data-point:has-text("${month}")`);
    await dataPoint.click();
    
    await this.page.waitForTimeout(500);
  }

  async getCategoryBreakdown() {
    await expect(this.categoryBreakdownModal).toBeVisible();
    
    const breakdownRows = this.categoryBreakdownModal.locator('tbody tr');
    const count = await breakdownRows.count();
    const breakdown = {};
    
    for (let i = 0; i < count; i++) {
      const row = breakdownRows.nth(i);
      const cells = row.locator('td');
      
      const category = (await cells.nth(0).textContent()).trim();
      const amount = (await cells.nth(1).textContent()).replace(/[₹,\s]/g, '');
      
      breakdown[category] = amount;
    }
    
    logger.info(`Category breakdown retrieved for ${count} categories`);
    return breakdown;
  }
};