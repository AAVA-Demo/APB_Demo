const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Login locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    
    // Navigation
    this.analyticsNavLink = page.locator('[data-testid="nav-analytics"]');
    this.spendingAnalyticsTab = page.locator('[data-testid="tab-spending-analytics"]');
    this.monthlyTrendsTab = page.locator('[data-testid="tab-monthly-trends"]');
    
    // Category-wise spending locators
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.categoryList = page.locator('[data-testid="category-list"] .category-item');
    this.categoryAmount = (category) => page.locator(`[data-testid="category-${category.replace(/\s+/g, '-').toLowerCase()}-amount"]`);
    this.categoryPercentage = (category) => page.locator(`[data-testid="category-${category.replace(/\s+/g, '-').toLowerCase()}-percentage"]`);
    this.chartTooltip = page.locator('[data-testid="chart-tooltip"]');
    this.totalSpendDisplay = page.locator('[data-testid="total-spend"]');
    
    // Empty state
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"]');
    
    // Date range filter
    this.fromDateInput = page.locator('[data-testid="filter-from-date"]');
    this.toDateInput = page.locator('[data-testid="filter-to-date"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter-button"]');
    
    // Monthly trends locators
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"]');
    this.monthDataPoint = (month) => page.locator(`[data-testid="month-${month.replace(/\s+/g, '-').toLowerCase()}"]`);
    this.xAxisLabels = page.locator('[data-testid="x-axis-labels"]');
    this.yAxisLabels = page.locator('[data-testid="y-axis-labels"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.recommendationText = page.locator('[data-testid="recommendation-text"]');
    
    // Drill-down view
    this.drillDownView = page.locator('[data-testid="drill-down-view"]');
    this.drillDownTransactions = page.locator('[data-testid="drill-down-transactions"] .transaction-item');
    this.drillDownCategories = page.locator('[data-testid="drill-down-categories"]');
    this.drillDownTotal = page.locator('[data-testid="drill-down-total"]');
    this.topMerchantsList = page.locator('[data-testid="top-merchants-list"] .merchant-item');
    this.transactionCountDisplay = page.locator('[data-testid="transaction-count"]');
    this.backToTrendsButton = page.locator('[data-testid="back-to-trends-button"]');
    
    // Console error tracking
    this.consoleErrors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.page).toHaveTitle(/Credit Card Dashboard/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToSpendingAnalytics() {
    await this.analyticsNavLink.click();
    await this.spendingAnalyticsTab.click();
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
  }

  async navigateToMonthlyTrends() {
    await this.analyticsNavLink.click();
    await this.monthlyTrendsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryList() {
    await expect(this.categoryList.first()).toBeVisible();
    const categories = await this.categoryList.allTextContents();
    return categories;
  }

  async getCategoryAmount(category) {
    const locator = this.categoryAmount(category);
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }

  async getCategoryPercentage(category) {
    const locator = this.categoryPercentage(category);
    await expect(locator).toBeVisible();
    return await locator.textContent();
  }

  async getAllCategoryPercentages() {
    const percentages = [];
    const categories = await this.getCategoryList();
    for (const category of categories) {
      const percentage = await this.getCategoryPercentage(category);
      percentages.push(percentage.replace('%', ''));
    }
    return percentages;
  }

  async hoverOverCategory(category) {
    const categoryElement = this.page.locator(`[data-category="${category}"]`);
    await categoryElement.hover();
  }

  async isTooltipVisible() {
    return await this.chartTooltip.isVisible();
  }

  async getTooltipText() {
    await expect(this.chartTooltip).toBeVisible();
    return await this.chartTooltip.textContent();
  }

  async getTotalSpend() {
    await expect(this.totalSpendDisplay).toBeVisible();
    return await this.totalSpendDisplay.textContent();
  }

  async getEmptyStateMessage() {
    await expect(this.emptyStateMessage).toBeVisible();
    return await this.emptyStateMessage.textContent();
  }

  async isChartRendered() {
    return await this.categoryChart.isVisible();
  }

  async getConsoleErrors() {
    return this.consoleErrors;
  }

  async applyDateRangeFilter(fromDate, toDate) {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    await this.fromDateInput.fill(formatDate(fromDate));
    await this.toDateInput.fill(formatDate(toDate));
    await this.applyFilterButton.click();
  }

  async waitForChartUpdate() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async getMonthsDisplayed() {
    await expect(this.monthlyTrendsChart).toBeVisible();
    const months = await this.page.locator('[data-testid^="month-"]').allTextContents();
    return months;
  }

  async getMonthSpend(month) {
    const locator = this.monthDataPoint(month);
    await expect(locator).toBeVisible();
    return await locator.getAttribute('data-amount');
  }

  async hasXAxisLabels() {
    return await this.xAxisLabels.isVisible();
  }

  async hasYAxisLabels() {
    return await this.yAxisLabels.isVisible();
  }

  async clickMonth(month) {
    const locator = this.monthDataPoint(month);
    await locator.click();
  }

  async isDrillDownViewVisible() {
    return await this.drillDownView.isVisible();
  }

  async getDrillDownTransactions() {
    await expect(this.drillDownTransactions.first()).toBeVisible();
    return await this.drillDownTransactions.count();
  }

  async getInsufficientDataMessage() {
    await expect(this.insufficientDataMessage).toBeVisible();
    return await this.insufficientDataMessage.textContent();
  }

  async isMonthlyTrendsChartRendered() {
    return await this.monthlyTrendsChart.isVisible();
  }

  async getRecommendationText() {
    await expect(this.recommendationText).toBeVisible();
    return await this.recommendationText.textContent();
  }

  async getDrillDownCategories() {
    await expect(this.drillDownCategories).toBeVisible();
    const categoryElements = await this.drillDownCategories.locator('.category-item').all();
    const categories = {};
    for (const element of categoryElements) {
      const name = await element.getAttribute('data-category-name');
      const amount = await element.getAttribute('data-category-amount');
      categories[name] = amount;
    }
    return categories;
  }

  async getDrillDownTotal() {
    await expect(this.drillDownTotal).toBeVisible();
    return await this.drillDownTotal.textContent();
  }

  async getTopMerchants() {
    await expect(this.topMerchantsList.first()).toBeVisible();
    const merchantElements = await this.topMerchantsList.all();
    const merchants = [];
    for (const element of merchantElements) {
      const name = await element.getAttribute('data-merchant-name');
      const amount = await element.getAttribute('data-merchant-amount');
      merchants.push({ name, amount });
    }
    return merchants;
  }

  async getTransactionCount() {
    await expect(this.transactionCountDisplay).toBeVisible();
    const text = await this.transactionCountDisplay.textContent();
    return parseInt(text.match(/\d+/)[0]);
  }

  async clickBackToTrends() {
    await this.backToTrendsButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};