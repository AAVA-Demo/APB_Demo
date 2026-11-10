const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {

  constructor(page) {
    this.page = page;
    
    // Login page locators (reused from dashboard)
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    
    // Navigation
    this.analyticsNavLink = page.locator('a[href*="analytics"], nav a:has-text("Analytics")').first();
    
    // Monthly trend chart locators
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"], .monthly-trend-chart, canvas[id*="monthly"]').first();
    this.monthlyTrendMonths = page.locator('[data-testid="month-label"], .month-label, .chart-label');
    this.monthDataPoints = page.locator('[data-testid="month-data-point"], .data-point, .chart-point');
    this.drillDownView = page.locator('[data-testid="drill-down-view"], .drill-down, .transaction-details');
    this.drillDownTransactions = page.locator('[data-testid="drill-down-transaction"], .transaction-item');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"], div:has-text("Insufficient historical data")').first();
    
    // Category chart locators
    this.categoryChart = page.locator('[data-testid="category-chart"], .category-chart, canvas[id*="category"]').first();
    this.categoryLabels = page.locator('[data-testid="category-label"], .category-label, .chart-legend-item');
    this.categoryFilterCheckboxes = page.locator('[data-testid="category-filter-checkbox"], input[type="checkbox"][name*="category"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter"], button:has-text("Apply Filter")').first();
    
    // Error and loading states
    this.analyticsErrorMessage = page.locator('[data-testid="analytics-error"], .error, .alert-danger').first();
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"], .loading, .spinner').first();
  }

  async navigate() {
    logger.info('Navigating to Credit Card Dashboard');
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    logger.info(`Logging in as user: ${username}`);
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to Analytics section');
    await expect(this.analyticsNavLink).toBeVisible({ timeout: 5000 });
    await this.analyticsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForMonthlyTrendChartToLoad() {
    logger.info('Waiting for monthly trend chart to load');
    await expect(this.monthlyTrendChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000); // Wait for chart animation to complete
  }

  async getMonthlyTrendMonths() {
    logger.info('Retrieving monthly trend months');
    await expect(this.monthlyTrendMonths.first()).toBeVisible({ timeout: 5000 });
    const count = await this.monthlyTrendMonths.count();
    const months = [];
    
    for (let i = 0; i < count; i++) {
      const monthText = await this.monthlyTrendMonths.nth(i).textContent();
      months.push(monthText.trim());
    }
    
    return months;
  }

  async clickMonthDataPoint(monthIdentifier) {
    logger.info(`Clicking on month data point: ${monthIdentifier}`);
    // Find the data point corresponding to the month
    const dataPoint = this.page.locator(`[data-month="${monthIdentifier}"], .data-point:has-text("${monthIdentifier}")`).first();
    await expect(dataPoint).toBeVisible({ timeout: 5000 });
    await dataPoint.click();
    await this.page.waitForTimeout(500); // Wait for drill-down animation
  }

  async isDrillDownViewVisible() {
    logger.info('Checking if drill-down view is visible');
    try {
      await expect(this.drillDownView).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getDrillDownTransactions() {
    logger.info('Retrieving drill-down transactions');
    await expect(this.drillDownTransactions.first()).toBeVisible({ timeout: 5000 });
    const count = await this.drillDownTransactions.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const txnElement = this.drillDownTransactions.nth(i);
      const txnText = await txnElement.textContent();
      
      // Parse transaction details from text
      const idMatch = txnText.match(/(?:txn-|ID:?\s*)([A-Za-z0-9-]+)/i);
      const merchantMatch = txnText.match(/(?:Merchant:?\s*)([A-Za-z0-9\s&]+?)(?:\s*\$|\s*Amount)/i);
      const amountMatch = txnText.match(/\$?([0-9,]+\.?[0-9]*)/i);
      const dateMatch = txnText.match(/(\d{4}-\d{2}-\d{2})/i);
      
      transactions.push({
        transactionId: idMatch ? idMatch[1] : null,
        merchant: merchantMatch ? merchantMatch[1].trim() : null,
        amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null,
        date: dateMatch ? dateMatch[1] : null
      });
    }
    
    return transactions;
  }

  async getInsufficientDataMessage() {
    logger.info('Retrieving insufficient data message');
    await expect(this.insufficientDataMessage).toBeVisible({ timeout: 5000 });
    return await this.insufficientDataMessage.textContent();
  }

  async getAnalyticsErrorMessage() {
    logger.info('Retrieving analytics error message');
    await expect(this.analyticsErrorMessage).toBeVisible({ timeout: 5000 });
    return await this.analyticsErrorMessage.textContent();
  }

  async waitForCategoryChartToLoad() {
    logger.info('Waiting for category chart to load');
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000); // Wait for chart animation to complete
  }

  async getCategoryNames() {
    logger.info('Retrieving category names');
    await expect(this.categoryLabels.first()).toBeVisible({ timeout: 5000 });
    const count = await this.categoryLabels.count();
    const categories = [];
    
    for (let i = 0; i < count; i++) {
      const categoryText = await this.categoryLabels.nth(i).textContent();
      categories.push(categoryText.trim());
    }
    
    return categories;
  }

  async getCategorySpendingData() {
    logger.info('Retrieving category spending data');
    await expect(this.categoryLabels.first()).toBeVisible({ timeout: 5000 });
    const count = await this.categoryLabels.count();
    const categoryData = [];
    
    for (let i = 0; i < count; i++) {
      const labelElement = this.categoryLabels.nth(i);
      const labelText = await labelElement.textContent();
      
      // Extract category name, amount, and percentage
      const categoryMatch = labelText.match(/^([A-Za-z\s&]+?)(?:\s*[:$])/i);
      const amountMatch = labelText.match(/\$?([0-9,]+\.?[0-9]*)/i);
      const percentageMatch = labelText.match(/([0-9]+\.?[0-9]*)%/i);
      
      categoryData.push({
        category: categoryMatch ? categoryMatch[1].trim() : labelText.trim(),
        amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
        percentage: percentageMatch ? parseFloat(percentageMatch[1]) : 0
      });
    }
    
    return categoryData;
  }

  async selectCategoryFilter(categoryName) {
    logger.info(`Selecting category filter: ${categoryName}`);
    const checkbox = this.page.locator(`input[type="checkbox"][value="${categoryName}"], label:has-text("${categoryName}") input[type="checkbox"]`).first();
    await expect(checkbox).toBeVisible({ timeout: 5000 });
    await checkbox.check();
  }

  async applyFilter() {
    logger.info('Applying category filter');
    await expect(this.applyFilterButton).toBeVisible({ timeout: 5000 });
    await this.applyFilterButton.click();
  }

  async waitForChartUpdate() {
    logger.info('Waiting for chart to update after filter');
    await this.page.waitForTimeout(1500); // Wait for chart to re-render
    await this.page.waitForLoadState('networkidle');
  }

};