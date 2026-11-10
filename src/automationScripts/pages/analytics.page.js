const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('.analytics-container');
    this.categoryChart = page.locator('canvas[chart-id="categoryChart"]');
    this.trendChart = page.locator('canvas[chart-id="trendChart"]');
    this.categoryTable = page.locator('.panel-default').first().locator('table');
    this.trendTable = page.locator('.panel-default').nth(1).locator('table');
    this.categoryTooltip = page.locator('.chart-tooltip');
    this.trendTooltip = page.locator('.chart-tooltip');
    this.errorMessage = page.locator('.alert-danger');
    this.insufficientDataMessage = page.locator('.alert-info');
    this.dashboardLink = page.locator('a[href="#!/dashboard"]');
  }

  async navigate() {
    await this.page.goto('#!/analytics');
    await expect(this.analyticsContainer).toBeVisible();
  }

  async getAllCategories() {
    await expect(this.categoryTable).toBeVisible();
    const categoryRows = this.categoryTable.locator('tbody tr');
    const count = await categoryRows.count();
    const categories = [];
    for (let i = 0; i < count; i++) {
      const categoryCell = categoryRows.nth(i).locator('td').first();
      categories.push(await categoryCell.textContent());
    }
    return categories;
  }

  async getCategoryData(categoryName) {
    await expect(this.categoryTable).toBeVisible();
    const categoryRows = this.categoryTable.locator('tbody tr');
    const count = await categoryRows.count();
    for (let i = 0; i < count; i++) {
      const row = categoryRows.nth(i);
      const categoryCell = row.locator('td').first();
      const category = await categoryCell.textContent();
      if (category === categoryName) {
        const cells = row.locator('td');
        return {
          category: category,
          amount: await cells.nth(1).textContent(),
          percentage: await cells.nth(2).textContent(),
          transactionCount: await cells.nth(3).textContent()
        };
      }
    }
    return null;
  }

  async hoverOverCategory(categoryName) {
    await expect(this.categoryChart).toBeVisible();
    const categoryData = await this.getCategoryData(categoryName);
    if (categoryData) {
      await this.categoryChart.hover();
    }
  }

  async getTrendData() {
    await expect(this.trendTable).toBeVisible();
    const trendRows = this.trendTable.locator('tbody tr');
    const count = await trendRows.count();
    const trends = [];
    for (let i = 0; i < count; i++) {
      const row = trendRows.nth(i);
      const cells = row.locator('td');
      trends.push({
        month: await cells.nth(0).textContent(),
        totalSpend: await cells.nth(1).textContent()
      });
    }
    return trends;
  }

  async hoverOverTrendDataPoint(index) {
    await expect(this.trendChart).toBeVisible();
    const box = await this.trendChart.boundingBox();
    if (box) {
      const x = box.x + (box.width / 6) * (index + 0.5);
      const y = box.y + box.height / 2;
      await this.page.mouse.move(x, y);
    }
  }

  async clickOnTrendDataPoint(index) {
    await expect(this.trendChart).toBeVisible();
    const box = await this.trendChart.boundingBox();
    if (box) {
      const x = box.x + (box.width / 6) * (index + 0.5);
      const y = box.y + box.height / 2;
      await this.page.mouse.click(x, y);
    }
  }

  async getChartType() {
    await expect(this.trendChart).toBeVisible();
    const chartType = await this.trendChart.getAttribute('data-chart-type');
    return chartType;
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
    await this.page.waitForURL(/dashboard/);
  }
};