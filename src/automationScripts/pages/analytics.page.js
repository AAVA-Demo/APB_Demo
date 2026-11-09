const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.analyticsContainer = page.locator('[ng-controller="analyticsController as vm"]');
    this.loadingIndicator = page.locator('.row:has-text("Loading Analytics...")');
    this.errorAlert = page.locator('.alert-danger');
    this.categoryChart = page.locator('spending-chart[chart-type="pie"]');
    this.categoryTable = page.locator('table.table-striped');
    this.categoryRows = page.locator('table.table-striped tbody tr');
    this.currentMonthSpendPanel = page.locator('.analytics-panel:has-text("Current Month Spend")');
    this.topCategoryPanel = page.locator('.analytics-panel:has-text("Top Spending Category")');
    this.emptyStateMessage = page.locator('.analytics-panel:has-text("No spending data")');
    this.chartCanvas = page.locator('canvas');
  }

  async navigate() {
    logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await this.waitForAnalyticsDashboardLoad();
  }

  async navigateWithUser(username) {
    logger.info(`Navigating to Analytics page with user: ${username}`);
    await this.page.goto(`/analytics?user=${username}`);
    await this.waitForAnalyticsDashboardLoad();
  }

  async waitForAnalyticsDashboardLoad() {
    logger.info('Waiting for analytics dashboard to load');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
    await expect(this.analyticsContainer).toBeVisible();
  }

  async getAllCategoryNames() {
    logger.info('Getting all category names');
    await expect(this.categoryRows.first()).toBeVisible();
    const rows = await this.categoryRows.all();
    const categories = [];
    for (const row of rows) {
      const categoryCell = row.locator('td').first();
      const categoryName = await categoryCell.textContent();
      categories.push(categoryName.trim());
    }
    return categories;
  }

  async verifyCategoryAmount(categoryName, expectedAmount) {
    logger.info(`Verifying amount for category: ${categoryName}`);
    const row = this.categoryRows.filter({ hasText: categoryName });
    await expect(row).toBeVisible();
    const amountCell = row.locator('td').nth(1);
    const amount = await amountCell.textContent();
    const numericAmount = amount.replace(/[$,]/g, '').trim();
    expect(numericAmount).toBe(expectedAmount);
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

  async getTotalSpending() {
    logger.info('Getting total spending amount');
    const currentMonthValue = await this.currentMonthSpendPanel.locator('.analytics-value').textContent();
    return currentMonthValue.replace(/[$,]/g, '').trim();
  }

  async getCategoryPercentage(categoryName) {
    logger.info(`Getting percentage for category: ${categoryName}`);
    const row = this.categoryRows.filter({ hasText: categoryName });
    await expect(row).toBeVisible();
    const percentageCell = row.locator('td').nth(3);
    const percentage = await percentageCell.textContent();
    return percentage.replace('%', '').trim();
  }

  async getAllCategoryPercentages() {
    logger.info('Getting all category percentages');
    const rows = await this.categoryRows.all();
    const percentages = [];
    for (const row of rows) {
      const percentageCell = row.locator('td').nth(3);
      const percentage = await percentageCell.textContent();
      percentages.push(percentage.replace('%', '').trim());
    }
    return percentages;
  }

  async getActiveCategoriesWithTransactions() {
    logger.info('Getting active categories with transactions');
    const rows = await this.categoryRows.all();
    const activeCategories = [];
    for (const row of rows) {
      const categoryCell = row.locator('td').first();
      const amountCell = row.locator('td').nth(1);
      const categoryName = await categoryCell.textContent();
      const amount = await amountCell.textContent();
      const numericAmount = parseFloat(amount.replace(/[$,]/g, '').trim());
      if (numericAmount > 0) {
        activeCategories.push(categoryName.trim());
      }
    }
    return activeCategories;
  }

  async getZeroValueCategoriesCount() {
    logger.info('Getting count of zero-value categories');
    const rows = await this.categoryRows.all();
    let zeroCount = 0;
    for (const row of rows) {
      const amountCell = row.locator('td').nth(1);
      const amount = await amountCell.textContent();
      const numericAmount = parseFloat(amount.replace(/[$,]/g, '').trim());
      if (numericAmount === 0) {
        zeroCount++;
      }
    }
    return zeroCount;
  }

  async isChartRenderedCorrectly() {
    logger.info('Checking if chart is rendered correctly');
    await expect(this.chartCanvas).toBeVisible();
    const boundingBox = await this.chartCanvas.boundingBox();
    return boundingBox && boundingBox.width > 0 && boundingBox.height > 0;
  }

  async getEmptyStateMessage() {
    logger.info('Getting empty state message');
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async checkForJavaScriptErrors() {
    logger.info('Checking for JavaScript errors');
    const errors = [];
    this.page.on('pageerror', error => errors.push(error));
    await this.page.waitForTimeout(1000);
    return errors.length > 0;
  }

  async isDashboardStable() {
    logger.info('Checking if dashboard is stable');
    await expect(this.analyticsContainer).toBeVisible();
    const errorVisible = await this.errorAlert.isVisible().catch(() => false);
    return !errorVisible;
  }

  async isEmptyStateVisible() {
    logger.info('Checking if empty state is visible');
    return await this.emptyStateMessage.isVisible().catch(() => false);
  }

  async areAllCategoriesZeroOrHidden() {
    logger.info('Checking if all categories are zero or hidden');
    const rowCount = await this.categoryRows.count();
    if (rowCount === 0) return true;
    
    const rows = await this.categoryRows.all();
    for (const row of rows) {
      const amountCell = row.locator('td').nth(1);
      const amount = await amountCell.textContent();
      const numericAmount = parseFloat(amount.replace(/[$,]/g, '').trim());
      if (numericAmount !== 0 && !isNaN(numericAmount)) {
        return false;
      }
    }
    return true;
  }

  async checkForConsoleErrors() {
    logger.info('Checking for console errors');
    const consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await this.page.waitForTimeout(1000);
    return consoleErrors.length > 0;
  }
};
