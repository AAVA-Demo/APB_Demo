const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.trendChart = page.locator('trend-chart canvas');
    this.categoryChart = page.locator('category-chart canvas');
    this.cardWiseChart = page.locator('card-wise-chart canvas');
    this.chartTooltip = page.locator('.chartjs-tooltip');
    this.categoryTooltip = page.locator('.chartjs-tooltip');
    this.categoryModal = page.locator('.modal');
    this.chartLegend = page.locator('.chart-legend');
    this.errorMessage = page.locator('.alert-danger');
    this.chartErrorPlaceholder = page.locator('.chart-error-placeholder');
    this.limitedDataMessage = page.locator('.alert-info:has-text("Limited historical data")');
    this.zeroCategoryNote = page.locator('.alert-info:has-text("No spending in")');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async getTrendChartDataPoints() {
    await expect(this.trendChart).toBeVisible();
    const dataPoints = await this.page.evaluate(() => {
      const canvas = document.querySelector('trend-chart canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data;
      }
      return [];
    });
    return dataPoints;
  }

  async getTrendChartLabel(index) {
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('trend-chart canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    return labels[index];
  }

  async hoverOverDataPoint(index) {
    const chartElement = this.trendChart;
    const box = await chartElement.boundingBox();
    const x = box.x + (box.width / 13) * (index + 1);
    const y = box.y + box.height / 2;
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(300);
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async getCategoryChartSegments() {
    await expect(this.categoryChart).toBeVisible();
    const segments = await this.page.evaluate(() => {
      const canvas = document.querySelector('category-chart canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.datasets[0].data;
      }
      return [];
    });
    return segments;
  }

  async getCategoryLabels() {
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('category-chart canvas');
      if (canvas && canvas.chart) {
        return canvas.chart.data.labels;
      }
      return [];
    });
    return labels;
  }

  async hoverOverCategorySegment(categoryName) {
    const labels = await this.getCategoryLabels();
    const index = labels.indexOf(categoryName);

    const chartElement = this.categoryChart;
    const box = await chartElement.boundingBox();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const angle = (index / labels.length) * 2 * Math.PI;
    const radius = Math.min(box.width, box.height) / 3;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(300);
  }

  async getCategoryTooltipText() {
    await expect(this.categoryTooltip).toBeVisible();
    return await this.categoryTooltip.textContent();
  }

  async clickCategorySegment(categoryName) {
    const labels = await this.getCategoryLabels();
    const index = labels.indexOf(categoryName);

    const chartElement = this.categoryChart;
    const box = await chartElement.boundingBox();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const angle = (index / labels.length) * 2 * Math.PI;
    const radius = Math.min(box.width, box.height) / 3;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    await this.page.mouse.click(x, y);
    await this.page.waitForTimeout(300);
  }

  async getCategoryModalContent() {
    await expect(this.categoryModal).toBeVisible();
    return await this.categoryModal.textContent();
  }

  async closeCategoryModal() {
    const closeButton = this.categoryModal.locator('button.close');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getLimitedDataMessage() {
    await expect(this.limitedDataMessage).toBeVisible();
    return await this.limitedDataMessage.textContent();
  }

  async getZeroCategoryNoteText() {
    await expect(this.zeroCategoryNote).toBeVisible();
    return await this.zeroCategoryNote.textContent();
  }
};
