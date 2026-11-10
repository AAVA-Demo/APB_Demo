const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.analyticsNavLink = page.locator('a[href*="/analytics"], nav a:has-text("Analytics")');
    
    // Chart Locators
    this.monthlyTrendsChart = page.locator('.monthly-trends-chart, canvas#monthlyTrendsChart, [data-testid="monthly-trends-chart"]');
    this.categoryChart = page.locator('.category-chart, canvas#categoryChart, [data-testid="category-chart"]');
    this.chartTooltip = page.locator('.chart-tooltip, [role="tooltip"]');
    
    // Category Locators
    this.categoryLabels = page.locator('.category-label, .chart-legend-item');
    this.categorySegments = page.locator('.category-segment, .chart-segment');
    
    // Data Display Locators
    this.totalSpendDisplay = page.locator('.total-spend, [data-testid="total-spend"]');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('.insufficient-data-message, .info-message:has-text("Insufficient data")').first();
    this.drillDownView = page.locator('.drill-down-view, .detail-view');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsNavLink).toBeVisible();
    await this.analyticsNavLink.click();
    await this.page.waitForURL(/\/analytics/, { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    // Wait for charts to render
    await this.page.waitForTimeout(2000);
  }

  async getAllCategories() {
    const count = await this.categoryLabels.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const label = await this.categoryLabels.nth(i).textContent();
      categories.push(label.trim());
    }
    
    return categories;
  }

  async getCategorySpendData() {
    const categories = await this.getAllCategories();
    const data = {};
    
    for (const category of categories) {
      const amountLocator = this.page.locator(`.category-amount:has-text("${category}"), [data-category="${category}"] .amount`);
      if (await amountLocator.count() > 0) {
        const amount = await amountLocator.first().textContent();
        data[category] = amount.trim();
      } else {
        data[category] = '$0.00';
      }
    }
    
    return data;
  }

  async getCategoryPercentages() {
    const categories = await this.getAllCategories();
    const percentages = {};
    
    for (const category of categories) {
      const percentLocator = this.page.locator(`.category-percentage:has-text("${category}"), [data-category="${category}"] .percentage`);
      if (await percentLocator.count() > 0) {
        const percent = await percentLocator.first().textContent();
        percentages[category] = percent.trim();
      } else {
        percentages[category] = '0.0%';
      }
    }
    
    return percentages;
  }

  async getTotalSpend() {
    await expect(this.totalSpendDisplay).toBeVisible();
    return await this.totalSpendDisplay.textContent();
  }

  async hoverOverCategorySegment(categoryName) {
    const segment = this.page.locator(`[data-category="${categoryName}"], .chart-segment:has-text("${categoryName}")`);
    await expect(segment).toBeVisible();
    await segment.hover();
    await this.page.waitForTimeout(500);
  }

  async getMonthlyTrendsDataPoints() {
    // Extract data points from chart (implementation depends on chart library)
    const dataPoints = [];
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#monthlyTrendsChart');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data;
      }
      return [];
    });
    
    // Format data points
    for (let i = 0; i < chartData.length; i++) {
      dataPoints.push({
        month: `Month ${i + 1}`,
        spend: `$${chartData[i].toFixed(2)}`
      });
    }
    
    return dataPoints;
  }

  async hoverOverDataPoint(index) {
    const dataPoint = this.page.locator(`.chart-data-point, .data-point`).nth(index);
    await expect(dataPoint).toBeVisible();
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
  }

  async clickDataPoint(index) {
    const dataPoint = this.page.locator(`.chart-data-point, .data-point`).nth(index);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    await this.page.waitForLoadState('networkidle');
  }

  async tapDataPoint(index) {
    const dataPoint = this.page.locator(`.chart-data-point, .data-point`).nth(index);
    await expect(dataPoint).toBeVisible();
    await dataPoint.tap();
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }
};