const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsLink = page.locator('a[href="/analytics"]');
    this.dashboardLink = page.locator('a[href="/dashboard"]');
    this.availableCreditDisplay = page.locator('[data-testid="available-credit-display"]');
    this.outstandingAmountDisplay = page.locator('[data-testid="outstanding-amount-display"]');
    this.warningAlert = page.locator('[data-testid="warning-alert"]');
    this.pendingTransactionIndicator = page.locator('[data-testid="pending-transaction-indicator"]');
    this.categoryVisualization = page.locator('[data-testid="category-visualization"]');
    this.categoryElements = page.locator('[data-testid="category-item"]');
    this.categoryTooltip = page.locator('[data-testid="category-tooltip"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.monthlyTrendTab = page.locator('[data-testid="monthly-trend-tab"]');
    this.trendChart = page.locator('[data-testid="trend-chart"]');
    this.monthDataPoints = page.locator('[data-testid="month-data-point"]');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionItems = page.locator('[data-testid="transaction-item"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.closeErrorButton = page.locator('[data-testid="close-error-button"]');
  }

  async navigateToDashboard() {
    await expect(this.dashboardLink).toBeVisible();
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsLink).toBeVisible();
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditDisplay).toBeVisible();
    return await this.availableCreditDisplay.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountDisplay).toBeVisible();
    return await this.outstandingAmountDisplay.textContent();
  }

  async getWarningAlertText() {
    await expect(this.warningAlert).toBeVisible();
    return await this.warningAlert.textContent();
  }

  async waitForVisualizationLoad() {
    await expect(this.categoryVisualization).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCategoryNames() {
    await expect(this.categoryElements.first()).toBeVisible();
    const count = await this.categoryElements.count();
    const categories = [];
    for (let i = 0; i < count; i++) {
      const categoryName = await this.categoryElements.nth(i).locator('[data-testid="category-name"]').textContent();
      categories.push(categoryName);
    }
    return categories;
  }

  async getVisibleCategoryNames() {
    await expect(this.categoryElements.first()).toBeVisible();
    const count = await this.categoryElements.count();
    const visibleCategories = [];
    for (let i = 0; i < count; i++) {
      const categoryElement = this.categoryElements.nth(i);
      const isVisible = await categoryElement.isVisible();
      if (isVisible) {
        const categoryName = await categoryElement.locator('[data-testid="category-name"]').textContent();
        visibleCategories.push(categoryName);
      }
    }
    return visibleCategories;
  }

  async getCategoryAmount(categoryName) {
    const categoryElement = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await expect(categoryElement).toBeVisible();
    const amountLocator = categoryElement.locator('[data-testid="category-amount"]');
    return await amountLocator.textContent();
  }

  async isCategoryVisible(categoryName) {
    const categoryElement = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    return await categoryElement.isVisible();
  }

  async hoverOverCategory(categoryName) {
    const categoryElement = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await expect(categoryElement).toBeVisible();
    await categoryElement.hover();
  }

  async getErrorMessageText() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async clickMonthlyTrendAnalysisTab() {
    await expect(this.monthlyTrendTab).toBeVisible();
    await this.monthlyTrendTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTrendChartLoad() {
    await expect(this.trendChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthLabels() {
    await expect(this.monthDataPoints.first()).toBeVisible();
    const count = await this.monthDataPoints.count();
    const labels = [];
    for (let i = 0; i < count; i++) {
      const label = await this.monthDataPoints.nth(i).getAttribute('data-month');
      labels.push(label);
    }
    return labels;
  }

  async clickMonthDataPoint(monthLabel) {
    const dataPoint = this.page.locator(`[data-testid="month-data-point"][data-month="${monthLabel}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDrillDownViewLoad() {
    await expect(this.transactionList).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionCount() {
    await expect(this.transactionItems.first()).toBeVisible();
    return await this.transactionItems.count();
  }

  async getTransactionDetails(index) {
    const transactionElement = this.transactionItems.nth(index);
    await expect(transactionElement).toBeVisible();
    return {
      date: await transactionElement.locator('[data-testid="transaction-date"]').textContent(),
      merchant: await transactionElement.locator('[data-testid="transaction-merchant"]').textContent(),
      category: await transactionElement.locator('[data-testid="transaction-category"]').textContent(),
      amount: await transactionElement.locator('[data-testid="transaction-amount"]').textContent()
    };
  }

  async getInsufficientDataMessageText() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async isTrendChartVisible() {
    return await this.trendChart.isVisible();
  }

  async clickCloseErrorButton() {
    await expect(this.closeErrorButton).toBeVisible();
    await expect(this.closeErrorButton).toBeEnabled();
    await this.closeErrorButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};
