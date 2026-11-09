const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics container
    this.analyticsContainer = page.locator('.analytics-container, [data-testid="analytics"]');
    
    // Monthly trends section
    this.monthlyTrendsSection = page.locator('.monthly-trends, [data-testid="monthly-trends"]');
    this.monthlyTrendsChart = page.locator('.monthly-trends-chart, [data-testid="monthly-trends-chart"], canvas:visible');
    this.chartTooltip = page.locator('.chart-tooltip, [role="tooltip"]');
    
    // Category-wise spending section
    this.categoryWiseSection = page.locator('.category-wise, [data-testid="category-wise"]');
    this.categoryWiseChart = page.locator('.category-chart, [data-testid="category-chart"], canvas:visible');
    
    // Chart data points
    this.chartDataPoints = page.locator('.chart-data-point, [data-testid="data-point"]');
    this.categorySegments = page.locator('.category-segment, [data-testid="category-segment"]');
    
    // Messages
    this.partialDataMessage = page.locator('[data-testid="partial-data-message"], .partial-data-message, .info-message:has-text("Showing trends")');
    this.noDataMessage = page.locator('[data-testid="no-data-message"], .no-data-message, .alert:has-text("No spending data available")');
    this.emptyChart = page.locator('.chart-empty, canvas:empty');
    
    // Navigation
    this.analyticsNavLink = page.locator('a[href*="analytics"], nav >> text=Analytics');
    this.monthlyTrendsNavLink = page.locator('a[href*="trends"], button:has-text("Monthly Trends")');
  }

  async navigate() {
    logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    logger.info('Clicking Analytics navigation link');
    await this.analyticsNavLink.click();
    await expect(this.analyticsContainer).toBeVisible({ timeout: 5000 });
  }

  async navigateToMonthlyTrends() {
    logger.info('Navigating to Monthly Trends section');
    const trendsLink = this.monthlyTrendsNavLink.first();
    if (await trendsLink.isVisible()) {
      await trendsLink.click();
    }
    await expect(this.monthlyTrendsChart).toBeVisible({ timeout: 5000 });
  }

  async getMonthlyTrendsDataPoints() {
    logger.info('Retrieving monthly trends data points');
    await expect(this.monthlyTrendsChart).toBeVisible({ timeout: 3000 });
    
    // Extract data points from chart using JavaScript evaluation
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      
      // Attempt to access Chart.js instance if available
      const chartInstance = canvas.chart || window.Chart?.instances?.[0];
      if (chartInstance && chartInstance.data) {
        return chartInstance.data.labels || [];
      }
      
      // Fallback: check for data attributes or visible labels
      const labels = Array.from(document.querySelectorAll('[data-month], .chart-label'));
      return labels.map(label => label.textContent.trim());
    });
    
    logger.info(`Found ${dataPoints.length} data points`);
    return dataPoints;
  }

  async hoverOverDataPoint(month) {
    logger.info(`Hovering over data point: ${month}`);
    
    // Try to find and hover over the specific month label or data point
    const dataPoint = this.page.locator(`[data-month="${month}"], .chart-label:has-text("${month}")`);
    
    if (await dataPoint.isVisible()) {
      await dataPoint.hover();
    } else {
      // Fallback: hover over chart area and move to approximate position
      const chartBox = await this.monthlyTrendsChart.boundingBox();
      if (chartBox) {
        await this.page.mouse.move(chartBox.x + chartBox.width / 2, chartBox.y + chartBox.height / 2);
      }
    }
    
    await this.page.waitForTimeout(500); // Wait for tooltip animation
  }

  async getTooltipText() {
    logger.info('Retrieving tooltip text');
    await expect(this.chartTooltip).toBeVisible({ timeout: 2000 });
    const text = await this.chartTooltip.textContent();
    return text.trim();
  }

  async verifyChronologicalOrder(dataPoints) {
    logger.info('Verifying chronological order of data points');
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const currentMonth = dataPoints[i].split(' ')[0];
      const nextMonth = dataPoints[i + 1].split(' ')[0];
      
      const currentIndex = months.indexOf(currentMonth);
      const nextIndex = months.indexOf(nextMonth);
      
      // Allow for year wrap-around
      if (currentIndex >= nextIndex && !(currentIndex === 11 && nextIndex === 0)) {
        logger.warn(`Data points not in chronological order: ${dataPoints[i]} -> ${dataPoints[i + 1]}`);
        return false;
      }
    }
    
    return true;
  }

  async getPartialDataMessage() {
    logger.info('Retrieving partial data message');
    await expect(this.partialDataMessage).toBeVisible({ timeout: 3000 });
    const message = await this.partialDataMessage.textContent();
    return message.trim();
  }

  async getCategoryData() {
    logger.info('Retrieving category-wise spending data');
    await expect(this.categoryWiseChart).toBeVisible({ timeout: 3000 });
    
    // Extract category data from chart
    const categories = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      
      const chartInstance = canvas.chart || window.Chart?.instances?.[0];
      if (chartInstance && chartInstance.data) {
        const labels = chartInstance.data.labels || [];
        const data = chartInstance.data.datasets?.[0]?.data || [];
        
        return labels.map((label, index) => ({
          name: label,
          amount: data[index] ? `$${data[index].toFixed(2)}` : '$0.00'
        }));
      }
      
      // Fallback: check for visible category labels
      const categoryElements = Array.from(document.querySelectorAll('[data-category], .category-item'));
      return categoryElements.map(el => ({
        name: el.getAttribute('data-category') || el.textContent.trim(),
        amount: el.getAttribute('data-amount') || '$0.00'
      }));
    });
    
    logger.info(`Retrieved ${categories.length} categories`);
    return categories;
  }

  async hoverOverCategory(categoryName) {
    logger.info(`Hovering over category: ${categoryName}`);
    
    const categorySegment = this.page.locator(`[data-category="${categoryName}"], .category-segment:has-text("${categoryName}")`);
    
    if (await categorySegment.isVisible()) {
      await categorySegment.hover();
    } else {
      // Fallback: hover over chart area
      const chartBox = await this.categoryWiseChart.boundingBox();
      if (chartBox) {
        await this.page.mouse.move(chartBox.x + chartBox.width / 2, chartBox.y + chartBox.height / 2);
      }
    }
    
    await this.page.waitForTimeout(500);
  }

  async checkForEmptyCategories() {
    logger.info('Checking for empty categories in display');
    
    const emptyCategories = await this.page.locator('.category-item:has-text("$0.00"), [data-amount="0"]').count();
    return emptyCategories > 0;
  }

  async getNoDataMessage() {
    logger.info('Retrieving no data message');
    await expect(this.noDataMessage).toBeVisible({ timeout: 3000 });
    const message = await this.noDataMessage.textContent();
    return message.trim();
  }
};