const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.categoryChart = page.locator('category-chart');
    this.trendChart = page.locator('trend-chart');
    this.drillDownView = page.locator('.drill-down-view');
    this.categoryFilterOptions = page.locator('.filter-options');
    this.noCategoryDataMessage = page.locator('text=No transactions exist for the selected category');
    this.chartTooltip = page.locator('.chart-tooltip');
  }

  async navigateToAnalytics() {
    await this.page.click('a[href="#/analytics"]');
    await this.page.waitForURL('**/analytics');
  }

  async navigateToMonthlyTrends() {
    await this.navigateToAnalytics();
    await this.page.click('text=Monthly Trends');
  }

  async waitForAnalyticsLoad() {
    await expect(this.categoryChart).toBeVisible({ timeout: 3000 });
  }

  async waitForTrendChartLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 3000 });
  }

  async waitForDrillDownLoad() {
    await expect(this.drillDownView).toBeVisible();
  }

  async getCategoryLabels() {
    await this.page.waitForTimeout(500);
    const labels = await this.page.evaluate(() => {
      const chartElement = document.querySelector('category-chart canvas');
      if (chartElement && chartElement.chart) {
        return chartElement.chart.data.labels;
      }
      return [];
    });
    return labels;
  }

  async getMonthLabels() {
    await this.page.waitForTimeout(500);
    const labels = await this.page.evaluate(() => {
      const chartElement = document.querySelector('trend-chart canvas');
      if (chartElement && chartElement.chart) {
        return chartElement.chart.data.labels;
      }
      return [];
    });
    return labels;
  }

  async clickCategorySegment(categoryName) {
    await this.page.evaluate((category) => {
      const chartElement = document.querySelector('category-chart canvas');
      if (chartElement && chartElement.chart) {
        const index = chartElement.chart.data.labels.indexOf(category);
        if (index > -1) {
          const meta = chartElement.chart.getDatasetMeta(0);
          const element = meta.data[index];
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          element._model && chartElement.dispatchEvent(event);
        }
      }
    }, categoryName);
  }

  async hoverOverMonthDataPoint(monthLabel) {
    await this.page.evaluate((month) => {
      const chartElement = document.querySelector('trend-chart canvas');
      if (chartElement && chartElement.chart) {
        const index = chartElement.chart.data.labels.indexOf(month);
        if (index > -1) {
          const meta = chartElement.chart.getDatasetMeta(0);
          const element = meta.data[index];
          const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          element._model && chartElement.dispatchEvent(event);
        }
      }
    }, monthLabel);
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    return await this.chartTooltip.textContent();
  }
};
