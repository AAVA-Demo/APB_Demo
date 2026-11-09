const { expect } = require('@playwright/test');
const { Logger } = require('../../utils/logger');
const config = require('../../data/config.json');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger('AnalyticsPage');
    
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    this.analyticsContainer = page.locator('.analytics-container');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    
    this.categoryLabels = page.locator('[data-testid="category-label"]');
    this.categoryAmounts = page.locator('[data-testid="category-amount"]');
    
    this.transactionDetailView = page.locator('[data-testid="transaction-detail-view"]');
    this.transactionList = page.locator('[data-testid="transaction-item"]');
    this.transactionTotal = page.locator('[data-testid="transaction-total"]');
    
    this.monthLabels = page.locator('[data-testid="month-label"]');
    this.monthlyAmounts = page.locator('[data-testid="monthly-amount"]');
    
    this.monthlyTransactionView = page.locator('[data-testid="monthly-transaction-view"]');
    this.monthlyTransactions = page.locator('[data-testid="monthly-transaction-item"]');
    this.monthlyTransactionTotal = page.locator('[data-testid="monthly-transaction-total"]');
    
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    
    this.trendAnalysisTab = page.locator('[data-testid="trend-analysis-tab"]');
  }

  async navigate() {
    this.logger.info(`Navigating to analytics: ${config.baseURL}/analytics`);
    await this.page.goto(`${config.baseURL}/analytics`);
    await this.page.waitForLoadState('networkidle');
  }

  async loginAndNavigate(username, password) {
    this.logger.info(`Logging in as user: ${username} and navigating to analytics`);
    await this.page.goto(`${config.baseURL}/login`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.navigate();
  }

  async waitForAnalyticsDashboardLoad() {
    this.logger.info('Waiting for analytics dashboard to load');
    await expect(this.analyticsContainer).toBeVisible({ timeout: 5000 });
    await expect(this.categoryChart).toBeVisible();
  }

  async getAllCategoryLabels() {
    await expect(this.categoryLabels.first()).toBeVisible();
    const labels = await this.categoryLabels.allTextContents();
    this.logger.info(`Found ${labels.length} categories`);
    return labels.map(l => l.trim());
  }

  async getCategorySpendingAmounts() {
    await expect(this.categoryLabels.first()).toBeVisible();
    const labels = await this.categoryLabels.allTextContents();
    const amounts = await this.categoryAmounts.allTextContents();
    
    const categoryMap = {};
    for (let i = 0; i < labels.length; i++) {
      categoryMap[labels[i].trim()] = amounts[i].trim();
    }
    
    this.logger.info(`Category spending: ${JSON.stringify(categoryMap)}`);
    return categoryMap;
  }

  async isChartInteractive() {
    const chartElement = await this.categoryChart.elementHandle();
    const hasClickHandler = await chartElement.evaluate(el => {
      return el.onclick !== null || el.addEventListener !== undefined;
    });
    return hasClickHandler;
  }

  async getVisibleCategories() {
    const allLabels = await this.getAllCategoryLabels();
    const amounts = await this.getCategorySpendingAmounts();
    
    const visibleCategories = allLabels.filter(label => {
      const amount = amounts[label];
      return amount && amount !== '$0.00' && amount !== '';
    });
    
    this.logger.info(`Visible categories: ${visibleCategories.join(', ')}`);
    return visibleCategories;
  }

  async clickCategory(categoryName) {
    this.logger.info(`Clicking on category: ${categoryName}`);
    const categoryElement = this.page.locator(`[data-testid="category-label"]:has-text("${categoryName}")`);
    await expect(categoryElement).toBeVisible();
    await categoryElement.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getTransactionList() {
    await expect(this.transactionList.first()).toBeVisible();
    const count = await this.transactionList.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.transactionList.nth(i);
      const merchant = await item.locator('[data-testid="transaction-merchant"]').textContent();
      const amount = await item.locator('[data-testid="transaction-amount"]').textContent();
      const date = await item.locator('[data-testid="transaction-date"]').textContent();
      
      transactions.push({
        merchant: merchant.trim(),
        amount: amount.trim(),
        date: date.trim()
      });
    }
    
    this.logger.info(`Found ${transactions.length} transactions`);
    return transactions;
  }

  async getTransactionTotal() {
    await expect(this.transactionTotal).toBeVisible();
    const total = await this.transactionTotal.textContent();
    this.logger.info(`Transaction total: ${total}`);
    return total.trim();
  }

  async navigateToTrendAnalysis() {
    this.logger.info('Navigating to trend analysis section');
    await this.trendAnalysisTab.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.monthlyTrendChart).toBeVisible();
  }

  async getMonthLabels() {
    await expect(this.monthLabels.first()).toBeVisible();
    const labels = await this.monthLabels.allTextContents();
    this.logger.info(`Found ${labels.length} months`);
    return labels.map(l => l.trim());
  }

  async getMonthlySpendingAmounts() {
    await expect(this.monthLabels.first()).toBeVisible();
    const labels = await this.monthLabels.allTextContents();
    const amounts = await this.monthlyAmounts.allTextContents();
    
    const monthlyMap = {};
    for (let i = 0; i < labels.length; i++) {
      monthlyMap[labels[i].trim()] = amounts[i].trim();
    }
    
    this.logger.info(`Monthly spending: ${JSON.stringify(monthlyMap)}`);
    return monthlyMap;
  }

  async verifyChartTooltips() {
    const chartElement = await this.monthlyTrendChart.elementHandle();
    await chartElement.hover();
    await this.page.waitForTimeout(500);
    
    const tooltipVisible = await this.page.locator('[data-testid="chart-tooltip"]').isVisible();
    return tooltipVisible;
  }

  async clickMonth(monthName) {
    this.logger.info(`Clicking on month: ${monthName}`);
    const monthElement = this.page.locator(`[data-testid="month-label"]:has-text("${monthName}")`);
    await expect(monthElement).toBeVisible();
    await monthElement.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlyTransactions() {
    await expect(this.monthlyTransactions.first()).toBeVisible();
    const count = await this.monthlyTransactions.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.monthlyTransactions.nth(i);
      const merchant = await item.locator('[data-testid="transaction-merchant"]').textContent();
      const amount = await item.locator('[data-testid="transaction-amount"]').textContent();
      const date = await item.locator('[data-testid="transaction-date"]').textContent();
      
      transactions.push({
        merchant: merchant.trim(),
        amount: amount.trim(),
        date: date.trim()
      });
    }
    
    this.logger.info(`Found ${transactions.length} monthly transactions`);
    return transactions;
  }

  async getMonthlyTransactionTotal() {
    await expect(this.monthlyTransactionTotal).toBeVisible();
    const total = await this.monthlyTransactionTotal.textContent();
    this.logger.info(`Monthly transaction total: ${total}`);
    return total.trim();
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    const message = await this.insufficientDataMessage.textContent();
    this.logger.info(`Insufficient data message: ${message}`);
    return message.trim();
  }
};
