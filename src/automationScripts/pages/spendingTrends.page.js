const { expect } = require('@playwright/test');

exports.SpendingTrendsPage = class SpendingTrendsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.trendsLink = page.locator('a[href="#!/trends"]');
    this.cardwiseAnalysisSection = page.locator('text=Card-wise Spending Breakdown');
    
    // Chart Locators
    this.trendChart = page.locator('trend-chart[chart-type="line"]');
    this.cardwiseChart = page.locator('trend-chart[chart-type="bar"]');
    this.comparisonChart = page.locator('.comparison-chart');
    this.chartTooltip = page.locator('.chart-tooltip');
    
    // Filter Locators
    this.dateRangePicker = page.locator('input[type="date"]').first();
    this.startDateInput = page.locator('input[ng-model="vm.filters.startDate"]');
    this.endDateInput = page.locator('input[ng-model="vm.filters.endDate"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters")');
    this.monthSelector = page.locator('select.month-selector');
    this.comparisonDropdown = page.locator('select.comparison-month');
    
    // Message Locators
    this.insufficientDataMessage = page.locator('text=Insufficient historical data');
    this.timeoutErrorMessage = page.locator('text=Request timed out');
    this.dataRetentionNotification = page.locator('.alert:has-text("Data retention policy")');
    
    // Action Locators
    this.retryButton = page.locator('button:has-text("Retry")');
    
    // Summary Table Locators
    this.cardSummaryTable = page.locator('table.table-striped');
    this.cardSummaryRows = page.locator('table.table-striped tbody tr');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async authenticate(username, password) {
    await this.page.evaluate((user) => {
      window.sessionStorage.setItem('authToken', `mock-jwt-token-${user}-${Date.now()}`);
    }, username);
    await this.page.goto('#!/trends');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTrends() {
    await this.trendsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCardwiseAnalysis() {
    await this.trendsLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('trend-chart[chart-type="bar"]', { state: 'visible' });
  }

  async getTrendDataPointCount() {
    await this.page.waitForSelector('trend-chart[chart-type="line"] canvas', { state: 'visible' });
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('trend-chart[chart-type="line"] canvas');
      const chartInstance = Chart.getChart(canvas);
      return chartInstance ? chartInstance.data.labels.length : 0;
    });
  }

  async hoverOverDataPoint(index) {
    const canvas = this.page.locator('trend-chart[chart-type="line"] canvas');
    await canvas.hover({ position: { x: 100 + (index * 50), y: 100 } });
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async measureChartRenderTime() {
    const startTime = Date.now();
    await this.page.waitForSelector('trend-chart canvas', { state: 'visible' });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async isChartVisible() {
    const count = await this.trendChart.count();
    return count > 0;
  }

  async getTimeoutErrorMessage() {
    await expect(this.timeoutErrorMessage).toBeVisible();
    return await this.timeoutErrorMessage.textContent();
  }

  async clickRetry() {
    await this.retryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardCount() {
    await this.page.waitForSelector('table.table-striped tbody tr', { state: 'visible' });
    return await this.cardSummaryRows.count();
  }

  async getCardPercentages() {
    await this.page.waitForSelector('table.table-striped tbody tr', { state: 'visible' });
    const rows = await this.cardSummaryRows.all();
    const percentages = [];
    for (const row of rows) {
      const percentText = await row.locator('td:nth-child(3)').textContent();
      const percent = parseFloat(percentText.replace('%', ''));
      percentages.push(percent);
    }
    return percentages;
  }

  async getDateRange() {
    const dateRangeElement = this.page.locator('.date-range-indicator');
    await expect(dateRangeElement).toBeVisible();
    return await dateRangeElement.textContent();
  }

  async openDateRangePicker() {
    await this.dateRangePicker.click();
  }

  async selectCustomDateRange(startDate, endDate) {
    // For mock purposes, we'll use relative date strings
    const today = new Date();
    const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
    
    await this.startDateInput.fill(twoYearsAgo.toISOString().split('T')[0]);
    await this.endDateInput.fill(today.toISOString().split('T')[0]);
  }

  async applyDateFilter() {
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getDataRetentionNotification() {
    await expect(this.dataRetentionNotification).toBeVisible();
    return await this.dataRetentionNotification.textContent();
  }

  async getDisplayedDataPeriod() {
    // Calculate months between displayed start and end dates
    return await this.page.evaluate(() => {
      const startDate = new Date(document.querySelector('[data-start-date]').getAttribute('data-start-date'));
      const endDate = new Date(document.querySelector('[data-end-date]').getAttribute('data-end-date'));
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
      return months;
    });
  }

  async selectMonth(month) {
    await this.monthSelector.selectOption({ label: month });
    await this.page.waitForLoadState('networkidle');
  }

  async getDisplayedMonth() {
    const selectedOption = await this.monthSelector.locator('option[selected]').textContent();
    return selectedOption;
  }

  async selectComparisonMonth(month) {
    await this.comparisonDropdown.selectOption({ label: month });
    await this.page.waitForLoadState('networkidle');
  }
};
