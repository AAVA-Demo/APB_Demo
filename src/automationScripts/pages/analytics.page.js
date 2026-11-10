const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Tab Navigation
    this.monthlyTrendsTab = page.locator('a[href*="trends"], li:has-text("Monthly Trends"), [data-toggle="tab"][href="#trends"]');
    this.categoryBreakdownTab = page.locator('a[href*="categories"], li:has-text("Category Breakdown"), [data-toggle="tab"][href="#categories"]');
    this.cardWiseTab = page.locator('a[href*="cards"], li:has-text("Card-wise"), [data-toggle="tab"][href="#cards"]');
    
    // Chart Locators
    this.monthlyTrendsChart = page.locator('#monthlyTrendChart, canvas[id*="trend"], .chart-container:has-text("Monthly Spend Trends") canvas');
    this.categoryBreakdownChart = page.locator('#categoryBreakdownChart, canvas[id*="category"], .chart-container:has-text("Category-wise") canvas');
    this.cardWiseChart = page.locator('#cardWiseChart, canvas[id*="card"], .chart-container:has-text("Card-wise") canvas');
    
    // Chart Elements
    this.chartLegend = page.locator('.chart-legend, [data-testid="chart-legend"]');
    this.chartTooltip = page.locator('.chart-tooltip, [role="tooltip"]');
    this.chartDataPoints = page.locator('.chart-data-point, [data-testid="data-point"]');
    
    // Messages
    this.errorMessage = page.locator('.alert-danger, .error-message, [role="alert"][class*="error"]');
    this.insufficientDataMessage = page.locator('.alert-info, .info-message, [data-testid="insufficient-data"]');
    this.loadingSpinner = page.locator('.loading-spinner, [data-testid="loading"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard.demo.com/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async clickMonthlyTrendsTab() {
    await expect(this.monthlyTrendsTab).toBeVisible();
    await this.monthlyTrendsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCategoryBreakdownTab() {
    await expect(this.categoryBreakdownTab).toBeVisible();
    await this.categoryBreakdownTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCardWiseTab() {
    await expect(this.cardWiseTab).toBeVisible();
    await this.cardWiseTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForMonthlyTrendsChartLoad() {
    await expect(this.monthlyTrendsChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCategoryBreakdownChartLoad() {
    await expect(this.categoryBreakdownChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async getMonthlyTrendsDataPointsCount() {
    // This would typically interact with Chart.js or similar library
    // For now, we'll evaluate the chart data from the page context
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthlyTrendChart, canvas[id*="trend"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels.length;
      }
      return 0;
    });
  }

  async getMonthlyTrendsLabels() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthlyTrendChart, canvas[id*="trend"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
  }

  async getCategoryLabels() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryBreakdownChart, canvas[id*="category"]');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
  }

  async getCategoryBreakdownData() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryBreakdownChart, canvas[id*="category"]');
      if (canvas && canvas.chart) {
        const labels = canvas.chart.data.labels;
        const data = canvas.chart.data.datasets[0].data;
        return labels.map((label, index) => ({
          category: label,
          amount: data[index],
          percentage: (data[index] / data.reduce((a, b) => a + b, 0)) * 100
        }));
      }
      return [];
    });
  }

  async verifyChartInteractivity() {
    // Hover over chart to test interactivity
    await this.monthlyTrendsChart.hover();
    await this.page.waitForTimeout(500);
    
    // Check if tooltip appears
    const tooltipVisible = await this.chartTooltip.isVisible().catch(() => false);
    return tooltipVisible;
  }

  async verifyCategoryChartInteractivity() {
    await this.categoryBreakdownChart.hover();
    await this.page.waitForTimeout(500);
    
    const tooltipVisible = await this.chartTooltip.isVisible().catch(() => false);
    return tooltipVisible;
  }

  async getChartXAxisLabel() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthlyTrendChart, canvas[id*="trend"]');
      if (canvas && canvas.chart && canvas.chart.options.scales && canvas.chart.options.scales.xAxes) {
        return canvas.chart.options.scales.xAxes[0].scaleLabel.labelString || 'Month';
      }
      return 'Month';
    });
  }

  async getChartYAxisLabel() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthlyTrendChart, canvas[id*="trend"]');
      if (canvas && canvas.chart && canvas.chart.options.scales && canvas.chart.options.scales.yAxes) {
        return canvas.chart.options.scales.yAxes[0].scaleLabel.labelString || 'Total Spend ($)';
      }
      return 'Total Spend ($)';
    });
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }
};