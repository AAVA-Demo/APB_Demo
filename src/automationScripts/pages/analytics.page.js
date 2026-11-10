const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation and authentication locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.analyticsLink = page.locator('a[href*="analytics"], a:has-text("Analytics")');
    
    // Analytics view selection
    this.analyticsViewSelector = page.locator('select[data-testid="analytics-view"], #analyticsView');
    
    // Category chart locators
    this.categoryChart = page.locator('.category-chart, [data-testid="category-chart"], canvas#categoryChart');
    this.categoryLabel = page.locator('.category-label, [data-testid="category-label"]');
    this.categoryTooltip = page.locator('.category-tooltip, [data-testid="category-tooltip"]');
    this.drillDownModal = page.locator('.drill-down-modal, [data-testid="drill-down-modal"]');
    this.closeDrillDownButton = page.locator('button[data-testid="close-drill-down"], .modal-close');
    
    // Trend chart locators
    this.trendChart = page.locator('.trend-chart, [data-testid="trend-chart"], canvas#trendChart');
    this.trendLine = page.locator('.trend-line, [data-testid="trend-line"]');
    this.monthDataPoint = page.locator('.month-data-point, [data-testid="month-data-point"]');
    
    // Message locators
    this.insufficientDataMessage = page.locator('.insufficient-data-message, [data-testid="insufficient-data-message"]');
    this.dataAvailabilityNote = page.locator('.data-availability-note, [data-testid="data-availability-note"]');
    
    // Data display locators
    this.totalSpendingDisplay = page.locator('.total-spending, [data-testid="total-spending"]');
    this.categoryPercentage = page.locator('.category-percentage, [data-testid="category-percentage"]');
    this.chartLegend = page.locator('.chart-legend, [data-testid="chart-legend"]');
  }

  async navigate() {
    logger.info('Navigating to application home page');
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/.*/);
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to Analytics page');
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectAnalyticsView(viewName) {
    logger.info(`Selecting analytics view: ${viewName}`);
    await this.analyticsViewSelector.selectOption({ label: viewName });
    await this.page.waitForLoadState('networkidle');
  }

  async getChartCategories() {
    const labels = await this.page.locator('.category-label, [data-label]').allTextContents();
    return labels.map(label => label.trim());
  }

  async getCategorySpendingData() {
    const categoryData = {};
    const categories = await this.getChartCategories();
    
    for (const category of categories) {
      const amount = await this.getCategorySpending(category);
      categoryData[category] = amount;
    }
    
    return categoryData;
  }

  async getCategorySpending(categoryName) {
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    await expect(categoryElement).toBeVisible();
    const amountElement = categoryElement.locator('.amount, [data-testid="category-amount"]');
    const text = await amountElement.textContent();
    return text.trim();
  }

  async getCategoryPercentage(categoryName) {
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    await expect(categoryElement).toBeVisible();
    const percentageElement = categoryElement.locator('.percentage, [data-testid="category-percentage"]');
    const text = await percentageElement.textContent();
    return text.trim();
  }

  async getCategoryStyle(categoryName) {
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    const style = await categoryElement.getAttribute('class');
    return style;
  }

  async getTotalSpending() {
    await expect(this.totalSpendingDisplay).toBeVisible();
    const text = await this.totalSpendingDisplay.textContent();
    return text.trim();
  }

  async clickCategory(categoryName) {
    logger.info(`Clicking on category: ${categoryName}`);
    const categoryElement = this.page.locator(`[data-category="${categoryName}"], .category-item:has-text("${categoryName}")`);
    await categoryElement.click();
  }

  async getDrillDownTransactions() {
    await expect(this.drillDownModal).toBeVisible();
    const rows = await this.drillDownModal.locator('.transaction-row, tbody tr').all();
    const transactions = [];
    
    for (const row of rows) {
      const date = await row.locator('td:nth-child(1)').textContent();
      const merchant = await row.locator('td:nth-child(2)').textContent();
      const amount = await row.locator('td:nth-child(3)').textContent();
      const category = await row.locator('td:nth-child(4)').textContent();
      const cardNumber = await row.locator('td:nth-child(5)').textContent();
      
      transactions.push({
        date: date.trim(),
        merchant: merchant.trim(),
        amount: amount.trim(),
        category: category.trim(),
        cardNumber: cardNumber.trim()
      });
    }
    
    return transactions;
  }

  async getDrillDownTotal() {
    await expect(this.drillDownModal).toBeVisible();
    const totalElement = this.drillDownModal.locator('.drill-down-total, [data-testid="drill-down-total"]');
    const text = await totalElement.textContent();
    return text.trim();
  }

  async closeDrillDown() {
    logger.info('Closing drill-down modal');
    await this.closeDrillDownButton.click();
    await expect(this.drillDownModal).not.toBeVisible();
  }

  async getXAxisMonths() {
    const monthElements = await this.page.locator('.x-axis-label, [data-testid="x-axis-month"]').allTextContents();
    return monthElements.map(month => month.trim());
  }

  async getYAxisLabel() {
    const yAxisLabel = await this.page.locator('.y-axis-label, [data-testid="y-axis-label"]').textContent();
    return yAxisLabel.trim();
  }

  async getTrendLines() {
    const trendLines = await this.trendLine.all();
    const lineData = [];
    
    for (const line of trendLines) {
      const card = await line.getAttribute('data-card');
      lineData.push({ card });
    }
    
    return lineData;
  }

  async clickMonthDataPoint(month) {
    logger.info(`Clicking on month data point: ${month}`);
    const monthPoint = this.page.locator(`[data-month="${month}"], .month-data-point:has-text("${month}")`);
    await monthPoint.click();
  }

  async getHighlightedMonth() {
    const highlightedElement = await this.page.locator('.month-highlighted, [data-highlighted="true"]');
    const month = await highlightedElement.getAttribute('data-month');
    return month;
  }

  async getAvailableMonths() {
    const months = await this.page.locator('.available-month, [data-testid="available-month"]').allTextContents();
    return months.map(month => month.trim());
  }

  async getCardTrendData(cardNumber) {
    const trendLine = this.page.locator(`[data-card="${cardNumber}"]`);
    const dataPoints = await trendLine.locator('.data-point, [data-testid="data-point"]').all();
    const trendData = [];
    
    for (const point of dataPoints) {
      const month = await point.getAttribute('data-month');
      const value = await point.getAttribute('data-value');
      trendData.push({ month, value });
    }
    
    return trendData;
  }

  async getOverlappingMonthsData() {
    const overlappingMonths = [];
    const months = await this.getXAxisMonths();
    
    for (const month of months) {
      const cardAData = await this.page.locator(`[data-card="****1234"][data-month="${month}"]`).count();
      const cardBData = await this.page.locator(`[data-card="****5678"][data-month="${month}"]`).count();
      
      if (cardAData > 0 && cardBData > 0) {
        overlappingMonths.push({ month, cardA: true, cardB: true });
      }
    }
    
    return overlappingMonths;
  }

  async getCardLegend(cardNumber) {
    const legendItem = this.page.locator(`[data-legend-card="${cardNumber}"], .legend-item:has-text("${cardNumber}")`);
    await expect(legendItem).toBeVisible();
    const text = await legendItem.textContent();
    return text.trim();
  }

};