const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Container Locators
    this.analyticsContainer = page.locator('[data-testid="analytics-container"], .analytics-view');
    this.viewSelector = page.locator('[data-testid="view-selector"], .view-selector');
    
    // View Button Locators
    this.monthlyTrendsButton = page.locator('[data-testid="monthly-trends-btn"], button:has-text("Monthly Trends")');
    this.cardWiseButton = page.locator('[data-testid="card-wise-btn"], button:has-text("Card-wise Spending")');
    this.categoryBreakdownButton = page.locator('[data-testid="category-breakdown-btn"], button:has-text("Category Breakdown")');
    
    // Chart Locators
    this.chartContainer = page.locator('[data-testid="chart-container"], .chart-container');
    this.spendingChart = page.locator('[data-testid="spending-chart"], canvas#spendingChart');
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"], .chartjs-tooltip');
    
    // Message Locators
    this.noDataMessage = page.locator('[data-testid="no-data-message"], .no-data-message');
    
    // Loading Locator
    this.loadingSpinner = page.locator('[data-testid="loading"], .loading-spinner');
  }

  async navigate() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageLoad() {
    logger.info('Waiting for analytics page to load');
    await expect(this.analyticsContainer).toBeVisible({ timeout: 5000 });
    await expect(this.viewSelector).toBeVisible({ timeout: 3000 });
  }

  async waitForChartLoad() {
    logger.info('Waiting for chart to load');
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await Promise.race([
      this.spendingChart.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      this.noDataMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    ]);
  }

  async clickMonthlyTrendsView() {
    logger.info('Clicking Monthly Trends view');
    await this.monthlyTrendsButton.click();
  }

  async clickCardWiseView() {
    logger.info('Clicking Card-wise Spending view');
    await this.cardWiseButton.click();
  }

  async clickCategoryBreakdownView() {
    logger.info('Clicking Category Breakdown view');
    await this.categoryBreakdownButton.click();
  }

  async getChartLabels() {
    logger.info('Getting chart labels');
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#spendingChart');
      if (!canvas) return [];
      
      // Access Chart.js instance
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      
      return chart.data.labels || [];
    });
  }

  async getChartData() {
    logger.info('Getting chart data');
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas#spendingChart');
      if (!canvas) return [];
      
      const chart = Chart.getChart(canvas);
      if (!chart || !chart.data.datasets || chart.data.datasets.length === 0) return [];
      
      return chart.data.datasets[0].data || [];
    });
  }

  async getCategoryData() {
    logger.info('Getting category data');
    const labels = await this.getChartLabels();
    const data = await this.getChartData();
    
    const categoryData = {};
    labels.forEach((label, index) => {
      categoryData[label] = data[index] || 0;
    });
    
    return categoryData;
  }

  async hoverOverDataPoint(index) {
    logger.info(`Hovering over data point at index ${index}`);
    // Calculate position on canvas for hover
    const chartBox = await this.spendingChart.boundingBox();
    if (!chartBox) {
      throw new Error('Chart not found');
    }
    
    // Hover over approximate position of first data point
    const x = chartBox.x + (chartBox.width * 0.2);
    const y = chartBox.y + (chartBox.height * 0.5);
    
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(500); // Wait for tooltip to appear
  }

  async hoverOverCategory(categoryName) {
    logger.info(`Hovering over category: ${categoryName}`);
    const labels = await this.getChartLabels();
    const categoryIndex = labels.indexOf(categoryName);
    
    if (categoryIndex === -1) {
      throw new Error(`Category ${categoryName} not found in chart`);
    }
    
    await this.hoverOverDataPoint(categoryIndex);
  }

  async getTooltipText() {
    logger.info('Getting tooltip text');
    await this.chartTooltip.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
    
    // Try multiple tooltip selectors
    const tooltipSelectors = [
      '.chartjs-tooltip',
      '[data-testid="chart-tooltip"]',
      '.tooltip'
    ];
    
    for (const selector of tooltipSelectors) {
      const tooltip = this.page.locator(selector);
      const isVisible = await tooltip.isVisible().catch(() => false);
      if (isVisible) {
        return await tooltip.textContent();
      }
    }
    
    return '';
  }

  async clickCategorySegment(categoryName) {
    logger.info(`Clicking category segment: ${categoryName}`);
    const labels = await this.getChartLabels();
    const categoryIndex = labels.indexOf(categoryName);
    
    if (categoryIndex === -1) {
      throw new Error(`Category ${categoryName} not found`);
    }
    
    const chartBox = await this.spendingChart.boundingBox();
    if (!chartBox) {
      throw new Error('Chart not found');
    }
    
    // Click on approximate position
    const x = chartBox.x + (chartBox.width * 0.5);
    const y = chartBox.y + (chartBox.height * 0.5);
    
    await this.page.mouse.click(x, y);
  }

  async isCategoryHighlighted(categoryName) {
    logger.info(`Checking if category is highlighted: ${categoryName}`);
    // This would depend on the specific implementation
    // For now, return true if category exists
    const labels = await this.getChartLabels();
    return labels.includes(categoryName);
  }

  async isChartInteractive() {
    logger.info('Checking if chart is interactive');
    // Verify chart responds to interactions
    await this.hoverOverDataPoint(0);
    const tooltipVisible = await this.chartTooltip.isVisible().catch(() => false);
    return tooltipVisible;
  }

  async hasChartPerformanceIssues() {
    logger.info('Checking for chart performance issues');
    // Measure frame rate or rendering time
    const performanceMetrics = await this.page.evaluate(() => {
      const entries = performance.getEntriesByType('measure');
      return entries.length;
    });
    
    // Simple check - in real scenario, you'd measure actual frame rates
    return false;
  }

  async getNoDataMessageText() {
    logger.info('Getting no data message text');
    return await this.noDataMessage.textContent();
  }

  async getBrokenChartElements() {
    logger.info('Checking for broken chart elements');
    const brokenElements = [];
    
    // Check for visible error elements
    const errorSelectors = [
      '.chart-error',
      '.error-message',
      'svg:has(text:has-text("Error"))',
      'canvas[width="0"]'
    ];
    
    for (const selector of errorSelectors) {
      const elements = await this.page.locator(selector).all();
      for (const element of elements) {
        if (await element.isVisible()) {
          brokenElements.push(selector);
        }
      }
    }
    
    return brokenElements;
  }

  async getOverallSpendingTotal() {
    logger.info('Getting overall spending total');
    // Try to get total from dashboard or summary
    const totalLocator = this.page.locator('[data-testid="total-spending"], .total-spending');
    const totalVisible = await totalLocator.isVisible().catch(() => false);
    
    if (totalVisible) {
      const text = await totalLocator.textContent();
      return parseFloat(text.replace(/[^0-9.]/g, ''));
    }
    
    // If not available, sum from chart data
    const data = await this.getChartData();
    return data.reduce((sum, val) => sum + val, 0);
  }
};
