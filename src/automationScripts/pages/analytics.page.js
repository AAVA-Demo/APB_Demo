const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.analyticsLink = page.locator('a[ui-sref="analytics"], a:has-text("Analytics")');
    this.categorySpendingSection = page.locator('[data-testid="category-spending"], .chart-container:has-text("Category-Wise Spending")');
    this.categoryPieChart = page.locator('canvas[id*="chart"]').first();
    this.categoryTable = page.locator('table.table-striped');
    this.monthlyTrendsSection = page.locator('[data-testid="monthly-trends"], .chart-container:has-text("Monthly Spend Trends")');
    this.monthlyTrendsChart = page.locator('canvas[id*="chart"]').nth(1);
    this.startDateInput = page.locator('input[type="date"][ng-model*="startDate"]');
    this.endDateInput = page.locator('input[type="date"][ng-model*="endDate"]');
    this.applyFilterButton = page.locator('button:has-text("Apply Filter")');
    this.chartTooltip = page.locator('.chartjs-tooltip, [role="tooltip"]');
    this.chartXAxis = page.locator('.chartjs-axis-x');
    this.chartYAxis = page.locator('.chartjs-axis-y');
    this.chartLegend = page.locator('.chartjs-legend');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  getCategoryRow(categoryName) {
    return this.categoryTable.locator(`tr:has-text("${categoryName}")`);
  }

  async getCategoryAmount(categoryName) {
    const row = this.getCategoryRow(categoryName);
    await expect(row).toBeVisible();
    const amountCell = row.locator('td').nth(1);
    return await amountCell.textContent();
  }

  async getCategoryPercentage(categoryName) {
    const row = this.getCategoryRow(categoryName);
    await expect(row).toBeVisible();
    const percentageCell = row.locator('td').nth(2);
    return await percentageCell.textContent();
  }

  async getAllCategoryPercentages() {
    const rows = await this.categoryTable.locator('tbody tr').all();
    const percentages = [];
    for (const row of rows) {
      const percentageCell = row.locator('td').nth(2);
      const text = await percentageCell.textContent();
      const match = text.match(/([0-9]+\.[0-9]+)/);
      if (match) {
        percentages.push(parseFloat(match[1]));
      }
    }
    return percentages;
  }

  async getTotalSpend() {
    const totalElement = this.categorySpendingSection.locator('p:has-text("Total spend")');
    await expect(totalElement).toBeVisible();
    return await totalElement.textContent();
  }

  async setDateRange(startDate, endDate) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    await expect(this.endDateInput).toBeVisible();
    await this.endDateInput.fill(endDate);
  }

  async applyDateFilter() {
    await expect(this.applyFilterButton).toBeVisible();
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getChartDataPointCount() {
    await this.page.waitForTimeout(1000);
    const chartData = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (charts && charts.length > 0) {
        return charts[0].data.labels.length;
      }
      return 0;
    });
    return chartData;
  }

  async getChartXAxisLabels() {
    await this.page.waitForTimeout(1000);
    const labels = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (charts && charts.length > 0) {
        return charts[0].data.labels;
      }
      return [];
    });
    return labels;
  }

  async hoverOverDataPoint(index) {
    const chartCanvas = this.monthlyTrendsChart;
    await expect(chartCanvas).toBeVisible();
    const box = await chartCanvas.boundingBox();
    if (box) {
      const x = box.x + (box.width / 12) * (index + 0.5);
      const y = box.y + box.height / 2;
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(500);
    }
  }
};