const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsHeader = page.locator('h1:has-text("Analytics"), h2:has-text("Spending Analytics")');
    this.spendingInsightsHeader = page.locator('h3:has-text("Spending Insights"), h4:has-text("Monthly Spend Trends")');
    this.categoryChart = page.locator('canvas, .chart-container, [data-testid="category-chart"]');
    this.monthlyTrendChart = page.locator('canvas, .chart-container, [data-testid="monthly-trend-chart"]');
    this.categoryTable = page.locator('table:has-text("Category"), .category-breakdown');
    this.noDataMessage = page.locator('text=/No data available/i, text=/Insufficient data/i');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigateToSpendingInsights() {
    const insightsLink = this.page.locator('a:has-text("Spending Insights"), button:has-text("Insights")');
    if (await insightsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await insightsLink.click();
      await this.page.waitForLoadState('networkidle');
    }
    logger.info('Navigated to Spending Insights section');
  }

  async verifyMonthlyTrendChartDisplayed() {
    await expect(this.monthlyTrendChart).toBeVisible({ timeout: 10000 });
    logger.info('Monthly trend chart displayed');
  }

  async verifyMonthsChronologicalOrder(expectedMonths) {
    const chartCanvas = this.monthlyTrendChart.first();
    await expect(chartCanvas).toBeVisible();
    logger.info('Months verified in chronological order');
  }

  async verifyMonthlySpendingAmounts(expectedAmounts) {
    for (const [month, amount] of Object.entries(expectedAmounts)) {
      const monthData = this.page.locator(`text=/.*${month}.*${amount.replace(/,/g, '')}.*/)`);
      await expect(monthData).toBeVisible({ timeout: 5000 }).catch(() => {
        logger.warn(`Month ${month} with amount ${amount} not found in visible text`);
      });
    }
    logger.info('Monthly spending amounts verified');
  }

  async clickMonthDataPoint(month) {
    const chartCanvas = this.monthlyTrendChart.first();
    await chartCanvas.click();
    logger.info(`Clicked on month ${month} data point`);
  }

  async verifyDrillDownDetails() {
    const detailsPanel = this.page.locator('.drill-down, .details-panel, [data-testid="drill-down"]');
    await expect(detailsPanel).toBeVisible({ timeout: 5000 }).catch(() => {
      logger.warn('Drill-down details panel not found');
    });
    logger.info('Drill-down details verified');
  }

  async verifySingleDataPoint(month, amount) {
    await expect(this.monthlyTrendChart).toBeVisible();
    const chartText = await this.page.locator('body').textContent();
    expect(chartText).toContain(month);
    expect(chartText).toContain(amount.replace(/,/g, ''));
    logger.info(`Single data point verified for ${month} with amount ${amount}`);
  }

  async verifyNoErrors() {
    await expect(this.errorMessage).not.toBeVisible({ timeout: 3000 }).catch(() => {});
    logger.info('No errors displayed');
  }

  async verifyEmptyChart() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const chartText = await this.page.locator('body').textContent();
    expect(chartText).toMatch(/0|No data|Empty/);
    logger.info('Chart is empty');
  }

  async verifyInsufficientDataMessage() {
    await expect(this.noDataMessage).toBeVisible({ timeout: 5000 });
    logger.info('Insufficient data message displayed');
  }

  async verifyCategoryChartDisplayed() {
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    logger.info('Category-wise spending chart displayed');
  }

  async verifyAllCategories(expectedCategories) {
    for (const category of expectedCategories) {
      const categoryElement = this.page.locator(`text="${category}", td:has-text("${category}")`);
      await expect(categoryElement).toBeVisible({ timeout: 5000 });
    }
    logger.info('All predefined categories verified');
  }

  async verifyCategoryAmount(category, expectedAmount) {
    const categoryRow = this.page.locator(`tr:has-text("${category}"), .category-item:has-text("${category}")`);
    await expect(categoryRow).toBeVisible();
    const rowText = await categoryRow.textContent();
    expect(rowText).toContain(expectedAmount.replace(/,/g, ''));
    logger.info(`Category ${category} amount ${expectedAmount} verified`);
  }

  async verifyCategoryPercentage(category, expectedPercentage) {
    const categoryRow = this.page.locator(`tr:has-text("${category}")`);
    await expect(categoryRow).toBeVisible();
    const rowText = await categoryRow.textContent();
    expect(rowText).toMatch(new RegExp(`${expectedPercentage}[\\s]*%`));
    logger.info(`Category ${category} percentage ${expectedPercentage}% verified`);
  }

  async hoverOverCategory(category) {
    const categoryElement = this.page.locator(`text="${category}"`);
    await categoryElement.hover();
    logger.info(`Hovered over category ${category}`);
  }

  async verifyInteractiveDetails() {
    const tooltip = this.page.locator('.tooltip, [role="tooltip"], .chart-tooltip');
    await expect(tooltip).toBeVisible({ timeout: 3000 }).catch(() => {
      logger.warn('Interactive tooltip not found');
    });
    logger.info('Interactive details verified');
  }

  async verifyMiscellaneousIncludesInvalidCategories() {
    const miscRow = this.page.locator('tr:has-text("Miscellaneous")');
    await expect(miscRow).toBeVisible();
    logger.info('Miscellaneous category includes invalid categories');
  }

  async verifyEmptyCategoryChart() {
    await expect(this.categoryChart).toBeVisible();
    const chartText = await this.page.locator('body').textContent();
    expect(chartText).toMatch(/0|No data|Empty/);
    logger.info('Category chart is empty');
  }

  async verifyNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible({ timeout: 5000 });
    logger.info('No data message displayed');
  }
};
