const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.analyticsMenuLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")');
    
    // Monthly Trend Locators
    this.monthlyTrendChart = page.locator('canvas[id*="monthly"], .monthly-trend-chart, [data-testid="monthly-trend-chart"]');
    this.insufficientDataMessage = page.locator('.alert-warning:has-text("Insufficient data"), .validation-message');
    this.chartTooltip = page.locator('.chart-tooltip, [role="tooltip"], .chartjs-tooltip');
    
    // Category Spending Locators
    this.categoryPieChart = page.locator('canvas[id*="category"], .category-pie-chart, [data-testid="category-chart"]');
    this.categorySpendingSection = page.locator('.category-spending-section, [data-testid="category-spending"]');
    this.noSpendingDataMessage = page.locator('.alert-info:has-text("No spending data available")');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to Analytics section');
    await this.analyticsMenuLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async accessMonthlyTrendAnalysis() {
    logger.info('Accessing Monthly Trend Analysis view');
    const trendSection = this.page.locator('.monthly-trend-section, [data-testid="monthly-trend"]');
    await trendSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  async getMonthlyTrendDataPoints() {
    logger.info('Getting monthly trend data points');
    await expect(this.monthlyTrendChart).toBeVisible();
    
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[id*="monthly"]');
      if (!canvas) return [];
      
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;
      
      return labels.map((label, index) => ({
        month: label,
        amount: data[index]
      }));
    });
    
    return dataPoints;
  }

  async hoverOverDataPoint(pointIndex) {
    logger.info(`Hovering over data point at index: ${pointIndex}`);
    await expect(this.monthlyTrendChart).toBeVisible();
    
    const box = await this.monthlyTrendChart.boundingBox();
    const pointX = box.x + (box.width / 12) * (pointIndex + 0.5);
    const pointY = box.y + box.height / 2;
    
    await this.page.mouse.move(pointX, pointY);
    await this.page.waitForTimeout(500);
  }

  async getTooltipContent() {
    logger.info('Getting tooltip content');
    await expect(this.chartTooltip).toBeVisible();
    const text = await this.chartTooltip.textContent();
    
    const monthMatch = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/);
    const amountMatch = text.match(/\$[\d,]+\.\d{2}/);
    
    return {
      month: monthMatch ? monthMatch[0] : null,
      totalSpend: amountMatch ? amountMatch[0] : null
    };
  }

  async getCategorySpendingData() {
    logger.info('Getting category spending data');
    await expect(this.categoryPieChart).toBeVisible();
    
    const categoryData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas[id*="category"]');
      if (!canvas) return {};
      
      const chart = Chart.getChart(canvas);
      if (!chart) return {};
      
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;
      
      const result = {};
      labels.forEach((label, index) => {
        result[label] = data[index];
      });
      
      return result;
    });
    
    return categoryData;
  }

  async hoverOverCategorySegment(categoryName) {
    logger.info(`Hovering over category segment: ${categoryName}`);
    await expect(this.categoryPieChart).toBeVisible();
    
    const box = await this.categoryPieChart.boundingBox();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    
    await this.page.mouse.move(centerX + 50, centerY);
    await this.page.waitForTimeout(500);
  }

  async getChartLegendCategories() {
    logger.info('Getting chart legend categories');
    const legendItems = this.page.locator('.chart-legend li, .legend-item, [data-testid="legend-item"]');
    const count = await legendItems.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const text = await legendItems.nth(i).textContent();
      const categoryMatch = text.match(/([A-Za-z\s&]+)/);
      if (categoryMatch) categories.push(categoryMatch[1].trim());
    }
    
    return categories;
  }

  async getCategoryValuesFromLegend() {
    logger.info('Getting category values from legend');
    const legendItems = this.page.locator('.chart-legend li, .legend-item, [data-testid="legend-item"]');
    const count = await legendItems.count();
    const values = [];
    
    for (let i = 0; i < count; i++) {
      const text = await legendItems.nth(i).textContent();
      const valueMatch = text.match(/\$\d+\.\d{2}/);
      if (valueMatch) values.push(valueMatch[0]);
    }
    
    return values;
  }
};
