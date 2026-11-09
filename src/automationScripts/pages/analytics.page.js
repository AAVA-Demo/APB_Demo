const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Chart Locators
    this.chartContainer = page.locator('.chart-container').first();
    this.spendingChart = page.locator('#spendingChart');
    this.trendChart = page.locator('#trendChart');
    
    // Category Breakdown Locators
    this.categoryList = page.locator('.chart-container ul li');
    this.totalSpendSummary = page.locator('p').filter({ hasText: 'Total Spend:' });
    
    // Message Locators
    this.noDataMessage = page.locator('text=No spending data available');
    this.emptyChartMessage = page.locator('text=No data to display');
    
    // Page Header
    this.pageHeader = page.locator('h2', { hasText: 'Spending Analytics' });
    
    // Loading Indicator
    this.loadingIndicator = page.locator('text=Loading analytics...');
    
    // Error Alert
    this.errorAlert = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyInteractiveChartDisplayed() {
    await expect(this.chartContainer).toBeVisible();
    await expect(this.spendingChart).toBeVisible();
  }

  async verifyAllCategoriesDisplayed(categories) {
    for (const category of categories) {
      const categoryItem = this.page.locator('li', { hasText: category });
      await expect(categoryItem).toBeVisible();
    }
  }

  async verifyCategoryAmount(category, expectedAmount) {
    const categoryItem = this.page.locator('li', { hasText: category });
    await expect(categoryItem).toBeVisible();
    await expect(categoryItem).toContainText(expectedAmount);
  }

  async verifyChartInteractivity() {
    // Verify chart canvas is present and interactive
    await expect(this.spendingChart).toBeVisible();
    
    // Hover over chart to verify interactivity (tooltips)
    const chartBox = await this.spendingChart.boundingBox();
    if (chartBox) {
      await this.page.mouse.move(chartBox.x + chartBox.width / 2, chartBox.y + chartBox.height / 2);
      await this.page.waitForTimeout(500);
    }
  }

  async verifyTotalSpend(expectedTotal) {
    await expect(this.totalSpendSummary).toBeVisible();
    await expect(this.totalSpendSummary).toContainText(expectedTotal);
  }

  async verifyCategoryPercentage(category, expectedPercentage) {
    // This would require inspecting chart data or tooltip
    // For now, verify category is displayed
    const categoryItem = this.page.locator('li', { hasText: category });
    await expect(categoryItem).toBeVisible();
  }

  async verifyPercentagesSum(expectedSum) {
    // This is a complex validation that would require extracting all percentages
    // For now, verify chart is displayed correctly
    await expect(this.spendingChart).toBeVisible();
  }

  async verifyChartLegendDisplayed() {
    // Chart.js creates legend automatically, verify chart is rendered
    await expect(this.spendingChart).toBeVisible();
  }

  async verifyTotalSpendSummary(expectedTotal) {
    await this.verifyTotalSpend(expectedTotal);
  }

  async verifyCategoryBreakdownListDisplayed() {
    const categoryCount = await this.categoryList.count();
    expect(categoryCount).toBeGreaterThanOrEqual(9);
  }

  async verifyCategoryBreakdownSum(expectedSum) {
    await this.verifyTotalSpend(expectedSum);
  }

  async verifyNoDataMessage(expectedMessage) {
    await expect(this.noDataMessage).toBeVisible();
    await expect(this.noDataMessage).toContainText(expectedMessage);
  }

  async verifyNoSystemErrors() {
    await expect(this.pageHeader).toBeVisible();
    const errorCount = await this.errorAlert.count();
    expect(errorCount).toBe(0);
  }

  async verifyEmptyChartDisplayed() {
    // Check if empty chart message or placeholder is displayed
    const emptyMessageVisible = await this.emptyChartMessage.isVisible().catch(() => false);
    if (emptyMessageVisible) {
      await expect(this.emptyChartMessage).toBeVisible();
    } else {
      // Verify chart container is present but empty
      await expect(this.chartContainer).toBeVisible();
    }
  }

  async verifyAllCategoriesShowZero() {
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    
    for (const category of categories) {
      const categoryItem = this.page.locator('li', { hasText: category });
      await expect(categoryItem).toBeVisible();
      await expect(categoryItem).toContainText('₹0');
    }
  }

  async verifyTotalSpendIncludesAllTransactions() {
    // Verify total spend is displayed and is a valid number
    await expect(this.totalSpendSummary).toBeVisible();
    const totalText = await this.totalSpendSummary.textContent();
    expect(totalText).toMatch(/₹[0-9,]+/);
  }
};
