const { expect } = require('@playwright/test');

exports.MonthlyTrendAnalysisPage = class MonthlyTrendAnalysisPage {
  constructor(page) {
    this.page = page;
    this.trendChart = page.locator('.trend-chart');
    this.trendLine = page.locator('.trend-line');
    this.timePeriodFilter = page.locator('#time-period-filter');
    this.xAxisLabels = page.locator('.x-axis-label');
    this.dataPoints = page.locator('.data-point');
    this.tooltip = page.locator('.chart-tooltip');
    this.insufficientDataMessage = page.locator('.insufficient-data-message');
  }

  async navigate() {
    await this.page.click('a[href="/analytics/monthly-trends"]');
    await this.page.waitForLoadState('networkidle');
  }

  async getXAxisMonths() {
    const months = [];
    const count = await this.xAxisLabels.count();
    for (let i = 0; i < count; i++) {
      months.push(await this.xAxisLabels.nth(i).textContent());
    }
    return months;
  }

  async getMonthlySpendingData() {
    const spendingData = {};
    const months = await this.getXAxisMonths();
    for (let i = 0; i < months.length; i++) {
      const dataPoint = this.dataPoints.nth(i);
      const value = await dataPoint.getAttribute('data-value');
      spendingData[months[i]] = value;
    }
    return spendingData;
  }

  async hoverOverDataPoint(month) {
    const monthIndex = (await this.getXAxisMonths()).indexOf(month);
    await this.dataPoints.nth(monthIndex).hover();
    await expect(this.tooltip).toBeVisible();
  }

  async getTooltipValue() {
    await expect(this.tooltip).toBeVisible();
    return await this.tooltip.textContent();
  }

  async selectTimePeriod(period) {
    await this.timePeriodFilter.click();
    await this.page.locator(`option:has-text("${period}")`).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }
};