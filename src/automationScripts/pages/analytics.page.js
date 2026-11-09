const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.analyticsLink = page.locator('a[href*="analytics"]');
    this.spendingAnalyticsSection = page.locator('[data-testid="spending-analytics"]');
    this.spendingTrendsSection = page.locator('[data-testid="spending-trends"]');
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.categoryTooltip = page.locator('[data-testid="category-tooltip"]');
    this.categoryDetailPanel = page.locator('[data-testid="category-detail-panel"]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    this.dateRangeSelector = page.locator('[data-testid="date-range-selector"]');
    this.trendLineGraph = page.locator('[data-testid="trend-line-graph"]');
    this.trendTooltip = page.locator('[data-testid="trend-tooltip"]');
    this.trendDetailPanel = page.locator('[data-testid="trend-detail-panel"]');
    this.categorySegments = page.locator('[data-category]');
    this.trendDataPoints = page.locator('[data-month]');
  }

  async navigate() {
    await this.page.goto('https://app.creditcard.demo');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToSpendingAnalytics() {
    await this.analyticsLink.click();
    await expect(this.spendingAnalyticsSection).toBeVisible();
  }

  async navigateToSpendingTrends() {
    await this.analyticsLink.click();
    await expect(this.spendingTrendsSection).toBeVisible();
  }

  async getCategoryList() {
    const segments = await this.categorySegments.all();
    const categories = [];
    for (const segment of segments) {
      const category = await segment.getAttribute('data-category');
      categories.push(category);
    }
    return categories;
  }

  async calculateTotalPercentage() {
    const segments = await this.categorySegments.all();
    let total = 0;
    for (const segment of segments) {
      const percentageText = await segment.locator('[data-percentage]').textContent();
      const percentage = parseFloat(percentageText.replace('%', ''));
      total += percentage;
    }
    return total;
  }

  async hoverOverCategory(categoryName) {
    const segment = this.page.locator(`[data-category="${categoryName}"]`);
    await segment.hover();
  }

  async clickCategory(categoryName) {
    const segment = this.page.locator(`[data-category="${categoryName}"]`);
    await segment.click();
  }

  async getTooltipData() {
    await expect(this.categoryTooltip).toBeVisible();
    const categoryName = await this.categoryTooltip.locator('[data-testid="tooltip-category"]').textContent();
    const totalSpend = await this.categoryTooltip.locator('[data-testid="tooltip-spend"]').textContent();
    const transactionCount = await this.categoryTooltip.locator('[data-testid="tooltip-count"]').textContent();
    const percentage = await this.categoryTooltip.locator('[data-testid="tooltip-percentage"]').textContent();
    return { categoryName, totalSpend, transactionCount, percentage };
  }

  async getDetailPanelData() {
    await expect(this.categoryDetailPanel).toBeVisible();
    const categoryName = await this.categoryDetailPanel.locator('[data-testid="detail-category"]').textContent();
    const totalSpend = await this.categoryDetailPanel.locator('[data-testid="detail-spend"]').textContent();
    const transactionCount = await this.categoryDetailPanel.locator('[data-testid="detail-count"]').textContent();
    const percentage = await this.categoryDetailPanel.locator('[data-testid="detail-percentage"]').textContent();
    return { categoryName, totalSpend, transactionCount, percentage };
  }

  async closeDetailPanel() {
    const closeButton = this.categoryDetailPanel.locator('[data-testid="close-panel"]');
    await closeButton.click();
    await expect(this.categoryDetailPanel).not.toBeVisible();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async hasUserGuidance() {
    const guidanceText = await this.emptyStateMessage.textContent();
    return guidanceText.includes('perform') || guidanceText.includes('adjust');
  }

  async selectDateRange(startDate, endDate) {
    await this.dateRangeSelector.locator('[data-testid="start-date"]').fill(startDate);
    await this.dateRangeSelector.locator('[data-testid="end-date"]').fill(endDate);
    await this.dateRangeSelector.locator('[data-testid="apply-date-range"]').click();
  }

  async isDateSelectorVisible() {
    return await this.dateRangeSelector.isVisible();
  }

  async getTrendDataPoints() {
    const points = await this.trendDataPoints.all();
    return points;
  }

  async getTrendLabels() {
    const points = await this.trendDataPoints.all();
    const labels = [];
    for (const point of points) {
      const label = await point.getAttribute('data-month');
      labels.push(label);
    }
    return labels;
  }

  async verifyYAxisScale() {
    const yAxis = this.trendLineGraph.locator('[data-testid="y-axis"]');
    return await yAxis.isVisible();
  }

  async hoverOverTrendDataPoint(month) {
    const point = this.page.locator(`[data-month="${month}"]`);
    await point.hover();
  }

  async clickTrendDataPoint(month) {
    const point = this.page.locator(`[data-month="${month}"]`);
    await point.click();
  }

  async getTrendTooltipData() {
    await expect(this.trendTooltip).toBeVisible();
    const month = await this.trendTooltip.locator('[data-testid="trend-tooltip-month"]').textContent();
    const totalSpend = await this.trendTooltip.locator('[data-testid="trend-tooltip-spend"]').textContent();
    const comparison = await this.trendTooltip.locator('[data-testid="trend-tooltip-comparison"]').textContent();
    return { month, totalSpend, comparison };
  }

  async getTrendDetailData() {
    await expect(this.trendDetailPanel).toBeVisible();
    const month = await this.trendDetailPanel.locator('[data-testid="trend-detail-month"]').textContent();
    const totalSpend = await this.trendDetailPanel.locator('[data-testid="trend-detail-spend"]').textContent();
    const percentageChange = await this.trendDetailPanel.locator('[data-testid="trend-detail-change"]').textContent();
    return { month, totalSpend, percentageChange };
  }

  async closeTrendDetailPanel() {
    const closeButton = this.trendDetailPanel.locator('[data-testid="close-trend-panel"]');
    await closeButton.click();
    await expect(this.trendDetailPanel).not.toBeVisible();
  }

  async getTrendEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async hasEmptyChartElements() {
    const emptyAxes = this.trendLineGraph.locator('[data-testid="empty-axis"]');
    return await emptyAxes.count() > 0;
  }
};