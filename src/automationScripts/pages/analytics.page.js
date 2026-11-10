const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    this.drillDownPanel = page.locator('[data-testid="drill-down-panel"]');
    this.transactionDetailsList = page.locator('[data-testid="transaction-details-list"]');
    this.filteredTransactionList = page.locator('[data-testid="filtered-transaction-list"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    
    this.chartDataPoints = page.locator('[data-testid="chart-data-point"]');
    this.pieChartSegments = page.locator('[data-testid="pie-chart-segment"]');
    this.categoryBreakdownItems = page.locator('[data-testid="category-breakdown-item"]');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async navigateToSpendingInsights() {
    await this.page.goto('/analytics');
    await this.page.click('[data-testid="spending-insights-tab"]');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalyticsDashboard() {
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async getChartDataPointCount() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const dataPoints = await this.chartDataPoints.all();
    return dataPoints.length;
  }

  async getMonthlySpendingTotals() {
    const dataPoints = await this.chartDataPoints.all();
    const totals = [];
    
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const amount = parseFloat(await point.getAttribute('data-amount'));
      totals.push({ month, amount });
    }
    
    return totals;
  }

  async hoverOverDataPoint(index) {
    const dataPoints = await this.chartDataPoints.all();
    await dataPoints[index].hover();
    await this.page.waitForTimeout(300);
  }

  async verifyTrendLineVisible() {
    const trendLine = this.page.locator('[data-testid="trend-line"]');
    return await trendLine.isVisible();
  }

  async clickOnMonthDataPoint(monthName) {
    const dataPoint = this.page.locator(`[data-testid="chart-data-point"][data-month="${monthName}"]`);
    await expect(dataPoint).toBeVisible();
    await dataPoint.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryBreakdownCount() {
    await expect(this.drillDownPanel).toBeVisible();
    const items = await this.categoryBreakdownItems.all();
    return items.length;
  }

  async getTransactionDetails() {
    const transactionRows = await this.page.locator('[data-testid="transaction-row"]').all();
    
    return transactionRows.map(row => ({
      merchant: row.locator('[data-testid="transaction-merchant"]'),
      amount: row.locator('[data-testid="transaction-amount"]'),
      category: row.locator('[data-testid="transaction-category"]')
    }));
  }

  async verifyDrillDownTotalMatchesChart(monthName, expectedTotal) {
    const drillDownTotal = await this.page.locator('[data-testid="drill-down-total"]').textContent();
    const totalValue = parseFloat(drillDownTotal.replace(/[^0-9.]/g, ''));
    return Math.abs(totalValue - expectedTotal) < 0.01;
  }

  async setUserWithNoTransactions() {
    await this.page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
  }

  async checkForRenderingErrors() {
    const errorElements = await this.page.locator('[data-testid="rendering-error"]').all();
    return errorElements.length > 0;
  }

  async getPieChartSegmentCount() {
    await expect(this.categoryPieChart).toBeVisible();
    const segments = await this.pieChartSegments.all();
    return segments.length;
  }

  async getAllCategorySegments() {
    const segments = await this.pieChartSegments.all();
    const categories = [];
    
    for (const segment of segments) {
      const name = await segment.getAttribute('data-category');
      const percentage = parseFloat(await segment.getAttribute('data-percentage'));
      const total = parseFloat(await segment.getAttribute('data-total'));
      const color = await segment.getAttribute('data-color');
      
      categories.push({ name, percentage, total, color });
    }
    
    return categories;
  }

  async hoverOverPieSegment(categoryName) {
    const segment = this.page.locator(`[data-testid="pie-chart-segment"][data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.hover();
    await this.page.waitForTimeout(300);
  }

  async clickOnCategorySegment(categoryName) {
    const segment = this.page.locator(`[data-testid="pie-chart-segment"][data-category="${categoryName}"]`);
    await expect(segment).toBeVisible();
    await segment.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getFilteredTransactions() {
    await expect(this.filteredTransactionList).toBeVisible();
    const transactionRows = await this.page.locator('[data-testid="filtered-transaction-row"]').all();
    
    return transactionRows.map(row => ({
      merchant: row.locator('[data-testid="transaction-merchant"]'),
      date: row.locator('[data-testid="transaction-date"]'),
      amount: row.locator('[data-testid="transaction-amount"]'),
      category: row.locator('[data-testid="transaction-category"]')
    }));
  }

  async verifyAllTransactionsMatchCategory(categoryName) {
    const transactions = await this.getFilteredTransactions();
    
    for (const txn of transactions) {
      const category = await txn.category.textContent();
      if (category !== categoryName) {
        return false;
      }
    }
    return true;
  }
};
