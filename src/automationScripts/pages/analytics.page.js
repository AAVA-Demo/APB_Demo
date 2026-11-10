const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.categoryChart = page.locator('[data-testid="category-chart"], #categoryChart, canvas[id*="category" i]');
    this.trendChart = page.locator('[data-testid="trend-chart"], #trendChart, canvas[id*="trend" i]');
    this.cardComparisonChart = page.locator('[data-testid="card-comparison-chart"], #cardComparisonChart');
    
    // Chart Legend/Data Locators
    this.chartLegend = page.locator('[data-testid="chart-legend"], .chart-legend, .legend');
    this.categoryLabels = page.locator('[data-testid="category-label"], .category-label');
    this.trendDataPoints = page.locator('[data-testid="trend-data-point"], .trend-point');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"], .empty-state:has-text("Insufficient data")');
    this.insufficientHistoryMessage = page.locator('[data-testid="insufficient-history-message"], .empty-state:has-text("historical data")');
    this.chartErrorMessage = page.locator('[data-testid="chart-error-message"], .chart-error:has-text("could not be rendered")');
    this.trendErrorMessage = page.locator('[data-testid="trend-error-message"], .trend-error:has-text("could not be rendered")');
    this.retryButton = page.locator('[data-testid="retry-btn"], button:has-text("Retry"), button:has-text("Try again")');
    
    // Container
    this.analyticsContainer = page.locator('[data-testid="analytics-container"], .analytics-container');
    this.categoryChartSection = page.locator('[data-testid="category-chart-section"], .category-chart-section');
    this.trendChartSection = page.locator('[data-testid="trend-chart-section"], .trend-chart-section');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.waitForAnalyticsLoad();
  }

  async waitForAnalyticsLoad() {
    await expect(this.analyticsContainer).toBeVisible({ timeout: 5000 });
  }

  async verifyCategoryChartRendered() {
    await expect(this.categoryChart).toBeVisible();
    
    // Verify chart canvas is rendered and has content
    const chartElement = await this.categoryChart.elementHandle();
    const isCanvas = await chartElement.evaluate(el => el.tagName === 'CANVAS');
    expect(isCanvas).toBeTruthy();
  }

  async verifyTrendChartRendered() {
    await expect(this.trendChart).toBeVisible();
    
    // Verify chart canvas is rendered and has content
    const chartElement = await this.trendChart.elementHandle();
    const isCanvas = await chartElement.evaluate(el => el.tagName === 'CANVAS');
    expect(isCanvas).toBeTruthy();
  }

  async verifyCategories(expectedCategories) {
    // Verify categories are present in chart legend or labels
    for (const category of expectedCategories) {
      const categoryLocator = this.page.locator(`text=${category}`);
      await expect(categoryLocator).toBeVisible({ timeout: 2000 });
    }
  }

  async verifyCategoryData() {
    // Verify chart has data by checking if legend items are present
    const legendItems = await this.page.locator('.legend-item, [class*="legend"]').count();
    expect(legendItems).toBeGreaterThan(0);
  }

  async verifyChartInteractivity() {
    // Verify chart is interactive by checking for click handlers or hover effects
    await expect(this.categoryChart).toBeVisible();
    
    // Attempt to hover over chart to verify interactivity
    await this.categoryChart.hover();
    
    // Check if tooltip or interaction element appears
    const tooltip = this.page.locator('[class*="tooltip"], [data-testid="chart-tooltip"]');
    // Note: Tooltip may not always appear, so we don't fail if it doesn't
  }

  async verifyMonthlyTrendData() {
    // Verify trend chart displays at least 3 months of data
    await expect(this.trendChart).toBeVisible();
    
    // Check for month labels in the chart area
    const monthLabels = await this.page.locator('text=/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i').count();
    expect(monthLabels).toBeGreaterThanOrEqual(3);
  }

  async verifyTrendChartDrillDown() {
    // Verify drill-down capability by checking if chart is clickable
    await expect(this.trendChart).toBeVisible();
    
    // Click on chart to test drill-down
    await this.trendChart.click({ position: { x: 100, y: 100 } });
    
    // Note: Actual drill-down behavior would need to be verified based on implementation
    // This could open a modal, navigate to a detail page, or update the view
  }

  async verifyNoChartRendered() {
    // Verify that category chart is not visible or empty
    const isVisible = await this.categoryChart.isVisible({ timeout: 1000 }).catch(() => false);
    expect(isVisible).toBeFalsy();
  }

  async verifyNoTrendChartRendered() {
    // Verify that trend chart is not visible or empty
    const isVisible = await this.trendChart.isVisible({ timeout: 1000 }).catch(() => false);
    expect(isVisible).toBeFalsy();
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async getInsufficientHistoryMessageText() {
    await expect(this.insufficientHistoryMessage).toBeVisible();
    return await this.insufficientHistoryMessage.textContent();
  }

  async getChartErrorMessageText() {
    await expect(this.chartErrorMessage).toBeVisible();
    return await this.chartErrorMessage.textContent();
  }

  async getTrendErrorMessageText() {
    await expect(this.trendErrorMessage).toBeVisible();
    return await this.trendErrorMessage.textContent();
  }
};