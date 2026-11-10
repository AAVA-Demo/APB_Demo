const { expect } = require('@playwright/test');

exports.TrendsAnalysisPage = class TrendsAnalysisPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.cardwiseAnalysisLink = page.locator('[data-testid="cardwise-analysis-link"]');
    this.trendsDashboardLink = page.locator('[data-testid="trends-dashboard-link"]');
    
    // Chart Locators
    this.barChart = page.locator('[data-testid="cardwise-bar-chart"]');
    this.lineChart = page.locator('[data-testid="monthly-trends-line-chart"]');
    this.trendLine = page.locator('[data-testid="trend-line"]');
    
    // Card-wise Analysis Locators
    this.cardBars = page.locator('[data-testid="card-bar"]');
    this.cardLabels = page.locator('[data-testid="card-label"]');
    this.cardTotalSpendingLabels = page.locator('[data-testid="card-total-spending"]');
    this.cardTransactionCountLabels = page.locator('[data-testid="card-transaction-count"]');
    this.cardAverageValueLabels = page.locator('[data-testid="card-average-value"]');
    
    // Monthly Trends Locators
    this.monthDataPoints = page.locator('[data-testid="month-data-point"]');
    this.monthLabels = page.locator('[data-testid="month-label"]');
    this.monthSpendingValues = page.locator('[data-testid="month-spending-value"]');
    this.monthChangeIndicators = page.locator('[data-testid="month-change-indicator"]');
    this.monthHighlights = page.locator('[data-testid="month-highlight"]');
    
    // Filter Locators
    this.dateRangeStartInput = page.locator('[data-testid="date-range-start"]');
    this.dateRangeEndInput = page.locator('[data-testid="date-range-end"]');
    this.applyDateRangeButton = page.locator('[data-testid="apply-date-range-btn"]');
    
    // Message Locators
    this.insufficientCardsMessage = page.locator('[data-testid="insufficient-cards-message"]');
    this.addAnotherCardButton = page.locator('[data-testid="add-another-card-btn"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.dataRecommendationMessage = page.locator('[data-testid="data-recommendation-message"]');
    this.insufficientDataDisclaimer = page.locator('[data-testid="insufficient-data-disclaimer"]');
    
    // Insight Locators
    this.trendIndicator = page.locator('[data-testid="trend-indicator"]');
    this.seasonalPatternInsight = page.locator('[data-testid="seasonal-pattern-insight"]');
    
    // Dashboard Card Info Locators
    this.dashboardCardTiles = page.locator('[data-testid="card-tile"]');
    
    // Loading Indicator
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCardwiseAnalysis() {
    await this.cardwiseAnalysisLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTrendsDashboard() {
    await this.trendsDashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCardNamesInChart() {
    const names = [];
    const labelElements = await this.cardLabels.all();
    for (const element of labelElements) {
      names.push(await element.textContent());
    }
    return names;
  }

  async getCardTotalSpending(cardName) {
    const cardRow = this.page.locator(`[data-testid="card-row"][data-card="${cardName}"]`);
    await expect(cardRow).toBeVisible();
    const spendingElement = cardRow.locator('[data-testid="card-total-spending"]');
    return await spendingElement.textContent();
  }

  async getCardTransactionCount(cardName) {
    const cardRow = this.page.locator(`[data-testid="card-row"][data-card="${cardName}"]`);
    await expect(cardRow).toBeVisible();
    const countElement = cardRow.locator('[data-testid="card-transaction-count"]');
    const text = await countElement.textContent();
    return parseInt(text, 10);
  }

  async getCardAverageTransactionValue(cardName) {
    const cardRow = this.page.locator(`[data-testid="card-row"][data-card="${cardName}"]`);
    await expect(cardRow).toBeVisible();
    const avgElement = cardRow.locator('[data-testid="card-average-value"]');
    return await avgElement.textContent();
  }

  async getActiveCardCountFromDashboard() {
    return await this.dashboardCardTiles.count();
  }

  async getActiveCardNamesFromDashboard() {
    const names = [];
    const cardElements = await this.dashboardCardTiles.all();
    for (const element of cardElements) {
      const nameElement = element.locator('[data-testid="card-name"]');
      names.push(await nameElement.textContent());
    }
    return names;
  }

  async applyDateRangeFilter(startDate, endDate) {
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyDateRangeButton.click();
  }

  async waitForChartUpdate() {
    await this.page.waitForTimeout(1000); // Brief wait for chart animation
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransactionHistory(minMonths) {
    const historyMonths = await this.getMonthsOfTransactionHistory();
    return historyMonths >= minMonths;
  }

  async getMonthsOfTransactionHistory() {
    const historyIndicator = this.page.locator('[data-testid="transaction-history-months"]');
    await expect(historyIndicator).toBeVisible();
    const text = await historyIndicator.textContent();
    return parseInt(text, 10);
  }

  async getMonthlyDataPointCount() {
    return await this.monthDataPoints.count();
  }

  async getMonthLabels() {
    const labels = [];
    const labelElements = await this.monthLabels.all();
    for (const element of labelElements) {
      labels.push(await element.textContent());
    }
    return labels;
  }

  async getMonthlySpending(monthLabel) {
    const monthRow = this.page.locator(`[data-testid="month-row"][data-month="${monthLabel}"]`);
    await expect(monthRow).toBeVisible();
    const spendingElement = monthRow.locator('[data-testid="month-spending-value"]');
    return await spendingElement.textContent();
  }

  async getTrendIndicator() {
    await expect(this.trendIndicator).toBeVisible();
    return await this.trendIndicator.textContent();
  }

  async isMonthHighlighted(monthName) {
    const highlight = this.page.locator(`[data-testid="month-highlight"][data-month="${monthName}"]`);
    return await highlight.isVisible();
  }

  async getMonthOverMonthChange(monthLabel) {
    const monthRow = this.page.locator(`[data-testid="month-row"][data-month="${monthLabel}"]`);
    await expect(monthRow).toBeVisible();
    const changeElement = monthRow.locator('[data-testid="month-change-indicator"]');
    return await changeElement.textContent();
  }

  async getChangeIndicatorType(monthLabel) {
    const monthRow = this.page.locator(`[data-testid="month-row"][data-month="${monthLabel}"]`);
    await expect(monthRow).toBeVisible();
    const changeElement = monthRow.locator('[data-testid="month-change-indicator"]');
    const classAttribute = await changeElement.getAttribute('class');
    if (classAttribute.includes('increase') || classAttribute.includes('up')) {
      return 'increase';
    } else if (classAttribute.includes('decrease') || classAttribute.includes('down')) {
      return 'decrease';
    }
    return 'neutral';
  }
};