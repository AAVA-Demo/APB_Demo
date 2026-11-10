const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CategorySpendingPage = class CategorySpendingPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.analyticsMenu = page.locator('a[href*="analytics"]');
    this.categorySpendingLink = page.locator('text=Category-wise Spending');
    this.pieChart = page.locator('canvas#categoryChart, [data-testid="category-chart"]');
    this.chartSegments = page.locator('.chart-segment, [data-category]');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-message');
    this.errorMessage = page.locator('.error-message, [role="alert"]');
    this.dashboardLink = page.locator('a[href*="dashboard"]');
    this.cardManagementLink = page.locator('a[href*="cards"]');
    this.periodFilter = page.locator('select#period-filter, [data-testid="period-filter"]');
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list');
    this.transactionItems = page.locator('.transaction-item, [data-testid="transaction-item"]');
    this.chartLegend = page.locator('.chart-legend, [data-testid="chart-legend"]');
    this.categoryLabels = page.locator('.category-label, [data-category-name]');
  }

  async navigate() {
    logger.info('Navigating to Analytics page');
    await this.page.goto('/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForSelector('[data-testid="dashboard"], .dashboard-container', { timeout: 5000 });
  }

  async navigateToAnalytics() {
    logger.info('Navigating to Spending Analytics');
    await this.analyticsMenu.click();
    await this.categorySpendingLink.click();
  }

  async waitForPageLoad(timeout = 3000) {
    logger.info(`Waiting for page load with timeout: ${timeout}ms`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(timeout);
  }

  async waitForChartRender() {
    logger.info('Waiting for chart to render');
    await this.pieChart.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getCategoryCount() {
    logger.info('Getting category count');
    const count = await this.chartSegments.count();
    if (count === 0) {
      // Fallback to legend items
      const legendItems = await this.categoryLabels.count();
      return legendItems;
    }
    return count;
  }

  async getCategoryLabels() {
    logger.info('Getting category labels');
    const labels = await this.categoryLabels.allTextContents();
    return labels;
  }

  async getCategorySpendData() {
    logger.info('Getting category spend data');
    const data = {};
    const labels = await this.getCategoryLabels();
    
    for (const label of labels) {
      const valueLocator = this.page.locator(`[data-category="${label}"] .spend-value, [data-category-name="${label}"] + .spend-amount`);
      const valueText = await valueLocator.textContent();
      const value = parseFloat(valueText.replace(/[^0-9.]/g, ''));
      data[label] = value;
    }
    
    return data;
  }

  async clickCategorySegment(categoryName) {
    logger.info(`Clicking on category segment: ${categoryName}`);
    const segment = this.page.locator(`[data-category="${categoryName}"], [aria-label*="${categoryName}"]`);
    await segment.click();
  }

  async waitForTransactionListLoad() {
    logger.info('Waiting for transaction list to load');
    await this.transactionList.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getTransactionCount() {
    logger.info('Getting transaction count');
    return await this.transactionItems.count();
  }

  async getEmptyStateMessage() {
    logger.info('Getting empty state message');
    await this.emptyStateMessage.waitFor({ state: 'visible', timeout: 3000 });
    return await this.emptyStateMessage.textContent();
  }

  async isChartVisible() {
    logger.info('Checking if chart is visible');
    try {
      await this.pieChart.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasErrorMessages() {
    logger.info('Checking for error messages');
    const count = await this.errorMessage.count();
    return count > 0;
  }

  async isDashboardLinkActive() {
    logger.info('Checking if dashboard link is active');
    const isEnabled = await this.dashboardLink.isEnabled();
    const isVisible = await this.dashboardLink.isVisible();
    return isEnabled && isVisible;
  }

  async isCardManagementLinkActive() {
    logger.info('Checking if card management link is active');
    const isEnabled = await this.cardManagementLink.isEnabled();
    const isVisible = await this.cardManagementLink.isVisible();
    return isEnabled && isVisible;
  }

  async getSelectedPeriod() {
    logger.info('Getting selected period');
    const selectedOption = await this.periodFilter.locator('option[selected]').textContent();
    return selectedOption.trim();
  }

  async selectPeriodFilter(period) {
    logger.info(`Selecting period filter: ${period}`);
    await this.periodFilter.selectOption({ label: period });
  }

  async waitForChartUpdate(timeout = 3000) {
    logger.info(`Waiting for chart update with timeout: ${timeout}ms`);
    await this.page.waitForTimeout(timeout);
    await this.waitForChartRender();
  }
};
