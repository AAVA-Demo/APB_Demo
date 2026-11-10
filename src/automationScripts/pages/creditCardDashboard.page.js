const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard Header and Navigation
    this.dashboardHeader = page.locator('[data-testid="dashboard-header"]');
    this.analyticsLink = page.locator('[data-testid="analytics-link"]');
    this.multiCardLink = page.locator('[data-testid="multi-card-link"]');
    this.categoryAnalysisLink = page.locator('[data-testid="category-analysis-link"]');
    this.comparisonLink = page.locator('[data-testid="comparison-link"]');
    
    // KPI Dashboard Elements
    this.kpiContainer = page.locator('[data-testid="kpi-container"]');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.lastUpdateTimestamp = page.locator('[data-testid="last-update-timestamp"]');
    this.noCardDataMessage = page.locator('[data-testid="no-card-data-message"]');
    this.linkCardButton = page.locator('[data-testid="link-card-button"]');
    
    // Analytics Elements
    this.analyticsHeader = page.locator('[data-testid="analytics-header"]');
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.chartXAxis = page.locator('[data-testid="chart-x-axis"]');
    this.chartYAxis = page.locator('[data-testid="chart-y-axis"]');
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.dateRangeFilter = page.locator('[data-testid="date-range-filter"]');
    this.dateRangeStartInput = page.locator('[data-testid="date-range-start"]');
    this.dateRangeEndInput = page.locator('[data-testid="date-range-end"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    this.clearFilterButton = page.locator('[data-testid="clear-filter-button"]');
    this.spikeIndicator = page.locator('[data-testid="spike-indicator"]');
    
    // Multi-Card Management Elements
    this.cardContainer = page.locator('[data-testid="card-container"]');
    this.cardTile = page.locator('[data-testid="card-tile"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.retryButton = page.locator('[data-testid="retry-button"]');
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    
    // Category Analysis Elements
    this.categoryAnalysisHeader = page.locator('[data-testid="category-analysis-header"]');
    this.categoryPieChart = page.locator('[data-testid="category-pie-chart"]');
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    
    // Card Comparison Elements
    this.comparisonHeader = page.locator('[data-testid="comparison-header"]');
    this.comparisonTable = page.locator('[data-testid="comparison-table"]');
    this.comparisonRequirementMessage = page.locator('[data-testid="comparison-requirement-message"]');
    this.singleCardAnalysis = page.locator('[data-testid="single-card-analysis"]');
    this.highestUtilizationBadge = page.locator('[data-testid="highest-utilization-badge"]');
    this.lowestUtilizationBadge = page.locator('[data-testid="lowest-utilization-badge"]');
    
    // Responsive Layout Elements
    this.mobileLayout = page.locator('[data-testid="mobile-layout"]');
    this.tabletLayout = page.locator('[data-testid="tablet-layout"]');
    this.screenSizeWarning = page.locator('[data-testid="screen-size-warning"]');
  }

  // Navigation Methods
  async navigateToSpendingAnalytics() {
    await this.analyticsLink.waitFor({ state: 'visible' });
    await this.analyticsLink.click();
    await this.analyticsHeader.waitFor({ state: 'visible' });
  }

  async navigateToMultiCardManagement() {
    await this.multiCardLink.waitFor({ state: 'visible' });
    await this.multiCardLink.click();
    await this.cardContainer.waitFor({ state: 'visible', timeout: 2000 });
  }

  async navigateToCategoryAnalysis() {
    await this.categoryAnalysisLink.waitFor({ state: 'visible' });
    await this.categoryAnalysisLink.click();
    await this.categoryAnalysisHeader.waitFor({ state: 'visible' });
  }

  async navigateToCardComparison() {
    await this.comparisonLink.waitFor({ state: 'visible' });
    await this.comparisonLink.click();
    await this.comparisonHeader.waitFor({ state: 'visible' });
  }

  // KPI Dashboard Methods
  async getKPIValue(kpiName) {
    const kpiLocator = this.page.locator(`[data-testid="kpi-${kpiName.toLowerCase().replace(/\s+/g, '-')}"] [data-testid="kpi-value"]`);
    await kpiLocator.waitFor({ state: 'visible' });
    return await kpiLocator.textContent();
  }

  async getLastUpdateTimestamp() {
    await this.lastUpdateTimestamp.waitFor({ state: 'visible' });
    return await this.lastUpdateTimestamp.textContent();
  }

  async refreshDashboard() {
    const refreshButton = this.page.locator('[data-testid="refresh-button"]');
    await refreshButton.waitFor({ state: 'visible' });
    await refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Analytics Chart Methods
  async getChartDataPoints() {
    const dataPoints = await this.page.locator('[data-testid="chart-data-point"]').allTextContents();
    return dataPoints;
  }

  async hoverOverDataPoint(monthLabel) {
    const dataPoint = this.page.locator(`[data-testid="chart-data-point"][data-month="${monthLabel}"]`);
    await dataPoint.waitFor({ state: 'visible' });
    await dataPoint.hover();
    await this.chartTooltip.waitFor({ state: 'visible' });
  }

  async applyDateRangeFilter(startMonth, endMonth) {
    await this.dateRangeFilter.waitFor({ state: 'visible' });
    await this.dateRangeFilter.click();
    await this.dateRangeStartInput.fill(startMonth);
    await this.dateRangeEndInput.fill(endMonth);
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async applyCustomDateRange(startDate, endDate) {
    await this.dateRangeFilter.waitFor({ state: 'visible' });
    await this.dateRangeFilter.click();
    await this.dateRangeStartInput.fill(startDate);
    await this.dateRangeEndInput.fill(endDate);
    await this.applyFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clearDateFilter() {
    await this.clearFilterButton.waitFor({ state: 'visible' });
    await this.clearFilterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getHighlightedSpike() {
    const highlightedPoint = this.page.locator('[data-testid="chart-data-point"][data-highlighted="true"]');
    await highlightedPoint.waitFor({ state: 'visible' });
    return await highlightedPoint.getAttribute('data-month');
  }

  async getChartSegments() {
    const segments = await this.page.locator('[data-testid="chart-segment"]').all();
    return segments;
  }

  // Multi-Card Management Methods
  async getCardCount() {
    await this.cardContainer.waitFor({ state: 'visible' });
    const cards = await this.cardTile.all();
    return cards.length;
  }

  async getCardNames() {
    const cardNames = await this.page.locator('[data-testid="card-name"]').allTextContents();
    return cardNames;
  }

  async getCardDetails(cardName) {
    const cardLocator = this.page.locator(`[data-testid="card-tile"][data-card-name="${cardName}"]`);
    await cardLocator.waitFor({ state: 'visible' });
    
    const creditLimit = await cardLocator.locator('[data-testid="card-credit-limit"]').textContent();
    const balance = await cardLocator.locator('[data-testid="card-balance"]').textContent();
    const available = await cardLocator.locator('[data-testid="card-available"]').textContent();
    const utilization = await cardLocator.locator('[data-testid="card-utilization"]').textContent();
    
    return { creditLimit, balance, available, utilization };
  }

  async getAllCardsData() {
    const cards = await this.cardTile.all();
    const cardsData = [];
    
    for (const card of cards) {
      const creditLimit = await card.locator('[data-testid="card-credit-limit"]').textContent();
      const balance = await card.locator('[data-testid="card-balance"]').textContent();
      const utilization = await card.locator('[data-testid="card-utilization"]').textContent();
      cardsData.push({ creditLimit, balance, utilization });
    }
    
    return cardsData;
  }

  async getCardUtilization(cardName) {
    const cardLocator = this.page.locator(`[data-testid="card-tile"][data-card-name="${cardName}"]`);
    await cardLocator.waitFor({ state: 'visible' });
    return await cardLocator.locator('[data-testid="card-utilization"]').textContent();
  }

  async getCardAvailableCredit(cardName) {
    const cardLocator = this.page.locator(`[data-testid="card-tile"][data-card-name="${cardName}"]`);
    await cardLocator.waitFor({ state: 'visible' });
    return await cardLocator.locator('[data-testid="card-available"]').textContent();
  }

  async simulateTransaction(cardName, amount) {
    // This method would interact with a transaction simulation feature
    const transactionButton = this.page.locator('[data-testid="simulate-transaction-button"]');
    await transactionButton.waitFor({ state: 'visible' });
    await transactionButton.click();
    
    const cardSelect = this.page.locator('[data-testid="transaction-card-select"]');
    await cardSelect.selectOption({ label: cardName });
    
    const amountInput = this.page.locator('[data-testid="transaction-amount-input"]');
    await amountInput.fill(amount.toString());
    
    const submitButton = this.page.locator('[data-testid="submit-transaction-button"]');
    await submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Category Analysis Methods
  async getAllCategories() {
    const categories = await this.page.locator('[data-testid="category-name"]').allTextContents();
    return categories;
  }

  async getCategoryAmount(categoryName) {
    const categoryLocator = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await categoryLocator.waitFor({ state: 'visible' });
    return await categoryLocator.locator('[data-testid="category-amount"]').textContent();
  }

  async getCategoryPercentage(categoryName) {
    const categoryLocator = this.page.locator(`[data-testid="category-item"][data-category="${categoryName}"]`);
    await categoryLocator.waitFor({ state: 'visible' });
    return await categoryLocator.locator('[data-testid="category-percentage"]').textContent();
  }

  async getAllCategoryData() {
    const categories = await this.categoryItem.all();
    const categoryData = {};
    
    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      const amount = await category.locator('[data-testid="category-amount"]').textContent();
      const percentage = await category.locator('[data-testid="category-percentage"]').textContent();
      categoryData[name] = { amount, percentage };
    }
    
    return categoryData;
  }

  async getAllCategoryPercentages() {
    const categories = await this.categoryItem.all();
    const percentages = {};
    
    for (const category of categories) {
      const name = await category.locator('[data-testid="category-name"]').textContent();
      const percentage = await category.locator('[data-testid="category-percentage"]').textContent();
      percentages[name] = percentage;
    }
    
    return percentages;
  }

  async calculateTotalFromCategories() {
    const categoryData = await this.getAllCategoryData();
    let total = 0;
    
    for (const category in categoryData) {
      const amountStr = categoryData[category].amount.replace(/[$,]/g, '');
      total += parseFloat(amountStr);
    }
    
    return total;
  }

  async calculateTotalPercentage() {
    const percentages = await this.getAllCategoryPercentages();
    let total = 0;
    
    for (const category in percentages) {
      const percentStr = percentages[category].replace('%', '');
      total += parseFloat(percentStr);
    }
    
    return total;
  }

  async getTotalSpending() {
    const totalLocator = this.page.locator('[data-testid="total-spending"]');
    await totalLocator.waitFor({ state: 'visible' });
    return await totalLocator.textContent();
  }

  // Card Comparison Methods
  async getComparedCards() {
    const cardNames = await this.page.locator('[data-testid="comparison-card-name"]').allTextContents();
    return cardNames;
  }

  async getOptimalCardForCategory(categoryName) {
    const optimalCardLocator = this.page.locator(`[data-testid="optimal-card"][data-category="${categoryName}"]`);
    await optimalCardLocator.waitFor({ state: 'visible' });
    return await optimalCardLocator.textContent();
  }

  async getCardUtilizationInComparison(cardName) {
    const cardRow = this.page.locator(`[data-testid="comparison-row"][data-card="${cardName}"]`);
    await cardRow.waitFor({ state: 'visible' });
    return await cardRow.locator('[data-testid="comparison-utilization"]').textContent();
  }

  async getHighlightedCard(type) {
    const highlightedLocator = this.page.locator(`[data-testid="${type}-utilization-card"]`);
    await highlightedLocator.waitFor({ state: 'visible' });
    return await highlightedLocator.textContent();
  }

  async getCategoryBreakdown(cardName) {
    const cardRow = this.page.locator(`[data-testid="comparison-row"][data-card="${cardName}"]`);
    await cardRow.waitFor({ state: 'visible' });
    await cardRow.locator('[data-testid="expand-breakdown"]').click();
    
    const breakdownItems = await this.page.locator(`[data-testid="breakdown-item"][data-card="${cardName}"]`).all();
    const breakdown = {};
    
    for (const item of breakdownItems) {
      const category = await item.locator('[data-testid="breakdown-category"]').textContent();
      const amount = await item.locator('[data-testid="breakdown-amount"]').textContent();
      breakdown[category] = amount;
    }
    
    return breakdown;
  }

  async refreshComparison() {
    const refreshButton = this.page.locator('[data-testid="refresh-comparison-button"]');
    await refreshButton.waitFor({ state: 'visible' });
    await refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Responsive Layout Methods
  async getKPILayout() {
    const layoutAttr = await this.kpiContainer.getAttribute('data-layout');
    return layoutAttr;
  }

  async checkForOverlappingContent() {
    // This method checks if any content is overlapping by comparing bounding boxes
    const elements = await this.page.locator('[data-testid="kpi-card"]').all();
    
    for (let i = 0; i < elements.length; i++) {
      const box1 = await elements[i].boundingBox();
      for (let j = i + 1; j < elements.length; j++) {
        const box2 = await elements[j].boundingBox();
        if (this.isOverlapping(box1, box2)) {
          return true;
        }
      }
    }
    
    return false;
  }

  isOverlapping(box1, box2) {
    return !(box1.x + box1.width < box2.x || 
             box2.x + box2.width < box1.x || 
             box1.y + box1.height < box2.y || 
             box2.y + box2.height < box1.y);
  }

  async isContentScrollable() {
    const scrollHeight = await this.page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await this.page.evaluate(() => document.documentElement.clientHeight);
    return scrollHeight > clientHeight;
  }

  async canNavigateToAnalytics() {
    try {
      await this.analyticsLink.waitFor({ state: 'visible', timeout: 5000 });
      return await this.analyticsLink.isEnabled();
    } catch (error) {
      return false;
    }
  }
};