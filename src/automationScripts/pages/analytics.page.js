const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Category Chart Locators
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.categoryChartCanvas = page.locator('canvas[data-chart="category-spending"]');
    this.categoryTooltip = page.locator('[data-testid="category-tooltip"]');
    this.categoryDetailPanel = page.locator('[data-testid="category-detail-panel"]');
    
    // Monthly Trends Locators
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.monthlyTrendsCanvas = page.locator('canvas[data-chart="monthly-trends"]');
    this.monthlyTrendsTooltip = page.locator('[data-testid="monthly-trends-tooltip"]');
    
    // Data Point Locators
    this.chartDataPoints = page.locator('[data-testid="chart-data-point"]');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    
    // Category Data Locators
    this.categoryDataItems = page.locator('[data-testid="category-data-item"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToMonthlyTrends() {
    await this.page.goto('/analytics/trends');
    await this.page.waitForLoadState('networkidle');
  }

  async isCategoryChartRendered() {
    await this.page.waitForTimeout(2000); // Wait for chart rendering
    const canvas = await this.categoryChartCanvas.elementHandle();
    if (!canvas) return false;
    
    const hasContent = await this.page.evaluate(el => {
      const ctx = el.getContext('2d');
      const imageData = ctx.getImageData(0, 0, el.width, el.height);
      return imageData.data.some(channel => channel !== 0);
    }, canvas);
    
    return hasContent;
  }

  async getAllCategoryData() {
    const categories = [];
    const count = await this.categoryDataItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = this.categoryDataItems.nth(i);
      const name = await item.locator('[data-testid="category-name"]').textContent();
      const amount = await item.locator('[data-testid="category-amount"]').textContent();
      const percentage = await item.locator('[data-testid="category-percentage"]').textContent();
      
      categories.push({
        name: name.trim(),
        amount: amount.trim(),
        percentage: percentage.trim()
      });
    }
    return categories;
  }

  async getCategoryData(categoryName) {
    const categoryLocator = this.page.locator(`[data-testid="category-data-item"]:has-text("${categoryName}")`);
    const count = await categoryLocator.count();
    
    if (count === 0) return null;
    
    const amount = await categoryLocator.locator('[data-testid="category-amount"]').textContent();
    const percentage = await categoryLocator.locator('[data-testid="category-percentage"]').textContent();
    
    return {
      name: categoryName,
      amount: amount.trim(),
      percentage: percentage.trim()
    };
  }

  async calculateTotalPercentage() {
    const categories = await this.getAllCategoryData();
    let total = 0;
    
    categories.forEach(category => {
      const percentValue = parseFloat(category.percentage.replace('%', ''));
      total += percentValue;
    });
    
    return Math.round(total * 100) / 100; // Round to 2 decimal places
  }

  async hoverOverCategory(categoryName) {
    const categorySegment = this.page.locator(`[data-category="${categoryName}"]`);
    await categorySegment.hover();
    await this.page.waitForTimeout(500); // Wait for tooltip to appear
  }

  async clickCategory(categoryName) {
    const categorySegment = this.page.locator(`[data-category="${categoryName}"]`);
    await categorySegment.click();
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    await expect(this.categoryTooltip).toBeVisible();
    return await this.categoryTooltip.textContent();
  }

  async getCategoryDetailData() {
    await expect(this.categoryDetailPanel).toBeVisible();
    
    return {
      category: await this.categoryDetailPanel.locator('[data-testid="detail-category-name"]').textContent(),
      amount: await this.categoryDetailPanel.locator('[data-testid="detail-amount"]').textContent(),
      percentage: await this.categoryDetailPanel.locator('[data-testid="detail-percentage"]').textContent()
    };
  }

  async isMonthlyTrendsChartRendered() {
    await this.page.waitForTimeout(2000);
    const canvas = await this.monthlyTrendsCanvas.elementHandle();
    if (!canvas) return false;
    
    const hasContent = await this.page.evaluate(el => {
      const ctx = el.getContext('2d');
      const imageData = ctx.getImageData(0, 0, el.width, el.height);
      return imageData.data.some(channel => channel !== 0);
    }, canvas);
    
    return hasContent;
  }

  async getMonthlyTrendsDataPoints() {
    const dataPoints = [];
    const points = this.page.locator('[data-testid="trend-data-point"]');
    const count = await points.count();
    
    for (let i = 0; i < count; i++) {
      const month = await points.nth(i).getAttribute('data-month');
      const amount = await points.nth(i).getAttribute('data-amount');
      dataPoints.push({ month, amount });
    }
    return dataPoints;
  }

  async hasUpwardTrend() {
    const dataPoints = await this.getMonthlyTrendsDataPoints();
    if (dataPoints.length < 2) return false;
    
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const current = parseFloat(dataPoints[i].amount.replace(/[$,]/g, ''));
      const next = parseFloat(dataPoints[i + 1].amount.replace(/[$,]/g, ''));
      if (next > current) return true;
    }
    return false;
  }

  async hasDownwardTrend() {
    const dataPoints = await this.getMonthlyTrendsDataPoints();
    if (dataPoints.length < 2) return false;
    
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const current = parseFloat(dataPoints[i].amount.replace(/[$,]/g, ''));
      const next = parseFloat(dataPoints[i + 1].amount.replace(/[$,]/g, ''));
      if (next < current) return true;
    }
    return false;
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async hoverOverMonthDataPoint(month) {
    const dataPoint = this.page.locator(`[data-testid="trend-data-point"][data-month*="${month}"]`);
    await dataPoint.hover();
    await this.page.waitForTimeout(500);
  }

  async getMonthlyTrendsTooltipText() {
    await expect(this.monthlyTrendsTooltip).toBeVisible();
    return await this.monthlyTrendsTooltip.textContent();
  }
};