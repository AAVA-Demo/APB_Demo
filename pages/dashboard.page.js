const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Card Locators
    this.monthlySpendCard = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitCard = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditCard = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountCard = page.locator('[data-testid="kpi-outstanding-amount"]');
    
    // KPI Value Locators
    this.monthlySpendValue = page.locator('[data-testid="kpi-monthly-spend-value"]');
    this.totalCreditLimitValue = page.locator('[data-testid="kpi-total-credit-limit-value"]');
    this.availableCreditValue = page.locator('[data-testid="kpi-available-credit-value"]');
    this.outstandingAmountValue = page.locator('[data-testid="kpi-outstanding-amount-value"]');
    
    // Navigation Locators
    this.analyticsMenu = page.locator('[data-testid="menu-analytics"]');
    this.monthlyTrendsMenuItem = page.locator('[data-testid="menu-monthly-trends"]');
    this.spendingAnalyticsMenuItem = page.locator('[data-testid="menu-spending-analytics"]');
    
    // Monthly Trend Chart Locators
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.monthlyTrendLabels = page.locator('[data-testid="trend-month-label"]');
    this.monthlyTrendValues = page.locator('[data-testid="trend-month-value"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.monthDrillDownPanel = page.locator('[data-testid="month-drill-down-panel"]');
    this.categoryBreakdownSection = page.locator('[data-testid="category-breakdown-section"]');
    this.trendTooltip = page.locator('[data-testid="trend-tooltip"]');
    
    // Category Chart Locators
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.categoryDrillDownPanel = page.locator('[data-testid="category-drill-down-panel"]');
    this.categoryTransactionList = page.locator('[data-testid="category-transaction-list"]');
    this.insufficientSubCategoryMessage = page.locator('[data-testid="insufficient-subcategory-message"]');
    
    // Filter Locators
    this.dateRangeFilter = page.locator('[data-testid="filter-date-range"]');
    this.cardTypeFilter = page.locator('[data-testid="filter-card-type"]');
    this.dateFromInput = page.locator('[data-testid="date-from-input"]');
    this.dateToInput = page.locator('[data-testid="date-to-input"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    
    // Refresh Indicator
    this.refreshIndicator = page.locator('[data-testid="refresh-indicator"]');
  }
  
  async navigate() {
    Logger.info('Navigating to dashboard');
    await this.page.goto('/dashboard');
    await expect(this.monthlySpendCard).toBeVisible({ timeout: 10000 });
  }
  
  async getMonthlySpendValue() {
    Logger.info('Getting Monthly Spend value');
    await expect(this.monthlySpendValue).toBeVisible();
    return await this.monthlySpendValue.textContent();
  }
  
  async getTotalCreditLimitValue() {
    Logger.info('Getting Total Credit Limit value');
    await expect(this.totalCreditLimitValue).toBeVisible();
    return await this.totalCreditLimitValue.textContent();
  }
  
  async getAvailableCreditValue() {
    Logger.info('Getting Available Credit value');
    await expect(this.availableCreditValue).toBeVisible();
    return await this.availableCreditValue.textContent();
  }
  
  async getOutstandingAmountValue() {
    Logger.info('Getting Outstanding Amount value');
    await expect(this.outstandingAmountValue).toBeVisible();
    return await this.outstandingAmountValue.textContent();
  }
  
  async waitForKPIRefresh() {
    Logger.info('Waiting for KPI refresh');
    await this.page.waitForSelector('[data-testid="refresh-indicator"]', { state: 'visible', timeout: 30000 });
    await this.page.waitForSelector('[data-testid="refresh-indicator"]', { state: 'hidden', timeout: 30000 });
  }
  
  async navigateToMonthlyTrends() {
    Logger.info('Navigating to Monthly Trends');
    await this.analyticsMenu.click();
    await this.monthlyTrendsMenuItem.click();
    await expect(this.monthlyTrendChart).toBeVisible({ timeout: 10000 });
  }
  
  async navigateToSpendingAnalytics() {
    Logger.info('Navigating to Spending Analytics');
    await this.analyticsMenu.click();
    await this.spendingAnalyticsMenuItem.click();
    await expect(this.categoryChart).toBeVisible({ timeout: 10000 });
  }
  
  async getMonthlyTrendLabels() {
    Logger.info('Getting monthly trend labels');
    await expect(this.monthlyTrendLabels.first()).toBeVisible();
    return await this.monthlyTrendLabels.allTextContents();
  }
  
  async getMonthlyTrendValues() {
    Logger.info('Getting monthly trend values');
    await expect(this.monthlyTrendValues.first()).toBeVisible();
    return await this.monthlyTrendValues.allTextContents();
  }
  
  async clickMonthlyTrendMonth(monthName) {
    Logger.info(`Clicking on month: ${monthName}`);
    const monthLabel = this.page.locator(`[data-testid="trend-month-label"][data-month="${monthName}"]`);
    await expect(monthLabel).toBeVisible();
    await monthLabel.click();
  }
  
  async getDrillDownTransactions() {
    Logger.info('Getting drill-down transactions');
    await expect(this.monthDrillDownPanel).toBeVisible();
    const transactionRows = this.page.locator('[data-testid="drill-down-transaction-row"]');
    const count = await transactionRows.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = transactionRows.nth(i);
      const date = await row.locator('[data-testid="transaction-date"]').textContent();
      const merchant = await row.locator('[data-testid="transaction-merchant"]').textContent();
      const amount = await row.locator('[data-testid="transaction-amount"]').textContent();
      const category = await row.locator('[data-testid="transaction-category"]').textContent();
      
      transactions.push({ date, merchant, amount, category });
    }
    
    return transactions;
  }
  
  async clickCategoryInChart(categoryName) {
    Logger.info(`Clicking on category: ${categoryName}`);
    const categorySegment = this.page.locator(`[data-testid="category-segment"][data-category="${categoryName}"]`);
    await expect(categorySegment).toBeVisible();
    await categorySegment.click();
  }
  
  async getCategoryTransactions() {
    Logger.info('Getting category transactions');
    await expect(this.categoryTransactionList).toBeVisible();
    const transactionRows = this.page.locator('[data-testid="category-transaction-row"]');
    const count = await transactionRows.count();
    const transactions = [];
    
    for (let i = 0; i < count; i++) {
      const row = transactionRows.nth(i);
      const date = await row.locator('[data-testid="transaction-date"]').textContent();
      const merchant = await row.locator('[data-testid="transaction-merchant"]').textContent();
      const amount = await row.locator('[data-testid="transaction-amount"]').textContent();
      const category = await row.locator('[data-testid="transaction-category"]').textContent();
      
      transactions.push({ date, merchant, amount, category });
    }
    
    return transactions;
  }
  
  async applyDateRangeFilter(dateFrom, dateTo) {
    Logger.info(`Applying date range filter: ${dateFrom} to ${dateTo}`);
    await expect(this.dateFromInput).toBeVisible();
    await this.dateFromInput.fill(dateFrom);
    await this.dateToInput.fill(dateTo);
    await this.applyFilterButton.click();
    await this.page.waitForTimeout(1000);
  }
};