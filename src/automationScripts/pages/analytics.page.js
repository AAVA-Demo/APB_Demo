const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.monthlyTrendsChart = page.locator('.chart-container:has-text("Monthly Spend Trends"), div:has-text("Monthly Spend Trends") canvas, div:has-text("Monthly Spend Trends") svg').first();
    this.categoryChart = page.locator('.chart-container:has-text("Category-wise Spending"), div:has-text("Category-wise Spending") canvas, div:has-text("Category-wise Spending") svg').first();
    this.cardWiseChart = page.locator('.chart-container:has-text("Card-wise Spending"), div:has-text("Card-wise Spending") canvas, div:has-text("Card-wise Spending") svg').first();
    
    // Chart Elements
    this.chartTooltip = page.locator('.chart-tooltip, [role="tooltip"], .chartjs-tooltip');
    this.chartLegend = page.locator('.chart-legend, .legend');
    
    // State Locators
    this.emptyStateMessage = page.locator('text=/Insufficient data to generate/i, text=/No data available/i');
    this.chartEmptyState = page.locator('.empty-state, .no-data');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.chartErrorState = page.locator('.chart-error, .error-state');
    this.retryButton = page.locator('button:has-text("Retry")');
    
    // Filter Locators
    this.categoryFilters = page.locator('.category-filter, input[type="checkbox"]');
    this.dateRangeStart = page.locator('input[name="dateRangeStart"]');
    this.dateRangeEnd = page.locator('input[name="dateRangeEnd"]');
  }

  async navigate() {
    await this.page.click('a[href*="analytics"], a:has-text("Analytics")');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCategoryPresent(categoryName) {
    // Check in chart labels or legend
    const categoryElement = this.page.locator(`text="${categoryName}"`);
    await expect(categoryElement.first()).toBeVisible();
  }

  async isCategoryPresent(categoryName) {
    const categoryElement = this.page.locator(`text="${categoryName}"`);
    return await categoryElement.count() > 0;
  }

  async verifyCategoryAmount(categoryName, expectedAmount) {
    // Hover over category to see amount in tooltip or check in data labels
    await this.hoverOverChartSegment(categoryName);
    await this.page.waitForTimeout(500); // Wait for tooltip
    
    const tooltipText = await this.chartTooltip.textContent();
    expect(tooltipText).toContain(expectedAmount.toString());
  }

  async hoverOverChartSegment(categoryName) {
    // Locate the chart segment by category name and hover
    const segment = this.categoryChart.locator(`[aria-label*="${categoryName}"], [data-label="${categoryName}"]`);
    if (await segment.count() > 0) {
      await segment.hover();
    } else {
      // Fallback: hover over chart center
      await this.categoryChart.hover();
    }
  }

  async getTotalSpending() {
    // Extract total from chart or summary
    const totalElement = this.page.locator('text=/Total.*\$[0-9,]+/i');
    if (await totalElement.count() > 0) {
      const text = await totalElement.textContent();
      const match = text.match(/\$([0-9,]+)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
    }
    return 0;
  }

  async verifyMonthlyDataPoint(month, expectedSpend) {
    // Hover over the data point for the month
    await this.hoverOverMonthlyTrendPoint(month);
    await this.page.waitForTimeout(500);
    
    const tooltipText = await this.chartTooltip.textContent();
    expect(tooltipText).toContain(expectedSpend.toString());
  }

  async hoverOverMonthlyTrendPoint(month) {
    // Locate the data point by month label
    const dataPoint = this.monthlyTrendsChart.locator(`[aria-label*="${month}"], [data-label="${month}"]`);
    if (await dataPoint.count() > 0) {
      await dataPoint.hover();
    } else {
      // Fallback: hover over chart
      await this.monthlyTrendsChart.hover();
    }
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};
