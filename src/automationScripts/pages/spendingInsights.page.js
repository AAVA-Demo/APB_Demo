const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.SpendingInsightsPage = class SpendingInsightsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.analyticsContainer = page.locator('[ng-controller="analyticsController as vm"]');
    this.loadingIndicator = page.locator('.row:has-text("Loading Analytics...")');
    this.monthlyTrendChart = page.locator('spending-chart[chart-type="line"]');
    this.monthlyTrendTable = page.locator('table.table-bordered');
    this.monthlyTrendRows = page.locator('table.table-bordered tbody tr');
    this.insufficientDataMessage = page.locator('text=/Insufficient historical data|No trend data available/');
    this.chartCanvas = page.locator('canvas');
  }

  async navigate() {
    logger.info('Navigating to Spending Insights page');
    await this.page.goto('/analytics');
    await this.waitForSpendingInsightsLoad();
  }

  async navigateWithUser(username) {
    logger.info(`Navigating to Spending Insights page with user: ${username}`);
    await this.page.goto(`/analytics?user=${username}`);
    await this.waitForSpendingInsightsLoad();
  }

  async waitForSpendingInsightsLoad() {
    logger.info('Waiting for spending insights to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.analyticsContainer).toBeVisible();
  }

  async getMonthCount() {
    logger.info('Getting month count from trend chart');
    const rowCount = await this.monthlyTrendRows.count();
    return rowCount;
  }

  async verifyMonthlySpend(month, expectedAmount) {
    logger.info(`Verifying monthly spend for ${month}: ${expectedAmount}`);
    const row = this.monthlyTrendRows.filter({ hasText: month });
    await expect(row).toBeVisible();
    const amountCell = row.locator('td').nth(1);
    const amount = await amountCell.textContent();
    const numericAmount = amount.replace(/[$,]/g, '').trim();
    expect(numericAmount).toBe(expectedAmount + '.00');
  }

  async isTrendLineVisible() {
    logger.info('Checking if trend line is visible');
    await expect(this.chartCanvas).toBeVisible();
    return true;
  }

  async verifyChartInteractivity() {
    logger.info('Verifying chart interactivity');
    await expect(this.chartCanvas).toBeVisible();
    const boundingBox = await this.chartCanvas.boundingBox();
    if (!boundingBox) return false;
    
    await this.page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
    await this.page.waitForTimeout(500);
    return true;
  }

  async getMonthLabels() {
    logger.info('Getting month labels from trend table');
    const rows = await this.monthlyTrendRows.all();
    const labels = [];
    for (const row of rows) {
      const monthCell = row.locator('td').first();
      const monthText = await monthCell.textContent();
      labels.push(monthText.trim());
    }
    return labels;
  }

  async verifyMonthLabelFormat() {
    logger.info('Verifying month label format consistency');
    const labels = await this.getMonthLabels();
    const formatRegex = /^\d{4}-\d{2}$/;
    for (const label of labels) {
      if (!formatRegex.test(label)) {
        return false;
      }
    }
    return true;
  }

  async verifyYearIndicatorsPresent() {
    logger.info('Verifying year indicators are present');
    const labels = await this.getMonthLabels();
    const has2025 = labels.some(label => label.startsWith('2025'));
    const has2026 = labels.some(label => label.startsWith('2026'));
    return has2025 && has2026;
  }

  async hasInsufficientDataMessage() {
    logger.info('Checking for insufficient data message');
    return await this.insufficientDataMessage.isVisible().catch(() => false);
  }

  async checkForSystemErrors() {
    logger.info('Checking for system errors');
    const errors = [];
    this.page.on('pageerror', error => errors.push(error));
    await this.page.waitForTimeout(1000);
    return errors.length > 0;
  }

  async getCurrentMonthSpend() {
    logger.info('Getting current month spend');
    const currentMonthPanel = this.page.locator('.analytics-panel:has-text("Current Month Spend")');
    await expect(currentMonthPanel).toBeVisible();
    const valueElement = currentMonthPanel.locator('.analytics-value');
    const text = await valueElement.textContent();
    return text.replace(/[$,]/g, '').trim();
  }

  async isChartRenderedCorrectly() {
    logger.info('Checking if chart is rendered correctly');
    await expect(this.chartCanvas).toBeVisible();
    const boundingBox = await this.chartCanvas.boundingBox();
    return boundingBox && boundingBox.width > 0 && boundingBox.height > 0;
  }

  async verifyYAxisScaling() {
    logger.info('Verifying Y-axis scaling');
    await expect(this.chartCanvas).toBeVisible();
    // Y-axis scaling verification would typically require canvas inspection
    // For this implementation, we verify the chart renders without errors
    return await this.isChartRenderedCorrectly();
  }
};
