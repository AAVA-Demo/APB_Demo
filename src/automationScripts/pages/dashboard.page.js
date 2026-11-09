const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Dashboard KPI locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"], .kpi-card:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"], .kpi-card:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"], .kpi-card:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"], .kpi-card:has-text("Outstanding Amount")');
    
    // Navigation locators
    this.dashboardNav = page.locator('a[href*="dashboard"], nav >> text=Dashboard');
    this.cardsNav = page.locator('a[href*="cards"], nav >> text=My Cards');
    this.analyticsNav = page.locator('a[href*="analytics"], nav >> text=Analytics');
    
    // Card Management locators
    this.cardList = page.locator('[data-testid="card-list"], .card-item');
    this.cardAnalysisView = page.locator('[data-testid="card-analysis-view"], .card-details');
    this.emptyPortfolioMessage = page.locator('[data-testid="empty-portfolio"], .empty-state');
    
    // Analytics locators
    this.categoryVisualization = page.locator('[data-testid="category-chart"], canvas, .chart-container');
    this.detailView = page.locator('[data-testid="detail-view"], .category-detail');
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-item');
    this.chartErrorState = page.locator('[data-testid="chart-error"], .error-state');
    
    // Error and message locators
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-danger');
    this.validationError = page.locator('[data-testid="validation-error"], .validation-error');
    this.loadingSpinner = page.locator('[data-testid="loading"], .loading-spinner, .spinner');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  // Navigation methods
  async navigateToKPISection() {
    await this.dashboardNav.click();
    await expect(this.monthlySpendKPI).toBeVisible();
  }

  async navigateToCardManagement() {
    await this.cardsNav.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    await this.analyticsNav.click();
    await this.page.waitForLoadState('networkidle');
  }

  // KPI methods
  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return text.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.locator('.kpi-value, [data-testid="kpi-value"]').textContent();
    return text.trim();
  }

  async getKPIErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  // Card Management methods
  async getCardCount() {
    const cards = await this.cardList.all();
    return cards.length;
  }

  async getCardDetails(index) {
    const card = this.cardList.nth(index);
    await expect(card).toBeVisible();
    
    const cardNumber = await card.locator('.card-number, [data-testid="card-number"]').textContent();
    const cardType = await card.locator('.card-type, [data-testid="card-type"]').textContent();
    const balance = await card.locator('.balance, [data-testid="balance"]').textContent();
    const limit = await card.locator('.limit, [data-testid="limit"]').textContent();
    
    return {
      cardNumber: cardNumber.trim(),
      cardType: cardType.trim(),
      balance: balance.trim(),
      limit: limit.trim()
    };
  }

  async selectCard(index) {
    const card = this.cardList.nth(index);
    await card.click();
    await this.page.waitForLoadState('networkidle');
  }

  async attemptSelectInvalidCard(cardId) {
    // Attempt to navigate to invalid card URL or trigger invalid card selection
    await this.page.goto(`https://creditcard-dashboard.example.com/cards/${cardId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async getEmptyPortfolioMessage() {
    await expect(this.emptyPortfolioMessage).toBeVisible();
    return await this.emptyPortfolioMessage.textContent();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getValidationErrorMessage() {
    await expect(this.validationError).toBeVisible();
    return await this.validationError.textContent();
  }

  // Card Analysis methods
  async getSpendingBreakdown() {
    await expect(this.cardAnalysisView).toBeVisible();
    
    const totalSpend = await this.cardAnalysisView.locator('[data-testid="total-spend"], .total-spend').textContent();
    const currentMonthSpend = await this.cardAnalysisView.locator('[data-testid="current-month-spend"], .current-month-spend').textContent();
    const availableCredit = await this.cardAnalysisView.locator('[data-testid="available-credit"], .available-credit').textContent();
    const outstandingAmount = await this.cardAnalysisView.locator('[data-testid="outstanding-amount"], .outstanding-amount').textContent().catch(() => '$0.00');
    
    return {
      totalSpend: totalSpend.trim(),
      currentMonthSpend: currentMonthSpend.trim(),
      availableCredit: availableCredit.trim(),
      outstandingAmount: outstandingAmount.trim()
    };
  }

  async getMonthlyTrends() {
    const trendItems = await this.cardAnalysisView.locator('[data-testid="trend-item"], .trend-item').all();
    const trends = [];
    
    for (const item of trendItems) {
      const month = await item.locator('.month, [data-testid="month"]').textContent();
      const amount = await item.locator('.amount, [data-testid="amount"]').textContent();
      trends.push({ month: month.trim(), amount: amount.trim() });
    }
    
    return trends;
  }

  async getUtilizationPercentage() {
    await expect(this.cardAnalysisView).toBeVisible();
    const utilization = await this.cardAnalysisView.locator('[data-testid="utilization"], .utilization').textContent();
    return utilization.trim();
  }

  async getTrendsMessage() {
    const message = await this.cardAnalysisView.locator('[data-testid="trends-message"], .empty-trends-message').textContent();
    return message.trim();
  }

  async hasEmptyTrendsChart() {
    const emptyChart = await this.cardAnalysisView.locator('[data-testid="empty-chart"], .empty-chart').isVisible().catch(() => false);
    return emptyChart;
  }

  // Analytics methods
  async getAllCategories() {
    const categoryElements = await this.page.locator('[data-testid="category-label"], .category-label').all();
    const categories = [];
    
    for (const element of categoryElements) {
      const text = await element.textContent();
      categories.push(text.trim());
    }
    
    return categories;
  }

  async getCategoryAmounts() {
    const amounts = {};
    const categories = await this.getAllCategories();
    
    for (const category of categories) {
      const amount = await this.getCategoryAmount(category);
      amounts[category] = amount;
    }
    
    return amounts;
  }

  async getCategoryAmount(category) {
    const categoryElement = this.page.locator(`[data-category="${category}"], .category-item:has-text("${category}")`).first();
    const amount = await categoryElement.locator('[data-testid="category-amount"], .category-amount').textContent();
    return amount.trim();
  }

  async getCategoryPercentages() {
    const percentages = {};
    const categories = await this.getAllCategories();
    
    for (const category of categories) {
      const percentage = await this.getCategoryPercentage(category);
      percentages[category] = percentage;
    }
    
    return percentages;
  }

  async getCategoryPercentage(category) {
    const categoryElement = this.page.locator(`[data-category="${category}"], .category-item:has-text("${category}")`).first();
    const percentage = await categoryElement.locator('[data-testid="category-percentage"], .category-percentage').textContent();
    return percentage.trim();
  }

  async getChartType() {
    const isPieChart = await this.page.locator('canvas[id*="pie"], .pie-chart').isVisible().catch(() => false);
    const isBarChart = await this.page.locator('canvas[id*="bar"], .bar-chart').isVisible().catch(() => false);
    return isPieChart || isBarChart;
  }

  async getTransactionCount() {
    const countElement = await this.page.locator('[data-testid="transaction-count"], .transaction-count').textContent().catch(() => '0');
    return parseInt(countElement.trim());
  }

  async getEmptyAnalyticsMessage() {
    const message = await this.page.locator('[data-testid="empty-analytics"], .empty-analytics-message').textContent();
    return message.trim();
  }

  // Interactive Chart methods
  async clickCategorySegment(category) {
    const segment = this.page.locator(`[data-category="${category}"], .category-segment:has-text("${category}")`).first();
    await segment.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryMonthlyTrends() {
    await expect(this.detailView).toBeVisible();
    const trendItems = await this.detailView.locator('[data-testid="monthly-trend"], .monthly-trend-item').all();
    const trends = [];
    
    for (const item of trendItems) {
      const month = await item.locator('.month, [data-testid="trend-month"]').textContent();
      const amount = await item.locator('.amount, [data-testid="trend-amount"]').textContent();
      trends.push({ month: month.trim(), amount: amount.trim() });
    }
    
    return trends;
  }

  async getCategoryTransactions() {
    await expect(this.detailView).toBeVisible();
    const transactionItems = await this.transactionList.all();
    const transactions = [];
    
    for (const item of transactionItems) {
      const date = await item.locator('[data-testid="txn-date"], .transaction-date').textContent();
      const merchant = await item.locator('[data-testid="txn-merchant"], .merchant').textContent();
      const amount = await item.locator('[data-testid="txn-amount"], .amount').textContent();
      const description = await item.locator('[data-testid="txn-description"], .description').textContent();
      
      transactions.push({
        date: date.trim(),
        merchant: merchant.trim(),
        amount: amount.trim(),
        description: description.trim()
      });
    }
    
    return transactions;
  }

  async getCategoryEmptyMessage() {
    const message = await this.detailView.locator('[data-testid="empty-category"], .empty-category-message').textContent();
    return message.trim();
  }

  async getChartErrorMessage() {
    await expect(this.chartErrorState).toBeVisible();
    return await this.chartErrorState.textContent();
  }

  async isChartInteractive() {
    const isDisabled = await this.categoryVisualization.getAttribute('disabled');
    const hasDisabledClass = await this.categoryVisualization.getAttribute('class').then(cls => cls.includes('disabled')).catch(() => false);
    return !isDisabled && !hasDisabledClass;
  }
};