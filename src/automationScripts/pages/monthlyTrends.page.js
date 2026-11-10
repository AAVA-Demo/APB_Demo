const { expect } = require('@playwright/test');
const Logger = require('../../utils/logger');

exports.MonthlyTrendsPage = class MonthlyTrendsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    
    this.analyticsNav = page.locator('a[href*="analytics"], button:has-text("Spending Analytics")');
    this.trendChart = page.locator('.monthly-trend-chart, .trend-visualization');
    this.monthDataPoint = (month) => page.locator(`[data-month="${month}"], .chart-point[data-label="${month}"]`);
    this.insufficientDataMessage = page.locator('.insufficient-data-message, .empty-state');
  }

  async navigateToSpendingAnalytics() {
    this.logger.info('Navigating to Spending Analytics for monthly trends');
    await this.analyticsNav.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyMonthlySpend(month, expectedAmount) {
    this.logger.info(`Verifying ${month} spend: ${expectedAmount}`);
    const monthPoint = this.monthDataPoint(month);
    await expect(monthPoint).toBeVisible();
    await expect(monthPoint).toContainText(expectedAmount);
  }

  async verifyChartInteractivity() {
    this.logger.info('Verifying chart interactivity');
    await expect(this.trendChart).toBeVisible();
    const chartElement = await this.trendChart.elementHandle();
    const isInteractive = await chartElement.evaluate(el => {
      return el.hasAttribute('data-interactive') || 
             el.querySelector('[data-interactive]') !== null ||
             window.getComputedStyle(el).cursor === 'pointer';
    });
    expect(isInteractive).toBeTruthy();
  }

  async verifyEmptyMonths(monthNames) {
    this.logger.info(`Verifying empty months: ${monthNames.join(', ')}`);
    for (const month of monthNames) {
      const monthPoint = this.monthDataPoint(month);
      const isVisible = await monthPoint.isVisible().catch(() => false);
      if (isVisible) {
        const text = await monthPoint.textContent();
        expect(text).toMatch(/\$0|0\.00|^$/);
      } else {
        this.logger.info(`${month} is not displayed (expected for empty month)`);
      }
    }
  }
};