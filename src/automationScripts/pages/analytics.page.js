const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Analytics container
    this.analyticsContainer = page.locator('.analytics-container');
    
    // Category chart locators
    this.categoryPieChart = page.locator('#categoryChart');
    this.categoryTooltip = page.locator('.chartjs-tooltip');
    this.categoryLegend = page.locator('.category-legend');
    this.categoryDetailModal = page.locator('.modal:has-text("Details")');
    
    // Monthly trends locators
    this.monthlyTrendsChart = page.locator('#monthlyChart');
    this.chartTooltip = page.locator('.chartjs-tooltip');
    this.monthDetailModal = page.locator('.modal');
    this.monthlyTrendsViewButton = page.locator('button:has-text("Monthly Trends")');
    
    // Messages
    this.insufficientDataMessage = page.locator('text=Insufficient transaction history');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigateToSpendingAnalytics() {
    await this.page.click('a[href="#!/analytics"]');
    await expect(this.analyticsContainer).toBeVisible();
  }

  async getAllCategorySegments() {
    await expect(this.categoryPieChart).toBeVisible();
    const segments = await this.page.locator('.category-segment').all();
    return segments;
  }

  async isCategoryDisplayed(categoryName) {
    const categoryElement = this.page.locator(`.category-segment[data-category="${categoryName}"]`);
    return await categoryElement.isVisible();
  }

  async hoverOverCategory(categoryName) {
    const categoryElement = this.page.locator(`.category-segment[data-category="${categoryName}"]`);
    await categoryElement.hover();
  }

  async getTooltipText() {
    await expect(this.categoryTooltip).toBeVisible();
    return await this.categoryTooltip.textContent();
  }

  async clickCategorySegment(categoryName) {
    const categoryElement = this.page.locator(`.category-segment[data-category="${categoryName}"]`);
    await categoryElement.click();
  }

  async getModalTitle() {
    const modalTitle = this.categoryDetailModal.locator('.modal-title');
    await expect(modalTitle).toBeVisible();
    return await modalTitle.textContent();
  }

  async getModalTotalAmount() {
    const amountElement = this.categoryDetailModal.locator('.total-amount');
    return await amountElement.textContent();
  }

  async getModalTransactionCount() {
    const countElement = this.categoryDetailModal.locator('.transaction-count');
    return await countElement.textContent();
  }

  async getModalPercentage() {
    const percentageElement = this.categoryDetailModal.locator('.percentage');
    return await percentageElement.textContent();
  }

  async closeModal() {
    const closeButton = this.categoryDetailModal.locator('button.close');
    await closeButton.click();
  }

  async getVisibleCategorySegments() {
    const segments = await this.page.locator('.category-segment:visible').all();
    const categoryNames = [];
    
    for (const segment of segments) {
      const categoryName = await segment.getAttribute('data-category');
      categoryNames.push(categoryName);
    }
    
    return categoryNames;
  }

  async getAllLegendItems() {
    return await this.categoryLegend.locator('.legend-item').all();
  }

  async getLegendCategoryAmount(categoryName) {
    const legendItem = this.categoryLegend.locator(`.legend-item:has-text("${categoryName}")`);
    const amountElement = legendItem.locator('.legend-amount');
    return await amountElement.textContent();
  }

  async selectMonthlyTrendsView() {
    await this.monthlyTrendsViewButton.click();
    await expect(this.monthlyTrendsChart).toBeVisible();
  }

  async getMonthlyDataPoints() {
    const dataPoints = await this.page.locator('.chart-data-point').all();
    return dataPoints;
  }

  async isMonthDisplayed(monthLabel) {
    const monthElement = this.page.locator(`.chart-label:has-text("${monthLabel}")`);
    return await monthElement.isVisible();
  }

  async hoverOverDataPoint(monthLabel) {
    const dataPoint = this.page.locator(`.chart-data-point[data-month="${monthLabel}"]`);
    await dataPoint.hover();
  }

  async zoomChart(zoomLevel) {
    await this.monthlyTrendsChart.evaluate((chart, level) => {
      chart.zoom(level);
    }, zoomLevel);
  }

  async panChart(x, y) {
    await this.monthlyTrendsChart.evaluate((chart, coords) => {
      chart.pan(coords.x, coords.y);
    }, { x, y });
  }

  async getMonthSpendValue(monthLabel) {
    const dataPoint = this.page.locator(`.chart-data-point[data-month="${monthLabel}"]`);
    return await dataPoint.getAttribute('data-value');
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async clickDataPoint(monthLabel) {
    const dataPoint = this.page.locator(`.chart-data-point[data-month="${monthLabel}"]`);
    await dataPoint.click();
  }

  async getModalTotalSpend() {
    const spendElement = this.monthDetailModal.locator('.total-spend');
    return await spendElement.textContent();
  }

  async getCategoryDistribution() {
    const distribution = {};
    const categoryRows = await this.monthDetailModal.locator('.category-row').all();
    
    for (const row of categoryRows) {
      const category = await row.locator('.category-name').textContent();
      const amount = await row.locator('.category-amount').textContent();
      distribution[category] = amount;
    }
    
    return distribution;
  }
};