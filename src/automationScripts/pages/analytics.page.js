const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Locators for analytics page elements
    this.analyticsContainer = page.locator('[data-testid="analytics-container"]');
    this.categoryBreakdownSection = page.locator('[data-testid="category-breakdown-section"]');
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.trendAnalysisSection = page.locator('[data-testid="trend-analysis-section"]');
    this.trendGraph = page.locator('[data-testid="trend-graph"]');
    
    // Category data locators
    this.categoryName = page.locator('[data-testid="category-name"]');
    this.categoryAmount = page.locator('[data-testid="category-amount"]');
    this.categoryPercentage = page.locator('[data-testid="category-percentage"]');
    
    // Trend data locators
    this.monthLabel = page.locator('[data-testid="month-label"]');
    this.monthAmount = page.locator('[data-testid="month-amount"]');
    this.trendDataPoint = page.locator('[data-testid="trend-data-point"]');
    
    // Interactive features locators
    this.graphTooltip = page.locator('[data-testid="graph-tooltip"]');
    this.zoomControl = page.locator('[data-testid="zoom-control"]');
    this.panControl = page.locator('[data-testid="pan-control"]');
    
    // Message and error locators
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.errorMessageContainer = page.locator('[data-testid="error-message"]');
    this.limitedDataMessage = page.locator('[data-testid="limited-data-message"]');
    this.timeoutError = page.locator('[data-testid="timeout-error"]');
    this.totalSpendDisplay = page.locator('[data-testid="total-spend"]');
    
    // Authentication elements
    this.usernameInput = page.locator('#username');
    this.authTokenInput = page.locator('#auth-token');
    this.loginButton = page.locator('[data-testid="login-button"]');
  }

  async authenticateUser(userId, authToken) {
    logger.info(`Authenticating user: ${userId}`);
    await this.page.goto('/login');
    await expect(this.usernameInput).toBeVisible();
    
    await this.usernameInput.fill(userId);
    await this.authTokenInput.fill(authToken);
    await this.loginButton.click();
    
    await this.page.waitForURL(/.*analytics|dashboard/, { timeout: 5000 });
    logger.info('User authentication completed successfully');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/analytics');
    await expect(this.analyticsContainer).toBeVisible({ timeout: 10000 });
    logger.info('Analytics page loaded');
  }

  async waitForSpendingDataLoad(options = {}) {
    logger.info('Waiting for spending data to load');
    const timeout = options.timeout || 5000;
    await this.categoryBreakdownSection.waitFor({ state: 'visible', timeout });
    logger.info('Spending data loaded successfully');
  }

  async getCategoryBreakdown() {
    logger.info('Retrieving category breakdown data');
    const categoryCount = await this.categoryItem.count();
    const categories = [];
    
    for (let i = 0; i < categoryCount; i++) {
      const categoryElement = this.categoryItem.nth(i);
      const name = await categoryElement.locator('[data-testid="category-name"]').textContent();
      const amountText = await categoryElement.locator('[data-testid="category-amount"]').textContent();
      const percentageText = await categoryElement.locator('[data-testid="category-percentage"]').textContent();
      
      categories.push({
        category: name.trim(),
        amount: parseFloat(amountText.replace(/[^0-9.]/g, '')),
        percentage: parseFloat(percentageText.replace(/[^0-9.]/g, ''))
      });
    }
    
    logger.info(`Retrieved ${categories.length} category breakdown items`);
    return categories;
  }

  async getNoDataMessage() {
    logger.info('Retrieving no data message');
    await expect(this.noDataMessage).toBeVisible({ timeout: 5000 });
    const messageText = await this.noDataMessage.textContent();
    logger.info(`No data message: ${messageText}`);
    return messageText;
  }

  async getTotalSpend() {
    logger.info('Retrieving total spend');
    const totalSpendText = await this.totalSpendDisplay.textContent();
    const totalSpend = parseFloat(totalSpendText.replace(/[^0-9.]/g, ''));
    logger.info(`Total spend: ${totalSpend}`);
    return totalSpend;
  }

  async getErrorMessage() {
    logger.info('Retrieving error message');
    await expect(this.errorMessageContainer).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessageContainer.textContent();
    logger.info(`Error message: ${errorText}`);
    return errorText;
  }

  async navigateToTrendAnalysis() {
    logger.info('Navigating to trend analysis section');
    await this.trendAnalysisSection.scrollIntoViewIfNeeded();
    await expect(this.trendAnalysisSection).toBeVisible({ timeout: 5000 });
    logger.info('Trend analysis section visible');
  }

  async waitForTrendGraphRender(options = {}) {
    logger.info('Waiting for trend graph to render');
    const timeout = options.timeout || 5000;
    await this.trendGraph.waitFor({ state: 'visible', timeout });
    await this.trendDataPoint.first().waitFor({ state: 'visible', timeout });
    logger.info('Trend graph rendered successfully');
  }

  async getMonthlyTrendData() {
    logger.info('Retrieving monthly trend data');
    const dataPointCount = await this.trendDataPoint.count();
    const trendData = [];
    
    for (let i = 0; i < dataPointCount; i++) {
      const dataPoint = this.trendDataPoint.nth(i);
      const month = await dataPoint.getAttribute('data-month');
      const amountText = await dataPoint.getAttribute('data-amount');
      
      trendData.push({
        month: month,
        amount: parseFloat(amountText)
      });
    }
    
    logger.info(`Retrieved ${trendData.length} monthly trend data points`);
    return trendData;
  }

  async verifyInteractiveGraphFeatures() {
    logger.info('Verifying interactive graph features');
    
    // Check for tooltip on hover
    await this.trendDataPoint.first().hover();
    const tooltipVisible = await this.graphTooltip.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Check for zoom control
    const zoomVisible = await this.zoomControl.isVisible().catch(() => false);
    
    // Check for pan control
    const panVisible = await this.panControl.isVisible().catch(() => false);
    
    const hasInteractiveFeatures = tooltipVisible || zoomVisible || panVisible;
    logger.info(`Interactive features present: ${hasInteractiveFeatures}`);
    return hasInteractiveFeatures;
  }

  async getLimitedDataMessage() {
    logger.info('Retrieving limited data message');
    await expect(this.limitedDataMessage).toBeVisible({ timeout: 5000 });
    const messageText = await this.limitedDataMessage.textContent();
    logger.info(`Limited data message: ${messageText}`);
    return messageText;
  }

  async getTimeoutError() {
    logger.info('Retrieving timeout error');
    await expect(this.timeoutError).toBeVisible({ timeout: 5000 });
    const errorText = await this.timeoutError.textContent();
    logger.info(`Timeout error: ${errorText}`);
    return errorText;
  }
};